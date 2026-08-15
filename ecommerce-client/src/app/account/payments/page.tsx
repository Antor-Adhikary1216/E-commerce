"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CreditCard,
  ChevronRight,
  Filter,
  Calendar,
  ArrowUpDown,
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

interface PaymentOrder {
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

const paymentStatusColors: Record<string, string> = {
  pending: "bg-[#fff7e6] text-[#d48806]",
  paid: "bg-[#f6ffed] text-[#389e0d]",
  failed: "bg-[#fff2f0] text-[#cf1322]",
};

const paymentMethodIcons: Record<string, string> = {
  stripe: "💳",
  cod: "💵",
};

export default function PaymentsPage() {
  const [payments, setPayments] = useState<PaymentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "paid" | "pending" | "failed">("all");
  const [sortBy, setSortBy] = useState<"date" | "amount">("date");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  useEffect(() => {
    fetchPayments();
  }, []);

  async function fetchPayments() {
    try {
      const { data } = await apiClient.get("/orders?limit=50");
      setPayments(data.orders || []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  const filteredPayments = payments
    .filter((payment) => filter === "all" || payment.paymentStatus === filter)
    .sort((a, b) => {
      if (sortBy === "date") {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
      } else {
        return sortOrder === "desc" ? b.total - a.total : a.total - b.total;
      }
    });

  const totalPaid = payments
    .filter((p) => p.paymentStatus === "paid")
    .reduce((sum, p) => sum + p.total, 0);

  const totalPending = payments
    .filter((p) => p.paymentStatus === "pending")
    .reduce((sum, p) => sum + p.total, 0);

  const totalFailed = payments
    .filter((p) => p.paymentStatus === "failed")
    .reduce((sum, p) => sum + p.total, 0);

  if (loading) {
    return (
      <main className="px-6 py-6">
        <Skeleton className="h-7 w-40" />
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
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
              <Skeleton className="h-5 w-16" />
            </div>
          ))}
        </div>
      </main>
    );
  }

  if (payments.length === 0) {
    return (
      <EmptyState
        icon={<CreditCard size={28} />}
        title="No payment history"
        message="When you make a purchase, your payment history will appear here."
        action={{ href: "/shop", label: "Start shopping" }}
      />
    );
  }

  return (
    <main className="px-6 py-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-semibold leading-[26px] text-[#262626]">Payment History</h1>
          <p className="mt-1 text-[13px] leading-[20px] text-[#8c8c8c]">View all your transactions and receipts</p>
        </div>
        <Link
          href="/account/dashboard"
          className="inline-flex items-center gap-1.5 rounded border border-[#f0f0f0] bg-[#fafafb] px-3 py-1.5 text-[13px] font-medium text-[#262626] transition-colors duration-225 hover:bg-[#f5f5f5]"
        >
          Back to Dashboard
        </Link>
      </div>

      {/* Payment Summary Cards */}
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-[#f0f0f0] bg-[#fafafb] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded bg-[#f6ffed] text-[#389e0d]">
              <CreditCard size={18} />
            </div>
            <div>
              <p className="text-[20px] font-semibold leading-[26px] text-[#389e0d]">{currency(totalPaid)}</p>
              <p className="text-[12px] leading-[18px] text-[#8c8c8c]">Total Paid</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-[#f0f0f0] bg-[#fafafb] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded bg-[#fff7e6] text-[#d48806]">
              <CreditCard size={18} />
            </div>
            <div>
              <p className="text-[20px] font-semibold leading-[26px] text-[#d48806]">{currency(totalPending)}</p>
              <p className="text-[12px] leading-[18px] text-[#8c8c8c]">Pending</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-[#f0f0f0] bg-[#fafafb] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded bg-[#fff2f0] text-[#cf1322]">
              <CreditCard size={18} />
            </div>
            <div>
              <p className="text-[20px] font-semibold leading-[26px] text-[#cf1322]">{currency(totalFailed)}</p>
              <p className="text-[12px] leading-[18px] text-[#8c8c8c]">Failed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-[#8c8c8c]" />
          <span className="text-[13px] font-medium text-[#262626]">Filter:</span>
        </div>
        <div className="flex gap-1.5">
          {(["all", "paid", "pending", "failed"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`rounded px-2.5 py-1 text-[12px] font-medium capitalize transition-colors duration-150 ${
                filter === status
                  ? "bg-[#1677ff] text-white"
                  : "bg-[#f5f5f5] text-[#8c8c8c] hover:bg-[#f0f0f0]"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <ArrowUpDown size={14} className="text-[#8c8c8c]" />
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [newSortBy, newSortOrder] = e.target.value.split("-") as ["date" | "amount", "desc" | "asc"];
              setSortBy(newSortBy);
              setSortOrder(newSortOrder);
            }}
            className="rounded border border-[#f0f0f0] bg-[#fafafb] px-2.5 py-1.5 text-[12px] font-medium text-[#262626] focus:border-[#1677ff] focus:outline-none"
          >
            <option value="date-desc">Newest first</option>
            <option value="date-asc">Oldest first</option>
            <option value="amount-desc">Highest amount</option>
            <option value="amount-asc">Lowest amount</option>
          </select>
        </div>
      </div>

      {/* Payment List */}
      <div className="mt-4 space-y-3">
        {filteredPayments.map((payment) => (
          <div
            key={payment._id}
            className="rounded-lg border border-[#f0f0f0] bg-[#fafafb] p-4 transition-colors duration-225 hover:bg-[#f5f5f5]"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-[#f5f5f5] text-[#8c8c8c]">
                <span className="text-[16px]">{paymentMethodIcons[payment.paymentMethod] || "💳"}</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-medium text-[#262626]">{payment.orderNumber}</span>
                  <span className={`rounded px-1.5 py-0.5 text-[11px] font-medium capitalize ${paymentStatusColors[payment.paymentStatus] ?? "bg-[#f5f5f5] text-[#8c8c8c]"}`}>
                    {payment.paymentStatus}
                  </span>
                </div>
                <p className="mt-0.5 text-[13px] leading-[20px] text-[#8c8c8c]">
                  {payment.items.length} item{payment.items.length > 1 ? "s" : ""} &middot; {payment.paymentMethod.toUpperCase()}
                </p>
                <div className="mt-1 flex items-center gap-3 text-[12px] text-[#8c8c8c]">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(payment.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                  {payment.discount > 0 && (
                    <span className="text-[#389e0d]">Discount: -{currency(payment.discount)}</span>
                  )}
                  {payment.shippingCost > 0 && (
                    <span>Shipping: {currency(payment.shippingCost)}</span>
                  )}
                  {payment.tax > 0 && (
                    <span>Tax: {currency(payment.tax)}</span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-[16px] font-semibold text-[#262626]">{currency(payment.total)}</p>
                <Link
                  href={`/account/orders/${payment._id}`}
                  className="mt-1 inline-flex items-center gap-1 text-[12px] font-medium text-[#1677ff] hover:underline"
                >
                  View details <ChevronRight size={12} />
                </Link>
              </div>
            </div>

            {/* Order Items Preview */}
            {payment.items.length > 0 && (
              <div className="mt-3 border-t border-[#f0f0f0] pt-3">
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {payment.items.slice(0, 3).map((item, index) => (
                    <div key={index} className="flex items-center gap-2 rounded bg-[#f5f5f5] px-2 py-1">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-5 w-5 rounded object-cover"
                        />
                      )}
                      <span className="whitespace-nowrap text-[12px] text-[#262626]">
                        {item.name} × {item.quantity}
                      </span>
                    </div>
                  ))}
                  {payment.items.length > 3 && (
                    <span className="whitespace-nowrap text-[12px] text-[#8c8c8c]">
                      +{payment.items.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredPayments.length === 0 && (
        <div className="mt-8 text-center">
          <p className="text-[13px] text-[#8c8c8c]">No payments found with the selected filter.</p>
          <button
            onClick={() => setFilter("all")}
            className="mt-2 text-[13px] font-medium text-[#1677ff] hover:underline"
          >
            Clear filter
          </button>
        </div>
      )}
    </main>
  );
}
