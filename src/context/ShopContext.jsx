import { createContext, useContext, useEffect, useState } from "react";

const ShopContext = createContext(null);
const CART_KEY = "maatridev-cart";
const WISH_KEY = "maatridev-wishlist";

export function ShopProvider({ children }) {
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem(CART_KEY) || "[]"));
  const [wishlist, setWishlist] = useState(() => JSON.parse(localStorage.getItem(WISH_KEY) || "[]"));

  useEffect(() => localStorage.setItem(CART_KEY, JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem(WISH_KEY, JSON.stringify(wishlist)), [wishlist]);

  const addToCart = (product, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + qty } : i));
      }
      return [...prev, { ...product, qty }];
    });
  };

  const removeFromCart = (id) => setCart((prev) => prev.filter((i) => i.id !== id));
  const updateQty = (id, qty) =>
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i)));

  const toggleWishlist = (product) => {
    setWishlist((prev) =>
      prev.some((p) => p.id === product.id) ? prev.filter((p) => p.id !== product.id) : [...prev, product]
    );
  };

  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <ShopContext.Provider
      value={{ cart, wishlist, addToCart, removeFromCart, updateQty, toggleWishlist, cartTotal }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export const useShop = () => useContext(ShopContext);
