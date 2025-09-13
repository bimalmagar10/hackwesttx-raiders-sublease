"""
Subleases domain dependencies.
"""
import uuid
from typing import Optional

from fastapi import Depends
from sqlalchemy.orm import Session

from src.auth.dependencies import get_current_user
from src.auth.models import User
from src.database import get_db
from src.exceptions import NotFoundError, AuthorizationError
from src.subleases.models import SubLease
from src.subleases.service import SubLeaseService


def get_sublease_by_id(
    sublease_id: uuid.UUID,
    db: Session = Depends(get_db)
) -> SubLease:
    """
    Get sublease by ID dependency.
    
    Args:
        sublease_id: Sublease ID.
        db: Database session.
        
    Returns:
        SubLease: Sublease object.
        
    Raises:
        NotFoundError: If sublease not found.
    """
    sublease_service = SubLeaseService(db)
    sublease = sublease_service.get_sublease_by_id(sublease_id)
    
    if not sublease:
        raise NotFoundError("Sublease not found")
    
    return sublease


def get_user_sublease(
    sublease_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> SubLease:
    """
    Get user's sublease by ID dependency.
    
    Args:
        sublease_id: Sublease ID.
        current_user: Current authenticated user.
        db: Database session.
        
    Returns:
        SubLease: Sublease object.
        
    Raises:
        NotFoundError: If sublease not found.
        AuthorizationError: If not owned by user.
    """
    sublease = get_sublease_by_id(sublease_id, db)
    
    if sublease.lessor_id != current_user.user_id:
        raise AuthorizationError("Not authorized to access this sublease")
    
    return sublease


def get_user_property_sublease(
    sublease_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> SubLease:
    """
    Get sublease by ID if user owns the property dependency.
    
    Args:
        sublease_id: Sublease ID.
        current_user: Current authenticated user.
        db: Database session.
        
    Returns:
        SubLease: Sublease object.
        
    Raises:
        NotFoundError: If sublease not found.
        AuthorizationError: If user doesn't own the property.
    """
    sublease = get_sublease_by_id(sublease_id, db)
    
    # Check if user owns the property that this sublease belongs to
    if sublease.property.owner_id != current_user.user_id:
        raise AuthorizationError("Not authorized to access this sublease")
    
    return sublease
