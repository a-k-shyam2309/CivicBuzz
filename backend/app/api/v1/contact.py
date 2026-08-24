"""
CivicBuzz Contact & Support API Router
Handles contact form submissions from the Contact Us frontend page.
"""

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.dependencies import get_db, get_mongo_db
from app.models.sql.project import ContactMessage
from app.schemas.common import APIResponse
from app.schemas.evidence import ContactSubmitRequest, ContactResponse
from app.services.audit_service import record_audit_event

router = APIRouter(prefix="/contact", tags=["Contact & Support"])


@router.post("", response_model=APIResponse[ContactResponse], status_code=status.HTTP_201_CREATED)
async def submit_contact_form(
    payload: ContactSubmitRequest,
    db: AsyncSession = Depends(get_db),
    mongo_db: AsyncIOMotorDatabase = Depends(get_mongo_db),
):
    """Save citizen inquiry, feedback, or support message."""
    msg = ContactMessage(
        name=payload.name.strip(),
        email=payload.email.strip().lower(),
        subject=payload.subject.strip(),
        message=payload.message.strip(),
        is_read=False,
    )
    db.add(msg)
    await db.commit()
    await db.refresh(msg)

    await record_audit_event(
        mongo_db=mongo_db,
        action="CONTACT_MESSAGE_SUBMITTED",
        entity_type="CONTACT",
        entity_id=str(msg.id),
        metadata={"name": payload.name, "subject": payload.subject},
    )

    data = ContactResponse(
        id=msg.id,
        name=msg.name,
        email=msg.email,
        subject=msg.subject,
        message=msg.message,
        created_at=msg.created_at.isoformat() if msg.created_at else "",
    )
    return APIResponse(
        message=f"Thanks, {payload.name}! Your message has been received.",
        data=data,
    )
