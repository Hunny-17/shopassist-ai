# ShopAssist AI Demo Script

Target length: 3 minutes  
Primary track: Retail Track  
Secondary qualifier: Built with AWS

## Demo Goal

Show that ShopAssist AI is not a generic chatbot. It is an agentic retail assistant that understands customer intent, selects retail tools, queries structured product data in Supabase, and responds with useful product cards inside the chat.

## Pre-Demo Checklist

- Public frontend open: `https://frontend-iota-green-31.vercel.app`
- Public backend health checked: `https://1ldl7jw5ng.execute-api.ap-southeast-1.amazonaws.com/health`
- Supabase project seeded with `data/products.json` and `data/promotions.json`
- Browser zoom set to 100%
- Backup tab open for Supabase product table if judges ask about data source
- Keep wording clear: this is MVP/demo data in Supabase, not a live Phong Vu API integration
- Keep Bedrock wording honest: the deployed backend is configured with a real Bedrock Agent, but current AWS account runtime access is blocked by model-access/quota restrictions, so the demo may use the graceful Supabase tool fallback

## 0:00-0:25 Opening

Say:

> Online electronics shoppers often know their goal, but not the exact product keyword. A customer may say: "I need a gaming laptop around 20 million, but I also edit videos and carry it to class." Traditional search turns that into filters. ShopAssist AI turns it into a sales conversation.

Show the interface:

- Dark Phong Vu-style chat UI
- Split panel on desktop
- Product area on the right

## 0:25-1:10 Flow 1: Intent to Product Cards

Type:

```text
Mình cần laptop gaming tầm 20-25 triệu, chơi game nặng được
```

Say while the response loads:

> The agentic flow parses intent: category is laptop, use case is gaming, budget is 20 to 25 million VND. Then the backend selects the product search flow, queries Supabase, ranks matching products, and returns structured product cards.

Point out:

- Inline product cards
- Price and original price
- Stock badge
- Promotion badge if available
- Specs summary like CPU, RAM, GPU, screen

Key line:

> This is the core retail loop: intent -> tool selection -> Supabase query -> response with product cards.

## 1:10-1:45 Flow 2: Comparison

Type:

```text
So sánh ASUS TUF với MSI Katana cho mình
```

Say:

> The product comparison path maps this intent to structured product data. The frontend is ready to render a comparison table directly inside the chat, highlighting trade-offs like price, GPU, RAM, storage, screen, and stock.

If the live fallback returns product cards instead of a full comparison table, say:

> In this public MVP run, the response still comes from the same backend response shape. The comparison table renderer is implemented and ready for a Bedrock Agent tool call once account runtime access is fully available.

## 1:45-2:15 Flow 3: Stock and Promotion

Type:

```text
MSI Katana còn hàng không? Có deal gì không?
```

Say:

> Product availability and promotions are not hardcoded in the frontend. They are structured data from Supabase. The tool flow can check stock status and active deals, then the UI displays that as badges.

Point out:

- `in_stock`, `low_stock`, `out_of_stock`
- Active promotions with date windows
- Realtime-ready frontend subscription through Supabase anon client

## 2:15-2:40 Flow 4: Add to Cart

Click "Thêm" on a product card.

Say:

> The cart drawer opens without leaving the chat. For a production Bedrock Agent session, "Lấy cái MSI này đi" can trigger `add_to_cart`, then the agent can suggest a relevant accessory such as a wireless mouse or gaming headset. The upsell is contextual, not spam.

Show:

- Cart drawer
- Quantity controls
- Subtotal

## 2:40-3:00 Close

Say:

> The intended AI core is AWS Bedrock Agents. It is not an add-on text generator: it is the orchestration layer for product search, stock checks, comparison, recommendations, and cart actions. The deployed backend already has a real Bedrock Agent ID and alias configured. Because the current AWS account is blocked by model-access/quota restrictions at runtime, this public demo gracefully falls back to Supabase-backed retail tools while preserving the product-card response shape.

Final one-liner:

> ShopAssist AI turns product discovery from search filters into an agentic sales conversation.

## Judge Q&A Notes

### Is this connected to the real Phong Vu API?

Answer:

> Not yet. This MVP uses demo catalog and promotion data seeded into Supabase. The architecture is designed so a real Phong Vu API or internal catalog export can replace the seed data in production.

### Where is AWS used?

Answer:

> The backend is publicly deployed on AWS Lambda and API Gateway. AWS Bedrock Agents are configured as the AI orchestration core through a real agent ID and alias. Runtime model calls are currently blocked by account-level Bedrock access/quota restrictions, so the app gracefully falls back to Supabase catalog tools for the public demo.

### Why agentic instead of a chatbot?

Answer:

> A chatbot replies to text. This agentic design chooses actions: search products, fetch details, compare items, check stock and promotions, recommend alternatives, and add to cart. The response is structured data rendered as product cards, not just prose.

### What happens if Bedrock runtime is blocked?

Answer:

> The backend has an explicit fallback so the demo app still runs. The deployed production path is configured with Bedrock Agent ID and alias ID, but if AWS returns account-level access or quota errors, the backend falls back to Supabase catalog tools and preserves the same response shape.

## Backup Plan

- If Bedrock runtime returns `Operation not allowed` or quota errors: use the deployed fallback and explain the Bedrock wrapper path
- If Supabase is unavailable: show the seeded JSON data and explain the schema/query layer
- If frontend network fails: use the public backend endpoint and describe expected `/api/v1/chat` response shape
- If time is short: run only Flow 1 and the cart click, then close with the AWS architecture
