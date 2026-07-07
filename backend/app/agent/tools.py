import logging
import re
from typing import Any

from app.db.queries import (
    get_product_by_id,
    get_products_by_filter,
    get_products_by_ids,
    get_promotions_by_product,
    log_analytics_event,
)


logger = logging.getLogger(__name__)


def success_response(data: dict[str, Any], message: str) -> dict[str, Any]:
    return {"success": True, "data": data, "message": message}


def error_response(error: str, message: str) -> dict[str, Any]:
    return {"success": False, "error": error, "message": message}


def get_stock_status(stock: int) -> str:
    if stock >= 10:
        return "in_stock"
    if stock > 0:
        return "low_stock"
    return "out_of_stock"


def build_specs_summary(product: dict[str, Any]) -> dict[str, str | None]:
    specs = product.get("specs") or {}
    screen_parts = [
        specs.get("screen_size"),
        specs.get("screen_resolution"),
        specs.get("screen_refresh_rate"),
    ]
    screen = " ".join(str(part) for part in screen_parts if part)

    return {
        "cpu": specs.get("cpu"),
        "ram": specs.get("ram"),
        "gpu": specs.get("gpu"),
        "screen": screen or None,
    }


async def build_product_card(product: dict[str, Any]) -> dict[str, Any]:
    promotions = await get_promotions_by_product(product["id"])
    promotion = promotions[0] if promotions else None

    return {
        "id": product["id"],
        "name": product["name"],
        "brand": product["brand"],
        "category": product["category"],
        "price": product["price"],
        "original_price": product.get("original_price"),
        "image_url": product.get("image_url"),
        "stock": product.get("stock", 0),
        "stock_status": get_stock_status(product.get("stock", 0)),
        "promotion": promotion,
        "tags": product.get("tags", []),
        "specs_summary": build_specs_summary(product),
    }


def rank_products(products: list[dict[str, Any]], use_case: str | None, tags: list[str] | None) -> list[dict[str, Any]]:
    desired_tags = set(tags or [])
    if use_case:
        desired_tags.add(use_case)

    def score(product: dict[str, Any]) -> tuple[int, int, int]:
        product_tags = set(product.get("tags", []))
        tag_score = len(desired_tags & product_tags)
        stock_score = 1 if product.get("stock", 0) > 0 else 0
        price_score = -int(product.get("price", 0))
        return tag_score, stock_score, price_score

    return sorted(products, key=score, reverse=True)


async def search_products(
    query: str,
    category: str | None = None,
    max_price: int | None = None,
    min_price: int | None = None,
    brand: str | None = None,
    use_case: str | None = None,
    tags: list[str] | None = None,
    limit: int = 5,
) -> dict[str, Any]:
    """
    Search products by natural language query and structured filters.

    Args:
        query: Natural language search query.
        category: Product category such as laptop, monitor, keyboard, mouse, headset.
        max_price: Maximum price in VND.
        min_price: Minimum price in VND.
        brand: Preferred brand.
        use_case: Use case such as gaming, office, design, study, portable.
        tags: Tags to filter by.
        limit: Maximum number of results.

    Returns:
        Standard response dict with products and filters metadata.
    """
    try:
        products = await get_products_by_filter(
            category=category,
            max_price=max_price,
            min_price=min_price,
            brand=brand,
            tags=tags,
            limit=max(limit, 10),
        )
        ranked_products = rank_products(products, use_case, tags)[:limit]
        product_cards = [await build_product_card(product) for product in ranked_products]

        filters_applied = {
            "query": query,
            "category": category,
            "max_price": max_price,
            "min_price": min_price,
            "brand": brand,
            "use_case": use_case,
            "tags": tags or [],
            "limit": limit,
        }

        return success_response(
            {
                "products": product_cards,
                "total": len(product_cards),
                "filters_applied": filters_applied,
            },
            "Found matching products",
        )
    except Exception as error:
        logger.error("search_products tool error: %s", error)
        return error_response("search_products_failed", "Could not search products")


