import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { resolveImageUrl } from "../lib/api.js";
import { formatCurrency, getStockLabel } from "../lib/format.js";

function ProductCard({ product }) {
  const { addItem } = useCart();
  const stockState = product.stock > 0 ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700";

  const handleAddToCart = () => {
    const result = addItem(product, 1);

    if (!result.added) {
      toast.error("This item is already at the available stock limit.");
      return;
    }

    toast.success(`${product.name} added to cart`);
  };

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[18px] border border-slate-200 bg-white shadow-[0_10px_24px_rgba(15,23,42,0.05)] transition hover:-translate-y-1 sm:rounded-[22px]">
      <Link to={`/products/${product._id}`} className="block">
        <div className="aspect-[4/3] overflow-hidden bg-slate-100 sm:aspect-square">
          <img
            src={resolveImageUrl(product.images?.[0])}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-contain p-1.5 transition duration-500 hover:scale-105 sm:p-2"
          />
        </div>
      </Link>

      <div className="flex flex-1 flex-col justify-between space-y-2 p-2.5 sm:space-y-3 sm:p-3">
        <div className="space-y-1.5 sm:space-y-2">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate whitespace-nowrap text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-500 sm:text-[10px] sm:tracking-[0.18em]">
              {product.category}
            </p>
            <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-medium leading-none sm:px-2 sm:py-1 sm:text-[10px] ${stockState}`}>
              {getStockLabel(product.stock)}
            </span>
          </div>

          <Link
            to={`/products/${product._id}`}
            className="block min-h-[2rem] overflow-hidden font-display text-[13px] font-semibold leading-4 text-slate-900 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] sm:min-h-[2.5rem] sm:text-lg sm:leading-7"
          >
            {product.name}
          </Link>

          <p className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-medium text-slate-600 sm:px-3 sm:py-1 sm:text-xs">
            {product.audience || "All Ages"}
          </p>
        </div>

        <p className="hidden min-h-[4.5rem] text-sm leading-6 text-slate-600 md:block">{product.description}</p>

        <div className="flex items-end justify-between gap-2">
          <div>
            <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400 sm:text-xs sm:tracking-[0.22em]">Price</p>
            <p className="text-[15px] font-semibold leading-none text-slate-900 sm:text-xl">{formatCurrency(product.price)}</p>
            <Link
              to={`/products/${product._id}`}
              className="mt-0.5 block text-[10px] font-medium text-slate-500 hover:text-slate-900 sm:mt-1 sm:text-[11px]"
            >
              More
            </Link>
          </div>
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className="rounded-lg bg-slate-900 px-2.5 py-1.5 text-[10px] font-medium leading-tight text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400 sm:rounded-xl sm:px-4 sm:py-2 sm:text-sm"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
