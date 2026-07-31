"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ProductCardData } from "@/components/product-card";

export interface CartItem {
  product: ProductCardData;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  subtotal: number;
  add: (product: ProductCardData, quantity?: number) => void;
  remove: (slug: string) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "vanta.cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored) as CartItem[]);
    } catch {
      // ignore corrupt storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore quota errors
    }
  }, [items, hydrated]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count: items.reduce((total, item) => total + item.quantity, 0),
      subtotal: items.reduce((total, item) => total + item.product.finalPrice * item.quantity, 0),
      add: (product, quantity = 1) =>
        setItems((prev) => {
          const existing = prev.find((item) => item.product.slug === product.slug);
          if (existing) {
            return prev.map((item) => (item.product.slug === product.slug ? { ...item, quantity: item.quantity + quantity } : item));
          }
          return [...prev, { product, quantity }];
        }),
      remove: (slug) => setItems((prev) => prev.filter((item) => item.product.slug !== slug)),
      updateQuantity: (slug, quantity) =>
        setItems((prev) =>
          quantity <= 0
            ? prev.filter((item) => item.product.slug !== slug)
            : prev.map((item) => (item.product.slug === slug ? { ...item, quantity } : item))
        ),
      clear: () => setItems([]),
    }),
    [items]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
