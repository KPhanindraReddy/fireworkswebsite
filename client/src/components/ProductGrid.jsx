import EmptyState from "./EmptyState.jsx";
import ProductCard from "./ProductCard.jsx";

function ProductGrid({ products, emptyTitle, emptyDescription }) {
  if (!products.length) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        actionLabel="Browse all products"
        actionTo="/products"
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}

export default ProductGrid;
