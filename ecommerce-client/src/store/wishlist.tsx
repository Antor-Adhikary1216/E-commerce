"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ProductCardData } from "@/components/product-card";

interface WishlistContextValue {
  items: ProductCardData[];
  count: number;
  isSaved: (slug: string) => boolean;
  toggle: (product: ProductCardData) => boolean;
  remove: (slug: string) => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);
const STORAGE_KEY = "vanta.saved";

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ProductCardData[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored) as ProductCardData[]);
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

  const value = useMemo<WishlistContextValue>(
    () => ({
      items,
      count: items.length,
      isSaved: (slug) => items.some((item) => item.slug === slug),
      toggle: (product) => {
        const saved = items.some((item) => item.slug === product.slug);
        setItems((prev) => (saved ? prev.filter((item) => item.slug !== product.slug) : [...prev, product]));
        return !saved;
      },
      remove: (slug) => setItems((prev) => prev.filter((item) => item.slug !== slug)),
    }),
    [items]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
