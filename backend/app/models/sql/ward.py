"""
CivicBuzz SQL Models: Municipalities, Wards & Spatial Boundaries
"""

from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import Float, Integer, String, Text, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from app.db.postgres import Base


class Municipality(Base):
    __tablename__ = "municipalities"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    state: Mapped[str] = mapped_column(String(100), default="Odisha")
    city: Mapped[str] = mapped_column(String(100), default="Bhubaneswar")
    code: Mapped[str] = mapped_column(String(20), unique=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )


class Ward(Base):
    __tablename__ = "wards"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    ward_number: Mapped[int] = mapped_column(Integer, index=True, nullable=False)
    ward_name: Mapped[str] = mapped_column(String(255), nullable=False)
    municipality_id: Mapped[int] = mapped_column(Integer, nullable=False)
    zone: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)

    # Centroid coordinate helpers
    center_lat: Mapped[float] = mapped_column(Float, nullable=False)
    center_lng: Mapped[float] = mapped_column(Float, nullable=False)
    radius_meters: Mapped[float] = mapped_column(Float, default=2000.0)

    # GeoJSON representation of polygon boundary
    boundary_geojson: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
