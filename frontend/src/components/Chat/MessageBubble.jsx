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
    <article className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`flex max-w-full gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
        {!isUser && (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E31E24] text-xs font-bold text-white">
            PV
          </div>
        )}
        <div className={isUser ? "max-w-[78vw] sm:max-w-[70%]" : "max-w-[92vw] sm:max-w-[88%]"}>
          <div
            className={
              isUser
                ? "rounded-[16px_4px_16px_16px] bg-[#E31E24] px-4 py-3 text-[15px] leading-6 text-white"
                : "rounded-[4px_16px_16px_16px] border border-[#2E2E2E] bg-[#1A1A1A] px-4 py-3 text-[15px] leading-6 text-white"
            }
          >
            <p className="whitespace-pre-wrap break-words">{message.content}</p>
          </div>
          {timestamp && (
            <p className={`mt-1 text-[11px] text-[#888888] ${isUser ? "text-right" : "text-left"}`}>
              {timestamp}
            </p>
          )}
          {!isUser && message.products?.length > 0 && (
            <div className="mt-3">
              <ProductGrid products={message.products} onAddToCart={onAddToCart} />
            </div>
          )}
          {!isUser && message.comparison && (
            <div className="mt-3">
              <ComparisonTable comparison={message.comparison} />
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
