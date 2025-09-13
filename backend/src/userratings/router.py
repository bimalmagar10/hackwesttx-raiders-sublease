"""
User ratings domain router.
"""
import uuid
from typing import List, Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from src.auth.dependencies import get_current_user
from src.auth.models import User
from src.database import get_db
from src.userratings.dependencies import get_rating_by_id, get_user_rating, get_rating_service
from src.userratings.models import UserRating
from src.userratings.schemas import (
    UserRatingCreate, UserRatingRead, UserRatingUpdate, UserRatingDetail
)
from src.userratings.service import UserRatingService
from src.utils.responses import success_response


router = APIRouter()


@router.get("/", response_model=List[UserRatingRead])
def get_ratings(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Maximum number of records to return"),
    sublease_id: Optional[uuid.UUID] = Query(None, description="Filter by sublease ID"),
    rater_id: Optional[uuid.UUID] = Query(None, description="Filter by rater ID"),
    rated_user_id: Optional[uuid.UUID] = Query(None, description="Filter by rated user ID"),
    current_user: User = Depends(get_current_user),
    service: UserRatingService = Depends(get_rating_service)
) -> List[UserRatingRead]:
    """
    Get all ratings with pagination and optional filters.
    
    Args:
        skip: Number of records to skip.
        limit: Maximum number of records to return.
        sublease_id: Optional sublease ID filter.
        rater_id: Optional rater ID filter.
        rated_user_id: Optional rated user ID filter.
        service: User rating service.
        
    Returns:
        List[UserRatingRead]: List of ratings.
    """
    if sublease_id:
        ratings = service.get_ratings_by_sublease(sublease_id)
    elif rater_id:
        ratings = service.get_ratings_by_rater(rater_id)
    elif rated_user_id:
        ratings = service.get_ratings_for_user(rated_user_id)
    else:
        ratings = service.get_all_ratings(skip=skip, limit=limit)
    
    return [UserRatingRead.model_validate(rating) for rating in ratings]


@router.get("/me", response_model=List[UserRatingRead])
def get_my_ratings(
    current_user: User = Depends(get_current_user),
    service: UserRatingService = Depends(get_rating_service)
) -> List[UserRatingRead]:
    """
    Get current user's ratings (ratings given by the user).
    
    Args:
        current_user: Current authenticated user.
        service: User rating service.
        
    Returns:
        List[UserRatingRead]: List of user's ratings.
    """
    ratings = service.get_ratings_by_rater(current_user.user_id)
    return [UserRatingRead.model_validate(rating) for rating in ratings]


@router.get("/received", response_model=List[UserRatingRead])
def get_received_ratings(
    current_user: User = Depends(get_current_user),
    service: UserRatingService = Depends(get_rating_service)
) -> List[UserRatingRead]:
    """
    Get ratings received by the current user.
    
    Args:
        current_user: Current authenticated user.
        service: User rating service.
        
    Returns:
        List[UserRatingRead]: List of ratings received.
    """
    ratings = service.get_ratings_for_user(current_user.user_id)
    return [UserRatingRead.model_validate(rating) for rating in ratings]


@router.get("/{rating_id}", response_model=UserRatingRead)
def get_rating(
    rating: UserRating = Depends(get_rating_by_id),
    current_user: User = Depends(get_current_user)
) -> UserRatingRead:
    """
    Get a specific rating by ID.
    
    Args:
        rating: Rating object from dependency.
        
    Returns:
        UserRatingRead: Rating data.
    """
    return UserRatingRead.model_validate(rating)


@router.post("/", response_model=UserRatingRead, status_code=201)
def create_rating(
    rating_data: UserRatingCreate,
    current_user: User = Depends(get_current_user),
    service: UserRatingService = Depends(get_rating_service)
) -> UserRatingRead:
    """
    Create a new rating.
    
    Args:
        rating_data: Rating data.
        current_user: Current authenticated user.
        service: User rating service.
        
    Returns:
        UserRatingRead: Created rating.
    """
    rating = service.create_rating(rating_data, current_user.user_id)
    return UserRatingRead.model_validate(rating)


@router.put("/{rating_id}", response_model=UserRatingRead)
def update_rating(
    rating_data: UserRatingUpdate,
    rating: UserRating = Depends(get_user_rating),
    service: UserRatingService = Depends(get_rating_service)
) -> UserRatingRead:
    """
    Update an existing rating.
    
    Args:
        rating_data: Updated rating data.
        rating: Rating object from dependency (with ownership check).
        service: User rating service.
        
    Returns:
        UserRatingRead: Updated rating.
    """
    updated_rating = service.update_rating(rating.rating_id, rating_data)
    return UserRatingRead.model_validate(updated_rating)


@router.delete("/{rating_id}", status_code=204)
def delete_rating(
    rating: UserRating = Depends(get_user_rating),
    service: UserRatingService = Depends(get_rating_service)
) -> None:
    """
    Delete a rating.
    
    Args:
        rating: Rating object from dependency (with ownership check).
        service: User rating service.
    """
    service.delete_rating(rating.rating_id)


@router.get("/stats/{user_id}", response_model=dict)
def get_user_rating_stats(
    user_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    service: UserRatingService = Depends(get_rating_service)
) -> dict:
    """
    Get rating statistics for a user.
    
    Args:
        user_id: User ID.
        service: User rating service.
        
    Returns:
        dict: Rating statistics.
    """
    average_rating = service.get_user_average_rating(user_id)
    rating_count = service.get_user_rating_count(user_id)
    
    return {
        "user_id": user_id,
        "average_rating": average_rating,
        "total_ratings": rating_count
    }
