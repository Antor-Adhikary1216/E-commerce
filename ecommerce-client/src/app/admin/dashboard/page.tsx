"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  TrendingUp,
  ChevronRight,
} from "lucide-react";
import { apiClient } from "@/services/api-client";
import { currency } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardStats {
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  totalRevenue: number;
  ordersByStatus: { _id: string; count: number }[];
  recentOrders: {
    _id: string;
    orderNumber: string;
    status: string;
    total: number;
    createdAt: string;
  }[];
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

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState<string>("Admin");

  useEffect(() => {
    apiClient
      .get("/admin/dashboard")
      .then(({ data }) => setStats(data))
      .catch(() => {})
      .finally(() => setLoading(false));

    apiClient
      .get("/user/profile")
      .then(({ data }) => setAdminName(data.user?.name || "Admin"))
      .catch(() => {});
  }, []);

  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  }

  if (loading) {
    return (
      <div className="p-4 sm:p-6">
        <Skeleton className="h-7 w-48" />
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-lg border border-[#f0f0f0] bg-white p-5">
              <Skeleton className="h-3.5 w-20" />
              <Skeleton className="mt-2 h-6 w-14" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Dashboard Header */}
      <div className="rounded-xl bg-gradient-to-r from-[#1c2734] to-[#2a3a4e] p-6 text-white">
        <h1 className="text-[24px] font-bold leading-[30px]">
          {getGreeting()}, {adminName}
        </h1>
        <p className="mt-1 text-[14px] text-white/60">Here&apos;s what&apos;s happening with your store today</p>
      </div>

      {/* Stats Cards */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-[#f0f0f0] bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded bg-[#e6f7ff] text-[#1677ff]">
              <DollarSign size={18} />
            </div>
            <div>
              <p className="text-[20px] font-semibold text-[#262626]">{currency(stats?.totalRevenue || 0)}</p>
              <p className="text-[12px] text-[#8c8c8c]">Total Revenue</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-[#f0f0f0] bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded bg-[#f6ffed] text-[#389e0d]">
              <ShoppingCart size={18} />
            </div>
            <div>
              <p className="text-[20px] font-semibold text-[#262626]">{stats?.totalOrders || 0}</p>
              <p className="text-[12px] text-[#8c8c8c]">Total Orders</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-[#f0f0f0] bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded bg-[#f9f0ff] text-[#531dab]">
              <Users size={18} />
            </div>
            <div>
              <p className="text-[20px] font-semibold text-[#262626]">{stats?.totalUsers || 0}</p>
              <p className="text-[12px] text-[#8c8c8c]">Total Users</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-[#f0f0f0] bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded bg-[#fff7e6] text-[#d48806]">
              <Package size={18} />
            </div>
            <div>
              <p className="text-[20px] font-semibold text-[#262626]">{stats?.totalProducts || 0}</p>
              <p className="text-[12px] text-[#8c8c8c]">Total Products</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Link
          href="/admin/products"
          className="flex items-center justify-between rounded-lg border border-[#f0f0f0] bg-white p-4 transition-all duration-225 hover:border-[#1677ff]"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded bg-[#e6f7ff] text-[#1677ff]">
              <Package size={18} />
            </div>
            <div>
              <p className="text-[14px] font-medium text-[#262626]">Manage Products</p>
              <p className="text-[12px] text-[#8c8c8c]">Add, edit, delete products</p>
            </div>
          </div>
          <ChevronRight size={16} className="text-[#8c8c8c]" />
        </Link>

        <Link
          href="/admin/orders"
          className="flex items-center justify-between rounded-lg border border-[#f0f0f0] bg-white p-4 transition-all duration-225 hover:border-[#1677ff]"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded bg-[#f6ffed] text-[#389e0d]">
              <ShoppingCart size={18} />
            </div>
            <div>
              <p className="text-[14px] font-medium text-[#262626]">Manage Orders</p>
              <p className="text-[12px] text-[#8c8c8c]">View and update orders</p>
            </div>
          </div>
          <ChevronRight size={16} className="text-[#8c8c8c]" />
        </Link>

        <Link
          href="/admin/users"
          className="flex items-center justify-between rounded-lg border border-[#f0f0f0] bg-white p-4 transition-all duration-225 hover:border-[#1677ff]"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded bg-[#f9f0ff] text-[#531dab]">
              <Users size={18} />
            </div>
            <div>
              <p className="text-[14px] font-medium text-[#262626]">Manage Users</p>
              <p className="text-[12px] text-[#8c8c8c]">View users and roles</p>
            </div>
          </div>
          <ChevronRight size={16} className="text-[#8c8c8c]" />
        </Link>
      </div>

      {/* Orders by Status */}
      {stats?.ordersByStatus && stats.ordersByStatus.length > 0 && (
        <div className="mt-6">
          <h2 className="text-[16px] font-semibold text-[#262626]">Orders by Status</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {stats.ordersByStatus.map((item) => (
              <div key={item._id} className="rounded-lg border border-[#f0f0f0] bg-white p-4 text-center">
                <p className="text-[20px] font-semibold text-[#262626]">{item.count}</p>
                <p className={`mt-1 text-[11px] font-medium capitalize ${statusColors[item._id] || "bg-[#f5f5f5] text-[#8c8c8c]"}`}>
                  {item._id.replace(/_/g, " ")}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Orders */}
      {stats?.recentOrders && stats.recentOrders.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-[16px] font-semibold text-[#262626]">Recent Orders</h2>
            <Link href="/admin/orders" className="text-[13px] font-medium text-[#1677ff] hover:underline">
              View all
            </Link>
          </div>
          <div className="mt-4 overflow-x-auto rounded-lg border border-[#f0f0f0] bg-white">
            <table className="w-full min-w-[500px]">
              <thead>
                <tr className="border-b border-[#f0f0f0] bg-[#fafafb]">
                  <th className="px-4 py-3 text-left text-[12px] font-medium text-[#8c8c8c]">Order</th>
                  <th className="px-4 py-3 text-left text-[12px] font-medium text-[#8c8c8c]">Status</th>
                  <th className="px-4 py-3 text-left text-[12px] font-medium text-[#8c8c8c]">Total</th>
                  <th className="px-4 py-3 text-left text-[12px] font-medium text-[#8c8c8c]">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order) => (
                  <tr key={order._id} className="border-b border-[#f0f0f0] last:border-0">
                    <td className="px-4 py-3 text-[13px] font-medium text-[#262626]">{order.orderNumber}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded px-1.5 py-0.5 text-[11px] font-medium capitalize ${statusColors[order.status] || "bg-[#f5f5f5] text-[#8c8c8c]"}`}>
                        {order.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[13px] text-[#262626]">{currency(order.total)}</td>
                    <td className="px-4 py-3 text-[12px] text-[#8c8c8c]">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
