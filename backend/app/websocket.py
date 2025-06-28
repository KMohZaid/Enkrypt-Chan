from typing import Dict

from fastapi import WebSocket
from starlette.websockets import WebSocketState

from .logger import logger


class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}

    async def connect(self, websocket: WebSocket, username: str):
        await websocket.accept()
        self.active_connections[username] = websocket
        logger.info(f"User '{username}' connected")

    async def disconnect(self, username: str):
        if username not in self.active_connections:
            return
        conn = self.active_connections.pop(username, None)
        if conn.client_state == WebSocketState.CONNECTED:
            await conn.close()
        logger.info(f"User '{username}' disconnected")

    async def send_personal_message(self, message: str, recipient: str):
        if recipient in self.active_connections:
            websocket = self.active_connections[recipient]
            if websocket.client_state == WebSocketState.CONNECTED:
                logger.debug(f"Sending message to '{recipient}'.")
                await websocket.send_text(message)
            else:
                logger.warning(
                    f"Cannot send message: recipient '{recipient}' websocket is not in connected state."
                )
                await self.disconnect(recipient)
        else:
            logger.warning(
                f"Cannot send message: recipient '{recipient}' is not connected."
            )
            # TODO: handle case where recipient is not connected, store message for later delivery or log it


manager = ConnectionManager()
