import { X } from "lucide-react"

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
          ? "fixed inset-y-0 right-0 z-40 flex w-full max-w-sm flex-col border-l border-[#2E2E2E] bg-[#0F0F0F] shadow-2xl transition-transform"
          : "fixed inset-y-0 right-0 z-40 flex w-full max-w-sm translate-x-full flex-col border-l border-[#2E2E2E] bg-[#0F0F0F] shadow-2xl transition-transform"
      }
    >
      <div className="flex items-center justify-between border-b border-[#2E2E2E] px-4 py-4">
        <div>
          <h2 className="text-lg font-bold text-white">Giỏ hàng</h2>
          <p className="text-sm text-[#888888]">{cart.itemCount} sản phẩm</p>
        </div>
        <button
          type="button"
          onClick={cart.closeCart}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-[#2E2E2E] text-white transition hover:border-[#E31E24] hover:text-[#E31E24]"
          aria-label="Đóng giỏ hàng"
          title="Đóng giỏ hàng"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {cart.items.length === 0 ? (
          <div className="rounded-xl border border-[#2E2E2E] bg-[#1A1A1A] p-4 text-sm text-[#888888]">
            Giỏ hàng đang trống.
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

      <div className="border-t border-[#2E2E2E] p-4">
        <div className="flex items-center justify-between text-sm text-[#888888]">
          <span>Tạm tính</span>
          <strong className="text-xl text-white">{formatVnd(cart.subtotal)}</strong>
        </div>
        <button
          type="button"
          disabled={cart.items.length === 0}
          className="mt-4 w-full rounded-md bg-[#E31E24] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#c9181e] disabled:cursor-not-allowed disabled:bg-[#2E2E2E] disabled:text-[#888888]"
        >
          Tiếp tục thanh toán
        </button>
      </div>
    </aside>
  )
}
