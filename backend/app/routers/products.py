import logging

from fastapi import APIRouter, Query
from fastapi.responses import JSONResponse

from app.agent.tools import build_product_card, check_stock_and_promotion
from app.db.queries import get_product_by_id, get_products_by_filter


logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/v1", tags=["products"])


def _success(data: dict, message: str) -> dict:
    return {"success": True, "data": data, "message": message}


def _error(error: str, message: str, status_code: int = 400) -> JSONResponse:
    return JSONResponse(
        status_code=status_code,
        content={"success": False, "error": error, "message": message},
    )


@router.get("/products")
async def list_products(
    category: str | None = None,
    max_price: int | None = Query(default=None, ge=0),
    min_price: int | None = Query(default=None, ge=0),
    brand: str | None = None,
    tags: list[str] | None = Query(default=None),
    limit: int = Query(default=12, ge=1, le=50),
):
    try:
        products = await get_products_by_filter(
            category=category,
            max_price=max_price,
            min_price=min_price,
            brand=brand,
            tags=tags,
            limit=limit,
        )
        product_cards = [await build_product_card(product) for product in products]

        return _success(
            {
                "products": product_cards,
                "total": len(product_cards),
                "filters_applied": {
                    "category": category,
                    "max_price": max_price,
                    "min_price": min_price,
                    "brand": brand,
                    "tags": tags or [],
                    "limit": limit,
                },
            },
            "Products loaded",
        )
    except Exception as error:
        logger.error("GET /products error: %s", error)
        return _error("products_failed", "Could not load products", 500)


@router.get("/products/{product_id}")
async def get_product(product_id: str):
    try:
        product = await get_product_by_id(product_id)
        if not product:
            return _error("product_not_found", "Product not found", 404)

        return _success({"product": product}, "Product loaded")
    except Exception as error:
        logger.error("GET /products/%s error: %s", product_id, error)
        return _error("product_failed", "Could not load product", 500)


@router.get("/products/{product_id}/stock")
async def get_product_stock(product_id: str):
    try:
        result = await check_stock_and_promotion(product_id)
        if not result.get("success"):
            return _error(result.get("error", "stock_failed"), result.get("message", "Could not check stock"), 404)

        return result
    except Exception as error:
        logger.error("GET /products/%s/stock error: %s", product_id, error)
        return _error("stock_failed", "Could not check stock or promotion", 500)
