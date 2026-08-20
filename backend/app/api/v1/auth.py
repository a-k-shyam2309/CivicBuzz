"""
CivicBuzz Auth API Router
Handles citizen registration, login, OTP sending/verification, password recovery,
Aadhaar mock/sandbox verification, and /me profile.
"""

from datetime import datetime, timedelta, timezone
from typing import Any, Dict
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.config import settings
from app.core.security import (
    create_access_token,
    create_refresh_token,
    get_password_hash,
    verify_password,
    generate_otp,
)
from app.core.dependencies import get_current_user, get_db, get_mongo_db
from app.core.exceptions import (
    AuthenticationFailedException,
    DuplicateResourceException,
    EntityNotFoundException,
    ValidationException,
)
from app.models.sql.user import User, UserRole, OTPRecord
from app.schemas.common import APIResponse
from app.schemas.auth import (
    UserRegisterRequest,
    UserLoginRequest,
    TokenResponse,
    SendOTPRequest,
    VerifyOTPRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    AadhaarInitiateRequest,
    AadhaarVerifyRequest,
    UserProfileResponse,
)
from app.services.aadhaar_service import get_aadhaar_provider
from app.services.audit_service import record_audit_event

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=APIResponse[TokenResponse])
async def register(
    payload: UserRegisterRequest,
    db: AsyncSession = Depends(get_db),
    mongo_db: AsyncIOMotorDatabase = Depends(get_mongo_db),
):
    """Register a new citizen or officer account."""
    stmt = select(User).where(User.email == payload.email.lower().strip())
    result = await db.execute(stmt)
    if result.scalar_one_or_none():
        raise DuplicateResourceException("An account with this email already exists.")

    role_val = UserRole.CITIZEN
    if payload.role and payload.role.upper() == "ADMIN":
        role_val = UserRole.ADMIN

    user_uid = f"USR-{payload.email.split('@')[0].upper()[:8]}-{datetime.now().strftime('%M%S')}"

    new_user = User(
        user_uid=user_uid,
        email=payload.email.lower().strip(),
        full_name=payload.full_name.strip(),
        hashed_password=get_password_hash(payload.password),
        phone_number=payload.phone_number,
        role=role_val,
        is_active=True,
        is_verified=False,
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    access_token = create_access_token(subject=new_user.id, role=new_user.role.value)
    refresh_token = create_refresh_token(subject=new_user.id)

    await record_audit_event(
        mongo_db=mongo_db,
        action="USER_REGISTERED",
        entity_type="USER",
        entity_id=str(new_user.id),
        actor_id=str(new_user.id),
        actor_role=new_user.role.value,
        metadata={"email": new_user.email, "role": new_user.role.value},
    )

    data = TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user_id=new_user.id,
        user_uid=new_user.user_uid,
        email=new_user.email,
        full_name=new_user.full_name,
        role=new_user.role.value,
        is_aadhaar_verified=new_user.is_aadhaar_verified,
    )
    return APIResponse(message="Registration successful.", data=data)


@router.post("/login", response_model=APIResponse[TokenResponse])
async def login(
    payload: UserLoginRequest,
    db: AsyncSession = Depends(get_db),
    mongo_db: AsyncIOMotorDatabase = Depends(get_mongo_db),
):
    """Authenticate citizen or administrator using email & password."""
    stmt = select(User).where(User.email == payload.email.lower().strip())
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()

    if not user or not verify_password(payload.password, user.hashed_password):
        raise AuthenticationFailedException("Invalid email or password.")

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is disabled. Please contact municipal support.",
        )

    # If user selected Admin role in frontend switch, ensure they have administrative permissions
    if payload.role and payload.role.lower() == "admin" and user.role not in [UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.OFFICER]:
        # Promote in hackathon demo if admin requested on special email, else allow role verification
        if "admin" in user.email.lower():
            user.role = UserRole.ADMIN
            await db.commit()

    access_token = create_access_token(subject=user.id, role=user.role.value)
    refresh_token = create_refresh_token(subject=user.id)

    await record_audit_event(
        mongo_db=mongo_db,
        action="USER_LOGIN",
        entity_type="USER",
        entity_id=str(user.id),
        actor_id=str(user.id),
        actor_role=user.role.value,
    )

    data = TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user_id=user.id,
        user_uid=user.user_uid,
        email=user.email,
        full_name=user.full_name,
        role=user.role.value,
        is_aadhaar_verified=user.is_aadhaar_verified,
    )
    return APIResponse(message="Login successful.", data=data)


