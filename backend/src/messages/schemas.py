"""
Messages domain schemas for API requests and responses.
"""
from datetime import datetime
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, Field


class MessageCreate(BaseModel):
    """Schema for creating a new message."""
    receiver_id: UUID
    content: str = Field(..., min_length=1, max_length=10000)
    message_type: str = Field(default="text", max_length=50)


class MessageUpdate(BaseModel):
    """Schema for updating a message."""
    content: str = Field(..., min_length=1, max_length=10000)


class UserBasic(BaseModel):
    """Basic user information for message responses."""
    user_id: UUID
    first_name: str
    last_name: str
    profile_image_url: Optional[str] = None


class MessageRead(BaseModel):
    """Schema for message responses."""
    message_id: UUID
    sender_id: UUID
    receiver_id: UUID
    content: str
    message_type: str
    status: str
    is_edited: bool
    edited_at: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    # Related objects
    sender: Optional[UserBasic] = None
    receiver: Optional[UserBasic] = None


class ConversationCreate(BaseModel):
    """Schema for creating a conversation."""
    user2_id: UUID  # user1 will be the current user


class ConversationRead(BaseModel):
    """Schema for conversation responses."""
    conversation_id: UUID
    user1_id: UUID
    user2_id: UUID
    last_message_at: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    # Related objects
    user1: Optional[UserBasic] = None
    user2: Optional[UserBasic] = None
    last_message: Optional[MessageRead] = None
    unread_count: Optional[int] = 0


class ConversationSummary(BaseModel):
    """Schema for conversation summary (simplified for frontend)."""
    conversation_id: UUID
    user_id: UUID  # Current user
    other_user_id: UUID  # The other user in the conversation
    other_user_name: str  # Name of the other user
    last_message: Optional[str] = None  # Last message content
    last_message_at: Optional[datetime] = None
    unread_count: int = 0
    created_at: datetime
    updated_at: Optional[datetime] = None


class MessageReadCreate(BaseModel):
    """Schema for marking a message as read."""
    message_id: UUID


class MessageReadResponse(BaseModel):
    """Schema for message read status response."""
    read_id: UUID
    message_id: UUID
    user_id: UUID
    read_at: datetime


class ConversationWithMessages(BaseModel):
    """Schema for conversation with messages."""
    conversation: ConversationRead
    messages: List[MessageRead]


class WebSocketMessage(BaseModel):
    """Schema for WebSocket message communication."""
    type: str  # 'message', 'typing', 'read_status', etc.
    data: dict


class TypingIndicator(BaseModel):
    """Schema for typing indicators."""
    user_id: UUID
    conversation_user_id: UUID
    is_typing: bool


class OnlineStatus(BaseModel):
    """Schema for online status."""
    user_id: UUID
    is_online: bool
    last_seen: Optional[datetime] = None


class ChatEventType(BaseModel):
    """Base schema for chat events."""
    event_type: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class MessageEvent(ChatEventType):
    """Schema for message events."""
    event_type: str = "message"
    message: MessageRead


class TypingEvent(ChatEventType):
    """Schema for typing events."""
    event_type: str = "typing"
    typing: TypingIndicator


class OnlineEvent(ChatEventType):
    """Schema for online status events."""
    event_type: str = "online_status"
    status: OnlineStatus


class MessageReadEvent(ChatEventType):
    """Schema for message read events."""
    event_type: str = "message_read"
    message_id: UUID
    read_by: UUID
