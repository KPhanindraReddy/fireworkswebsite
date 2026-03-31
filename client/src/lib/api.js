const API_BASE = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");
const PRODUCT_CACHE_STORAGE_PREFIX = "fireworks:products:";
const PRODUCT_CACHE_MAX_AGE_MS = 5 * 60 * 1000;
const PRODUCT_CACHE_STALE_AGE_MS = 24 * 60 * 60 * 1000;

const productCache = new Map();

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

const createProductCacheKey = (params = {}) =>
  JSON.stringify(
    Object.entries(params)
      .filter(([, value]) => value !== undefined && value !== null && value !== "")
      .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey)),
  );

const getStorage = () => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

const readProductCacheEntry = (params = {}) => {
  const cacheKey = createProductCacheKey(params);
  const cachedFromMemory = productCache.get(cacheKey);

  if (cachedFromMemory) {
    return { cacheKey, entry: cachedFromMemory };
  }

  const storage = getStorage();

  if (!storage) {
    return { cacheKey, entry: null };
  }

  try {
    const rawValue = storage.getItem(`${PRODUCT_CACHE_STORAGE_PREFIX}${cacheKey}`);

    if (!rawValue) {
      return { cacheKey, entry: null };
    }

    const parsedValue = JSON.parse(rawValue);
    productCache.set(cacheKey, parsedValue);

    return { cacheKey, entry: parsedValue };
  } catch {
    storage.removeItem(`${PRODUCT_CACHE_STORAGE_PREFIX}${cacheKey}`);
    return { cacheKey, entry: null };
  }
};

const isExpiredProductCacheEntry = (entry) => Date.now() - entry.savedAt > PRODUCT_CACHE_STALE_AGE_MS;

const writeProductCacheEntry = (params = {}, data) => {
  const storage = getStorage();
  const cacheKey = createProductCacheKey(params);
  const entry = {
    data,
    savedAt: Date.now(),
  };

  productCache.set(cacheKey, entry);

  if (storage) {
    try {
      storage.setItem(`${PRODUCT_CACHE_STORAGE_PREFIX}${cacheKey}`, JSON.stringify(entry));
    } catch {
      // Ignore storage quota errors and keep the in-memory cache.
    }
  }

  return data;
};

export const readCachedProducts = (params, { allowStale = false } = {}) => {
  const storage = getStorage();
  const { cacheKey, entry } = readProductCacheEntry(params);

  if (!entry) {
    return { data: null, isFresh: false };
  }

  if (isExpiredProductCacheEntry(entry)) {
    productCache.delete(cacheKey);

    if (storage) {
      storage.removeItem(`${PRODUCT_CACHE_STORAGE_PREFIX}${cacheKey}`);
    }

    return { data: null, isFresh: false };
  }

  const isFresh = Date.now() - entry.savedAt <= PRODUCT_CACHE_MAX_AGE_MS;

  if (!allowStale && !isFresh) {
    return { data: null, isFresh: false };
  }

  return { data: entry.data, isFresh };
};

export const clearProductCache = () => {
  productCache.clear();

  const storage = getStorage();

  if (!storage) {
    return;
  }

  const keysToDelete = [];

  for (let index = 0; index < storage.length; index += 1) {
    const key = storage.key(index);

    if (key?.startsWith(PRODUCT_CACHE_STORAGE_PREFIX)) {
      keysToDelete.push(key);
    }
  }

  keysToDelete.forEach((key) => storage.removeItem(key));
};

export const fetchProducts = async (params, options = {}) => {
  const { bypassCache = false, cache, signal } = options;

  if (!bypassCache) {
    const cached = readCachedProducts(params);

    if (cached.data) {
      return cached.data;
    }
  }

  const response = await fetch(`${API_BASE}/products${buildQuery(params)}`, { cache, signal });
  const data = await getJson(response);
  return writeProductCacheEntry(params, data);
};

export const warmProductsCache = (params) => fetchProducts(params).catch(() => null);

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
