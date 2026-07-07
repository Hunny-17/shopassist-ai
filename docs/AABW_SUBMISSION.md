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
- Stock badges
- Promotion badges
- Comparison tables
- Cart drawer
- Mock analytics panel

For the MVP, product and promotion data is demo data seeded into Supabase. The project does not claim a live integration with the real Phong Vu API. In production, the same schema can be fed by a real product catalog API, internal export, or scheduled sync.

## Why It Is Agentic

ShopAssist AI is designed around AWS Bedrock Agents as the AI core, not as an add-on text completion layer.

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
MÃ¬nh cáº§n laptop gaming táº§m 20-25 triá»‡u, chÆ¡i game náº·ng Ä‘Æ°á»£c
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

### AWS Bedrock Agents

Core AI orchestration layer. Bedrock Agents select and coordinate tools for product search, detail lookup, comparison, stock/promotion checks, recommendations, and cart actions.

### Claude Sonnet 3.5 via Amazon Bedrock

Language understanding and response generation model used by the agent.

### AWS Bedrock Knowledge Bases

Planned retrieval layer for product specs guides, warranty policy, return policy, buying guides, compatibility notes, and FAQs. Structured data stays in Supabase; longer explanatory content belongs in Knowledge Bases.

### AWS Bedrock Guardrails

Safety layer for off-topic blocking and controlled retail assistant behavior.

### AWS Lambda

Backend deployment target. The FastAPI app is Lambda-ready through Mangum, and the repository includes an AWS SAM template for API Gateway + Lambda deployment at `infrastructure/aws_lambda_template.yaml`.

### Amazon S3

Planned storage for knowledge-base documents and product media assets.

## Architecture

```text
Customer
  -> React 19 + Vite 6 + Tailwind v4 frontend
  -> FastAPI backend
  -> AWS Bedrock Agent
       -> retail action tools
       -> Supabase product and promotion data
       -> Bedrock Knowledge Bases for unstructured support content
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
MÃ¬nh cáº§n laptop gaming táº§m 20-25 triá»‡u, chÆ¡i game náº·ng Ä‘Æ°á»£c
```

Expected:

- Agent identifies category, budget, and use case
- Calls product search flow
- Returns matching laptop product cards

### Flow 2: Comparison

User:

```text
So sÃ¡nh ASUS TUF vá»›i MSI Katana cho mÃ¬nh
```

Expected:

- Agent maps intent to comparison
- UI supports ComparisonTable with spec rows and winner highlight

### Flow 3: Stock and Promotion

User:

```text
MSI Katana cÃ²n hÃ ng khÃ´ng? CÃ³ deal gÃ¬ khÃ´ng?
```

Expected:

- Agent checks stock and promotion data
- UI shows stock status and promotion badge

### Flow 4: Cart Action

User or click:

```text
Láº¥y cÃ¡i MSI nÃ y Ä‘i
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
- Bedrock Agent wrapper with explicit local fallback
- Six retail tool functions
- React chat UI
- Product cards, stock badges, comparison table, cart drawer
- Integration smoke test for API response shapes and CORS
- AWS Lambda deploy-ready template through SAM
- Supabase reset schema mirrored under `infrastructure/`

Not included yet:

- Real Phong Vu API integration
- Production checkout
- Auth
- Admin catalog management
- Live Bedrock Knowledge Base ingestion job
- Public AWS Lambda deployment URL
- Production analytics dashboard

## Differentiation

ShopAssist AI makes the AI central to the commerce workflow. The agent is responsible for reasoning, choosing tools, retrieving product data, and producing structured UI outputs. The result is not just a chat answer; it is a guided retail workflow that can move a customer from vague intent to product choice and cart action.

## Submission Links

Live demo URL: https://frontend-irrffcr4t-hunny-17s-projects.vercel.app

GitHub repository: https://github.com/Hunny-17/shopassist-ai

Demo video: Pending 3-minute screen recording

