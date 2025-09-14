"""
Messages domain models for live chat functionality.
"""
import uuid
from datetime import datetime
from enum import Enum

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, String, Text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from src.database import Base


class MessageStatus(Enum):
    """Message status enumeration."""
    SENT = "sent"
    DELIVERED = "delivered"
    READ = "read"


class Message(Base):
    """
    Message model for storing chat messages.
    """
    __tablename__ = "messages"
    
    message_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    sender_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id"), nullable=False, index=True)
    receiver_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id"), nullable=False, index=True)
    content = Column(Text, nullable=False)
    message_type = Column(String, default="text")  # text, image, file, etc.
    status = Column(String, default=MessageStatus.SENT.value)
    is_edited = Column(Boolean, default=False)
    edited_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, server_default=func.now())
    updated_at = Column(DateTime, onupdate=datetime.utcnow)
    
    # Relationships
    sender = relationship("User", foreign_keys=[sender_id], backref="sent_messages")
    receiver = relationship("User", foreign_keys=[receiver_id], backref="received_messages")


class Conversation(Base):
    """
    Conversation model for grouping messages between users.
    """
    __tablename__ = "conversations"
    
    conversation_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user1_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id"), nullable=False, index=True)
    user2_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id"), nullable=False, index=True)
    last_message_at = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow, server_default=func.now())
    updated_at = Column(DateTime, onupdate=datetime.utcnow)
    
    # Relationships
    user1 = relationship("User", foreign_keys=[user1_id])
    user2 = relationship("User", foreign_keys=[user2_id])
    
    # Add unique constraint to prevent duplicate conversations
    __table_args__ = (
        {"sqlite_autoincrement": True}
    )


class MessageRead(Base):
    """
    Message read status tracking.
    """
    __tablename__ = "message_reads"
    
    read_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    message_id = Column(UUID(as_uuid=True), ForeignKey("messages.message_id"), nullable=False, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id"), nullable=False, index=True)
    read_at = Column(DateTime, default=datetime.utcnow, server_default=func.now())
    
    # Relationships
    message = relationship("Message", backref="read_statuses")
    user = relationship("User", backref="message_reads")
