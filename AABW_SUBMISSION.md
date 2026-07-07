# ShopAssist AI — AABW Submission Template
**Submit tại: AABW Portal (luma.link/PmFaaTXFkf)**
**Deadline: July 12, 2026 — 9:00 AM ICT**

---

## Project Name
ShopAssist AI

## Track
Retail Track — Powered by Phong Vũ

## One-line Description
Conversational AI sales agent giúp khách hàng Phong Vũ tìm đúng sản phẩm, so sánh, và mua hàng trong vài giây — không cần rời khỏi chat.

## Problem Statement
Phong Vũ mất revenue vì khách hàng drop-off trong product discovery phase: họ không tìm được sản phẩm phù hợp nhanh, không có ai tư vấn real-time về specs/stock/giá, và support team bị overwhelm bởi câu hỏi cơ bản lặp đi lặp lại.

## Solution
ShopAssist AI là agentic sales assistant tích hợp trực tiếp vào website Phong Vũ. Agent sử dụng AWS Bedrock Agents để orchestrate 6 tools: tìm kiếm sản phẩm theo intent tự nhiên, lấy thông tin chi tiết từ Knowledge Base, so sánh sản phẩm, kiểm tra stock/khuyến mãi real-time, và hướng dẫn checkout.

## AWS Services Used
- **AWS Bedrock Agents** — AI orchestration core, tool calling
- **Claude Sonnet 3.5 via Bedrock** — LLM model
- **Bedrock Knowledge Bases** — RAG trên product catalog + FAQs
- **Bedrock Guardrails** — Safety, off-topic blocking
- **AWS Lambda** — Serverless backend
- **AWS S3** — Product images, Knowledge Base documents

## AI Technologies (Track Requirement)
1. **Generative AI** — Claude Sonnet 3.5 via AWS Bedrock
2. **Recommendation Systems** — Multi-factor product scoring theo user context
3. **Search & Knowledge Retrieval** — Bedrock Knowledge Bases + Supabase full-text search
4. **Conversational AI** — Multi-turn agent với session memory

## Agentic Behavior
Agent thật sự agentic — không phải chatbot đơn giản:
- Multi-step reasoning: parse intent → select tools → chain calls → synthesize response
- Context retention: nhớ budget/preferences across conversation turns
- Proactive suggestions: sau add_to_cart → tự suggest accessories phù hợp
- Graceful degradation: hết hàng → suggest alternatives thay vì dừng

## Success Metrics Demo
- **Conversion rate:** Mock analytics show +17% lift với agent vs without
- **Drop-off reduction:** Demo scenario user sắp thoát → agent intervene → user stays
- **Inquiry offload:** 40+ loại câu hỏi cơ bản được handle tự động

## Tech Stack
- Frontend: React 19 + Vite 6 + Tailwind v4 → Vercel
- Backend: FastAPI Python 3.11 → AWS Lambda
- Database: Supabase PostgreSQL + Realtime
- AI: AWS Bedrock Agents + Knowledge Bases + Guardrails

## Live Demo URL
[điền sau khi deploy]

## GitHub Repository
[điền sau khi push]

## Team
- Trần Quốc Huy — Solo builder
- Demo Day attendance: Confirmed (HCMC)
