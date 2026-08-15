"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Package,
  CreditCard,
  Truck,
  ShoppingBag,
  Clock,
  ChevronRight,
  CheckCircle2,
  XCircle,
} from "lucide-react";
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
  shippingAddress?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
  };
}

interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  deliveredOrders: number;
  totalSpent: number;
  recentOrders: Order[];
}

const statusColors: Record<string, string> = {
  pending: "bg-[#fff7e6] text-[#d48806]",
  confirmed: "bg-[#e6f7ff] text-[#0050b3]",
  packed: "bg-[#f0f5ff] text-[#1d39c4]",
  shipped: "bg-[#f9f0ff] text-[#531dab]",
  out_for_delivery: "bg-[#fff7e6] text-[#d46b08]",
  delivered: "bg-[#f6ffed] text-[#389e0d]",
  cancelled: "bg-[#fff2f0] text-[#cf1322]",
};

const paymentStatusColors: Record<string, string> = {
  pending: "bg-[#fff7e6] text-[#d48806]",
  paid: "bg-[#f6ffed] text-[#389e0d]",
  failed: "bg-[#fff2f0] text-[#cf1322]",
};

const statusIcons: Record<string, React.ReactNode> = {
  pending: <Clock size={14} />,
  confirmed: <CheckCircle2 size={14} />,
  packed: <Package size={14} />,
  shipped: <Truck size={14} />,
  out_for_delivery: <Truck size={14} />,
  delivered: <CheckCircle2 size={14} />,
  cancelled: <XCircle size={14} />,
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasPurchases, setHasPurchases] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      const { data } = await apiClient.get("/orders?limit=5");
      const orders = data.orders || [];

      const totalOrders = data.pagination?.total || orders.length;
      const pendingOrders = orders.filter((o: Order) =>
        ["pending", "confirmed", "packed", "shipped", "out_for_delivery"].includes(o.status)
      ).length;
      const deliveredOrders = orders.filter((o: Order) => o.status === "delivered").length;
      const totalSpent = orders.reduce((sum: number, o: Order) => sum + o.total, 0);

      setStats({
        totalOrders,
        pendingOrders,
        deliveredOrders,
        totalSpent,
        recentOrders: orders.slice(0, 3),
      });

      setHasPurchases(totalOrders > 0);
    } catch {
      setHasPurchases(false);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="px-6 py-6">
        <Skeleton className="h-7 w-40" />
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-lg border border-[#f0f0f0] bg-[#fafafb] p-5">
              <Skeleton className="h-3.5 w-20" />
              <Skeleton className="mt-2 h-6 w-14" />
            </div>
          ))}
        </div>
        <div className="mt-5 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg border border-[#f0f0f0] bg-[#fafafb] p-4">
              <Skeleton className="h-10 w-10 shrink-0 rounded" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          ))}
        </div>
      </main>
    );
  }

  if (!hasPurchases) {
    return (
      <EmptyState
        icon={<ShoppingBag size={28} />}
        title="No purchases yet"
        message="Start shopping to activate your dashboard and track your orders, payments, and purchases."
        action={{ href: "/shop", label: "Start shopping" }}
      />
    );
  }

  return (
    <main className="px-6 py-6">
      {/* Header */}
      <div>
        <h1 className="text-[20px] font-semibold leading-[26px] text-[#262626]">Dashboard</h1>
        <p className="mt-1 text-[13px] leading-[20px] text-[#8c8c8c]">Track your orders, payments, and purchases</p>
      </div>

      {/* Stats Cards */}
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-[#f0f0f0] bg-[#fafafb] p-5 transition-colors duration-225 hover:bg-[#f5f5f5]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded bg-[#e6f7ff] text-[#1677ff]">
              <Package size={18} />
            </div>
            <div>
              <p className="text-[20px] font-semibold leading-[26px] text-[#262626]">{stats?.totalOrders || 0}</p>
              <p className="text-[12px] leading-[18px] text-[#8c8c8c]">Total Orders</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-[#f0f0f0] bg-[#fafafb] p-5 transition-colors duration-225 hover:bg-[#f5f5f5]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded bg-[#fff7e6] text-[#d48806]">
              <Truck size={18} />
            </div>
            <div>
              <p className="text-[20px] font-semibold leading-[26px] text-[#262626]">{stats?.pendingOrders || 0}</p>
              <p className="text-[12px] leading-[18px] text-[#8c8c8c]">In Progress</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-[#f0f0f0] bg-[#fafafb] p-5 transition-colors duration-225 hover:bg-[#f5f5f5]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded bg-[#f6ffed] text-[#389e0d]">
              <CheckCircle2 size={18} />
            </div>
            <div>
              <p className="text-[20px] font-semibold leading-[26px] text-[#262626]">{stats?.deliveredOrders || 0}</p>
              <p className="text-[12px] leading-[18px] text-[#8c8c8c]">Delivered</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-[#f0f0f0] bg-[#fafafb] p-5 transition-colors duration-225 hover:bg-[#f5f5f5]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded bg-[#f9f0ff] text-[#531dab]">
              <CreditCard size={18} />
            </div>
            <div>
              <p className="text-[20px] font-semibold leading-[26px] text-[#262626]">{currency(stats?.totalSpent || 0)}</p>
              <p className="text-[12px] leading-[18px] text-[#8c8c8c]">Total Spent</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Link
          href="/account/orders"
          className="flex items-center justify-between rounded-lg border border-[#f0f0f0] bg-[#fafafb] p-4 transition-all duration-225 hover:border-[#1677ff] hover:bg-[#f5f5f5]"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded bg-[#e6f7ff] text-[#1677ff]">
              <Truck size={18} />
            </div>
            <div>
              <p className="text-[14px] font-medium leading-[22px] text-[#262626]">Track Orders</p>
              <p className="text-[12px] leading-[18px] text-[#8c8c8c]">View order status and shipping</p>
            </div>
          </div>
          <ChevronRight size={16} className="text-[#8c8c8c]" />
        </Link>

        <Link
          href="/account/payments"
          className="flex items-center justify-between rounded-lg border border-[#f0f0f0] bg-[#fafafb] p-4 transition-all duration-225 hover:border-[#1677ff] hover:bg-[#f5f5f5]"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded bg-[#f6ffed] text-[#389e0d]">
              <CreditCard size={18} />
            </div>
            <div>
              <p className="text-[14px] font-medium leading-[22px] text-[#262626]">Payment History</p>
              <p className="text-[12px] leading-[18px] text-[#8c8c8c]">View transactions and receipts</p>
            </div>
          </div>
          <ChevronRight size={16} className="text-[#8c8c8c]" />
        </Link>

        <Link
          href="/account/orders"
          className="flex items-center justify-between rounded-lg border border-[#f0f0f0] bg-[#fafafb] p-4 transition-all duration-225 hover:border-[#1677ff] hover:bg-[#f5f5f5]"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded bg-[#f9f0ff] text-[#531dab]">
              <Package size={18} />
            </div>
            <div>
              <p className="text-[14px] font-medium leading-[22px] text-[#262626]">Purchased Products</p>
              <p className="text-[12px] leading-[18px] text-[#8c8c8c]">View product details and invoices</p>
            </div>
          </div>
          <ChevronRight size={16} className="text-[#8c8c8c]" />
        </Link>
      </div>

      {/* Recent Orders */}
      {stats?.recentOrders && stats.recentOrders.length > 0 && (
        <div className="mt-5">
          <div className="flex items-center justify-between">
            <h2 className="text-[16px] font-semibold leading-[24px] text-[#262626]">Recent Orders</h2>
            <Link href="/account/orders" className="text-[13px] font-medium text-[#1677ff] hover:underline">
              View all
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {stats.recentOrders.map((order) => (
              <Link
                key={order._id}
                href={`/account/orders/${order._id}`}
                className="flex items-center gap-3 rounded-lg border border-[#f0f0f0] bg-[#fafafb] p-4 transition-all duration-225 hover:border-[#1677ff] hover:bg-[#f5f5f5]"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-[#e6f7ff] text-[#1677ff]">
                  {statusIcons[order.status] || <Package size={18} />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-medium text-[#262626]">{order.orderNumber}</span>
                    <span className={`rounded px-1.5 py-0.5 text-[11px] font-medium capitalize ${statusColors[order.status] ?? "bg-[#f5f5f5] text-[#8c8c8c]"}`}>
                      {order.status.replace(/_/g, " ")}
                    </span>
                    <span className={`rounded px-1.5 py-0.5 text-[11px] font-medium capitalize ${paymentStatusColors[order.paymentStatus] ?? "bg-[#f5f5f5] text-[#8c8c8c]"}`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[13px] leading-[20px] text-[#8c8c8c]">
                    {order.items.length} item{order.items.length > 1 ? "s" : ""} &middot; {currency(order.total)}
                  </p>
                  <p className="text-[12px] leading-[18px] text-[#8c8c8c]">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <ChevronRight size={16} className="shrink-0 text-[#8c8c8c]" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Payment Summary */}
      {stats?.recentOrders && stats.recentOrders.length > 0 && (
        <div className="mt-5">
          <h2 className="text-[16px] font-semibold leading-[24px] text-[#262626]">Payment Summary</h2>
          <div className="mt-4 rounded-lg border border-[#f0f0f0] bg-[#fafafb] p-5">
            <div className="space-y-3">
              {stats.recentOrders.map((order) => (
                <div key={order._id} className="flex items-center justify-between border-b border-[#f0f0f0] pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-[#f5f5f5] text-[#8c8c8c]">
                      <CreditCard size={14} />
                    </div>
                    <div>
                      <p className="text-[14px] font-medium text-[#262626]">{order.orderNumber}</p>
                      <p className="text-[12px] text-[#8c8c8c] capitalize">{order.paymentMethod} &middot; {order.paymentStatus}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[14px] font-semibold text-[#262626]">{currency(order.total)}</p>
                    <p className="text-[12px] text-[#8c8c8c]">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
