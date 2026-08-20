"""
CivicBuzz Storage & Image Service
Handles file validation, SHA-256 integrity hashing, local & cloud storage abstractions.
"""

import os
import secrets
import aiofiles
from abc import ABC, abstractmethod
from typing import Optional, Tuple
from fastapi import UploadFile
from app.core.config import settings
from app.core.security import compute_file_sha256
from app.core.exceptions import ValidationException


class StorageProvider(ABC):
    @abstractmethod
    async def save_file(self, content: bytes, filename: str, mime_type: str) -> str:
        """Saves file buffer and returns accessible URL."""


class LocalStorageProvider(StorageProvider):
    def __init__(self, upload_dir: str = settings.UPLOAD_DIR):
        self.upload_dir = upload_dir
        os.makedirs(self.upload_dir, exist_ok=True)

    async def save_file(self, content: bytes, filename: str, mime_type: str) -> str:
        ext = os.path.splitext(filename)[1]
        unique_name = f"{secrets.token_hex(8)}{ext}"
        file_path = os.path.join(self.upload_dir, unique_name)

        async with aiofiles.open(file_path, "wb") as out_file:
            await out_file.write(content)

        return f"/uploads/{unique_name}"


class CloudinaryStorageProvider(StorageProvider):
    def __init__(self):
        # Optional Cloudinary integration
        pass

    async def save_file(self, content: bytes, filename: str, mime_type: str) -> str:
        # Fallback to local if Cloudinary credentials are not configured
        local_provider = LocalStorageProvider()
        return await local_provider.save_file(content, filename, mime_type)


def get_storage_provider() -> StorageProvider:
    if settings.STORAGE_PROVIDER == "cloudinary" and settings.CLOUDINARY_API_KEY:
        return CloudinaryStorageProvider()
    return LocalStorageProvider()


async def process_and_store_upload(file: UploadFile) -> Tuple[str, str, int, str]:
    """
    Validates upload size and MIME type, computes SHA256 hash, and saves file.
    Returns: (file_url, file_hash, file_size_bytes, mime_type)
    """
    content = await file.read()
    file_size = len(content)

    if file_size > settings.MAX_UPLOAD_SIZE_BYTES:
        raise ValidationException(
            f"File size ({file_size / (1024*1024):.1f}MB) exceeds max allowed limit (10MB)."
        )

    mime = file.content_type or "application/octet-stream"
    all_allowed = settings.ALLOWED_IMAGE_MIME_TYPES + settings.ALLOWED_AUDIO_MIME_TYPES

    if mime not in all_allowed and not any(mime.startswith(prefix) for prefix in ["image/", "audio/"]):
        raise ValidationException(f"Unsupported file type: {mime}. Allowed: JPG, PNG, WEBP, Audio files.")

    file_hash = compute_file_sha256(content)
    provider = get_storage_provider()
    file_url = await provider.save_file(content, file.filename or "upload.bin", mime)

    return file_url, file_hash, file_size, mime
