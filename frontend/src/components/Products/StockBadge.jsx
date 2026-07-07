const badgeConfig = {
  in_stock: {
    className: "border-[#22C55E]/40 bg-[#22C55E]/10 text-[#22C55E]",
    label: "Còn hàng"
  },
  low_stock: {
    className: "border-[#F59E0B]/40 bg-[#F59E0B]/10 text-[#F59E0B]",
    label: "Sắp hết"
  },
  out_of_stock: {
    className: "border-[#EF4444]/40 bg-[#EF4444]/10 text-[#EF4444]",
    label: "Hết hàng"
  }
}

/**
 * Stock badge.
 * @param {{stock: number, status?: string}} props
 */
export default function StockBadge({ stock = 0, status }) {
  const computedStatus = status || (stock >= 10 ? "in_stock" : stock > 0 ? "low_stock" : "out_of_stock")
  const config = badgeConfig[computedStatus] || badgeConfig.out_of_stock
  const label = computedStatus === "low_stock" ? `Còn ${stock} cái` : config.label

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${config.className}`}
    >
      {label}
    </span>
  )
}
