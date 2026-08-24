"""
CivicBuzz Common Pydantic Schemas and API Response Wrappers
"""

from typing import Any, Generic, List, Optional, TypeVar
from pydantic import BaseModel, Field

DataT = TypeVar("DataT")


class APIResponse(BaseModel, Generic[DataT]):
    success: bool = True
    message: str = "Operation completed successfully."
    error_code: Optional[str] = None
    data: Optional[DataT] = None


class PaginatedResponse(BaseModel, Generic[DataT]):
    items: List[DataT]
    total: int
    page: int = 1
    page_size: int = 20
    total_pages: int = 1
