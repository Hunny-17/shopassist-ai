import { Activity, TrendingUp } from "lucide-react"

const metrics = [
  ["Conversations", "247"],
  ["Conversion", "18.3%"],
  ["Avg session", "4m 32s"],
  ["Top query", "laptop gaming"],
  ["Auto handled", "89"]
]

export default function AnalyticsDashboard() {
  return (
    <section className="rounded-lg border border-[#E5E7EB] bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#EAF5FF] text-[#0B74BD]">
            <Activity size={16} />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#172033]">Analytics</h2>
            <p className="text-xs text-[#6B7280]">Demo retail signals</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-[#DCFCE7] px-2 py-1 text-[11px] font-medium text-[#15803D]">
          <TrendingUp size={12} />
          Hôm nay
        </span>
      </div>
      <dl className="grid grid-cols-2 gap-2">
        {metrics.map(([label, value]) => (
          <div key={label} className="rounded-md border border-[#E5E7EB] bg-[#F9FAFB] p-2">
            <dt className="truncate text-[11px] text-[#6B7280]">{label}</dt>
            <dd className="mt-1 truncate text-sm font-bold text-[#172033]">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
