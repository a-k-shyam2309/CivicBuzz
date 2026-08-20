"""
CivicBuzz Chatbot API Router
Gemini-powered multilingual citizen assistant with privacy guardrails and complaint context.
"""

import secrets
from typing import Any, Dict
from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.dependencies import get_optional_user, get_mongo_db
from app.models.sql.user import User
from app.schemas.common import APIResponse
from app.schemas.evidence import ChatMessageRequest, ChatMessageResponse
from app.services.gemini_service import generate_chatbot_response

router = APIRouter(prefix="/chat", tags=["Citizen Assistant Chatbot"])


@router.post("/message", response_model=APIResponse[ChatMessageResponse])
async def send_chat_message(
    payload: ChatMessageRequest,
    current_user: User = Depends(get_optional_user),
    mongo_db: AsyncIOMotorDatabase = Depends(get_mongo_db),
):
    """
    Interact with the Gemini-powered CivicBuzz Assistant.
    Supports English, Hindi, and regional languages.
    Provides tracking assistance, reporting guidance, and budgeting explanations.
    """
    session_id = payload.session_id or f"SES-{secrets.token_hex(6).upper()}"

    # Fetch user's complaints for contextual answering
    user_complaints = []
    if current_user:
        cursor = mongo_db.complaints.find({"user_id": current_user.id}).sort("created_at", -1).limit(5)
        user_complaints = await cursor.to_list(length=5)

    # Fetch recent session history
    history_cursor = mongo_db.chat_messages.find({"session_id": session_id}).sort("timestamp", 1).limit(10)
    chat_history = await history_cursor.to_list(length=10)

    ai_result = await generate_chatbot_response(
        user_message=payload.message,
        session_id=session_id,
        chat_history=chat_history,
        user_complaints=user_complaints,
        language=payload.language,
    )

    # Save user message
    await mongo_db.chat_messages.insert_one({
        "session_id": session_id,
        "user_id": current_user.id if current_user else None,
        "role": "user",
        "content": payload.message,
        "language": payload.language,
    })

    # Save assistant response
    await mongo_db.chat_messages.insert_one({
        "session_id": session_id,
        "user_id": current_user.id if current_user else None,
        "role": "assistant",
        "content": ai_result["reply"],
        "language": payload.language,
    })

    data = ChatMessageResponse(
        reply=ai_result["reply"],
        session_id=session_id,
        language=ai_result.get("language", payload.language),
        referenced_complaints=ai_result.get("referenced_complaints", []),
        suggested_actions=ai_result.get("suggested_actions", []),
    )
    return APIResponse(data=data)
