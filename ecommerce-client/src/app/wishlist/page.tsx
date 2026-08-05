"use client";
import { useEffect } from "react";
import { Heart } from "lucide-react";
import { useWishlist } from "@/store/wishlist";
import { ProductGrid } from "@/components/motion/product-grid";
import { EmptyState } from "@/components/empty-state";
import { useRequireAuth } from "@/lib/use-require-auth";

export default function WishlistPage() {
  const { items, count } = useWishlist();
  const requireAuth = useRequireAuth();

  useEffect(() => {
    requireAuth();
  }, []);

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<Heart size={28} />}
        title="Nothing saved yet"
        message="Tap the heart on any product to keep it here for later."
        action={{ href: "/", label: "Browse the market" }}
      />
    );
  }

  return (
    <main className="mx-auto max-w-[1440px] px-4 py-8">
      <h1 className="text-2xl font-black">Saved ({count})</h1>
      <ProductGrid cards={items} className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6" />
    </main>
  );
}
