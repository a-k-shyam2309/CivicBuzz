"""
CivicBuzz Security & Cryptography Utilities
Handles password hashing, JWT encoding/decoding, and Aadhaar privacy protection.
"""

import hashlib
import secrets
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional, Union
from jose import JWTError, jwt
from passlib.context import CryptContext
from app.core.config import settings

from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError

# Modern, memory-hard Argon2 password hasher
_hasher = PasswordHasher()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against its hash."""
    try:
        return _hasher.verify(hashed_password, plain_password)
    except Exception:
        # Fallback verification in case of legacy hash format
        return False


def get_password_hash(password: str) -> str:
    """Generate a secure Argon2 hash for a plain password."""
    return _hasher.hash(password)


def create_access_token(
    subject: Union[str, Any],
    role: str = "citizen",
    expires_delta: Optional[timedelta] = None,
    extra_claims: Optional[Dict[str, Any]] = None,
) -> str:
    """Create a signed JWT access token."""
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )

    to_encode: Dict[str, Any] = {
        "exp": expire,
        "sub": str(subject),
        "role": role,
        "type": "access",
    }
    if extra_claims:
        to_encode.update(extra_claims)

    encoded_jwt = jwt.encode(
        to_encode, settings.JWT_SECRET_KEY, algorithm=settings.ALGORITHM
    )
    return encoded_jwt


def create_refresh_token(
    subject: Union[str, Any],
    expires_delta: Optional[timedelta] = None,
) -> str:
    """Create a signed JWT refresh token."""
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            days=settings.REFRESH_TOKEN_EXPIRE_DAYS
        )

    to_encode = {
        "exp": expire,
        "sub": str(subject),
        "type": "refresh",
    }
    encoded_jwt = jwt.encode(
        to_encode, settings.JWT_SECRET_KEY, algorithm=settings.ALGORITHM
    )
    return encoded_jwt


def decode_token(token: str) -> Dict[str, Any]:
    """Decode and validate a signed JWT token."""
    try:
        payload = jwt.decode(
            token, settings.JWT_SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        return payload
    except JWTError as exc:
        raise ValueError(f"Invalid or expired token: {str(exc)}") from exc


def mask_aadhaar(aadhaar_number: str) -> str:
    """
    Mask a 12-digit Aadhaar number, showing only the last 4 digits.
    Example: '123456789012' -> 'XXXX-XXXX-9012'
    """
    cleaned = "".join(filter(str.isdigit, aadhaar_number))
    if len(cleaned) == 12:
        return f"XXXX-XXXX-{cleaned[-4:]}"
    elif len(cleaned) >= 4:
        return f"XXXX-XXXX-{cleaned[-4:]}"
    return "XXXX-XXXX-XXXX"


def hash_aadhaar(aadhaar_number: str) -> str:
    """
    Produce a one-way cryptographic SHA-256 hash of an Aadhaar number
    to uniquely identify a citizen without storing the raw Aadhaar.
    """
    cleaned = "".join(filter(str.isdigit, aadhaar_number))
    salt = settings.SECRET_KEY.encode("utf-8")
    return hashlib.sha256(salt + cleaned.encode("utf-8")).hexdigest()


def generate_otp(length: int = 6) -> str:
    """Generate a secure pseudo-random numeric OTP."""
    digits = "0123456789"
    return "".join(secrets.choice(digits) for _ in range(length))


def compute_file_sha256(content: bytes) -> str:
    """Compute the SHA256 checksum for a file buffer."""
    return hashlib.sha256(content).hexdigest()
