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
      className="border-t border-[#D6E5F2] bg-white p-3 sm:p-4"
    >
      <div className="rounded-lg border border-[#D6E5F2] bg-white p-2 transition focus-within:border-[#0B74BD]/60">
        <div className="flex items-end gap-2">
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
            placeholder="Bạn cần tìm sản phẩm nào?"
            className="max-h-28 min-h-9 min-w-0 flex-1 resize-none overflow-hidden bg-transparent px-2 py-2 text-[15px] leading-5 text-[#172033] outline-none placeholder:text-[#64748B]"
          />
          <button
            type="submit"
            disabled={isLoading || !value.trim()}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0B74BD] text-white transition hover:bg-[#075F9D] disabled:cursor-not-allowed disabled:bg-[#E5E7EB] disabled:text-[#94A3B8]"
            aria-label="Gửi tin nhắn"
            title="Gửi tin nhắn"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </form>
  )
}
