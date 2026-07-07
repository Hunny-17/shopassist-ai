from datetime import datetime, timezone
from typing import Any, Literal
from uuid import uuid4

from pydantic import BaseModel, Field


MessageRole = Literal["user", "assistant", "system"]


class ChatRequest(BaseModel):
    session_id: str | None = None
    message: str = Field(min_length=1, max_length=4000)


class ChatMessage(BaseModel):
    id: str = Field(default_factory=lambda: f"msg_{uuid4().hex}")
    role: MessageRole
    content: str
    products: list[dict[str, Any]] = Field(default_factory=list)
    comparison: dict[str, Any] | None = None
    cart_update: dict[str, Any] | None = None
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ChatResponseData(BaseModel):
    message: ChatMessage
    session_id: str


class ApiSuccessResponse(BaseModel):
    success: Literal[True] = True
    data: Any
    message: str


class ApiErrorResponse(BaseModel):
    success: Literal[False] = False
    error: str
    message: str
