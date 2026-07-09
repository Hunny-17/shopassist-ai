import ComparisonTable from "../Products/ComparisonTable"
import ProductGrid from "../Products/ProductGrid"

/**
 * Chat message bubble for user and assistant.
 * @param {{message: object, onAddToCart: Function}} props
 */
export default function MessageBubble({ message, onAddToCart }) {
  const isUser = message.role === "user"
  const timestamp = message.timestamp
    ? new Date(message.timestamp).toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit"
      })
    : ""

  return (
    <article className={`flex min-w-0 max-w-full ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`flex min-w-0 max-w-full gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
        {!isUser && (
          <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0B74BD] text-xs font-semibold text-white">
            AI
          </div>
        )}
        <div className={isUser ? "min-w-0 max-w-[78vw] sm:max-w-[70%]" : "min-w-0 flex-1 sm:max-w-[90%]"}>
          <div
            className={
              isUser
                ? "rounded-[18px_6px_18px_18px] bg-[#0B74BD] px-4 py-3 text-[15px] leading-6 text-white"
                : "rounded-[6px_18px_18px_18px] border border-[#CFE0EF] bg-white px-4 py-3 text-[15px] leading-6 text-[#172033]"
            }
          >
            {!isUser && (
              <div className="mb-2 flex items-center gap-2 text-[11px] font-medium text-[#52657A]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#62A9DC]" />
                ShopAssist
              </div>
            )}
            <p className="whitespace-pre-wrap break-words">{message.content}</p>
          </div>
          {timestamp && (
            <p className={`mt-1.5 text-[11px] text-[#64748B] ${isUser ? "text-right" : "text-left"}`}>
              {timestamp}
            </p>
          )}
          {!isUser && message.products?.length > 0 && (
            <div className="mt-3 min-w-0">
              <ProductGrid products={message.products} onAddToCart={onAddToCart} />
            </div>
          )}
          {!isUser && message.comparison && (
            <div className="mt-3 min-w-0">
              <ComparisonTable comparison={message.comparison} />
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
