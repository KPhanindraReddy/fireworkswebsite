import { Link } from "react-router-dom";
import EmptyState from "../components/EmptyState.jsx";
import QuantitySelector from "../components/QuantitySelector.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import { useCart } from "../context/CartContext.jsx";
import { resolveImageUrl } from "../lib/api.js";
import { formatCurrency } from "../lib/format.js";

function CartPage() {
  const { cartItems, cartSubtotal, updateQuantity, removeItem } = useCart();

  if (!cartItems.length) {
    return (
      <EmptyState
        title="Your cart is empty"
        description="Start with rockets, sparklers, fountains, or a combo pack. Added items will stay visible here."
        actionLabel="Shop fireworks"
        actionTo="/products"
      />
    );
  }

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Cart"
        title="Review items before checkout"
        description="Update quantities, remove anything you do not need, and continue to the quick COD checkout."
      />

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          {cartItems.map((item) => (
            <article
              key={item._id}
              className="surface-panel grid gap-4 rounded-[30px] border border-white/50 p-4 shadow-glow sm:grid-cols-[8rem_1fr]"
            >
              <img
                src={resolveImageUrl(item.image)}
                alt={item.name}
                className="aspect-square w-full rounded-[24px] object-cover"
              />

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="font-display text-2xl font-bold text-slate-900">{item.name}</h2>
                    <p className="mt-2 text-sm text-slate-500">{formatCurrency(item.price)} each</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item._id)}
                    className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
                  >
                    Remove
                  </button>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <QuantitySelector
                    value={item.quantity}
                    onDecrease={() => updateQuantity(item._id, item.quantity - 1)}
                    onIncrease={() => updateQuantity(item._id, item.quantity + 1)}
                  />
                  <p className="text-xl font-bold text-slate-900">{formatCurrency(item.price * item.quantity)}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <aside className="surface-panel h-fit rounded-[30px] border border-white/50 p-6 shadow-glow">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-600">Order summary</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-slate-900">Checkout total</h2>

          <div className="mt-6 space-y-4 text-sm text-slate-600">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-900">{formatCurrency(cartSubtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Payment method</span>
              <span className="font-semibold text-slate-900">Cash on Delivery</span>
            </div>
          </div>

          <Link to="/checkout" className="warm-button mt-6 block text-center">
            Proceed to Checkout
          </Link>
          <Link
            to="/products"
            className="mt-3 block rounded-2xl border border-slate-300 px-5 py-3 text-center font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}

export default CartPage;
