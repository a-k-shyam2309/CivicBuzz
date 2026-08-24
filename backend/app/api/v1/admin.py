"""
CivicBuzz Administrator API Router
Provides admin dashboard metrics, AI routing queue, department overrides,
tender management, escalation review, and immutable audit logs (Requirement 18, 35, 40).
"""

from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.dependencies import get_current_user, require_admin, get_db, get_mongo_db
from app.core.exceptions import EntityNotFoundException, ValidationException
from app.models.sql.user import User
from app.models.sql.project import Tender, TenderStatus
from app.models.sql.department import Department
from app.schemas.common import APIResponse
from app.schemas.evidence import (
    AdminDashboardStatsResponse,
    TenderCreateRequest,
    TenderUpdateRequest,
    TenderResponse,
    DepartmentCreateRequest,
    DepartmentResponse,
)
from app.services.audit_service import record_audit_event
from app.services.qr_service import generate_qr_code_image

router = APIRouter(prefix="/admin", tags=["Administrator Dashboard"])


@router.get("/dashboard", response_model=APIResponse[AdminDashboardStatsResponse])
async def get_dashboard_metrics(
    current_user: User = Depends(require_admin),
    mongo_db: AsyncIOMotorDatabase = Depends(get_mongo_db),
    db: AsyncSession = Depends(get_db),
):
    """
    Fetch comprehensive KPI metrics matching the Admin Portal overview cards.
    """
    total_reported = await mongo_db.complaints.count_documents({})
    total_resolved = await mongo_db.complaints.count_documents({"status": "RESOLVED"})
    total_open = await mongo_db.complaints.count_documents({"status": {"$in": ["SUBMITTED", "ASSIGNED", "IN_PROGRESS", "READY_FOR_CITIZEN_VERIFICATION"]}})
    total_overdue = await mongo_db.complaints.count_documents({"$or": [{"is_overdue": True}, {"priority.level": "CRITICAL", "status": {"$ne": "RESOLVED"}}]})

    data = AdminDashboardStatsResponse(
        total_reported=total_reported,
        total_resolved=total_resolved,
        total_open=total_open,
        total_overdue=total_overdue,
        resolution_rate_percent=round((total_resolved / (total_reported or 1)) * 100.0, 1) if total_reported else 0.0,
        reported_change_percent=0.0,
        resolved_change_percent=0.0,
        open_change_percent=0.0,
        overdue_change_percent=0.0,
        active_citizens=247,
        communities_count=50,
    )
    return APIResponse(data=data)


@router.get("/queue", response_model=APIResponse[List[Dict[str, Any]]])
async def get_routing_queue(
    current_user: User = Depends(require_admin),
    mongo_db: AsyncIOMotorDatabase = Depends(get_mongo_db),
):
    """
    AI Routing Queue: Reports awaiting assignment or AI triage verification.
    """
    cursor = mongo_db.complaints.find({}).sort("priority.score", -1).limit(50)
    docs = await cursor.to_list(length=50)

    queue = []
    for d in docs:
        d_copy = dict(d)
        d_copy.pop("_id", None)
        queue.append(d_copy)

    return APIResponse(data=queue)


