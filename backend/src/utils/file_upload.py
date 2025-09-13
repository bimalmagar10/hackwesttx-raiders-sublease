"""
File upload utilities for handling image uploads and processing.
"""
import os
import uuid
from typing import Optional

import aiofiles
from fastapi import UploadFile
from PIL import Image

from src.config import settings
from src.exceptions import FileUploadError, FileProcessingError

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
MAX_FILE_SIZE = settings.MAX_FILE_SIZE


async def validate_image_file(upload_file: UploadFile) -> None:
    """
    Validate uploaded image file.
    
    Args:
        upload_file: The uploaded file to validate.
        
    Raises:
        FileUploadError: If file is invalid.
    """
    import logging
    logger = logging.getLogger(__name__)
    
    if not upload_file.filename:
        raise FileUploadError("No file uploaded.")

    file_extension = os.path.splitext(upload_file.filename)[1].lower()
    if file_extension not in ALLOWED_EXTENSIONS:
        raise FileUploadError(
            f"File type '{file_extension}' is not supported. "
            f"Allowed types are: {', '.join(ALLOWED_EXTENSIONS)}."
        )
    
    try:
        content = await upload_file.read()
        file_size = len(content)
        
        logger.debug(f"Validating file: {upload_file.filename}, size: {file_size} bytes")
        
        if file_size > MAX_FILE_SIZE:
            raise FileUploadError(
                f"File '{upload_file.filename}' size ({file_size / (1024 * 1024):.2f} MB) "
                f"exceeds the maximum limit of {MAX_FILE_SIZE / (1024 * 1024):.1f} MB."
            )
        
        if file_size == 0:
            raise FileUploadError(f"File '{upload_file.filename}' appears to be empty.")
            
        await upload_file.seek(0)  # Reset file pointer
        logger.debug(f"File {upload_file.filename} passed validation")
        
    except Exception as e:
        if isinstance(e, FileUploadError):
            raise
        logger.error(f"Error validating file {upload_file.filename}: {str(e)}")
        raise FileUploadError(f"Error reading file '{upload_file.filename}': {str(e)}")


async def save_upload_file(
    upload_file: UploadFile, 
    directory: str, 
    filename: Optional[str] = None
) -> str:
    """
    Save uploaded file to specified directory.
    
    Args:
        upload_file: The uploaded file to save.
        directory: Target directory within uploads folder.
        filename: Optional custom filename.
        
    Returns:
        str: Path to saved file.
        
    Raises:
        FileUploadError: If file validation fails.
    """
    await validate_image_file(upload_file)

    upload_path = os.path.join(settings.UPLOAD_DIR, directory)
    os.makedirs(upload_path, exist_ok=True)

    if not filename:
        file_extension = os.path.splitext(upload_file.filename or "")[1].lower()
        filename = f"{uuid.uuid4()}{file_extension}"
    
    file_path = os.path.join(upload_path, filename)

    async with aiofiles.open(file_path, 'wb') as f:
        content = await upload_file.read()
        await f.write(content)
    
    return file_path


async def resize_image(
    file_path: str, 
    max_width: int, 
    max_height: int, 
    quality: int = 85
) -> str:
    """
    Resize and optimize image.
    
    Args:
        file_path: Path to the image file.
        max_width: Maximum width for the resized image.
        max_height: Maximum height for the resized image.
        quality: JPEG quality (1-100).
        
    Returns:
        str: Path to optimized image.
        
    Raises:
        FileProcessingError: If image processing fails.
    """
    try:
        with Image.open(file_path) as img:
            # Convert to RGB if necessary
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")
            
            # Calculate new dimensions
            ratio = min(max_width / img.width, max_height / img.height)
            if ratio < 1:
                new_width = int(img.width * ratio)
                new_height = int(img.height * ratio)
                img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
            
            # Save optimized image
            optimized_path = file_path.replace(
                os.path.splitext(file_path)[1], 
                "_optimized.jpg"
            )
            img.save(optimized_path, "JPEG", quality=quality)
            
            # Remove original file
            os.remove(file_path)
            
            return optimized_path
    except Exception as e:
        raise FileProcessingError(f"Failed to process image: {str(e)}")


async def upload_user_avatar(user_id: uuid.UUID, file: UploadFile) -> str:
    """
    Upload and process user avatar image.
    
    Args:
        user_id: UUID of the user.
        file: Uploaded avatar file.
        
    Returns:
        str: Relative URL path to the uploaded avatar.
        
    Raises:
        FileUploadError: If file validation fails.
        FileProcessingError: If image processing fails.
    """
    directory = f"avatars"
    filename = f"{user_id}.jpg"
    filepath = await save_upload_file(file, directory, filename)

    file_path = await resize_image(filepath, max_width=300, max_height=300)

    relative_path = os.path.relpath(file_path, settings.UPLOAD_DIR)
    return f"/images/{relative_path}"


def delete_file(file_path: str) -> bool:
    """
    Delete file from filesystem.
    
    Args:
        file_path: Path to file to delete.
        
    Returns:
        bool: True if deleted successfully, False otherwise.
    """
    try:
        full_path = os.path.join(settings.UPLOAD_DIR, file_path.replace("/images/", ""))
        if os.path.exists(full_path):
            os.remove(full_path)
            return True
        return False
    except Exception:
        return False
