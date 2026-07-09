import { ChevronRight, ShoppingCart, Tag } from "lucide-react"
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
 * Inline product card.
 * @param {{product: object, rank?: number, onAddToCart: Function}} props
 */
export default function ProductCard({ product, rank, onAddToCart }) {
  const [imageFailed, setImageFailed] = useState(false)
  const summary = product.specs_summary || {}
  const promoLabel = product.promotion?.label
  const discount =
    product.original_price && product.original_price > product.price
      ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
      : 0

  return (
    <article className="group min-w-0 overflow-hidden rounded-lg border border-[#D6E5F2] bg-white transition-colors hover:border-[#0B74BD]/45">
      <div className="p-4">
        <div className="flex min-w-0 gap-3 sm:gap-4">
          <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#EAF5FF]">
            {rank && (
              <span className="absolute left-2 top-2 rounded-md border border-[#D6E5F2] bg-white/95 px-1.5 py-0.5 text-[10px] font-semibold text-[#0B74BD]">
                #{rank}
              </span>
            )}
            {product.image_url && !imageFailed ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="h-full w-full object-cover"
                loading="lazy"
                onError={() => setImageFailed(true)}
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center bg-[#EAF5FF] px-2 text-center text-xs font-bold uppercase text-[#0B74BD]">
                {product.brand}
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-[12px] font-medium text-[#52657A]">
                {product.brand}
              </p>
              <span className="shrink-0 rounded-md border border-[#D6E5F2] bg-[#F4F9FD] px-2 py-0.5 text-[11px] text-[#3F5366]">
                {product.category}
              </span>
            </div>
            <h3 className="mt-1 line-clamp-2 text-[16px] font-semibold leading-6 text-[#172033]">
              {product.name}
            </h3>
            <div className="mt-2 flex flex-wrap items-baseline gap-2">
              <span className="text-[20px] font-semibold text-[#0B74BD] sm:text-[22px]">
                {formatVnd(product.price)}
              </span>
              {product.original_price && product.original_price > product.price && (
                <span className="text-sm text-[#9CA3AF] line-through">
                  {formatVnd(product.original_price)}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <StockBadge stock={product.stock} status={product.stock_status} />
          {discount > 0 && (
            <span className="rounded-md border border-[#0B74BD]/20 bg-[#EAF5FF] px-2.5 py-1 text-xs font-semibold text-[#0B74BD]">
              -{discount}%
            </span>
          )}
          {promoLabel && (
            <span className="inline-flex items-center gap-1 rounded-md border border-[#F59E0B]/30 bg-[#FFFBEB] px-2.5 py-1 text-xs font-medium text-[#92400E]">
              <Tag size={12} />
              {promoLabel}
            </span>
          )}
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-2 text-[12px] text-[#52657A]">
          {summary.cpu && (
            <div className="rounded-md border border-[#D6E5F2] bg-[#F4F9FD] p-2">
              <dt className="font-semibold text-[#172033]">CPU</dt>
              <dd className="mt-1 truncate font-mono">{summary.cpu}</dd>
            </div>
          )}
          {summary.ram && (
            <div className="rounded-md border border-[#D6E5F2] bg-[#F4F9FD] p-2">
              <dt className="font-semibold text-[#172033]">RAM</dt>
              <dd className="mt-1 truncate font-mono">{summary.ram}</dd>
            </div>
          )}
          {summary.gpu && (
            <div className="rounded-md border border-[#D6E5F2] bg-[#F4F9FD] p-2">
              <dt className="font-semibold text-[#172033]">GPU</dt>
              <dd className="mt-1 truncate font-mono">{summary.gpu}</dd>
            </div>
          )}
          {summary.screen && (
            <div className="rounded-md border border-[#D6E5F2] bg-[#F4F9FD] p-2">
              <dt className="font-semibold text-[#172033]">Màn</dt>
              <dd className="mt-1 truncate font-mono">{summary.screen}</dd>
            </div>
          )}
        </dl>

        <div className="mt-4 flex min-w-0 gap-2">
          <button
            type="button"
            className="flex flex-1 items-center justify-center gap-1 rounded-md border border-[#D6E5F2] bg-white px-3 py-2 text-sm font-medium text-[#172033] transition hover:border-[#0B74BD] hover:text-[#0B74BD]"
          >
            Xem chi tiết
            <ChevronRight size={15} />
          </button>
          <button
            type="button"
            onClick={() => onAddToCart(product)}
            disabled={product.stock === 0 || product.stock_status === "out_of_stock"}
            className="flex flex-1 items-center justify-center gap-2 rounded-md bg-[#0B74BD] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#075F9D] disabled:cursor-not-allowed disabled:bg-[#E5E7EB] disabled:text-[#9CA3AF]"
          >
            <ShoppingCart size={16} />
            Thêm
          </button>
        </div>
      </div>
    </article>
  )
}
