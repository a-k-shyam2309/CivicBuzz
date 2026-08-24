"""
CivicBuzz FastAPI Dependency Injection
Provides authentication, database sessions, and role-based access control.
"""

from typing import List, Optional
from fastapi import Depends, Header, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.config import settings
from app.core.exceptions import AuthenticationFailedException, UnauthorizedException
from app.core.security import decode_token
from app.db.mongo import get_mongo_db
from app.db.postgres import get_db
from app.models.sql.user import User, UserRole

security = HTTPBearer(auto_error=False)


async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: AsyncSession = Depends(get_db),
) -> User:
    """Extract and validate the currently authenticated user from Bearer JWT."""
    if not credentials or not credentials.credentials:
        raise AuthenticationFailedException("Authentication required. Please provide a valid Bearer token.")

    token = credentials.credentials
    try:
        payload = decode_token(token)
        user_id_str = payload.get("sub")
        if not user_id_str:
            raise AuthenticationFailedException("Invalid token payload: missing subject.")
        user_id = int(user_id_str)
    except Exception as e:
        raise AuthenticationFailedException(f"Invalid or expired token: {str(e)}")

    stmt = select(User).where(User.id == user_id)
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()

    if not user:
        raise AuthenticationFailedException("User belonging to this token no longer exists.")

    if not user.is_active:
        raise UnauthorizedException("Your account is disabled. Please contact support.")

    return user


async def get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: AsyncSession = Depends(get_db),
) -> Optional[User]:
    """Return the authenticated user if Bearer token is present, else None."""
    if not credentials or not credentials.credentials:
        return None
    try:
        return await get_current_user(credentials=credentials, db=db)
    except HTTPException:
        return None


async def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    """Ensure user is active."""
    if not current_user.is_active:
        raise UnauthorizedException("Inactive user account.")
    return current_user


class RoleChecker:
    """FastAPI Dependency for Role-Based Access Control (RBAC)."""

    def __init__(self, allowed_roles: List[UserRole]):
        self.allowed_roles = allowed_roles

    def __call__(self, current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in self.allowed_roles and current_user.role != UserRole.SUPER_ADMIN:
            raise UnauthorizedException(
                f"Access forbidden: requires one of {[r.value for r in self.allowed_roles]} roles."
            )
        return current_user


# Role-specific dependency shortcuts
require_admin = RoleChecker([UserRole.ADMIN, UserRole.SUPER_ADMIN])
require_officer = RoleChecker([UserRole.OFFICER, UserRole.DEPARTMENT_HEAD, UserRole.ADMIN, UserRole.SUPER_ADMIN])
require_dept_head = RoleChecker([UserRole.DEPARTMENT_HEAD, UserRole.ADMIN, UserRole.SUPER_ADMIN])
