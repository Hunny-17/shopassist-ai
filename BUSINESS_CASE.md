# ShopAssist AI — Business Case

## 1. Bài toán kinh doanh của Phong Vũ

### Thực trạng
Phong Vũ là một trong những chuỗi bán lẻ công nghệ lớn nhất Việt Nam với hàng nghìn SKUs trên website. Tuy nhiên:

- **Conversion rate** trung bình e-commerce Việt Nam: 1–3%
- **Drop-off** cao nhất xảy ra ở product discovery phase — khách không tìm được đúng sản phẩm
- **Support team** bị overwhelm bởi câu hỏi lặp đi lặp lại: specs, warranty, stock, giá
- **Khách hàng tech** thường cần tư vấn chuyên sâu — không phải keyword search đơn giản

### Cơ hội
Nếu tăng conversion rate thêm 15–17%:
- Với 100,000 visitors/tháng × conversion tăng 1.5% × AOV 5,000,000 VND
- = **+7,500 đơn hàng/tháng × 5,000,000 VND = +37.5 tỷ VND/tháng**
- ROI từ AI agent: cực kỳ cao so với chi phí vận hành

---

## 2. Solution Value Proposition

### Cho khách hàng Phong Vũ
- Tìm đúng sản phẩm trong vài giây thay vì mò mẫm hàng giờ
- Được tư vấn 24/7 không cần chờ nhân viên
- So sánh sản phẩm khách quan, không bị ép mua
- Biết ngay stock, giá, khuyến mãi — không vào trang rồi thất vọng

### Cho Phong Vũ (Operations team)
- Giảm 40% ticket support cơ bản → nhân viên focus vào cases phức tạp hơn
- Analytics real-time: khách hỏi gì nhiều nhất, drop-off ở đâu
- Upsell tự động, tự nhiên — không cần train nhân viên

### Cho Phong Vũ (Business)
- Tăng conversion rate 15–20% trong 6 tháng
- Giảm cost-per-acquisition
- Data insights về customer intent — inform inventory và promotion planning

---

## 3. Go-to-Market Plan

### Phase 1 — Hackathon MVP (July 8–12)
- Demo với mock data từ phongvu.vn
- Prove concept: agent hiểu intent, tool calling, real-time data
- Target: Win Retail Track + qualify AWS Track

### Phase 2 — Pilot Integration (Tháng 8–9)
- Integrate widget script vào phongvu.vn
- A/B test: 50% traffic có agent / 50% không
- Measure conversion lift thật
- Fine-tune product ranking, prompt engineering

### Phase 3 — Full Production (Tháng 10–12)
- Roll out 100% traffic
- Mobile app integration (React Native)
- Tiếng Anh support cho khách quốc tế
- Advanced analytics dashboard cho ops team

### Phase 4 — Scale (2027)
- License model cho retailers khác ở SEA
- White-label solution: cài vào website bất kỳ trong 1 ngày
- Target: Thế Giới Di Động, FPT Shop, các retailers FMCG

---

## 4. Competitive Analysis

| | ShopAssist AI | Chatbot thông thường | Search thông thường |
|---|---|---|---|
| Intent understanding | ✅ Multi-constraint | ❌ Keyword only | ❌ Keyword only |
| Real-time data | ✅ Live stock/price | ⚠️ Thường static | ✅ |
| Tool calling | ✅ 6 tools | ❌ | ❌ |
| Comparison | ✅ Inline chat | ❌ | ⚠️ Separate page |
| Upsell | ✅ Contextual | ❌ | ❌ |
| Session memory | ✅ | ⚠️ Basic | ❌ |
| Production-ready | ✅ Guardrails | ❌ | ✅ |

---

## 5. Cost Structure

### Vận hành/tháng (estimate production)
| Item | Cost |
|---|---|
| AWS Bedrock (Claude Sonnet) | ~$50–200 tùy traffic |
| AWS Lambda | ~$10–30 |
| Supabase | $25 Pro plan |
| Vercel | $20 Pro |
| **Total** | **~$100–300/tháng** |

So với việc tăng revenue hàng tỷ đồng → **ROI > 1000x**

---

## 6. Risks & Mitigation

| Risk | Impact | Mitigation |
|---|---|---|
| Bedrock latency cao | UX kém | Streaming response, typing indicator |
| Hallucinate specs | Trust giảm | Bedrock Knowledge Bases + Guardrails |
| Data scraping bị block | Thiếu data | Bright Data proxy rotation |
| User không adopt | Low impact | Proactive trigger, onboarding message |
| Scale cost tăng | Margin giảm | Cache common queries, batch processing |
