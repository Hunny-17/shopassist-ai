import json
import os
import re
from collections import Counter
from datetime import date
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
PRODUCTS_PATH = ROOT / "data" / "products.json"
PROMOTIONS_PATH = ROOT / "data" / "promotions.json"

VALID_CATEGORIES = {"laptop", "monitor", "keyboard", "mouse", "headset"}
VALID_DISCOUNT_TYPES = {"percentage", "fixed", "gift", "bundle"}
REQUIRED_TAGS = {
    "gaming",
    "office",
    "portable",
    "ultrabook",
    "budget",
    "premium",
    "4k",
    "144hz",
    "mechanical",
    "wireless",
    "rgb",
}
SLUG_PATTERN = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")


def load_json(path: Path) -> list[dict[str, Any]]:
    with path.open("r", encoding="utf-8") as file:
        data = json.load(file)

    if not isinstance(data, list):
        raise ValueError(f"{path.name} must contain a JSON array")

    return data


def parse_iso_date(value: Any, field_name: str, promo_id: str) -> date:
    if not isinstance(value, str):
        raise ValueError(f"{field_name} must be an ISO date for {promo_id}")

    try:
        return date.fromisoformat(value)
    except ValueError as error:
        raise ValueError(f"Invalid {field_name} for {promo_id}: {value}") from error


def validate_products(products: list[dict[str, Any]]) -> None:
    seen_ids: set[str] = set()

    for product in products:
        product_id = product.get("id")

        if not product_id:
            raise ValueError("Product missing id")

        if not isinstance(product_id, str) or not SLUG_PATTERN.match(product_id):
            raise ValueError(f"Invalid slug id for product: {product_id}")

        if product_id in seen_ids:
            raise ValueError(f"Duplicate product id: {product_id}")

        seen_ids.add(product_id)

        if not product.get("name"):
            raise ValueError(f"Missing name for {product_id}")

        if product.get("category") not in VALID_CATEGORIES:
            raise ValueError(f"Invalid category for {product_id}")

        if not product.get("brand"):
            raise ValueError(f"Missing brand for {product_id}")

        if not isinstance(product.get("price"), int | float) or product["price"] <= 0:
            raise ValueError(f"Invalid price for {product_id}")

        original_price = product.get("original_price")
        if original_price is not None and original_price < product["price"]:
            raise ValueError(f"original_price < price for {product_id}")

        if not isinstance(product.get("stock"), int) or product["stock"] < 0:
            raise ValueError(f"Invalid stock for {product_id}")

        if not isinstance(product.get("specs"), dict):
            raise ValueError(f"Invalid specs for {product_id}")

        tags = product.get("tags")
        if not isinstance(tags, list) or not tags or not all(isinstance(tag, str) for tag in tags):
            raise ValueError(f"Missing or invalid tags for {product_id}")

        if not isinstance(product.get("is_active"), bool):
            raise ValueError(f"Invalid is_active for {product_id}")


def validate_promotions(promotions: list[dict[str, Any]], product_ids: set[str]) -> None:
    seen_ids: set[str] = set()

    for promo in promotions:
        promo_id = promo.get("id")

        if not promo_id:
            raise ValueError("Promotion missing id")

        if not isinstance(promo_id, str) or not SLUG_PATTERN.match(promo_id):
            raise ValueError(f"Invalid slug id for promotion: {promo_id}")

        if promo_id in seen_ids:
            raise ValueError(f"Duplicate promotion id: {promo_id}")

        seen_ids.add(promo_id)

        if promo.get("product_id") not in product_ids:
            raise ValueError(f"Promotion references missing product: {promo_id}")

        if promo.get("discount_type") not in VALID_DISCOUNT_TYPES:
            raise ValueError(f"Invalid discount_type for {promo_id}")

        if "discount_value" in promo and not isinstance(promo["discount_value"], int | float):
            raise ValueError(f"Invalid discount_value for {promo_id}")

        if not promo.get("label"):
            raise ValueError(f"Missing label for {promo_id}")

        start_date = parse_iso_date(promo.get("start_date"), "start_date", promo_id)
        end_date = parse_iso_date(promo.get("end_date"), "end_date", promo_id)
        if end_date < start_date:
            raise ValueError(f"end_date < start_date for {promo_id}")

        if not isinstance(promo.get("is_active"), bool):
            raise ValueError(f"Invalid is_active for {promo_id}")


def print_summary(products: list[dict[str, Any]], promotions: list[dict[str, Any]]) -> None:
    category_counts = Counter(product["category"] for product in products)
    subcategory_counts = Counter(
        product.get("subcategory", "none") for product in products if product["category"] == "laptop"
    )
    tag_counts = Counter(tag for product in products for tag in product["tags"])
    missing_tags = sorted(REQUIRED_TAGS - set(tag_counts))
    out_of_stock = [product["id"] for product in products if product["stock"] == 0]
    low_stock = [product["id"] for product in products if 0 < product["stock"] < 5]

    print(f"Seeded {len(products)} products")
    print(f"Seeded {len(promotions)} promotions")
    print(f"Category distribution: {dict(sorted(category_counts.items()))}")
    print(f"Laptop subcategory distribution: {dict(sorted(subcategory_counts.items()))}")

    if missing_tags:
        print(f"Warning: missing required tags in catalog: {', '.join(missing_tags)}")

    if out_of_stock:
        print(f"Warning: out-of-stock demo products: {', '.join(out_of_stock)}")

    if low_stock:
        print(f"Warning: low-stock demo products: {', '.join(low_stock)}")


def main() -> None:
    from dotenv import load_dotenv
    from supabase import create_client

    load_dotenv(ROOT / "backend" / ".env")
    load_dotenv(ROOT / ".env")

    supabase_url = os.getenv("SUPABASE_URL")
    service_role_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

    if not supabase_url or not service_role_key:
        raise RuntimeError("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")

    products = load_json(PRODUCTS_PATH)
    promotions = load_json(PROMOTIONS_PATH)

    validate_products(products)
    validate_promotions(promotions, {product["id"] for product in products})

    supabase = create_client(supabase_url, service_role_key)
    supabase.table("products").upsert(products).execute()
    supabase.table("promotions").upsert(promotions).execute()

    print_summary(products, promotions)


if __name__ == "__main__":
    main()
