import { Minus, Plus, Trash2 } from "lucide-react"

function formatVnd(value) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0
  }).format(value)
}

/**
 * Cart drawer item.
 * @param {{item: object, onUpdateQuantity: Function, onRemove: Function}} props
 */
export default function CartItem({ item, onUpdateQuantity, onRemove }) {
  const { product, quantity } = item

  return (
    <article className="rounded-lg border border-[#D6E5F2] bg-white p-3">
      <div className="flex gap-3">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-md border border-[#D6E5F2] bg-[#EEF6FC]">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <span className="text-[11px] font-bold text-[#0B74BD]">{product.brand}</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-sm font-semibold text-[#172033]">{product.name}</h3>
          <p className="mt-1 text-sm font-semibold text-[#0B74BD]">{formatVnd(product.price)}</p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center rounded-md border border-[#D6E5F2] bg-[#F4F9FD]">
          <button
            type="button"
            onClick={() => onUpdateQuantity(product.id, quantity - 1)}
            className="flex h-8 w-8 items-center justify-center text-[#172033] hover:text-[#0B74BD]"
            aria-label="Giảm số lượng"
            title="Giảm số lượng"
          >
            <Minus size={14} />
          </button>
          <span className="min-w-8 text-center text-sm text-[#172033]">{quantity}</span>
          <button
            type="button"
            onClick={() => onUpdateQuantity(product.id, quantity + 1)}
            className="flex h-8 w-8 items-center justify-center text-[#172033] hover:text-[#0B74BD]"
            aria-label="Tăng số lượng"
            title="Tăng số lượng"
          >
            <Plus size={14} />
          </button>
        </div>
        <button
          type="button"
          onClick={() => onRemove(product.id)}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-[#D6E5F2] text-[#52657A] hover:border-[#EF4444] hover:text-[#EF4444]"
          aria-label="Xóa sản phẩm"
          title="Xóa sản phẩm"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </article>
  )
}
