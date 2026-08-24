"""
CivicBuzz Government Tenders API Router
Public and contractor portal for municipal projects generated from verified civic complaints.
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.dependencies import get_db, get_mongo_db, require_admin, get_optional_user
from app.core.exceptions import EntityNotFoundException
from app.models.sql.user import User
from app.models.sql.project import Tender, TenderStatus
from app.schemas.common import APIResponse
from app.schemas.evidence import (
    TenderCreateRequest,
    TenderUpdateRequest,
    TenderResponse,
)
from app.services.audit_service import record_audit_event
from app.services.qr_service import generate_qr_code_image

router = APIRouter(prefix="/tenders", tags=["Government Tenders"])


@router.get("", response_model=APIResponse[List[TenderResponse]])
async def list_tenders(
    category: Optional[str] = None,
    status_filter: Optional[str] = None,
    ward_id: Optional[int] = None,
    db: AsyncSession = Depends(get_db),
):
    """
    List all government tenders with category filters (roads, drainage, lighting, sanitation)
    and progress tracking matching the existing frontend.
    """
    stmt = select(Tender).order_by(Tender.id.desc())
    if category and category.lower() != "all":
        stmt = stmt.where(Tender.category.ilike(f"%{category}%"))
    if status_filter and status_filter.lower() != "all":
        stmt = stmt.where(Tender.status == TenderStatus(status_filter.upper()))
    if ward_id:
        stmt = stmt.where(Tender.ward_id == ward_id)

    result = await db.execute(stmt)
    tenders = result.scalars().all()

    data = [
        TenderResponse(
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
            image_url=t.image_url,
            qr_code_url=t.qr_code_url,
            created_at=t.created_at.isoformat() if t.created_at else "",
        )
        for t in tenders
    ]
    return APIResponse(data=data)


@router.get("/{tender_id}", response_model=APIResponse[TenderResponse])
async def get_tender_detail(
    tender_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Fetch individual tender details and lifecycle stages."""
    stmt = select(Tender).where((Tender.tender_id == tender_id) | (Tender.id == int(tender_id) if tender_id.isdigit() else False))
    res = await db.execute(stmt)
    t = res.scalar_one_or_none()
    if not t:
        raise EntityNotFoundException("Tender", tender_id)

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
        image_url=t.image_url,
        qr_code_url=t.qr_code_url,
        created_at=t.created_at.isoformat() if t.created_at else "",
    )
    return APIResponse(data=data)
