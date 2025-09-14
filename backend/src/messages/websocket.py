"""
WebSocket manager for real-time chat functionality using Socket.IO.
"""
import asyncio
import logging
import uuid
from typing import Dict, List, Optional, Set

import socketio
from sqlalchemy.orm import Session

from src.auth.dependencies import get_current_user_from_token
from src.database import get_db
from src.messages.service import MessagesService
from src.messages.schemas import (
    MessageCreate,
    MessageEvent,
    TypingEvent,
    OnlineEvent,
    MessageReadEvent,
    TypingIndicator,
    OnlineStatus,
)

logger = logging.getLogger(__name__)


class ChatManager:
    """
    Manages WebSocket connections and real-time chat functionality.
    """
    
    def __init__(self):
        # Socket.IO server instance
        self.sio = socketio.AsyncServer(
            cors_allowed_origins="*",
            logger=True,
            engineio_logger=True
        )
        
        # Store active connections: {user_id: {session_id, ...}}
        self.active_connections: Dict[str, Set[str]] = {}
        
        # Store session to user mapping: {session_id: user_id}
        self.session_users: Dict[str, str] = {}
        
        # Store typing indicators: {conversation_key: {user_id: timestamp}}
        self.typing_users: Dict[str, Dict[str, float]] = {}
        
        self.setup_event_handlers()
    
    def setup_event_handlers(self):
        """Setup Socket.IO event handlers."""
        
        @self.sio.event
        async def connect(sid, environ, auth):
            """Handle client connection."""
            try:
                logger.info(f"Client {sid} attempting to connect")
                
                # Extract token from auth
                if not auth or 'token' not in auth:
                    logger.warning(f"No token provided for connection {sid}")
                    await self.sio.disconnect(sid)
                    return False
                
                token = auth['token']
                
                # Validate token and get user
                try:
                    # Create a new database session for this connection
                    db: Session = next(get_db())
                    user = await get_current_user_from_token(token, db)
                    db.close()
                    
                    if not user:
                        logger.warning(f"Invalid token for connection {sid}")
                        await self.sio.disconnect(sid)
                        return False
                    
                    user_id = str(user.user_id)
                    
                    # Store connection
                    if user_id not in self.active_connections:
                        self.active_connections[user_id] = set()
                    
                    self.active_connections[user_id].add(sid)
                    self.session_users[sid] = user_id
                    
                    logger.info(f"User {user_id} connected with session {sid}")
                    
                    # Notify other users that this user is online
                    await self.broadcast_online_status(user_id, True)
                    
                    # Send current online users to the newly connected user
                    await self.send_online_users_list(sid)
                    
                    return True
                    
                except Exception as e:
                    logger.error(f"Error validating token for {sid}: {e}")
                    await self.sio.disconnect(sid)
                    return False
                    
            except Exception as e:
                logger.error(f"Error in connect handler: {e}")
                await self.sio.disconnect(sid)
                return False
        
        @self.sio.event
        async def disconnect(sid):
            """Handle client disconnection."""
            try:
                if sid in self.session_users:
                    user_id = self.session_users[sid]
                    
                    # Remove session
                    if user_id in self.active_connections:
                        self.active_connections[user_id].discard(sid)
                        
                        # If no more sessions for this user, mark as offline
                        if not self.active_connections[user_id]:
                            del self.active_connections[user_id]
                            await self.broadcast_online_status(user_id, False)
                    
                    del self.session_users[sid]
                    logger.info(f"User {user_id} disconnected (session {sid})")
                
            except Exception as e:
                logger.error(f"Error in disconnect handler: {e}")
        
        @self.sio.event
        async def send_message(sid, data):
            """Handle sending a message."""
            try:
                if sid not in self.session_users:
                    await self.sio.emit('error', {'message': 'Not authenticated'}, room=sid)
                    return
                
                sender_id = self.session_users[sid]
                
                # Validate message data
                try:
                    message_data = MessageCreate(**data)
                except Exception as e:
                    await self.sio.emit('error', {'message': f'Invalid message data: {e}'}, room=sid)
                    return
                
                # Save message to database
                db: Session = next(get_db())
                try:
                    messages_service = MessagesService(db)
                    message = messages_service.create_message(
                        message_data, 
                        uuid.UUID(sender_id)
                    )
                    
                    # Create message event
                    event = MessageEvent(message=message)
                    
                    # Send to sender
                    await self.sio.emit('message_sent', event.model_dump(), room=sid)
                    
                    # Send to receiver if online
                    receiver_id = str(message_data.receiver_id)
                    await self.send_to_user(receiver_id, 'new_message', event.model_dump())
                    
                    logger.info(f"Message sent from {sender_id} to {receiver_id}")
                    
                finally:
                    db.close()
                    
            except Exception as e:
                logger.error(f"Error in send_message handler: {e}")
                await self.sio.emit('error', {'message': 'Failed to send message'}, room=sid)
        
        @self.sio.event
        async def typing_start(sid, data):
            """Handle typing start indicator."""
            try:
                if sid not in self.session_users:
                    return
                
                user_id = self.session_users[sid]
                conversation_user_id = data.get('conversation_user_id')
                
                if not conversation_user_id:
                    return
                
                # Create typing indicator
                typing = TypingIndicator(
                    user_id=uuid.UUID(user_id),
                    conversation_user_id=uuid.UUID(conversation_user_id),
                    is_typing=True
                )
                
                event = TypingEvent(typing=typing)
                
                # Send to the other user
                await self.send_to_user(
                    conversation_user_id, 
                    'user_typing', 
                    event.model_dump()
                )
                
            except Exception as e:
                logger.error(f"Error in typing_start handler: {e}")
        
        @self.sio.event
        async def typing_stop(sid, data):
            """Handle typing stop indicator."""
            try:
                if sid not in self.session_users:
                    return
                
                user_id = self.session_users[sid]
                conversation_user_id = data.get('conversation_user_id')
                
                if not conversation_user_id:
                    return
                
                # Create typing indicator
                typing = TypingIndicator(
                    user_id=uuid.UUID(user_id),
                    conversation_user_id=uuid.UUID(conversation_user_id),
                    is_typing=False
                )
                
                event = TypingEvent(typing=typing)
                
                # Send to the other user
                await self.send_to_user(
                    conversation_user_id, 
                    'user_typing', 
                    event.model_dump()
                )
                
            except Exception as e:
                logger.error(f"Error in typing_stop handler: {e}")
        
        @self.sio.event
        async def mark_message_read(sid, data):
            """Handle marking a message as read."""
            try:
                if sid not in self.session_users:
                    return
                
                user_id = self.session_users[sid]
                message_id = data.get('message_id')
                
                if not message_id:
                    return
                
                # Mark message as read in database
                db: Session = next(get_db())
                try:
                    messages_service = MessagesService(db)
                    success = messages_service.mark_message_as_read(
                        uuid.UUID(message_id),
                        uuid.UUID(user_id)
                    )
                    
                    if success:
                        # Get the message to find the sender
                        message = messages_service.get_message_by_id(uuid.UUID(message_id))
                        
                        if message:
                            event = MessageReadEvent(
                                message_id=uuid.UUID(message_id),
                                read_by=uuid.UUID(user_id)
                            )
                            
                            # Notify the sender
                            sender_id = str(message.sender_id)
                            await self.send_to_user(
                                sender_id,
                                'message_read',
                                event.model_dump()
                            )
                    
                finally:
                    db.close()
                    
            except Exception as e:
                logger.error(f"Error in mark_message_read handler: {e}")
        
        @self.sio.event
        async def join_conversation(sid, data):
            """Handle joining a conversation room."""
            try:
                if sid not in self.session_users:
                    return
                
                conversation_id = data.get('conversation_id')
                if conversation_id:
                    await self.sio.enter_room(sid, f"conversation_{conversation_id}")
                    logger.info(f"Session {sid} joined conversation {conversation_id}")
                
            except Exception as e:
                logger.error(f"Error in join_conversation handler: {e}")
        
        @self.sio.event
        async def leave_conversation(sid, data):
            """Handle leaving a conversation room."""
            try:
                conversation_id = data.get('conversation_id')
                if conversation_id:
                    await self.sio.leave_room(sid, f"conversation_{conversation_id}")
                    logger.info(f"Session {sid} left conversation {conversation_id}")
                
            except Exception as e:
                logger.error(f"Error in leave_conversation handler: {e}")
    
    async def send_to_user(self, user_id: str, event: str, data: dict):
        """Send a message to a specific user."""
        if user_id in self.active_connections:
            for session_id in self.active_connections[user_id]:
                await self.sio.emit(event, data, room=session_id)
    
    async def broadcast_online_status(self, user_id: str, is_online: bool):
        """Broadcast online status change to all connected users."""
        try:
            status = OnlineStatus(
                user_id=uuid.UUID(user_id),
                is_online=is_online
            )
            
            event = OnlineEvent(status=status)
            
            # Broadcast to all connected users except the user themselves
            for connected_user_id, sessions in self.active_connections.items():
                if connected_user_id != user_id:
                    for session_id in sessions:
                        await self.sio.emit('online_status_changed', event.model_dump(), room=session_id)
        
        except Exception as e:
            logger.error(f"Error broadcasting online status: {e}")
    
    async def send_online_users_list(self, session_id: str):
        """Send list of online users to a specific session."""
        try:
            online_users = []
            for user_id in self.active_connections.keys():
                status = OnlineStatus(
                    user_id=uuid.UUID(user_id),
                    is_online=True
                )
                online_users.append(status.model_dump())
            
            await self.sio.emit('online_users', {'users': online_users}, room=session_id)
        
        except Exception as e:
            logger.error(f"Error sending online users list: {e}")
    
    def get_online_users(self) -> List[str]:
        """Get list of currently online user IDs."""
        return list(self.active_connections.keys())
    
    def is_user_online(self, user_id: str) -> bool:
        """Check if a user is currently online."""
        return user_id in self.active_connections


# Global chat manager instance
chat_manager = ChatManager()
