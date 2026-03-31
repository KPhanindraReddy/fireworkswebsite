const API_BASE = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");

const getJson = async (response) => {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed.");
  }

  return data;
};

const buildQuery = (params = {}) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, value);
    }
  });

  const output = query.toString();
  return output ? `?${output}` : "";
};

export const fetchProducts = async (params) => {
  const response = await fetch(`${API_BASE}/products${buildQuery(params)}`);
  return getJson(response);
};

export const fetchProductById = async (id) => {
  const response = await fetch(`${API_BASE}/products/${id}`);
  return getJson(response);
};

export const createProduct = async (payload) => {
  const response = await fetch(`${API_BASE}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return getJson(response);
};

export const updateProduct = async (id, payload) => {
  const response = await fetch(`${API_BASE}/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return getJson(response);
};

export const deleteProduct = async (id) => {
  const response = await fetch(`${API_BASE}/products/${id}`, {
    method: "DELETE",
  });

  return getJson(response);
};

export const createOrder = async (payload) => {
  const response = await fetch(`${API_BASE}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return getJson(response);
};

export const fetchOrderById = async (id) => {
  const response = await fetch(`${API_BASE}/orders/${id}`);
  return getJson(response);
};

export const fetchOrders = async () => {
  const response = await fetch(`${API_BASE}/orders`);
  return getJson(response);
};

export const updateOrderStatus = async (id, status) => {
  const response = await fetch(`${API_BASE}/orders/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  return getJson(response);
};

export const uploadProductImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`${API_BASE}/uploads/image`, {
    method: "POST",
    body: formData,
  });

  return getJson(response);
};

export const resolveImageUrl = (value) => value || "/products/royal-sparklers.svg";
