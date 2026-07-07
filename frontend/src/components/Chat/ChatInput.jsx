import { Send } from "lucide-react"
import { useState } from "react"

/**
 * Chat input bar.
 * @param {{isLoading: boolean, onSendMessage: Function}} props
 */
export default function ChatInput({ isLoading, onSendMessage }) {
  const [value, setValue] = useState("")

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!value.trim() || isLoading) return

    onSendMessage(value)
    setValue("")
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-[#2E2E2E] bg-[#1A1A1A] p-3 sm:p-4"
    >
      <div className="flex items-end gap-2 rounded-lg border border-[#2E2E2E] bg-[#242424] p-2">
        <textarea
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault()
              handleSubmit(event)
            }
          }}
          rows={1}
          placeholder="Nhập câu hỏi về sản phẩm..."
          className="max-h-28 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-[15px] text-white outline-none placeholder:text-[#888888]"
        />
        <button
          type="submit"
          disabled={isLoading || !value.trim()}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#E31E24] text-white transition hover:bg-[#c9181e] disabled:cursor-not-allowed disabled:bg-[#2E2E2E] disabled:text-[#888888]"
          aria-label="Gửi tin nhắn"
          title="Gửi tin nhắn"
        >
          <Send size={18} />
        </button>
      </div>
    </form>
  )
}
