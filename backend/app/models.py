from datetime import datetime, timezone

from sqlalchemy import Boolean, Column, Integer, String

from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    sender = Column(String, index=True, nullable=False)
    recipient = Column(String, index=True, nullable=False)
    text = Column(String, nullable=False)
    timestamp = Column(
        String,
        default=lambda: datetime.now(timezone.utc).isoformat(),
        nullable=False,
    )
    is_read = Column(Boolean, default=False, nullable=False)
