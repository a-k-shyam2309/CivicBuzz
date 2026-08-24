"""
CivicBuzz Citizen-Verified Resolution Service
Enforces the core principle:
"Government can complete the work, but the civic issue is not finally marked resolved
until an eligible citizen who reported the issue confirms the result."
"""

from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.exceptions import UnauthorizedException, ValidationException, EntityNotFoundException
from app.models.sql.user import User, UserRole
from app.services.audit_service import record_audit_event, NotificationService
from app.services.qr_service import get_complaint_qr_url


async def submit_department_resolution_evidence(
    complaint_id: str,
    department_user: User,
    work_description: str,
    after_image_url: str,
    mongo_db: AsyncIOMotorDatabase,
) -> Dict[str, Any]:
    """
    Department submits resolution evidence. Moves state to READY_FOR_CITIZEN_VERIFICATION.
    Does NOT mark complaint as RESOLVED.
    """
    complaint = await mongo_db.complaints.find_one({"complaint_id": complaint_id})
    if not complaint:
        raise EntityNotFoundException("Complaint", complaint_id)

    timestamp = datetime.now(timezone.utc).isoformat()

    resolution_evidence = {
        "evidence_id": f"EVD-{timestamp[-6:]}",
        "evidence_type": "AFTER_IMAGE",
        "file_url": after_image_url,
        "file_name": "resolution_evidence.jpg",
        "file_size_bytes": 0,
        "mime_type": "image/jpeg",
        "file_hash": "",
        "uploaded_by": department_user.full_name,
        "uploader_role": department_user.role.value,
        "timestamp": timestamp,
        "verification_status": "SUBMITTED_BY_DEPARTMENT",
        "verification_notes": work_description,
    }

    timeline_entry = {
        "step": "Work Completed by Department",
        "status": "READY_FOR_CITIZEN_VERIFICATION",
        "timestamp": timestamp,
        "actor_role": department_user.role.value,
        "notes": f"Department claimed fix: {work_description}. Awaiting citizen physical verification.",
    }

    await mongo_db.complaints.update_one(
        {"complaint_id": complaint_id},
        {
            "$set": {
                "status": "READY_FOR_CITIZEN_VERIFICATION",
                "updated_at": timestamp,
            },
            "$push": {
                "evidence": resolution_evidence,
                "timeline": timeline_entry,
            },
        },
    )

    # Notify original complainant
    await NotificationService.notify_resolution_ready(
        mongo_db=mongo_db,
        user_id=complaint.get("user_id", 0),
        complaint_id=complaint_id,
        title=complaint.get("title", ""),
        ward_name=complaint.get("location", {}).get("ward_name", "Ward"),
    )

    # Audit event
    await record_audit_event(
        mongo_db=mongo_db,
        action="RESOLUTION_EVIDENCE_SUBMITTED",
        entity_type="COMPLAINT",
        entity_id=complaint_id,
        actor_id=str(department_user.id),
        actor_role=department_user.role.value,
        metadata={"work_description": work_description, "status": "READY_FOR_CITIZEN_VERIFICATION"},
    )

    return {
        "success": True,
        "complaint_id": complaint_id,
        "status": "READY_FOR_CITIZEN_VERIFICATION",
        "message": "Resolution evidence submitted successfully. Complainant notified for physical verification.",
    }


