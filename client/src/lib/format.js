export const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);

export const formatDate = (value) =>
  new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

export const getStockLabel = (stock) => {
  if (stock <= 0) {
    return "Out of stock";
  }

  if (stock < 10) {
    return `Only ${stock} left`;
  }

  return "In stock";
};

export const getStatusClasses = (status) => {
  switch (status) {
    case "Delivered":
      return "bg-emerald-100 text-emerald-700";
    case "Shipped":
      return "bg-sky-100 text-sky-700";
    case "Cancelled":
      return "bg-rose-100 text-rose-700";
    case "Packed":
    case "Confirmed":
      return "bg-amber-100 text-amber-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
};
