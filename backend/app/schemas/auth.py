"""
CivicBuzz Auth & User Pydantic Schemas
"""

from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class UserRegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    full_name: str = Field(..., min_length=2)
    phone_number: Optional[str] = None
    role: Optional[str] = "CITIZEN"
    aadhaar_number: Optional[str] = None
    is_aadhaar_verified: Optional[bool] = False
    aadhaar_masked: Optional[str] = None
    department_code: Optional[str] = None


class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str
    role: Optional[str] = "citizen"


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user_id: int
    user_uid: str
    email: str
    full_name: str
    role: str
    is_aadhaar_verified: bool = False


class SendOTPRequest(BaseModel):
    target: str = Field(..., description="Email or phone number")
    purpose: str = "LOGIN"  # LOGIN, REGISTRATION, FORGOT_PASSWORD, AADHAAR


class VerifyOTPRequest(BaseModel):
    target: str
    otp_code: str
    purpose: str = "LOGIN"


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    email: EmailStr
    otp_code: str
    new_password: str = Field(..., min_length=8)


class AadhaarInitiateRequest(BaseModel):
    aadhaar_number: str = Field(..., min_length=12, max_length=14, description="12-digit Aadhaar number")


class AadhaarVerifyRequest(BaseModel):
    aadhaar_number: str
    otp_code: str
    transaction_id: Optional[str] = None


class UserProfileResponse(BaseModel):
    id: int
    user_uid: str
    email: str
    full_name: str
    role: str
    phone_number: Optional[str] = None
    aadhaar_masked: Optional[str] = None
    is_aadhaar_verified: bool = False
    ward_id: Optional[int] = None
    created_at: str
