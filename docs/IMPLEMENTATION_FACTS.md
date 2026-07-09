# ShopAssist AI Implementation Facts

This file records factual implementation updates that should be used to compare the original product planning documents with the current deployed product state.

The original planning files are intentionally kept as design references:

- `CODEX_INSTRUCTIONS.md`
- `PROJECT_STRUCTURE.md`
- `ARCHITECTURE.md`
- `AGENT_FLOW.md`
- `DATA_PIPELINE.md`
- `UI_DESIGN.md`

Use this file as the current-state ledger instead of rewriting those original design documents.

## Current Product State

Status as of 2026-07-09:

- Phase 1 Data: completed
- Phase 2 Backend Core: completed
- Phase 3 Frontend: completed
- Integration and smoke test: completed
- Demo and submission package: completed
- Public frontend deployment: completed
- Public backend deployment: completed
- Supabase schema and seed data: completed
- Bedrock Agent resource setup: completed
- Live Bedrock model invocation on the current AWS account: blocked by AWS account-level runtime restriction
- Production UI theme: light retail workspace, blue/white Phong Vu-style palette
- Agent fallback behavior: intent-routed Supabase tool flow for search, comparison, stock/promotion, and cart intents

## Public URLs

```text
Frontend:
https://frontend-iota-green-31.vercel.app

Backend API:
https://1ldl7jw5ng.execute-api.ap-southeast-1.amazonaws.com

GitHub:
https://github.com/Hunny-17/shopassist-ai
```

## Verified Runtime Behavior

Public backend smoke endpoints:

```text
GET /health
GET /api/v1/products
POST /api/v1/chat
```

Observed behavior:

- `/health` responds successfully from AWS API Gateway.
- `/api/v1/products` returns Supabase-backed product data.
- `/api/v1/chat` returns the standard response envelope and structured product-card data.
- `/api/v1/chat` includes explicit fallback handling for search, comparison, stock/promotion, and cart-style requests when Bedrock runtime is unavailable.
- The Vercel frontend calls the public AWS API Gateway backend through `VITE_API_URL`.
- CORS is configured for the deployed frontend.

Standard response shape remains:

```json
{
  "success": true,
  "data": {},
  "message": "..."
}
```

```json
{
  "success": false,
  "error": "...",
  "message": "..."
}
```

## AWS Deployment Facts

Backend deployment:

- AWS Lambda
- AWS API Gateway
- AWS SAM
- FastAPI through Mangum
- Region: `ap-southeast-1`

Bedrock Agent:

```text
Agent ID: SR8SCAOB8N
Alias ID: EOFOCXP1FI
```

The deployed Lambda environment is configured with the Bedrock Agent ID and alias ID.

## Bedrock Runtime Limitation

The project contains a Bedrock Agent wrapper and the deployed backend is configured with real Bedrock Agent values.

However, direct AWS CLI runtime tests still returned account-level model access restrictions.

Tested model/profile:

```text
us.anthropic.claude-3-haiku-20240307-v1:0
```

Observed error:

```text
ValidationException: Operation not allowed
```

Earlier testing also showed account quota/model-access limitations in Bedrock console and runtime paths.

Current conclusion:

- The code path is implemented.
- The AWS Bedrock Agent resource exists.
- Runtime model invocation is currently blocked by AWS account-level access/quota restrictions.
- The live public demo therefore uses the explicit graceful fallback to Supabase-backed retail tools.

## Demo Data Facts

The MVP uses demo catalog data seeded into Supabase:

- `data/products.json`
- `data/promotions.json`
- `data/seed_products.py`

This is not a live integration with the real Phong Vu product API.

Correct demo wording:

> The MVP uses Supabase demo catalog data. The architecture can replace this with a real retailer catalog API or internal export later.

Avoid saying:

> This is connected to the real Phong Vu API.

## Architecture Comparison Notes

Original architecture target:

```text
Frontend -> Backend -> Bedrock Agent -> Tools -> Supabase -> Structured UI response
```

Current deployed behavior:

```text
Frontend -> AWS API Gateway -> AWS Lambda FastAPI backend
  -> Bedrock Agent wrapper
  -> intent router / graceful fallback when Bedrock runtime is restricted
  -> Supabase-backed retail tools
  -> Structured UI response with product cards
```

Runtime exception path:

```text
If Bedrock runtime returns access/quota errors:
  backend logs the error
  fallback tools query Supabase
  frontend still receives structured product-card response
```

This preserves the product experience while staying honest about the Bedrock account limitation.

## Submission Wording

Recommended wording:

> ShopAssist AI is deployed publicly with a React/Vercel frontend and an AWS Lambda/API Gateway backend. The backend is configured with a real AWS Bedrock Agent and alias. Because this AWS account currently returns Bedrock runtime access/quota errors, the demo gracefully falls back to Supabase-backed retail tools while preserving the intended agentic response shape: intent -> tool selection -> Supabase query -> product cards.

Do not claim:

- Bedrock model invocation is fully working live on the current account.
- The app is integrated with the real Phong Vu API.
- Checkout/payment is production-ready.

## Files That Should Remain Historical Design References

Do not rewrite these just to match the current deployed state:

- `ARCHITECTURE.md`
- `AGENT_FLOW.md`
- `PROJECT_STRUCTURE.md`
- `DATA_PIPELINE.md`
- `UI_DESIGN.md`

If judges or reviewers need the current factual state, point them to:

- `README.md`
- `docs/DEPLOYMENT.md`
- `docs/AABW_SUBMISSION.md`
- `docs/DEMO_SCRIPT.md`
- `docs/IMPLEMENTATION_FACTS.md`
