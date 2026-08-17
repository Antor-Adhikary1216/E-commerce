"use client";
import { useEffect, useState } from "react";
import {
  ShoppingCart,
  Search,
  X,
  ChevronDown,
} from "lucide-react";
import { apiClient } from "@/services/api-client";
import { currency } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface Order {
  _id: string;
  orderNumber: string;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  total: number;
  createdAt: string;
  user: { name: string; email: string };
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

const statusOptions = ["pending", "confirmed", "packed", "shipped", "out_for_delivery", "delivered", "cancelled"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  async function fetchOrders() {
    setLoading(true);
    try {
      const params = statusFilter ? `?status=${statusFilter}&limit=50` : "?limit=50";
      const { data } = await apiClient.get(`/admin/orders${params}`);
      setOrders(data.orders || []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(orderId: string, newStatus: string) {
    setUpdatingId(orderId);
    try {
      await apiClient.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch {
      // ignore
    } finally {
      setUpdatingId(null);
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <Skeleton className="h-7 w-48" />
        <div className="mt-6 space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4 rounded-lg border border-[#f0f0f0] bg-white p-4">
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
              <Skeleton className="h-8 w-24" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-semibold text-[#262626]">Orders</h1>
          <p className="mt-1 text-[13px] text-[#8c8c8c]">Manage customer orders</p>
        </div>
      </div>

      {/* Status Filter */}
      <div className="mt-5 flex gap-2">
        <button
          onClick={() => setStatusFilter("")}
          className={`rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors ${
            !statusFilter ? "bg-[#1677ff] text-white" : "bg-[#f5f5f5] text-[#8c8c8c] hover:bg-[#f0f0f0]"
          }`}
        >
          All
        </button>
        {statusOptions.map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`rounded-lg px-3 py-1.5 text-[12px] font-medium capitalize transition-colors ${
              statusFilter === status ? "bg-[#1677ff] text-white" : "bg-[#f5f5f5] text-[#8c8c8c] hover:bg-[#f0f0f0]"
            }`}
          >
            {status.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="mt-4 overflow-hidden rounded-lg border border-[#f0f0f0] bg-white">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#f0f0f0] bg-[#fafafb]">
              <th className="px-4 py-3 text-left text-[12px] font-medium text-[#8c8c8c]">Order</th>
              <th className="px-4 py-3 text-left text-[12px] font-medium text-[#8c8c8c]">Customer</th>
              <th className="px-4 py-3 text-left text-[12px] font-medium text-[#8c8c8c]">Total</th>
              <th className="px-4 py-3 text-left text-[12px] font-medium text-[#8c8c8c]">Payment</th>
              <th className="px-4 py-3 text-left text-[12px] font-medium text-[#8c8c8c]">Status</th>
              <th className="px-4 py-3 text-left text-[12px] font-medium text-[#8c8c8c]">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-b border-[#f0f0f0] last:border-0 hover:bg-[#fafafb]">
                <td className="px-4 py-3 text-[13px] font-medium text-[#262626]">{order.orderNumber}</td>
                <td className="px-4 py-3">
                  <p className="text-[13px] text-[#262626]">{order.user?.name || "Unknown"}</p>
                  <p className="text-[11px] text-[#8c8c8c]">{order.user?.email || ""}</p>
                </td>
                <td className="px-4 py-3 text-[13px] text-[#262626]">{currency(order.total)}</td>
                <td className="px-4 py-3">
                  <span className="text-[12px] capitalize text-[#8c8c8c]">{order.paymentMethod}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="relative">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      disabled={updatingId === order._id}
                      className={`appearance-none rounded px-2 py-1 pr-6 text-[11px] font-medium capitalize ${statusColors[order.status] || "bg-[#f5f5f5] text-[#8c8c8c]"}`}
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
                      ))}
                    </select>
                    <ChevronDown size={12} className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2" />
                  </div>
                </td>
                <td className="px-4 py-3 text-[12px] text-[#8c8c8c]">
                  {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-[13px] text-[#8c8c8c]">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
