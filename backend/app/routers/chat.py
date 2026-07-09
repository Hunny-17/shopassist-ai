import logging
import time
from collections import defaultdict, deque
from uuid import uuid4

from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse

from app.agent.bedrock_agent import invoke_agent
from app.db.queries import log_analytics_event, update_chat_session
from app.models.chat import ChatMessage, ChatRequest


logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/v1", tags=["chat"])

RATE_LIMIT_WINDOW_SECONDS = 60
RATE_LIMIT_MAX_REQUESTS = 20
_request_log: dict[str, deque[float]] = defaultdict(deque)


def _success(data: dict, message: str) -> dict:
    return {"success": True, "data": data, "message": message}


def _error(error: str, message: str, status_code: int = 400) -> JSONResponse:
    return JSONResponse(
        status_code=status_code,
        content={"success": False, "error": error, "message": message},
    )


def _is_rate_limited(client_id: str) -> bool:
    now = time.time()
    bucket = _request_log[client_id]

    while bucket and now - bucket[0] > RATE_LIMIT_WINDOW_SECONDS:
        bucket.popleft()

    if len(bucket) >= RATE_LIMIT_MAX_REQUESTS:
        return True

    bucket.append(now)
    return False


@router.post("/chat")
async def chat(request_body: ChatRequest, request: Request):
    client_host = request.client.host if request.client else "unknown"
    if _is_rate_limited(client_host):
        return _error("rate_limited", "Too many chat requests. Please try again later.", 429)

    session_id = request_body.session_id or f"session_{uuid4().hex}"
    user_message = ChatMessage(role="user", content=request_body.message)

    try:
        await log_analytics_event(
            session_id=session_id,
            event_type="message_sent",
            event_payload={"content": request_body.message},
        )

        agent_result = await invoke_agent(session_id=session_id, message=request_body.message)
        assistant_message = ChatMessage(
            role="assistant",
            content=agent_result.get("response", ""),
            products=agent_result.get("products", []),
            comparison=agent_result.get("comparison"),
            cart_update=agent_result.get("cart_update"),
            tool_trace=agent_result.get("tool_trace", []),
        )

        await update_chat_session(
            session_id=session_id,
            messages=[
                user_message.model_dump(mode="json"),
                assistant_message.model_dump(mode="json"),
            ],
        )
        await log_analytics_event(
            session_id=session_id,
            event_type="agent_response",
            event_payload={
                "source": agent_result.get("source"),
                "product_count": len(agent_result.get("products", [])),
                "tool_trace": agent_result.get("tool_trace", []),
            },
        )

        return _success(
            {
                "message": assistant_message.model_dump(mode="json"),
                "session_id": session_id,
            },
            "Chat response generated",
        )
    except Exception as error:
        logger.error("POST /chat error for session %s: %s", session_id, error)
        return _error("chat_failed", "Could not generate chat response", 500)
