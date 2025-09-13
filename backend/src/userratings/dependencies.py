"""
User ratings domain dependencies.
"""
import uuid
from typing import Optional

from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session

from src.auth.dependencies import get_current_user
from src.auth.models import User
from src.database import get_db
from src.exceptions import NotFoundError, AuthorizationError
from src.userratings.models import UserRating
from src.userratings.service import UserRatingService


def get_rating_by_id(
    rating_id: uuid.UUID,
    db: Session = Depends(get_db)
) -> UserRating:
    """
    Get user rating by ID dependency.
    
    Args:
        rating_id: Rating ID.
        db: Database session.
        
    Returns:
        UserRating: Rating object.
        
    Raises:
        NotFoundError: If rating not found.
    """
    service = UserRatingService(db)
    rating = service.get_rating_by_id(rating_id)
    if not rating:
        raise NotFoundError(f"Rating with ID {rating_id} not found")
    return rating


def get_user_rating(
    rating_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> UserRating:
    """
    Get user rating by ID with ownership check.
    
    Args:
        rating_id: Rating ID.
        current_user: Current authenticated user.
        db: Database session.
        
    Returns:
        UserRating: Rating object.
        
    Raises:
        NotFoundError: If rating not found.
        AuthorizationError: If user doesn't own the rating.
    """
    service = UserRatingService(db)
    rating = service.get_rating_by_id(rating_id)
    if not rating:
        raise NotFoundError(f"Rating with ID {rating_id} not found")
    
    # Check if current user is the rater
    if rating.rater_id != current_user.user_id:
        raise AuthorizationError("You don't have permission to access this rating")
    
    return rating


def get_rating_service(db: Session = Depends(get_db)) -> UserRatingService:
    """
    Get user rating service dependency.
    
    Args:
        db: Database session.
        
    Returns:
        UserRatingService: Rating service instance.
    """
    return UserRatingService(db)
