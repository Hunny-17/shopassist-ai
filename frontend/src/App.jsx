import { BadgeCheck, MessageCircle, RotateCcw, ShoppingCart, Sparkles, Wifi, WifiOff } from "lucide-react"
import { useMemo } from "react"

import CartDrawer from "./components/Cart/CartDrawer"
import ChatWindow from "./components/Chat/ChatWindow"
import FeaturedProductCard from "./components/Products/FeaturedProductCard"
import ProductGrid from "./components/Products/ProductGrid"
import useCart from "./hooks/useCart"
import useChat from "./hooks/useChat"
import useRealtime from "./hooks/useRealtime"

const promptExamples = [
  "Laptop gaming 20-25 triệu",
  "Màn hình làm việc ban đêm",
  "Chuột wireless dưới 700k"
]

function mergeRealtimeProducts(products, updates) {
  return products.map((product) => {
    const productUpdate = updates.products[product.id]
    const promotionUpdate = updates.promotions[product.id]

    if (!productUpdate && !promotionUpdate) return product

    const stock = productUpdate?.stock ?? product.stock
    return {
      ...product,
      ...productUpdate,
      stock,
      stock_status: stock >= 10 ? "in_stock" : stock > 0 ? "low_stock" : "out_of_stock",
      promotion: promotionUpdate || product.promotion
    }
  })
}

export default function App() {
  const chat = useChat()
  const cart = useCart()
  const realtime = useRealtime()

  const latestProducts = useMemo(() => {
    const products = [...chat.messages]
      .reverse()
      .find((message) => message.role === "assistant" && message.products?.length > 0)
      ?.products

    return mergeRealtimeProducts(products || [], realtime.updates)
  }, [chat.messages, realtime.updates])

  return (
    <main className="min-h-screen bg-[#EEF6FC] text-[#172033]">
      <div className="mx-auto flex h-screen max-w-7xl flex-col border-x border-[#D6E5F2] bg-white">
        <header className="relative flex h-20 shrink-0 items-center justify-between overflow-hidden border-b border-[#D6E5F2] bg-white px-4 sm:px-6">
          <div className="absolute inset-x-0 top-0 h-1 bg-[#62A9DC]" />
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#0B74BD]">
                <Sparkles size={21} className="text-white" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="truncate text-lg font-bold text-[#172033] sm:text-xl">ShopAssist AI</h1>
                </div>
                <p className="mt-0.5 hidden text-xs text-[#52657A] sm:block">
                  Tư vấn mua sắm điện tử theo nhu cầu, giá và tồn kho
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-1.5 rounded-full border border-[#D6E5F2] bg-[#F4F9FD] px-3 py-1.5 text-xs text-[#3F5366] sm:flex">
              {realtime.isConnected ? <Wifi size={13} /> : <WifiOff size={13} />}
              {realtime.isConnected ? "Realtime" : "Local"}
            </span>
            <button
              type="button"
              onClick={chat.clearChat}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#D6E5F2] bg-white text-[#172033] transition hover:border-[#0B74BD] hover:text-[#0B74BD]"
              aria-label="Làm mới hội thoại"
              title="Làm mới hội thoại"
            >
              <RotateCcw size={17} />
            </button>
            <button
              type="button"
              onClick={cart.openCart}
              className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-[#0B74BD] text-white transition hover:bg-[#075F9D]"
              aria-label="Mở giỏ hàng"
              title="Mở giỏ hàng"
            >
              <ShoppingCart size={17} />
              {cart.itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border border-white bg-[#EF4444] px-1 text-[11px] font-bold text-white">
                  {cart.itemCount}
                </span>
              )}
            </button>
          </div>
        </header>

        <div className="flex min-h-0 flex-1">
          <div className="flex min-w-0 flex-1 lg:basis-[60%]">
            <ChatWindow
              messages={chat.messages}
              isLoading={chat.isLoading}
              onSendMessage={chat.sendMessage}
              onAddToCart={cart.addToCart}
            />
          </div>

          <aside className="hidden min-h-0 w-[40%] flex-col border-l border-[#D6E5F2] bg-[#F4F9FD] lg:flex">
            <div className="border-b border-[#D6E5F2] bg-white px-5 py-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-medium text-[#0B74BD]">Gợi ý hiện tại</p>
                  <h2 className="mt-1 text-xl font-semibold text-[#172033]">Sản phẩm phù hợp</h2>
                  <p className="mt-1 text-sm leading-5 text-[#52657A]">
                    Danh sách được cập nhật theo cuộc trò chuyện.
                  </p>
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#D6E5F2] bg-[#EAF5FF] text-[#0B74BD]">
                  <BadgeCheck size={19} />
                </div>
              </div>
            </div>
            <div className="scrollbar-light min-h-0 flex-1 overflow-y-auto p-5">
              {latestProducts.length > 0 ? (
                <div className="space-y-3">
                  <FeaturedProductCard product={latestProducts[0]} onAddToCart={cart.addToCart} />
                  {latestProducts.length > 1 && (
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <p className="text-xs font-medium text-[#52657A]">Lựa chọn khác</p>
                        <p className="text-xs text-[#64748B]">{latestProducts.length - 1} sản phẩm</p>
                      </div>
                      <ProductGrid products={latestProducts.slice(1)} onAddToCart={cart.addToCart} />
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-lg border border-[#D6E5F2] bg-white p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#0B74BD] text-white">
                      <MessageCircle size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#172033]">Bắt đầu bằng nhu cầu mua sắm</p>
                      <p className="mt-1 text-xs leading-5 text-[#52657A]">
                        Sản phẩm sẽ xuất hiện ở đây sau câu trả lời đầu tiên.
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {promptExamples.map((prompt) => (
                      <span
                        key={prompt}
                        className="rounded-full border border-[#D6E5F2] bg-[#F4F9FD] px-3 py-1.5 text-xs text-[#334155]"
                      >
                        {prompt}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>

      <CartDrawer cart={cart} />
    </main>
  )
}
