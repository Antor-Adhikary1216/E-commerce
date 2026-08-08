"use client";
import { useEffect } from "react";
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
  const { items, count, subtotal, updateQuantity, remove, clear } = useCart();
  const { toggle, isSaved } = useWishlist();
  const requireAuth = useRequireAuth();
  const router = useRouter();

  useEffect(() => {
    requireAuth();
  }, []);

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
      title: "Remove all items?",
      text: "All items will be removed from your cart.",
      showCancelButton: true,
      confirmButtonText: "Yes, remove all",
      cancelButtonText: "Cancel",
    });
    if (result.isConfirmed) {
      clear();
      toast.success("Cart cleared");
    }
  }

  function handleSave(slug: string) {
    const item = items.find((i) => i.product.slug === slug);
    if (!item) return;
    toggle(item.product);
    toast.success(isSaved(slug) ? "Removed from saved" : "Saved for later");
  }

  function goToPlaceOrder() {
    if (!requireAuth()) return;
    router.push("/place-order");
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

      {/* Two-column layout */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Cart items */}
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <CartItemCard
                key={item.product.slug}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={confirmRemove}
                onSave={handleSave}
                saved={isSaved(item.product.slug)}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Price details sidebar */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <PriceDetails
            subtotal={subtotal}
            itemCount={count}
            onCheckout={goToPlaceOrder}
            checkingOut={false}
          />
        </div>
      </div>
    </main>
  );
}
