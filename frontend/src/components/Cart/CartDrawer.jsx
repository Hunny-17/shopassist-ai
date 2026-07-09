import { ShoppingBag, X } from "lucide-react"

import CartItem from "./CartItem"

function formatVnd(value) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0
  }).format(value)
}

/**
 * Slide-in cart panel.
 * @param {{cart: object}} props
 */
export default function CartDrawer({ cart }) {
  return (
    <aside
      className={
        cart.isOpen
          ? "fixed inset-y-0 right-0 z-40 flex w-full max-w-sm flex-col border-l border-[#D6E5F2] bg-white shadow-xl transition-transform"
          : "fixed inset-y-0 right-0 z-40 flex w-full max-w-sm translate-x-full flex-col border-l border-[#D6E5F2] bg-white shadow-xl transition-transform"
      }
    >
      <div className="relative flex items-center justify-between overflow-hidden border-b border-[#D6E5F2] px-4 py-4">
        <div className="absolute inset-x-0 top-0 h-1 bg-[#0B74BD]" />
        <div>
          <h2 className="text-lg font-semibold text-[#172033]">Giỏ hàng</h2>
          <p className="text-sm text-[#52657A]">{cart.itemCount} sản phẩm</p>
        </div>
        <button
          type="button"
          onClick={cart.closeCart}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#D6E5F2] bg-white text-[#172033] transition hover:border-[#0B74BD] hover:text-[#0B74BD]"
          aria-label="Đóng giỏ hàng"
          title="Đóng giỏ hàng"
        >
          <X size={18} />
        </button>
      </div>

      <div className="scrollbar-light flex-1 overflow-y-auto bg-[#F4F9FD] p-4">
        {cart.items.length === 0 ? (
          <div className="rounded-lg border border-[#D6E5F2] bg-white p-4 text-sm text-[#52657A]">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#EAF5FF] text-[#0B74BD]">
                <ShoppingBag size={19} />
              </div>
              <div>
                <p className="font-semibold text-[#172033]">Giỏ hàng đang trống</p>
                <p className="mt-1 text-xs leading-5 text-[#52657A]">
                  Thêm một sản phẩm từ card để xem tạm tính tại đây.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {cart.items.map((item) => (
              <CartItem
                key={item.product.id}
                item={item}
                onUpdateQuantity={cart.updateQuantity}
                onRemove={cart.removeFromCart}
              />
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-[#D6E5F2] bg-white p-4">
        <div className="flex items-center justify-between text-sm text-[#52657A]">
          <span>Tạm tính</span>
          <strong className="text-xl text-[#172033]">{formatVnd(cart.subtotal)}</strong>
        </div>
        <button
          type="button"
          disabled={cart.items.length === 0}
          className="mt-4 w-full rounded-md bg-[#0B74BD] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#075F9D] disabled:cursor-not-allowed disabled:bg-[#E5E7EB] disabled:text-[#9CA3AF]"
        >
          Tiếp tục thanh toán
        </button>
      </div>
    </aside>
  )
}
