"""
CivicBuzz SQL Models Export
"""

from app.models.sql.user import User, UserRole, OTPRecord
from app.models.sql.ward import Municipality, Ward
from app.models.sql.department import Department
from app.models.sql.project import (
    Project,
    ProjectStatus,
    ProjectVote,
    WardBudget,
    Tender,
    TenderStatus,
    ContactMessage,
)

__all__ = [
    "User",
    "UserRole",
    "OTPRecord",
    "Municipality",
    "Ward",
    "Department",
    "Project",
    "ProjectStatus",
    "ProjectVote",
    "WardBudget",
    "Tender",
    "TenderStatus",
    "ContactMessage",
]
