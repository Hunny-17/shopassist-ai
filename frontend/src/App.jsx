import { RotateCcw, ShoppingCart, Wifi, WifiOff } from "lucide-react"
import { useMemo } from "react"

import AnalyticsDashboard from "./components/Analytics/AnalyticsDashboard"
import CartDrawer from "./components/Cart/CartDrawer"
import ChatWindow from "./components/Chat/ChatWindow"
import ProductGrid from "./components/Products/ProductGrid"
import useCart from "./hooks/useCart"
import useChat from "./hooks/useChat"
import useRealtime from "./hooks/useRealtime"

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
    <main className="min-h-screen bg-[#0F0F0F] text-white">
      <div className="mx-auto flex h-screen max-w-7xl flex-col border-x border-[#2E2E2E] bg-[#0F0F0F]">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#2E2E2E] bg-[#1A1A1A] px-4 sm:px-5">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[#E31E24]" />
              <h1 className="truncate text-lg font-bold text-white">ShopAssist AI</h1>
            </div>
            <p className="mt-0.5 hidden text-xs text-[#888888] sm:block">
              Phong Vũ conversational sales agent
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-1 rounded-full border border-[#2E2E2E] px-3 py-1 text-xs text-[#888888] sm:flex">
              {realtime.isConnected ? <Wifi size={13} /> : <WifiOff size={13} />}
              {realtime.isConnected ? "Realtime" : "Local"}
            </span>
            <button
              type="button"
              onClick={chat.clearChat}
              className="flex h-9 w-9 items-center justify-center rounded-md border border-[#2E2E2E] text-white transition hover:border-[#E31E24] hover:text-[#E31E24]"
              aria-label="Làm mới hội thoại"
              title="Làm mới hội thoại"
            >
              <RotateCcw size={17} />
            </button>
            <button
              type="button"
              onClick={cart.openCart}
              className="relative flex h-9 w-9 items-center justify-center rounded-md bg-[#E31E24] text-white transition hover:bg-[#c9181e]"
              aria-label="Mở giỏ hàng"
              title="Mở giỏ hàng"
            >
              <ShoppingCart size={17} />
              {cart.itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border border-[#0F0F0F] bg-white px-1 text-[11px] font-bold text-[#E31E24]">
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

          <aside className="hidden min-h-0 w-[40%] flex-col border-l border-[#2E2E2E] bg-[#111111] lg:flex">
            <div className="border-b border-[#2E2E2E] px-5 py-4">
              <h2 className="text-lg font-bold text-white">Sản phẩm gợi ý</h2>
              <p className="mt-1 text-sm text-[#888888]">
                Cards cập nhật theo phản hồi mới nhất của agent.
              </p>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-5">
              {latestProducts.length > 0 ? (
                <ProductGrid products={latestProducts} onAddToCart={cart.addToCart} />
              ) : (
                <div className="rounded-xl border border-[#2E2E2E] bg-[#1A1A1A] p-4 text-sm text-[#888888]">
                  Hỏi thử: laptop gaming 20 triệu, màn hình làm việc ban đêm, hoặc chuột wireless dưới 700k.
                </div>
              )}
            </div>
            <div className="border-t border-[#2E2E2E] p-5">
              <AnalyticsDashboard />
            </div>
          </aside>
        </div>
      </div>

      <CartDrawer cart={cart} />
    </main>
  )
}
