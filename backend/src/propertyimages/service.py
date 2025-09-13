"""
Property images domain service.
"""
import os
import uuid
from typing import List, Optional

from fastapi import UploadFile
from sqlalchemy.orm import Session

from src.config import settings
from src.propertyimages.models import PropertyImage
from src.utils.file_upload import validate_image_file, save_upload_file


class PropertyImageService:
    """
    Property image service for image operations.
    """
    
    def __init__(self, db: Session):
        self.db = db
    
    def get_images_by_property(self, property_id: uuid.UUID) -> List[PropertyImage]:
        """
        Get all images for a property, ordered by image_order.
        
        Args:
            property_id: Property ID.
            
        Returns:
            List[PropertyImage]: List of image objects.
        """
        return self.db.query(PropertyImage).filter(
            PropertyImage.property_id == property_id
        ).order_by(PropertyImage.image_order, PropertyImage.created_at).all()
    
    def get_primary_image(self, property_id: uuid.UUID) -> Optional[PropertyImage]:
        """
        Get the primary image for a property.
        
        Args:
            property_id: Property ID.
            
        Returns:
            PropertyImage: Primary image or None.
        """
        return self.db.query(PropertyImage).filter(
            PropertyImage.property_id == property_id,
            PropertyImage.is_primary == True
        ).first()
    
    def get_image_by_id(self, image_id: uuid.UUID) -> Optional[PropertyImage]:
        """
        Get image by ID.
        
        Args:
            image_id: Image ID.
            
        Returns:
            PropertyImage: Image object or None.
        """
        return self.db.query(PropertyImage).filter(
            PropertyImage.image_id == image_id
        ).first()
    
    async def upload_images(
        self, 
        property_id: uuid.UUID, 
        files: List[UploadFile],
        make_first_primary: bool = True
    ) -> List[PropertyImage]:
        """
        Upload multiple images for a property.
        
        Args:
            property_id: Property ID.
            files: List of uploaded files.
            make_first_primary: Whether to make the first image primary if no primary exists.
            
        Returns:
            List[PropertyImage]: List of created image objects.
        """
        import logging
        logger = logging.getLogger(__name__)
        
        logger.info(f"Starting upload of {len(files)} images for property {property_id}")
        
        uploaded_images = []
        failed_uploads = []
        existing_images_count = self.db.query(PropertyImage).filter(
            PropertyImage.property_id == property_id
        ).count()
        
        # Check if there's already a primary image
        has_primary = self.get_primary_image(property_id) is not None
        
        for index, file in enumerate(files):
            try:
                logger.debug(f"Processing image {index + 1}/{len(files)}: {file.filename}")
                
                # Validate the image file
                await validate_image_file(file)
                logger.debug(f"Image {index + 1} passed validation")
                
                # Create unique filename using image UUID
                file_extension = os.path.splitext(file.filename)[1].lower()
                image_id = uuid.uuid4()
                unique_filename = f"{image_id}{file_extension}"
                
                # Save the image file (save_upload_file handles the full path construction)
                logger.debug(f"Saving image {index + 1} to disk...")
                file_path = await save_upload_file(
                    file, 
                    "properties",  # Just the relative directory name
                    unique_filename
                )
                logger.debug(f"Image {index + 1} saved successfully to {file_path}")
                
                # Get file size
                file_size = os.path.getsize(file_path)
                logger.debug(f"Image {index + 1} file size: {file_size} bytes")
                
                # Create database record
                image_order = existing_images_count + index
                is_primary = (index == 0 and make_first_primary and not has_primary)
                
                db_image = PropertyImage(
                    image_id=image_id,
                    property_id=property_id,
                    image_url=f"/images/properties/{unique_filename}",
                    image_name=file.filename,
                    image_size=file_size,
                    image_order=image_order,
                    is_primary=is_primary
                )
                
                self.db.add(db_image)
                uploaded_images.append(db_image)
                logger.debug(f"Image {index + 1} database record created")
                
            except Exception as e:
                # Log error but continue with other files
                error_msg = f"Failed to upload image {index + 1} ({file.filename}): {str(e)}"
                logger.error(error_msg)
                failed_uploads.append({"index": index + 1, "filename": file.filename, "error": str(e)})
                continue
        
        if uploaded_images:
            try:
                logger.debug(f"Committing {len(uploaded_images)} images to database...")
                self.db.commit()
                # Refresh all objects
                for image in uploaded_images:
                    self.db.refresh(image)
                logger.info(f"Successfully uploaded {len(uploaded_images)} images")
            except Exception as e:
                logger.error(f"Failed to commit images to database: {str(e)}")
                self.db.rollback()
                raise
        
        if failed_uploads:
            logger.warning(f"Failed to upload {len(failed_uploads)} images: {failed_uploads}")
        
        return uploaded_images
    
    def delete_image(self, image_id: uuid.UUID) -> bool:
        """
        Delete an image and its file.
        
        Args:
            image_id: Image ID.
            
        Returns:
            bool: True if deleted, False if not found.
        """
        db_image = self.get_image_by_id(image_id)
        if not db_image:
            return False
        
        # Delete physical file
        try:
            # Handle both old and new path structures
            file_path = os.path.join(settings.UPLOAD_DIR, db_image.image_url.lstrip("/images/"))
            if os.path.exists(file_path):
                os.remove(file_path)
        except Exception:
            pass  # Continue even if file deletion fails
        
        # Delete database record
        self.db.delete(db_image)
        self.db.commit()
        return True
    
    def set_primary_image(self, property_id: uuid.UUID, image_id: uuid.UUID) -> Optional[PropertyImage]:
        """
        Set an image as the primary image for a property.
        
        Args:
            property_id: Property ID.
            image_id: Image ID to set as primary.
            
        Returns:
            PropertyImage: Updated primary image or None.
        """
        # Unset all primary images for the property
        self.db.query(PropertyImage).filter(
            PropertyImage.property_id == property_id
        ).update({"is_primary": False})
        
        # Set the specified image as primary
        db_image = self.db.query(PropertyImage).filter(
            PropertyImage.image_id == image_id,
            PropertyImage.property_id == property_id
        ).first()
        
        if db_image:
            db_image.is_primary = True
            self.db.commit()
            self.db.refresh(db_image)
        
        return db_image
    
    def reorder_images(self, property_id: uuid.UUID, image_orders: List[dict]) -> List[PropertyImage]:
        """
        Reorder property images.
        
        Args:
            property_id: Property ID.
            image_orders: List of {image_id, order} dictionaries.
            
        Returns:
            List[PropertyImage]: Updated image objects.
        """
        updated_images = []
        
        for item in image_orders:
            image_id = uuid.UUID(item["image_id"])
            order = item["order"]
            
            db_image = self.db.query(PropertyImage).filter(
                PropertyImage.image_id == image_id,
                PropertyImage.property_id == property_id
            ).first()
            
            if db_image:
                db_image.image_order = order
                updated_images.append(db_image)
        
        if updated_images:
            self.db.commit()
            for image in updated_images:
                self.db.refresh(image)
        
        return updated_images
