# ShopAssist AI

ShopAssist AI is a conversational retail sales agent for a Phong Vu-style electronics shopping experience. It helps customers describe what they need in natural language, then follows an agentic flow:

```text
intent -> tool selection -> Supabase query -> structured response -> product cards in chat
```

This is an MVP/demo implementation using synthetic product and promotion data seeded into Supabase. It does not claim a production integration with the real Phong Vu product API yet.

## Tracks

- Primary: Retail Track
- Secondary qualifier: Built with AWS

## Tech Stack

- Frontend: React 19 + Vite 6 + Tailwind v4
- Backend: FastAPI Python 3.11
- AI Core: AWS Bedrock Agents wrapper with structured retail tools
- Database: Supabase PostgreSQL + Realtime-ready client
- Backend deploy: AWS Lambda + API Gateway through Mangum and AWS SAM
- Frontend deploy: Vercel

## Project Structure

```text
backend/app/              FastAPI backend, agent wrapper, tools, DB queries
data/                     MVP product and promotion data + seed script
frontend/                 React chat and product-card UI
docs/                     Demo and submission package
infrastructure/           Supabase schema, AWS Lambda SAM template, Bedrock KB config
supabase_schema.sql       Supabase tables and indexes
env.example               Environment variable template
requirements.txt          Backend Python dependencies
```

## Local Setup

### 1. Backend environment

Create a backend env file from the template:

```bash
cp env.example backend/.env
```

Fill these values:

```text
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

If Bedrock IDs are missing, the backend keeps `/api/v1/chat` usable through a clear fallback. For the AWS path, configure `BEDROCK_AGENT_ID` and `BEDROCK_AGENT_ALIAS_ID`.

### 2. Install backend dependencies

```bash
pip install -r requirements.txt
```

`backend/requirements.txt` is also provided for AWS SAM packaging, while the root `requirements.txt` remains the local setup entrypoint.

### 3. Create Supabase schema

Run the SQL in Supabase:

```text
supabase_schema.sql
```

The same schema is mirrored at:

```text
infrastructure/supabase_schema.sql
```

It creates:

- `products`
- `promotions`
- `chat_sessions`
- `analytics_events`

### 4. Seed Supabase demo data

From the project root:

```bash
python data/seed_products.py
```

The seed script reads:

- `data/products.json`
- `data/promotions.json`

It validates product IDs, categories, prices, stock, tags, promotion references, dates, then upserts into Supabase.

### 5. Run backend

From `backend/`:

```bash
uvicorn app.main:app --reload
```

Useful endpoints:

```text
GET  /health
POST /api/v1/chat
GET  /api/v1/products
GET  /api/v1/products/{product_id}
GET  /api/v1/products/{product_id}/stock
```

### 6. Frontend environment

Create `frontend/.env`:

```text
VITE_API_URL=http://localhost:8000
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Supabase anon values are only needed for realtime UI updates. The chat and product UI can run without auth.

### 7. Install and run frontend

From `frontend/`:

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

## Deployment Status

Frontend production URL: https://frontend-iota-green-31.vercel.app

Backend production API: https://1ldl7jw5ng.execute-api.ap-southeast-1.amazonaws.com

GitHub repository: https://github.com/Hunny-17/shopassist-ai

Backend status: Deployed on AWS Lambda + API Gateway through AWS SAM. The public API is configured as `VITE_API_URL` for the Vercel frontend.

AWS Bedrock Agent status: a real Bedrock Agent resource and production alias are configured for the backend (`SR8SCAOB8N` / `EOFOCXP1FI`). Current account-level Bedrock runtime access still returns `ValidationException: Operation not allowed` for tested model invocation paths, so the live demo uses the explicit graceful fallback: Supabase-backed retail tools return the same structured chat/product-card response shape.

Current frontend theme: light retail workspace with a blue/white Phong Vu-style palette, chat-first shopping flow, and a right-side recommendation panel with a featured product card.

Deployment notes:

```text
docs/DEPLOYMENT.md
```

Current implementation facts for comparing the original planning docs with the deployed product state:

```text
docs/IMPLEMENTATION_FACTS.md
```

## Demo Queries

Try these Retail Track flows:

```text
Mình cần laptop gaming tầm 20-25 triệu, chơi game nặng được
So sánh ASUS TUF với MSI Katana cho mình
MSI này còn hàng không? Có deal gì không?
Có chuột wireless nào dưới 700k dùng văn phòng ổn không?
Mình hay làm việc ban đêm, cần màn hình không hại mắt
```

## Verification

Backend:

```bash
python -c "from app.main import app; print(app.title)"
```

Frontend:

```bash
npm run build
```

Smoke endpoints:

```bash
curl http://localhost:8000/health
curl http://localhost:8000/api/v1/products
```

Production smoke endpoints:

```bash
curl https://1ldl7jw5ng.execute-api.ap-southeast-1.amazonaws.com/health
curl https://1ldl7jw5ng.execute-api.ap-southeast-1.amazonaws.com/api/v1/products
```

## Current MVP Scope

Implemented:

- Product and promotion demo data
- Supabase seed script
- FastAPI backend response envelopes
- Bedrock Agent wrapper with explicit fallback
- Intent-routed fallback for discovery, comparison, stock/promotion, and cart intents
- Six agent tools for product search, details, comparison, stock/promotion, recommendations, cart
- React chat UI with inline product cards
- Product grid, comparison table, stock badges, cart drawer, mock analytics
- Public AWS Lambda/API Gateway backend
- Public Vercel frontend
- Supabase-backed public demo data

Not yet production-integrated:

- Real Phong Vu product API
- Successful live Bedrock model invocation on the current AWS account
- Real checkout/payment flow
- Production Bedrock Knowledge Base ingestion pipeline
- Auth/admin dashboard
