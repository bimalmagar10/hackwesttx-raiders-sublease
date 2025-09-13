"""
User ratings domain service.
"""
import uuid
from datetime import datetime
from typing import List, Optional

from sqlalchemy.orm import Session

from src.userratings.models import UserRating
from src.userratings.schemas import UserRatingCreate, UserRatingUpdate


class UserRatingService:
    """
    User rating service for rating operations.
    """
    
    def __init__(self, db: Session):
        self.db = db
    
    def get_rating_by_id(self, rating_id: uuid.UUID) -> Optional[UserRating]:
        """
        Get user rating by ID.
        
        Args:
            rating_id: Rating ID.
            
        Returns:
            UserRating: User rating object or None.
        """
        return self.db.query(UserRating).filter(UserRating.rating_id == rating_id).first()
    
    def get_ratings_by_sublease(self, sublease_id: uuid.UUID) -> List[UserRating]:
        """
        Get all ratings for a sublease.
        
        Args:
            sublease_id: Sublease ID.
            
        Returns:
            List[UserRating]: List of rating objects.
        """
        return self.db.query(UserRating).filter(UserRating.sublease_id == sublease_id).all()
    
    def get_ratings_by_rater(self, rater_id: uuid.UUID) -> List[UserRating]:
        """
        Get all ratings given by a user.
        
        Args:
            rater_id: Rater user ID.
            
        Returns:
            List[UserRating]: List of rating objects.
        """
        return self.db.query(UserRating).filter(UserRating.rater_id == rater_id).all()
    
    def get_ratings_for_user(self, rated_user_id: uuid.UUID) -> List[UserRating]:
        """
        Get all ratings received by a user.
        
        Args:
            rated_user_id: Rated user ID.
            
        Returns:
            List[UserRating]: List of rating objects.
        """
        return self.db.query(UserRating).filter(UserRating.rated_user_id == rated_user_id).all()
    
    def get_all_ratings(self, skip: int = 0, limit: int = 100) -> List[UserRating]:
        """
        Get all ratings with pagination.
        
        Args:
            skip: Number of records to skip.
            limit: Maximum number of records to return.
            
        Returns:
            List[UserRating]: List of rating objects.
        """
        return self.db.query(UserRating).offset(skip).limit(limit).all()
    
    def create_rating(self, rating_data: UserRatingCreate, rater_id: uuid.UUID) -> UserRating:
        """
        Create a new user rating.
        
        Args:
            rating_data: Rating data.
            rater_id: ID of the user giving the rating.
            
        Returns:
            UserRating: Created rating object.
        """
        db_rating = UserRating(
            rating_id=uuid.uuid4(),
            sublease_id=rating_data.sublease_id,
            rater_id=rater_id,
            rated_user_id=rating_data.rated_user_id,
            rating=rating_data.rating,
            review=rating_data.review
        )
        self.db.add(db_rating)
        self.db.commit()
        self.db.refresh(db_rating)
        return db_rating
    
    def update_rating(self, rating_id: uuid.UUID, rating_data: UserRatingUpdate) -> Optional[UserRating]:
        """
        Update an existing rating.
        
        Args:
            rating_id: Rating ID.
            rating_data: Updated rating data.
            
        Returns:
            UserRating: Updated rating object or None.
        """
        db_rating = self.get_rating_by_id(rating_id)
        if not db_rating:
            return None
        
        for key, value in rating_data.model_dump(exclude_unset=True).items():
            setattr(db_rating, key, value)
        
        self.db.commit()
        self.db.refresh(db_rating)
        return db_rating
    
    def delete_rating(self, rating_id: uuid.UUID) -> bool:
        """
        Delete a rating.
        
        Args:
            rating_id: Rating ID.
            
        Returns:
            bool: True if deleted, False if not found.
        """
        db_rating = self.get_rating_by_id(rating_id)
        if not db_rating:
            return False
        
        self.db.delete(db_rating)
        self.db.commit()
        return True
    
    def get_user_average_rating(self, user_id: uuid.UUID) -> Optional[float]:
        """
        Calculate the average rating for a user.
        
        Args:
            user_id: User ID.
            
        Returns:
            float: Average rating or None if no ratings.
        """
        ratings = self.get_ratings_for_user(user_id)
        if not ratings:
            return None
        
        return sum(rating.rating for rating in ratings) / len(ratings)
    
    def get_user_rating_count(self, user_id: uuid.UUID) -> int:
        """
        Get the total number of ratings for a user.
        
        Args:
            user_id: User ID.
            
        Returns:
            int: Number of ratings.
        """
        return self.db.query(UserRating).filter(UserRating.rated_user_id == user_id).count()
