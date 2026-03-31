const STORAGE_KEY = "fireworks_recent_orders";

const canUseStorage = () => typeof window !== "undefined";

export const getRecentOrderIds = () => {
  if (!canUseStorage()) {
    return [];
  }

  const rawValue = window.localStorage.getItem(STORAGE_KEY);

  if (!rawValue) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawValue);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const saveRecentOrderId = (orderId) => {
  if (!canUseStorage() || !orderId) {
    return;
  }

  const uniqueIds = [orderId, ...getRecentOrderIds().filter((value) => value !== orderId)].slice(0, 10);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(uniqueIds));
};
