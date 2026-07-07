import logging
from datetime import date
from typing import Any

from app.db.supabase_client import get_supabase_client


logger = logging.getLogger(__name__)


def _execute_query(query: Any) -> Any:
    return query.execute()


async def get_products_by_filter(
    category: str | None = None,
    max_price: int | None = None,
    min_price: int | None = None,
    brand: str | None = None,
    tags: list[str] | None = None,
    limit: int = 5,
) -> list[dict[str, Any]]:
    try:
        supabase = get_supabase_client()
        if supabase is None:
            return []

        query = supabase.table("products").select("*").eq("is_active", True)

        if category:
            query = query.eq("category", category)
        if max_price is not None:
            query = query.lte("price", max_price)
        if min_price is not None:
            query = query.gte("price", min_price)
        if brand:
            query = query.ilike("brand", brand)
        if tags:
            query = query.overlaps("tags", tags)

        result = _execute_query(query.order("price").limit(limit))
        return result.data or []
    except Exception as error:
        logger.error("get_products_by_filter error: %s", error)
        return []


async def get_product_by_id(product_id: str) -> dict[str, Any] | None:
    try:
        supabase = get_supabase_client()
        if supabase is None:
            return None

        result = _execute_query(
            supabase.table("products")
            .select("*")
            .eq("id", product_id)
            .eq("is_active", True)
            .limit(1)
        )
        return result.data[0] if result.data else None
    except Exception as error:
        logger.error("get_product_by_id error for %s: %s", product_id, error)
        return None


async def get_promotions_by_product(product_id: str) -> list[dict[str, Any]]:
    try:
        supabase = get_supabase_client()
        if supabase is None:
            return []

        today = date.today().isoformat()
        result = _execute_query(
            supabase.table("promotions")
            .select("*")
            .eq("product_id", product_id)
            .eq("is_active", True)
            .lte("start_date", today)
            .gte("end_date", today)
        )
        return result.data or []
    except Exception as error:
        logger.error("get_promotions_by_product error for %s: %s", product_id, error)
        return []


async def get_products_by_ids(product_ids: list[str]) -> list[dict[str, Any]]:
    try:
        supabase = get_supabase_client()
        if supabase is None or not product_ids:
            return []

        result = _execute_query(
            supabase.table("products")
            .select("*")
            .in_("id", product_ids)
            .eq("is_active", True)
        )
        products = result.data or []
        product_order = {product_id: index for index, product_id in enumerate(product_ids)}
        return sorted(products, key=lambda product: product_order.get(product["id"], len(product_order)))
    except Exception as error:
        logger.error("get_products_by_ids error: %s", error)
        return []


async def update_chat_session(
    session_id: str,
    messages: list[dict[str, Any]],
    user_context: dict[str, Any] | None = None,
) -> None:
    try:
        supabase = get_supabase_client()
        if supabase is None:
            return

        payload = {
            "session_id": session_id,
            "messages": messages,
        }
        if user_context is not None:
            payload["user_context"] = user_context

        _execute_query(
            supabase.table("chat_sessions")
            .upsert(payload, on_conflict="session_id")
        )
    except Exception as error:
        logger.error("update_chat_session error for %s: %s", session_id, error)


async def log_analytics_event(
    session_id: str,
    event_type: str,
    event_payload: dict[str, Any],
) -> None:
    try:
        supabase = get_supabase_client()
        if supabase is None:
            return

        _execute_query(
            supabase.table("analytics_events")
            .insert(
                {
                    "session_id": session_id,
                    "event_type": event_type,
                    "event_payload": event_payload,
                }
            )
        )
    except Exception as error:
        logger.error("log_analytics_event error for %s: %s", session_id, error)
