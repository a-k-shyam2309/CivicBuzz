"""
CivicBuzz Locations & Wards API Router
Provides coordinate reverse geocoding, ward resolution, and boundary information.
"""

from typing import Any, Dict, List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.dependencies import get_db
from app.schemas.common import APIResponse
from app.schemas.location import LocationResolveResponse, WardResponse
from app.services.location_service import resolve_location, get_all_wards

router = APIRouter(prefix="/locations", tags=["Locations & Wards"])


@router.get("/resolve", response_model=APIResponse[LocationResolveResponse])
async def resolve_coordinates(
    lat: float = Query(..., ge=-90.0, le=90.0, description="Latitude"),
    lng: float = Query(..., ge=-180.0, le=180.0, description="Longitude"),
    db: AsyncSession = Depends(get_db),
):
    """
    Resolve coordinates to an address, municipal ward, and default responsible department.
    """
    res = await resolve_location(lat, lng, db)
    data = LocationResolveResponse(
        latitude=res["latitude"],
        longitude=res["longitude"],
        address=res["address"],
        city=res["city"],
        municipality=res["municipality"],
        ward_id=res["ward_id"],
        ward_name=res["ward_name"],
        responsible_department=res["responsible_department"],
        location_confidence=res["location_confidence"],
    )
    return APIResponse(data=data)


@router.get("/wards", response_model=APIResponse[List[WardResponse]])
async def list_wards(
    db: AsyncSession = Depends(get_db),
):
    """Fetch all municipal wards in Bhubaneswar."""
    wards = await get_all_wards(db)
    data = [
        WardResponse(
            id=w.id,
            ward_number=w.ward_number,
            ward_name=w.ward_name,
            municipality_id=w.municipality_id,
            zone=w.zone,
            center_lat=w.center_lat,
            center_lng=w.center_lng,
            radius_meters=w.radius_meters,
        )
        for w in wards
    ]
    return APIResponse(data=data)