@router.post("/complaints/{complaint_id}/reassign", response_model=APIResponse[Dict[str, Any]])
async def reassign_department(
    complaint_id: str,
    new_department_code: str = Query(..., description="Target department code"),
    notes: Optional[str] = Query(None, description="Admin reason for reassignment override"),
    current_user: User = Depends(require_admin),
    mongo_db: AsyncIOMotorDatabase = Depends(get_mongo_db),
    db: AsyncSession = Depends(get_db),
):
    """
    Admin override for department assignment.
    Logged in the immutable audit trail.
    """
    stmt = select(Department).where(Department.code == new_department_code)
    res = await db.execute(stmt)
    dept = res.scalar_one_or_none()
    dept_name = dept.name if dept else new_department_code.replace("_", " ").title()

    timestamp = datetime.now(timezone.utc).isoformat()
    timeline_entry = {
        "step": "Department Reassigned by Admin",
        "status": "ASSIGNED",
        "timestamp": timestamp,
        "actor_role": current_user.role.value,
        "notes": f"Reassigned to {dept_name}. Reason: '{notes or 'Administrative routing adjustment'}'",
    }

    result = await mongo_db.complaints.update_one(
        {"complaint_id": complaint_id},
        {
            "$set": {
                "department_code": new_department_code,
                "department_name": dept_name,
                "updated_at": timestamp,
            },
            "$push": {
                "timeline": timeline_entry,
            },
        },
    )

    if result.matched_count == 0:
        raise EntityNotFoundException("Complaint", complaint_id)

    await record_audit_event(
        mongo_db=mongo_db,
        action="ADMIN_DEPARTMENT_OVERRIDE",
        entity_type="COMPLAINT",
        entity_id=complaint_id,
        actor_id=str(current_user.id),
        actor_role=current_user.role.value,
        metadata={"new_department": new_department_code, "notes": notes},
    )

    return APIResponse(message=f"Complaint #{complaint_id} reassigned to {dept_name}.")


@router.post("/tenders", response_model=APIResponse[TenderResponse], status_code=status.HTTP_201_CREATED)
async def create_tender(
    payload: TenderCreateRequest,
    current_user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
    mongo_db: AsyncIOMotorDatabase = Depends(get_mongo_db),
):
    """Admin creates and publishes a new government tender."""
    import random
    tender_id = f"CB-T-{random.randint(1000, 9999)}"
    qr_url = generate_qr_code_image(f"https://civicbuzz.in/tenders/{tender_id}", f"qr_tender_{tender_id}.png")

    new_tender = Tender(
        tender_id=tender_id,
        title=payload.title,
        description=payload.description,
        ward_id=payload.ward_id,
        department_name="Roads & Potholes",
        category=payload.category,
        location=payload.location,
        estimated_budget=payload.estimated_budget,
        duration_days=payload.duration_days,
        verified_locations_count=payload.verified_locations_count,
        community_votes=0,
        status=TenderStatus.PUBLISHED,
        stage_progress=1,
        progress_percentage=20,
        submission_deadline=payload.submission_deadline or "24 Aug 2026",
        qr_code_url=qr_url,
    )
    db.add(new_tender)
    await db.commit()
    await db.refresh(new_tender)

    await record_audit_event(
        mongo_db=mongo_db,
        action="TENDER_CREATED",
        entity_type="TENDER",
        entity_id=tender_id,
        actor_id=str(current_user.id),
        actor_role=current_user.role.value,
        metadata={"title": payload.title, "budget": payload.estimated_budget},
    )

    data = TenderResponse(
        id=new_tender.id,
        tender_id=new_tender.tender_id,
        title=new_tender.title,
        description=new_tender.description,
        ward_id=new_tender.ward_id,
        department_name=new_tender.department_name,
        category=new_tender.category,
        location=new_tender.location,
        estimated_budget=new_tender.estimated_budget,
        duration_days=new_tender.duration_days,
        verified_locations_count=new_tender.verified_locations_count,
        community_votes=new_tender.community_votes,
        status=new_tender.status.value,
        stage_progress=new_tender.stage_progress,
        progress_percentage=new_tender.progress_percentage,
        closing_in_days=7,
        submission_deadline=new_tender.submission_deadline,
        contractor_name=new_tender.contractor_name,
        qr_code_url=new_tender.qr_code_url,
        created_at=new_tender.created_at.isoformat(),
    )
    return APIResponse(message="Tender created and published successfully.", data=data)


