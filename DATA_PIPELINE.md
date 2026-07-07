# ShopAssist AI — Data Pipeline

*Tài liệu này mô tả luồng dữ liệu end-to-end cho ShopAssist AI: từ tạo catalog sản phẩm demo, chuẩn hóa dữ liệu, seed vào Supabase, đồng bộ realtime, cho tới cách AWS Bedrock Agent và frontend sử dụng dữ liệu trong trải nghiệm mua sắm.*

---

## 1. Mục tiêu của Data Pipeline

Data Pipeline của ShopAssist AI có 4 mục tiêu chính:

1. Tạo dữ liệu sản phẩm đủ thuyết phục cho demo hackathon.
2. Chuẩn hóa dữ liệu theo schema thống nhất để backend, agent tools và frontend dùng chung.
3. Đưa dữ liệu vào Supabase để agent có thể query real-time thay vì hardcode.
4. Chuẩn bị dữ liệu cho Bedrock Knowledge Bases nhằm trả lời câu hỏi chi tiết về specs, bảo hành, FAQ và chính sách.

Trong MVP, dữ liệu có thể là fake/synthetic nhưng phải được thiết kế giống catalog thật của Phong Vũ: có danh mục, thương hiệu, giá, tồn kho, thông số kỹ thuật, khuyến mãi và tags phục vụ filtering.

---

## 2. Tổng quan luồng dữ liệu

```text
Raw / Synthetic Product Data
        ↓
data/products.json
data/promotions.json
        ↓
Validation + Normalization
        ↓
data/seed_products.py
        ↓
Supabase PostgreSQL
        ├── products
        ├── promotions
        ├── chat_sessions
        └── analytics_events
        ↓
Backend FastAPI
        ├── db/queries.py
        └── agent/tools.py
        ↓
AWS Bedrock Agent
        ├── search_products
        ├── get_product_detail
        ├── compare_products
        ├── check_stock_and_promotion
        ├── get_recommendations
        └── add_to_cart
        ↓
Frontend React
        ├── ProductCard
        ├── ProductGrid
        ├── ComparisonTable
        ├── StockBadge
        └── CartDrawer
```

---

## 3. Nguồn dữ liệu

### 3.1. MVP / Hackathon

Trong giai đoạn V1, dữ liệu được tạo thủ công hoặc generate bằng AI theo format cố định.

Nguồn chính:

| File | Vai trò |
|---|---|
| `data/products.json` | Catalog 50 sản phẩm demo |
| `data/promotions.json` | Danh sách khuyến mãi active |
| `data/seed_products.py` | Script seed dữ liệu vào Supabase |
| `infrastructure/supabase_schema.sql` | Schema database |
| `infrastructure/bedrock_kb_config.json` | Cấu hình Bedrock Knowledge Base |

### 3.2. Pilot / Production

Ở V2 trở đi, pipeline có thể thay nguồn fake data bằng dữ liệu thật từ:

- Phong Vũ product API.
- Export catalog nội bộ.
- Scrape hợp lệ từ website nếu được phép.
- Admin dashboard nhập dữ liệu.
- Webhook cập nhật stock / promotion.

---

## 4. Data Assets cần tạo ở Phase 1

Theo thứ tự generate file, nhóm data phải chạy đầu tiên:

```text
1. data/products.json
2. data/promotions.json
3. data/seed_products.py
```

Lý do: Backend tools, Supabase query, frontend ProductCard và demo flow đều phụ thuộc vào catalog sản phẩm.

---

## 5. products.json Specification

### 5.1. Số lượng và phân bổ

`products.json` cần có đúng hoặc tối thiểu 50 sản phẩm theo phân bổ:

