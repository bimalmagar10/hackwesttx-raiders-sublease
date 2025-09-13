"""
Properties domain service.
"""
import json
import uuid
from typing import List, Optional

from fastapi import UploadFile
from sqlalchemy.orm import Session

from src.properties.models import Property
from src.properties.schemas import PropertyCreate, PropertyUpdate, PropertyRead


class PropertiesService:
    """
    Properties service for property operations.
    """
    
    def __init__(self, db: Session):
        self.db = db
    
    def convert_property_to_read(self, prop: Property) -> PropertyRead:
        """
        Convert Property model to PropertyRead schema.
        
        Args:
            prop: Property model instance.
            
        Returns:
            PropertyRead: Converted property schema.
        """
        property_dict = {
            "property_id": prop.property_id,
            "title": prop.title,
            "description": prop.description,
            "property_type": prop.property_type,
            "address_line1": prop.address_line1,
            "address_line2": prop.address_line2,
            "city": prop.city,
            "state": prop.state,
            "country": prop.country,
            "square_feet": prop.square_feet,
            "owner_id": prop.owner_id,
            "amenities": prop.amenities,
            "created_at": prop.created_at,
            "images": None
        }
        
        # Add images if they exist
        if hasattr(prop, 'images') and prop.images:
            property_dict["images"] = [
                {
                    "image_id": str(img.image_id),
                    "image_url": img.image_url,
                    "image_name": img.image_name,
                    "is_primary": img.is_primary,
                    "alt_text": img.alt_text,
                    "image_size": img.image_size,
                    "created_at": img.created_at
                }
                for img in prop.images
            ]
        
        return PropertyRead.model_validate(property_dict)
    
    async def create_property(
        self, 
        title: str,
        description: str,
        property_type: Optional[str],
        address_line1: str,
        address_line2: Optional[str],
        city: str,
        state: str,
        country: str,
        square_feet: Optional[int],
        amenities: Optional[str],
        images: Optional[List[UploadFile]],
        current_user_id: uuid.UUID
    ) -> PropertyRead:
        """
        Create property from form data with amenities parsing and image handling.
        
        Args:
            title: Property title
            description: Property description
            property_type: Type of property
            address_line1: Primary address
            address_line2: Secondary address
            city: City
            state: State
            country: Country
            square_feet: Square footage
            amenities: JSON string of amenities
            images: List of uploaded images
            current_user_id: ID of the user creating the property
            
        Returns:
            PropertyRead: Created property with images
        """
        # Parse amenities from JSON string if provided
        amenities_list = None
        if amenities:
            try:
                amenities_list = json.loads(amenities)
            except json.JSONDecodeError:
                amenities_list = [amenities]  # Treat as single amenity if not valid JSON
        
        # Create PropertyCreate object
        property_data = PropertyCreate(
            title=title,
            description=description,
            property_type=property_type,
            address_line1=address_line1,
            address_line2=address_line2,
            city=city,
            state=state,
            country=country,
            square_feet=square_feet,
            amenities=amenities_list
        )
        
        # Handle images - filter out empty uploads or handle None
        valid_images = None
        if images:
            import logging
            logger = logging.getLogger(__name__)
            
            logger.debug(f"Processing {len(images)} uploaded images")
            valid_images = []
            
            for i, img in enumerate(images):
                logger.debug(f"Image {i+1}: filename='{img.filename}', size={getattr(img, 'size', 'unknown')}")
                
                # Check if image is valid
                if img.filename and img.filename.strip():
                    # Read a small chunk to verify the file has content
                    try:
                        content_sample = await img.read(1024)  # Read first 1KB
                        await img.seek(0)  # Reset file pointer
                        
                        if len(content_sample) > 0:
                            valid_images.append(img)
                            logger.debug(f"Image {i+1} is valid, added to processing list")
                        else:
                            logger.warning(f"Image {i+1} appears to be empty, skipping")
                    except Exception as e:
                        logger.error(f"Error reading image {i+1}: {str(e)}")
                else:
                    logger.warning(f"Image {i+1} has no filename or empty filename, skipping")
            
            logger.info(f"Filtered down to {len(valid_images)} valid images for processing")
            
            if not valid_images:  # If all images were empty, treat as None
                valid_images = None
        
        # Create property with images
        property_obj = await self._create_property_with_images(
            property_data, 
            current_user_id, 
            valid_images
        )
        
        return self.convert_property_to_read(property_obj)
    
    def get_property_by_id(self, property_id: uuid.UUID) -> Optional[Property]:
        """
        Get property by ID.
        
        Args:
            property_id: Property ID.
            
        Returns:
            Property: Property object or None.
        """
        return self.db.query(Property).filter(Property.property_id == property_id).first()
    
    def get_properties_by_owner(self, owner_id: uuid.UUID) -> List[Property]:
        """
        Get properties by owner ID.
        
        Args:
            owner_id: Owner user ID.
            
        Returns:
            List[Property]: List of property objects.
        """
        return self.db.query(Property).filter(Property.owner_id == owner_id).all()
    
    def get_all_properties(self, skip: int = 0, limit: int = 100) -> List[Property]:
        """
        Get all properties with pagination.
        
        Args:
            skip: Number of records to skip.
            limit: Maximum number of records to return.
            
        Returns:
            List[Property]: List of property objects.
        """
        return self.db.query(Property).offset(skip).limit(limit).all()
    
    def _create_property_entity(self, property_data: PropertyCreate, owner_id: uuid.UUID) -> Property:
        """
        Create new property entity.
        
        Args:
            property_data: Property creation data.
            owner_id: Owner user ID.
            
        Returns:
            Property: Created property object.
        """
        property_dict = property_data.model_dump()
        if property_dict.get("amenities"):
            property_dict["amenities"] = {
                str(i): amenity for i, amenity in enumerate(property_dict["amenities"])
            }
        
        property_obj = Property(**property_dict, owner_id=owner_id)
        
        self.db.add(property_obj)
        self.db.commit()
        self.db.refresh(property_obj)
        
        return property_obj
    
    async def _create_property_with_images(
        self, 
        property_data: PropertyCreate, 
        owner_id: uuid.UUID, 
        images: Optional[List[UploadFile]] = None
    ) -> Property:
        """
        Create new property with optional images.
        
        Args:
            property_data: Property creation data.
            owner_id: Owner user ID.
            images: Optional list of image files to upload.
            
        Returns:
            Property: Created property object.
        """
        # Create the property first
        property_obj = self._create_property_entity(property_data, owner_id)
        
        # Upload images if provided
        if images and len(images) > 0:
            from src.propertyimages.service import PropertyImageService
            
            image_service = PropertyImageService(self.db)
            uploaded_images = await image_service.upload_images(
                property_id=property_obj.property_id,
                files=images,
                make_first_primary=True
            )
        
        return property_obj
    
    def update_property(self, property_obj: Property, property_data: PropertyUpdate) -> Property:
        """
        Update property.
        
        Args:
            property_obj: Property object to update.
            property_data: Property update data.
            
        Returns:
            Property: Updated property object.
        """
        update_data = property_data.model_dump(exclude_unset=True)
        
        if "amenities" in update_data and update_data["amenities"]:
            update_data["amenities"] = {
                str(i): amenity for i, amenity in enumerate(update_data["amenities"])
            }
        
        for field, value in update_data.items():
            setattr(property_obj, field, value)
        
        self.db.commit()
        self.db.refresh(property_obj)
        
        return property_obj
    
    def delete_property(self, property_obj: Property) -> bool:
        """
        Delete property.
        
        Args:
            property_obj: Property object to delete.
            
        Returns:
            bool: True if deleted successfully.
        """
        self.db.delete(property_obj)
        self.db.commit()
        return True
