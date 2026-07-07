const metrics = [
  ["Conversations", "247"],
  ["Conversion", "18.3%"],
  ["Avg session", "4m 32s"],
  ["Top query", "laptop gaming"],
  ["Auto handled", "89"]
]

export default function AnalyticsDashboard() {
  return (
    <section className="rounded-xl border border-[#2E2E2E] bg-[#1A1A1A] p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-bold text-white">Analytics</h2>
        <span className="rounded-full bg-[#22C55E]/10 px-2 py-1 text-[11px] font-medium text-[#22C55E]">
          Hôm nay
        </span>
      </div>
      <dl className="space-y-2">
        {metrics.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-3 text-sm">
            <dt className="text-[#888888]">{label}</dt>
            <dd className="truncate font-bold text-white">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
