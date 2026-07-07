# ShopAssist AI — Demo Script
**Demo Day: July 12, 2026 | Target: 3–5 phút**

---

## Trước khi lên stage

- [ ] Mở laptop, browser sẵn tại live URL
- [ ] Tab 1: ShopAssist AI demo
- [ ] Tab 2: Supabase dashboard (để show realtime nếu cần)
- [ ] Tab 3: Analytics dashboard
- [ ] Tắt notifications
- [ ] Test internet connection
- [ ] Chạy thử 1 lần toàn bộ flow

---

## Script (3 phút 30 giây)

### Opening — 30 giây
> "Phong Vũ có hàng nghìn sản phẩm trên website. Nhưng hầu hết khách hàng không tìm được đúng thứ họ cần — và rời đi.
> 
> ShopAssist AI giải quyết vấn đề đó bằng cách đặt một nhân viên bán hàng thông minh ngay trong chat — hiểu nhu cầu thật, không phải keyword."

*[Mở demo, show chat interface]*

---

### Demo 1 — Intent Search — 50 giây
*[Gõ vào chat]*
> **User:** "Mình cần laptop gaming, hay chơi Valorant và edit video, thường xuyên di chuyển, budget 22 triệu"

*[Đợi agent response — khoảng 2-3 giây]*

> "Thay vì search keyword, agent phân tích toàn bộ context: gaming + video editing + portable + 22 triệu. Và recommend đúng 3 sản phẩm phù hợp — với lý do cụ thể."

*[Show ProductCards xuất hiện inline trong chat]*

---

### Demo 2 — Comparison — 40 giây
*[Gõ tiếp]*
> **User:** "So sánh MSI Katana với ASUS TUF cho mình"

*[Show ComparisonTable]*

> "Comparison table xuất hiện ngay trong chat — không cần mở tab mới, không cần copy specs thủ công. Agent highlight cái nào phù hợp hơn cho use case cụ thể của user."

---

### Demo 3 — Real-time Stock & Promotion — 30 giây
*[Gõ tiếp]*
> **User:** "MSI Katana còn hàng không? Có deal gì không?"

*[Show stock count + promotion badge]*

> "Data real-time từ database — stock, giá, khuyến mãi cập nhật ngay lập tức. Không có hardcode, không có delay."

---

### Demo 4 — Checkout + Upsell — 30 giây
*[Gõ tiếp]*
> **User:** "Lấy MSI Katana đi"

*[Show cart update + upsell suggestion]*

> "Agent add to cart và ngay lập tức suggest chuột gaming phù hợp đang có combo deal. Upsell tự nhiên, đúng lúc — không spam."

---

### Demo 5 — Edge Case — 20 giây
*[Gõ]*
> **User:** "Hôm nay thời tiết thế nào?"

*[Show Guardrails response]*

> "Bedrock Guardrails đảm bảo agent không bị distract. Production-ready từ ngày đầu."

---

### Analytics — 20 giây
*[Switch sang Analytics tab]*

> "Ops team của Phong Vũ thấy real-time: conversion rate hôm nay 18.3% — cao hơn 3.2% so với baseline. 89 inquiries được xử lý tự động."

---

### Close — 20 giây
> "ShopAssist AI được build trên AWS Bedrock Agents — Claude Sonnet 3.5, Knowledge Bases, Guardrails. Agentic từ đầu: multi-step reasoning, tool chaining, context retention.
>
> Post-hackathon: integrate thật vào phongvu.vn, A/B test với real traffic, và license cho retailers khác ở SEA."

---

## Câu hỏi judges có thể hỏi

**Q: Tại sao dùng AWS Bedrock thay vì OpenAI trực tiếp?**
> "Data residency — Bedrock chạy trong AWS region, phù hợp enterprise. Ngoài ra Knowledge Bases và Guardrails là native — không cần build thêm infrastructure."

**Q: Scale như thế nào khi có 10,000 concurrent users?**
> "AWS Lambda auto-scale, Bedrock pay-per-token, Supabase connection pooling. Không cần provision servers thủ công."

**Q: Data thật từ đâu?**
> "Scrape từ phongvu.vn qua Bright Data, normalize vào Supabase. Production sẽ integrate trực tiếp vào Phong Vũ backend API."

**Q: Hallucination thế nào?**
> "Bedrock Knowledge Bases — agent chỉ answer từ product data thật. Nếu không có thông tin → thừa nhận thay vì tự bịa. Guardrails add thêm layer safety."

**Q: Solo build trong mấy ngày?**
> "4 ngày part-time. Stack quen — React, FastAPI, Supabase — focus toàn bộ vào AI layer và UX."

---

## Backup Plan nếu demo live bị lỗi

- **Nếu Bedrock timeout:** Switch sang OpenAI fallback — same UI, different backend
- **Nếu internet chậm:** Có pre-recorded video 2 phút làm backup
- **Nếu Supabase down:** Local mock data JSON làm fallback
- **Nếu agent trả lời sai:** Acknowledge, explain tại sao, show fix
