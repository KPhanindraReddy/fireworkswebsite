import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import ProductForm from "../components/admin/ProductForm.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import { PageSpinner } from "../components/LoadingState.jsx";
import {
  clearProductCache,
  createProduct,
  deleteProduct,
  fetchOrders,
  fetchProducts,
  resolveImageUrl,
  updateOrderStatus,
  updateProduct,
  uploadProductImage,
} from "../lib/api.js";
import { formatCurrency, formatDate, getStatusClasses } from "../lib/format.js";

const initialProductForm = {
  name: "",
  category: "",
  audience: "All Ages",
  price: "",
  stock: "",
  description: "",
  tags: "",
  packSize: "",
  imagesInput: "",
  featured: false,
};

function AdminDashboardPage() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadPending, setUploadPending] = useState(false);
  const [editingProductId, setEditingProductId] = useState("");
  const [form, setForm] = useState(initialProductForm);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const [productsResponse, ordersResponse] = await Promise.all([
        fetchProducts({ includeFacets: "false" }, { bypassCache: true, cache: "no-store" }),
        fetchOrders(),
      ]);
      setProducts(productsResponse.products);
      setOrders(ordersResponse);
    } catch (requestError) {
      toast.error(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const resetForm = () => {
    setForm(initialProductForm);
    setEditingProductId("");
  };

  const handleFieldChange = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const buildPayload = () => ({
    name: form.name,
    category: form.category,
    audience: form.audience,
    price: Number(form.price),
    stock: Number(form.stock),
    description: form.description,
    tags: form.tags,
    featured: form.featured,
    images: form.imagesInput
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean),
    burstHeight: form.burstHeight,
    duration: form.duration,
    packSize: form.packSize,
  });

  const handleProductSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      const payload = buildPayload();

      if (editingProductId) {
        await updateProduct(editingProductId, payload);
        toast.success("Product updated");
      } else {
        await createProduct(payload);
        toast.success("Product created");
      }

      clearProductCache();
      resetForm();
      await loadDashboard();
    } catch (requestError) {
      toast.error(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProductId(product._id);
    setForm({
      name: product.name,
      category: product.category,
      audience: product.audience || "All Ages",
      price: product.price,
      stock: product.stock,
      description: product.description,
      tags: product.tags?.join(", ") ?? "",
      packSize: product.specs?.packSize ?? "",
      imagesInput: product.images?.join(", ") ?? "",
      featured: Boolean(product.featured),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (productId) => {
    const confirmed = window.confirm("Delete this product?");

    if (!confirmed) {
      return;
    }

    try {
      await deleteProduct(productId);
      clearProductCache();
      toast.success("Product deleted");
      await loadDashboard();
    } catch (requestError) {
      toast.error(requestError.message);
    }
  };

  const handleUpload = async (file) => {
    if (!file) {
      return;
    }

    try {
      setUploadPending(true);
      const { url } = await uploadProductImage(file);
      setForm((current) => ({
        ...current,
        imagesInput: current.imagesInput ? `${current.imagesInput}, ${url}` : url,
      }));
      toast.success("Image uploaded");
    } catch (requestError) {
      toast.error(requestError.message);
    } finally {
      setUploadPending(false);
    }
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      const updatedOrder = await updateOrderStatus(orderId, status);
      setOrders((currentOrders) =>
        currentOrders.map((order) => (order._id === orderId ? updatedOrder : order)),
      );
      toast.success("Order status updated");
    } catch (requestError) {
      toast.error(requestError.message);
    }
  };

  if (loading) {
    return <PageSpinner label="Loading admin dashboard" />;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-start">
        <Link to="/orders" className="ghost-button">
          Track Recent Orders
        </Link>
      </div>

      <SectionHeading
        eyebrow="Admin"
        title="Manage products and orders"
        description="Manage products, images, stock, and order status from one simple admin page."
      />

      <section className="grid gap-4 md:grid-cols-3">
        <article className="surface-panel rounded-[28px] border border-slate-200 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
          <p className="text-sm text-slate-500">Products</p>
          <p className="mt-3 font-display text-4xl font-bold text-slate-900">{products.length}</p>
        </article>
        <article className="surface-panel rounded-[28px] border border-slate-200 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
          <p className="text-sm text-slate-500">Orders</p>
          <p className="mt-3 font-display text-4xl font-bold text-slate-900">{orders.length}</p>
        </article>
        <article className="surface-panel rounded-[28px] border border-slate-200 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
          <p className="text-sm text-slate-500">In stock items</p>
          <p className="mt-3 font-display text-4xl font-bold text-slate-900">
            {products.filter((product) => product.stock > 0).length}
          </p>
        </article>
      </section>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <ProductForm
          form={form}
          onFieldChange={handleFieldChange}
          onSubmit={handleProductSubmit}
          onCancel={resetForm}
          editing={Boolean(editingProductId)}
          saving={saving}
          uploadPending={uploadPending}
          onUpload={handleUpload}
        />

        <section className="surface-panel rounded-[32px] border border-slate-200 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Catalog</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-slate-900">Existing products</h2>
          <div className="mt-6 space-y-4">
            {products.map((product) => (
              <article key={product._id} className="rounded-[26px] border border-slate-200 bg-white p-4">
                <div className="grid gap-4 sm:grid-cols-[6rem_1fr_auto] sm:items-center">
                  <img
                    src={resolveImageUrl(product.images?.[0])}
                    alt={product.name}
                    className="aspect-square w-full rounded-[20px] object-cover"
                  />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{product.category}</p>
                    <h3 className="mt-2 text-xl font-bold text-slate-900">{product.name}</h3>
                    <p className="mt-2 text-sm text-slate-500">
                      {formatCurrency(product.price)} - {product.audience || "All Ages"} - Stock {product.stock} {product.featured ? "- Featured" : ""}
                    </p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <button
                      type="button"
                      onClick={() => handleEdit(product)}
                      className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(product._id)}
                      className="rounded-2xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      <section className="surface-panel rounded-[32px] border border-slate-200 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Orders</p>
        <h2 className="mt-2 font-display text-3xl font-bold text-slate-900">Update order status</h2>

        <div className="mt-6 space-y-4">
          {orders.map((order) => (
            <article key={order._id} className="rounded-[26px] border border-slate-200 bg-white p-4">
              <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-xl font-bold text-slate-900">{order.orderNumber}</h3>
                    <span className={`rounded-full px-4 py-2 text-sm font-semibold ${getStatusClasses(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-500">
                    {order.customer.name} - {order.customer.phone} - {formatDate(order.createdAt)}
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    {order.items.length} item(s) - {formatCurrency(order.total)}
                  </p>
                </div>

                <select
                  value={order.status}
                  onChange={(event) => handleStatusChange(order._id, event.target.value)}
                  className="input-field min-w-[12rem]"
                >
                  {["Placed", "Confirmed", "Packed", "Shipped", "Delivered", "Cancelled"].map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default AdminDashboardPage;
