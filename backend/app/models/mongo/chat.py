"""
CivicBuzz Mongo Document Models: Citizen Chatbot & Audit Trail
"""

from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class ChatMessage(BaseModel):
    message_id: str
    session_id: str
    user_id: Optional[int] = None
    role: str  # user | assistant | system
    content: str
    language: str = "en"
    referenced_complaints: List[str] = Field(default_factory=list)
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class ChatSession(BaseModel):
    session_id: str
    user_id: Optional[int] = None
    language: str = "en"
    messages: List[ChatMessage] = Field(default_factory=list)
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class AuditLogDocument(BaseModel):
    audit_id: str
    actor_id: Optional[str] = None  # user_id or 'ANONYMOUS' or 'SYSTEM'
    actor_role: str = "SYSTEM"  # CITIZEN, OFFICER, DEPARTMENT_HEAD, ADMIN, SUPER_ADMIN, SYSTEM
    action: str  # USER_LOGIN, COMPLAINT_CREATED, ASSIGNMENT_CHANGED, EVIDENCE_UPLOADED, STATUS_CHANGED, VOTE_CAST, TENDER_CREATED, etc.
    entity_type: str  # COMPLAINT, USER, PROJECT, TENDER, EVIDENCE, VOTE
    entity_id: str
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    metadata: Dict[str, Any] = Field(default_factory=dict)
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
