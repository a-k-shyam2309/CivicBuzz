"""
CivicBuzz Complaints API Router
Handles full complaint submission, spatial searches, privacy filtering,
and citizen-verified resolution lifecycle.
"""

from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.dependencies import get_current_user, get_optional_user, get_db, get_mongo_db, require_officer
from app.core.exceptions import EntityNotFoundException, UnauthorizedException
from app.models.sql.user import User, UserRole
from app.schemas.common import APIResponse, PaginatedResponse
from app.schemas.complaint import (
    ComplaintCreateRequest,
    ComplaintDetailResponse,
    ComplaintStatusUpdateRequest,
    ComplaintAssignRequest,
    CitizenDisputeRequest,
)
from app.services.complaint_service import (
    create_new_complaint,
    get_complaint_by_id,
)
from app.services.resolution_service import (
    submit_department_resolution_evidence,
    verify_citizen_resolution,
    reject_citizen_resolution,
)
from app.services.maps_service import calculate_haversine_distance

router = APIRouter(prefix="/complaints", tags=["Complaints"])


@router.post("", response_model=APIResponse[Dict[str, Any]], status_code=status.HTTP_201_CREATED)
async def create_complaint(
    payload: ComplaintCreateRequest,
    current_user: Optional[User] = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db),
    mongo_db: AsyncIOMotorDatabase = Depends(get_mongo_db),
):
    """
    Submit a new civic grievance.
    Executes AI triage, reverse geocoding, duplicate clustering, priority calculation, and initial assignment.
    """
    # Create or use fallback demo user if submitted anonymously without JWT token
    user = current_user
    if not user:
        # Fetch or use default citizen
        from sqlalchemy import select
        stmt = select(User).where(User.email == "citizen@civicbuzz.in")
        res = await db.execute(stmt)
        user = res.scalar_one_or_none()
        if not user:
            user = User(
                id=999,
                user_uid="USR-ANON",
                email="anonymous@civicbuzz.in",
                full_name="Anonymous Citizen",
                role=UserRole.CITIZEN,
                hashed_password="",
            )

    doc = await create_new_complaint(
        description=payload.description,
        latitude=payload.latitude,
        longitude=payload.longitude,
        user=user,
        db=db,
        mongo_db=mongo_db,
        location_source=payload.location_source,
        category_hint=payload.category,
        sub_category_hint=payload.sub_category,
        language=payload.language,
        is_anonymous=payload.is_anonymous,
        image_url=payload.image_url,
        audio_url=payload.audio_url,
    )
    doc_copy = dict(doc)
    doc_copy.pop("_id", None)
    return APIResponse(
        message="Complaint submitted successfully. AI triage has categorized and routed your grievance.",
        data=doc_copy,
    )


@router.get("", response_model=APIResponse[List[Dict[str, Any]]])
async def list_complaints(
    category: Optional[str] = None,
    ward_id: Optional[int] = None,
    status: Optional[str] = None,
    department_code: Optional[str] = None,
    priority: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = Query(50, ge=1, le=200),
    skip: int = Query(0, ge=0),
    current_user: Optional[User] = Depends(get_optional_user),
    mongo_db: AsyncIOMotorDatabase = Depends(get_mongo_db),
):
    """
    List civic grievances with filtering support.
    Sanitizes privacy for public/anonymous records.
    """
    query: Dict[str, Any] = {}
    if category:
        query["category"] = category.upper()
    if ward_id:
        query["location.ward_id"] = ward_id
    if status:
        query["status"] = status.upper()
    if department_code:
        query["department_code"] = department_code.upper()
    if priority:
        query["priority.level"] = priority.upper()
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}},
            {"complaint_id": {"$regex": search, "$options": "i"}},
        ]

    cursor = mongo_db.complaints.find(query).sort("created_at", -1).skip(skip).limit(limit)
    docs = await cursor.to_list(length=limit)

    is_privileged = current_user and current_user.role in [
        UserRole.ADMIN,
        UserRole.SUPER_ADMIN,
        UserRole.DEPARTMENT_HEAD,
        UserRole.OFFICER,
    ]

    results = []
    for d in docs:
        d_copy = dict(d)
        d_copy.pop("_id", None)
        if not is_privileged and (not current_user or current_user.id != d_copy.get("user_id")):
            if d_copy.get("is_anonymous", True):
                d_copy["complainant_name"] = "Anonymous Citizen"
                d_copy["complainant_email"] = None
                d_copy["complainant_phone"] = None
        results.append(d_copy)

    return APIResponse(data=results)


@router.get("/my/list", response_model=APIResponse[List[Dict[str, Any]]])
async def get_my_complaints(
    current_user: User = Depends(get_current_user),
    mongo_db: AsyncIOMotorDatabase = Depends(get_mongo_db),
):
    """Fetch all complaints submitted by the authenticated citizen."""
    cursor = mongo_db.complaints.find({"user_id": current_user.id}).sort("created_at", -1)
    results = await cursor.to_list(length=100)
    for r in results:
        r.pop("_id", None)
    return APIResponse(data=results)


