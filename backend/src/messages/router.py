"""
Messages domain router for HTTP endpoints.
"""
import logging
import uuid
from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from src.auth.dependencies import get_current_user
from src.auth.models import User
from src.database import get_db
from src.messages.service import MessagesService
from src.messages.schemas import (
    ConversationRead,
    ConversationSummary,
    ConversationWithMessages,
    MessageCreate,
    MessageRead,
    MessageReadCreate,
    MessageUpdate,
)

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/", response_model=MessageRead, status_code=status.HTTP_201_CREATED)
async def create_message(
    message_data: MessageCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> MessageRead:
    """
    Create a new message.
    
    Args:
        message_data: Message creation data.
        current_user: Current authenticated user.
        db: Database session.
        
    Returns:
        MessageRead: Created message.
    """
    try:
        messages_service = MessagesService(db)
        message = messages_service.create_message(message_data, current_user.user_id)
        logger.info(f"Message created: {message.message_id}")
        return message
    except Exception as e:
        logger.error(f"Error creating message: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create message"
        )


@router.get("/{message_id}", response_model=MessageRead)
async def get_message(
    message_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> MessageRead:
    """
    Get a specific message.
    
    Args:
        message_id: Message ID.
        current_user: Current authenticated user.
        db: Database session.
        
    Returns:
        MessageRead: Message details.
    """
    messages_service = MessagesService(db)
    message = messages_service.get_message_by_id(message_id)
    
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found"
        )
    
    # Check if user is involved in this message
    if (message.sender_id != current_user.user_id and 
        message.receiver_id != current_user.user_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this message"
        )
    
    return message


@router.put("/{message_id}", response_model=MessageRead)
async def update_message(
    message_id: uuid.UUID,
    message_data: MessageUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> MessageRead:
    """
    Update a message (only by sender).
    
    Args:
        message_id: Message ID.
        message_data: Updated message data.
        current_user: Current authenticated user.
        db: Database session.
        
    Returns:
        MessageRead: Updated message.
    """
    messages_service = MessagesService(db)
    message = messages_service.update_message(message_id, message_data, current_user.user_id)
    
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found or not authorized to update"
        )
    
    return message


@router.delete("/{message_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_message(
    message_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete a message (only by sender).
    
    Args:
        message_id: Message ID.
        current_user: Current authenticated user.
        db: Database session.
    """
    messages_service = MessagesService(db)
    success = messages_service.delete_message(message_id, current_user.user_id)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found or not authorized to delete"
        )


@router.get("/conversations/{conversation_id}/messages", response_model=List[MessageRead])
async def get_conversation_messages(
    conversation_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100)
) -> List[MessageRead]:
    """
    Get messages from a specific conversation.
    
    Args:
        conversation_id: Conversation ID.
        current_user: Current authenticated user.
        db: Database session.
        skip: Number of messages to skip.
        limit: Maximum number of messages to return.
        
    Returns:
        List[MessageRead]: List of messages.
    """
    messages_service = MessagesService(db)
    
    # First verify the user is part of this conversation
    conversation = messages_service.get_conversation_by_id(conversation_id)
    if not conversation or (conversation.user1_id != current_user.user_id and conversation.user2_id != current_user.user_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to this conversation"
        )
    
    # Get the other user ID
    other_user_id = conversation.user2_id if conversation.user1_id == current_user.user_id else conversation.user1_id
    
    messages = messages_service.get_conversation_messages(
        current_user.user_id, other_user_id, skip, limit
    )
    return messages


@router.get("/conversations", response_model=List[ConversationSummary])
async def get_user_conversations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> List[ConversationSummary]:
    """
    Get all conversations for the current user.
    
    Args:
        current_user: Current authenticated user.
        db: Database session.
        
    Returns:
        List[ConversationSummary]: List of conversation summaries.
    """
    messages_service = MessagesService(db)
    conversations = messages_service.get_user_conversation_summaries(current_user.user_id)
    return conversations


@router.get("/conversations/{user_id}", response_model=ConversationSummary)
async def get_conversation_with_user(
    user_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> ConversationSummary:
    """
    Get existing conversation or create a new one with another user.
    
    Args:
        user_id: Other user ID.
        current_user: Current authenticated user.
        db: Database session.
        
    Returns:
        ConversationSummary: Conversation details.
    """
    if user_id == current_user.user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot create conversation with yourself"
        )
    
    messages_service = MessagesService(db)
    conversation = messages_service.get_or_create_conversation_summary(
        current_user.user_id, user_id
    )
    return conversation


@router.post("/conversations/{user_id}", response_model=ConversationRead)
async def get_or_create_conversation(
    user_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> ConversationRead:
    """
    Get existing conversation or create a new one with another user.
    
    Args:
        user_id: Other user ID.
        current_user: Current authenticated user.
        db: Database session.
        
    Returns:
        ConversationRead: Conversation details.
    """
    if user_id == current_user.user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot create conversation with yourself"
        )
    
    messages_service = MessagesService(db)
    conversation = messages_service.get_or_create_conversation(
        current_user.user_id, user_id
    )
    return conversation


@router.post("/read", status_code=status.HTTP_200_OK)
async def mark_message_as_read(
    read_data: MessageReadCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Mark a message as read.
    
    Args:
        read_data: Message read data.
        current_user: Current authenticated user.
        db: Database session.
    """
    messages_service = MessagesService(db)
    success = messages_service.mark_message_as_read(
        read_data.message_id, current_user.user_id
    )
    
    if success:
        return {"message": "Message marked as read"}
    else:
        return {"message": "Message already read or not found"}


@router.get("/unread/{user_id}/count")
async def get_unread_count(
    user_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> dict:
    """
    Get unread message count from a specific user.
    
    Args:
        user_id: User ID to check unread messages from.
        current_user: Current authenticated user.
        db: Database session.
        
    Returns:
        dict: Unread count.
    """
    messages_service = MessagesService(db)
    count = messages_service.get_unread_count(current_user.user_id, user_id)
    return {"unread_count": count}
