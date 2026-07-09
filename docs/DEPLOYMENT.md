# Deployment Notes

This project is ready for public demo and has a deployed AWS backend path.

Production URLs:

```text
Frontend: https://frontend-iota-green-31.vercel.app
Backend:  https://1ldl7jw5ng.execute-api.ap-southeast-1.amazonaws.com
GitHub:   https://github.com/Hunny-17/shopassist-ai
```

Bedrock Agent:

```text
Agent ID: SR8SCAOB8N
Alias ID: EOFOCXP1FI
```

The Lambda environment is configured with this agent and alias. Final CLI runtime tests against Bedrock still returned account-level restrictions, including `ValidationException: Operation not allowed` for `us.anthropic.claude-3-haiku-20240307-v1:0`. If the AWS account hits Bedrock model-access or daily token-quota limits, `/api/v1/chat` falls back to Supabase-backed catalog tools while keeping the same response shape.

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

If Bedrock IDs are empty, `/api/v1/chat` still works through the explicit backend fallback. For a full AWS demo, configure the Bedrock Agent and alias. If Bedrock runtime remains blocked by account access or quota, keep the fallback messaging clear in the demo.

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
curl https://1ldl7jw5ng.execute-api.ap-southeast-1.amazonaws.com/health
curl https://1ldl7jw5ng.execute-api.ap-southeast-1.amazonaws.com/api/v1/products
```

Expected response envelope:

```json
{
  "success": true,
  "data": {},
  "message": "..."
}
```
