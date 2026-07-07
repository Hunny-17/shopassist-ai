# ShopAssist AI — Agent Flow Documentation
*(AI Documentation cho AABW Submission)*

## Agent Overview

ShopAssist AI sử dụng **AWS Bedrock Agents** với model Claude Sonnet 3.5 làm orchestrator.
Agent hoạt động theo vòng lặp **Reasoning → Tool Selection → Execution → Response**.

---

## Agent Configuration

```
Model:          claude-3-5-sonnet (via Amazon Bedrock)
Agent Type:     ReAct (Reasoning + Acting)
Memory:         Session-based conversation history
Language:       Vietnamese-first, bilingual support
Guardrails:     Bedrock Guardrails (off-topic blocking)
Knowledge Base: Bedrock KB (product specs + FAQs)
```

---

## System Prompt

```
Bạn là ShopAssist AI — trợ lý bán hàng thông minh của Phong Vũ.

Nhiệm vụ:
- Hiểu nhu cầu thật sự của khách hàng, không chỉ keyword
- Recommend sản phẩm phù hợp với budget, use case, lifestyle
- Trả lời câu hỏi về specs, warranty, stock, giá
- So sánh sản phẩm một cách khách quan
- Hướng dẫn checkout tự nhiên, không spam

Nguyên tắc:
- Chỉ answer từ data thật, không hallucinate specs
- Nếu không biết → dùng Knowledge Base hoặc thừa nhận
- Upsell tự nhiên, đúng lúc, không ép buộc
- Tiếng Việt tự nhiên, thân thiện nhưng chuyên nghiệp

Tools available: search_products, get_product_detail, 
compare_products, check_stock_and_promotion, 
get_recommendations, add_to_cart
```

---

## 6 Agent Tools

### Tool 1: search_products
```python
def search_products(
    query: str,              # Natural language query
    category: str = None,   # laptop, monitor, keyboard, mouse...
    max_price: int = None,   # VND
    min_price: int = None,
    brand: str = None,       # ASUS, MSI, Dell...
    use_case: str = None,    # gaming, work, design, study
    limit: int = 5
) -> list[Product]
```
**Khi nào agent gọi:** User hỏi tìm sản phẩm, recommend, "có cái gì..."

### Tool 2: get_product_detail
```python
def get_product_detail(
    product_id: str
) -> ProductDetail  # specs đầy đủ + warranty + compatibility
```
**Khi nào agent gọi:** User hỏi specs cụ thể, "cái này như thế nào"

### Tool 3: compare_products
```python
def compare_products(
    product_ids: list[str],  # 2-3 sản phẩm
    criteria: list[str] = None  # ["price", "performance", "weight"]
) -> ComparisonResult
```
**Khi nào agent gọi:** User muốn so sánh, "cái nào tốt hơn"

### Tool 4: check_stock_and_promotion
```python
def check_stock_and_promotion(
    product_id: str
) -> StockPromoInfo  # stock count + active promotions + expiry
```
**Khi nào agent gọi:** User hỏi còn hàng không, có deal không

### Tool 5: get_recommendations
```python
def get_recommendations(
    user_context: dict,  # {budget, use_case, preferences}
    exclude_ids: list[str] = None,
    limit: int = 3
) -> list[Product]
```
**Khi nào agent gọi:** Sau khi hiểu user context, proactive suggest

### Tool 6: add_to_cart
```python
def add_to_cart(
    product_id: str,
    quantity: int = 1,
    session_id: str
) -> CartResult  # cart state + upsell suggestions
```
**Khi nào agent gọi:** User quyết định mua, "lấy cái này"

---

## Agent Decision Flow

```
User Input
    │
    ▼
┌─────────────────────────────────┐
│     Intent Classification       │
│                                 │
│  SEARCH    → search_products    │
│  DETAIL    → get_product_detail │
│  COMPARE   → compare_products   │
│  STOCK     → check_stock_promo  │
│  BUY       → add_to_cart        │
│  GENERAL   → Knowledge Base RAG │
│  OFF-TOPIC → Guardrails block   │
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│     Multi-step Reasoning        │
│                                 │
│  Example: "laptop gaming 20tr"  │
│  Step 1: parse budget = 20M     │
│  Step 2: parse use_case=gaming  │
│  Step 3: call search_products   │
│  Step 4: rank by fit score      │
│  Step 5: format response        │
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│        Tool Execution           │
│  → Supabase query               │
│  → Knowledge Base lookup        │
│  → Cart state update            │
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│      Response Generation        │
│  → Natural language summary     │
│  → Structured product data      │
│  → Follow-up suggestions        │
└─────────────────────────────────┘
```

---

## Agentic Behaviors (AABW Requirement)

Theo AABW: *"Agentic AI is central — not a decorative feature"*

ShopAssist AI thể hiện agentic behavior qua:

**1. Multi-step reasoning**
> User: "Mình hay làm việc ban đêm, cần màn hình không hại mắt"
> Agent: parse context (night use) → prioritize low blue light + flicker-free → search với filters đó → explain lý do recommend

**2. Tool chaining**
> search_products → get_product_detail → check_stock_and_promotion → add_to_cart
> Trong một conversation flow, không cần user hỏi từng bước

**3. Context retention**
> Turn 1: "Budget mình 15 triệu"
> Turn 3: "Cái nào nhẹ hơn?"
> Agent nhớ budget từ Turn 1, không hỏi lại

**4. Proactive suggestions**
> Sau add_to_cart laptop → agent tự suggest "Bạn có cần chuột gaming không? Đang có combo giảm thêm 8%"

**5. Graceful degradation**
> Nếu hết hàng → agent suggest alternatives thay vì dừng lại

---

## 4 AI Technologies (Track Requirement)

| Technology | Implementation | Evidence |
|---|---|---|
| **Generative AI** | Claude Sonnet 3.5 via Bedrock | Natural language understanding + generation |
| **Recommendation Systems** | get_recommendations() với scoring | Rank sản phẩm theo multi-factor fit score |
| **Search & Knowledge Retrieval** | Bedrock Knowledge Bases + Supabase full-text | RAG trên product specs, không hallucinate |
| **Conversational AI** | Multi-turn memory, session history | Context retention across turns |
