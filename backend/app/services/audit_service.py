"""
CivicBuzz Audit Log & Notification Services
Records immutable audit events and dispatches notifications for citizen verification.
"""

import logging
import secrets
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.models.mongo.chat import AuditLogDocument

logger = logging.getLogger("civicbuzz.services.audit")


async def record_audit_event(
    mongo_db: AsyncIOMotorDatabase,
    action: str,
    entity_type: str,
    entity_id: str,
    actor_id: Optional[str] = "SYSTEM",
    actor_role: str = "SYSTEM",
    metadata: Optional[Dict[str, Any]] = None,
    ip_address: Optional[str] = None,
) -> str:
    """
    Appends an immutable audit log document into the MongoDB audit_logs collection.
    """
    audit_id = f"AUD-{secrets.token_hex(6).upper()}"
    log_entry = {
        "audit_id": audit_id,
        "actor_id": str(actor_id or "ANONYMOUS"),
        "actor_role": actor_role,
        "action": action,
        "entity_type": entity_type,
        "entity_id": str(entity_id),
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "metadata": metadata or {},
        "ip_address": ip_address,
    }

    try:
        await mongo_db.audit_logs.insert_one(log_entry)
    except Exception as e:
        logger.warning(f"Failed to record audit event: {e}")

    return audit_id


class NotificationService:
    """Dispatches notifications to citizens and officers."""

    @staticmethod
    async def notify_resolution_ready(
        mongo_db: AsyncIOMotorDatabase,
        user_id: int,
        complaint_id: str,
        title: str,
        ward_name: str,
    ):
        """
        Notifies complainant that work is completed and awaits their physical verification.
        """
        notification = {
            "notification_id": f"NOTIF-{secrets.token_hex(6).upper()}",
            "user_id": user_id,
            "complaint_id": complaint_id,
            "title": "Action Required: Verify Complaint Resolution",
            "message": (
                f"Work for your reported issue '{title}' near {ward_name} has been marked completed by the department. "
                "Please physically inspect the site, provide your rating, and confirm resolution."
            ),
            "type": "RESOLUTION_VERIFICATION_REQUIRED",
            "is_read": False,
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
        await mongo_db.notifications.insert_one(notification)
        logger.info(f"Notification queued for User {user_id} regarding Complaint #{complaint_id}")

    @staticmethod
    async def notify_resolution_rejected(
        mongo_db: AsyncIOMotorDatabase,
        department_code: str,
        complaint_id: str,
        reason: str,
    ):
        """
        Notifies department that complainant disputed/rejected the claimed resolution.
        """
        notification = {
            "notification_id": f"NOTIF-{secrets.token_hex(6).upper()}",
            "department_code": department_code,
            "complaint_id": complaint_id,
            "title": "Resolution Disputed by Citizen",
            "message": f"Complainant physically inspected #{complaint_id} and reported work is NOT completed: '{reason}'. Reopened for department rework.",
            "type": "RESOLUTION_DISPUTED",
            "is_read": False,
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
        await mongo_db.notifications.insert_one(notification)