async def get_product_detail(product_id: str) -> dict[str, Any]:
    """
    Get full product detail by product id.

    Use this when the user asks for specific specs, warranty, price, or description.
    """
    try:
        product = await get_product_by_id(product_id)
        if not product:
            return error_response("product_not_found", "Product not found")

        promotions = await get_promotions_by_product(product_id)
        return success_response(
            {"product": product, "promotions": promotions},
            "Product detail loaded",
        )
    except Exception as error:
        logger.error("get_product_detail tool error: %s", error)
        return error_response("get_product_detail_failed", "Could not load product detail")


def _format_vnd(price: Any) -> str:
    if price is None:
        return "N/A"
    return f"{int(price):,}đ".replace(",", ".")


def _spec_value(product: dict[str, Any], key: str) -> str:
    specs = product.get("specs") or {}
    return str(specs.get(key) or "N/A")


async def compare_products(
    product_ids: list[str],
    criteria: list[str] | None = None,
) -> dict[str, Any]:
    """
    Compare 2-3 products and produce structured comparison rows.

    Args:
        product_ids: List of 2-3 product ids.
        criteria: Optional criteria such as price, performance, weight, portability.
    """
    try:
        if len(product_ids) < 2 or len(product_ids) > 3:
            return error_response("invalid_compare_count", "Compare requires 2 or 3 products")

        products = await get_products_by_ids(product_ids)
        if len(products) != len(product_ids):
            return error_response("product_not_found", "One or more products were not found")

        rows = [
            {"label": "Giá", "values": [_format_vnd(product.get("price")) for product in products]},
            {"label": "CPU", "values": [_spec_value(product, "cpu") for product in products]},
            {"label": "RAM", "values": [_spec_value(product, "ram") for product in products]},
            {"label": "GPU", "values": [_spec_value(product, "gpu") for product in products]},
            {"label": "Storage", "values": [_spec_value(product, "storage") for product in products]},
            {"label": "Màn hình", "values": [_spec_value(product, "screen_size") for product in products]},
            {"label": "Tần số quét", "values": [_spec_value(product, "screen_refresh_rate") for product in products]},
            {"label": "Pin", "values": [_spec_value(product, "battery_wh") for product in products]},
            {"label": "Trọng lượng", "values": [_spec_value(product, "weight_kg") for product in products]},
            {"label": "Bảo hành", "values": [f"{product.get('warranty_months', 12)} tháng" for product in products]},
            {"label": "Stock", "values": [str(product.get("stock", 0)) for product in products]},
        ]

        cheapest_index = min(range(len(products)), key=lambda index: products[index].get("price", 0))
        rows[0]["winner_index"] = cheapest_index
        summary = f"{products[cheapest_index]['name']} có giá tốt nhất trong nhóm so sánh."

        return success_response(
            {
                "products": [{"id": product["id"], "name": product["name"]} for product in products],
                "rows": rows,
                "summary": summary,
                "criteria": criteria or [],
            },
            "Comparison generated",
        )
    except Exception as error:
        logger.error("compare_products tool error: %s", error)
        return error_response("compare_products_failed", "Could not compare products")


async def check_stock_and_promotion(product_id: str) -> dict[str, Any]:
    """
    Check stock count and active promotions for a product.

    Use this when the user asks if an item is available or has a deal.
    """
    try:
        product = await get_product_by_id(product_id)
        if not product:
            return error_response("product_not_found", "Product not found")

        promotions = await get_promotions_by_product(product_id)
        stock = product.get("stock", 0)
        status = get_stock_status(stock)
        label = "Còn hàng" if status == "in_stock" else f"Còn {stock} cái" if status == "low_stock" else "Hết hàng"

        return success_response(
            {
                "product_id": product_id,
                "stock": stock,
                "stock_status": status,
                "stock_label": label,
                "promotions": promotions,
            },
            "Stock and promotion checked",
        )
    except Exception as error:
        logger.error("check_stock_and_promotion tool error: %s", error)
        return error_response("check_stock_and_promotion_failed", "Could not check stock or promotion")


