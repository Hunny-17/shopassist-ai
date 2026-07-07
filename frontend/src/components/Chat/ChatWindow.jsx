import MessageBubble from "./MessageBubble"
import TypingIndicator from "./TypingIndicator"
import ChatInput from "./ChatInput"

/**
 * Main chat container.
 * @param {{messages: Array, isLoading: boolean, onSendMessage: Function, onAddToCart: Function}} props
 */
export default function ChatWindow({ messages, isLoading, onSendMessage, onAddToCart }) {
  return (
    <section className="flex min-h-0 flex-1 flex-col bg-[#0F0F0F]">
      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:px-5">
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
