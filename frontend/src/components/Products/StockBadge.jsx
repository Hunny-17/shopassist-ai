/**
 * Product stock badge.
 * @param {{stock?: number, status?: string}} props
 */
export default function StockBadge({ stock = 0, status }) {
  if (status === "out_of_stock" || stock <= 0) {
    return (
      <span className="rounded-md border border-[#EF4444]/25 bg-[#FEF2F2] px-2.5 py-1 text-xs font-medium text-[#B91C1C]">
        Hết hàng
      </span>
    )
  }

  if (status === "low_stock" || stock < 10) {
    return (
      <span className="rounded-md border border-[#F59E0B]/25 bg-[#FFFBEB] px-2.5 py-1 text-xs font-medium text-[#92400E]">
        Còn {stock} cái
      </span>
    )
  }

  return (
    <span className="rounded-md border border-[#22C55E]/25 bg-[#F0FDF4] px-2.5 py-1 text-xs font-medium text-[#166534]">
      Còn hàng
    </span>
  )
}
