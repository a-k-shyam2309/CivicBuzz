"""
CivicBuzz Complaint Pydantic Schemas
"""

from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field
from app.models.mongo.complaint import (
    AIAnalysisData,
    DuplicateData,
    EvidenceItem,
    LocationData,
    PriorityData,
    TimelineEvent,
)


class ComplaintCreateRequest(BaseModel):
    description: str = Field(..., min_length=5, description="Detailed problem description")
    category: Optional[str] = None
    sub_category: Optional[str] = None
    latitude: float = Field(..., ge=-90.0, le=90.0)
    longitude: float = Field(..., ge=-180.0, le=180.0)
    location_source: str = Field("CURRENT_LOCATION", description="CURRENT_LOCATION or MAP_PIN")
    address: Optional[str] = None
    language: str = "en"
    is_anonymous: bool = True
    image_url: Optional[str] = None
    audio_url: Optional[str] = None


class ComplaintUpdateRequest(BaseModel):
    description: Optional[str] = None
    status: Optional[str] = None
    department_code: Optional[str] = None
    is_anonymous: Optional[bool] = None


class ComplaintStatusUpdateRequest(BaseModel):
    status: str
    notes: Optional[str] = None
    resolution_evidence_url: Optional[str] = None


class ComplaintAssignRequest(BaseModel):
    department_code: str
    department_name: Optional[str] = None
    notes: Optional[str] = None


class CitizenDisputeRequest(BaseModel):
    action: str = Field("CONFIRM", description="'CONFIRM' to close or 'CHALLENGE' to dispute resolution")
    reason: Optional[str] = None


class ComplaintDetailResponse(BaseModel):
    complaint_id: str
    user_id: int
    complainant_name: Optional[str] = None  # None for unauthorized users if is_anonymous
    complainant_email: Optional[str] = None
    complainant_phone: Optional[str] = None
    is_anonymous: bool
    title: str
    description: str
    category: str
    sub_category: str
    language: str
    location: LocationData
    status: str
    department_code: str
    department_name: str
    severity: str
    priority: PriorityData
    ai_analysis: AIAnalysisData
    duplicate_info: DuplicateData
    evidence: List[EvidenceItem]
    timeline: List[TimelineEvent]
    citizen_confirmed_resolved: bool
    dispute_reason: Optional[str] = None
    qr_code_url: Optional[str] = None
    created_at: str
    updated_at: str


class PublicComplaintResponse(BaseModel):
    complaint_id: str
    title: str
    category: str
    sub_category: str
    ward: str
    approximate_location: str
    severity: str
    priority_level: str
    status: str
    created_at: str
    responsible_department: str
    public_evidence: List[Dict[str, Any]]
    resolution_timeline: List[Dict[str, Any]]
    qr_code_url: Optional[str] = None
