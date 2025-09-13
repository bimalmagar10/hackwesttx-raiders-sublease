"""
Subleases domain models.
"""
import uuid
from datetime import datetime, date
from decimal import Decimal
from enum import Enum

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, Numeric, Date, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from src.database import Base


class SubLeaseStatus(str, Enum):
    """Sublease status enumeration."""
    ACTIVE = "active"
    INACTIVE = "inactive"
    RENTED = "rented"
    EXPIRED = "expired"


class SubLease(Base):
    """
    SubLease model for database table.
    """
    __tablename__ = "subleases"
    
    sublease_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    property_id = Column(UUID(as_uuid=True), ForeignKey("properties.property_id"), nullable=False)
    lessor_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id"), nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(String, nullable=True)
    rate = Column(Numeric(10, 2), nullable=False)
    minimum_stay_days = Column(Integer, nullable=False, default=1)
    maximum_stay_days = Column(Integer, nullable=True)
    available_from = Column(Date, nullable=False)
    available_until = Column(Date, nullable=False)
    status = Column(String(20), nullable=False, default=SubLeaseStatus.ACTIVE.value)
    created_at = Column(DateTime, default=datetime.utcnow, server_default=func.now())
    updated_at = Column(DateTime, onupdate=datetime.utcnow)
    
    # Relationships
    property = relationship("Property", back_populates="subleases")
    lessor = relationship("User", back_populates="subleases")
    ratings = relationship("UserRating", back_populates="sublease")