# ShopAssist AI — Project Structure

## Folder Layout

```
shopassist-ai/
├── frontend/                    # React 19 + Vite 6 + Tailwind v4
│   ├── src/
│   │   ├── components/
│   │   │   ├── Chat/
│   │   │   │   ├── ChatWindow.jsx        # Main chat container
│   │   │   │   ├── MessageBubble.jsx     # User + agent messages
│   │   │   │   ├── TypingIndicator.jsx   # "Agent đang trả lời..."
│   │   │   │   └── ChatInput.jsx         # Input bar + send button
│   │   │   ├── Products/
│   │   │   │   ├── ProductCard.jsx       # Inline card trong chat
│   │   │   │   ├── ProductGrid.jsx       # Grid 3 cards kết quả
│   │   │   │   ├── ComparisonTable.jsx   # So sánh 2-3 sản phẩm
│   │   │   │   └── StockBadge.jsx        # Còn hàng / Sắp hết / Hết
│   │   │   ├── Cart/
│   │   │   │   ├── CartDrawer.jsx        # Slide-in cart panel
│   │   │   │   └── CartItem.jsx          # Item trong cart
│   │   │   └── Analytics/
│   │   │       └── AnalyticsDashboard.jsx # Mock analytics panel
│   │   ├── hooks/
│   │   │   ├── useChat.js                # Chat state + API calls
│   │   │   ├── useCart.js                # Cart state management
│   │   │   └── useRealtime.js            # Supabase realtime subscription
│   │   ├── lib/
│   │   │   ├── supabase.js               # Supabase client
│   │   │   └── api.js                    # FastAPI calls
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/                     # FastAPI + AWS Bedrock
│   ├── app/
│   │   ├── main.py               # FastAPI app entry
│   │   ├── routers/
│   │   │   ├── chat.py           # POST /chat endpoint
│   │   │   └── products.py       # GET /products endpoints
│   │   ├── agent/
│   │   │   ├── bedrock_agent.py  # AWS Bedrock Agent setup
│   │   │   ├── tools.py          # 6 agent tools definition
│   │   │   └── prompts.py        # System prompts
│   │   ├── db/
│   │   │   ├── supabase_client.py
│   │   │   └── queries.py        # DB query functions
│   │   └── models/
│   │       ├── chat.py           # Pydantic models
│   │       └── product.py
│   ├── requirements.txt
│   └── .env.example
│
├── data/                        # Fake/scraped data
│   ├── seed_products.py          # Script seed data vào Supabase
│   ├── products.json             # 50+ sản phẩm Phong Vũ
│   └── promotions.json           # 15+ promotions
│
├── infrastructure/
│   ├── supabase_schema.sql       # SQL tạo tables
│   └── bedrock_kb_config.json    # Knowledge Base config
│
└── docs/
    ├── PROJECT_STRUCTURE.md      # File này
    ├── ARCHITECTURE.md           # Architecture diagram + explanation
    ├── AGENT_FLOW.md             # Agent flow cho AI documentation
    ├── AABW_SUBMISSION.md        # Submission template
    └── DEMO_SCRIPT.md            # Demo script chi tiết
```
