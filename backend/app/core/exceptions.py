"""
CivicBuzz Custom Exceptions and Error Codes
"""

from typing import Any, Optional
from fastapi import HTTPException, status


class CivicBuzzException(HTTPException):
    def __init__(
        self,
        status_code: int,
        message: str,
        error_code: str = "GENERIC_ERROR",
        data: Optional[Any] = None,
    ):
        super().__init__(
            status_code=status_code,
            detail={
                "success": False,
                "message": message,
                "error_code": error_code,
                "data": data,
            },
        )


class EntityNotFoundException(CivicBuzzException):
    def __init__(self, entity_name: str, entity_id: Any):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            message=f"{entity_name} with ID '{entity_id}' not found.",
            error_code=f"{entity_name.upper()}_NOT_FOUND",
        )


class AuthenticationFailedException(CivicBuzzException):
    def __init__(self, message: str = "Invalid email or password."):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            message=message,
            error_code="AUTHENTICATION_FAILED",
        )


class UnauthorizedException(CivicBuzzException):
    def __init__(self, message: str = "You do not have permission to perform this action."):
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            message=message,
            error_code="FORBIDDEN",
        )


class ValidationException(CivicBuzzException):
    def __init__(self, message: str, data: Optional[Any] = None):
        super().__init__(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            message=message,
            error_code="VALIDATION_ERROR",
            data=data,
        )


class DuplicateResourceException(CivicBuzzException):
    def __init__(self, message: str, error_code: str = "DUPLICATE_RESOURCE"):
        super().__init__(
            status_code=status.HTTP_409_CONFLICT,
            message=message,
            error_code=error_code,
        )
