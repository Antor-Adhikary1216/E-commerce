"use client";
import Link from "next/link";
import { Check, Heart, ShoppingCart } from "lucide-react";
import { toCard, type CatalogProduct } from "@/lib/catalog";
import { addedToCart, savedForLater } from "@/lib/swal";
import { useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";
import { useRequireAuth } from "@/lib/use-require-auth";

export function ProductActions({ product }: { product: CatalogProduct }) {
  const { items, add } = useCart();
  const { isSaved, toggle } = useWishlist();
  const requireAuth = useRequireAuth();
  const saved = isSaved(product.slug);
  const inCart = items.some((item) => item.product.slug === product.slug);

  function handleAddToCart() {
    if (!requireAuth()) return;
    add(toCard(product));
    addedToCart(product.name);
  }

  function handleSaved() {
    if (!requireAuth()) return;
    savedForLater(product.name, toggle(toCard(product)));
  }

  return (
    <div className="mt-6 flex items-center gap-3">
      {inCart ? (
        <Link
          href="/cart"
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#d8ef72] px-6 py-3 text-sm font-semibold text-[#1c2734] hover:scale-[1.02]"
        >
          <Check size={17} /> In cart — view cart
        </Link>
      ) : (
        <button
          type="button"
          onClick={handleAddToCart}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#16815d] px-6 py-3 text-sm font-semibold text-white hover:scale-[1.02]"
        >
          <ShoppingCart size={17} /> Add to cart
        </button>
      )}
      <button
        type="button"
        onClick={handleSaved}
        aria-label={saved ? "Remove from saved" : "Save for later"}
        className={`inline-flex items-center rounded-full border p-3 transition ${saved ? "border-[#16815d] text-[#16815d]" : "border-slate-200 text-[#1c2734] hover:bg-slate-50"}`}
      >
        <Heart size={17} fill={saved ? "currentColor" : "none"} />
      </button>
    </div>
  );
}
