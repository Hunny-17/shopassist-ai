# ShopAssist AI AABW Submission

## Project Name

ShopAssist AI

## Tracks

- Primary track: Retail Track
- Secondary qualifier: Built with AWS

## One-Line Summary

An agentic retail sales assistant that helps electronics shoppers find, compare, and choose products through a natural chat experience with inline product cards.

## Problem

Electronics retail discovery is hard because customers rarely know the exact product SKU or filter combination they need. They describe goals instead:

- "Laptop gaming around 20 million"
- "Monitor for working at night"
- "Wireless mouse under 700k"
- "Which one is better for video editing?"

Traditional ecommerce search converts these needs into keyword matching and filters. That creates drop-off, especially for customers who need help understanding specs, stock, promotions, and trade-offs.

## Solution

ShopAssist AI puts an agentic sales assistant into the shopping experience. The user chats naturally, and the agent follows a tool-driven retail flow:

```text
intent -> tool selection -> Supabase query -> ranked products -> response with product cards
```

The UI renders structured results inside the chat:

- Product cards
- Featured recommendation card
- Stock badges
- Promotion badges
- Comparison tables
- Cart drawer
- Light retail workspace layout with right-side recommendations

For the MVP, product and promotion data is demo data seeded into Supabase. The project does not claim a live integration with the real Phong Vu API. In production, the same schema can be fed by a real product catalog API, internal export, or scheduled sync.

## Why It Is Agentic

ShopAssist AI is designed around AWS Bedrock Agents as the intended AI core, not as an add-on text completion layer.

Agentic behaviors:

1. Intent understanding
   - Parses natural language needs such as budget, category, use case, brand, portability, and stock/promotion questions.

2. Tool selection
   - Selects from retail tools such as `search_products`, `get_product_detail`, `compare_products`, `check_stock_and_promotion`, `get_recommendations`, and `add_to_cart`.

3. Structured data retrieval
   - Queries Supabase for live structured product data instead of relying on hardcoded frontend content.

4. Multi-step response generation
   - Converts tool results into natural-language guidance plus structured UI data.

5. Contextual commerce actions
   - Supports comparison, stock checks, cart updates, and relevant accessory suggestions.

## Agent Flow

Example query:

```text
Mình cần laptop gaming tầm 20-25 triệu, chơi game nặng được
```

Agent flow:

```text
1. Intent parse
   category = laptop
   use_case = gaming
   budget = 20-25 million VND

2. Tool selection
   search_products

3. Data operation
   Supabase products query by category, price, tags

4. Ranking
   Match by budget, tags, use case, stock, promotion

5. Response
   Vietnamese assistant reply + product cards
```

Frontend result:

- Chat message
- Inline ProductGrid
- ProductCard with price, stock, promotion, specs summary

## AWS Services

### AWS Lambda and API Gateway

The FastAPI backend is publicly deployed on AWS Lambda behind API Gateway using Mangum and AWS SAM.

Production backend API:

```text
https://1ldl7jw5ng.execute-api.ap-southeast-1.amazonaws.com
```

### AWS Bedrock Agents

Core AI orchestration target. The backend is configured with a real Bedrock Agent resource and production alias:

```text
Agent ID: SR8SCAOB8N
Alias ID: EOFOCXP1FI
```

Bedrock Agents are responsible for selecting and coordinating tools for product search, detail lookup, comparison, stock/promotion checks, recommendations, and cart actions.

Current runtime note: final CLI tests against Bedrock model invocation still returned account-level restrictions, including `ValidationException: Operation not allowed` for `us.anthropic.claude-3-haiku-20240307-v1:0`. The deployed app therefore uses the explicit graceful fallback to Supabase-backed catalog tools while keeping the same structured product-card response shape.

The fallback is not a static canned response. It routes common retail intents such as discovery, comparison, stock/promotion checks, and cart actions to Supabase-backed tool functions so the public demo remains usable while Bedrock account access is pending.

### Claude via Amazon Bedrock

Target language understanding and response generation model family for the agent. The code is ready to call Bedrock through the Bedrock Agent wrapper once account runtime access is available.

