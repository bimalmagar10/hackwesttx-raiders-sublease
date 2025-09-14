"""
Messages domain service for chat operations.
"""
import uuid
from datetime import datetime
from typing import List, Optional, Tuple

from sqlalchemy import and_, desc, or_
from sqlalchemy.orm import Session, joinedload

from src.messages.models import Conversation, Message, MessageRead
from src.messages.schemas import (
    ConversationRead, 
    ConversationSummary,
    MessageCreate, 
    MessageRead as MessageReadSchema, 
    MessageUpdate,
    UserBasic
)
from src.auth.models import User


class MessagesService:
    """
    Messages service for chat operations.
    """
    
    def __init__(self, db: Session):
        self.db = db
    
    def create_message(self, message_data: MessageCreate, sender_id: uuid.UUID) -> MessageReadSchema:
        """
        Create a new message.
        
        Args:
            message_data: Message creation data.
            sender_id: ID of the message sender.
            
        Returns:
            MessageReadSchema: Created message.
        """
        # Create the message
        db_message = Message(
            sender_id=sender_id,
            receiver_id=message_data.receiver_id,
            content=message_data.content,
            message_type=message_data.message_type,
            status="sent"
        )
        
        self.db.add(db_message)
        self.db.flush()  # Flush to get the ID
        
        # Update conversation last_message_at
        self._update_conversation_timestamp(sender_id, message_data.receiver_id)
        
        self.db.commit()
        self.db.refresh(db_message)
        
        return self._convert_message_to_read(db_message)
    
    def get_message_by_id(self, message_id: uuid.UUID) -> Optional[MessageReadSchema]:
        """
        Get a message by ID.
        
        Args:
            message_id: Message ID.
            
        Returns:
            MessageReadSchema: Message or None if not found.
        """
        message = (
            self.db.query(Message)
            .options(
                joinedload(Message.sender),
                joinedload(Message.receiver)
            )
            .filter(Message.message_id == message_id)
            .first()
        )
        
        if message:
            return self._convert_message_to_read(message)
        return None
    
    def get_conversation_messages(
        self, 
        user1_id: uuid.UUID, 
        user2_id: uuid.UUID, 
        skip: int = 0, 
        limit: int = 50
    ) -> List[MessageReadSchema]:
        """
        Get messages between two users.
        
        Args:
            user1_id: First user ID.
            user2_id: Second user ID.
            skip: Number of messages to skip.
            limit: Maximum number of messages to return.
            
        Returns:
            List[MessageReadSchema]: List of messages.
        """
        messages = (
            self.db.query(Message)
            .options(
                joinedload(Message.sender),
                joinedload(Message.receiver)
            )
            .filter(
                or_(
                    and_(Message.sender_id == user1_id, Message.receiver_id == user2_id),
                    and_(Message.sender_id == user2_id, Message.receiver_id == user1_id)
                )
            )
            .order_by(desc(Message.created_at))
            .offset(skip)
            .limit(limit)
            .all()
        )
        
        return [self._convert_message_to_read(msg) for msg in messages]
    
    def update_message(
        self, 
        message_id: uuid.UUID, 
        message_data: MessageUpdate, 
        user_id: uuid.UUID
    ) -> Optional[MessageReadSchema]:
        """
        Update a message (only by the sender).
        
        Args:
            message_id: Message ID.
            message_data: Updated message data.
            user_id: ID of the user making the update.
            
        Returns:
            MessageReadSchema: Updated message or None if not found/unauthorized.
        """
        message = (
            self.db.query(Message)
            .filter(
                Message.message_id == message_id,
                Message.sender_id == user_id
            )
            .first()
        )
        
        if not message:
            return None
        
        message.content = message_data.content
        message.is_edited = True
        message.edited_at = datetime.utcnow()
        message.updated_at = datetime.utcnow()
        
        self.db.commit()
        self.db.refresh(message)
        
        return self._convert_message_to_read(message)
    
    def delete_message(self, message_id: uuid.UUID, user_id: uuid.UUID) -> bool:
        """
        Delete a message (only by the sender).
        
        Args:
            message_id: Message ID.
            user_id: ID of the user making the deletion.
            
        Returns:
            bool: True if deleted, False if not found/unauthorized.
        """
        message = (
            self.db.query(Message)
            .filter(
                Message.message_id == message_id,
                Message.sender_id == user_id
            )
            .first()
        )
        
        if not message:
            return False
        
        self.db.delete(message)
        self.db.commit()
        return True
    
    def get_user_conversations(self, user_id: uuid.UUID) -> List[ConversationRead]:
        """
        Get all conversations for a user.
        
        Args:
            user_id: User ID.
            
        Returns:
            List[ConversationRead]: List of conversations.
        """
        conversations = (
            self.db.query(Conversation)
            .options(
                joinedload(Conversation.user1),
                joinedload(Conversation.user2)
            )
            .filter(
                or_(
                    Conversation.user1_id == user_id,
                    Conversation.user2_id == user_id
                )
            )
            .order_by(desc(Conversation.last_message_at))
            .all()
        )
        
        return [self._convert_conversation_to_read(conv, user_id) for conv in conversations]

    def get_user_conversation_summaries(self, user_id: uuid.UUID) -> List[ConversationSummary]:
        """
        Get all conversation summaries for a user (simplified format for frontend).
        
        Args:
            user_id: User ID.
            
        Returns:
            List[ConversationSummary]: List of conversation summaries.
        """
        conversations = (
            self.db.query(Conversation)
            .options(
                joinedload(Conversation.user1),
                joinedload(Conversation.user2)
            )
            .filter(
                or_(
                    Conversation.user1_id == user_id,
                    Conversation.user2_id == user_id
                )
            )
            .order_by(desc(Conversation.last_message_at))
            .all()
        )
        
        summaries = []
        for conv in conversations:
            # Skip conversations with the same user (self-conversations)
            if conv.user1_id == conv.user2_id:
                continue
                
            # Determine the other user
            if conv.user1_id == user_id:
                other_user = conv.user2
                other_user_id = conv.user2_id
            else:
                other_user = conv.user1
                other_user_id = conv.user1_id
            
            # Get the last message content
            last_message_content = self._get_last_message_content(conv.conversation_id)
            
            # Get unread count
            unread_count = self.get_unread_count(user_id, other_user_id)
            
            # Create summary
            summary = ConversationSummary(
                conversation_id=conv.conversation_id,
                user_id=user_id,
                other_user_id=other_user_id,
                other_user_name=f"{other_user.first_name} {other_user.last_name}".strip(),
                last_message=last_message_content,
                last_message_at=conv.last_message_at,
                unread_count=unread_count,
                created_at=conv.created_at,
                updated_at=conv.updated_at
            )
            summaries.append(summary)
        
        return summaries

    def get_conversation_by_id(self, conversation_id: uuid.UUID) -> Optional[Conversation]:
        """
        Get a conversation by ID.
        
        Args:
            conversation_id: Conversation ID.
            
        Returns:
            Optional[Conversation]: Conversation or None if not found.
        """
        return (
            self.db.query(Conversation)
            .filter(Conversation.conversation_id == conversation_id)
            .first()
        )
    
    def get_or_create_conversation(
        self, 
        user1_id: uuid.UUID, 
        user2_id: uuid.UUID
    ) -> ConversationRead:
        """
        Get existing conversation or create a new one.
        
        Args:
            user1_id: First user ID.
            user2_id: Second user ID.
            
        Returns:
            ConversationRead: Conversation.
        """
        # Check if conversation already exists
        conversation = (
            self.db.query(Conversation)
            .filter(
                or_(
                    and_(Conversation.user1_id == user1_id, Conversation.user2_id == user2_id),
                    and_(Conversation.user1_id == user2_id, Conversation.user2_id == user1_id)
                )
            )
            .first()
        )
        
        if not conversation:
            # Create new conversation
            conversation = Conversation(
                user1_id=user1_id,
                user2_id=user2_id,
                last_message_at=datetime.utcnow()
            )
            self.db.add(conversation)
            self.db.commit()
            self.db.refresh(conversation)
        
        return self._convert_conversation_to_read(conversation, user1_id)

    def get_or_create_conversation_summary(
        self, 
        user1_id: uuid.UUID, 
        user2_id: uuid.UUID
    ) -> ConversationSummary:
        """
        Get existing conversation summary or create a new one.
        
        Args:
            user1_id: First user ID (current user).
            user2_id: Second user ID (other user).
            
        Returns:
            ConversationSummary: Conversation summary.
        """
        # Get or create the conversation
        conversation_read = self.get_or_create_conversation(user1_id, user2_id)
        
        # Get the other user details
        other_user = self.db.query(User).filter(User.user_id == user2_id).first()
        if not other_user:
            raise ValueError(f"User with ID {user2_id} not found")
        
        # Get last message content
        last_message_content = self._get_last_message_content(conversation_read.conversation_id)
        
        # Get unread count
        unread_count = self.get_unread_count(user1_id, user2_id)
        
        return ConversationSummary(
            conversation_id=conversation_read.conversation_id,
            user_id=user1_id,
            other_user_id=user2_id,
            other_user_name=f"{other_user.first_name} {other_user.last_name}".strip(),
            last_message=last_message_content,
            last_message_at=conversation_read.last_message_at,
            unread_count=unread_count,
            created_at=conversation_read.created_at,
            updated_at=conversation_read.updated_at
        )
    
    def mark_message_as_read(self, message_id: uuid.UUID, user_id: uuid.UUID) -> bool:
        """
        Mark a message as read by a user.
        
        Args:
            message_id: Message ID.
            user_id: User ID.
            
        Returns:
            bool: True if marked as read, False if already read or not found.
        """
        # Check if already read
        existing_read = (
            self.db.query(MessageRead)
            .filter(
                MessageRead.message_id == message_id,
                MessageRead.user_id == user_id
            )
            .first()
        )
        
        if existing_read:
            return False
        
        # Mark as read
        message_read = MessageRead(
            message_id=message_id,
            user_id=user_id,
            read_at=datetime.utcnow()
        )
        
        self.db.add(message_read)
        self.db.commit()
        return True
    
    def get_unread_count(self, user_id: uuid.UUID, conversation_user_id: uuid.UUID) -> int:
        """
        Get count of unread messages from a specific user.
        
        Args:
            user_id: Current user ID.
            conversation_user_id: Other user in conversation.
            
        Returns:
            int: Number of unread messages.
        """
        unread_count = (
            self.db.query(Message)
            .outerjoin(
                MessageRead,
                and_(
                    MessageRead.message_id == Message.message_id,
                    MessageRead.user_id == user_id
                )
            )
            .filter(
                Message.sender_id == conversation_user_id,
                Message.receiver_id == user_id,
                MessageRead.read_id.is_(None)
            )
            .count()
        )
        
        return unread_count
    
    def _convert_message_to_read(self, message: Message) -> MessageReadSchema:
        """
        Convert Message model to MessageReadSchema.
        
        Args:
            message: Message model instance.
            
        Returns:
            MessageReadSchema: Converted message schema.
        """
        sender = None
        receiver = None
        
        if hasattr(message, 'sender') and message.sender:
            sender = UserBasic(
                user_id=message.sender.user_id,
                first_name=message.sender.first_name,
                last_name=message.sender.last_name,
                profile_image_url=message.sender.profile_image_url
            )
        
        if hasattr(message, 'receiver') and message.receiver:
            receiver = UserBasic(
                user_id=message.receiver.user_id,
                first_name=message.receiver.first_name,
                last_name=message.receiver.last_name,
                profile_image_url=message.receiver.profile_image_url
            )
        
        return MessageReadSchema(
            message_id=message.message_id,
            sender_id=message.sender_id,
            receiver_id=message.receiver_id,
            content=message.content,
            message_type=message.message_type,
            status=message.status,
            is_edited=message.is_edited,
            edited_at=message.edited_at,
            created_at=message.created_at,
            updated_at=message.updated_at,
            sender=sender,
            receiver=receiver
        )
    
    def _convert_conversation_to_read(
        self, 
        conversation: Conversation, 
        current_user_id: uuid.UUID
    ) -> ConversationRead:
        """
        Convert Conversation model to ConversationRead.
        
        Args:
            conversation: Conversation model instance.
            current_user_id: Current user ID for unread count.
            
        Returns:
            ConversationRead: Converted conversation schema.
        """
        user1 = None
        user2 = None
        
        if hasattr(conversation, 'user1') and conversation.user1:
            user1 = UserBasic(
                user_id=conversation.user1.user_id,
                first_name=conversation.user1.first_name,
                last_name=conversation.user1.last_name,
                profile_image_url=conversation.user1.profile_image_url
            )
        
        if hasattr(conversation, 'user2') and conversation.user2:
            user2 = UserBasic(
                user_id=conversation.user2.user_id,
                first_name=conversation.user2.first_name,
                last_name=conversation.user2.last_name,
                profile_image_url=conversation.user2.profile_image_url
            )
        
        # Get the other user for unread count
        other_user_id = (
            conversation.user2_id 
            if conversation.user1_id == current_user_id 
            else conversation.user1_id
        )
        unread_count = self.get_unread_count(current_user_id, other_user_id)
        
        return ConversationRead(
            conversation_id=conversation.conversation_id,
            user1_id=conversation.user1_id,
            user2_id=conversation.user2_id,
            last_message_at=conversation.last_message_at,
            created_at=conversation.created_at,
            updated_at=conversation.updated_at,
            user1=user1,
            user2=user2,
            unread_count=unread_count
        )
    
    def _update_conversation_timestamp(
        self, 
        user1_id: uuid.UUID, 
        user2_id: uuid.UUID
    ) -> None:
        """
        Update the last_message_at timestamp for a conversation.
        
        Args:
            user1_id: First user ID.
            user2_id: Second user ID.
        """
        conversation = (
            self.db.query(Conversation)
            .filter(
                or_(
                    and_(Conversation.user1_id == user1_id, Conversation.user2_id == user2_id),
                    and_(Conversation.user1_id == user2_id, Conversation.user2_id == user1_id)
                )
            )
            .first()
        )
        
        if conversation:
            conversation.last_message_at = datetime.utcnow()
            conversation.updated_at = datetime.utcnow()
        else:
            # Create conversation if it doesn't exist
            conversation = Conversation(
                user1_id=user1_id,
                user2_id=user2_id,
                last_message_at=datetime.utcnow()
            )
            self.db.add(conversation)

    def _get_last_message_content(self, conversation_id: uuid.UUID) -> Optional[str]:
        """
        Get the content of the last message in a conversation.
        
        Args:
            conversation_id: Conversation ID.
            
        Returns:
            Optional[str]: Last message content or None.
        """
        last_message = (
            self.db.query(Message)
            .join(Conversation, 
                  or_(
                      and_(Message.sender_id == Conversation.user1_id, 
                           Message.receiver_id == Conversation.user2_id),
                      and_(Message.sender_id == Conversation.user2_id, 
                           Message.receiver_id == Conversation.user1_id)
                  ))
            .filter(Conversation.conversation_id == conversation_id)
            .order_by(desc(Message.created_at))
            .first()
        )
        
        return last_message.content if last_message else None