@router.patch("/tenders/{tender_id}", response_model=APIResponse[TenderResponse])
async def update_tender(
    tender_id: str,
    payload: TenderUpdateRequest,
    current_user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
    mongo_db: AsyncIOMotorDatabase = Depends(get_mongo_db),
):
    """Update tender progress, contractor assignment, or stage."""
    stmt = select(Tender).where(Tender.tender_id == tender_id)
    res = await db.execute(stmt)
    t = res.scalar_one_or_none()
    if not t:
        raise EntityNotFoundException("Tender", tender_id)

    if payload.title:
        t.title = payload.title
    if payload.description:
        t.description = payload.description
    if payload.status:
        t.status = TenderStatus(payload.status.upper())
    if payload.stage_progress is not None:
        t.stage_progress = payload.stage_progress
    if payload.progress_percentage is not None:
        t.progress_percentage = payload.progress_percentage
    if payload.contractor_name:
        t.contractor_name = payload.contractor_name

    await db.commit()

    await record_audit_event(
        mongo_db=mongo_db,
        action="TENDER_UPDATED",
        entity_type="TENDER",
        entity_id=tender_id,
        actor_id=str(current_user.id),
        actor_role=current_user.role.value,
        metadata=payload.model_dump(exclude_unset=True),
    )

    data = TenderResponse(
        id=t.id,
        tender_id=t.tender_id,
        title=t.title,
        description=t.description,
        ward_id=t.ward_id,
        department_name=t.department_name,
        category=t.category,
        location=t.location,
        estimated_budget=t.estimated_budget,
        duration_days=t.duration_days,
        verified_locations_count=t.verified_locations_count,
        community_votes=t.community_votes,
        status=t.status.value,
        stage_progress=t.stage_progress,
        progress_percentage=t.progress_percentage,
        closing_in_days=t.closing_in_days,
        submission_deadline=t.submission_deadline,
        contractor_name=t.contractor_name,
        qr_code_url=t.qr_code_url,
        created_at=t.created_at.isoformat() if t.created_at else "",
    )
    return APIResponse(message="Tender updated successfully.", data=data)


@router.get("/audit-logs", response_model=APIResponse[List[Dict[str, Any]]])
async def get_audit_logs(
    current_user: User = Depends(require_admin),
    mongo_db: AsyncIOMotorDatabase = Depends(get_mongo_db),
    limit: int = Query(50, le=200),
):
    """Fetch immutable audit logs."""
    cursor = mongo_db.audit_logs.find({}).sort("timestamp", -1).limit(limit)
    logs = await cursor.to_list(length=limit)
    for l in logs:
        l.pop("_id", None)
    return APIResponse(data=logs)


# =========================================================
# DEPARTMENTS (DATABASE PERSISTENCE)
# =========================================================

@router.get("/departments", response_model=APIResponse[List[DepartmentResponse]])
async def list_departments(
    db: AsyncSession = Depends(get_db),
    mongo_db: AsyncIOMotorDatabase = Depends(get_mongo_db),
):
    """List all registered departments from the SQL database with open issue counts."""
    stmt = select(Department).order_by(Department.id.asc())
    res = await db.execute(stmt)
    depts = res.scalars().all()

    results = []
    for d in depts:
        open_count = await mongo_db.complaints.count_documents({
            "department_code": d.code,
            "status": {"$ne": "RESOLVED"},
        })
        results.append(DepartmentResponse(
            id=d.id,
            code=d.code,
            name=d.name,
            description=d.description or "Civic department responsible for municipal service remediation.",
            contact_email=d.contact_email,
            contact_phone=d.contact_phone,
            sla_hours=d.sla_hours,
            is_active=d.is_active,
            open_issues=open_count,
            avg_resolution_days=round(d.sla_hours / 24.0, 1),
            created_at=d.created_at.isoformat() if d.created_at else "",
        ))

    return APIResponse(data=results)