@router.get("/nearby/search", response_model=APIResponse[List[Dict[str, Any]]])
async def get_nearby_complaints(
    lat: float = Query(..., ge=-90.0, le=90.0),
    lng: float = Query(..., ge=-180.0, le=180.0),
    radius_meters: float = Query(1000.0, ge=50.0, le=50000.0),
    category: Optional[str] = None,
    mongo_db: AsyncIOMotorDatabase = Depends(get_mongo_db),
):
    """
    Search active civic complaints within a given radius in meters around coordinates.
    """
    query: Dict[str, Any] = {"status": {"$ne": "CLOSED"}}
    if category:
        query["category"] = category.upper()

    cursor = mongo_db.complaints.find(query).limit(100)
    all_docs = await cursor.to_list(length=100)

    nearby = []
    for doc in all_docs:
        loc = doc.get("location", {})
        doc_lat = loc.get("latitude")
        doc_lng = loc.get("longitude")
        if doc_lat is not None and doc_lng is not None:
            dist = calculate_haversine_distance(lat, lng, float(doc_lat), float(doc_lng))
            if dist <= radius_meters:
                doc_copy = dict(doc)
                doc_copy.pop("_id", None)
                doc_copy["distance_meters"] = round(dist, 1)
                # Privacy sanitization for public nearby view
                if doc_copy.get("is_anonymous", True):
                    doc_copy["complainant_name"] = "Anonymous Citizen"
                    doc_copy["complainant_email"] = None
                    doc_copy["complainant_phone"] = None
                nearby.append(doc_copy)

    nearby.sort(key=lambda x: x["distance_meters"])
    return APIResponse(data=nearby)


@router.get("/{complaint_id}", response_model=APIResponse[Dict[str, Any]])
async def get_complaint_detail(
    complaint_id: str,
    current_user: Optional[User] = Depends(get_optional_user),
    mongo_db: AsyncIOMotorDatabase = Depends(get_mongo_db),
):
    """Fetch complaint details with privacy sanitization."""
    doc = await get_complaint_by_id(complaint_id, mongo_db, current_user)
    return APIResponse(data=doc)


@router.post("/{complaint_id}/upvote", response_model=APIResponse[Dict[str, Any]])
async def upvote_complaint(
    complaint_id: str,
    current_user: Optional[User] = Depends(get_optional_user),
    mongo_db: AsyncIOMotorDatabase = Depends(get_mongo_db),
):
    """
    Increment community upvotes for a civic grievance and boost priority calculation.
    """
    doc = await mongo_db.complaints.find_one({"complaint_id": complaint_id})
    if not doc:
        raise EntityNotFoundException("Complaint", complaint_id)

    user_uid = current_user.user_uid if current_user else "ANON_CITIZEN"
    voters = doc.get("upvoted_by", [])

    if user_uid in voters and user_uid != "ANON_CITIZEN":
        new_count = max(1, doc.get("upvotes", 1) - 1)
        await mongo_db.complaints.update_one(
            {"complaint_id": complaint_id},
            {"$set": {"upvotes": new_count}, "$pull": {"upvoted_by": user_uid}}
        )
        return APIResponse(
            message="Upvote removed.",
            data={"complaint_id": complaint_id, "upvotes": new_count, "voted": False}
        )

    new_count = doc.get("upvotes", 1) + 1
    current_urgency = doc.get("urgency_score") or doc.get("priority", {}).get("score", 75)
    new_urgency = min(100, current_urgency + 2)

    await mongo_db.complaints.update_one(
        {"complaint_id": complaint_id},
        {
            "$set": {"upvotes": new_count, "urgency_score": new_urgency},
            "$addToSet": {"upvoted_by": user_uid}
        }
    )
    return APIResponse(
        message=f"Complaint #{complaint_id} upvoted successfully.",
        data={"complaint_id": complaint_id, "upvotes": new_count, "urgency_score": new_urgency, "voted": True}
    )


@router.patch("/{complaint_id}", response_model=APIResponse[Dict[str, Any]])
async def update_complaint(
    complaint_id: str,
    payload: ComplaintStatusUpdateRequest,
    current_user: User = Depends(require_officer),
    mongo_db: AsyncIOMotorDatabase = Depends(get_mongo_db),
):
    """
    Update complaint status or add officer progress notes.
    CRITICAL RULE: Officers/Departments CANNOT directly mark as RESOLVED.
    """
    new_status = payload.status.upper() if payload.status else None

    if new_status == "RESOLVED":
        raise UnauthorizedException(
            "Departments and Officers cannot mark complaints as RESOLVED. "
            "Please use /submit-resolution to mark work completed; the citizen must verify resolution."
        )

    doc = await mongo_db.complaints.find_one({"complaint_id": complaint_id})
    if not doc:
        raise EntityNotFoundException("Complaint", complaint_id)

    from datetime import datetime, timezone
    timestamp = datetime.now(timezone.utc).isoformat()

    updates: Dict[str, Any] = {"updated_at": timestamp}
    if new_status:
        updates["status"] = new_status

    timeline_entry = {
        "step": f"Status updated to {new_status or doc.get('status')}",
        "status": new_status or doc.get("status"),
        "timestamp": timestamp,
        "actor_role": current_user.role.value,
        "notes": payload.notes or "Status update by department officer.",
    }

    await mongo_db.complaints.update_one(
        {"complaint_id": complaint_id},
        {
            "$set": updates,
            "$push": {"timeline": timeline_entry},
        },
    )

    return APIResponse(
        message=f"Complaint #{complaint_id} updated successfully.",
        data={"complaint_id": complaint_id, "status": new_status or doc.get("status")},
    )


