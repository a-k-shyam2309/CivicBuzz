"""
CivicBuzz Location & PostGIS Spatial Service
Resolves coordinate points to Municipal Wards and responsible departments.
Provides spatial radius queries for nearby complaints and projects.
"""

import json
import logging
from typing import Any, Dict, List, Optional, Tuple
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from shapely.geometry import Point, shape
from app.core.config import settings
from app.models.sql.ward import Ward
from app.models.sql.department import Department
from app.services.maps_service import reverse_geocode, calculate_haversine_distance

logger = logging.getLogger("civicbuzz.services.location")


async def resolve_location(
    latitude: float,
    longitude: float,
    db: AsyncSession,
) -> Dict[str, Any]:
    """
    Resolve coordinates to an Address, Ward, Municipality, and Default Department.
    Uses PostGIS / Shapely point-in-polygon polygon check if ward boundaries exist,
    or geodesic nearest-centroid algorithm as fallback.
    """
    geocode_info = await reverse_geocode(latitude, longitude)

    # Fetch all wards from SQL
    stmt = select(Ward)
    result = await db.execute(stmt)
    wards = result.scalars().all()

    assigned_ward_id = 12
    assigned_ward_name = "Ward 12"
    min_dist = float("inf")

    point = Point(longitude, latitude)

    # 1. Try polygon containment if boundary_geojson is populated
    matched_by_polygon = False
    for ward in wards:
        if ward.boundary_geojson:
            try:
                geom = shape(json.loads(ward.boundary_geojson))
                if geom.contains(point):
                    assigned_ward_id = ward.ward_number
                    assigned_ward_name = ward.ward_name
                    matched_by_polygon = True
                    break
            except Exception:
                pass

    # 2. Fallback to nearest centroid distance
    if not matched_by_polygon and wards:
        for ward in wards:
            dist = calculate_haversine_distance(
                latitude, longitude, ward.center_lat, ward.center_lng
            )
            if dist < min_dist:
                min_dist = dist
                assigned_ward_id = ward.ward_number
                assigned_ward_name = ward.ward_name

    return {
        "latitude": latitude,
        "longitude": longitude,
        "address": geocode_info.get("address", "Bhubaneswar, Odisha"),
        "city": geocode_info.get("city", "Bhubaneswar"),
        "municipality": geocode_info.get("municipality", "Bhubaneswar Municipal Corporation"),
        "ward_id": assigned_ward_id,
        "ward_name": assigned_ward_name,
        "responsible_department": "ROADS_AND_POTHOLES",
        "location_confidence": 0.95 if matched_by_polygon else 0.88,
    }


async def get_all_wards(db: AsyncSession) -> List[Ward]:
    """Fetch all wards."""
    stmt = select(Ward).order_by(Ward.ward_number)
    result = await db.execute(stmt)
    return list(result.scalars().all())
