"""
CivicBuzz SQL Models: Projects, Budgets, Participatory Voting, Tenders & Contacts
"""

import enum
from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import BigInteger, Boolean, DateTime, Enum, Float, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.postgres import Base


class ProjectStatus(str, enum.Enum):
    PROPOSED = "PROPOSED"
    APPROVED = "APPROVED"
    BUDGET_ALLOCATED = "BUDGET_ALLOCATED"
    TENDER_PUBLISHED = "TENDER_PUBLISHED"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"
    REJECTED = "REJECTED"


class TenderStatus(str, enum.Enum):
    DRAFT = "DRAFT"
    PUBLISHED = "PUBLISHED"
    IN_PROGRESS = "IN_PROGRESS"
    RESOLVED = "RESOLVED"
    COMPLETED = "COMPLETED"
    CLOSED = "CLOSED"


class Project(Base):
    __tablename__ = "projects"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    project_uid: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    ward_id: Mapped[int] = mapped_column(Integer, nullable=False, index=True)
    department_id: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    category: Mapped[str] = mapped_column(String(100), default="Infrastructure")
    estimated_cost: Mapped[float] = mapped_column(Float, default=0.0)
    allocated_budget: Mapped[float] = mapped_column(Float, default=0.0)
    vote_count: Mapped[int] = mapped_column(Integer, default=0)
    status: Mapped[ProjectStatus] = mapped_column(Enum(ProjectStatus), default=ProjectStatus.PROPOSED)
    icon: Mapped[str] = mapped_column(String(50), default="🛣️")
    location_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    linked_complaint_count: Mapped[int] = mapped_column(Integer, default=0)
    timeline_days: Mapped[int] = mapped_column(Integer, default=30)
    qr_code_url: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)
    created_by: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )


class ProjectVote(Base):
    __tablename__ = "project_votes"
    __table_args__ = (
        UniqueConstraint("user_id", "project_id", name="uq_user_project_vote"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer, nullable=False, index=True)
    project_id: Mapped[int] = mapped_column(Integer, nullable=False, index=True)
    voted_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )


class WardBudget(Base):
    __tablename__ = "ward_budgets"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    ward_id: Mapped[int] = mapped_column(Integer, unique=True, index=True, nullable=False)
    fiscal_year: Mapped[str] = mapped_column(String(20), default="2026-2027")
    total_budget: Mapped[float] = mapped_column(Float, default=10000000.0)  # ₹1 Crore
    allocated_budget: Mapped[float] = mapped_column(Float, default=0.0)
    spent_budget: Mapped[float] = mapped_column(Float, default=0.0)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )


class Tender(Base):
    __tablename__ = "tenders"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    tender_id: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    project_id: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    ward_id: Mapped[int] = mapped_column(Integer, nullable=False, index=True)
    department_name: Mapped[str] = mapped_column(String(255), default="Roads & Potholes")
    category: Mapped[str] = mapped_column(String(100), default="roads")
    location: Mapped[str] = mapped_column(String(255), default="Ward 15")
    estimated_budget: Mapped[float] = mapped_column(Float, default=250000.0)
    duration_days: Mapped[int] = mapped_column(Integer, default=30)
    verified_locations_count: Mapped[int] = mapped_column(Integer, default=3)
    community_votes: Mapped[int] = mapped_column(Integer, default=0)
    status: Mapped[TenderStatus] = mapped_column(Enum(TenderStatus), default=TenderStatus.PUBLISHED)
    stage_progress: Mapped[int] = mapped_column(Integer, default=2)  # 1: Reported, 2: Acknowledged, 3: In Progress, 4: Resolved, 5: Completed
    progress_percentage: Mapped[int] = mapped_column(Integer, default=40)
    closing_in_days: Mapped[int] = mapped_column(Integer, default=7)
    submission_deadline: Mapped[Optional[str]] = mapped_column(String(100), default="24 Aug 2026")
    contractor_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    qr_code_url: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )


class ContactMessage(Base):
    __tablename__ = "contact_messages"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False)
    subject: Mapped[str] = mapped_column(String(255), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    is_read: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
