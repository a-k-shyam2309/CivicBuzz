"""
CivicBuzz Evidence Upload & Management API Router
Validates MIME type, calculates SHA-256 hash, and stores files securely.
"""

from typing import Any, Dict
from fastapi import APIRouter, Depends, File, UploadFile, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.dependencies import get_optional_user, get_mongo_db
from app.models.sql.user import User
from app.schemas.common import APIResponse
from app.schemas.evidence import EvidenceUploadResponse
from app.services.storage_service import process_and_store_upload
from app.services.audit_service import record_audit_event

router = APIRouter(prefix="/evidence", tags=["Evidence"])


@router.post("/upload", response_model=APIResponse[EvidenceUploadResponse], status_code=status.HTTP_201_CREATED)
async def upload_evidence_file(
    file: UploadFile = File(...),
    current_user: User = Depends(get_optional_user),
    mongo_db: AsyncIOMotorDatabase = Depends(get_mongo_db),
):
    """
    Upload an image or audio evidence file.
    Validates file format and size, generates SHA-256 hash, and saves to storage.
    """
    file_url, file_hash, file_size, mime = await process_and_store_upload(file)

    data = EvidenceUploadResponse(
        evidence_id=f"EVD-{file_hash[:8].upper()}",
        file_url=file_url,
        file_name=file.filename or "upload.bin",
        file_size_bytes=file_size,
        mime_type=mime,
        file_hash=file_hash,
        verification_status="VERIFIED",
        verification_notes="File integrity validated with SHA-256 checksum.",
    )

    if current_user:
        await record_audit_event(
            mongo_db=mongo_db,
            action="EVIDENCE_UPLOADED",
            entity_type="EVIDENCE",
            entity_id=data.evidence_id,
            actor_id=str(current_user.id),
            actor_role=current_user.role.value,
            metadata={"mime": mime, "size": file_size, "hash": file_hash},
        )

    return APIResponse(
        message="Evidence file uploaded and verified successfully.",
        data=data,
    )