async def get_recommendations(
    user_context: dict[str, Any],
    exclude_ids: list[str] | None = None,
    limit: int = 3,
) -> dict[str, Any]:
    """
    Recommend products from user context such as budget, use_case, brand, and category.
    """
    try:
        exclude_set = set(exclude_ids or [])
        products = await get_products_by_filter(
            category=user_context.get("category"),
            max_price=user_context.get("budget") or user_context.get("max_price"),
            min_price=user_context.get("min_price"),
            brand=user_context.get("brand"),
            tags=[user_context["use_case"]] if user_context.get("use_case") else None,
            limit=20,
        )
        filtered = [product for product in products if product["id"] not in exclude_set]
        ranked = rank_products(filtered, user_context.get("use_case"), user_context.get("tags"))[:limit]

        return success_response(
            {
                "products": [await build_product_card(product) for product in ranked],
                "total": len(ranked),
                "user_context": user_context,
            },
            "Recommendations generated",
        )
    except Exception as error:
        logger.error("get_recommendations tool error: %s", error)
        return error_response("get_recommendations_failed", "Could not generate recommendations")


async def add_to_cart(product_id: str, quantity: int = 1, session_id: str | None = None) -> dict[str, Any]:
    """
    Add a product to the current cart session after checking stock.

    Args:
        product_id: Product id to add.
        quantity: Quantity requested.
        session_id: Current chat session id.
    """
    try:
        product = await get_product_by_id(product_id)
        if not product:
            return error_response("product_not_found", "Product not found")

        stock = product.get("stock", 0)
        if stock <= 0:
            return error_response("out_of_stock", "Product is out of stock")
        if quantity < 1 or quantity > stock:
            return error_response("invalid_quantity", "Quantity is not available")

        promotions = await get_promotions_by_product(product_id)
        cart_update = {
            "product_id": product_id,
            "quantity": quantity,
            "price": product["price"],
            "has_promotion": bool(promotions),
        }

        if session_id:
            await log_analytics_event(session_id, "add_to_cart", cart_update)

        upsell_tags = {
            "laptop": ["mouse", "keyboard", "headset"],
            "monitor": ["keyboard", "mouse"],
            "keyboard": ["mouse"],
            "headset": ["mouse", "keyboard"],
        }
        suggestions = upsell_tags.get(product.get("category"), [])

        return success_response(
            {
                "cart_update": cart_update,
                "product": await build_product_card(product),
                "upsell_categories": suggestions,
            },
            "Product added to cart",
        )
    except Exception as error:
        logger.error("add_to_cart tool error: %s", error)
        return error_response("add_to_cart_failed", "Could not add product to cart")


def infer_filters_from_message(message: str) -> dict[str, Any]:
    normalized = message.lower()
    filters: dict[str, Any] = {"query": message, "limit": 5}

    if "laptop" in normalized:
        filters["category"] = "laptop"
    elif "màn hình" in normalized or "monitor" in normalized:
        filters["category"] = "monitor"
    elif "bàn phím" in normalized or "keyboard" in normalized:
        filters["category"] = "keyboard"
    elif "chuột" in normalized or "mouse" in normalized:
        filters["category"] = "mouse"
    elif "tai nghe" in normalized or "headset" in normalized:
        filters["category"] = "headset"

    tags = []
    for keyword, tag in [
        ("gaming", "gaming"),
        ("game", "gaming"),
        ("văn phòng", "office"),
        ("office", "office"),
        ("wireless", "wireless"),
        ("không dây", "wireless"),
        ("4k", "4k"),
        ("144hz", "144hz"),
        ("cơ", "mechanical"),
        ("rgb", "rgb"),
        ("mỏng nhẹ", "portable"),
        ("ultrabook", "ultrabook"),
        ("ban đêm", "low-blue-light"),
        ("không hại mắt", "flicker-free"),
    ]:
        if keyword in normalized:
            tags.append(tag)

    if tags:
        filters["tags"] = sorted(set(tags))
        filters["use_case"] = "gaming" if "gaming" in tags else "office" if "office" in tags else None

    budget_match = re.search(r"(\d+)\s*(triệu|tr|m)\b", normalized)
    if budget_match:
        filters["max_price"] = int(budget_match.group(1)) * 1_000_000

    under_match = re.search(r"dưới\s*(\d+)\s*(k|nghìn|ngàn)", normalized)
    if under_match:
        filters["max_price"] = int(under_match.group(1)) * 1_000

    return filters
