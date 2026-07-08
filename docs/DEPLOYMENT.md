# Deployment Notes

This project is ready for local demo and has a deployed AWS backend path.

Production URLs:

```text
Frontend: https://frontend-iota-green-31.vercel.app
Backend:  https://1ldl7jw5ng.execute-api.ap-southeast-1.amazonaws.com
```

## Frontend

The frontend deploy target is Vercel.

Required Vercel environment variables:

```text
VITE_API_URL=https://1ldl7jw5ng.execute-api.ap-southeast-1.amazonaws.com
VITE_SUPABASE_URL=https://YOUR_SUPABASE_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

`VITE_API_URL` must point to the public API Gateway URL. If it is still `http://localhost:8000`, the Vercel deployment can build but cannot call the backend from another machine.

## Backend

The FastAPI backend is Lambda-ready through `Mangum`:

```text
handler = app.main.handler
```

The SAM template is:

```text
infrastructure/aws_lambda_template.yaml
```

Prerequisites for public backend deployment:

```text
AWS SAM CLI installed
AWS credentials configured locally or in CI
Permission to create Lambda, API Gateway, IAM role/policy, and CloudFormation stack
```

Deploy outline:

```bash
cd infrastructure
sam build --template-file aws_lambda_template.yaml
sam deploy --guided
```

Provide these parameters during deploy:

```text
FrontendUrl
SupabaseUrl
SupabaseServiceRoleKey
BedrockAgentId
BedrockAgentAliasId
BedrockKbId
```

If Bedrock IDs are empty, `/api/v1/chat` still works through the explicit backend fallback. For a full AWS demo, configure the Bedrock Agent and alias.

## Supabase

Run the schema in Supabase SQL Editor:

```text
infrastructure/supabase_schema.sql
```

Then seed:

```bash
python data/seed_products.py
```

## Smoke Tests

```bash
curl https://YOUR_BACKEND_API_URL/health
curl https://YOUR_BACKEND_API_URL/api/v1/products
```

Expected response envelope:

```json
{
  "success": true,
  "data": {},
  "message": "..."
}
```
