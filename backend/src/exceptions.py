"""
Global exception classes for the application.
"""
from fastapi import HTTPException, status


class BaseAPIException(HTTPException):
    """
    Base exception class for API errors.
    """
    status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR
    detail: str = "Internal server error"

    def __init__(self, detail: str = None):
        super().__init__(
            status_code=self.status_code, 
            detail=detail or self.detail
        )


class NotFoundError(BaseAPIException):
    """
    Exception for not found errors.
    """
    status_code = status.HTTP_404_NOT_FOUND
    detail = "Resource not found"


class ValidationError(BaseAPIException):
    """
    Exception for validation errors.
    """
    status_code = status.HTTP_400_BAD_REQUEST
    detail = "Validation error"


class AuthenticationError(BaseAPIException):
    """
    Exception for authentication errors.
    """
    status_code = status.HTTP_401_UNAUTHORIZED
    detail = "Authentication failed"


class AuthorizationError(BaseAPIException):
    """
    Exception for authorization errors.
    """
    status_code = status.HTTP_403_FORBIDDEN
    detail = "Access denied"


class FileUploadError(BaseAPIException):
    """
    Exception for file upload errors.
    """
    status_code = status.HTTP_400_BAD_REQUEST
    detail = "File upload error"


class FileProcessingError(BaseAPIException):
    """
    Exception for file processing errors.
    """
    status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
    detail = "File processing failed"


class PropertyNotFoundError(NotFoundError):
    """
    Exception for property not found errors.
    """
    detail = "Property not found"


class UnauthorizedError(AuthenticationError):
    """
    Exception for unauthorized access errors.
    """
    detail = "Unauthorized access"
