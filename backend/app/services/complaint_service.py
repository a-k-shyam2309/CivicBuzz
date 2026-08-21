"""
CivicBuzz Complaint Orchestration Service
Coordinates full pipeline: geocoding, AI triage, duplicate clustering, priority calculation, and storage.
"""

import random
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from motor.motor_asyncio import AsyncIOMotorDatabase
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.exceptions import EntityNotFoundException, UnauthorizedException
from app.models.sql.user import User, UserRole
from app.models.mongo.complaint import ComplaintDocument, LocationData, GeoJSONPoint, EvidenceItem
from app.services.gemini_service import triage_complaint, verify_image_evidence
from app.services.location_service import resolve_location
from app.services.duplicate_service import check_for_duplicates
from app.services.priority_service import calculate_priority_score
from app.services.audit_service import record_audit_event


def generate_complaint_id() -> str:
    """Generate human-friendly formatted complaint ID (e.g. CB-0145)."""
    num = random.randint(1000, 9999)
    return f"CB-{num}"


async def create_new_complaint(
    description: str,
    latitude: float,
    longitude: float,
    user: User,
    db: AsyncSession,
    mongo_db: AsyncIOMotorDatabase,
    location_source: str = "CURRENT_LOCATION",
    category_hint: Optional[str] = None,
    sub_category_hint: Optional[str] = None,
    language: str = "en",
    is_anonymous: bool = True,
    image_url: Optional[str] = None,
    audio_url: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Full complaint submission pipeline.
    """
    complaint_id = generate_complaint_id()
    now_iso = datetime.now(timezone.utc).isoformat()

    # 1. Spatial & Ward Resolution
    loc_resolved = await resolve_location(latitude, longitude, db)
    ward_id = loc_resolved["ward_id"]
    ward_name = loc_resolved["ward_name"]
    address = loc_resolved["address"]

    # 2. AI Grievance Triage (Gemini)
    ai_triage = await triage_complaint(description, language=language, location_text=f"{address}, {ward_name}")

    category = category_hint or ai_triage.get("category", "ROAD")
    sub_category = sub_category_hint or ai_triage.get("sub_category", "POTHOLE")
    severity = ai_triage.get("severity", "MEDIUM")
    recommended_dept = ai_triage.get("recommended_department", "ROADS_AND_POTHOLES")
    dept_display = ai_triage.get("department_display_name", "Roads & Potholes Department")

    # 3. Duplicate Detection & Clustering
    dup_info = await check_for_duplicates(
        new_description=description,
        new_category=category,
        latitude=latitude,
        longitude=longitude,
        mongo_db=mongo_db,
    )

    # 4. Multi-Factor Priority Calculation
    priority_info = calculate_priority_score(
        severity=severity,
        cluster_count=dup_info.get("cluster_count", 1),
        safety_risk_identified=ai_triage.get("safety_risk_identified", False),
        days_open=0,
        category=category,
    )

    user_id = getattr(user, "id", 1)
    user_name = getattr(user, "full_name", "Citizen Subham")
    user_email = getattr(user, "email", "citizen@civicbuzz.in")
    user_phone = getattr(user, "phone_number", None)
    user_role_raw = getattr(user, "role", "CITIZEN")
    user_role_str = user_role_raw.value if hasattr(user_role_raw, "value") else str(user_role_raw or "CITIZEN")

    # 5. Evidence Collection
    evidence_list = []
    if image_url:
        img_verify = await verify_image_evidence(image_url, category, description)
        evidence_list.append({
            "evidence_id": f"EVD-{complaint_id}-IMG",
            "evidence_type": "BEFORE_IMAGE",
            "file_url": image_url,
            "file_name": "complaint_photo.jpg",
            "file_size_bytes": 0,
            "mime_type": "image/jpeg",
            "file_hash": "",
            "uploaded_by": user_name,
            "uploader_role": user_role_str,
            "timestamp": now_iso,
            "verification_status": img_verify.get("verification_status", "VERIFIED"),
            "verification_notes": img_verify.get("notes", "Submitted by citizen"),
        })

    if audio_url:
        evidence_list.append({
            "evidence_id": f"EVD-{complaint_id}-AUD",
            "evidence_type": "AUDIO_NOTE",
            "file_url": audio_url,
            "file_name": "voice_note.webm",
            "file_size_bytes": 0,
            "mime_type": "audio/webm",
            "file_hash": "",
            "uploaded_by": user_name,
            "uploader_role": user_role_str,
            "timestamp": now_iso,
            "verification_status": "VERIFIED",
            "verification_notes": "Citizen voice input",
        })

    # 6. Initial Timeline
    timeline = [
        {
            "step": "Complaint Submitted",
            "status": "SUBMITTED",
            "timestamp": now_iso,
            "actor_role": "CITIZEN",
            "notes": "Complaint filed with location coordinates & evidence.",
        },
        {
            "step": "AI Triage & Routing",
            "status": "ASSIGNED",
            "timestamp": now_iso,
            "actor_role": "AI_SYSTEM",
            "notes": f"Classified as {category} ({severity} severity). Auto-routed to {dept_display}.",
        },
    ]

    title = f"{sub_category.replace('_', ' ').capitalize()} near {ward_name}"

    complaint_doc = {
        "complaint_id": complaint_id,
        "user_id": user_id,
        "complainant_name": user_name,
        "complainant_email": user_email,
        "complainant_phone": user_phone,
        "is_anonymous": is_anonymous,
        "title": title,
        "description": description,
        "category": category,
        "sub_category": sub_category,
        "language": language,
        "location": {
            "latitude": latitude,
            "longitude": longitude,
            "address": address,
            "city": loc_resolved["city"],
            "municipality": loc_resolved["municipality"],
            "ward_id": ward_id,
            "ward_name": ward_name,
            "source": location_source,
            "location_confidence": loc_resolved["location_confidence"],
        },
        "location_point": {
            "type": "Point",
            "coordinates": [longitude, latitude],
        },
        "status": "ASSIGNED",
        "department_code": recommended_dept,
        "department_name": dept_display,
        "severity": severity,
        "priority": priority_info,
        "ai_analysis": ai_triage,
        "duplicate_info": dup_info,
        "evidence": evidence_list,
        "timeline": timeline,
        "citizen_confirmed_resolved": False,
        "dispute_reason": None,
        "qr_code_url": None,
        "created_at": now_iso,
        "updated_at": now_iso,
    }

    await mongo_db.complaints.insert_one(complaint_doc)

    # 7. Record Audit Log
    await record_audit_event(
        mongo_db=mongo_db,
        action="COMPLAINT_CREATED",
        entity_type="COMPLAINT",
        entity_id=complaint_id,
        actor_id=str(user.id),
        actor_role=user.role.value,
        metadata={"category": category, "ward": ward_name, "priority": priority_info["level"]},
    )

    return complaint_doc


async def get_complaint_by_id(
    complaint_id: str,
    mongo_db: AsyncIOMotorDatabase,
    current_user: Optional[User] = None,
) -> Dict[str, Any]:
    """
    Fetch complaint by ID. If user is unauthorized or complaint is anonymous,
    strips private identity fields according to the Privacy Model (Requirements 17 & 18).
    """
    doc = await mongo_db.complaints.find_one({"complaint_id": complaint_id})
    if not doc:
        raise EntityNotFoundException("Complaint", complaint_id)

    doc_copy = dict(doc)
    doc_copy.pop("_id", None)

    # Privacy filtering: Check if requester is owner, admin, or officer
    is_owner = current_user and current_user.id == doc_copy.get("user_id")
    is_privileged = current_user and current_user.role in [
        UserRole.ADMIN,
        UserRole.SUPER_ADMIN,
        UserRole.DEPARTMENT_HEAD,
        UserRole.OFFICER,
    ]

    if not is_owner and not is_privileged:
        if doc_copy.get("is_anonymous", True):
            doc_copy["complainant_name"] = "Anonymous Citizen"
            doc_copy["complainant_email"] = None
            doc_copy["complainant_phone"] = None

    return doc_copy
