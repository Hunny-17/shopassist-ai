import ProductCard from "./ProductCard"

/**
 * Product results grid.
 * @param {{products: Array, onAddToCart: Function}} props
 */
export default function ProductGrid({ products, onAddToCart }) {
  if (!products?.length) return null

  return (
    <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  )
}
