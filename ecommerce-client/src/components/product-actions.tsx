"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check, Heart, ShoppingCart, Zap } from "lucide-react";
import { toCard, type CatalogProduct } from "@/lib/catalog";
import { addedToCart, savedForLater, duplicateItemConfirm } from "@/lib/swal";
import { useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";
import { useRequireAuth } from "@/lib/use-require-auth";
import { EASE } from "@/components/motion/reveal";

export function ProductActions({ product }: { product: CatalogProduct }) {
  const { items, add } = useCart();
  const { isSaved, toggle } = useWishlist();
  const requireAuth = useRequireAuth();
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const saved = isSaved(product.slug);
  const inCart = items.some((item) => item.product.slug === product.slug);

  async function handleAddToCart() {
    if (!requireAuth()) return;
    if (inCart) {
      const result = await duplicateItemConfirm(product.name);
      if (!result.isConfirmed) return;
    }
    setAdding(true);
    setTimeout(() => {
      add(toCard(product));
      addedToCart(product.name);
      setAdding(false);
    }, 400);
  }

  function handleBuyNow() {
    if (!requireAuth()) return;
    router.push(`/checkout?items=${encodeURIComponent(product.slug)}`);
  }

  function handleSaved() {
    if (!requireAuth()) return;
    setSaving(true);
    setTimeout(() => {
      savedForLater(product.name, toggle(toCard(product)));
      setSaving(false);
    }, 300);
  }

  return (
    <div className="mt-6 flex items-center gap-3">
      {inCart ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="flex-1"
        >
          <Link
            href="/cart"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#d8ef72] px-6 py-3 text-sm font-semibold text-[#1c2734] transition hover:scale-[1.02] hover:shadow-[0_4px_14px_rgba(216,239,114,0.4)]"
          >
            <Check size={17} /> In cart — view cart
          </Link>
        </motion.div>
      ) : (
        <motion.button
          type="button"
          onClick={handleAddToCart}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: EASE, delay: 0.05 }}
          whileHover={{ scale: 1.03, boxShadow: "0 6px 20px rgba(22, 129, 93, 0.3)" }}
          whileTap={{ scale: 0.96 }}
          disabled={adding}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-teal-600 to-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_2px_8px_rgba(22,129,93,0.25)] transition-colors hover:from-teal-700 hover:to-emerald-600 disabled:opacity-50"
        >
          {adding ? (
            <span className="h-[17px] w-[17px] animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <ShoppingCart size={17} />
          )}{" "}
          Add to cart
        </motion.button>
      )}
      <motion.button
        type="button"
        onClick={handleBuyNow}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: EASE }}
        whileHover={{ scale: 1.03, boxShadow: "0 6px 20px rgba(234, 179, 8, 0.35)" }}
        whileTap={{ scale: 0.96 }}
        className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 px-5 py-3 text-sm font-semibold text-[#1c2734] shadow-[0_2px_8px_rgba(234,179,8,0.25)] transition-colors hover:from-amber-600 hover:to-yellow-500"
      >
        <Zap size={17} /> Buy Now
      </motion.button>
      <button
        type="button"
        onClick={handleSaved}
        disabled={saving}
        aria-label={saved ? "Remove from saved" : "Save for later"}
        className={`inline-flex items-center rounded-full border p-3 transition disabled:opacity-50 ${saved ? "border-[#16815d] text-[#16815d]" : "border-slate-200 text-[#1c2734] hover:bg-slate-50"}`}
      >
        {saving ? (
          <span className="h-[17px] w-[17px] animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          <Heart size={17} fill={saved ? "currentColor" : "none"} />
        )}
      </button>
    </div>
  );
}
