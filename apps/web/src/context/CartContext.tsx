import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, CartItem } from "../types";

interface GroupedCart {
  storeName: string;
  storeId: string;
  items: CartItem[];
  subtotal: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, delta: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  cartTotal: number;
  totalItemsCount: number;
  groupedByStore: GroupedCart[];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "mercago_cart";

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error("Error al persistir carrito:", e);
    }
  }, [cart]);

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce(
    (acc, item) => acc + Number(item.product.price) * item.quantity,
    0
  );

  const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Agrupación de productos por tienda
  const groupedByStore: GroupedCart[] = React.useMemo(() => {
    const groups: { [key: string]: GroupedCart } = {};

    cart.forEach((item) => {
      const storeId = item.product.storeId || item.product.store?.id || "tienda-general";
      const storeName = item.product.store?.name || "Tienda Local";

      if (!groups[storeId]) {
        groups[storeId] = {
          storeId,
          storeName,
          items: [],
          subtotal: 0,
        };
      }

      groups[storeId].items.push(item);
      groups[storeId].subtotal += Number(item.product.price) * item.quantity;
    });

    return Object.values(groups);
  }, [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        cartTotal,
        totalItemsCount,
        groupedByStore,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe utilizarse dentro de un CartProvider");
  }
  return context;
};
