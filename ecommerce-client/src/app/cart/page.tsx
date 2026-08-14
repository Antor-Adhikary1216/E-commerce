"use client";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ShoppingCart } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";
import { EmptyState } from "@/components/empty-state";
import { CartItemCard } from "@/components/cart-item-card";
import { PriceDetails } from "@/components/price-details";
import { useRequireAuth } from "@/lib/use-require-auth";
import { swal } from "@/lib/swal";

export default function CartPage() {
  const { items, count, updateQuantity, remove, clear } = useCart();
  const { toggle, isSaved } = useWishlist();
  const requireAuth = useRequireAuth();
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    requireAuth();
  }, [requireAuth]);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("canceled") === "1") {
      toast.error("Payment was cancelled. Your cart is still here.");
    }
  }, []);

  // Auto-select all items on mount
  useEffect(() => {
    if (items.length > 0) {
      setSelected((prev) => {
        if (prev.size > 0) return prev;
        return new Set(items.map((i) => i.product.slug));
      });
    }
  }, [items]);

  // Remove selected slugs that no longer exist in cart
  useEffect(() => {
    setSelected((prev) => {
      if (prev.size === 0) return prev;
      const slugs = new Set(items.map((i) => i.product.slug));
      const filtered = new Set([...prev].filter((s) => slugs.has(s)));
      return filtered.size === prev.size ? prev : filtered;
    });
  }, [items]);

  const allSelected = items.length > 0 && items.every((i) => selected.has(i.product.slug));

  const selectedItems = useMemo(
    () => items.filter((i) => selected.has(i.product.slug)),
    [items, selected]
  );

  const selectedSubtotal = useMemo(
    () => selectedItems.reduce((sum, i) => sum + i.product.finalPrice * i.quantity, 0),
    [selectedItems]
  );

  const selectedCount = useMemo(
    () => selectedItems.reduce((sum, i) => sum + i.quantity, 0),
    [selectedItems]
  );

  function toggleSelect(slug: string) {
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
      setSelected((prev) => {
        const next = new Set(prev);
        next.delete(slug);
        return next;
      });
      toast.success("Item removed from cart");
    }
  }

  async function confirmClearCart() {
    const result = await swal.fire({
      icon: "warning",
      title: "Remove all items?",
      text: "All items will be removed from your cart.",
      showCancelButton: true,
      confirmButtonText: "Yes, remove all",
      cancelButtonText: "Cancel",
    });
    if (result.isConfirmed) {
      clear();
      setSelected(new Set());
      toast.success("Cart cleared");
    }
  }

  function handleSave(slug: string) {
    const item = items.find((i) => i.product.slug === slug);
    if (!item) return;
    const wasSaved = isSaved(slug);
    toggle(item.product);
    toast.success(wasSaved ? "Removed from saved" : "Saved for later");
  }

  function goToCheckout() {
    if (!requireAuth()) return;
    if (selectedItems.length === 0) {
      toast.error("Please select at least one item.");
      return;
    }
    const slugs = selectedItems.map((i) => i.product.slug).join(",");
    router.push(`/checkout?items=${encodeURIComponent(slugs)}`);
  }

  return (
    <main className="mx-auto max-w-[1240px] px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-[#1c2734]">
          My Cart <span className="text-base font-bold text-slate-500">({count} item{count !== 1 ? "s" : ""})</span>
        </h1>
        <button
          type="button"
          onClick={confirmClearCart}
          className="text-[13px] font-semibold text-[#c0392b] transition hover:underline"
        >
          Remove all
        </button>
      </div>

      {/* Select All */}
      <label className="mt-4 flex cursor-pointer items-center gap-2.5">
        <input
          type="checkbox"
          checked={allSelected}
          onChange={toggleAll}
          className="peer sr-only"
        />
        <span
          className="flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors"
          style={{
            borderColor: allSelected ? "#16815d" : "#cbd5e1",
            backgroundColor: allSelected ? "#16815d" : "white",
          }}
        >
          {allSelected && (
            <svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="none">
              <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
        <span className="text-sm font-semibold text-[#1c2734]">
          Select All ({count} item{count !== 1 ? "s" : ""})
        </span>
      </label>

      {/* Two-column layout */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Cart items */}
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <CartItemCard
                key={item.product.slug}
                item={item}
                selected={selected.has(item.product.slug)}
                onUpdateQuantity={updateQuantity}
                onRemove={confirmRemove}
                onSave={handleSave}
                onToggleSelect={toggleSelect}
                saved={isSaved(item.product.slug)}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Price details sidebar */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <PriceDetails
            subtotal={selectedSubtotal}
            itemCount={selectedCount}
            onCheckout={goToCheckout}
            checkingOut={false}
            selectedItems={selectedItems.length}
            totalItems={count}
          />
        </div>
      </div>
    </main>
  );
}
