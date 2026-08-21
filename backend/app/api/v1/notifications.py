"""
CivicBuzz Notifications API Router
Returns citizen notifications (e.g. resolution verification requests).
"""

from typing import Any, Dict, List
from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.dependencies import get_current_user, get_mongo_db
from app.models.sql.user import User
from app.schemas.common import APIResponse

router = APIRouter(prefix="/notifications", tags=["Notifications"])


@router.get("", response_model=APIResponse[List[Dict[str, Any]]])
async def get_user_notifications(
    current_user: User = Depends(get_current_user),
    mongo_db: AsyncIOMotorDatabase = Depends(get_mongo_db),
):
    """Fetch notifications for the authenticated user."""
    cursor = mongo_db.notifications.find({"user_id": current_user.id}).sort("created_at", -1).limit(20)
    notifs = await cursor.to_list(length=20)
    for n in notifs:
        n.pop("_id", None)
    return APIResponse(data=notifs)


@router.post("/{notification_id}/read", response_model=APIResponse[Dict[str, Any]])
@router.patch("/{notification_id}/read", response_model=APIResponse[Dict[str, Any]])
async def mark_notification_read(
    notification_id: str,
    current_user: User = Depends(get_current_user),
    mongo_db: AsyncIOMotorDatabase = Depends(get_mongo_db),
):
    """Mark a notification as read."""
    await mongo_db.notifications.update_one(
        {"notification_id": notification_id, "user_id": current_user.id},
        {"$set": {"is_read": True}},
    )
    return APIResponse(message="Notification marked as read.")
