"""
User ratings domain models.
"""
import uuid
from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from src.database import Base


class UserRating(Base):
    """
    User rating model for sublease ratings.
    """
    __tablename__ = "user_ratings"
    
    rating_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    sublease_id = Column(UUID(as_uuid=True), ForeignKey("subleases.sublease_id"), nullable=False)
    rater_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id"), nullable=False)
    rated_user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id"), nullable=False)
    rating = Column(Integer, nullable=False)  # 1-5 scale
    review = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, server_default=func.now())
    
    # Relationships
    sublease = relationship("SubLease", back_populates="ratings")
    rater = relationship("User", foreign_keys=[rater_id], back_populates="ratings_given")
    rated_user = relationship("User", foreign_keys=[rated_user_id], back_populates="ratings_received")
