"""
CivicBuzz Application Configuration
Loads environment variables and sets sensible defaults for all services.
"""

from typing import List, Optional, Union
from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # App Information
    APP_ENV: str = "development"
    APP_NAME: str = "CivicBuzz"
    API_V1_PREFIX: str = "/api/v1"
    DEBUG: bool = True
    APP_URL: str = "http://localhost:8000"

    # Security & Tokens
    SECRET_KEY: str = "civicbuzz-super-secret-key-change-in-production-min32chars!"
    JWT_SECRET_KEY: str = "civicbuzz-jwt-secret-key-change-in-production-min32chars!"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # PostgreSQL / PostGIS
    POSTGRES_URL: Optional[str] = "postgresql+asyncpg://postgres:postgres@localhost:5432/civicbuzz"
    POSTGRES_ECHO: bool = False
    USE_SQLITE_FALLBACK: bool = True

    # MongoDB Atlas
    MONGO_URL: Optional[str] = "mongodb://localhost:27017"
    MONGO_DB_NAME: str = "civicbuzz"

    # Google Maps Platform
    GOOGLE_MAPS_API_KEY: Optional[str] = None
    GOOGLE_GEOCODING_API_KEY: Optional[str] = None

    # Gemini AI
    GEMINI_API_KEY: Optional[str] = None
    GEMINI_MODEL: str = "gemini-2.5-flash"

    # Storage & Evidence
    STORAGE_PROVIDER: str = "local"  # 'local', 'cloudinary', 's3'
    UPLOAD_DIR: str = "uploads"
    MAX_UPLOAD_SIZE_BYTES: int = 10 * 1024 * 1024  # 10 MB
    ALLOWED_IMAGE_MIME_TYPES: List[str] = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/heic",
        "image/jpg",
    ]
    ALLOWED_AUDIO_MIME_TYPES: List[str] = [
        "audio/webm",
        "audio/ogg",
        "audio/mpeg",
        "audio/wav",
        "audio/mp4",
        "audio/x-m4a",
    ]

    # Cloudinary Config
    CLOUDINARY_CLOUD_NAME: Optional[str] = None
    CLOUDINARY_API_KEY: Optional[str] = None
    CLOUDINARY_API_SECRET: Optional[str] = None

    # Aadhaar & OTP Provider
    AADHAAR_PROVIDER: str = "mock"  # 'mock', 'uidai_sandbox'
    AADHAAR_SANDBOX_URL: Optional[str] = "https://stage1.uidai.gov.in/onlineekyc/getAuth/"
    OTP_PROVIDER: str = "mock"  # 'mock', 'twilio', 'msg91'
    OTP_API_KEY: Optional[str] = None

    # CORS
    CORS_ORIGINS: Union[str, List[str]] = [
        "http://localhost:3000",
        "http://localhost:5500",
        "http://localhost:8000",
        "http://127.0.0.1:5500",
        "http://127.0.0.1:8000",
        "*",
    ]

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",") if i.strip()]
        elif isinstance(v, (list, str)):
            return v  # type: ignore
        return ["*"]

    # Duplicate Detection & Scoring Weights
    DUPLICATE_LOCATION_WEIGHT: float = 0.35
    DUPLICATE_TEXT_WEIGHT: float = 0.30
    DUPLICATE_CATEGORY_WEIGHT: float = 0.15
    DUPLICATE_TIME_WEIGHT: float = 0.10
    DUPLICATE_IMAGE_WEIGHT: float = 0.10
    DUPLICATE_THRESHOLD: float = 0.75
    NEARBY_SEARCH_RADIUS_METERS: float = 500.0

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="allow",
    )


settings = Settings()
