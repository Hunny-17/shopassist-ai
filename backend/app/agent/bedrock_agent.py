import asyncio
import logging
import os
import re
from typing import Any
from uuid import uuid4

from dotenv import load_dotenv

from app.agent.prompts import FALLBACK_RESPONSE_TEMPLATE
from app.agent.tools import (
    add_to_cart,
    check_stock_and_promotion,
    compare_products,
    infer_filters_from_message,
    search_products,
)


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
        product_enrichment = await get_product_enrichment(message)
        return {
            "response": merge_bedrock_response_with_products(response, product_enrichment),
            "session_id": session_id,
            "products": product_enrichment.get("products", []),
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


async def get_product_enrichment(message: str) -> dict[str, Any]:
    filters = infer_filters_from_message(message)
    result = await search_products(**filters)
    if not result.get("success"):
        return {"products": []}

    return {
        "products": result.get("data", {}).get("products", []),
        "filters_applied": result.get("data", {}).get("filters_applied", {}),
    }


def merge_bedrock_response_with_products(response: str, enrichment: dict[str, Any]) -> str:
    products = enrichment.get("products", [])
    if not products:
        return response

    names = ", ".join(product["name"] for product in products[:3])
    product_note = f"\n\nMình đã lọc được {len(products)} sản phẩm phù hợp từ Supabase: {names}."
    return f"{response.strip()}{product_note}"


async def fallback_agent_response(session_id: str | None, message: str) -> dict[str, Any]:
    active_session_id = session_id or f"session_{uuid4().hex}"
    intent = infer_fallback_intent(message)

    if intent == "compare":
        return await fallback_compare_response(active_session_id, message)

    if intent == "stock_promo":
        return await fallback_stock_promo_response(active_session_id, message)

    if intent == "cart":
        return await fallback_cart_response(active_session_id, message)

    return await fallback_search_response(active_session_id, message)


def infer_fallback_intent(message: str) -> str:
    normalized = normalize_text(message)

    if any(keyword in normalized for keyword in ["so sanh", "compare", "khac nhau", "tot hon"]):
        return "compare"

    if any(keyword in normalized for keyword in ["con hang", "ton kho", "stock", "deal", "khuyen mai", "giam gia"]):
        return "stock_promo"

    if any(keyword in normalized for keyword in ["lay", "them vao gio", "add to cart", "mua", "chot"]):
        return "cart"

    return "search"


def normalize_text(value: str) -> str:
    replacements = {
        "á": "a",
        "à": "a",
        "ả": "a",
        "ã": "a",
        "ạ": "a",
        "ă": "a",
        "ắ": "a",
        "ằ": "a",
        "ẳ": "a",
        "ẵ": "a",
        "ặ": "a",
        "â": "a",
        "ấ": "a",
        "ầ": "a",
        "ẩ": "a",
        "ẫ": "a",
        "ậ": "a",
        "é": "e",
        "è": "e",
        "ẻ": "e",
        "ẽ": "e",
        "ẹ": "e",
        "ê": "e",
        "ế": "e",
        "ề": "e",
        "ể": "e",
        "ễ": "e",
        "ệ": "e",
        "í": "i",
        "ì": "i",
        "ỉ": "i",
        "ĩ": "i",
        "ị": "i",
        "ó": "o",
        "ò": "o",
        "ỏ": "o",
        "õ": "o",
        "ọ": "o",
        "ô": "o",
        "ố": "o",
        "ồ": "o",
        "ổ": "o",
        "ỗ": "o",
        "ộ": "o",
        "ơ": "o",
        "ớ": "o",
        "ờ": "o",
        "ở": "o",
        "ỡ": "o",
        "ợ": "o",
        "ú": "u",
        "ù": "u",
        "ủ": "u",
        "ũ": "u",
        "ụ": "u",
        "ư": "u",
        "ứ": "u",
        "ừ": "u",
        "ử": "u",
        "ữ": "u",
        "ự": "u",
        "ý": "y",
        "ỳ": "y",
        "ỷ": "y",
        "ỹ": "y",
        "ỵ": "y",
        "đ": "d",
    }
    normalized = repair_mojibake(value).lower()
    for source, target in replacements.items():
        normalized = normalized.replace(source, target)
    return normalized


def repair_mojibake(value: str) -> str:
    if "Ã" not in value and "Ä" not in value and "Æ" not in value:
        return value

    for encoding in ("latin1", "cp1252"):
        try:
            return value.encode(encoding).decode("utf-8")
        except UnicodeError:
            continue
    return value


async def fallback_search_response(active_session_id: str, message: str) -> dict[str, Any]:
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


async def fallback_compare_response(active_session_id: str, message: str) -> dict[str, Any]:
    products = await resolve_products_from_message(message, limit=3)

    if len(products) < 2:
        search = await search_products(**infer_filters_from_message(message))
        products = search.get("data", {}).get("products", [])[:3] if search.get("success") else []

    if len(products) < 2:
        return {
            "response": (
                f"{FALLBACK_RESPONSE_TEMPLATE}\n\n"
                "Mình chưa xác định đủ 2 sản phẩm để so sánh. Bạn có thể nêu tên 2 mẫu, ví dụ: "
                "ASUS TUF và MSI Katana."
            ),
            "session_id": active_session_id,
            "products": products,
            "comparison": None,
            "cart_update": None,
            "source": "local_fallback_compare",
        }

    comparison_result = await compare_products([product["id"] for product in products[:3]])
    comparison = comparison_result.get("data") if comparison_result.get("success") else None
    names = " và ".join(product["name"] for product in products[:2])

    return {
        "response": (
            f"{FALLBACK_RESPONSE_TEMPLATE}\n\n"
            f"Mình đã chuyển câu hỏi sang luồng so sánh sản phẩm và dựng bảng so sánh cho {names}. "
            "Nếu ưu tiên giá/hiệu năng, hãy nhìn các dòng được highlight trong bảng."
        ),
        "session_id": active_session_id,
        "products": [],
        "comparison": comparison,
        "cart_update": None,
        "source": "local_fallback_compare",
    }


async def fallback_stock_promo_response(active_session_id: str, message: str) -> dict[str, Any]:
    products = await resolve_products_from_message(message, limit=1)

    if not products:
        return {
            "response": (
                f"{FALLBACK_RESPONSE_TEMPLATE}\n\n"
                "Mình chưa xác định được sản phẩm cần kiểm tra tồn kho/khuyến mãi. "
                "Bạn có thể hỏi rõ hơn, ví dụ: MSI Katana còn hàng không?"
            ),
            "session_id": active_session_id,
            "products": [],
            "comparison": None,
            "cart_update": None,
            "source": "local_fallback_stock_promo",
        }

    product = products[0]
    stock_result = await check_stock_and_promotion(product["id"])
    stock_data = stock_result.get("data", {}) if stock_result.get("success") else {}
    promotions = stock_data.get("promotions", [])
    promo_text = promotions[0]["label"] if promotions else "chưa có khuyến mãi active trong dữ liệu demo"

    return {
        "response": (
            f"{FALLBACK_RESPONSE_TEMPLATE}\n\n"
            f"{product['name']} hiện {stock_data.get('stock_label', 'chưa rõ tồn kho')}. "
            f"Khuyến mãi: {promo_text}."
        ),
        "session_id": active_session_id,
        "products": products,
        "comparison": None,
        "cart_update": None,
        "source": "local_fallback_stock_promo",
    }


async def fallback_cart_response(active_session_id: str, message: str) -> dict[str, Any]:
    products = await resolve_products_from_message(message, limit=1)

    if not products:
        search = await search_products(**infer_filters_from_message(message))
        products = search.get("data", {}).get("products", [])[:1] if search.get("success") else []

    if not products:
        return {
            "response": (
                f"{FALLBACK_RESPONSE_TEMPLATE}\n\n"
                "Mình chưa biết bạn muốn thêm sản phẩm nào vào giỏ. Hãy nói tên mẫu, ví dụ: lấy MSI Katana."
            ),
            "session_id": active_session_id,
            "products": [],
            "comparison": None,
            "cart_update": None,
            "source": "local_fallback_cart",
        }

    product = products[0]
    cart_result = await add_to_cart(product["id"], quantity=1, session_id=active_session_id)
    cart_data = cart_result.get("data", {}) if cart_result.get("success") else {}
    upsells = cart_data.get("upsell_categories", [])
    upsell_text = f" Mình cũng có thể gợi ý thêm {', '.join(upsells)} phù hợp." if upsells else ""

    return {
        "response": (
            f"{FALLBACK_RESPONSE_TEMPLATE}\n\n"
            f"Mình đã kiểm tra tồn kho và thêm {product['name']} vào giỏ demo.{upsell_text}"
        ),
        "session_id": active_session_id,
        "products": [cart_data.get("product") or product],
        "comparison": None,
        "cart_update": cart_data.get("cart_update"),
        "source": "local_fallback_cart",
    }


async def resolve_products_from_message(message: str, limit: int = 3) -> list[dict[str, Any]]:
    filters = infer_filters_from_message(message)
    filters["limit"] = max(80, limit)
    result = await search_products(**filters)
    products = result.get("data", {}).get("products", []) if result.get("success") else []

    if not products:
        broad_result = await search_products(query=message, limit=80)
        products = broad_result.get("data", {}).get("products", []) if broad_result.get("success") else []

    normalized_message = normalize_text(message)
    tokens = [
        token
        for token in re.split(r"[^a-z0-9]+", normalized_message)
        if len(token) >= 3 and token not in {"cho", "minh", "voi", "nay", "con", "hang", "khong"}
    ]

    def match_score(product: dict[str, Any]) -> int:
        haystack = normalize_text(f"{product.get('brand', '')} {product.get('name', '')}")
        return sum(1 for token in tokens if token in haystack)

    matched = [product for product in products if match_score(product) > 0]
    ranked = sorted(
        matched or products,
        key=lambda product: (match_score(product), int(product.get("price") or 0)),
        reverse=True,
    )
    return ranked[:limit]
