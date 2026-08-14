"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, ChevronRight } from "lucide-react";
import { useRequireAuth } from "@/lib/use-require-auth";
import { apiClient } from "@/services/api-client";
import { currency } from "@/lib/utils";
import { EmptyState } from "@/components/empty-state";
import { Skeleton } from "@/components/ui/skeleton";

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

export default function OrdersPage() {
  const requireAuth = useRequireAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!requireAuth()) {
      setLoading(false);
      return;
    }
    apiClient
      .get("/orders")
      .then(({ data }) => setOrders(data.orders))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [requireAuth]);

  if (loading) {
    return (
      <main className="mx-auto max-w-[1240px] px-4 py-10">
        <Skeleton className="h-8 w-48" />
        <div className="mt-6 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-[0_1px_4px_rgba(0,0,0,.12)]">
              <Skeleton className="h-12 w-12 shrink-0 rounded-xl" />
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
                <Skeleton className="h-3 w-40" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          ))}
        </div>
      </main>
    );
  }

  if (orders.length === 0) {
    return (
      <EmptyState
        icon={<Package size={28} />}
        title="No orders yet"
        message="When you place an order, it will appear here."
        action={{ href: "/shop", label: "Start shopping" }}
      />
    );
  }

  return (
    <main className="mx-auto max-w-[1240px] px-4 py-10">
      <h1 className="text-2xl font-black">My orders</h1>
      <div className="mt-6 space-y-3">
        {orders.map((order) => (
          <Link
            key={order._id}
            href={`/account/orders/${order._id}`}
            className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-[0_1px_4px_rgba(0,0,0,.12)] transition hover:shadow-md"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#e5ead9] text-[#16815d]">
              <Package size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold">{order.orderNumber}</span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${statusColors[order.status] ?? "bg-slate-100 text-slate-600"}`}>
                  {order.status.replace(/_/g, " ")}
                </span>
              </div>
              <p className="mt-0.5 text-[13px] text-slate-500">
                {order.items.length} item{order.items.length > 1 ? "s" : ""} &middot; {currency(order.total)}
              </p>
              <p className="text-[11px] text-slate-400">
                {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </p>
            </div>
            <ChevronRight size={18} className="shrink-0 text-slate-300" />
          </Link>
        ))}
      </div>
    </main>
  );
}
