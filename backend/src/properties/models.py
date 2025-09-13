"""
Properties domain models.
"""
import uuid
from datetime import datetime

from sqlalchemy import JSON, Column, DateTime, ForeignKey, Integer, String, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from src.database import Base


class Property(Base):
    """
    Property model for database table.
    """
    __tablename__ = "properties"
    
    property_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    title = Column(String(100), nullable=False)
    description = Column(String, nullable=False)
    property_type = Column(String(50), nullable=True)
    address_line1 = Column(String, nullable=False)
    address_line2 = Column(String(100), nullable=True)
    city = Column(String(60), nullable=False)
    state = Column(String(60), nullable=False)
    country = Column(String(60), nullable=False)
    square_feet = Column(Integer, nullable=True)
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id"), nullable=False)
    amenities = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, server_default=func.now())
    updated_at = Column(DateTime, onupdate=datetime.utcnow)
    
    owner = relationship("User", back_populates="properties")
    subleases = relationship("SubLease", back_populates="property")
    images = relationship("PropertyImage", back_populates="property", cascade="all, delete-orphan")
