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
- AI Core: AWS Bedrock Agents with Claude Sonnet 3.5
- RAG/Safety: Bedrock Knowledge Bases and Bedrock Guardrails
- Database: Supabase PostgreSQL + Realtime
- Backend deploy target: AWS Lambda via Mangum
- Frontend deploy target: Vercel

## Project Structure

```text
backend/app/              FastAPI backend, agent wrapper, tools, DB queries
data/                     MVP product and promotion data + seed script
frontend/                 React chat and product-card UI
docs/                     Demo and submission package
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

If Bedrock IDs are missing, the backend keeps `/api/v1/chat` usable through a clear local fallback. For the full AWS demo, configure `BEDROCK_AGENT_ID` and `BEDROCK_AGENT_ALIAS_ID`.

### 2. Install backend dependencies

```bash
pip install -r requirements.txt
```

### 3. Create Supabase schema

Run the SQL in Supabase:

```text
supabase_schema.sql
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

Frontend production URL: https://frontend-irrffcr4t-hunny-17s-projects.vercel.app

Backend status: Local/demo backend for now. Public AWS Lambda deployment needs AWS credentials, Bedrock Agent IDs, and Supabase environment variables.

## Demo Queries

Try these Retail Track flows:

```text
MÃ¬nh cáº§n laptop gaming táº§m 20-25 triá»‡u, chÆ¡i game náº·ng Ä‘Æ°á»£c
So sÃ¡nh ASUS TUF vá»›i MSI Katana cho mÃ¬nh
MSI nÃ y cÃ²n hÃ ng khÃ´ng? CÃ³ deal gÃ¬ khÃ´ng?
CÃ³ chuá»™t wireless nÃ o dÆ°á»›i 700k dÃ¹ng vÄƒn phÃ²ng á»•n khÃ´ng?
MÃ¬nh hay lÃ m viá»‡c ban Ä‘Ãªm, cáº§n mÃ n hÃ¬nh khÃ´ng háº¡i máº¯t
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

## Current MVP Scope

Implemented:

- Product and promotion demo data
- Supabase seed script
- FastAPI backend response envelopes
- Bedrock Agent wrapper with explicit fallback
- Six agent tools for product search, details, comparison, stock/promotion, recommendations, cart
- React chat UI with inline product cards
- Product grid, comparison table, stock badges, cart drawer, mock analytics

Not yet production-integrated:

- Real Phong Vu product API
- Real checkout/payment flow
- Production Bedrock Knowledge Base ingestion pipeline
- Auth/admin dashboard

