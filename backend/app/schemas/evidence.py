"""
CivicBuzz Evidence, Chat, Project, Tender, Vote, Admin & Contact Pydantic Schemas
"""

from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, EmailStr, Field


# Evidence Schemas
class EvidenceUploadResponse(BaseModel):
    evidence_id: str
    file_url: str
    file_name: str
    file_size_bytes: int
    mime_type: str
    file_hash: str
    verification_status: str
    verification_notes: Optional[str] = None


class EvidenceVerifyRequest(BaseModel):
    evidence_id: str
    verification_status: str = Field(..., description="VERIFIED, LIKELY_VALID, REVIEW_REQUIRED, REJECTED")
    notes: Optional[str] = None


# Chatbot Schemas
class ChatMessageRequest(BaseModel):
    message: str = Field(..., min_length=1)
    session_id: Optional[str] = None
    language: str = "en"
    complaint_id: Optional[str] = None


class ChatMessageResponse(BaseModel):
    reply: str
    session_id: str
    language: str
    referenced_complaints: List[str] = Field(default_factory=list)
    suggested_actions: List[str] = Field(default_factory=list)


# Participatory Budgeting & Project Schemas
class ProjectCreateRequest(BaseModel):
    title: str = Field(..., min_length=3)
    description: str = Field(..., min_length=10)
    ward_id: int
    category: str = "Infrastructure"
    estimated_cost: float = Field(..., gt=0)
    icon: Optional[str] = "🛣️"
    location_name: Optional[str] = None


class ProjectResponse(BaseModel):
    id: int
    project_uid: str
    title: str
    description: str
    ward_id: int
    category: str
    estimated_cost: float
    allocated_budget: float
    vote_count: int
    vote_percentage: float = 0.0
    status: str
    icon: str
    location_name: Optional[str] = None
    linked_complaint_count: int
    timeline_days: int
    qr_code_url: Optional[str] = None
    created_at: str


class ProjectRankingResponse(BaseModel):
    rank: int
    project: ProjectResponse


# Tender Schemas
class TenderCreateRequest(BaseModel):
    title: str = Field(..., min_length=3)
    description: str = Field(..., min_length=10)
    ward_id: int
    category: str = "roads"
    location: str = "Ward 15"
    estimated_budget: float = Field(..., gt=0)
    duration_days: int = 30
    verified_locations_count: int = 3
    submission_deadline: Optional[str] = "24 Aug 2026"
    status: str = "PUBLISHED"


class TenderUpdateRequest(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    stage_progress: Optional[int] = None
    progress_percentage: Optional[int] = None
    contractor_name: Optional[str] = None


class TenderResponse(BaseModel):
    id: int
    tender_id: str
    title: str
    description: str
    ward_id: int
    department_name: str
    category: str
    location: str
    estimated_budget: float
    duration_days: int
    verified_locations_count: int
    community_votes: int
    status: str
    stage_progress: int
    progress_percentage: int
    closing_in_days: int
    submission_deadline: Optional[str] = None
    contractor_name: Optional[str] = None
    qr_code_url: Optional[str] = None
    created_at: str


# Voting Schemas
class VoteRequest(BaseModel):
    project_id: int


class VoteResponse(BaseModel):
    success: bool
    message: str
    project_id: int
    total_votes: int


# Admin & Analytics Schemas
class AdminDashboardStatsResponse(BaseModel):
    total_reported: int
    total_resolved: int
    total_open: int
    total_overdue: int
    resolution_rate_percent: float
    reported_change_percent: float
    resolved_change_percent: float
    open_change_percent: float
    overdue_change_percent: float
    active_citizens: int
    communities_count: int


# Contact Schemas
class ContactSubmitRequest(BaseModel):
    name: str = Field(..., min_length=2)
    email: EmailStr
    subject: str = Field(..., min_length=2)
    message: str = Field(..., min_length=5)


class ContactResponse(BaseModel):
    id: int
    name: str
    email: str
    subject: str
    message: str
    created_at: str
