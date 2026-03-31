import { createContext, useContext, useEffect, useState } from "react";

const CART_STORAGE_KEY = "fireworks_cart";
const CartContext = createContext(null);

const canUseStorage = () => typeof window !== "undefined";

const readCart = () => {
  if (!canUseStorage()) {
    return [];
  }

  try {
    const savedCart = window.localStorage.getItem(CART_STORAGE_KEY);
    const parsedCart = savedCart ? JSON.parse(savedCart) : [];
    return Array.isArray(parsedCart) ? parsedCart : [];
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(readCart);

  useEffect(() => {
    if (!canUseStorage()) {
      return;
    }

    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const addItem = (product, quantity = 1) => {
    const existingItem = cartItems.find((item) => item._id === product._id);
    const nextQuantity = (existingItem?.quantity ?? 0) + quantity;

    if (typeof product.stock === "number" && nextQuantity > product.stock) {
      return { added: false, reason: "stock" };
    }

    setCartItems((currentItems) => {
      const itemIndex = currentItems.findIndex((item) => item._id === product._id);

      if (itemIndex === -1) {
        return [
          ...currentItems,
          {
            _id: product._id,
            name: product.name,
            price: product.price,
            image: product.images?.[0] ?? "",
            stock: product.stock,
            quantity,
          },
        ];
      }

      return currentItems.map((item) =>
        item._id === product._id
          ? {
              ...item,
              quantity: item.quantity + quantity,
              stock: product.stock,
            }
          : item,
      );
    });

    return { added: true };
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) {
      removeItem(productId);
      return;
    }

    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item._id === productId
          ? {
              ...item,
              quantity: typeof item.stock === "number" ? Math.min(quantity, item.stock) : quantity,
            }
          : item,
      ),
    );
  };

  const removeItem = (productId) => {
    setCartItems((currentItems) => currentItems.filter((item) => item._id !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getQuantity = (productId) => cartItems.find((item) => item._id === productId)?.quantity ?? 0;

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartSubtotal,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        getQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
};