@router.post("/{complaint_id}/submit-resolution", response_model=APIResponse[Dict[str, Any]])
async def submit_resolution(
    complaint_id: str,
    work_description: str = Query(..., description="Description of remediation work completed"),
    after_image_url: str = Query(..., description="URL of after-repair photo evidence"),
    current_user: User = Depends(require_officer),
    mongo_db: AsyncIOMotorDatabase = Depends(get_mongo_db),
):
    """
    Department / Officer marks work complete and submits before/after evidence.
    Transitions status to READY_FOR_CITIZEN_VERIFICATION.
    Does NOT finalize complaint as resolved.
    """
    res = await submit_department_resolution_evidence(
        complaint_id=complaint_id,
        department_user=current_user,
        work_description=work_description,
        after_image_url=after_image_url,
        mongo_db=mongo_db,
    )
    return APIResponse(message=res["message"], data=res)


@router.post("/{complaint_id}/verify-resolution", response_model=APIResponse[Dict[str, Any]])
async def verify_resolution(
    complaint_id: str,
    rating: int = Query(..., ge=1, le=5, description="Citizen rating from 1 to 5 stars"),
    comments: Optional[str] = Query(None, description="Citizen feedback"),
    current_user: User = Depends(get_current_user),
    mongo_db: AsyncIOMotorDatabase = Depends(get_mongo_db),
):
    """
    CITIZEN RESOLUTION CONFIRMATION:
    The complainant physically verifies the fix and confirms it is resolved.
    Transitions status to RESOLVED and generates public QR transparency code.
    """
    res = await verify_citizen_resolution(
        complaint_id=complaint_id,
        citizen_user=current_user,
        rating=rating,
        comments=comments,
        mongo_db=mongo_db,
    )
    return APIResponse(message=res["message"], data=res)


@router.post("/{complaint_id}/reject-resolution", response_model=APIResponse[Dict[str, Any]])
async def reject_resolution(
    complaint_id: str,
    reason: str = Query(..., min_length=5, description="Reason why the repair is incomplete or defective"),
    current_user: User = Depends(get_current_user),
    mongo_db: AsyncIOMotorDatabase = Depends(get_mongo_db),
):
    """
    CITIZEN RESOLUTION REJECTION:
    Complainant disputes the resolution.
    Reopens the complaint, sets status to RESOLUTION_REJECTED, and escalates for department rework.
    """
    res = await reject_citizen_resolution(
        complaint_id=complaint_id,
        citizen_user=current_user,
        reason=reason,
        mongo_db=mongo_db,
    )
    return APIResponse(message=res["message"], data=res)


@router.get("/{complaint_id}/verification-status", response_model=APIResponse[Dict[str, Any]])
async def get_verification_status(
    complaint_id: str,
    mongo_db: AsyncIOMotorDatabase = Depends(get_mongo_db),
):
    """Check citizen verification readiness and status for a complaint."""
    doc = await mongo_db.complaints.find_one({"complaint_id": complaint_id})
    if not doc:
        raise EntityNotFoundException("Complaint", complaint_id)

    status_val = doc.get("status", "SUBMITTED")
    ready_for_verify = status_val == "READY_FOR_CITIZEN_VERIFICATION"
    is_resolved = status_val == "RESOLVED"
    is_rejected = status_val == "RESOLUTION_REJECTED"

    return APIResponse(data={
        "complaint_id": complaint_id,
        "current_status": status_val,
        "ready_for_citizen_verification": ready_for_verify,
        "is_confirmed_resolved": is_resolved,
        "is_disputed": is_rejected,
        "resolution_verification": doc.get("resolution_verification"),
        "dispute_reason": doc.get("dispute_reason"),
        "qr_code_url": doc.get("qr_code_url"),
    })


@router.get("/{complaint_id}/resolution-history", response_model=APIResponse[List[Dict[str, Any]]])
async def get_resolution_history(
    complaint_id: str,
    mongo_db: AsyncIOMotorDatabase = Depends(get_mongo_db),
):
    """Fetch complete chronological timeline of work updates and citizen verifications."""
    doc = await mongo_db.complaints.find_one({"complaint_id": complaint_id})
    if not doc:
        raise EntityNotFoundException("Complaint", complaint_id)

    timeline = doc.get("timeline", [])
    return APIResponse(data=timeline)
