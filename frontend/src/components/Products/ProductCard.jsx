import { ShoppingCart } from "lucide-react"

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
 * @param {{product: object, onAddToCart: Function}} props
 */
export default function ProductCard({ product, onAddToCart }) {
  const summary = product.specs_summary || {}
  const promoLabel = product.promotion?.label

  return (
    <article className="rounded-xl border border-[#2E2E2E] bg-[#1A1A1A] p-4">
      <div className="flex gap-4">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#2E2E2E] bg-[#242424]">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <span className="text-xs font-bold text-[#888888]">{product.brand}</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] uppercase tracking-normal text-[#888888]">
            {product.brand}
          </p>
          <h3 className="mt-1 line-clamp-2 text-[17px] font-bold leading-6 text-white">
            {product.name}
          </h3>
          <div className="mt-2 flex flex-wrap items-baseline gap-2">
            <span className="text-[22px] font-bold text-[#E31E24]">
              {formatVnd(product.price)}
            </span>
            {product.original_price && product.original_price > product.price && (
              <span className="text-sm text-[#888888] line-through">
                {formatVnd(product.original_price)}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <StockBadge stock={product.stock} status={product.stock_status} />
        {promoLabel && (
          <span className="rounded-full border border-[#E31E24]/60 bg-[#E31E24]/10 px-3 py-1 text-xs font-medium text-[#E31E24]">
            {promoLabel}
          </span>
        )}
      </div>

      <dl className="mt-3 grid grid-cols-1 gap-1 text-[13px] text-[#888888]">
        {summary.cpu && (
          <div className="flex gap-2">
            <dt className="w-14 shrink-0 text-[#FFFFFF]">CPU</dt>
            <dd className="min-w-0 truncate font-mono">{summary.cpu}</dd>
          </div>
        )}
        {summary.ram && (
          <div className="flex gap-2">
            <dt className="w-14 shrink-0 text-[#FFFFFF]">RAM</dt>
            <dd className="min-w-0 truncate font-mono">{summary.ram}</dd>
          </div>
        )}
        {summary.gpu && (
          <div className="flex gap-2">
            <dt className="w-14 shrink-0 text-[#FFFFFF]">GPU</dt>
            <dd className="min-w-0 truncate font-mono">{summary.gpu}</dd>
          </div>
        )}
        {summary.screen && (
          <div className="flex gap-2">
            <dt className="w-14 shrink-0 text-[#FFFFFF]">Màn</dt>
            <dd className="min-w-0 truncate font-mono">{summary.screen}</dd>
          </div>
        )}
      </dl>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          className="flex-1 rounded-md border border-[#2E2E2E] px-3 py-2 text-sm font-medium text-white transition hover:border-[#E31E24] hover:text-[#E31E24]"
        >
          Xem chi tiết
        </button>
        <button
          type="button"
          onClick={() => onAddToCart(product)}
          disabled={product.stock === 0 || product.stock_status === "out_of_stock"}
          className="flex flex-1 items-center justify-center gap-2 rounded-md bg-[#E31E24] px-3 py-2 text-sm font-bold text-white transition hover:bg-[#c9181e] disabled:cursor-not-allowed disabled:bg-[#2E2E2E] disabled:text-[#888888]"
        >
          <ShoppingCart size={16} />
          Thêm
        </button>
      </div>
    </article>
  )
}
