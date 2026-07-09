import { Info, ShoppingCart, Tag } from "lucide-react"
import { useState } from "react"

import StockBadge from "./StockBadge"

function formatVnd(value) {
  if (value === undefined || value === null) return ""
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0
  }).format(value)
}

/**
 * Hero recommendation card for the first matching product.
 * @param {{product: object, onAddToCart: Function}} props
 */
export default function FeaturedProductCard({ product, onAddToCart }) {
  const [imageFailed, setImageFailed] = useState(false)
  const summary = product.specs_summary || {}
  const promoLabel = product.promotion?.label

  return (
    <article className="overflow-hidden rounded-lg border border-[#0B74BD] bg-white">
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <p className="rounded-full bg-[#EAF5FF] px-2.5 py-1 text-[11px] font-bold uppercase text-[#0B74BD]">
            Phù hợp nhất
          </p>
          <span className="rounded-full bg-[#F1F6FA] px-2.5 py-1 text-[11px] font-medium text-[#52657A]">
            Gợi ý #1
          </span>
        </div>

        <div className="mt-3 flex gap-3">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#EAF5FF]">
            {product.image_url && !imageFailed ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="h-full w-full object-contain p-2"
                loading="lazy"
                onError={() => setImageFailed(true)}
              />
            ) : (
              <span className="px-3 text-center text-sm font-semibold text-[#0B74BD]">
                {product.brand}
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-[#52657A]">{product.brand} · {product.category}</p>
            <h3 className="mt-1 line-clamp-2 text-[15px] font-semibold leading-5 text-[#172033]">
              {product.name}
            </h3>
            <div className="mt-2 flex flex-wrap items-baseline gap-2">
              <span className="text-[20px] font-bold leading-none text-[#0B74BD]">
                {formatVnd(product.price)}
              </span>
              {product.original_price && product.original_price > product.price && (
                <span className="text-xs text-[#94A3B8] line-through">
                  {formatVnd(product.original_price)}
                </span>
              )}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <StockBadge stock={product.stock} status={product.stock_status} />
              {promoLabel && (
                <span className="inline-flex items-center gap-1 rounded-md border border-[#F59E0B]/30 bg-[#FFFBEB] px-2.5 py-1 text-xs font-medium text-[#92400E]">
                  <Tag size={12} />
                  {promoLabel}
                </span>
              )}
            </div>
          </div>
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-2 text-xs text-[#52657A]">
          {summary.cpu && (
            <div className="rounded-md border border-[#D6E5F2] bg-[#F4F9FD] p-2">
              <dt className="font-semibold text-[#172033]">CPU</dt>
              <dd className="mt-1 truncate font-mono">{summary.cpu}</dd>
            </div>
          )}
          {summary.gpu && (
            <div className="rounded-md border border-[#D6E5F2] bg-[#F4F9FD] p-2">
              <dt className="font-semibold text-[#172033]">GPU</dt>
              <dd className="mt-1 truncate font-mono">{summary.gpu}</dd>
            </div>
          )}
          {summary.ram && (
            <div className="rounded-md border border-[#D6E5F2] bg-[#F4F9FD] p-2">
              <dt className="font-semibold text-[#172033]">RAM</dt>
              <dd className="mt-1 truncate font-mono">{summary.ram}</dd>
            </div>
          )}
          {summary.screen && (
            <div className="rounded-md border border-[#D6E5F2] bg-[#F4F9FD] p-2">
              <dt className="font-semibold text-[#172033]">Màn hình</dt>
              <dd className="mt-1 truncate font-mono">{summary.screen}</dd>
            </div>
          )}
        </dl>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={() => onAddToCart(product)}
            disabled={product.stock === 0 || product.stock_status === "out_of_stock"}
            className="flex min-w-0 flex-1 items-center justify-center gap-2 rounded-md bg-[#0B74BD] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#075F9D] disabled:cursor-not-allowed disabled:bg-[#E5E7EB] disabled:text-[#9CA3AF]"
          >
            <ShoppingCart size={16} />
            Thêm vào giỏ
          </button>
          <button
            type="button"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-[#CFE1F1] bg-white text-[#334155] transition hover:border-[#0B74BD] hover:text-[#0B74BD]"
            aria-label="Xem chi tiết"
            title="Xem chi tiết"
          >
            <Info size={16} />
          </button>
        </div>
      </div>
    </article>
  )
}
