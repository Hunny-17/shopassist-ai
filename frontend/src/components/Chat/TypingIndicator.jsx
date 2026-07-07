export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E31E24] text-xs font-bold text-white">
        PV
      </div>
      <div className="flex w-fit items-center gap-1 rounded-[4px_16px_16px_16px] border border-[#2E2E2E] bg-[#1A1A1A] px-4 py-3">
        <span className="h-2 w-2 animate-bounce rounded-full bg-[#888888]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-[#888888] [animation-delay:120ms]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-[#888888] [animation-delay:240ms]" />
      </div>
    </div>
  )
}
