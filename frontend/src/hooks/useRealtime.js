import { useEffect, useState } from "react"

import { supabase } from "../lib/supabase"

export default function useRealtime() {
  const [updates, setUpdates] = useState({ products: {}, promotions: {} })
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (!supabase) return undefined

    const channel = supabase
      .channel("shopassist-catalog")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products" },
        (payload) => {
          const product = payload.new
          if (!product?.id) return

          setUpdates((currentUpdates) => ({
            ...currentUpdates,
            products: {
              ...currentUpdates.products,
              [product.id]: product
            }
          }))
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "promotions" },
        (payload) => {
          const promotion = payload.new
          if (!promotion?.product_id) return

          setUpdates((currentUpdates) => ({
            ...currentUpdates,
            promotions: {
              ...currentUpdates.promotions,
              [promotion.product_id]: promotion
            }
          }))
        }
      )
      .subscribe((status) => {
        setIsConnected(status === "SUBSCRIBED")
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return { updates, isConnected }
}
