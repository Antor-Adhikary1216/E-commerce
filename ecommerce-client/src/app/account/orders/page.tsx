"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, ChevronRight, Trash2, XCircle } from "lucide-react";
import toast from "react-hot-toast";
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
  pending: "bg-[#fff7e6] text-[#d48806]",
  confirmed: "bg-[#e6f7ff] text-[#0050b3]",
  packed: "bg-[#f0f5ff] text-[#1d39c4]",
  shipped: "bg-[#f9f0ff] text-[#531dab]",
  out_for_delivery: "bg-[#fff7e6] text-[#d46b08]",
  delivered: "bg-[#f6ffed] text-[#389e0d]",
  cancelled: "bg-[#fff2f0] text-[#cf1322]",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [cancelConfirm, setCancelConfirm] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    apiClient
      .get("/orders")
      .then(({ data }) => setOrders(data.orders))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(orderId: string) {
    setDeleting(true);
    try {
      await apiClient.delete(`/orders/${orderId}`);
      setOrders((prev) => prev.filter((o) => o._id !== orderId));
      setDeleteConfirm(null);
    } catch {
      // ignore
    } finally {
      setDeleting(false);
    }
  }

  async function handleCancel(orderId: string) {
    setCancelling(true);
    try {
      await apiClient.put(`/orders/${orderId}/cancel`);
      setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, status: "cancelled" } : o)));
      setCancelConfirm(null);
      toast.success("Order cancelled successfully");
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Could not cancel order");
    } finally {
      setCancelling(false);
    }
  }

  if (loading) {
    return (
      <main className="p-4 sm:px-6 py-6">
        <Skeleton className="h-7 w-40" />
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
    <main className="p-4 sm:px-6 py-6">
      <h1 className="text-[20px] font-semibold leading-[26px] text-[#262626]">My Orders</h1>
      <p className="mt-1 text-[13px] leading-[20px] text-[#8c8c8c]">View and manage your orders</p>
      
      <div className="mt-5 space-y-3">
        {orders.map((order) => (
          <div
            key={order._id}
            className="flex items-center gap-3 rounded-lg border border-[#f0f0f0] bg-[#fafafb] p-4 transition-colors duration-225 hover:bg-[#f5f5f5]"
          >
            <Link href={`/account/orders/${order._id}`} className="flex flex-1 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-[#e6f7ff] text-[#1677ff]">
                <Package size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-medium text-[#262626]">{order.orderNumber}</span>
                  <span className={`rounded px-1.5 py-0.5 text-[11px] font-medium capitalize ${statusColors[order.status] ?? "bg-[#f5f5f5] text-[#8c8c8c]"}`}>
                    {order.status.replace(/_/g, " ")}
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
            
            {/* Cancel Button */}
            {["pending", "confirmed"].includes(order.status) && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setCancelConfirm(order._id);
                }}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded text-[#8c8c8c] transition-colors duration-150 hover:bg-[#fff7e6] hover:text-[#d48806]"
                aria-label="Cancel order"
              >
                <XCircle size={16} />
              </button>
            )}

            {/* Delete Button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                setDeleteConfirm(order._id);
              }}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded text-[#8c8c8c] transition-colors duration-150 hover:bg-[#fff2f0] hover:text-[#cf1322]"
              aria-label="Delete order"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
            <h3 className="text-[16px] font-semibold text-[#262626]">Delete Order</h3>
            <p className="mt-2 text-[14px] text-[#8c8c8c]">
              Are you sure you want to delete this order? This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="rounded-lg border border-[#f0f0f0] bg-[#fafafb] px-4 py-2 text-[14px] font-medium text-[#262626] transition-colors duration-225 hover:bg-[#f5f5f5]"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={deleting}
                className="rounded-lg bg-[#ff3b30] px-4 py-2 text-[14px] font-medium text-white transition-colors duration-225 hover:bg-[#ff453a] disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {cancelConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
            <h3 className="text-[16px] font-semibold text-[#262626]">Cancel Order</h3>
            <p className="mt-2 text-[14px] text-[#8c8c8c]">
              Are you sure you want to cancel this order?
              {orders.find((o) => o._id === cancelConfirm)?.paymentMethod === "stripe" &&
                " Since you paid online, a refund will be initiated to your original payment method."}
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setCancelConfirm(null)}
                className="rounded-lg border border-[#f0f0f0] bg-[#fafafb] px-4 py-2 text-[14px] font-medium text-[#262626] transition-colors duration-225 hover:bg-[#f5f5f5]"
              >
                Keep Order
              </button>
              <button
                onClick={() => handleCancel(cancelConfirm)}
                disabled={cancelling}
                className="rounded-lg bg-[#d48806] px-4 py-2 text-[14px] font-medium text-white transition-colors duration-225 hover:bg-[#d46b08] disabled:opacity-50"
              >
                {cancelling ? "Cancelling..." : "Cancel Order"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
