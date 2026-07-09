import MessageBubble from "./MessageBubble"
import TypingIndicator from "./TypingIndicator"
import ChatInput from "./ChatInput"

const quickPrompts = [
  "Laptop gaming 20-25 triệu",
  "So sánh ASUS TUF với MSI Katana",
  "Màn hình làm việc ban đêm"
]

/**
 * Main chat container.
 * @param {{messages: Array, isLoading: boolean, onSendMessage: Function, onAddToCart: Function}} props
 */
export default function ChatWindow({ messages, isLoading, onSendMessage, onAddToCart }) {
  return (
    <section className="flex min-h-0 min-w-0 flex-1 flex-col overflow-x-hidden bg-white">
      <div className="border-b border-[#D6E5F2] bg-[#F4F9FD] px-4 py-3 sm:px-5">
        <div className="scrollbar-none flex min-w-0 items-center gap-2 overflow-x-auto">
          <span className="shrink-0 text-xs font-medium text-[#0B74BD]">Gợi ý</span>
          {quickPrompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => onSendMessage(prompt)}
              disabled={isLoading}
              className="shrink-0 rounded-full border border-[#CFE1F1] bg-[#EAF5FF] px-3 py-1.5 text-xs font-medium text-[#075F9D] transition hover:border-[#0B74BD]/45 hover:bg-white hover:text-[#0B74BD] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      <div className="scrollbar-light min-w-0 flex-1 space-y-5 overflow-y-auto overflow-x-hidden bg-[#EEF6FC] px-4 py-5 sm:px-6">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            onAddToCart={onAddToCart}
          />
        ))}
        {isLoading && <TypingIndicator />}
      </div>
      <ChatInput isLoading={isLoading} onSendMessage={onSendMessage} />
    </section>
  )
}
