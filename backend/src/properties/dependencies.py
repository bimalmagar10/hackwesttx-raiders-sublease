"""
Properties domain dependencies.
"""
import uuid
from typing import Optional

from fastapi import Depends
from sqlalchemy.orm import Session

from src.auth.dependencies import get_current_user
from src.auth.models import User
from src.database import get_db
from src.exceptions import NotFoundError, AuthorizationError
from src.properties.models import Property
from src.properties.service import PropertiesService


def get_property_by_id(
    property_id: uuid.UUID,
    db: Session = Depends(get_db)
) -> Property:
    """
    Get property by ID dependency.
    
    Args:
        property_id: Property ID.
        db: Database session.
        
    Returns:
        Property: Property object.
        
    Raises:
        NotFoundError: If property not found.
    """
    properties_service = PropertiesService(db)
    property_obj = properties_service.get_property_by_id(property_id)
    
    if not property_obj:
        raise NotFoundError("Property not found")
    
    return property_obj


def get_user_property(
    property_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Property:
    """
    Get user's property by ID dependency.
    
    Args:
        property_id: Property ID.
        current_user: Current authenticated user.
        db: Database session.
        
    Returns:
        Property: Property object.
        
    Raises:
        NotFoundError: If property not found.
        AuthorizationError: If not owned by user.
    """
    property_obj = get_property_by_id(property_id, db)
    
    if property_obj.owner_id != current_user.user_id:
        raise AuthorizationError("Not authorized to access this property")
    
    return property_obj
