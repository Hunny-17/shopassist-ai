from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field


Category = Literal["laptop", "monitor", "keyboard", "mouse", "headset"]
StockStatus = Literal["in_stock", "low_stock", "out_of_stock"]
DiscountType = Literal["percentage", "fixed", "gift", "bundle"]


class Product(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    category: Category
    subcategory: str | None = None
    brand: str
    price: int
    original_price: int | None = None
    stock: int = Field(ge=0)
    specs: dict[str, Any] = Field(default_factory=dict)
    description: str | None = None
    image_url: str | None = None
    warranty_months: int = 12
    tags: list[str] = Field(default_factory=list)
    is_active: bool = True
    created_at: datetime | None = None
    updated_at: datetime | None = None


class Promotion(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    product_id: str
    discount_type: DiscountType
    discount_value: int | float | None = None
    label: str
    start_date: str
    end_date: str
    is_active: bool = True
    created_at: datetime | None = None


class ProductFilter(BaseModel):
    category: Category | None = None
    max_price: int | None = Field(default=None, ge=0)
    min_price: int | None = Field(default=None, ge=0)
    brand: str | None = None
    tags: list[str] | None = None
    limit: int = Field(default=5, ge=1, le=20)


class SpecsSummary(BaseModel):
    cpu: str | None = None
    ram: str | None = None
    gpu: str | None = None
    screen: str | None = None


class ProductCardData(BaseModel):
    id: str
    name: str
    brand: str
    category: Category
    price: int
    original_price: int | None = None
    image_url: str | None = None
    stock: int
    stock_status: StockStatus
    promotion: Promotion | None = None
    tags: list[str] = Field(default_factory=list)
    specs_summary: SpecsSummary = Field(default_factory=SpecsSummary)


class ComparisonRow(BaseModel):
    label: str
    values: list[str]
    winner_index: int | None = None


class ComparisonResult(BaseModel):
    products: list[dict[str, str]]
    rows: list[ComparisonRow]
    summary: str
