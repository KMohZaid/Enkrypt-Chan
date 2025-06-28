from datetime import datetime, timezone
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class User(BaseModel):
    """User schema, used for responses."""

    username: str
    name: str
    model_config = ConfigDict(from_attributes=True)


class UserCreate(User):
    """User creation schema, includes password."""

    password: str


class Token(BaseModel):
    """Token schema, used for responses."""

    access_token: str
    token_type: str


class TokenWithUser(Token):
    """Token schema with user information, used for responses."""

    name: str
    username: str


class MessageBase(BaseModel):
    """Base message schema."""

    sender: str
    recipient: str
    text: str
    timestamp: str = Field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat()
    )
    is_read: bool = False


class MessageCreate(MessageBase):
    """Message creation schema."""

    pass


class Message(MessageBase):
    """Message schema, used for responses and websocket messages."""

    id: int
    model_config = ConfigDict(from_attributes=True)


class Conversation(BaseModel):
    username: str
    name: str
    last_message: Optional[str] = None
    last_message_timestamp: Optional[str] = None
    unread_count: int = 0
    model_config = ConfigDict(from_attributes=True)


class ReadReceipt(BaseModel):
    message_id: int
