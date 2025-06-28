import json
import os
import time
import traceback
from typing import List

from fastapi import (Depends, FastAPI, HTTPException, Query, Request,
                     WebSocket, WebSocketDisconnect, status)
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from . import crud, models, schemas, security
from .database import SessionLocal, engine, get_db
from .logger import logger
from .websocket import manager

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")

# CORS Middleware to allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if frontend_url == "http://localhost:3000" else [frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    logger.info(f"Incoming request: {request.method} {request.url.path}")
    try:
        response = await call_next(request)
        process_time = time.time() - start_time
        logger.info(
            f"Request {request.method} {request.url.path} completed with status {response.status_code} in {process_time:.4f}s"
        )
        return response
    except Exception as e:
        process_time = time.time() - start_time
        logger.error(
            f"Request {request.method} {request.url.path} failed in {process_time:.4f}s",
            exc_info=True,
        )
        raise e


@app.post("/register", response_model=schemas.User)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    logger.info(f"Attempting to register user '{user.username}'")
    db_user = crud.get_user_by_username(db, username=user.username)
    if db_user:
        logger.warning(
            f"Registration failed for '{user.username}': username already exists."
        )
        raise HTTPException(status_code=400, detail="Username already registered")
    new_user = crud.create_user(db=db, user=user)
    logger.info(f"User '{user.username}' registered successfully.")
    return new_user


@app.post("/token", response_model=schemas.TokenWithUser)
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    logger.info(f"Login attempt for user '{form_data.username}'")
    user = crud.get_user_by_username(db, username=form_data.username)
    if not user or not security.verify_password(
        form_data.password, user.hashed_password
    ):
        logger.warning(f"Authentication failed for user '{form_data.username}'")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = security.create_access_token(username=form_data.username)
    logger.info(f"User '{form_data.username}' logged in successfully.")
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "name": user.name,
        "username": user.username,
    }


@app.get("/users/search", response_model=list[schemas.User])
def search_users(username: str, db: Session = Depends(get_db)):
    logger.info(f"Searching for users with query: '{username}'")
    return crud.search_users(db, username_query=username)


@app.get("/users/{user_id}", response_model=schemas.User)
def get_user(user_id: int, db: Session = Depends(get_db)):
    logger.info(f"Fetching user with ID: {user_id}")
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        logger.warning(f"User with ID {user_id} not found.")
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


@app.get("/users/{username}", response_model=schemas.User)
def get_user_profile(username: str, db: Session = Depends(get_db)):
    logger.info(f"Fetching profile for user: '{username}'")
    user = crud.get_user_by_username(db, username=username)
    if not user:
        logger.warning(f"User with username '{username}' not found.")
        raise HTTPException(status_code=404, detail="User not found")
    return user


@app.get("/conversations", response_model=List[schemas.Conversation])
def get_conversations(
    current_user: dict = Depends(security.get_current_user),
    db: Session = Depends(get_db),
):
    username = current_user["username"]
    logger.info(f"Fetching conversations for user: '{username}'")
    return crud.get_conversations(db, username=username)


@app.post("/messages/read", response_model=schemas.Conversation)
def mark_message_read(
    read_receipt: schemas.ReadReceipt,
    current_user: dict = Depends(security.get_current_user),
    db: Session = Depends(get_db),
):
    logger.info(
        f"User '{current_user['username']}' marking message {read_receipt.message_id} as read."
    )
    message = crud.mark_message_as_read(db, message_id=read_receipt.message_id)
    if not message:
        logger.warning(
            f"Message with ID {read_receipt.message_id} not found for marking as read."
        )
        raise HTTPException(status_code=404, detail="Message not found")

    conversation = crud.get_conversation(db, current_user["username"], message.sender)
    if not conversation:
        logger.warning(
            f"Conversation not found after marking message as read for user '{current_user['username']}'"
        )
        raise HTTPException(status_code=404, detail="Conversation not found")

    return conversation


@app.get(
    "/conversations/{contact_username}/messages", response_model=List[schemas.Message]
)
def get_message_history(
    contact_username: str,
    current_user: dict = Depends(security.get_current_user),
    db: Session = Depends(get_db),
):
    username = current_user["username"]
    logger.info(
        f"Fetching message history between '{username}' and '{contact_username}'"
    )
    return crud.get_message_history(db, username1=username, username2=contact_username)


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, token: str = Query(...)):
    username = security.decode_access_token(token)
    if not username:
        logger.warning("WebSocket connection failed: invalid token.")
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return

    db = SessionLocal()
    try:
        user = crud.get_user_by_username(db, username)
        if not user:
            logger.warning(
                f"Invalid token or user not found for WebSocket connection: {username}"
            )
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
            return
    finally:
        db.close()

    await manager.connect(websocket, username)
    try:
        while True:
            data = await websocket.receive_text()

            db = SessionLocal()
            try:
                message_data = json.loads(data)
                recipient = message_data.get("recipient")
                text = message_data.get("text")

                if (
                    not recipient
                    or not text
                    or not crud.get_user_by_username(db, recipient)
                ):
                    logger.warning(
                        f"Could not process WebSocket message from '{username}': invalid data format or recipient."
                    )
                    continue

                message_to_store = schemas.MessageCreate(
                    sender=username,
                    recipient=recipient,
                    text=text,
                    is_read=False,
                )
                db_message = crud.create_message(db, message=message_to_store)

                message_to_send = schemas.Message.model_validate(db_message)
                message_data_dict = message_to_send.model_dump()
                json_message = json.dumps(
                    {"type": "message", "data": message_data_dict}
                )

                await manager.send_personal_message(json_message, recipient)
                await manager.send_personal_message(json_message, username)
            except Exception as e:
                logger.error(
                    f"Error processing WebSocket message from '{username}': {e}",
                    exc_info=True,
                )
            finally:
                db.close()

    except WebSocketDisconnect as e:
        logger.info(f"WebSocket disconnected for {username}: {e.code}")
        traceback.print_exc()
        await manager.disconnect(username)
    except Exception as e:
        logger.error(f"Unexpected WebSocket error for {username}: {e}", exc_info=True)
        traceback.print_exc()
        await manager.disconnect(username)
