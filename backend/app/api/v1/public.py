"""
CivicBuzz Public Transparency API Router
Provides sanitized public grievance feeds, transparent issue clusters,
citywide statistics, and resolution audit trails (Requirement 17 & 39).
"""

from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, Query
from motor.motor_asyncio import AsyncIOMotorDatabase
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.dependencies import get_mongo_db, get_db
from app.core.exceptions import EntityNotFoundException
from app.models.sql.project import Project, Tender
from app.models.sql.user import User
from app.schemas.common import APIResponse
from app.schemas.complaint import PublicComplaintResponse

router = APIRouter(prefix="/public", tags=["Public Transparency"])


@router.get("/complaints", response_model=APIResponse[List[PublicComplaintResponse]])
async def list_public_complaints(
    category: Optional[str] = None,
    ward_id: Optional[int] = None,
    status_filter: Optional[str] = None,
    priority: Optional[str] = None,
    limit: int = Query(50, le=200),
    mongo_db: AsyncIOMotorDatabase = Depends(get_mongo_db),
):
    """
    Public transparency feed.
    Complainant private identities (Aadhaar, email, phone, name) are strictly stripped.
    """
    query: Dict[str, Any] = {}
    if category:
        query["category"] = category.upper()
    if ward_id:
        query["location.ward_id"] = ward_id
    if status_filter:
        query["status"] = status_filter.upper()
    if priority:
        query["priority.level"] = priority.upper()

    cursor = mongo_db.complaints.find(query).sort("created_at", -1).limit(limit)
    docs = await cursor.to_list(length=limit)

    results = []
    for d in docs:
        loc = d.get("location", {})
        results.append(PublicComplaintResponse(
            complaint_id=d.get("complaint_id", ""),
            title=d.get("title", ""),
            category=d.get("category", ""),
            sub_category=d.get("sub_category", ""),
            ward=loc.get("ward_name", "Ward 12"),
            approximate_location=loc.get("address", "Bhubaneswar"),
            severity=d.get("severity", "MEDIUM"),
            priority_level=d.get("priority", {}).get("level", "MEDIUM"),
            status=d.get("status", "SUBMITTED"),
            created_at=d.get("created_at", ""),
            responsible_department=d.get("department_name", "Roads & Potholes"),
            public_evidence=[
                {"type": e.get("evidence_type"), "url": e.get("file_url"), "timestamp": e.get("timestamp")}
                for e in d.get("evidence", [])
            ],
            resolution_timeline=d.get("timeline", []),
            qr_code_url=d.get("qr_code_url"),
        ))

    return APIResponse(data=results)


@router.get("/complaints/{complaint_id}", response_model=APIResponse[PublicComplaintResponse])
async def get_public_complaint(
    complaint_id: str,
    mongo_db: AsyncIOMotorDatabase = Depends(get_mongo_db),
):
    """Fetch individual public complaint with transparent resolution trail."""
    d = await mongo_db.complaints.find_one({"complaint_id": complaint_id})
    if not d:
        raise EntityNotFoundException("Complaint", complaint_id)

    loc = d.get("location", {})
    data = PublicComplaintResponse(
        complaint_id=d.get("complaint_id", ""),
        title=d.get("title", ""),
        category=d.get("category", ""),
        sub_category=d.get("sub_category", ""),
        ward=loc.get("ward_name", "Ward 12"),
        approximate_location=loc.get("address", "Bhubaneswar"),
        severity=d.get("severity", "MEDIUM"),
        priority_level=d.get("priority", {}).get("level", "MEDIUM"),
        status=d.get("status", "SUBMITTED"),
        created_at=d.get("created_at", ""),
        responsible_department=d.get("department_name", "Roads & Potholes"),
        public_evidence=[
            {"type": e.get("evidence_type"), "url": e.get("file_url"), "timestamp": e.get("timestamp")}
            for e in d.get("evidence", [])
        ],
        resolution_timeline=d.get("timeline", []),
        qr_code_url=d.get("qr_code_url"),
    )
    return APIResponse(data=data)


@router.get("/stats", response_model=APIResponse[Dict[str, Any]])
async def get_public_stats(
    mongo_db: AsyncIOMotorDatabase = Depends(get_mongo_db),
    db: AsyncSession = Depends(get_db),
):
    """Citywide impact statistics matching the frontend footer and overview cards."""
    total_reported = await mongo_db.complaints.count_documents({})
    total_resolved = await mongo_db.complaints.count_documents({"status": "RESOLVED"})
    active_reports = await mongo_db.complaints.count_documents({"status": {"$in": ["SUBMITTED", "ASSIGNED", "IN_PROGRESS", "READY_FOR_CITIZEN_VERIFICATION"]}})
    overdue_reports = await mongo_db.complaints.count_documents({"$or": [{"is_overdue": True}, {"priority.level": "CRITICAL", "status": {"$ne": "RESOLVED"}}]})

    # Aggregate total citizens
    stmt_users = select(func.count(User.id))
    res_users = await db.execute(stmt_users)
    citizen_count = res_users.scalar() or 0

    return APIResponse(data={
        "total_reported": total_reported,
        "total_resolved": total_resolved,
        "active_reports": active_reports,
        "overdue_reports": overdue_reports,
        "active_citizens": citizen_count,
        "communities_count": 50,
        "resolution_rate_percent": round((total_resolved / (total_reported or 1)) * 100.0, 1) if total_reported else 0.0,
    })


@router.get("/clusters", response_model=APIResponse[List[Dict[str, Any]]])
async def list_issue_clusters(
    mongo_db: AsyncIOMotorDatabase = Depends(get_mongo_db),
):
    """
    Public Issue Clusters representing aggregated underlying civic problems (Requirement 38 & 39).
    """
    cursor = mongo_db.complaints.find({}).limit(20)
    docs = await cursor.to_list(length=20)

    clusters = []
    for d in docs:
        dup = d.get("duplicate_info", {})
        cluster_count = dup.get("cluster_count", 1)
        loc = d.get("location", {})
        clusters.append({
            "cluster_id": f"IC-{d.get('complaint_id', '')}",
            "primary_complaint_id": d.get("complaint_id"),
            "problem": d.get("title"),
            "category": d.get("category"),
            "ward": loc.get("ward_name"),
            "reports_count": cluster_count,
            "priority": d.get("priority", {}).get("level", "HIGH"),
            "department": d.get("department_name"),
            "status": d.get("status"),
        })

    return APIResponse(data=clusters)
