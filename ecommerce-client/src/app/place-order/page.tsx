"use client";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { useCart } from "@/store/cart";
import { currency } from "@/lib/utils";
import { EmptyState } from "@/components/empty-state";
import { SelectItemCard } from "@/components/select-item-card";
import { useRequireAuth } from "@/lib/use-require-auth";
import toast from "react-hot-toast";

export default function PlaceOrderPage() {
  const { items, count } = useCart();
  const requireAuth = useRequireAuth();
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    requireAuth();
  }, [requireAuth]);

  // Auto-select all items on mount
  useEffect(() => {
    if (items.length > 0 && selected.size === 0) {
      setSelected(new Set(items.map((i) => i.product.slug)));
    }
  }, [items]);

  const allSelected = items.length > 0 && items.every((i) => selected.has(i.product.slug));

  const selectedItems = useMemo(
    () => items.filter((i) => selected.has(i.product.slug)),
    [items, selected]
  );

  const subtotal = useMemo(
    () => selectedItems.reduce((sum, i) => sum + i.product.finalPrice * i.quantity, 0),
    [selectedItems]
  );

  const totalItems = useMemo(
    () => selectedItems.reduce((sum, i) => sum + i.quantity, 0),
    [selectedItems]
  );

  function toggle(slug: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }

  function toggleAll() {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(items.map((i) => i.product.slug)));
    }
  }

  function proceedToPayment() {
    if (selectedItems.length === 0) {
      toast.error("Please select at least one item.");
      return;
    }
    const slugs = selectedItems.map((i) => i.product.slug).join(",");
    router.push(`/checkout?items=${encodeURIComponent(slugs)}`);
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<ShoppingCart size={28} />}
        title="Your cart is empty"
        message="Add some items to your cart before placing an order."
        action={{ href: "/", label: "Explore products" }}
      />
    );
  }

  return (
    <main className="mx-auto max-w-[1240px] px-4 py-8">
      {/* Back link */}
      <Link
        href="/cart"
        className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-slate-500 transition hover:text-[#1c2734]"
      >
        <ArrowLeft size={16} />
        Back to Cart
      </Link>

      <h1 className="mt-4 text-2xl font-black text-[#1c2734]">Select Items to Purchase</h1>

      {/* Select All */}
      <label className="mt-4 flex cursor-pointer items-center gap-2.5">
        <input
          type="checkbox"
          checked={allSelected}
          onChange={toggleAll}
          className="peer sr-only"
        />
        <span
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors ${
            allSelected
              ? "border-[#16815d] bg-[#16815d]"
              : "border-slate-300 bg-white"
          }`}
        >
          {allSelected && (
            <svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="none">
              <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
        <span className="text-sm font-semibold text-[#1c2734]">Select All ({count} items)</span>
      </label>

      {/* Two-column layout */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Items list */}
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <SelectItemCard
                key={item.product.slug}
                item={item}
                selected={selected.has(item.product.slug)}
                onToggle={toggle}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Order Summary sidebar */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl bg-white p-5 shadow-[0_1px_4px_rgba(0,0,0,.12)]">
            <h2 className="text-sm font-bold text-[#1c2734]">Order Summary</h2>

            <dl className="mt-4 space-y-3 text-[13px]">
              <div className="flex justify-between">
                <dt className="text-slate-500">Selected Items</dt>
                <dd className="font-medium text-[#1c2734]">{totalItems} item{totalItems !== 1 ? "s" : ""}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Subtotal</dt>
                <dd className="font-medium text-[#1c2734]">{currency(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Delivery</dt>
                <dd className="font-medium text-[#16815d]">Free</dd>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-3 text-sm">
                <dt className="font-bold text-[#1c2734]">Total</dt>
                <dd className="font-black text-[#1c2734]">{currency(subtotal)}</dd>
              </div>
            </dl>

            <button
              type="button"
              onClick={proceedToPayment}
              disabled={selectedItems.length === 0}
              className="mt-5 w-full rounded-full bg-[#16815d] px-5 py-3 text-sm font-semibold text-white transition hover:scale-[1.02] disabled:opacity-50"
            >
              {`Proceed to Payment (${totalItems})`}
            </button>

            {selectedItems.length === 0 && (
              <p className="mt-3 text-center text-[12px] text-slate-400">Select at least one item to continue</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