| Category | Số lượng | Ghi chú |
|---|---:|---|
| Laptop gaming | 10 | Dành cho gaming, performance, GPU rời |
| Laptop office / ultrabook | 10 | Dành cho học tập, văn phòng, portable |
| Monitor | 10 | Có 4K, 144Hz, office, gaming |
| Keyboard | 8 | Có mechanical, wireless, RGB |
| Mouse | 7 | Có gaming, wireless, budget |
| Headset | 5 | Có gaming, wireless, microphone |

Tổng: 50 sản phẩm.

### 5.2. Brands

Danh sách brand nên cover đủ:

```text
ASUS, MSI, Dell, HP, Lenovo, Acer, LG, Samsung, Logitech, Razer, SteelSeries
```

Có thể thêm brand phụ nếu cần, nhưng không nên làm loãng dữ liệu demo.

### 5.3. Price ranges

| Nhóm sản phẩm | Khoảng giá |
|---|---:|
| Laptop gaming | 15,000,000 – 45,000,000 VND |
| Laptop office | 8,000,000 – 25,000,000 VND |
| Monitor | 3,000,000 – 20,000,000 VND |
| Peripherals | 300,000 – 3,000,000 VND |

### 5.4. Product object format

```json
{
  "id": "asus-tuf-a15-001",
  "name": "ASUS TUF Gaming A15 FA507NV",
  "category": "laptop",
  "subcategory": "gaming",
  "brand": "ASUS",
  "price": 22990000,
  "original_price": 25990000,
  "stock": 8,
  "specs": {
    "cpu": "AMD Ryzen 7 7735HS",
    "ram": "16GB DDR5",
    "ram_upgradeable": true,
    "gpu": "NVIDIA RTX 4060 8GB",
    "storage": "512GB NVMe SSD",
    "storage_upgradeable": true,
    "screen_size": "15.6 inch",
    "screen_resolution": "1920x1080",
    "screen_refresh_rate": "144Hz",
    "battery_wh": 90,
    "weight_kg": 2.2,
    "os": "Windows 11 Home",
    "ports": ["USB-A x3", "USB-C", "HDMI 2.1"],
    "thunderbolt": false,
    "wifi": "WiFi 6",
    "bluetooth": "5.2"
  },
  "description": "Laptop gaming tầm trung phù hợp chơi eSports, học tập và làm đồ họa nhẹ.",
  "image_url": "https://example.com/images/asus-tuf-a15.jpg",
  "warranty_months": 24,
  "tags": ["gaming", "144hz", "premium", "rgb"],
  "is_active": true
}
```

### 5.5. Tags bắt buộc

Tags dùng cho filtering, recommendation và intent mapping.

```text
gaming
office
portable
ultrabook
budget
premium
4k
144hz
mechanical
wireless
rgb
```

Khuyến nghị thêm tags phụ:

```text
student
design
work
lightweight
creator
esports
low-blue-light
flicker-free
combo
```

---

## 6. promotions.json Specification

### 6.1. Mục tiêu

`promotions.json` dùng để agent trả lời các câu hỏi như:

- “Có deal gì không?”
- “Còn khuyến mãi không?”
- “Mua laptop có tặng chuột không?”
- “Sản phẩm này đang giảm bao nhiêu?”

### 6.2. Số lượng

V1 nên có 10–15 promotions active để demo tự nhiên.

### 6.3. Promotion object format

```json
{
  "id": "promo-msi-katana-10pct",
  "product_id": "msi-katana-15-001",
  "discount_type": "percentage",
  "discount_value": 10,
  "label": "Giảm 10% + tặng chuột gaming",
  "start_date": "2026-07-01",
  "end_date": "2026-07-31",
  "is_active": true
}
```

### 6.4. discount_type

| Value | Ý nghĩa |
|---|---|
| `percentage` | Giảm theo phần trăm |
| `fixed` | Giảm số tiền cố định |
| `gift` | Tặng quà |
| `bundle` | Combo giảm giá |

---

## 7. Supabase Schema

### 7.1. products