@router.post("/send-otp", response_model=APIResponse[Dict[str, Any]])
async def send_otp(
    payload: SendOTPRequest,
    db: AsyncSession = Depends(get_db),
):
    """Send verification OTP (email / SMS / mock)."""
    otp_code = generate_otp(6)
    expires = datetime.now(timezone.utc) + timedelta(minutes=10)

    otp_record = OTPRecord(
        target=payload.target.strip().lower(),
        otp_code=otp_code,
        purpose=payload.purpose.upper(),
        is_used=False,
        expires_at=expires,
    )
    db.add(otp_record)
    await db.commit()

    # In mock demo mode, return the OTP in response so frontend testing is frictionless
    return APIResponse(
        message="OTP generated successfully. In hackathon mock mode, OTP is provided in data payload.",
        data={"target": payload.target, "otp_code": otp_code, "expires_in_minutes": 10},
    )


@router.post("/verify-otp", response_model=APIResponse[Dict[str, Any]])
async def verify_otp(
    payload: VerifyOTPRequest,
    db: AsyncSession = Depends(get_db),
):
    """Verify submitted 6-digit OTP code."""
    target = payload.target.strip().lower()
    stmt = (
        select(OTPRecord)
        .where(
            OTPRecord.target == target,
            OTPRecord.otp_code == payload.otp_code.strip(),
            OTPRecord.is_used.is_(False),
        )
        .order_by(OTPRecord.id.desc())
    )
    result = await db.execute(stmt)
    record = result.scalar_one_or_none()

    if not record:
        # Also accept standard mock demo OTP
        if payload.otp_code.strip() == "123456":
            return APIResponse(message="OTP verified successfully (Demo Mode).", data={"verified": True})
        raise ValidationException("Invalid or expired OTP.")

    if datetime.now(timezone.utc) > record.expires_at.replace(tzinfo=timezone.utc):
        raise ValidationException("OTP has expired. Please request a new one.")

    record.is_used = True
    await db.commit()

    return APIResponse(message="OTP verified successfully.", data={"verified": True})


@router.post("/forgot-password", response_model=APIResponse[Dict[str, Any]])
async def forgot_password(
    payload: ForgotPasswordRequest,
    db: AsyncSession = Depends(get_db),
):
    """Initiates password recovery by generating an OTP for registered email."""
    stmt = select(User).where(User.email == payload.email.lower().strip())
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()
    if not user:
        # Don't reveal user existence, return generic success
        return APIResponse(message="If the email is registered, an OTP has been sent.", data={"email": payload.email})

    otp_code = generate_otp(6)
    expires = datetime.now(timezone.utc) + timedelta(minutes=15)
    db.add(OTPRecord(
        target=payload.email.lower().strip(),
        otp_code=otp_code,
        purpose="FORGOT_PASSWORD",
        is_used=False,
        expires_at=expires,
    ))
    await db.commit()

    return APIResponse(
        message="OTP sent to registered email address.",
        data={"email": payload.email, "demo_otp": otp_code},
    )


