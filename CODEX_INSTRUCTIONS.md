# ShopAssist AI — Codex Instructions
**Brief này dành cho AI code generation (Codex, Cursor, Claude Code)**
**Đọc toàn bộ trước khi generate bất kỳ file nào**

---

## Project Context

ShopAssist AI là conversational sales agent cho Phong Vũ (electronics retailer Việt Nam).
Built for Agentic AI Build Week 2026 — Retail Track + AWS Track.
Solo builder, part-time, deadline July 12 2026 9AM ICT.

**Core concept:** Agent hiểu intent tự nhiên → gọi tools → trả về sản phẩm phù hợp → guide checkout.
**Không phải** chatbot Q&A đơn giản — phải thật sự agentic.

---

## Tech Stack — Không được thay đổi

```
Frontend:   React 19 + Vite 6 + Tailwind v4
Backend:    FastAPI Python 3.11
AI Core:    AWS Bedrock Agents (Claude Sonnet 3.5)
RAG:        AWS Bedrock Knowledge Bases
Safety:     AWS Bedrock Guardrails
Database:   Supabase (PostgreSQL + Realtime)
Deploy FE:  Vercel
Deploy BE:  AWS Lambda (via Mangum)
```

---

## File Generation Order — Chạy theo thứ tự này

### Phase 1 — Data (Chạy đầu tiên)
```
1. data/products.json
2. data/promotions.json
3. data/seed_products.py
```

### Phase 2 — Backend Core
```
4. backend/app/models/product.py
5. backend/app/models/chat.py
6. backend/app/db/supabase_client.py
7. backend/app/db/queries.py
8. backend/app/agent/prompts.py
9. backend/app/agent/tools.py
10. backend/app/agent/bedrock_agent.py
11. backend/app/routers/chat.py
12. backend/app/routers/products.py
13. backend/app/main.py
```

### Phase 3 — Frontend
```
14. frontend/package.json
15. frontend/vite.config.js
16. frontend/src/lib/supabase.js
17. frontend/src/lib/api.js
18. frontend/src/hooks/useChat.js
19. frontend/src/hooks/useCart.js
20. frontend/src/hooks/useRealtime.js
21. frontend/src/components/Chat/ChatWindow.jsx
22. frontend/src/components/Chat/MessageBubble.jsx
23. frontend/src/components/Chat/TypingIndicator.jsx
24. frontend/src/components/Chat/ChatInput.jsx
25. frontend/src/components/Products/ProductCard.jsx
26. frontend/src/components/Products/ProductGrid.jsx
27. frontend/src/components/Products/ComparisonTable.jsx
28. frontend/src/components/Products/StockBadge.jsx
29. frontend/src/components/Cart/CartDrawer.jsx
30. frontend/src/components/Cart/CartItem.jsx
31. frontend/src/components/Analytics/AnalyticsDashboard.jsx
32. frontend/src/App.jsx
33. frontend/src/main.jsx
```

---

## Data Specs — products.json

Generate 50 sản phẩm với distribution:
- Laptop: 20 sản phẩm (10 gaming, 10 office/ultrabook)
- Monitor: 10 sản phẩm
- Keyboard: 8 sản phẩm
- Mouse: 7 sản phẩm
- Headset: 5 sản phẩm

Brands: ASUS, MSI, Dell, HP, Lenovo, Acer, LG, Samsung, Logitech, Razer, SteelSeries

Price range:
- Laptop gaming: 15,000,000 – 45,000,000 VND
- Laptop office: 8,000,000 – 25,000,000 VND
- Monitor: 3,000,000 – 20,000,000 VND
- Peripherals: 300,000 – 3,000,000 VND

Specs format (jsonb):
```json
{
  "cpu": "Intel Core i7-13700H",
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
  "ports": ["USB-A x3", "USB-C", "HDMI 2.1", "SD Card"],
  "thunderbolt": false,
  "wifi": "WiFi 6",
  "bluetooth": "5.2"
}
```

Tags phải có (dùng cho filtering):
- gaming, office, portable, ultrabook, budget, premium
- 4k, 144hz, mechanical, wireless, rgb

---

## Backend Conventions

### FastAPI patterns
```python
# Router structure
from fastapi import APIRouter, HTTPException, Depends
router = APIRouter(prefix="/api/v1", tags=["chat"])

# Response format chuẩn
{
  "success": True,
  "data": {...},
  "message": "string"
}

# Error format
{
  "success": False,
  "error": "error_code",
  "message": "human readable message"
}
```

### Supabase queries
```python
# Luôn dùng async
# Luôn có try/except
# Luôn log errors

async def get_products_by_filter(
    category: str = None,
    max_price: int = None,
    tags: list[str] = None,
    limit: int = 5
) -> list[dict]:
    try:
        query = supabase.table("products").select("*").eq("is_active", True)
        if category:
            query = query.eq("category", category)
        if max_price:
            query = query.lte("price", max_price)
        if tags:
            query = query.overlaps("tags", tags)
        result = query.limit(limit).execute()
        return result.data
    except Exception as e:
        logger.error(f"get_products_by_filter error: {e}")
        return []
```

