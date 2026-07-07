import asyncio
import logging
import os
from typing import Any
from uuid import uuid4

from dotenv import load_dotenv

from app.agent.prompts import FALLBACK_RESPONSE_TEMPLATE
from app.agent.tools import infer_filters_from_message, search_products


logger = logging.getLogger(__name__)


def _bedrock_settings() -> dict[str, str | None]:
    load_dotenv()
    return {
        "aws_region": os.getenv("AWS_REGION", "ap-southeast-1"),
        "agent_id": os.getenv("BEDROCK_AGENT_ID"),
        "agent_alias_id": os.getenv("BEDROCK_AGENT_ALIAS_ID"),
    }


def _has_real_bedrock_config(settings: dict[str, str | None]) -> bool:
    agent_id = settings.get("agent_id")
    alias_id = settings.get("agent_alias_id")
    return bool(agent_id and alias_id and not agent_id.startswith("your_") and not alias_id.startswith("your_"))


async def invoke_agent(session_id: str, message: str) -> dict[str, Any]:
    """
    Invoke AWS Bedrock Agent when configured, otherwise use a clear backend fallback.

    The fallback keeps POST /chat usable during local development without fake Bedrock ids.
    """
    settings = _bedrock_settings()

    if not _has_real_bedrock_config(settings):
        logger.warning("Bedrock Agent is not configured; using local fallback for session %s", session_id)
        return await fallback_agent_response(session_id=session_id, message=message)

    try:
        response = await asyncio.to_thread(_invoke_bedrock_sync, settings, session_id, message)
        return {
            "response": response,
            "session_id": session_id,
            "products": [],
            "comparison": None,
            "cart_update": None,
            "source": "bedrock_agent",
        }
    except Exception as error:
        logger.error("Bedrock invoke_agent error: %s", error)
        fallback = await fallback_agent_response(session_id=session_id, message=message)
        fallback["source"] = "bedrock_agent_error_fallback"
        return fallback


def _invoke_bedrock_sync(settings: dict[str, str | None], session_id: str, message: str) -> str:
    import boto3

    bedrock_agent = boto3.client(
        "bedrock-agent-runtime",
        region_name=settings["aws_region"],
    )
    response = bedrock_agent.invoke_agent(
        agentId=settings["agent_id"],
        agentAliasId=settings["agent_alias_id"],
        sessionId=session_id,
        inputText=message,
        enableTrace=True,
    )

    completion = ""
    for event in response["completion"]:
        if "chunk" in event:
            completion += event["chunk"]["bytes"].decode()

    return completion


async def fallback_agent_response(session_id: str | None, message: str) -> dict[str, Any]:
    active_session_id = session_id or f"session_{uuid4().hex}"
    filters = infer_filters_from_message(message)
    result = await search_products(**filters)

    products = []
    content = FALLBACK_RESPONSE_TEMPLATE

    if result.get("success"):
        products = result["data"].get("products", [])
        if products:
            names = ", ".join(product["name"] for product in products[:3])
            content = f"{content}\n\nMình tìm được {len(products)} sản phẩm phù hợp: {names}."
        else:
            content = f"{content}\n\nMình chưa tìm thấy sản phẩm khớp bộ lọc hiện tại."
    else:
        content = f"{content}\n\nHiện mình chưa truy vấn được catalog sản phẩm."

    return {
        "response": content,
        "session_id": active_session_id,
        "products": products,
        "comparison": None,
        "cart_update": None,
        "source": "local_fallback",
    }
