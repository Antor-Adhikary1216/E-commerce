"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/store/cart";
import { currency } from "@/lib/utils";
import { EmptyState } from "@/components/empty-state";
import { apiClient } from "@/services/api-client";
import { useRequireAuth } from "@/lib/use-require-auth";
import { swal } from "@/lib/swal";

export default function CartPage() {
  const { items, count, subtotal, updateQuantity, remove, clear } = useCart();
  const requireAuth = useRequireAuth();
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("canceled") === "1") {
      toast.error("Payment was cancelled. Your cart is still here.");
    }
  }, []);

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<ShoppingCart size={28} />}
        title="Your cart is empty"
        message="Good things are waiting. Explore today's picks and add something you'll love."
        action={{ href: "/", label: "Explore today's picks" }}
      />
    );
  }

  async function confirmRemove(slug: string, name: string) {
    const result = await swal.fire({
      icon: "warning",
      title: "Remove item?",
      text: `Remove "${name}" from your cart?`,
      showCancelButton: true,
      confirmButtonText: "Yes, remove",
      cancelButtonText: "Cancel",
    });
    if (result.isConfirmed) {
      remove(slug);
      toast.success("Item removed from cart");
    }
  }

  async function confirmClearCart() {
    const result = await swal.fire({
      icon: "warning",
      title: "Clear your cart?",
      text: "All items will be removed. This cannot be undone.",
      showCancelButton: true,
      confirmButtonText: "Yes, clear cart",
      cancelButtonText: "Cancel",
    });
    if (result.isConfirmed) {
      clear();
      toast.success("Cart cleared");
    }
  }

  async function checkout() {
    if (!requireAuth()) return;
    setCheckingOut(true);
    try {
      const { data } = await apiClient.post("/payments/create-checkout", {
        items: items.map((item) => ({ slug: item.product.slug, quantity: item.quantity })),
      });
      window.location.href = data.url as string;
    } catch (error) {
      toast.error("Could not start checkout. Please try again.");
    } finally {
      setCheckingOut(false);
    }
  }

  return (
    <main className="mx-auto max-w-[1240px] px-4 py-8">
      <h1 className="text-2xl font-black">Your cart ({count})</h1>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <motion.div
                key={item.product.slug}
                layout
                initial={{ opacity: 0, y: 14, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: -24, scale: 0.97 }}
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                className="flex gap-4 rounded-2xl bg-white p-4 shadow-[0_1px_4px_rgba(0,0,0,.12)]"
              >
              <Link href={`/products/${item.product.slug}`} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[#f3f0e9]">
                <Image src={item.product.image} alt={item.product.name} fill sizes="96px" className="object-contain p-2" />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col">
                <Link href={`/products/${item.product.slug}`} className="line-clamp-2 text-[13px] font-semibold hover:text-[#16815d]">
                  {item.product.name}
                </Link>
                <div className="mt-auto flex flex-wrap items-center gap-3 pt-2">
                  <div className="inline-flex items-center rounded-full border border-slate-200">
                    <button type="button" onClick={() => updateQuantity(item.product.slug, item.quantity - 1)} aria-label="Decrease quantity" className="p-2 text-slate-500 hover:text-[#1c2734]">
                      <Minus size={14} />
                    </button>
                    <motion.span key={item.quantity} initial={{ scale: 1.3 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 480, damping: 24 }} className="w-8 text-center text-[13px] font-semibold">{item.quantity}</motion.span>
                    <button type="button" onClick={() => updateQuantity(item.product.slug, item.quantity + 1)} aria-label="Increase quantity" className="p-2 text-slate-500 hover:text-[#1c2734]">
                      <Plus size={14} />
                    </button>
                  </div>
                  <span className="text-sm font-bold">{currency(item.product.finalPrice * item.quantity)}</span>
                  {item.product.finalPrice < item.product.price && <del className="text-xs text-slate-400">{currency(item.product.price * item.quantity)}</del>}
                </div>
              </div>
              <button type="button" onClick={() => confirmRemove(item.product.slug, item.product.name)} aria-label={`Remove ${item.product.name} from cart`} className="h-fit rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-[#16815d]">
                <Trash2 size={16} />
              </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <aside className="h-fit rounded-2xl bg-white p-5 shadow-[0_1px_4px_rgba(0,0,0,.12)]">
          <h2 className="text-sm font-bold">Order summary</h2>
          <dl className="mt-4 space-y-2.5 text-[13px]">
            <div className="flex justify-between">
              <dt className="text-slate-500">Subtotal</dt>
              <dd className="font-semibold">{currency(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Delivery</dt>
              <dd className="font-semibold text-[#16815d]">Free</dd>
            </div>
            <div className="flex justify-between border-t border-slate-100 pt-2.5 text-sm">
              <dt className="font-bold">Total</dt>
              <dd className="font-black"><motion.span key={subtotal} initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 420, damping: 24 }}>{currency(subtotal)}</motion.span></dd>
            </div>
          </dl>
          <button type="button" onClick={checkout} disabled={checkingOut} className="mt-5 w-full rounded-full bg-[#16815d] px-5 py-3 text-sm font-semibold text-white hover:scale-[1.02] disabled:opacity-60">
            {checkingOut ? "Redirecting to Stripe…" : "Proceed to checkout"}
          </button>
          <button type="button" onClick={confirmClearCart} className="mt-2.5 w-full rounded-full border border-slate-200 px-5 py-2.5 text-[13px] font-semibold text-slate-500 hover:bg-slate-50 hover:text-[#c0392b]">
            Clear cart
          </button>
          <Link href="/shop" className="mt-3 block text-center text-[13px] font-semibold text-[#16815d] hover:underline">
            Continue shopping
          </Link>
        </aside>
      </div>
    </main>
  );
}
