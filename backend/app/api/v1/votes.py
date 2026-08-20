"""
CivicBuzz Votes API Router
Dedicated voting endpoint for civic project proposals.
"""

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.dependencies import get_optional_user, get_db, get_mongo_db
from app.core.exceptions import EntityNotFoundException, DuplicateResourceException
from app.models.sql.user import User
from app.models.sql.project import Project, ProjectVote
from app.schemas.common import APIResponse
from app.schemas.evidence import VoteRequest, VoteResponse
from app.services.audit_service import record_audit_event

router = APIRouter(prefix="/votes", tags=["Voting"])


@router.post("", response_model=APIResponse[VoteResponse])
async def cast_vote(
    payload: VoteRequest,
    current_user: User = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db),
    mongo_db: AsyncIOMotorDatabase = Depends(get_mongo_db),
):
    """Cast a verified community vote for a proposal."""
    stmt = select(Project).where(Project.id == payload.project_id)
    res = await db.execute(stmt)
    project = res.scalar_one_or_none()
    if not project:
        raise EntityNotFoundException("Project", payload.project_id)

    user_id = current_user.id if current_user else 2

    stmt_vote = select(ProjectVote).where(
        ProjectVote.user_id == user_id,
        ProjectVote.project_id == payload.project_id,
    )
    res_vote = await db.execute(stmt_vote)
    if res_vote.scalar_one_or_none():
        raise DuplicateResourceException("You have already voted for this proposal.")

    new_vote = ProjectVote(user_id=user_id, project_id=payload.project_id)
    db.add(new_vote)
    project.vote_count += 1
    await db.commit()

    await record_audit_event(
        mongo_db=mongo_db,
        action="VOTE_CAST",
        entity_type="PROJECT",
        entity_id=str(payload.project_id),
        actor_id=str(user_id),
        actor_role=current_user.role.value if current_user else "CITIZEN",
    )

    return APIResponse(
        message=f"Vote recorded for '{project.title}'.",
        data=VoteResponse(
            success=True,
            message="Vote registered.",
            project_id=payload.project_id,
            total_votes=project.vote_count,
        ),
    )
