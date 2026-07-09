export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-3">
      <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0B74BD] text-xs font-semibold text-white">
        AI
      </div>
      <div className="flex w-fit items-center gap-3 rounded-[6px_18px_18px_18px] border border-[#CFE0EF] bg-white px-4 py-3">
        <span className="text-sm text-[#334155]">Đang lọc sản phẩm</span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 animate-bounce rounded-full bg-[#0B74BD]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-[#0B74BD] [animation-delay:120ms]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-[#0B74BD] [animation-delay:240ms]" />
        </span>
      </div>
    </div>
  )
}
