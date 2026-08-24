"""
CivicBuzz Location & Ward Pydantic Schemas
"""

from typing import List, Optional
from pydantic import BaseModel, Field


class LocationResolveRequest(BaseModel):
    latitude: float = Field(..., ge=-90.0, le=90.0)
    longitude: float = Field(..., ge=-180.0, le=180.0)


class LocationResolveResponse(BaseModel):
    latitude: float
    longitude: float
    address: str
    city: str
    municipality: str
    ward_id: int
    ward_name: str
    responsible_department: str
    location_confidence: float = 1.0


class WardResponse(BaseModel):
    id: int
    ward_number: int
    ward_name: str
    municipality_id: int
    zone: Optional[str] = None
    center_lat: float
    center_lng: float
    radius_meters: float
