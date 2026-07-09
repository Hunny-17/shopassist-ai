/**
 * Product comparison table.
 * @param {{comparison: {products?: Array, rows?: Array, summary?: string}}} props
 */
export default function ComparisonTable({ comparison }) {
  if (!comparison?.products?.length || !comparison?.rows?.length) return null

  return (
    <section className="overflow-hidden rounded-lg border border-[#D6E5F2] bg-white">
      <div className="border-b border-[#D6E5F2] bg-[#EAF5FF] px-3 py-3">
        <p className="text-xs font-medium text-[#0B74BD]">So sánh nhanh</p>
      </div>
      <div className="scrollbar-light overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-sm text-[#172033]">
          <thead className="bg-[#F4F9FD] text-xs text-[#52657A]">
            <tr>
              <th className="w-32 border-b border-[#D6E5F2] px-3 py-3">Tiêu chí</th>
              {comparison.products.map((product) => (
                <th
                  key={product.id}
                  className="min-w-36 border-b border-[#D6E5F2] px-3 py-3"
                >
                  {product.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparison.rows.map((row) => (
              <tr key={row.label} className="border-b border-[#D6E5F2] last:border-b-0">
                <th className="px-3 py-3 text-xs font-medium text-[#52657A]">
                  {row.label}
                </th>
                {row.values.map((value, index) => (
                  <td
                    key={`${row.label}-${index}`}
                    className={
                      row.winner_index === index
                        ? "bg-[#EAF5FF] px-3 py-3 font-mono font-semibold text-[#172033]"
                        : "px-3 py-3 font-mono text-[#172033]"
                    }
                  >
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {comparison.summary && (
        <p className="border-t border-[#D6E5F2] px-3 py-3 text-sm text-[#3F5366]">
          {comparison.summary}
        </p>
      )}
    </section>
  )
}
