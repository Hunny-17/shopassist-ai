# ShopAssist AI — UI Design

## 1. Design Direction

### Brand Alignment với Phong Vũ
Phong Vũ brand: đỏ (#E31E24) + trắng + đen — tech-forward, professional, Vietnamese market.
ShopAssist AI widget cần feel như **native part của phongvu.vn**, không phải third-party plugin.

### Aesthetic
- **Tone:** Clean, professional, tech-savvy — không childish, không over-designed
- **Feel:** Như đang chat với nhân viên Phong Vũ thật — thân thiện nhưng competent
- **Risk:** Chat bubble truyền thống quá generic → dùng **split-panel layout** thay thế

---

## 2. Color Palette

```
Primary:      #E31E24   (Phong Vũ đỏ — CTA buttons, agent avatar)
Dark BG:      #0F0F0F   (Chat panel background)
Surface:      #1A1A1A   (Message bubbles, cards)
Surface 2:    #242424   (Input bar, secondary elements)
Border:       #2E2E2E   (Dividers, card borders)
Text Primary: #FFFFFF   (Main text)
Text Muted:   #888888   (Timestamp, labels)
Success:      #22C55E   (Còn hàng, confirmed)
Warning:      #F59E0B   (Sắp hết hàng — < 5 cái)
Error:        #EF4444   (Hết hàng, error states)
Accent:       #E31E24   (Links, highlights — same as Primary)
```

---

## 3. Typography

```
Display:  Inter 700 — tên sản phẩm, giá, headings
Body:     Inter 400 — chat messages, descriptions  
Mono:     JetBrains Mono — specs (RAM: 16GB, CPU: i7-13700H)
Size scale:
  xs:   11px — timestamps, labels
  sm:   13px — secondary text
  base: 15px — chat messages
  lg:   17px — product names
  xl:   22px — prices
  2xl:  28px — section headers
```

---

## 4. Layout

### Desktop — Split Panel
```
┌─────────────────────────────────────────────────────────┐
│  HEADER: ShopAssist AI    🔴 Phong Vũ logo    [×] [−]  │
├──────────────────────────┬──────────────────────────────┤
│                          │                              │
│     CHAT PANEL (60%)     │   PRODUCT PANEL (40%)        │
│                          │                              │
│  ┌──────────────────┐    │  ┌────────────────────────┐  │
│  │ 🤖 Agent message │    │  │  ProductCard           │  │
│  │ với inline cards │    │  │  [Ảnh] Tên sản phẩm    │  │
│  └──────────────────┘    │  │  Giá: 22,990,000đ      │  │
│                          │  │  Stock: ✅ Còn 8 cái   │  │
│  ┌──────────────────┐    │  │  [Xem chi tiết] [Mua]  │  │
│  │ 👤 User message  │    │  └────────────────────────┘  │
│  └──────────────────┘    │                              │
│                          │  ┌────────────────────────┐  │
│                          │  │  ProductCard 2         │  │
│                          │  └────────────────────────┘  │
│                          │                              │
│                          │  ┌────────────────────────┐  │
│                          │  │  ProductCard 3         │  │
│                          │  └────────────────────────┘  │
├──────────────────────────┴──────────────────────────────┤
│  [💬 Nhập câu hỏi về sản phẩm...]          [→ Gửi]    │
└─────────────────────────────────────────────────────────┘
```

### Mobile — Full Screen Chat
```
┌─────────────────────────┐
│ ← ShopAssist AI   🛒(2) │
├─────────────────────────┤
│                         │
│  🤖 Xin chào! Mình có  │
│  thể giúp bạn tìm       │
│  laptop, màn hình...    │
│                         │
│  ┌─────────────────┐    │
│  │ 📱 ProductCard  │    │
│  │ Swipeable cards │    │
│  └─────────────────┘    │
│                         │
│           👤 Tôi cần   │
│           laptop gaming │
│                         │
├─────────────────────────┤
│ [Nhập câu hỏi...] [→]  │
└─────────────────────────┘
```

---

## 5. Component Specs

### MessageBubble
```
Agent:
- Avatar: 🔴 circle, "PV" initials
- Background: #1A1A1A
- Border-radius: 4px 16px 16px 16px
- Max-width: 80%
- Padding: 12px 16px

User:
- Background: #E31E24
- Border-radius: 16px 4px 16px 16px
- Align: right
- Max-width: 70%
```

### ProductCard (Inline)
```
Width: 100% của panel
Height: auto
Border: 1px solid #2E2E2E
Border-radius: 12px
Padding: 16px
Background: #1A1A1A

Layout:
[Ảnh 80x80] | [Tên sản phẩm - Inter 700 17px]
             | [Brand - muted 13px]
             | [Giá - Inter 700 22px #E31E24]
             | [Giá gốc - strikethrough muted]
             | [StockBadge] [PromoBadge]
             | [Xem chi tiết] [🛒 Thêm vào giỏ]
```

### StockBadge
```
Còn hàng (≥ 10):  🟢 "Còn hàng"    — #22C55E bg
Sắp hết (< 10):   🟡 "Còn X cái"   — #F59E0B bg  
Hết hàng (= 0):   🔴 "Hết hàng"    — #EF4444 bg
```

### ComparisonTable
```
Header: Tên sản phẩm A | Tên sản phẩm B
Rows:
  Giá          | 22,990,000đ | 19,990,000đ
  CPU          | i7-13700H   | i5-13500H
  RAM          | 16GB        | 8GB
  GPU          | RTX 4060    | RTX 3050
  Màn hình     | 15.6" 144Hz | 15.6" 60Hz
  Pin          | 90Wh        | 54Wh
  Trọng lượng  | 2.2kg       | 1.8kg
  Bảo hành     | 24 tháng    | 12 tháng

Winner highlight: cell tốt hơn → background #E31E2420
```

### AnalyticsDashboard (Mock)
```
┌────────────────────────────────────────┐
│ 📊 Analytics — Hôm nay                │
├──────────────┬─────────────────────────┤
│ Conversations│ 247                     │
│ Conversion   │ 18.3% (+3.2% vs avg)   │
│ Avg session  │ 4m 32s                  │
│ Top query    │ "laptop gaming"         │
│ Inquiries    │ 89 tự động xử lý       │
└──────────────┴─────────────────────────┘
```

---

## 6. Signature Element

**Inline product cards trong chat stream** — khi agent recommend sản phẩm, cards xuất hiện trực tiếp trong message, không redirect sang trang khác. User có thể scroll qua cards, xem chi tiết, thêm vào giỏ — tất cả không rời chat.

Đây là điểm visual khác biệt rõ nhất so với chatbot thông thường.

---

## 7. Micro-interactions

- **Typing indicator:** 3 dots animation khi agent đang "suy nghĩ"
- **Card reveal:** Cards fade-in từng cái, không xuất hiện cùng lúc
- **Stock update:** Badge pulse animation khi stock thay đổi real-time
- **Add to cart:** Cart icon bounce + số lượng update
- **Send message:** Button ripple effect khi gửi
