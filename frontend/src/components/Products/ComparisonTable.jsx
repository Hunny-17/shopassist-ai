/**
 * Product comparison table.
 * @param {{comparison: {products?: Array, rows?: Array, summary?: string}}} props
 */
export default function ComparisonTable({ comparison }) {
  if (!comparison?.products?.length || !comparison?.rows?.length) return null

  return (
    <section className="overflow-hidden rounded-xl border border-[#2E2E2E] bg-[#1A1A1A]">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-sm text-white">
          <thead className="bg-[#242424] text-xs uppercase tracking-normal text-[#888888]">
            <tr>
              <th className="w-32 border-b border-[#2E2E2E] px-3 py-3">Tiêu chí</th>
              {comparison.products.map((product) => (
                <th
                  key={product.id}
                  className="min-w-36 border-b border-[#2E2E2E] px-3 py-3"
                >
                  {product.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparison.rows.map((row) => (
              <tr key={row.label} className="border-b border-[#2E2E2E] last:border-b-0">
                <th className="px-3 py-3 text-xs font-medium text-[#888888]">
                  {row.label}
                </th>
                {row.values.map((value, index) => (
                  <td
                    key={`${row.label}-${index}`}
                    className={
                      row.winner_index === index
                        ? "bg-[#E31E24]/10 px-3 py-3 font-mono text-white"
                        : "px-3 py-3 font-mono text-white"
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
        <p className="border-t border-[#2E2E2E] px-3 py-3 text-sm text-[#888888]">
          {comparison.summary}
        </p>
      )}
    </section>
  )
}