### Bedrock Agent Tools
```python
# Mỗi tool phải có:
# 1. Type hints đầy đủ
# 2. Docstring mô tả cho Bedrock
# 3. Return dict chuẩn
# 4. Error handling

async def search_products(
    query: str,
    category: str = None,
    max_price: int = None,
    min_price: int = None,
    brand: str = None,
    use_case: str = None,
    tags: list[str] = None,
    limit: int = 5
) -> dict:
    """
    Search products by natural language query and filters.
    Use this when user asks to find, recommend, or browse products.
    
    Args:
        query: Natural language search query
        category: Product category (laptop, monitor, keyboard, mouse, headset)
        max_price: Maximum price in VND
        min_price: Minimum price in VND
        brand: Brand name (ASUS, MSI, Dell, HP, Lenovo, etc.)
        use_case: Use case (gaming, office, design, study, portable)
        tags: List of tags to filter by
        limit: Maximum number of results (default 5)
    
    Returns:
        dict with products list and metadata
    """
    ...
```

### Bedrock Agent setup
```python
import boto3

bedrock_agent = boto3.client(
    "bedrock-agent-runtime",
    region_name=settings.AWS_REGION
)

async def invoke_agent(
    session_id: str,
    message: str
) -> dict:
    response = bedrock_agent.invoke_agent(
        agentId=settings.BEDROCK_AGENT_ID,
        agentAliasId=settings.BEDROCK_AGENT_ALIAS_ID,
        sessionId=session_id,
        inputText=message,
        enableTrace=True
    )
    
    completion = ""
    for event in response["completion"]:
        if "chunk" in event:
            completion += event["chunk"]["bytes"].decode()
    
    return {
        "response": completion,
        "session_id": session_id
    }
```

---

## Frontend Conventions

### Component structure
```jsx
// Mỗi component phải:
// 1. Export default
// 2. PropTypes hoặc JSDoc
// 3. Tailwind classes only — không inline style
// 4. Responsive: mobile-first

export default function ProductCard({ product, onAddToCart }) {
  // ...
}
```

### Color classes (theo UI_DESIGN.md)
```
Primary red:    bg-[#E31E24] text-[#E31E24]
Dark bg:        bg-[#0F0F0F]
Surface:        bg-[#1A1A1A]
Surface 2:      bg-[#242424]
Border:         border-[#2E2E2E]
Text muted:     text-[#888888]
Success:        text-[#22C55E] bg-[#22C55E]
Warning:        text-[#F59E0B] bg-[#F59E0B]
Error:          text-[#EF4444] bg-[#EF4444]
```

### useChat hook interface
```javascript
const {
  messages,        // [{id, role, content, products, timestamp}]
  isLoading,       // boolean
  sessionId,       // string
  sendMessage,     // async (text: string) => void
  clearChat        // () => void
} = useChat()
```

### Message format từ API
```javascript
// Agent message với products
{
  id: "uuid",
  role: "assistant",
  content: "Mình tìm được 3 laptop phù hợp...",
  products: [...],        // Array ProductCard data nếu có
  comparison: {...},      // ComparisonTable data nếu có
  cart_update: {...},     // Cart action nếu có
  timestamp: "ISO string"
}

// User message
{
  id: "uuid", 
  role: "user",
  content: "Laptop gaming 20 triệu",
  timestamp: "ISO string"
}
```

### API calls
```javascript
// lib/api.js
const API_BASE = import.meta.env.VITE_API_URL

export async function sendChatMessage(sessionId, message) {
  const res = await fetch(`${API_BASE}/api/v1/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_id: sessionId, message })
  })
  if (!res.ok) throw new Error("Chat API error")
  return res.json()
}
```

---

## Environment Variables cần có

### Backend (.env)
```
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=ap-southeast-1
BEDROCK_AGENT_ID=
BEDROCK_AGENT_ALIAS_ID=
BEDROCK_KB_ID=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
ENVIRONMENT=development
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:8000
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

---

## Security Rules — Bắt buộc

1. **KHÔNG commit** .env thật lên GitHub
2. **KHÔNG log** API keys, service role keys
3. **KHÔNG expose** Supabase service_role_key ra frontend — chỉ dùng anon key
4. CORS chỉ allow FRONTEND_URL, không allow "*" trong production
5. Rate limit POST /chat: 20 requests/minute per IP

---

## Prioritization nếu hết thời gian

**Must ship (không có → không submit):**
- POST /chat working end-to-end
- search_products tool
- ProductCard component
- Basic chat UI

**Should ship:**
- compare_products tool
- ComparisonTable component
- check_stock_and_promotion tool
- CartDrawer

**Nice to have (cut nếu cần):**
- AnalyticsDashboard
- Proactive trigger
- Voice input
- useRealtime hook
