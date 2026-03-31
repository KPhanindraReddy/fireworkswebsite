const PRODUCT_QUERY_CACHE_TTL_MS = 60 * 1000;

const productQueryCache = new Map();

const createCacheKey = (params = {}) =>
  JSON.stringify(
    Object.entries(params)
      .filter(([, value]) => value !== undefined && value !== null && value !== "")
      .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey)),
  );

export const readProductQueryCache = (params) => {
  const cacheKey = createCacheKey(params);
  const cachedEntry = productQueryCache.get(cacheKey);

  if (!cachedEntry) {
    return null;
  }

  if (cachedEntry.expiresAt <= Date.now()) {
    productQueryCache.delete(cacheKey);
    return null;
  }

  return cachedEntry.value;
};

export const writeProductQueryCache = (params, value) => {
  const cacheKey = createCacheKey(params);

  productQueryCache.set(cacheKey, {
    value,
    expiresAt: Date.now() + PRODUCT_QUERY_CACHE_TTL_MS,
  });

  return value;
};

export const invalidateProductQueryCache = () => {
  productQueryCache.clear();
};
