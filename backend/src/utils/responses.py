"""
Response utilities for standardized API responses.
"""
from typing import Any, List, Optional, TypeVar
from datetime import datetime, timezone

from pydantic import BaseModel
from enum import Enum


T = TypeVar('T')


class ResponseStatus(str, Enum):
    """
    Response status enumeration.
    """
    SUCCESS = "success"
    ERROR = "error"
    WARNING = "warning"


class ResponseMeta(BaseModel):
    """
    Metadata for API responses.
    """
    timestamp: datetime = datetime.now(timezone.utc)
    request_id: Optional[str] = None
    version: str = "v1"


class ErrorDetail(BaseModel):
    """
    Detailed error information.
    """
    code: str
    message: str
    field: Optional[str] = None


class SuccessResponse(BaseModel):
    """
    Success response with data.
    """
    status: ResponseStatus = ResponseStatus.SUCCESS
    message: str
    data: Optional[Any] = None
    meta: ResponseMeta = ResponseMeta()


class ErrorResponse(BaseModel):
    """
    Error response without data.
    """
    status: ResponseStatus = ResponseStatus.ERROR
    message: str
    errors: List[ErrorDetail] = []
    meta: ResponseMeta = ResponseMeta()


def success_response(
    data: Optional[Any] = None,
    message: str = "Operation successful",
    request_id: Optional[str] = None
) -> SuccessResponse:
    """
    Create a standardized success response.
    
    Args:
        data: Response data.
        message: Success message.
        request_id: Request ID.
        
    Returns:
        SuccessResponse: Formatted success response.
    """
    response = SuccessResponse(
        message=message,
        data=data
    )
    if request_id:
        response.meta.request_id = request_id
    return response


def error_response(
    message: str,
    errors: Optional[List[ErrorDetail]] = None,
    request_id: Optional[str] = None
) -> ErrorResponse:
    """
    Create a standardized error response.
    
    Args:
        message: Error message.
        errors: List of error details.
        request_id: Request ID.
        
    Returns:
        ErrorResponse: Formatted error response.
    """
    response = ErrorResponse(
        message=message,
        errors=errors or []
    )
    if request_id:
        response.meta.request_id = request_id
    return response
