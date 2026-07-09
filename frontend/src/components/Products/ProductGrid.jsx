import ProductCard from "./ProductCard"

/**
 * Product results grid.
 * @param {{products: Array, onAddToCart: Function}} props
 */
export default function ProductGrid({ products, onAddToCart }) {
  if (!products?.length) return null

  return (
    <div className="grid min-w-0 grid-cols-1 gap-3 2xl:grid-cols-2">
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          rank={index + 1}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  )
}