### AWS Bedrock Knowledge Bases

Planned retrieval layer for product specs guides, warranty policy, return policy, buying guides, compatibility notes, and FAQs. Structured data stays in Supabase; longer explanatory content belongs in Knowledge Bases.

### AWS Bedrock Guardrails

Planned safety layer for off-topic blocking and controlled retail assistant behavior.

### Amazon S3

Planned storage for knowledge-base documents and product media assets.

## Architecture

```text
Customer
  -> React 19 + Vite 6 + Tailwind v4 frontend
  -> AWS API Gateway
  -> AWS Lambda FastAPI backend
  -> Bedrock Agent wrapper
       -> retail action tools
       -> Supabase product and promotion data
       -> graceful fallback when Bedrock runtime is restricted
  -> structured response
  -> chat message + product cards + cart UI
```

Data layer:

- `products`
- `promotions`
- `chat_sessions`
- `analytics_events`

The MVP data starts from:

- `data/products.json`
- `data/promotions.json`
- `data/seed_products.py`

## Demo Flow

### Flow 1: Product Discovery

User:

```text
Mình cần laptop gaming tầm 20-25 triệu, chơi game nặng được
```

Expected:

- Agentic flow identifies category, budget, and use case
- Backend uses the product search flow
- Supabase returns matching products
- UI renders laptop product cards

### Flow 2: Comparison

User:

```text
So sánh ASUS TUF với MSI Katana cho mình
```

Expected:

- Agentic flow maps intent to comparison
- UI supports ComparisonTable with spec rows and winner highlight

### Flow 3: Stock and Promotion

User:

```text
MSI Katana còn hàng không? Có deal gì không?
```

Expected:

- Backend checks stock and promotion data
- UI shows stock status and promotion badge

### Flow 4: Cart Action

User or click:

```text
Lấy cái MSI này đi
```

Expected:

- Product added to cart
- Cart drawer opens
- Agent can suggest relevant accessory categories

## Metrics to Evaluate

MVP/demo metrics:

- Product discovery completion: user reaches relevant product cards from natural language
- Support deflection: stock, promotion, and spec questions handled without human agent
- Cart intent: product added to cart from chat
- Response structure: product cards and comparison table render from backend response shape
- Public demo availability: Vercel frontend can call AWS API Gateway backend
- Time to recommendation: target under a few seconds after user query

Production metrics to test after real catalog integration:

- Conversion rate lift
- Product page click-through rate
- Add-to-cart rate
- Support ticket reduction
- Average time to product discovery
- Fallback/guardrail rate

## Current MVP Scope

Completed:

- Synthetic but realistic electronics product catalog
- Promotion data
- Supabase seed script
- FastAPI backend
- Bedrock Agent wrapper with intent-routed explicit fallback
- Six retail tool functions
- React chat UI with light retail workspace theme
- Product cards, featured recommendation card, stock badges, comparison table, cart drawer
- Integration smoke test for API response shapes and CORS
- Public AWS Lambda/API Gateway backend deployment
- Vercel frontend configured with `VITE_API_URL`
- Supabase reset schema mirrored under `infrastructure/`
- Real Bedrock Agent resource and alias configured in the Lambda environment
- Graceful fallback for current AWS Bedrock runtime access/quota restriction

Not included yet:

- Real Phong Vu API integration
- Fully successful live Bedrock model invocation on the current AWS account
- Production checkout
- Auth
- Admin catalog management
- Live Bedrock Knowledge Base ingestion job
- Production analytics dashboard

## Differentiation

ShopAssist AI makes the AI central to the commerce workflow. The agentic layer is responsible for reasoning, choosing tools, retrieving product data, and producing structured UI outputs. The result is not just a chat answer; it is a guided retail workflow that can move a customer from vague intent to product choice and cart action.

## Submission Links

Live demo URL: https://frontend-iota-green-31.vercel.app

Backend API: https://1ldl7jw5ng.execute-api.ap-southeast-1.amazonaws.com

GitHub repository: https://github.com/Hunny-17/shopassist-ai

Demo video: Pending 3-minute screen recording
