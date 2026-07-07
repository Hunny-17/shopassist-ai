# ShopAssist AI — Test Scenarios

## Happy Path Scenarios

### S1 — Laptop gaming đơn giản
```
User: "Cho mình xem laptop gaming"
Agent: Hỏi thêm budget → User: "Tầm 20 triệu"
Agent: search_products(category=laptop, use_case=gaming, max_price=20M)
       → Show 3 laptops
Expected: 3 ProductCards đúng category, đúng budget
```

### S2 — Multi-constraint search
```
User: "Laptop hay di chuyển, pin trâu, làm việc văn phòng, budget 15 triệu"
Agent: parse → portable + battery + office + max_price=15M
       search_products với đủ filters
Expected: Laptop nhẹ (<2kg), pin lớn (>60Wh), trong budget
```

### S3 — Product detail Q&A
```
User: "RAM của ASUS Vivobook 15 này có nâng cấp được không?"
Agent: get_product_detail(asus-vivobook-15-id)
       → check specs.ram_upgradeable
Expected: Trả lời chính xác từ specs, không hallucinate
```

### S4 — So sánh 2 sản phẩm
```
User: "So sánh MSI Katana B13 với ASUS TUF Gaming A15"
Agent: compare_products([msi-katana-id, asus-tuf-id])
Expected: ComparisonTable với đủ specs, highlight winner từng category
```

### S5 — Stock + promotion check
```
User: "Cái MSI Katana này còn hàng không? Có deal gì không?"
Agent: check_stock_and_promotion(msi-katana-id)
Expected: Stock count + active promotion label + ngày hết hạn
```

### S6 — Guided checkout
```
User: "Lấy cái ASUS TUF này đi"
Agent: add_to_cart(asus-tuf-id, qty=1)
       → Confirm + suggest accessories
Expected: Cart update + upsell chuột gaming phù hợp
```

---

## Edge Cases — Quan trọng cho judges

### E1 — Hết hàng
```
User: "Cho mình lấy Dell XPS 15"
Stock: 0
Agent: KHÔNG add to cart
Expected: "Sản phẩm này hiện đã hết hàng. 
           Mình suggest Dell XPS 13 hoặc ASUS Zenbook 15 
           có specs tương tự, hiện còn hàng."
```

### E2 — Budget không đủ
```
User: "Mình muốn laptop gaming RTX 4090, budget 10 triệu"
Agent: search → không có kết quả phù hợp
Expected: "RTX 4090 hiện tại bắt đầu từ 45 triệu. 
           Với budget 10 triệu, mình có thể suggest 
           laptop gaming entry-level với RTX 3050..."
```

### E3 — Sản phẩm không tồn tại
```
User: "Cho mình xem iPhone 15 Pro"
Agent: search → không có trong catalog
Expected: "Phong Vũ hiện không kinh doanh iPhone. 
           Mình có thể giúp bạn tìm laptop, màn hình, 
           phụ kiện máy tính không?"
```

### E4 — Off-topic question
```
User: "Hôm nay thời tiết thế nào?"
Agent: Bedrock Guardrails block
Expected: "Mình chỉ có thể tư vấn về sản phẩm công nghệ 
           tại Phong Vũ. Bạn đang tìm kiếm sản phẩm gì không?"
```

### E5 — Câu hỏi nhạy cảm về giá cạnh tranh
```
User: "Thế Giới Di Động bán rẻ hơn không?"
Expected: "Mình không có thông tin về giá của các cửa hàng khác.
           Hiện tại Phong Vũ đang có chương trình [promotion], 
           bạn muốn mình kiểm tra giá tốt nhất cho sản phẩm này không?"
```

### E6 — Multi-turn context retention
```
Turn 1 - User: "Budget mình 25 triệu"
Turn 2 - User: "Cho xem laptop gaming"
Turn 3 - User: "Cái nào nhẹ hơn?"
Agent Turn 3: Nhớ budget 25M từ Turn 1
              Nhớ đang xem laptop gaming từ Turn 2
              Filter thêm weight → không hỏi lại
Expected: Recommend laptop gaming 25M nhẹ nhất
```

### E7 — Proactive intervene khi sắp drop-off
```
User: browse 45 giây không gõ gì
Agent: Proactive trigger
Expected: "Bạn đang tìm kiếm sản phẩm gì? 
           Mình có thể giúp tìm nhanh hơn 😊"
```

### E8 — Upsell sau add to cart
```
User: Add laptop gaming vào cart
Agent: add_to_cart → success
Expected: "Đã thêm vào giỏ hàng! 
           Bạn có cần chuột gaming không? 
           Logitech G304 đang giảm 15%, chỉ 590,000đ.
           Mua kèm tiết kiệm hơn ship riêng."
```

### E9 — Tiếng Việt không dấu
```
User: "cho minh xem laptop gaming tam 20 trieu"
Expected: Agent hiểu đúng, không bị confuse
```

### E10 — Câu hỏi kỹ thuật sâu
```
User: "Laptop này có support Thunderbolt 4 không? 
       PCIe Gen 4 hay Gen 3?"
Agent: get_product_detail → check specs.ports + specs.pcie_gen
Expected: Trả lời chính xác từ specs, 
          nếu không có data → thừa nhận thay vì hallucinate
```

---

## Performance Benchmarks

| Metric | Target | Fail threshold |
|---|---|---|
| Response time | < 3s | > 5s |
| Tool call accuracy | > 90% | < 80% |
| Intent parse accuracy | > 85% | < 70% |
| Hallucination rate | 0% | > 5% |
| Context retention | 100% within session | < 90% |

---

## Demo Rehearsal Checklist

- [ ] S2 (multi-constraint) — demo live với judges
- [ ] S4 (comparison) — chuẩn bị 2 sản phẩm cụ thể
- [ ] S5 (stock + promo) — đảm bảo có promotion active trong DB
- [ ] S6 (checkout + upsell) — cart UI hoạt động
- [ ] E1 (hết hàng) — set 1 sản phẩm stock=0
- [ ] E4 (off-topic) — Guardrails đã setup
- [ ] Analytics dashboard — show mock numbers
