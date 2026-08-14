"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { useCart } from "@/store/cart";
import { apiClient } from "@/services/api-client";
import { useRequireAuth } from "@/lib/use-require-auth";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const { clear } = useCart();
  const requireAuth = useRequireAuth();
  const sessionId = searchParams.get("session_id");
  const orderNumberParam = searchParams.get("order_number");
  const [orderNumber, setOrderNumber] = useState<string | null>(orderNumberParam);

  useEffect(() => {
    if (sessionId && requireAuth()) {
      apiClient
        .get(`/orders/session/${sessionId}`)
        .then(({ data }) => {
          setOrderNumber(data.order.orderNumber);
          clear();
        })
        .catch(() => {});
    }
  }, [clear, sessionId, requireAuth]);

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 py-16 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#16815d]/10 text-[#16815d]">
        <CheckCircle2 size={32} />
      </span>
      <h1 className="mt-5 text-2xl font-black">Order confirmed</h1>
      <p className="mt-2 text-[13px] leading-6 text-slate-500">
        Thanks for your order. We&apos;ve received your payment and your order is now being processed. A confirmation will reach you shortly.
      </p>
      {orderNumber && (
        <div className="mt-5 rounded-xl bg-[#e5ead9] px-4 py-2.5 text-sm font-bold text-[#16815d]">
          Order #{orderNumber}
        </div>
      )}
      <div className="mt-7 flex w-full flex-col gap-2.5">
        <Link href="/account/orders" className="rounded-full bg-[#16815d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#147a56]">
          View my orders
        </Link>
        <Link href="/shop" className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-[#1c2734] transition hover:bg-slate-50">
          Continue shopping
        </Link>
      </div>
    </main>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
