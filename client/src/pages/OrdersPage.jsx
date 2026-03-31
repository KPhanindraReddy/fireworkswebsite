import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import EmptyState from "../components/EmptyState.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import { PageSpinner } from "../components/LoadingState.jsx";
import { fetchOrderById } from "../lib/api.js";
import { formatCurrency, formatDate, getStatusClasses } from "../lib/format.js";
import { getRecentOrderIds } from "../lib/orderStorage.js";

function OrderCard({ order }) {
  return (
    <article className="surface-panel rounded-[30px] border border-slate-200 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Order number</p>
          <h2 className="mt-2 font-display text-2xl font-bold text-slate-900">{order.orderNumber}</h2>
          <p className="mt-2 text-sm text-slate-500">{formatDate(order.createdAt)}</p>
        </div>
        <span className={`rounded-full px-4 py-2 text-sm font-semibold ${getStatusClasses(order.status)}`}>{order.status}</span>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Customer</p>
          <p className="mt-2 font-semibold text-slate-900">{order.customer.name}</p>
          <p className="text-sm text-slate-500">{order.customer.phone}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Delivery</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {order.customer.address}, {order.customer.pincode}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Payment</p>
          <p className="mt-2 font-semibold text-slate-900">{order.paymentMethod}</p>
          <p className="text-sm text-slate-500">{formatCurrency(order.total)}</p>
        </div>
      </div>

      <div className="mt-5 space-y-3 border-t border-slate-200 pt-5">
        {order.items.map((item) => (
          <div key={`${item.product}-${item.name}`} className="flex items-center justify-between gap-3 text-sm">
            <span className="text-slate-700">
              {item.name} x {item.quantity}
            </span>
            <span className="font-semibold text-slate-900">{formatCurrency(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>
    </article>
  );
}

function OrdersPage() {
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lookupId, setLookupId] = useState("");
  const [lookupOrder, setLookupOrder] = useState(null);
  const [lookupLoading, setLookupLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadRecentOrders = async () => {
      const orderIds = getRecentOrderIds();

      if (!orderIds.length) {
        setLoading(false);
        return;
      }

      try {
        const results = await Promise.allSettled(orderIds.map((orderId) => fetchOrderById(orderId)));
        const fulfilledOrders = results
          .filter((result) => result.status === "fulfilled")
          .map((result) => result.value);

        if (isMounted) {
          setRecentOrders(fulfilledOrders);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadRecentOrders();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleLookup = async (event) => {
    event.preventDefault();

    if (!lookupId.trim()) {
      toast.error("Enter an order number to track it.");
      return;
    }

    try {
      setLookupLoading(true);
      const order = await fetchOrderById(lookupId.trim());
      setLookupOrder(order);
      toast.success("Order found");
    } catch (requestError) {
      setLookupOrder(null);
      toast.error(requestError.message);
    } finally {
      setLookupLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Orders"
        title="Track recent orders"
        description="Orders placed from this device are shown automatically, and any order can be searched by order number."
      />

      <section className="surface-panel rounded-[30px] border border-slate-200 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
        <form onSubmit={handleLookup} className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <label className="field-label text-slate-700">Track with order number</label>
            <input
              value={lookupId}
              onChange={(event) => setLookupId(event.target.value)}
              className="input-field"
              placeholder="FW-123456-7890"
            />
          </div>
          <button type="submit" disabled={lookupLoading} className="warm-button">
            {lookupLoading ? "Checking..." : "Track order"}
          </button>
        </form>
      </section>

      {lookupOrder ? (
        <section className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Search result</p>
          <OrderCard order={lookupOrder} />
        </section>
      ) : null}

      <section className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Orders from this device</p>
        {loading ? (
          <PageSpinner label="Loading recent orders" />
        ) : recentOrders.length ? (
          recentOrders.map((order) => <OrderCard key={order._id} order={order} />)
        ) : (
          <EmptyState
            title="No recent orders on this device"
            description="Place a test order and it will appear here automatically for quick status tracking."
            actionLabel="Start shopping"
            actionTo="/products"
          />
        )}
      </section>
    </div>
  );
}

export default OrdersPage;
