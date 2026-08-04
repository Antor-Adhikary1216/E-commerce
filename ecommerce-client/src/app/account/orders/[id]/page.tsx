"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Package } from "lucide-react";
import { useRequireAuth } from "@/lib/use-require-auth";
import { apiClient } from "@/services/api-client";
import { currency } from "@/lib/utils";

interface OrderItem {
  product: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingCost: number;
  tax: number;
  total: number;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  packed: "bg-indigo-100 text-indigo-700",
  shipped: "bg-purple-100 text-purple-700",
  out_for_delivery: "bg-orange-100 text-orange-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const steps = ["pending", "confirmed", "packed", "shipped", "out_for_delivery", "delivered"];

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const requireAuth = useRequireAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!requireAuth()) {
      setLoading(false);
      return;
    }
    apiClient
      .get(`/orders/${params.id}`)
      .then(({ data }) => setOrder(data.order))
      .catch(() => router.push("/account/orders"))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <main className="mx-auto max-w-[1240px] px-4 py-10">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 rounded-lg bg-slate-100" />
          <div className="h-64 rounded-2xl bg-slate-100" />
        </div>
      </main>
    );
  }

  if (!order) return null;

  const currentStep = steps.indexOf(order.status);

  return (
    <main className="mx-auto max-w-[1240px] px-4 py-10">
      <button onClick={() => router.back()} className="mb-6 inline-flex items-center gap-1.5 text-[13px] font-semibold text-slate-500 hover:text-[#16815d]">
        <ArrowLeft size={16} /> Back to orders
      </button>

      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-black">{order.orderNumber}</h1>
        <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${statusColors[order.status] ?? "bg-slate-100 text-slate-600"}`}>
          {order.status.replace(/_/g, " ")}
        </span>
      </div>
      <p className="mt-1 text-[13px] text-slate-500">
        Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
      </p>

      {/* Progress tracker */}
      <div className="mt-8 rounded-2xl bg-white p-5 shadow-[0_1px_4px_rgba(0,0,0,.12)]">
        <h2 className="mb-4 text-sm font-bold">Order status</h2>
        <div className="flex items-center gap-1">
          {steps.map((step, i) => (
            <div key={step} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                <div className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold ${i <= currentStep ? "bg-[#16815d] text-white" : "bg-slate-100 text-slate-400"}`}>
                  {i + 1}
                </div>
                <span className="mt-1 text-[10px] capitalize text-slate-500">{step.replace(/_/g, " ")}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`mx-1 h-0.5 flex-1 ${i < currentStep ? "bg-[#16815d]" : "bg-slate-100"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Items */}
      <div className="mt-4 rounded-2xl bg-white p-5 shadow-[0_1px_4px_rgba(0,0,0,.12)]">
        <h2 className="mb-4 text-sm font-bold">Items ({order.items.length})</h2>
        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={item.product} className="flex gap-3">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#f3f0e9]">
                {item.image ? (
                  <Image src={item.image} alt={item.name} fill sizes="64px" className="object-contain p-1" />
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-300">
                    <Package size={20} />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <Link href={`/products/${item.product}`} className="line-clamp-1 text-[13px] font-semibold hover:text-[#16815d]">
                  {item.name}
                </Link>
                <p className="text-[12px] text-slate-500">Qty: {item.quantity}</p>
              </div>
              <span className="text-sm font-bold">{currency(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="mt-4 rounded-2xl bg-white p-5 shadow-[0_1px_4px_rgba(0,0,0,.12)]">
        <h2 className="mb-4 text-sm font-bold">Payment summary</h2>
        <dl className="space-y-2 text-[13px]">
          <div className="flex justify-between">
            <dt className="text-slate-500">Subtotal</dt>
            <dd className="font-semibold">{currency(order.subtotal)}</dd>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between">
              <dt className="text-slate-500">Discount</dt>
              <dd className="font-semibold text-green-600">-{currency(order.discount)}</dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt className="text-slate-500">Shipping</dt>
            <dd className="font-semibold text-[#16815d]">{order.shippingCost > 0 ? currency(order.shippingCost) : "Free"}</dd>
          </div>
          {order.tax > 0 && (
            <div className="flex justify-between">
              <dt className="text-slate-500">Tax</dt>
              <dd className="font-semibold">{currency(order.tax)}</dd>
            </div>
          )}
          <div className="flex justify-between border-t border-slate-100 pt-2.5 text-sm">
            <dt className="font-bold">Total</dt>
            <dd className="font-black">{currency(order.total)}</dd>
          </div>
        </dl>
        <div className="mt-4 flex items-center gap-2 text-[12px] text-slate-500">
          <span className="font-medium capitalize">Payment: {order.paymentMethod}</span>
          <span>&middot;</span>
          <span className={`font-medium capitalize ${order.paymentStatus === "paid" ? "text-green-600" : order.paymentStatus === "failed" ? "text-red-500" : ""}`}>
            {order.paymentStatus}
          </span>
        </div>
      </div>
    </main>
  );
}
