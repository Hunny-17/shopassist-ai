import { useCallback, useMemo, useState } from "react"

export default function useCart() {
  const [items, setItems] = useState([])
  const [isOpen, setIsOpen] = useState(false)

  const addToCart = useCallback((product, quantity = 1) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.product.id === product.id)
      if (existingItem) {
        return currentItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }

      return [...currentItems, { product, quantity }]
    })
    setIsOpen(true)
  }, [])

  const removeFromCart = useCallback((productId) => {
    setItems((currentItems) => currentItems.filter((item) => item.product.id !== productId))
  }, [])

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId)
      return
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    )
  }, [removeFromCart])

  const clearCart = useCallback(() => setItems([]), [])
  const openCart = useCallback(() => setIsOpen(true), [])
  const closeCart = useCallback(() => setIsOpen(false), [])

  const itemCount = items.reduce((total, item) => total + item.quantity, 0)
  const subtotal = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  )

  return useMemo(
    () => ({
      items,
      isOpen,
      itemCount,
      subtotal,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      openCart,
      closeCart
    }),
    [
      items,
      isOpen,
      itemCount,
      subtotal,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      openCart,
      closeCart
    ]
  )
}