@router.post("/reset-password", response_model=APIResponse[Dict[str, Any]])
async def reset_password(
    payload: ResetPasswordRequest,
    db: AsyncSession = Depends(get_db),
    mongo_db: AsyncIOMotorDatabase = Depends(get_mongo_db),
):
    """Reset account password using verified OTP."""
    target = payload.email.lower().strip()
    stmt = (
        select(OTPRecord)
        .where(
            OTPRecord.target == target,
            OTPRecord.otp_code == payload.otp_code.strip(),
            OTPRecord.is_used.is_(False),
        )
        .order_by(OTPRecord.id.desc())
    )
    res = await db.execute(stmt)
    record = res.scalar_one_or_none()

    if not record and payload.otp_code.strip() != "123456":
        raise ValidationException("Invalid OTP code.")

    stmt_user = select(User).where(User.email == target)
    res_user = await db.execute(stmt_user)
    user = res_user.scalar_one_or_none()
    if not user:
        raise EntityNotFoundException("User", target)

    user.hashed_password = get_password_hash(payload.new_password)
    if record:
        record.is_used = True
    await db.commit()

    await record_audit_event(
        mongo_db=mongo_db,
        action="PASSWORD_RESET",
        entity_type="USER",
        entity_id=str(user.id),
        actor_id=str(user.id),
        actor_role=user.role.value,
    )

    return APIResponse(message="Password reset successfully. You can now sign in with your new password.")


@router.post("/aadhaar/initiate", response_model=APIResponse[Dict[str, Any]])
async def initiate_aadhaar(
    payload: AadhaarInitiateRequest,
    current_user: User = Depends(get_current_user),
):
    """Initiates Aadhaar OTP verification via the configured AadhaarProvider."""
    provider = get_aadhaar_provider()
    result = await provider.initiate_verification(payload.aadhaar_number)
    return APIResponse(message=result["message"], data=result)


@router.post("/aadhaar/verify", response_model=APIResponse[Dict[str, Any]])
async def verify_aadhaar(
    payload: AadhaarVerifyRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
    mongo_db: AsyncIOMotorDatabase = Depends(get_mongo_db),
):
    """Verifies Aadhaar OTP and binds verified identity to current citizen account."""
    provider = get_aadhaar_provider()
    tx_id = payload.transaction_id or "demo_tx"
    result = await provider.verify_otp(tx_id, payload.otp_code)

    if not result.success:
        raise ValidationException(result.message)

    current_user.aadhaar_masked = result.masked_aadhaar
    current_user.aadhaar_hash = result.aadhaar_hash
    current_user.is_aadhaar_verified = True
    await db.commit()

    await record_audit_event(
        mongo_db=mongo_db,
        action="AADHAAR_VERIFIED",
        entity_type="USER",
        entity_id=str(current_user.id),
        actor_id=str(current_user.id),
        actor_role=current_user.role.value,
        metadata={"masked_aadhaar": result.masked_aadhaar},
    )

    return APIResponse(
        message="Aadhaar verification successful. Your citizen identity is now verified.",
        data={"masked_aadhaar": result.masked_aadhaar, "is_verified": True},
    )


@router.get("/me", response_model=APIResponse[UserProfileResponse])
async def get_me(
    current_user: User = Depends(get_current_user),
):
    """Fetch currently authenticated user profile."""
    data = UserProfileResponse(
        id=current_user.id,
        user_uid=current_user.user_uid,
        email=current_user.email,
        full_name=current_user.full_name,
        role=current_user.role.value,
        phone_number=current_user.phone_number,
        aadhaar_masked=current_user.aadhaar_masked,
        is_aadhaar_verified=current_user.is_aadhaar_verified,
        ward_id=current_user.ward_id,
        created_at=current_user.created_at.isoformat() if current_user.created_at else "",
    )
    return APIResponse(data=data)


@router.post("/logout", response_model=APIResponse[Dict[str, Any]])
async def logout(
    current_user: User = Depends(get_current_user),
    mongo_db: AsyncIOMotorDatabase = Depends(get_mongo_db),
):
    """Log out authenticated user and record audit trail."""
    await record_audit_event(
        mongo_db=mongo_db,
        action="USER_LOGOUT",
        entity_type="USER",
        entity_id=str(current_user.id),
        actor_id=str(current_user.id),
        actor_role=current_user.role.value,
    )
    return APIResponse(message="Logged out successfully.")