@router.post("/departments", response_model=APIResponse[DepartmentResponse], status_code=status.HTTP_201_CREATED)
async def create_department(
    payload: DepartmentCreateRequest,
    db: AsyncSession = Depends(get_db),
    mongo_db: AsyncIOMotorDatabase = Depends(get_mongo_db),
):
    """Register and persist a new department in the database."""
    import re
    code = payload.code or re.sub(r"[^a-zA-Z0-9]+", "_", payload.name).strip("_").upper()

    existing = await db.execute(select(Department).where(Department.code == code))
    if existing.scalar_one_or_none():
        code = f"{code}_{int(datetime.now(timezone.utc).timestamp())}"

    new_dept = Department(
        code=code,
        name=payload.name,
        description=payload.description or f"Municipal department handling {payload.name.lower()}.",
        contact_email=str(payload.contact_email) if payload.contact_email else f"{code.lower()}@civicbuzz.gov",
        contact_phone=payload.contact_phone or "+91 80 2297 5000",
        sla_hours=payload.sla_hours or 48,
        is_active=True,
    )
    db.add(new_dept)
    await db.commit()
    await db.refresh(new_dept)

    await record_audit_event(
        mongo_db=mongo_db,
        action="DEPARTMENT_CREATED",
        entity_type="DEPARTMENT",
        entity_id=new_dept.code,
        actor_id="ADMIN",
        actor_role="ADMIN",
        metadata={"name": new_dept.name, "code": new_dept.code},
    )

    data = DepartmentResponse(
        id=new_dept.id,
        code=new_dept.code,
        name=new_dept.name,
        description=new_dept.description,
        contact_email=new_dept.contact_email,
        contact_phone=new_dept.contact_phone,
        sla_hours=new_dept.sla_hours,
        is_active=new_dept.is_active,
        open_issues=0,
        avg_resolution_days=round(new_dept.sla_hours / 24.0, 1),
        created_at=new_dept.created_at.isoformat() if new_dept.created_at else "",
    )
    return APIResponse(message=f"Department '{new_dept.name}' created successfully.", data=data)


# =========================================================
# COMPLAINT ACTIONS (STATUS & AUDIT PERSISTENCE)
# =========================================================

@router.post("/complaints/{complaint_id}/action", response_model=APIResponse[Dict[str, Any]])
async def perform_complaint_action(
    complaint_id: str,
    action: str = Query(..., description="Action: ASSIGN, REJECT, IN_PROGRESS, RESOLVE"),
    department_code: Optional[str] = Query(None),
    notes: Optional[str] = Query(None),
    mongo_db: AsyncIOMotorDatabase = Depends(get_mongo_db),
    db: AsyncSession = Depends(get_db),
):
    """Execute triage actions (Assign, Reject, Resolve, Progress) with permanent DB & audit logging."""
    doc = await mongo_db.complaints.find_one({"complaint_id": complaint_id})
    if not doc:
        raise EntityNotFoundException("Complaint", complaint_id)

    timestamp = datetime.now(timezone.utc).isoformat()
    action_upper = action.upper()

    status_map = {
        "ASSIGN": "ASSIGNED",
        "IN_PROGRESS": "IN_PROGRESS",
        "RESOLVE": "READY_FOR_CITIZEN_VERIFICATION",
        "REJECT": "REJECTED",
    }
    new_status = status_map.get(action_upper, "ASSIGNED")

    dept_name = doc.get("department_name", "Roads & Potholes")
    if department_code:
        stmt = select(Department).where(Department.code == department_code)
        res = await db.execute(stmt)
        dept = res.scalar_one_or_none()
        if dept:
            dept_name = dept.name

    timeline_entry = {
        "step": f"Admin Action: {action_upper.replace('_', ' ').title()}",
        "status": new_status,
        "timestamp": timestamp,
        "actor_role": "ADMIN",
        "notes": notes or f"Administrative triage: {action_upper} applied.",
    }

    update_fields: Dict[str, Any] = {
        "status": new_status,
        "updated_at": timestamp,
    }
    if department_code:
        update_fields["department_code"] = department_code
        update_fields["department_name"] = dept_name

    await mongo_db.complaints.update_one(
        {"complaint_id": complaint_id},
        {
            "$set": update_fields,
            "$push": {"timeline": timeline_entry},
        },
    )

    await record_audit_event(
        mongo_db=mongo_db,
        action=f"ADMIN_COMPLAINT_{action_upper}",
        entity_type="COMPLAINT",
        entity_id=complaint_id,
        actor_id="ADMIN",
        actor_role="ADMIN",
        metadata={"action": action_upper, "new_status": new_status, "notes": notes},
    )

    return APIResponse(
        message=f"Complaint #{complaint_id} updated to {new_status}.",
        data={"complaint_id": complaint_id, "status": new_status, "department_name": dept_name},
    )
