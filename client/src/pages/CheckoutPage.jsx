import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import EmptyState from "../components/EmptyState.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import { useCart } from "../context/CartContext.jsx";
import { createOrder } from "../lib/api.js";
import { formatCurrency } from "../lib/format.js";
import { saveRecentOrderId } from "../lib/orderStorage.js";

const initialForm = {
  name: "",
  phone: "",
  address: "",
  pincode: "",
  password: "",
  notes: "",
};

function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, cartSubtotal, clearCart } = useCart();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [, startNavigation] = useTransition();

  if (!cartItems.length) {
    return (
      <EmptyState
        title="Add items before checkout"
        description="Your checkout form will appear here once the cart has at least one product."
        actionLabel="Browse products"
        actionTo="/products"
      />
    );
  }

  const handleChange = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!form.name || !form.phone || !form.address || !form.pincode) {
      return "Please fill in all required delivery details.";
    }

    if (!/^\d{10}$/.test(form.phone)) {
      return "Enter a valid 10-digit mobile number.";
    }

    if (!/^\d{6}$/.test(form.pincode)) {
      return "Enter a valid 6-digit pincode.";
    }

    if (form.password && form.password.length < 6) {
      return "Optional password should be at least 6 characters.";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      setSubmitting(true);

      const order = await createOrder({
        customer: {
          name: form.name,
          phone: form.phone,
          address: form.address,
          pincode: form.pincode,
        },
        password: form.password,
        notes: form.notes,
        items: cartItems.map((item) => ({
          productId: item._id,
          quantity: item.quantity,
        })),
      });

      saveRecentOrderId(order.orderNumber);
      clearCart();
      toast.success("Order placed successfully");

      startNavigation(() => {
        navigate(`/orders/success/${order.orderNumber}`, {
          state: { order },
        });
      });
    } catch (requestError) {
      toast.error(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Checkout"
        title="Fast COD checkout"
        description="Enter delivery details, optionally save a password for later account creation, and place the order."
      />

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="surface-panel rounded-[30px] border border-white/50 p-6 shadow-glow">
            <h2 className="font-display text-2xl font-bold text-slate-900">Delivery details</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="field-label text-slate-700">Full name</label>
                <input
                  value={form.name}
                  onChange={(event) => handleChange("name", event.target.value)}
                  className="input-field"
                  placeholder="Your full name"
                  autoComplete="name"
                />
              </div>

              <div>
                <label className="field-label text-slate-700">Mobile number</label>
                <input
                  type="tel"
                  inputMode="numeric"
                  value={form.phone}
                  onChange={(event) => handleChange("phone", event.target.value.replace(/\D/g, "").slice(0, 10))}
                  className="input-field"
                  placeholder="10-digit mobile number"
                  autoComplete="tel"
                />
              </div>

              <div>
                <label className="field-label text-slate-700">Pincode</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={form.pincode}
                  onChange={(event) => handleChange("pincode", event.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="input-field"
                  placeholder="6-digit pincode"
                  autoComplete="postal-code"
                />
              </div>

              <div className="md:col-span-2">
                <label className="field-label text-slate-700">Address</label>
                <textarea
                  rows="4"
                  value={form.address}
                  onChange={(event) => handleChange("address", event.target.value)}
                  className="input-field"
                  placeholder="House number, street, area, city"
                  autoComplete="street-address"
                />
              </div>
            </div>
          </div>

          <div className="surface-panel rounded-[30px] border border-white/50 p-6 shadow-glow">
            <h2 className="font-display text-2xl font-bold text-slate-900">Optional account setup</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Customers can create an account after ordering by adding a password now. Login is not required for the
              first purchase.
            </p>

            <div className="mt-5 grid gap-4">
              <div>
                <label className="field-label text-slate-700">Optional password</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(event) => handleChange("password", event.target.value)}
                  className="input-field"
                  placeholder="Minimum 6 characters"
                  autoComplete="new-password"
                />
              </div>

              <div>
                <label className="field-label text-slate-700">Order notes</label>
                <textarea
                  rows="3"
                  value={form.notes}
                  onChange={(event) => handleChange("notes", event.target.value)}
                  className="input-field"
                  placeholder="Gate instructions, preferred call time, landmark..."
                />
              </div>
            </div>
          </div>
        </form>

        <aside className="surface-panel h-fit rounded-[30px] border border-white/50 p-6 shadow-glow">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-600">Order summary</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-slate-900">Cash on Delivery</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Payment is collected at delivery. Products and stock are validated again when the order is placed.
          </p>

          <div className="mt-6 space-y-4">
            {cartItems.map((item) => (
              <div key={item._id} className="flex items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <div>
                  <p className="font-semibold text-slate-900">{item.name}</p>
                  <p className="text-sm text-slate-500">Qty {item.quantity}</p>
                </div>
                <p className="font-semibold text-slate-900">{formatCurrency(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between text-lg font-bold text-slate-900">
            <span>Total</span>
            <span>{formatCurrency(cartSubtotal)}</span>
          </div>

          <button type="submit" onClick={handleSubmit} disabled={submitting} className="warm-button mt-6 w-full disabled:opacity-70">
            {submitting ? "Placing order..." : "Place COD Order"}
          </button>
        </aside>
      </div>
    </div>
  );
}

export default CheckoutPage;
