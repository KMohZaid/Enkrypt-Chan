from datetime import datetime

from sqlalchemy import and_, or_
from sqlalchemy.orm import Session

from . import models, schemas, security
from .logger import logger


# INFO: USER FUNCTIONS
def get_user_by_username(db: Session, username: str):
    logger.debug(f"Querying user by username: {username}")
    if not username:
        return None
    return db.query(models.User).filter(models.User.username == username).first()


def get_user(db: Session, user_id: int):
    logger.debug(f"Querying user by id: {user_id}")
    return db.query(models.User).filter(models.User.id == user_id).first()


def create_user(db: Session, user: schemas.UserCreate):
    logger.info(f"Creating user: {user.username}")
    hashed_password = security.get_password_hash(user.password)
    db_user = models.User(
        username=user.username, name=user.name, hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    logger.info(f"User {user.username} created successfully.")
    return db_user


def search_users(db: Session, username_query: str):
    logger.debug(f"Searching users with query: {username_query}")
    if not username_query:
        return []
    return (
        db.query(models.User)
        .filter(
            or_(
                models.User.username.ilike(f"%{username_query}%"),
                models.User.name.ilike(f"%{username_query}%"),
            )
        )
        .all()
    )


# INFO: MESSAGE FUNCTIONS
def create_message(db: Session, message: schemas.MessageCreate):
    logger.debug(f"Creating message from {message.sender} to {message.recipient}")
    db_message = models.Message(**message.model_dump())
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message


def get_conversations(db: Session, username: str):
    logger.debug(f"Fetching conversations for user: {username}")
    # Get all unique contacts for the user
    contacts = (
        db.query(models.Message.recipient.label("contact"))
        .filter(models.Message.sender == username)
        .distinct()
        .union(
            db.query(models.Message.sender.label("contact"))
            .filter(models.Message.recipient == username)
            .distinct()
        )
    )

    # we only have contact column...
    contact_usernames = {row.contact for row in contacts}

    if not contact_usernames:
        return []

    # TODO: improve this and speed up?
    conversations_data = [
        get_conversation(db, username, contact_username)
        for contact_username in contact_usernames
    ]

    conversations_data = [c for c in conversations_data if c is not None]

    # newest contact first
    conversations_data.sort(
        key=lambda x: x["last_message_timestamp"]
        if x["last_message_timestamp"]
        else datetime.min,
        reverse=True,
    )

    return conversations_data


# TODO: maybe this can be improved
def get_conversation(db: Session, username: str, contact_username: str):
    """Gets the conversation details between a user and a contact."""
    logger.debug(f"Fetching conversation between {username} and {contact_username}")
    # Get the last message for the conversation
    last_message = (
        db.query(models.Message)
        .filter(
            or_(
                and_(
                    models.Message.sender == username,
                    models.Message.recipient == contact_username,
                ),
                and_(
                    models.Message.sender == contact_username,
                    models.Message.recipient == username,
                ),
            )
        )
        .order_by(models.Message.timestamp.desc())
        .first()
    )

    # Get unread message count
    unread_count = (
        db.query(models.Message)
        .filter(
            models.Message.sender == contact_username,
            models.Message.recipient == username,
            models.Message.is_read == False,
        )
        .count()
    )

    contact_user = (
        db.query(models.User).filter(models.User.username == contact_username).first()
    )
    if contact_user:
        return {
            "username": contact_user.username,
            "name": contact_user.name,
            "last_message": last_message.text if last_message else None,
            "last_message_timestamp": last_message.timestamp if last_message else None,
            "unread_count": unread_count,
        }
    logger.warning(
        f"Contact user {contact_username} not found when getting conversation for {username}."
    )
    return None


# TODO: this is just unnecessary, if we call read endpoint for each message
def mark_all_messages_as_read(
    db: Session, sender_username: str, recipient_username: str
):
    logger.info(
        f"Marking all messages as read from {sender_username} to {recipient_username}"
    )
    # Mark messages sent from sender_username to recipient_username as read
    db.query(models.Message).filter(
        models.Message.sender == sender_username,
        models.Message.recipient == recipient_username,
        models.Message.is_read == False,
    ).update({"is_read": True})
    db.commit()


def mark_message_as_read(db: Session, message_id: int):
    logger.info(f"Marking message {message_id} as read")
    db_message = (
        db.query(models.Message).filter(models.Message.id == message_id).first()
    )
    if db_message:
        db_message.is_read = True
        db.commit()
        db.refresh(db_message)
    return db_message


def get_message_history(db: Session, username1: str, username2: str):
    logger.debug(f"Fetching message history between {username1} and {username2}")
    return (
        db.query(models.Message)
        .filter(
            or_(
                and_(
                    models.Message.sender == username1,
                    models.Message.recipient == username2,
                ),
                and_(
                    models.Message.sender == username2,
                    models.Message.recipient == username1,
                ),
            )
        )
        .order_by(models.Message.timestamp)
        .all()
    )
