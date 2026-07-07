# ShopAssist AI — Architecture

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        USER LAYER                           │
│                                                             │
│   Phong Vũ Customer (Web / Mobile)                         │
│   → Chat widget embedded trên phongvu.vn                   │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTPS
┌──────────────────────────▼──────────────────────────────────┐
│                      FRONTEND LAYER                         │
│                                                             │
│   React 19 + Vite 6 + Tailwind v4                          │
│   Deploy: Vercel                                            │
│                                                             │
│   Components:                                               │
│   ┌──────────┐  ┌──────────────┐  ┌─────────────────────┐  │
│   │ ChatUI   │  │ ProductCards │  │ AnalyticsDashboard  │  │
│   └──────────┘  └──────────────┘  └─────────────────────┘  │
│                                                             │
│   Realtime: Supabase subscription → stock/price live update │
└──────────────────────────┬──────────────────────────────────┘
                           │ REST API
┌──────────────────────────▼──────────────────────────────────┐
│                      BACKEND LAYER                          │
│                                                             │
│   FastAPI (Python 3.11)                                     │
│   Deploy: AWS Lambda + API Gateway                          │
│                                                             │
│   Endpoints:                                                │
│   POST /chat      → invoke Bedrock Agent                    │
│   GET  /products  → query Supabase                          │
│   POST /cart      → update cart state                       │
└──────────────────────────┬──────────────────────────────────┘
                           │ AWS SDK
┌──────────────────────────▼──────────────────────────────────┐
│                       AWS LAYER                             │
│                    (AWS Track Qualifier)                     │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              AWS Bedrock Agents                      │   │
│  │                                                      │   │
│  │  Model: Claude Sonnet 3.5 via Bedrock               │   │
│  │  System prompt: Vietnamese retail sales agent        │   │
│  │                                                      │   │
│  │  Tools (Action Groups):                              │   │
│  │  ├── search_products(query, filters)                 │   │
│  │  ├── get_product_detail(product_id)                  │   │
│  │  ├── compare_products(id1, id2, criteria)            │   │
│  │  ├── check_stock_and_promotion(product_id)           │   │
│  │  ├── get_recommendations(user_context)               │   │
│  │  └── add_to_cart(product_id, quantity)               │   │
│  └──────────────────────┬──────────────────────────────┘   │
│                         │                                   │
│  ┌──────────────────────▼──────────────────────────────┐   │
│  │         Bedrock Knowledge Bases                      │   │
│  │  → Product specs, warranty policies, FAQs            │   │
│  │  → Vector search trên product catalog                │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  AWS Lambda  │  │    AWS S3    │  │ Bedrock Guardrails│  │
│  │  (Backend)   │  │   (Images)   │  │  (Safety layer)  │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                      DATA LAYER                             │
│                                                             │
│   Supabase (PostgreSQL + Realtime)                         │
│                                                             │
│   Tables:                                                   │
│   ├── products (50+ sản phẩm Phong Vũ thật)                │
│   ├── promotions (active deals)                             │
│   ├── chat_sessions (conversation history)                  │
│   └── analytics_events (mock conversion tracking)          │
└─────────────────────────────────────────────────────────────┘
```

## Request Flow — Chi tiết

### Flow 1: User search sản phẩm

```
User: "Laptop gaming tầm 20 triệu hay chơi Valorant"
  ↓
ChatInput.jsx → POST /chat {message, session_id}
  ↓
FastAPI chat.py → invoke Bedrock Agent
  ↓
Bedrock Agent phân tích intent:
  - budget: 20,000,000 VND
  - use_case: gaming
  - game: Valorant (không cần GPU quá mạnh)
  - form_factor: không mention → hỏi thêm hoặc assume laptop
  ↓
Agent gọi tool: search_products(
  category="laptop",
  max_price=20000000,
  use_case="gaming",
  tags=["gaming"]
)
  ↓
queries.py → Supabase query với filters
  ↓
Trả về 3-5 sản phẩm phù hợp
  ↓
Agent format response + reasoning
  ↓
FastAPI trả về {message, products[], session_id}
  ↓
ChatWindow.jsx render MessageBubble + ProductGrid
```

### Flow 2: Realtime stock update

```
Supabase stock thay đổi (admin update)
  ↓
useRealtime.js subscription nhận event
  ↓
StockBadge.jsx update ngay không cần reload
  ↓
Nếu stock < 5 → hiện "Sắp hết hàng!" badge
```

### Flow 3: Add to cart

```
User: "Lấy cái MSI Katana này"
  ↓
Agent gọi tool: add_to_cart(product_id="msi-katana-001", quantity=1)
  ↓
Cart state update trong useCart.js
  ↓
CartDrawer.jsx slide in → show item
  ↓
Agent suggest: "Thêm chuột gaming Logitech G304 không?
  Đang có combo giảm thêm 5%"
```

## AWS Services Map

| Service | Role | Tại sao chọn |
|---|---|---|
| Bedrock Agents | AI core — orchestrate tools | Native agentic, không tự build |
| Claude Sonnet 3.5 | LLM model | Best balance cost/quality |
| Bedrock Knowledge Bases | RAG product specs | Không hallucinate specs |
| Bedrock Guardrails | Safety — block off-topic | Production-ready signal |
| AWS Lambda | Backend serverless | Scale tự động, cost thấp |
| S3 | Product images + KB docs | Reliable, cheap |

## Tech Stack Summary

```
Frontend:  React 19 + Vite 6 + Tailwind v4 → Vercel
Backend:   FastAPI Python 3.11 → AWS Lambda
AI Core:   AWS Bedrock Agents (Claude Sonnet 3.5)
RAG:       Bedrock Knowledge Bases
Database:  Supabase PostgreSQL + Realtime
Storage:   AWS S3
Safety:    Bedrock Guardrails
Data:      Bright Data scrape từ phongvu.vn
```
