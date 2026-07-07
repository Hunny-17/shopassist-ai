# ShopAssist AI — Project Plan
**Agentic AI Build Week 2026 | Retail Track (Phong Vũ) + Built with AWS Track**

---

## 1. Overview

| | |
|---|---|
| **Project name** | ShopAssist AI |
| **Track** | Retail Track (PhongVu.vn sponsor) + AWS Track qualifier |
| **Builder** | Solo |
| **Timeline** | July 7–11, 2026 (4–5 ngày, part-time ~4–6h/ngày) |
| **Core problem** | Low conversion rate trên website/app Phong Vũ do thiếu real-time interaction và timely assistance cho online shoppers |

---

## 2. Problem Analysis

### Pain points (theo track requirements)
- Khách hàng không tìm được sản phẩm phù hợp nhanh → drop-off
- Không có ai answer ngay về specs, warranty, stock, giá khuyến mãi
- Support team bị overwhelm bởi các câu hỏi cơ bản lặp đi lặp lại
- Không có guidance trong quá trình product discovery → checkout bị bỏ dở

### Success metrics cần demo được
- Tăng conversion rate 15–20%
- Giảm drop-off 30% trong product discovery phase
- Offload 40% basic product inquiries khỏi human support

---

## 3. Solution — ShopAssist AI

### Concept
Một **conversational AI sales agent** tích hợp trực tiếp vào website Phong Vũ, có khả năng:
- Hiểu intent của khách hàng (mua laptop gaming, tìm màn hình 4K dưới 10 triệu...)
- Query real-time data từ product catalog (giá, stock, khuyến mãi)
- So sánh sản phẩm theo nhu cầu cụ thể
- Guide checkout — gợi ý add to cart, direct checkout

### Differentiator (so với chatbot thông thường)
- **Agentic** — agent tự quyết định tool nào cần gọi (search, compare, checkout)
- **Context-aware** — nhớ toàn bộ conversation, không hỏi lại thông tin đã biết
- **Real-time data** — không hardcode, luôn query live từ DB
- **Vietnamese-first** — hiểu tiếng Việt tự nhiên, kể cả viết tắt

---

## 4. Architecture

```
User (Chat UI)
     ↓
React 19 Frontend (Vercel)
     ↓
FastAPI Backend (AWS Lambda)
     ↓
AWS Bedrock (Claude Sonnet) ← AI Core — AWS Track qualifier
     ↓ tool calls
┌────────────────────────────────────┐
│  Agent Tools                       │
│  • search_products(query, filters) │
│  • get_product_detail(id)          │
│  • compare_products(id1, id2)      │
│  • check_stock(id)                 │
│  • get_promotions(id)              │
│  • add_to_cart(id, qty)            │
└────────────────────────────────────┘
     ↓
Supabase (Product DB)
```

### AWS Services sử dụng
- **AWS Bedrock** — Claude Sonnet làm AI core (qualify AWS Track)
- **AWS Lambda** — serverless backend
- **AWS S3** — lưu product images (optional)

---

## 5. Core Features (MVP)

### F1 — Conversational Product Search
- User: "Cho mình xem laptop gaming tầm 20 triệu"
- Agent hiểu intent → gọi `search_products(category=laptop, use_case=gaming, max_price=20000000)`
- Trả về top 3–5 sản phẩm phù hợp với card UI

### F2 — Product Detail Q&A
- User: "RAM của cái ASUS ROG này bao nhiêu? Có thể nâng cấp không?"
- Agent gọi `get_product_detail(id)` → answer từ specs data
- Bao gồm warranty policy, thông số kỹ thuật

### F3 — Product Comparison
- User: "So sánh cái ASUS ROG với MSI Katana cho mình"
- Agent gọi `compare_products(id1, id2)` → render comparison table
- Highlight pros/cons theo use case của user

### F4 — Real-time Stock & Promotion Check
- User: "Cái này còn hàng không? Có deal gì không?"
- Agent gọi `check_stock(id)` + `get_promotions(id)`
- Trả về số lượng tồn kho + khuyến mãi đang áp dụng

### F5 — Guided Checkout
- User: "Mình lấy cái này đi"
- Agent gọi `add_to_cart(id, qty=1)` → confirm + link đến checkout
- Upsell phụ kiện liên quan (chuột, bàn phím, tai nghe)

---

## 6. Data Schema (Supabase)

### Table: products
```sql
id              uuid PRIMARY KEY
name            text
category        text          -- laptop, monitor, keyboard...
brand           text
price           numeric
original_price  numeric
stock           integer
specs           jsonb         -- {ram, cpu, gpu, storage, screen...}
description     text
image_url       text
created_at      timestamptz
```

