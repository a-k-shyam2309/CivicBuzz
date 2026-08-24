"""
CivicBuzz Backend - Main Application Entrypoint
FastAPI Async-First Architecture with PostgreSQL + PostGIS, MongoDB Atlas,
Gemini AI, Google Maps Platform, and Aadhaar Provider abstractions.
"""

import os
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.core.exceptions import CivicBuzzException
from app.db import postgres
from app.db.mongo import init_mongo, close_mongo, get_mongo_db
from app.db.seed import seed_database
from app.api.v1 import api_router

# Setup Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("civicbuzz")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager for database initialization and cleanup."""
    logger.info("Initializing CivicBuzz Backend services...")
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

    # Initialize databases
    await postgres.init_db()
    await init_mongo()

    # Seed initial data
    try:
        async with postgres.AsyncSessionLocal() as session:
            mongo_db = await get_mongo_db()
            await seed_database(session, mongo_db)
    except Exception as e:
        logger.warning(f"Database seed note: {e}", exc_info=True)

    logger.info("CivicBuzz Backend is ready.")
    yield

    # Cleanup
    await close_mongo()
    logger.info("CivicBuzz Backend shutdown complete.")


app = FastAPI(
    title="CivicBuzz API",
    description="AI-Powered Multilingual Civic Grievance Triage, Transparency, and Participatory Budgeting Platform.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
)

# CORS Middleware
origins = settings.CORS_ORIGINS if isinstance(settings.CORS_ORIGINS, list) else ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if origins != ["*"] else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Static Uploads
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")


# Exception Handlers
@app.exception_handler(CivicBuzzException)
async def civicbuzz_exception_handler(request: Request, exc: CivicBuzzException):
    return JSONResponse(
        status_code=exc.status_code,
        content=exc.detail,
    )


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception on {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "message": "An internal server error occurred. Please try again later.",
            "error_code": "INTERNAL_SERVER_ERROR",
            "data": None,
        },
    )


# Healthcheck Endpoint
@app.get("/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "environment": settings.APP_ENV,
        "version": "1.0.0",
    }


@app.get("/", tags=["Health"])
async def root():
    return {
        "message": "Welcome to CivicBuzz API — Turn Civic Issues into Visible Action.",
        "documentation": "/docs",
        "api_v1": settings.API_V1_PREFIX,
    }


# Include API v1 Router
app.include_router(api_router, prefix=settings.API_V1_PREFIX)
