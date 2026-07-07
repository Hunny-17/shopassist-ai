# ShopAssist AI Demo Script

Target length: 3 minutes  
Primary track: Retail Track  
Secondary qualifier: Built with AWS

## Demo Goal

Show that ShopAssist AI is not a generic chatbot. It is an agentic retail assistant that understands customer intent, selects tools, queries structured product data in Supabase, and responds with useful product cards inside the chat.

## Pre-Demo Checklist

- Backend running: `uvicorn app.main:app --reload`
- Frontend running: `npm run dev`
- Frontend open at `http://localhost:5173`
- Supabase project seeded with `data/products.json` and `data/promotions.json`
- Browser zoom set to 100%
- Backup tab open for Supabase product table if judges ask about data source
- Keep wording clear: this is MVP/demo data in Supabase, not a live Phong Vu API integration

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

> The agent parses intent: category is laptop, use case is gaming, budget is 20 to 25 million VND. Then it selects the product search tool, queries Supabase, ranks matching products, and returns structured product cards.

Point out:

- Inline product cards
- Price and original price
- Stock badge
- Promotion badge if available
- Specs summary like CPU, RAM, GPU, screen

Key line:

> This is the core agentic loop: intent -> tool selection -> Supabase query -> response with product cards.

## 1:10-1:45 Flow 2: Comparison

Type:

```text
So sánh ASUS TUF với MSI Katana cho mình
```

Say:

> In the full Bedrock Agent flow, the agent can select the comparison tool and return a structured comparison table. The frontend is ready to render that table directly inside the chat, highlighting winners by criteria like price or performance.

If the live MVP fallback does not trigger a comparison table, say:

> For this local MVP run, the comparison table renderer is implemented and wired to the backend response shape. In the Bedrock Agent configuration, this user intent maps to `compare_products`.

Show or explain:

- ComparisonTable supports product columns
- Rows for price, CPU, RAM, GPU, storage, screen, refresh rate, battery, weight, warranty, stock

## 1:45-2:15 Flow 3: Stock and Promotion

Type:

```text
MSI Katana còn hàng không? Có deal gì không?
```

Say:

> Product availability and promotions are not hardcoded in the frontend. They are structured data from Supabase. The agent can call `check_stock_and_promotion`, return stock status and active deals, then the UI displays that as badges.

Point out:

- `in_stock`, `low_stock`, `out_of_stock`
- Active promotions with date windows
- Realtime-ready frontend subscription through Supabase anon client

## 2:15-2:40 Flow 4: Add to Cart and Natural Upsell

Click "Thêm" on a product card.

Say:

> The cart drawer opens without leaving the chat. For a production Bedrock Agent session, "Lấy cái MSI này đi" can trigger `add_to_cart`, then the agent can suggest a relevant accessory such as a wireless mouse or gaming headset. The upsell is contextual, not spam.

Show:

- Cart drawer
- Quantity controls
- Subtotal

## 2:40-3:00 Close

Say:

> The AI core is AWS Bedrock Agents. It is not an add-on text generator. It orchestrates tools, product search, stock checks, comparison, recommendations, and cart actions. Supabase provides the live structured retail data for this MVP. Next step is replacing demo data with a real retailer catalog API and running an A/B test on conversion.

Final one-liner:

> ShopAssist AI turns product discovery from search filters into an agentic sales conversation.

## Judge Q&A Notes

### Is this connected to the real Phong Vu API?

Answer:

> Not yet. This MVP uses demo catalog and promotion data seeded into Supabase. The architecture is designed so a real Phong Vu API or internal catalog export can replace the seed data in production.

### Where is AWS used?

Answer:

> AWS Bedrock Agents are the AI orchestration core. Claude Sonnet 3.5 handles language understanding and generation through Bedrock, Bedrock Knowledge Bases are planned for product specs and buying guides, Bedrock Guardrails handle safety, and the FastAPI backend is designed for AWS Lambda through Mangum.

### Why agentic instead of a chatbot?

Answer:

> A chatbot replies to text. This agent chooses actions: search products, fetch details, compare items, check stock and promotions, recommend alternatives, and add to cart. The response is structured data rendered as product cards, not just prose.

### What happens if Bedrock is not configured locally?

Answer:

> The backend has an explicit local fallback so the demo app still runs. The production path is Bedrock Agents with configured agent ID and alias ID.

## Backup Plan

- If Bedrock credentials are missing: use the local fallback and explain the Bedrock wrapper path.
- If Supabase is unavailable: show the seeded JSON data and explain the schema/query layer.
- If frontend network fails: use the built UI and describe expected `/api/v1/chat` response shape.
- If time is short: run only Flow 1 and the cart click, then close with the AWS architecture.
