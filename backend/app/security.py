import os
from datetime import datetime, timedelta, timezone
from typing import Optional

import bcrypt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt

from .logger import logger

# Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "a_very_secret_key_for_enkrypt_chan")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 60 * 24 * 30  # 30 days

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")  # For HTTP endpoints


def verify_password(plain_password, hashed_password):
    """Verifies a plain password against a hashed password using bcrypt."""
    logger.debug("Verifying password.")
    verified = bcrypt.checkpw(
        plain_password.encode("utf-8"), hashed_password.encode("utf-8")
    )
    if not verified:
        logger.warning("Password verification failed.")
    return verified


def get_password_hash(password):
    """Hashes a password using bcrypt."""
    logger.debug("Hashing password.")
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


# TODO: add auto refresh of access token if user is active
def create_access_token(username: str, expires_delta: Optional[timedelta] = None):
    """Creates a JWT access token with an expiration time."""
    logger.debug(f"Creating access token for user: {username}")
    if not username:
        raise ValueError("Username must be provided for token creation")

    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=ACCESS_TOKEN_EXPIRE_MINUTES
        )

    to_encode = {"data": username, "exp": expire}
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def decode_access_token(token: str):
    """Decodes the access token and returns the username."""
    logger.debug("Attempting to decode access token.")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("data")
        return username
    except JWTError as e:
        logger.warning(
            f"Failed to decode access token due to JWTError: {e}", exc_info=True
        )
        return None


def get_current_user(token: str = Depends(oauth2_scheme)):
    """Dependency for HTTP routes to get the current user from a token."""
    username = decode_access_token(token)
    if username is None:
        logger.warning(
            "Authentication failed: could not validate credentials from token."
        )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return {"username": username}
