# ShopAssist AI — Competitive Analysis

## 1. Landscape hiện tại

### Giải pháp đang tồn tại ở Việt Nam

**Zalo OA Chatbot (phổ biến nhất)**
- Rule-based, keyword matching
- Không hiểu intent phức tạp
- Không có tool calling
- Maintenance cao — phải update rules thủ công

**Live Chat (Tawk.to, Zendesk)**
- Cần nhân viên thật trực 24/7
- Chi phí cao, không scale
- Response time phụ thuộc con người

**Search thông thường (Elasticsearch)**
- Keyword matching, không hiểu ngữ cảnh
- "laptop gaming pin trâu nhẹ 20 triệu" → kết quả kém
- Không conversation, không comparison, không checkout guide

**Chatbot AI cơ bản (GPT wrapper)**
- Không có tool calling thật
- Không integrate với live data
- Hallucinate specs, giá
- Không agentic — chỉ Q&A đơn giản

---

## 2. ShopAssist AI vs Alternatives

| Tiêu chí | ShopAssist AI | Zalo Chatbot | Live Chat | Search | GPT Wrapper |
|---|---|---|---|---|---|
| Intent understanding | ✅ Multi-constraint | ❌ Keyword | ✅ Human | ❌ Keyword | ⚠️ Basic |
| Real-time data | ✅ Live DB | ❌ Static | ✅ Human | ✅ | ❌ |
| Tool calling | ✅ 6 tools | ❌ | ❌ | ❌ | ❌ |
| Product comparison | ✅ Inline | ❌ | ⚠️ Manual | ❌ | ⚠️ Text only |
| Upsell | ✅ Contextual | ⚠️ Scripted | ✅ Human | ❌ | ❌ |
| 24/7 availability | ✅ | ✅ | ❌ | ✅ | ✅ |
| Scale | ✅ Auto | ✅ | ❌ | ✅ | ✅ |
| Vietnamese | ✅ Native | ✅ | ✅ | ⚠️ | ⚠️ |
| Production safety | ✅ Guardrails | ✅ | ✅ | ✅ | ❌ |
| Setup cost | 🟡 Medium | 🟢 Low | 🔴 High | 🟡 Medium | 🟢 Low |

---

## 3. Unique Differentiators

### D1 — Agentic Tool Orchestration
Không phải chatbot trả lời câu hỏi — mà là agent tự quyết định cần làm gì:
- "Laptop gaming 20 triệu" → search → detail → check stock → compare → suggest
- Một conversation flow, không cần user hướng dẫn từng bước

### D2 — Intent > Keyword
Hiểu: *"hay di chuyển, pin trâu, không cần gaming quá mạnh, hay zoom meeting"*
→ Filter: portable + battery + mid-tier GPU + webcam quality
Competitor: search từng keyword → kết quả noise

### D3 — Inline Product Experience
Cards, comparison table, cart — tất cả trong chat stream.
Không redirect, không mất context, không friction.

### D4 — Vietnamese-first
Hiểu tiếng Việt tự nhiên kể cả:
- Không dấu: "laptop gaming tam 20 trieu"
- Viết tắt: "màn 4k 27in"
- Ngữ cảnh địa phương: "chơi LMHT", "edit TikTok"

### D5 — Production-ready từ ngày đầu
- Bedrock Guardrails: block off-topic, toxic content
- Knowledge Bases: không hallucinate specs
- Analytics: track conversion, drop-off real-time

---

## 4. Tại sao ShopAssist AI thắng trong hackathon context

**Vs team khác cũng làm chatbot:**
- Tool calling thật vs Q&A đơn giản
- Data thật từ phongvu.vn vs fake data generic
- 4 AI technologies đủ vs thường chỉ 1-2
- Analytics dashboard vs không có

**Vs team có nhiều người hơn:**
- Demo flow mượt hơn vì solo control toàn bộ
- Problem understanding sâu hơn vì không bị dilute
- Scope rõ ràng, không over-engineer
