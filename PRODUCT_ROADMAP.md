# ShopAssist AI — Product Roadmap

## V1 — Hackathon MVP (July 8–12, 2026)

**Goal:** Prove concept, win Retail Track

**Features:**
- Conversational product search với intent understanding
- Product detail Q&A từ Bedrock Knowledge Bases
- Product comparison inline trong chat
- Real-time stock + promotion check (Supabase realtime)
- Guided checkout + upsell suggestions
- Mock analytics dashboard
- Bedrock Guardrails safety layer

**Tech:** React 19 + FastAPI + AWS Bedrock Agents + Supabase + Vercel

**Metrics target:**
- Demo conversion lift: +15–20%
- Agent accuracy: >85%
- Response time: <3s

---

## V2 — Pilot Production (Tháng 8–10, 2026)

**Goal:** Integrate thật vào phongvu.vn, measure real impact

**Features thêm:**
- Widget script embed vào phongvu.vn (1 line JS)
- Connect với Phong Vũ backend API thật (không phải Supabase fake)
- A/B testing framework: 50% traffic có agent / 50% không
- Real analytics: conversion, AOV, session length
- Mobile responsive hoàn thiện
- Tiếng Anh support
- Voice input (Web Speech API)
- Proactive trigger: user dừng >30s → agent mở

**Tech thêm:**
- Phong Vũ API integration
- Redis cache cho common queries
- Langfuse monitoring (đã có perk)
- Daytona dev environment

**Metrics target:**
- Conversion lift thật: >10% (A/B test)
- Drop-off reduction: >20%
- Support ticket reduction: >30%

---

## V3 — Full Production Scale (Tháng 11–12, 2026)

**Goal:** Full roll-out, optimize, prepare for licensing

**Features thêm:**
- React Native app (iOS + Android)
- Personalization: nhớ purchase history, preferences
- Recommendation engine nâng cao: collaborative filtering
- Multi-modal: upload ảnh → "tìm sản phẩm tương tự cái này"
- Price alert: user subscribe → notify khi giá giảm
- Comparison saved: user lưu comparison để xem lại
- Admin dashboard: quản lý KB, monitor agent performance
- Bedrock AgentCore cho multi-agent architecture

**Tech thêm:**
- AWS SageMaker cho recommendation model
- Amazon Personalize
- Push notifications (Firebase)
- Advanced Bedrock Guardrails customization

**Metrics target:**
- Conversion lift: >20%
- MAU: 50,000+ users
- NPS: >50

---

## V4 — SEA Licensing (2027)

**Goal:** White-label solution cho retailers SEA

**Product:**
- ShopAssist AI Platform — SaaS
- Retailers cài trong 1 ngày: upload product catalog → configure → go live
- Multi-tenant architecture
- Custom branding per retailer
- Analytics per tenant

**Target customers:**
- Việt Nam: Thế Giới Di Động, FPT Shop, CellphoneS
- SEA: Lazada sellers, Shopee Mall stores, regional retailers
- Enterprise: B2B procurement platforms

**Pricing model:**
- Freemium: 1,000 conversations/tháng free
- Growth: $99/tháng — 10,000 conversations
- Enterprise: Custom pricing

**Revenue potential:**
- 100 customers × $200 avg → $20,000 MRR
- Scale to 1,000 customers → $200,000 MRR

---

## Timeline Summary

```
July 12   → V1 Submit AABW
August    → V2 Pilot phongvu.vn
October   → V2 A/B test results
November  → V3 Full roll-out
2027 Q1   → V4 SEA licensing launch
```
