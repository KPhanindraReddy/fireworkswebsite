import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import QuantitySelector from "../components/QuantitySelector.jsx";
import { PageSpinner } from "../components/LoadingState.jsx";
import { useCart } from "../context/CartContext.jsx";
import { fetchProductById, resolveImageUrl } from "../lib/api.js";
import { formatCurrency, getStockLabel } from "../lib/format.js";

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadProduct = async () => {
      try {
        setLoading(true);
        const data = await fetchProductById(id);

        if (isMounted) {
          setProduct(data);
          setQuantity(data.stock > 0 ? 1 : 0);
        }
      } catch (requestError) {
        if (isMounted) {
          setError(requestError.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProduct();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleAdd = (goToCheckout = false) => {
    if (!product || quantity < 1) {
      return;
    }

    const result = addItem(product, quantity);

    if (!result.added) {
      toast.error("You have reached the available stock limit for this item.");
      return;
    }

    toast.success(`${product.name} added to cart`);

    if (goToCheckout) {
      navigate("/checkout");
    }
  };

  if (loading) {
    return <PageSpinner label="Loading product" />;
  }

  if (error || !product) {
    return (
      <div className="rounded-[30px] border border-rose-300 bg-rose-50 p-6 text-rose-700">
        {error || "Product could not be loaded."}
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-24 lg:pb-10">
      <div className="text-sm text-slate-500">
        <Link to="/products" className="hover:text-slate-900">
          Products
        </Link>
        <span className="mx-2">/</span>
        <span>{product.name}</span>
      </div>

      <section className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
          <img src={resolveImageUrl(product.images?.[0])} alt={product.name} className="h-full w-full object-cover" />
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">{product.category}</p>
            <h1 className="mt-3 font-display text-4xl font-semibold text-slate-900 sm:text-5xl">{product.name}</h1>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
                {formatCurrency(product.price)}
              </span>
              <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
                {product.audience || "All Ages"}
              </span>
              <span
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  product.stock > 0 ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                }`}
              >
                {getStockLabel(product.stock)}
              </span>
            </div>
          </div>

          <p className="text-base leading-8 text-slate-600">{product.description}</p>

          <div className="surface-panel rounded-[28px] border border-slate-200 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Product details</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Audience</p>
                <p className="mt-2 text-base font-semibold text-slate-900">{product.audience || "All Ages"}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Pack size</p>
                <p className="mt-2 text-base font-semibold text-slate-900">{product.specs?.packSize || "Standard pack"}</p>
              </div>
            </div>
          </div>

          <div className="hidden gap-4 rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.05)] md:flex md:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Quantity</p>
              <div className="mt-3">
                <QuantitySelector
                  value={quantity}
                  onDecrease={() => setQuantity((current) => Math.max(1, current - 1))}
                  onIncrease={() => setQuantity((current) => Math.min(product.stock, current + 1))}
                  disabled={product.stock <= 0}
                />
              </div>
            </div>
            <div className="ml-auto flex flex-col gap-3 lg:flex-row">
              <button type="button" onClick={() => handleAdd(false)} className="warm-button" disabled={product.stock <= 0}>
                Add to Cart
              </button>
              <button type="button" onClick={() => handleAdd(true)} className="ghost-button" disabled={product.stock <= 0}>
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="fixed inset-x-4 bottom-24 z-30 rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur lg:hidden">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Quantity</p>
            <div className="mt-2">
              <QuantitySelector
                compact
                value={quantity}
                onDecrease={() => setQuantity((current) => Math.max(1, current - 1))}
                onIncrease={() => setQuantity((current) => Math.min(product.stock, current + 1))}
                disabled={product.stock <= 0}
              />
            </div>
          </div>
          <button type="button" onClick={() => handleAdd(false)} className="warm-button" disabled={product.stock <= 0}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;
