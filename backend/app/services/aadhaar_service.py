"""
CivicBuzz Aadhaar Service
Abstraction layer for Aadhaar-based identity verification.
Supports MockAadhaarProvider (hackathon demo) and UIDAISandboxProvider (authorized integration).
"""

import secrets
from abc import ABC, abstractmethod
from datetime import datetime, timedelta, timezone
from typing import Optional
from app.core.config import settings
from app.core.security import generate_otp, mask_aadhaar, hash_aadhaar


class AadhaarVerificationResult:
    def __init__(
        self,
        success: bool,
        transaction_id: str,
        masked_aadhaar: str,
        aadhaar_hash: str,
        name: Optional[str] = None,
        message: str = "Verification successful.",
    ):
        self.success = success
        self.transaction_id = transaction_id
        self.masked_aadhaar = masked_aadhaar
        self.aadhaar_hash = aadhaar_hash
        self.name = name
        self.message = message


class AadhaarProvider(ABC):
    """Abstract interface for Aadhaar OTP and verification providers."""

    @abstractmethod
    async def initiate_verification(self, aadhaar_number: str) -> dict:
        """Initiate the Aadhaar verification flow. Returns a transaction_id."""

    @abstractmethod
    async def send_otp(self, transaction_id: str) -> bool:
        """Send OTP to the Aadhaar-linked mobile number."""

    @abstractmethod
    async def verify_otp(self, transaction_id: str, otp_code: str) -> AadhaarVerificationResult:
        """Verify the OTP and return full verification result."""


class MockAadhaarProvider(AadhaarProvider):
    """
    Mock Aadhaar provider for hackathon demo mode.
    AADHAAR_PROVIDER=mock in environment.

    Simulates Aadhaar OTP flow without calling UIDAI APIs.
    Clearly documented as demo-only — does not perform real identity verification.
    """

    # In-memory store for demo transactions (use Redis/DB in production)
    _pending: dict = {}
    DEMO_OTP = "123456"

    async def initiate_verification(self, aadhaar_number: str) -> dict:
        tx_id = secrets.token_urlsafe(16)
        expires = datetime.now(timezone.utc) + timedelta(minutes=10)
        self._pending[tx_id] = {
            "aadhaar_number": aadhaar_number,
            "otp": generate_otp(),
            "expires_at": expires,
            "verified": False,
        }
        masked = mask_aadhaar(aadhaar_number)
        return {
            "transaction_id": tx_id,
            "masked_aadhaar": masked,
            "message": f"[MOCK] OTP sent to mobile linked with {masked}. Use OTP: {self.DEMO_OTP}",
        }

    async def send_otp(self, transaction_id: str) -> bool:
        if transaction_id not in self._pending:
            return False
        tx = self._pending[transaction_id]
        if datetime.now(timezone.utc) > tx["expires_at"]:
            del self._pending[transaction_id]
            return False
        tx["otp"] = generate_otp()
        return True

    async def verify_otp(self, transaction_id: str, otp_code: str) -> AadhaarVerificationResult:
        if transaction_id not in self._pending:
            return AadhaarVerificationResult(
                success=False,
                transaction_id=transaction_id,
                masked_aadhaar="XXXX-XXXX-XXXX",
                aadhaar_hash="",
                message="Transaction not found or expired.",
            )

        tx = self._pending[transaction_id]
        if datetime.now(timezone.utc) > tx["expires_at"]:
            del self._pending[transaction_id]
            return AadhaarVerificationResult(
                success=False,
                transaction_id=transaction_id,
                masked_aadhaar="XXXX-XXXX-XXXX",
                aadhaar_hash="",
                message="OTP expired.",
            )

        # In mock mode accept the demo OTP or the generated OTP
        accepted = otp_code == self.DEMO_OTP or otp_code == tx["otp"]
        if not accepted:
            return AadhaarVerificationResult(
                success=False,
                transaction_id=transaction_id,
                masked_aadhaar=mask_aadhaar(tx["aadhaar_number"]),
                aadhaar_hash="",
                message="Invalid OTP.",
            )

        aadhaar = tx["aadhaar_number"]
        del self._pending[transaction_id]
        return AadhaarVerificationResult(
            success=True,
            transaction_id=transaction_id,
            masked_aadhaar=mask_aadhaar(aadhaar),
            aadhaar_hash=hash_aadhaar(aadhaar),
            name="Demo Citizen",
            message="[MOCK] Aadhaar verified successfully. This is a demo — no real UIDAI call was made.",
        )


class UIDAISandboxProvider(AadhaarProvider):
    """
    Placeholder for authorized UIDAI Sandbox integration.
    AADHAAR_PROVIDER=uidai_sandbox in environment.

    Implement using official UIDAI sandbox APIs when production credentials are obtained.
    All UIDAI interaction must be isolated in this provider.
    Raw Aadhaar numbers must NEVER leave this class.
    """

    async def initiate_verification(self, aadhaar_number: str) -> dict:
        raise NotImplementedError(
            "UIDAISandboxProvider: Real UIDAI sandbox integration pending authorized credentials."
        )

    async def send_otp(self, transaction_id: str) -> bool:
        raise NotImplementedError("UIDAISandboxProvider: Not yet implemented.")

    async def verify_otp(self, transaction_id: str, otp_code: str) -> AadhaarVerificationResult:
        raise NotImplementedError("UIDAISandboxProvider: Not yet implemented.")


def get_aadhaar_provider() -> AadhaarProvider:
    """Factory: returns configured Aadhaar provider from environment."""
    if settings.AADHAAR_PROVIDER == "uidai_sandbox":
        return UIDAISandboxProvider()
    return MockAadhaarProvider()
