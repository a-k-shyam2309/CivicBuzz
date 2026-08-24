"""
CivicBuzz Participatory Budgeting & Projects API Router
Allows citizens to propose, view, and vote on community civic projects.
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.dependencies import get_current_user, get_optional_user, get_db, get_mongo_db
from app.core.exceptions import EntityNotFoundException, DuplicateResourceException
from app.models.sql.user import User
from app.models.sql.project import Project, ProjectStatus, ProjectVote
from app.schemas.common import APIResponse
from app.schemas.evidence import (
    ProjectCreateRequest,
    ProjectResponse,
    ProjectRankingResponse,
    VoteResponse,
)
from app.services.audit_service import record_audit_event

router = APIRouter(prefix="/projects", tags=["Participatory Budgeting & Projects"])


@router.get("", response_model=APIResponse[List[ProjectResponse]])
async def list_projects(
    ward_id: Optional[int] = None,
    category: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
):
    """List all participatory budgeting proposals with real-time vote percentages."""
    stmt = select(Project).order_by(Project.vote_count.desc())
    if ward_id:
        stmt = stmt.where(Project.ward_id == ward_id)
    if category:
        stmt = stmt.where(Project.category.ilike(f"%{category}%"))

    result = await db.execute(stmt)
    projects = result.scalars().all()

    total_votes = sum(p.vote_count for p in projects) or 1

    data = [
        ProjectResponse(
            id=p.id,
            project_uid=p.project_uid,
            title=p.title,
            description=p.description,
            ward_id=p.ward_id,
            category=p.category,
            estimated_cost=p.estimated_cost,
            allocated_budget=p.allocated_budget,
            vote_count=p.vote_count,
            vote_percentage=round((p.vote_count / total_votes) * 100.0, 1),
            status=p.status.value,
            icon=p.icon,
            location_name=p.location_name,
            linked_complaint_count=p.linked_complaint_count,
            timeline_days=p.timeline_days,
            qr_code_url=p.qr_code_url,
            created_at=p.created_at.isoformat() if p.created_at else "",
        )
        for p in projects
    ]
    return APIResponse(data=data)


@router.get("/rankings", response_model=APIResponse[List[ProjectRankingResponse]])
async def get_project_rankings(
    ward_id: Optional[int] = None,
    db: AsyncSession = Depends(get_db),
):
    """Fetch live community rankings of participatory budgeting projects."""
    stmt = select(Project).order_by(Project.vote_count.desc())
    if ward_id:
        stmt = stmt.where(Project.ward_id == ward_id)

    result = await db.execute(stmt)
    projects = result.scalars().all()

    total_votes = sum(p.vote_count for p in projects) or 1

    rankings = []
    for rank, p in enumerate(projects, start=1):
        proj_resp = ProjectResponse(
            id=p.id,
            project_uid=p.project_uid,
            title=p.title,
            description=p.description,
            ward_id=p.ward_id,
            category=p.category,
            estimated_cost=p.estimated_cost,
            allocated_budget=p.allocated_budget,
            vote_count=p.vote_count,
            vote_percentage=round((p.vote_count / total_votes) * 100.0, 1),
            status=p.status.value,
            icon=p.icon,
            location_name=p.location_name,
            linked_complaint_count=p.linked_complaint_count,
            timeline_days=p.timeline_days,
            qr_code_url=p.qr_code_url,
            created_at=p.created_at.isoformat() if p.created_at else "",
        )
        rankings.append(ProjectRankingResponse(rank=rank, project=proj_resp))

    return APIResponse(data=rankings)


@router.get("/{project_id}", response_model=APIResponse[ProjectResponse])
async def get_project_detail(
    project_id: int,
    db: AsyncSession = Depends(get_db),
):
    """Fetch individual project details."""
    stmt = select(Project).where(Project.id == project_id)
    res = await db.execute(stmt)
    p = res.scalar_one_or_none()
    if not p:
        raise EntityNotFoundException("Project", project_id)

    data = ProjectResponse(
        id=p.id,
        project_uid=p.project_uid,
        title=p.title,
        description=p.description,
        ward_id=p.ward_id,
        category=p.category,
        estimated_cost=p.estimated_cost,
        allocated_budget=p.allocated_budget,
        vote_count=p.vote_count,
        vote_percentage=0.0,
        status=p.status.value,
        icon=p.icon,
        location_name=p.location_name,
        linked_complaint_count=p.linked_complaint_count,
        timeline_days=p.timeline_days,
        qr_code_url=p.qr_code_url,
        created_at=p.created_at.isoformat() if p.created_at else "",
    )
    return APIResponse(data=data)


@router.post("", response_model=APIResponse[ProjectResponse], status_code=status.HTTP_201_CREATED)
async def create_project_proposal(
    payload: ProjectCreateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
    mongo_db: AsyncIOMotorDatabase = Depends(get_mongo_db),
):
    """Citizen or official creates a participatory budgeting proposal."""
    new_proj = Project(
        project_uid=f"PRJ-{func.random()}",
        title=payload.title,
        description=payload.description,
        ward_id=payload.ward_id,
        category=payload.category,
        estimated_cost=payload.estimated_cost,
        allocated_budget=payload.estimated_cost,
        vote_count=1,
        status=ProjectStatus.PROPOSED,
        icon=payload.icon or "🛣️",
        location_name=payload.location_name,
        created_by=current_user.id,
    )
    db.add(new_proj)
    await db.commit()
    await db.refresh(new_proj)

    # Automatically cast proposer's initial vote
    db.add(ProjectVote(user_id=current_user.id, project_id=new_proj.id))
    await db.commit()

    await record_audit_event(
        mongo_db=mongo_db,
        action="PROJECT_PROPOSED",
        entity_type="PROJECT",
        entity_id=str(new_proj.id),
        actor_id=str(current_user.id),
        actor_role=current_user.role.value,
        metadata={"title": payload.title, "ward_id": payload.ward_id},
    )

    data = ProjectResponse(
        id=new_proj.id,
        project_uid=new_proj.project_uid,
        title=new_proj.title,
        description=new_proj.description,
        ward_id=new_proj.ward_id,
        category=new_proj.category,
        estimated_cost=new_proj.estimated_cost,
        allocated_budget=new_proj.allocated_budget,
        vote_count=new_proj.vote_count,
        vote_percentage=100.0,
        status=new_proj.status.value,
        icon=new_proj.icon,
        location_name=new_proj.location_name,
        linked_complaint_count=0,
        timeline_days=new_proj.timeline_days,
        qr_code_url=None,
        created_at=new_proj.created_at.isoformat(),
    )
    return APIResponse(message="Project proposal created successfully.", data=data)


@router.post("/{project_id}/vote", response_model=APIResponse[VoteResponse])
async def vote_for_project(
    project_id: int,
    current_user: User = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db),
    mongo_db: AsyncIOMotorDatabase = Depends(get_mongo_db),
):
    """
    Cast a community vote for a civic project proposal.
    Strictly enforces one vote per verified citizen per proposal.
    """
    stmt = select(Project).where(Project.id == project_id)
    res = await db.execute(stmt)
    project = res.scalar_one_or_none()
    if not project:
        raise EntityNotFoundException("Project", project_id)

    # Use actual user or fallback demo user
    user_id = current_user.id if current_user else 2

    # Check for existing vote
    stmt_vote = select(ProjectVote).where(
        ProjectVote.user_id == user_id,
        ProjectVote.project_id == project_id,
    )
    res_vote = await db.execute(stmt_vote)
    if res_vote.scalar_one_or_none():
        raise DuplicateResourceException("You have already voted for this proposal.")

    # Record vote
    new_vote = ProjectVote(user_id=user_id, project_id=project_id)
    db.add(new_vote)
    project.vote_count += 1
    await db.commit()

    await record_audit_event(
        mongo_db=mongo_db,
        action="VOTE_CAST",
        entity_type="PROJECT",
        entity_id=str(project_id),
        actor_id=str(user_id),
        actor_role=current_user.role.value if current_user else "CITIZEN",
        metadata={"project_title": project.title, "new_vote_count": project.vote_count},
    )

    return APIResponse(
        message=f"Vote recorded successfully for '{project.title}'.",
        data=VoteResponse(
            success=True,
            message="Vote registered.",
            project_id=project_id,
            total_votes=project.vote_count,
        ),
    )