async def verify_citizen_resolution(
    complaint_id: str,
    citizen_user: User,
    rating: int,
    comments: Optional[str],
    mongo_db: AsyncIOMotorDatabase,
) -> Dict[str, Any]:
    """
    Citizen physically inspects the site and approves resolution.
    Transitions status to RESOLVED and generates verifiable QR code.
    """
    complaint = await mongo_db.complaints.find_one({"complaint_id": complaint_id})
    if not complaint:
        raise EntityNotFoundException("Complaint", complaint_id)

    # Eligibility verification: User must be the original complainant or cluster reporter
    original_user_id = complaint.get("user_id")
    if citizen_user.id != original_user_id and citizen_user.role not in [UserRole.ADMIN, UserRole.SUPER_ADMIN]:
        raise UnauthorizedException("Only the citizen who reported this issue can confirm its resolution.")

    if rating < 1 or rating > 5:
        raise ValidationException("Rating must be between 1 and 5 stars.")

    timestamp = datetime.now(timezone.utc).isoformat()
    qr_url = get_complaint_qr_url(complaint_id)

    timeline_entry = {
        "step": "Citizen Confirmed Resolution",
        "status": "RESOLVED",
        "timestamp": timestamp,
        "actor_role": "CITIZEN",
        "notes": f"Citizen rated repair {rating}/5 stars. Feedback: '{comments or 'Satisfactory work'}'",
    }

    verification_record = {
        "verified_by_user_id": citizen_user.id,
        "verified_by_name": citizen_user.full_name,
        "rating": rating,
        "comments": comments or "Work verified by citizen.",
        "resolved": True,
        "verified_at": timestamp,
    }

    await mongo_db.complaints.update_one(
        {"complaint_id": complaint_id},
        {
            "$set": {
                "status": "RESOLVED",
                "citizen_confirmed_resolved": True,
                "resolution_verification": verification_record,
                "qr_code_url": qr_url,
                "updated_at": timestamp,
            },
            "$push": {
                "timeline": timeline_entry,
            },
        },
    )

    # Audit event
    await record_audit_event(
        mongo_db=mongo_db,
        action="CITIZEN_RESOLUTION_CONFIRMED",
        entity_type="COMPLAINT",
        entity_id=complaint_id,
        actor_id=str(citizen_user.id),
        actor_role="CITIZEN",
        metadata={"rating": rating, "comments": comments, "status": "RESOLVED"},
    )

    return {
        "success": True,
        "complaint_id": complaint_id,
        "status": "RESOLVED",
        "rating": rating,
        "qr_code_url": qr_url,
        "message": "Thank you! Complaint resolution confirmed and publicly published with QR evidence trail.",
    }


async def reject_citizen_resolution(
    complaint_id: str,
    citizen_user: User,
    reason: str,
    mongo_db: AsyncIOMotorDatabase,
) -> Dict[str, Any]:
    """
    Citizen disputes/rejects claimed resolution.
    Transitions status to RESOLUTION_REJECTED / REOPENED and triggers department rework escalation.
    """
    complaint = await mongo_db.complaints.find_one({"complaint_id": complaint_id})
    if not complaint:
        raise EntityNotFoundException("Complaint", complaint_id)

    original_user_id = complaint.get("user_id")
    if citizen_user.id != original_user_id and citizen_user.role not in [UserRole.ADMIN, UserRole.SUPER_ADMIN]:
        raise UnauthorizedException("Only the citizen who reported this issue can dispute its resolution.")

    if not reason or len(reason.strip()) < 5:
        raise ValidationException("Please provide a reason why the issue is not satisfactorily resolved.")

    timestamp = datetime.now(timezone.utc).isoformat()

    timeline_entry = {
        "step": "Citizen Disputed Resolution",
        "status": "RESOLUTION_REJECTED",
        "timestamp": timestamp,
        "actor_role": "CITIZEN",
        "notes": f"Citizen rejected resolution. Reason: '{reason}'. Complaint reopened for rework.",
    }

    await mongo_db.complaints.update_one(
        {"complaint_id": complaint_id},
        {
            "$set": {
                "status": "RESOLUTION_REJECTED",
                "citizen_confirmed_resolved": False,
                "dispute_reason": reason,
                "updated_at": timestamp,
            },
            "$push": {
                "timeline": timeline_entry,
            },
        },
    )

    # Notify department of rejection
    dept_code = complaint.get("department_code", "ROADS_AND_POTHOLES")
    await NotificationService.notify_resolution_rejected(
        mongo_db=mongo_db,
        department_code=dept_code,
        complaint_id=complaint_id,
        reason=reason,
    )

    # Audit event & escalation log
    await record_audit_event(
        mongo_db=mongo_db,
        action="CITIZEN_RESOLUTION_REJECTED",
        entity_type="COMPLAINT",
        entity_id=complaint_id,
        actor_id=str(citizen_user.id),
        actor_role="CITIZEN",
        metadata={"dispute_reason": reason, "status": "RESOLUTION_REJECTED", "escalated": True},
    )

    return {
        "success": True,
        "complaint_id": complaint_id,
        "status": "RESOLUTION_REJECTED",
        "message": "Dispute recorded. The complaint has been reopened and escalated to the department head for rework.",
    }
