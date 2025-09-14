"""
Subleases domain service.
"""
import uuid
from datetime import datetime
from typing import List, Optional

from sqlalchemy.orm import Session, joinedload

from src.subleases.models import SubLease, SubLeaseStatus
from src.subleases.schemas import SubLeaseCreate, SubLeaseUpdate
from src.properties.models import Property
from src.propertyimages.models import PropertyImage
from src.auth.models import User


class SubLeaseService:
    """
    Sublease service for sublease operations.
    """
    
    def __init__(self, db: Session):
        self.db = db
    
    def get_sublease_by_id(self, sublease_id: uuid.UUID) -> Optional[SubLease]:
        """
        Get sublease by ID with property images and lessor details.
        
        Args:
            sublease_id: Sublease ID.
            
        Returns:
            SubLease: Sublease object with property images and lessor details or None.
        """
        return self.db.query(SubLease).options(
            joinedload(SubLease.property).joinedload(Property.images),
            joinedload(SubLease.lessor)
        ).filter(SubLease.sublease_id == sublease_id).first()
    
    def get_subleases_by_lessor(self, lessor_id: uuid.UUID) -> List[SubLease]:
        """
        Get subleases by lessor ID with property images and lessor details.
        
        Args:
            lessor_id: Lessor user ID.
            
        Returns:
            List[SubLease]: List of sublease objects with property images and lessor details.
        """
        return self.db.query(SubLease).options(
            joinedload(SubLease.property).joinedload(Property.images),
            joinedload(SubLease.lessor)
        ).filter(SubLease.lessor_id == lessor_id).all()
    
    def get_subleases_by_property(self, property_id: uuid.UUID) -> List[SubLease]:
        """
        Get subleases by property ID.
        
        Args:
            property_id: Property ID.
            
        Returns:
            List[SubLease]: List of sublease objects.
        """
        return self.db.query(SubLease).filter(SubLease.property_id == property_id).all()
    
    def get_all_subleases(self, skip: int = 0, limit: int = 100, status: Optional[SubLeaseStatus] = None) -> List[SubLease]:
        """
        Get all subleases with pagination, optional status filter, property images, and lessor details.
        
        Args:
            skip: Number of records to skip.
            limit: Maximum number of records to return.
            status: Optional status filter.
            
        Returns:
            List[SubLease]: List of sublease objects with property images and lessor details.
        """
        query = self.db.query(SubLease).options(
            joinedload(SubLease.property).joinedload(Property.images),
            joinedload(SubLease.lessor)
        )
        
        if status:
            query = query.filter(SubLease.status == status.value)
        
        return query.offset(skip).limit(limit).all()
    
    def create_sublease(self, sublease_data: SubLeaseCreate, lessor_id: uuid.UUID) -> SubLease:
        """
        Create a new sublease.
        
        Args:
            sublease_data: Sublease creation data.
            lessor_id: Lessor user ID.
            
        Returns:
            SubLease: Created sublease object.
        """
        sublease = SubLease(
            property_id=sublease_data.property_id,
            lessor_id=lessor_id,
            title=sublease_data.title,
            description=sublease_data.description,
            rate=sublease_data.rate,
            minimum_stay_days=sublease_data.minimum_stay_days,
            maximum_stay_days=sublease_data.maximum_stay_days,
            available_from=sublease_data.available_from,
            available_until=sublease_data.available_until,
            status=sublease_data.status.value
        )
        
        self.db.add(sublease)
        self.db.commit()
        self.db.refresh(sublease)
        
        return sublease
    
    def update_sublease(self, sublease: SubLease, sublease_data: SubLeaseUpdate) -> SubLease:
        """
        Update an existing sublease.
        
        Args:
            sublease: Sublease object to update.
            sublease_data: Sublease update data.
            
        Returns:
            SubLease: Updated sublease object.
        """
        for field, value in sublease_data.model_dump(exclude_unset=True).items():
            if field == "status" and value is not None:
                setattr(sublease, field, value.value)
            elif value is not None:
                setattr(sublease, field, value)
        
        sublease.updated_at = datetime.utcnow()
        
        self.db.commit()
        self.db.refresh(sublease)
        
        return sublease
    
    def delete_sublease(self, sublease: SubLease) -> None:
        """
        Delete a sublease.
        
        Args:
            sublease: Sublease object to delete.
        """
        self.db.delete(sublease)
        self.db.commit()