### Table: promotions
```sql
id              uuid PRIMARY KEY
product_id      uuid REFERENCES products(id)
discount_type   text          -- percentage, fixed
discount_value  numeric
start_date      date
end_date        date
label           text          -- "Giảm 15%", "Tặng chuột"
```

### Table: chat_sessions
```sql
id              uuid PRIMARY KEY
session_id      text
messages        jsonb         -- conversation history
created_at      timestamptz
```

### Fake data cần tạo
- ~30–50 sản phẩm: laptop, màn hình, bàn phím, chuột, tai nghe
- ~10–15 promotions đang active
- Cover đủ các brands: ASUS, MSI, Dell, HP, Lenovo, Logitech

---

## 7. Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 19 + Vite 6 + Tailwind v4 |
| Backend | FastAPI (Python 3.11) |
| AI Core | AWS Bedrock — Claude Sonnet 3.5 |
| Database | Supabase (PostgreSQL) |
| Deploy FE | Vercel |
| Deploy BE | AWS Lambda + API Gateway |
| Auth | Supabase Auth (optional cho demo) |

---

## 8. Implementation Plan

### Ngày 1 — July 7 (Setup, ~4h)
- [ ] Tạo AWS account + enable Bedrock + apply for Claude Sonnet access
- [ ] Setup project structure: React + FastAPI
- [ ] Kết nối Supabase — tạo schema
- [ ] Generate fake product data (dùng AI để gen nhanh)
- [ ] Test Bedrock API call đầu tiên

### Ngày 2 — July 8 (Core AI, ~5h)
- [ ] Implement Bedrock agent với tool calling
- [ ] Build 5 tools: search, detail, compare, stock, promotion
- [ ] Connect tools → Supabase queries
- [ ] Test agent flow end-to-end trong terminal

### Ngày 3 — July 9 (Frontend, ~5h)
- [ ] Build Chat UI (message bubbles, typing indicator)
- [ ] Product card component (ảnh, tên, giá, stock badge)
- [ ] Comparison table component
- [ ] Connect FE → FastAPI backend

### Ngày 4 — July 10 (Polish + Checkout, ~4h)
- [ ] Implement add_to_cart + checkout guide
- [ ] Upsell suggestion logic
- [ ] UI polish — responsive, dark/light mode
- [ ] Deploy Vercel + AWS Lambda

### Ngày 5 — July 11 (Demo + Submit, ~3h)
- [ ] Record demo video (3–5 phút)
- [ ] Viết project description cho submission
- [ ] Submit trước deadline
- [ ] Buffer — fix bugs nếu có

---

## 9. Demo Flow (cho judges)

**Scenario:** Khách hàng muốn mua laptop gaming

1. User: "Mình cần laptop gaming tầm 20–25 triệu, chơi game nặng được"
2. Agent search → show 3 sản phẩm phù hợp
3. User: "So sánh ASUS ROG với MSI Katana cho mình"
4. Agent show comparison table → highlight MSI phù hợp hơn với budget
5. User: "MSI này còn hàng không? Có deal gì không?"
6. Agent check stock (còn 5 cái) + promotion (giảm 10% + tặng chuột)
7. User: "Lấy cái này đi"
8. Agent add to cart → confirm + gợi ý thêm bàn phím gaming

**Thời gian demo:** ~3 phút

---

## 10. AWS Track Qualification

Để qualify Built with AWS Track, cần đảm bảo:
- AWS Bedrock là **meaningful core** — không chỉ là wrapper
- Document rõ ràng AWS services sử dụng trong submission
- Highlight tại sao chọn Bedrock thay vì OpenAI (latency, data residency, enterprise-grade)

---

## 11. Risks & Mitigation

| Risk | Mitigation |
|---|---|
| Bedrock access approval chậm | Apply ngay hôm nay, dùng OpenAI làm fallback |
| Lambda cold start chậm | Dùng provisioned concurrency hoặc chuyển sang Vercel serverless |
| Fake data không đủ thuyết phục | Gen 50 products với AI, cover đủ categories |
| Solo không kịp deadline | Cut F5 (checkout) nếu cần, F1–F4 đủ để demo |

---

## 12. Submission Checklist

- [ ] Live demo URL
- [ ] GitHub repo (public)
- [ ] Demo video 3–5 phút
- [ ] Project description (problem, solution, AWS services used)
- [ ] Architecture diagram
- [ ] Success metrics demo (screenshot/recording)