```sql
create table if not exists products (
  id text primary key,
  name text not null,
  category text not null,
  subcategory text,
  brand text not null,
  price numeric not null,
  original_price numeric,
  stock integer not null default 0,
  specs jsonb not null default '{}'::jsonb,
  description text,
  image_url text,
  warranty_months integer default 12,
  tags text[] default '{}',
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

### 7.2. promotions

```sql
create table if not exists promotions (
  id text primary key,
  product_id text references products(id) on delete cascade,
  discount_type text not null,
  discount_value numeric,
  label text not null,
  start_date date not null,
  end_date date not null,
  is_active boolean default true,
  created_at timestamptz default now()
);
```

### 7.3. chat_sessions

```sql
create table if not exists chat_sessions (
  id uuid primary key default gen_random_uuid(),
  session_id text unique not null,
  messages jsonb not null default '[]'::jsonb,
  user_context jsonb not null default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

### 7.4. analytics_events

```sql
create table if not exists analytics_events (
  id uuid primary key default gen_random_uuid(),
  session_id text,
  event_type text not null,
  event_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz default now()
);
```

### 7.5. Indexes

```sql
create index if not exists idx_products_category on products(category);
create index if not exists idx_products_brand on products(brand);
create index if not exists idx_products_price on products(price);
create index if not exists idx_products_tags on products using gin(tags);
create index if not exists idx_products_specs on products using gin(specs);
create index if not exists idx_promotions_product_id on promotions(product_id);
create index if not exists idx_chat_sessions_session_id on chat_sessions(session_id);
create index if not exists idx_analytics_events_session_id on analytics_events(session_id);
```

---

## 8. Validation Rules

Trước khi seed vào Supabase, `seed_products.py` cần validate:

### 8.1. Product validation

| Field | Rule |
|---|---|
| `id` | Không trùng, dạng slug text |
| `name` | Không rỗng |
| `category` | Một trong: `laptop`, `monitor`, `keyboard`, `mouse`, `headset` |
| `brand` | Không rỗng |
| `price` | Số dương |
| `original_price` | >= `price`, nếu có |
| `stock` | Số nguyên >= 0 |
| `specs` | Object JSON |
| `tags` | Array string, tối thiểu 1 tag |
| `is_active` | Boolean |

### 8.2. Promotion validation

| Field | Rule |
|---|---|
| `id` | Không trùng |
| `product_id` | Phải tồn tại trong `products.json` |
| `discount_type` | `percentage`, `fixed`, `gift`, `bundle` |
| `start_date` | ISO date |
| `end_date` | ISO date và >= `start_date` |
| `is_active` | Boolean |

---

## 9. seed_products.py Flow

```text
Load .env
  ↓
Connect Supabase bằng SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
  ↓
Read data/products.json
Read data/promotions.json
  ↓
Validate products
Validate promotions
  ↓
Upsert products
  ↓
Upsert promotions
  ↓
Print summary
  ├── Total products inserted/updated
  ├── Total promotions inserted/updated
  ├── Category distribution
  └── Warning nếu thiếu tag hoặc stock = 0 quá nhiều
```

### 9.1. Seed script skeleton

```python
import json
import os
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client

ROOT = Path(__file__).resolve().parents[1]
PRODUCTS_PATH = ROOT / "data" / "products.json"
PROMOTIONS_PATH = ROOT / "data" / "promotions.json"

VALID_CATEGORIES = {"laptop", "monitor", "keyboard", "mouse", "headset"}
VALID_DISCOUNT_TYPES = {"percentage", "fixed", "gift", "bundle"}

def load_json(path: Path) -> list[dict]:
    with path.open("r", encoding="utf-8") as file:
        return json.load(file)

def validate_products(products: list[dict]) -> None:
    seen_ids = set()

    for product in products:
        product_id = product.get("id")

        if not product_id:
            raise ValueError("Product missing id")

        if product_id in seen_ids:
            raise ValueError(f"Duplicate product id: {product_id}")

        seen_ids.add(product_id)

        if product.get("category") not in VALID_CATEGORIES:
            raise ValueError(f"Invalid category for {product_id}")

        if not product.get("name"):
            raise ValueError(f"Missing name for {product_id}")

        if not product.get("brand"):
            raise ValueError(f"Missing brand for {product_id}")

        if product.get("price", 0) <= 0:
            raise ValueError(f"Invalid price for {product_id}")

        if product.get("original_price") and product["original_price"] < product["price"]:
            raise ValueError(f"original_price < price for {product_id}")

        if product.get("stock", 0) < 0:
            raise ValueError(f"Invalid stock for {product_id}")

        if not isinstance(product.get("specs", {}), dict):
            raise ValueError(f"Invalid specs for {product_id}")

        if not isinstance(product.get("tags", []), list) or not product["tags"]:
            raise ValueError(f"Missing tags for {product_id}")

def validate_promotions(promotions: list[dict], product_ids: set[str]) -> None:
    seen_ids = set()

    for promo in promotions:
        promo_id = promo.get("id")

        if not promo_id:
            raise ValueError("Promotion missing id")

        if promo_id in seen_ids:
            raise ValueError(f"Duplicate promotion id: {promo_id}")

        seen_ids.add(promo_id)

        if promo.get("product_id") not in product_ids:
            raise ValueError(f"Promotion references missing product: {promo_id}")

        if promo.get("discount_type") not in VALID_DISCOUNT_TYPES:
            raise ValueError(f"Invalid discount_type for {promo_id}")

        if not promo.get("label"):
            raise ValueError(f"Missing label for {promo_id}")

def main() -> None:
    load_dotenv()

    supabase_url = os.getenv("SUPABASE_URL")
    service_role_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

    if not supabase_url or not service_role_key:
        raise RuntimeError("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")

    supabase = create_client(supabase_url, service_role_key)

    products = load_json(PRODUCTS_PATH)
    promotions = load_json(PROMOTIONS_PATH)

    validate_products(products)
    validate_promotions(promotions, {product["id"] for product in products})

    supabase.table("products").upsert(products).execute()
    supabase.table("promotions").upsert(promotions).execute()

    print(f"Seeded {len(products)} products")
    print(f"Seeded {len(promotions)} promotions")

if __name__ == "__main__":
    main()
```

---

## 10. Backend Query Layer

File liên quan:

```text
backend/app/db/supabase_client.py
backend/app/db/queries.py
```

### 10.1. supabase_client.py

Nhiệm vụ:

- Đọc `SUPABASE_URL`.
- Đọc `SUPABASE_SERVICE_ROLE_KEY`.
- Tạo Supabase client dùng ở backend.
- Không expose service role key ra frontend.
- Không log secret.

### 10.2. queries.py

Các query chính:

```python
async def get_products_by_filter(
    category: str | None = None,
    max_price: int | None = None,
    min_price: int | None = None,
    brand: str | None = None,
    tags: list[str] | None = None,
    limit: int = 5
) -> list[dict]:
    ...
```

```python
async def get_product_by_id(product_id: str) -> dict | None:
    ...
```

```python
async def get_promotions_by_product(product_id: str) -> list[dict]:
    ...
```

```python
async def update_chat_session(session_id: str, messages: list[dict]) -> None:
    ...
```

```python
async def log_analytics_event(
    session_id: str,
    event_type: str,
    event_payload: dict
) -> None:
    ...
```

---

## 11. Agent Tool Data Usage

### 11.1. search_products

Input từ agent:

```json
{
  "query": "laptop gaming 20 triệu",
  "category": "laptop",
  "max_price": 20000000,
  "use_case": "gaming",
  "tags": ["gaming"],
  "limit": 5
}
```

Data operations:

1. Query `products`.
2. Filter theo category, price, brand, tags.
3. Rank theo fit score.
4. Return structured product list cho agent.

Output:

```json
{
  "success": true,
  "data": {
    "products": [],
    "total": 3,
    "filters_applied": {
      "category": "laptop",
      "max_price": 20000000,
      "tags": ["gaming"]
    }
  },
  "message": "Found matching products"
}
```

### 11.2. get_product_detail

Data operations:

1. Query `products` theo `product_id`.
2. Return specs đầy đủ.
3. Nếu thiếu thông tin chi tiết, agent fallback sang Bedrock KB.

### 11.3. compare_products

Data operations:

1. Query 2–3 products theo ids.
2. Extract specs quan trọng.
3. Chuẩn hóa comparison rows.
4. Highlight winner theo criteria.

Comparison fields nên có:

```text
Giá
CPU
RAM
GPU
Storage
Màn hình
Tần số quét
Pin
Trọng lượng
Bảo hành
Stock
Promotion
```

### 11.4. check_stock_and_promotion

Data operations:

1. Query `products.stock`.
2. Query `promotions` active theo ngày hiện tại.
3. Return stock badge status + promotion label.

Stock status mapping:

| Condition | Status | UI |
|---|---|---|
| `stock >= 10` | `in_stock` | Còn hàng |
| `1 <= stock < 10` | `low_stock` | Còn X cái |
| `stock = 0` | `out_of_stock` | Hết hàng |

### 11.5. get_recommendations

Data operations:

1. Parse `user_context`: budget, use case, brand preference, portability, gaming/design/study.
2. Query products phù hợp.
3. Exclude sản phẩm đã xem hoặc đã thêm giỏ.
4. Rank theo fit score.
5. Return top 3.

Scoring gợi ý:

```text
fit_score =
  budget_match * 0.30
+ use_case_match * 0.30
+ spec_match * 0.20
+ stock_availability * 0.10
+ promotion_bonus * 0.10
```

### 11.6. add_to_cart

Data operations:

1. Kiểm tra product tồn tại.
2. Kiểm tra stock > 0.
3. Update cart state theo session.
4. Log analytics event `add_to_cart`.
5. Trigger upsell suggestion dựa trên category.

Upsell examples:

| Product added | Suggested add-on |
|---|---|
| Laptop gaming | Mouse gaming, keyboard, headset |
| Laptop office | Mouse wireless, monitor, laptop bag |
| Monitor | HDMI/USB-C cable, keyboard, mouse |
| Keyboard | Mouse cùng brand |
| Headset | Mouse/keyboard gaming |

---

## 12. Bedrock Knowledge Base Data

### 12.1. Mục tiêu

Supabase xử lý dữ liệu structured như giá, tồn kho, tags, specs chính. Bedrock Knowledge Base xử lý dữ liệu unstructured hoặc semi-structured như:

- Product description dài.
- Warranty policy.
- Return/exchange policy.
- FAQ.
- Buying guide.
- Compatibility notes.
- Explainer về CPU/GPU/RAM/monitor refresh rate.

### 12.2. KB documents gợi ý

```text
docs/kb/product_specs_guide.md
docs/kb/warranty_policy.md
docs/kb/return_policy.md
docs/kb/laptop_buying_guide.md
docs/kb/monitor_buying_guide.md
docs/kb/peripheral_buying_guide.md
docs/kb/faq.md
```

### 12.3. KB sync flow

```text
Generate / update KB markdown docs
        ↓
Upload docs to S3 bucket
        ↓
Configure Bedrock Knowledge Base data source
        ↓
Start ingestion job
        ↓
Agent dùng KB khi câu hỏi không thể trả lời chỉ bằng Supabase
```

### 12.4. Khi nào dùng KB thay vì Supabase?

| User intent | Supabase | Bedrock KB |
|---|---|---|
| “Laptop này giá bao nhiêu?” | Yes | No |
| “Còn hàng không?” | Yes | No |
| “Có khuyến mãi không?” | Yes | No |
| “RTX 4060 chơi game ổn không?” | Maybe | Yes |
| “Bảo hành như thế nào?” | Maybe | Yes |
| “Nên chọn 144Hz hay 4K?” | No | Yes |
| “RAM nâng cấp được không?” | Yes, nếu có field | KB fallback nếu thiếu |

---

## 13. Realtime Data Flow

### 13.1. Stock update

```text
Admin / seed script update products.stock
        ↓
Supabase Realtime emits event
        ↓
frontend/src/hooks/useRealtime.js receives event
        ↓
StockBadge.jsx updates status immediately
        ↓
User thấy: Còn hàng / Còn X cái / Hết hàng
```

### 13.2. Promotion update

```text
Admin update promotions
        ↓
Supabase Realtime event
        ↓
ProductCard.jsx update PromoBadge
        ↓
Agent có thể check lại promotion khi user hỏi
```

### 13.3. Frontend subscription target

Nên subscribe:

```text
products: stock, price, original_price, is_active
promotions: label, discount_value, start_date, end_date, is_active
```

---

## 14. Frontend Data Contract

### 14.1. ProductCard data

```json
{
  "id": "msi-katana-15-001",
  "name": "MSI Katana 15 B13VFK",
  "brand": "MSI",
  "category": "laptop",
  "price": 21990000,
  "original_price": 24990000,
  "image_url": "https://example.com/msi-katana.jpg",
  "stock": 5,
  "stock_status": "low_stock",
  "promotion": {
    "label": "Giảm 10% + tặng chuột gaming",
    "discount_type": "percentage",
    "discount_value": 10
  },
  "tags": ["gaming", "144hz", "rgb"],
  "specs_summary": {
    "cpu": "Intel Core i7-13620H",
    "ram": "16GB DDR5",
    "gpu": "RTX 4060 8GB",
    "screen": "15.6 inch FHD 144Hz"
  }
}
```

### 14.2. Chat response with products

```json
{
  "success": true,
  "data": {
    "message": {
      "id": "msg_001",
      "role": "assistant",
      "content": "Mình tìm được 3 laptop gaming hợp budget 20–25 triệu...",
      "products": [],
      "comparison": null,
      "cart_update": null,
      "timestamp": "2026-07-07T12:00:00Z"
    },
    "session_id": "session_abc123"
  },
  "message": "Chat response generated"
}
```

### 14.3. Comparison response

```json
{
  "products": [
    {
      "id": "asus-rog-001",
      "name": "ASUS ROG Strix G15"
    },
    {
      "id": "msi-katana-15-001",
      "name": "MSI Katana 15"
    }
  ],
  "rows": [
    {
      "label": "Giá",
      "values": ["24,990,000đ", "21,990,000đ"],
      "winner_index": 1
    },
    {
      "label": "GPU",
      "values": ["RTX 4050", "RTX 4060"],
      "winner_index": 1
    }
  ],
  "summary": "MSI Katana phù hợp hơn nếu ưu tiên hiệu năng/giá."
}
```

---

## 15. Analytics Events

### 15.1. Event types

```text
chat_started
message_sent
agent_response
product_shown
product_clicked
compare_requested
stock_checked
promotion_checked
add_to_cart
checkout_started
fallback_triggered
guardrail_blocked
```

### 15.2. Event payload examples

```json
{
  "event_type": "product_shown",
  "event_payload": {
    "product_id": "msi-katana-15-001",
    "position": 1,
    "query": "laptop gaming 20 triệu",
    "session_id": "session_abc123"
  }
}
```

```json
{
  "event_type": "add_to_cart",
  "event_payload": {
    "product_id": "msi-katana-15-001",
    "quantity": 1,
    "price": 21990000,
    "has_promotion": true
  }
}
```

### 15.3. Dashboard metrics

AnalyticsDashboard có thể tính mock metrics:

| Metric | Source event |
|---|---|
| Conversations | `chat_started` |
| Conversion | `add_to_cart / chat_started` |
| Avg session | `message_sent`, `agent_response` timestamps |
| Top query | `message_sent` content |
| Product interest | `product_shown`, `product_clicked` |
| Support offload | `agent_response` không fallback |

---

## 16. Data Quality Checklist

Trước khi demo, kiểm tra:

- [ ] Có đủ 50 sản phẩm.
- [ ] Có đúng distribution theo category.
- [ ] Có ít nhất 10 laptop gaming.
- [ ] Có ít nhất 10 laptop office / ultrabook.
- [ ] Có ít nhất 10 monitor.
- [ ] Có đủ keyboard, mouse, headset.
- [ ] Có đủ brands chính.
- [ ] Mỗi sản phẩm có `id`, `name`, `category`, `brand`, `price`, `stock`, `specs`, `tags`.
- [ ] Mỗi laptop có CPU, RAM, storage, screen, weight.
- [ ] Laptop gaming có GPU và refresh rate.
- [ ] Monitor có resolution, refresh rate, panel type nếu có.
- [ ] Peripheral có connection type, RGB/wireless/mechanical nếu liên quan.
- [ ] Có 10–15 promotions.
- [ ] Promotions reference đúng product_id.
- [ ] Có sản phẩm stock thấp để demo “Sắp hết hàng”.
- [ ] Có sản phẩm hết hàng để demo graceful degradation.
- [ ] Có ít nhất 3 sản phẩm phù hợp demo query “laptop gaming 20–25 triệu”.
- [ ] Có 2 sản phẩm tương đồng để demo comparison.
- [ ] Không có API key trong file data.
- [ ] Không commit `.env` thật.

---

## 17. Demo Data Scenarios

### Scenario 1 — Laptop gaming 20–25 triệu

Cần ít nhất 3 sản phẩm:

```text
MSI Katana 15 — RTX 4060 — 21,990,000đ — stock 5 — promotion 10%
ASUS TUF Gaming A15 — RTX 4060 — 22,990,000đ — stock 8
Acer Nitro V 15 — RTX 4050 — 19,990,000đ — stock 12
```

Demo queries:

```text
Mình cần laptop gaming tầm 20–25 triệu, chơi game nặng được
So sánh ASUS TUF với MSI Katana cho mình
MSI này còn hàng không? Có deal gì không?
Lấy cái MSI này đi
```

### Scenario 2 — Monitor làm việc ban đêm

Cần sản phẩm có tags:

```text
low-blue-light
flicker-free
office
4k
```

Demo query:

```text
Mình hay làm việc ban đêm, cần màn hình không hại mắt
```

### Scenario 3 — Phụ kiện wireless budget

Cần sản phẩm có tags:

```text
wireless
budget
office
```

Demo query:

```text
Có chuột wireless nào dưới 700k dùng văn phòng ổn không?
```

---

## 18. Local Development Flow

### 18.1. Setup backend env

```bash
cp backend/.env.example backend/.env
```

Điền:

```text
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
AWS_REGION=ap-southeast-1
BEDROCK_AGENT_ID=
BEDROCK_AGENT_ALIAS_ID=
BEDROCK_KB_ID=
FRONTEND_URL=http://localhost:5173
```

### 18.2. Install backend dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 18.3. Create Supabase schema

Chạy SQL trong:

```text
infrastructure/supabase_schema.sql
```

### 18.4. Seed data

```bash
python data/seed_products.py
```

Hoặc nếu đang đứng trong root:

```bash
python -m data.seed_products
```

### 18.5. Run backend

```bash
uvicorn app.main:app --reload
```

### 18.6. Run frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 19. Production Data Flow

```text
Phong Vũ product API / Admin update
        ↓
ETL job / webhook receiver
        ↓
Normalize product payload
        ↓
Upsert Supabase products/promotions
        ↓
Trigger realtime update to frontend
        ↓
Sync selected docs/specs to S3
        ↓
Bedrock KB ingestion
        ↓
Agent answers with fresh structured + retrieved data
```

### 19.1. Recommended production improvements

- Dùng scheduled sync job mỗi 5–15 phút cho stock/promotion.
- Dùng webhook cho price/stock critical update nếu Phong Vũ API hỗ trợ.
- Dùng Redis cache cho common product queries.
- Lưu analytics vào database riêng hoặc warehouse nếu traffic lớn.
- Thêm data versioning để trace agent response dùng dataset nào.
- Thêm monitoring cho seed/sync failure.
- Không dùng Supabase service role key ở frontend.

---

## 20. Failure Handling

| Failure | Fallback |
|---|---|
| Supabase query lỗi | Return empty list + log error |
| Product không tồn tại | Agent xin lỗi và suggest search lại |
| Stock = 0 | Suggest alternative cùng category/use case |
| Promotion hết hạn | Không hiển thị promotion |
| KB ingestion chưa xong | Agent trả lời từ structured data hoặc thừa nhận thiếu dữ liệu |
| Bedrock Agent lỗi | Backend return error format chuẩn |
| Realtime subscription lỗi | Frontend fallback polling hoặc refresh khi user hỏi |

---

## 21. Security Notes

- Không commit `.env` thật.
- Không log `SUPABASE_SERVICE_ROLE_KEY`.
- Không expose service role key ra frontend.
- Frontend chỉ dùng `VITE_SUPABASE_ANON_KEY`.
- Backend production không dùng CORS `*`.
- Rate limit `POST /chat`: 20 requests/phút/IP.
- Product data có thể public, nhưng analytics và chat session cần giới hạn quyền đọc.
- Nếu dùng dữ liệu thật của Phong Vũ, cần đảm bảo quyền sử dụng và không scrape trái phép.

---

## 22. Implementation Priority

Nếu thiếu thời gian, ưu tiên theo thứ tự:

### Must ship

```text
products.json
promotions.json
seed_products.py
products table
promotions table
search_products
check_stock_and_promotion
ProductCard
StockBadge
POST /chat end-to-end
```

### Should ship

```text
compare_products
get_product_detail
ComparisonTable
chat_sessions
analytics_events
useRealtime
```

### Nice to have

```text
Bedrock KB ingestion docs
advanced recommendation scoring
admin sync job
analytics dashboard query thật
price alert pipeline
multi-tenant data pipeline
```

---

## 23. Data Pipeline Acceptance Criteria

Pipeline được xem là đạt cho V1 nếu:

1. Chạy `seed_products.py` không lỗi.
2. Supabase có đủ products và promotions.
3. `search_products` trả về sản phẩm đúng budget/category/tags.
4. `check_stock_and_promotion` trả về đúng stock + promotion.
5. Frontend render được ProductCard từ API response.
6. Realtime stock badge update được hoặc có fallback hợp lý.
7. Demo query “laptop gaming 20–25 triệu” trả về kết quả đẹp.
8. Không có secret trong repository.
9. Có dữ liệu đủ để chứng minh agent không hardcode.
10. Có thể giải thích pipeline rõ ràng trong submission/demo.

---

## 24. Suggested File Location

Nên lưu tài liệu này tại:

```text
docs/DATA_PIPELINE.md
```

Nếu repo chưa có thư mục `docs/`, có thể tạo file ở root trước:

```text
DATA_PIPELINE.md
```

Sau khi hoàn thiện project structure, move vào `docs/`.

---

## 25. Tóm tắt một câu

Data Pipeline của ShopAssist AI biến catalog sản phẩm và khuyến mãi thành nguồn dữ liệu structured trong Supabase, kết hợp Knowledge Base cho nội dung chi tiết, để Bedrock Agent có thể search, compare, check stock, recommend và guide checkout bằng dữ liệu thật thay vì trả lời hardcode.
