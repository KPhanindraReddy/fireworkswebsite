import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { PageSpinner } from "../components/LoadingState.jsx";
import { fetchOrderById } from "../lib/api.js";
import { formatCurrency, formatDate, getStatusClasses } from "../lib/format.js";

function OrderSuccessPage() {
  const location = useLocation();
  const { orderId } = useParams();
  const [order, setOrder] = useState(location.state?.order ?? null);
  const [loading, setLoading] = useState(!location.state?.order);
  const [error, setError] = useState("");

  useEffect(() => {
    if (order) {
      return undefined;
    }

    let isMounted = true;

    const loadOrder = async () => {
      try {
        setLoading(true);
        const data = await fetchOrderById(orderId);

        if (isMounted) {
          setOrder(data);
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

    loadOrder();
    return () => {
      isMounted = false;
    };
  }, [order, orderId]);

  if (loading) {
    return <PageSpinner label="Loading order confirmation" />;
  }

  if (error || !order) {
    return <div className="rounded-[30px] border border-rose-400/30 bg-rose-500/10 p-6 text-rose-100">{error}</div>;
  }

  return (
    <div className="space-y-8">
      <section className="surface-panel rounded-[34px] border border-white/50 p-8 text-center shadow-glow">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m5 13 4 4L19 7" />
          </svg>
        </div>
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.28em] text-orange-600">Order placed</p>
        <h1 className="mt-3 font-display text-4xl font-bold text-slate-900">Your fireworks order is confirmed</h1>
        <p className="mt-4 text-base leading-8 text-slate-600">
          Order <span className="font-bold text-slate-900">{order.orderNumber}</span> was saved successfully. Cash on
          Delivery is selected, and your current status is shown below.
        </p>

        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <span className={`rounded-full px-4 py-2 text-sm font-semibold ${getStatusClasses(order.status)}`}>{order.status}</span>
          <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">{formatDate(order.createdAt)}</span>
          <span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-700">COD</span>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="surface-panel rounded-[30px] border border-white/50 p-6 shadow-glow">
          <h2 className="font-display text-2xl font-bold text-slate-900">Delivery details</h2>
          <div className="mt-5 space-y-3 text-sm leading-7 text-slate-600">
            <p>
              <span className="font-semibold text-slate-900">Name:</span> {order.customer.name}
            </p>
            <p>
              <span className="font-semibold text-slate-900">Phone:</span> {order.customer.phone}
            </p>
            <p>
              <span className="font-semibold text-slate-900">Address:</span> {order.customer.address}
            </p>
            <p>
              <span className="font-semibold text-slate-900">Pincode:</span> {order.customer.pincode}
            </p>
          </div>
        </section>

        <section className="surface-panel rounded-[30px] border border-white/50 p-6 shadow-glow">
          <h2 className="font-display text-2xl font-bold text-slate-900">Ordered items</h2>
          <div className="mt-5 space-y-4">
            {order.items.map((item) => (
              <div key={`${item.product}-${item.name}`} className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
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
            <span>{formatCurrency(order.total)}</span>
          </div>
        </section>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link to="/orders" className="warm-button text-center">
          Track orders
        </Link>
        <Link to="/products" className="ghost-button text-center">
          Continue shopping
        </Link>
      </div>
    </div>
  );
}

export default OrderSuccessPage;
