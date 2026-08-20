"""
CivicBuzz API v1 Router Aggregator
"""

from fastapi import APIRouter
from app.api.v1.auth import router as auth_router
from app.api.v1.complaints import router as complaints_router
from app.api.v1.locations import router as locations_router
from app.api.v1.evidence import router as evidence_router
from app.api.v1.chat import router as chat_router
from app.api.v1.projects import router as projects_router
from app.api.v1.budgets import router as budgets_router
from app.api.v1.votes import router as votes_router
from app.api.v1.tenders import router as tenders_router
from app.api.v1.public import router as public_router
from app.api.v1.admin import router as admin_router
from app.api.v1.contact import router as contact_router
from app.api.v1.notifications import router as notifications_router

api_router = APIRouter()

api_router.include_router(auth_router)
api_router.include_router(complaints_router)
api_router.include_router(locations_router)
api_router.include_router(evidence_router)
api_router.include_router(chat_router)
api_router.include_router(projects_router)
api_router.include_router(budgets_router)
api_router.include_router(votes_router)
api_router.include_router(tenders_router)
api_router.include_router(public_router)
api_router.include_router(admin_router)
api_router.include_router(contact_router)
api_router.include_router(notifications_router)
