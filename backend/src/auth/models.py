"""
Authentication domain models.
"""
import uuid
from datetime import datetime
from decimal import Decimal

from sqlalchemy import Boolean, Column, DateTime, Integer, Numeric, String, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from src.database import Base


class User(Base):
    """
    User model for database table.
    """
    __tablename__ = "users"
    
    user_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    phone_number = Column(String, nullable=True)
    profile_image_url = Column(String, nullable=True)
    date_of_birth = Column(DateTime, nullable=True)
    password_hash = Column(String, nullable=False)
    average_rating = Column(Numeric, nullable=True)
    total_ratings = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow, server_default=func.now())
    updated_at = Column(DateTime, onupdate=datetime.utcnow)
    is_active = Column(Boolean, default=True)
    email_verified = Column(Boolean, default=False)
    
    properties = relationship("Property", back_populates="owner")
    subleases = relationship("SubLease", back_populates="lessor")
    ratings_given = relationship("UserRating", foreign_keys="UserRating.rater_id", back_populates="rater")
    ratings_received = relationship("UserRating", foreign_keys="UserRating.rated_user_id", back_populates="rated_user")
