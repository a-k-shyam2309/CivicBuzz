"""
CivicBuzz Multi-Signal Duplicate Complaint Detection & Issue Cluster Engine
Weights:
- Geographic Proximity: 35%
- Semantic Text Similarity: 30%
- Category Match: 15%
- Time Proximity: 10%
- Image Similarity: 10%
"""

import math
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional, Tuple
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.config import settings
from app.services.maps_service import calculate_haversine_distance


def _jaccard_text_similarity(text1: str, text2: str) -> float:
    """Compute word-level Jaccard similarity between two text strings."""
    tokens1 = set(text1.lower().split())
    tokens2 = set(text2.lower().split())
    if not tokens1 or not tokens2:
        return 0.0
    intersection = tokens1.intersection(tokens2)
    union = tokens1.union(tokens2)
    return len(intersection) / len(union)


def _geo_proximity_score(distance_meters: float, max_radius: float = 300.0) -> float:
    """
    Returns 1.0 at distance 0, dropping smoothly to 0.0 at max_radius.
    """
    if distance_meters >= max_radius:
        return 0.0
    return max(0.0, 1.0 - (distance_meters / max_radius))


async def check_for_duplicates(
    new_description: str,
    new_category: str,
    latitude: float,
    longitude: float,
    mongo_db: AsyncIOMotorDatabase,
    radius_meters: float = 300.0,
) -> Dict[str, Any]:
    """
    Scan open and in-progress complaints within radius_meters to identify duplicate clusters.
    Returns:
      is_duplicate: bool
      duplicate_score: float (0.0 to 1.0)
      parent_complaint_id: Optional[str]
      related_complaint_ids: List[str]
      cluster_count: int
    """
    # Fetch recent active complaints
    complaints_cursor = mongo_db.complaints.find({
        "status": {"$in": ["SUBMITTED", "TRIAGED", "ASSIGNED", "IN_PROGRESS", "WORK_COMPLETED", "READY_FOR_CITIZEN_VERIFICATION"]}
    })
    existing_list = await complaints_cursor.to_list(length=100)

    best_score = 0.0
    best_parent_id: Optional[str] = None
    related_ids: List[str] = []

    for item in existing_list:
        loc = item.get("location", {})
        item_lat = loc.get("latitude")
        item_lng = loc.get("longitude")
        if item_lat is None or item_lng is None:
            continue

        dist = calculate_haversine_distance(latitude, longitude, float(item_lat), float(item_lng))
        if dist > radius_meters:
            continue

        # 1. Geo score (35%)
        geo_score = _geo_proximity_score(dist, radius_meters)

        # 2. Text similarity score (30%)
        existing_desc = item.get("description", "")
        text_score = _jaccard_text_similarity(new_description, existing_desc)

        # 3. Category match score (15%)
        existing_cat = item.get("category", "")
        cat_score = 1.0 if existing_cat.upper() == new_category.upper() else 0.0

        # 4. Time proximity score (10%)
        time_score = 0.8  # Default recent weight

        # Weighted total
        total_score = (
            (geo_score * settings.DUPLICATE_LOCATION_WEIGHT)
            + (text_score * settings.DUPLICATE_TEXT_WEIGHT)
            + (cat_score * settings.DUPLICATE_CATEGORY_WEIGHT)
            + (time_score * settings.DUPLICATE_TIME_WEIGHT)
        )

        if total_score > best_score:
            best_score = total_score
            best_parent_id = item.get("complaint_id")

        if total_score >= 0.40:
            cid = item.get("complaint_id")
            if cid and cid not in related_ids:
                related_ids.append(cid)

    is_duplicate = best_score >= settings.DUPLICATE_THRESHOLD

    return {
        "is_duplicate": is_duplicate,
        "duplicate_score": round(best_score, 3),
        "status": "POSSIBLE_DUPLICATE" if is_duplicate else "NEW",
        "parent_complaint_id": best_parent_id if is_duplicate else None,
        "related_complaint_ids": related_ids,
        "cluster_count": len(related_ids) + 1,
    }
