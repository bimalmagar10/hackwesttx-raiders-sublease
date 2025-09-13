"""
Property images domain models.
"""
import uuid
from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from src.database import Base


class PropertyImage(Base):
    """
    Property image model for storing multiple images per property.
    """
    __tablename__ = "property_images"
    
    image_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    property_id = Column(UUID(as_uuid=True), ForeignKey("properties.property_id"), nullable=False)
    image_url = Column(String, nullable=False)  # File path or URL
    image_name = Column(String, nullable=False)  # Original filename
    image_size = Column(Integer, nullable=True)  # File size in bytes
    image_order = Column(Integer, default=0)  # Display order (0 = main image)
    alt_text = Column(String, nullable=True)  # For accessibility
    is_primary = Column(Boolean, default=False)  # Main/featured image
    created_at = Column(DateTime, default=datetime.utcnow, server_default=func.now())
    
    # Relationship
    property = relationship("Property", back_populates="images")
