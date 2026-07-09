# ShopAssist AI — UI Design

## 1. Design Direction

### Blue/White Retail Theme

ShopAssist AI dùng giao diện xanh biển/trắng để tạo cảm giác tech retail sạch, sáng, dễ đọc và ít nặng hơn palette đỏ/trắng trước đó.

Visual direction hiện tại:
- Primary blue `#0068B7` là màu nhận diện chính cho CTA, avatar agent, active state, price highlight.
- Header và product workspace dùng nền trắng/xám xanh sáng để gần cảm giác ecommerce.
- Chat panel giữ dark để tạo tương phản và làm agent flow nổi bật.
- Product cards là điểm nhấn thị giác chính: nền trắng, giá xanh, badge rõ, CTA xanh.

### Aesthetic

- **Tone:** Clean, professional, tech retail, demo-ready.
- **Feel:** Trợ lý mua sắm AI thân thiện, rõ ràng, có năng lực tư vấn.
- **Avoid:** Giao diện toàn dark quá generic, gradient màu tím/xanh, layout marketing hero.

---

## 2. Color Palette

```txt
Primary Blue:    #0068B7   CTA, price, agent avatar, active state
Primary Hover:   #00569A   CTA hover/pressed state
Blue Soft:       #EAF5FF   Light blue surface/badge background
Blue Border:     #D8E6F2   Light blue-tinted borders
Blue Accent:     #55B6FF   Accent on dark chat surfaces

Retail BG:       #F3F8FC   App background
Panel BG:        #F7FBFF   Product panel background
Surface:         #FFFFFF   Header, product cards, cart
Surface Muted:   #F7FBFF   Spec tiles, quick chips, empty surfaces

Chat BG:         #0F0F0F   Chat panel background
Chat Surface:    #1A1A1A   Assistant bubble
Chat Input:      #202020   Chat input surface
Chat Border:     #2E2E2E   Chat dividers and dark borders

Text Primary:    #111827   Main text on light surfaces
Text Secondary:  #3F5366   Secondary product/cart text
Text Muted:      #5F6F7E   Labels and descriptions
Text On Dark:    #FFFFFF   Chat text

Success:         #22C55E   In stock / connected
Success Soft:    #DCFCE7   Success badge background
Warning:         #F59E0B   Promotion/low stock
Warning Soft:    #FFFBEB   Promotion badge background
Error:           #EF4444   Out of stock / destructive action
```

---

## 3. Layout

### Desktop

- App shell centered, max width `7xl`, height `100vh`.
- Header: white retail header with top blue brand bar.
- Main split:
  - Left 60%: dark chat panel.
  - Right 40%: light product recommendation panel.
- Right panel is dedicated to shopper-facing recommendations:
  - Product recommendations header.
  - Product grid / empty prompt card.
  - Full-height scroll area for browsing product cards.
- Analytics is not shown in the shopper UI. If needed, it belongs in a separate admin/internal view, not in the product recommendation panel.

### Mobile

- Full-screen chat-first layout.
- Header stays white/blue and compact.
- Product recommendation side panel is hidden.
- Inline product cards remain inside chat stream.
- Input is sticky at bottom.

---

## 4. Component Specs

### Header

- Background: `#FFFFFF`
- Top brand bar: `#0068B7`
- Logo/avatar block: blue square with white icon.
- Primary text: `#111827`
- Secondary text: `#5F6F7E`
- Cart button: blue fill, white icon.

### Chat Panel

- Background: `#0F0F0F`
- Quick prompt bar: dark surface with blue section label.
- Assistant avatar: blue square with `AI`.
- Assistant bubble: dark card, white text.
- User bubble: blue fill, white text.
- Input: dark input surface, blue send button.

### Product Recommendation Panel

- Background: `#F7FBFF`
- Header background: white.
- Scroll area uses the full remaining height.
- No Analytics widget in this panel; the space is reserved for product browsing.

### ProductCard

- Background: `#FFFFFF`
- Border: `#D8E6F2`
- Top accent bar: `#0068B7`
- Product name: `#111827`
- Price: `#0068B7`
- Spec tiles: `#F7FBFF`
- Primary action: blue filled button.
- Secondary action: white button with light blue border.

### StockBadge

- In stock: green text on soft green.
- Low stock: amber text on soft amber.
- Out of stock: red text on soft red.

### CartDrawer

- Background: white.
- Body area: `#F7FBFF`.
- Header top accent: blue.
- Checkout button: blue filled.

---

## 5. Signature Element

Inline product cards trong chat stream là điểm nhận diện chính. Khi agent recommend, sản phẩm xuất hiện ngay trong conversation cùng giá, tồn kho, khuyến mãi, thông số và CTA. User không phải rời chat để hiểu lựa chọn.

Right panel trên desktop đóng vai trò như “kệ sản phẩm nổi bật” của cuộc hội thoại hiện tại, giúp user lướt và so sánh nhanh các gợi ý mới nhất.

---

## 6. Micro-Interactions

- Quick prompt chips hover blue.
- Product card hover lift nhẹ và đổi border blue.
- Product image scale nhẹ khi hover.
- Cart badge cập nhật số lượng.
- Typing indicator dùng avatar xanh và animated dots.
