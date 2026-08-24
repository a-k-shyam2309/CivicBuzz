"""
CivicBuzz Mongo Document Models: Complaints, Evidence, Chatbot & Audit Logs
"""

from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class GeoJSONPoint(BaseModel):
    type: str = "Point"
    coordinates: List[float]  # [longitude, latitude]


class LocationData(BaseModel):
    latitude: float
    longitude: float
    address: str = "Unknown Location"
    city: str = "Bhubaneswar"
    municipality: str = "Bhubaneswar Municipal Corporation"
    ward_id: int = 12
    ward_name: str = "Ward 12"
    source: str = "CURRENT_LOCATION"  # CURRENT_LOCATION | MAP_PIN
    location_confidence: float = 1.0


class TimelineEvent(BaseModel):
    step: str
    status: str
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    actor_role: str = "SYSTEM"  # CITIZEN, AI, OFFICER, DEPARTMENT_HEAD, ADMIN
    notes: Optional[str] = None


class AIAnalysisData(BaseModel):
    category: str = "ROAD"
    sub_category: str = "POTHOLE"
    severity: str = "HIGH"
    summary: str = ""
    recommended_department: str = "ROADS_AND_POTHOLES"
    department_display_name: str = "Roads & Potholes Department"
    confidence: float = 0.9
    safety_risk_identified: bool = False
    extracted_keywords: List[str] = Field(default_factory=list)
    language_detected: str = "en"


class EvidenceItem(BaseModel):
    evidence_id: str
    evidence_type: str = "BEFORE_IMAGE"  # BEFORE_IMAGE, AFTER_IMAGE, AUDIO_NOTE, DOCUMENT
    file_url: str
    file_name: str
    file_size_bytes: int
    mime_type: str
    file_hash: str
    uploaded_by: Optional[str] = None
    uploader_role: str = "CITIZEN"
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    verification_status: str = "VERIFIED"  # VERIFIED, LIKELY_VALID, REVIEW_REQUIRED, REJECTED
    verification_notes: Optional[str] = None


class DuplicateData(BaseModel):
    is_duplicate: bool = False
    duplicate_score: float = 0.0
    status: str = "NEW"  # NEW, POSSIBLE_DUPLICATE, LINKED_TO_EXISTING, MERGED
    parent_complaint_id: Optional[str] = None
    related_complaint_ids: List[str] = Field(default_factory=list)
    cluster_count: int = 1


class PriorityData(BaseModel):
    score: float = 50.0
    level: str = "MEDIUM"  # LOW, MEDIUM, HIGH, CRITICAL
    reasons: List[str] = Field(default_factory=list)


class ComplaintDocument(BaseModel):
    complaint_id: str = Field(..., index=True)
    user_id: int
    complainant_name: str
    complainant_email: str
    complainant_phone: Optional[str] = None
    is_anonymous: bool = True

    title: str
    description: str
    category: str
    sub_category: str
    language: str = "en"

    location: LocationData
    location_point: GeoJSONPoint

    status: str = "SUBMITTED"  # SUBMITTED, TRIAGED, ASSIGNED, IN_PROGRESS, EVIDENCE_SUBMITTED, RESOLVED, CLOSED
    department_code: str = "ROADS_AND_POTHOLES"
    department_name: str = "Roads & Potholes"

    severity: str = "HIGH"
    priority: PriorityData = Field(default_factory=PriorityData)
    ai_analysis: AIAnalysisData = Field(default_factory=AIAnalysisData)
    duplicate_info: DuplicateData = Field(default_factory=DuplicateData)

    evidence: List[EvidenceItem] = Field(default_factory=list)
    timeline: List[TimelineEvent] = Field(default_factory=list)

    citizen_confirmed_resolved: bool = False
    dispute_reason: Optional[str] = None
    qr_code_url: Optional[str] = None

    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
