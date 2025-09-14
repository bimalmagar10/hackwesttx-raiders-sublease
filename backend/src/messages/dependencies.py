"""
Messages domain dependencies.
"""
import uuid
from typing import Optional

from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session

from src.auth.dependencies import get_current_user
from src.auth.models import User
from src.database import get_db
from src.messages.models import Message, Conversation
from src.messages.service import MessagesService


def get_message_by_id(
    message_id: uuid.UUID,
    db: Session = Depends(get_db)
) -> Message:
    """
    Get message by ID dependency.
    
    Args:
        message_id: Message ID.
        db: Database session.
        
    Returns:
        Message: Message object.
        
    Raises:
        HTTPException: If message not found.
    """
    messages_service = MessagesService(db)
    message = messages_service.get_message_by_id(message_id)
    
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found"
        )
    
    return message


def verify_message_access(
    message: Message = Depends(get_message_by_id),
    current_user: User = Depends(get_current_user)
) -> Message:
    """
    Verify user has access to message.
    
    Args:
        message: Message object.
        current_user: Current user.
        
    Returns:
        Message: Message object.
        
    Raises:
        HTTPException: If user doesn't have access.
    """
    if (message.sender_id != current_user.user_id and 
        message.receiver_id != current_user.user_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this message"
        )
    
    return message


def verify_message_ownership(
    message: Message = Depends(get_message_by_id),
    current_user: User = Depends(get_current_user)
) -> Message:
    """
    Verify user owns the message (sender only).
    
    Args:
        message: Message object.
        current_user: Current user.
        
    Returns:
        Message: Message object.
        
    Raises:
        HTTPException: If user is not the sender.
    """
    if message.sender_id != current_user.user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to modify this message"
        )
    
    return message
