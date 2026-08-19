"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CreditCard,
  DollarSign,
  Search,
  Filter,
  X,
  ChevronDown,
  ChevronRight,
  Eye,
} from "lucide-react";
import { apiClient } from "@/services/api-client";
import { currency } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface PaymentItem {
  _id: string;
  orderNumber: string;
  user: { _id: string; name: string; email: string };
  paymentMethod: "stripe" | "cod";
  paymentStatus: "pending" | "paid" | "failed";
  total: number;
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

const paymentStatusColors: Record<string, string> = {
  pending: "bg-[#fff7e6] text-[#d48806]",
  paid: "bg-[#f6ffed] text-[#389e0d]",
  failed: "bg-[#fff2f0] text-[#cf1322]",
};

const paymentMethodLabels: Record<string, string> = {
  stripe: "Online (Stripe)",
  cod: "Cash on Delivery",
};

const paymentMethodColors: Record<string, string> = {
  stripe: "bg-[#e6f7ff] text-[#1677ff]",
  cod: "bg-[#f9f0ff] text-[#531dab]",
};

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, pages: 0 });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [methodFilter, setMethodFilter] = useState("");

  useEffect(() => {
    fetchPayments();
  }, [pagination.page, statusFilter, methodFilter]);

  async function fetchPayments() {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(pagination.page),
        limit: String(pagination.limit),
      });
      if (statusFilter) params.append("status", statusFilter);
      if (methodFilter) params.append("method", methodFilter);
      if (search) params.append("search", search);

      const { data } = await apiClient.get(`/admin/payments?${params.toString()}`);
      setPayments(data.payments || []);
      setPagination(data.pagination);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6">
        <Skeleton className="h-7 w-48" />
        <div className="mt-6 space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4 rounded-lg border border-[#f0f0f0] bg-white p-4">
              <Skeleton className="h-10 w-10 shrink-0 rounded" />
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
          <h1 className="text-[20px] font-semibold text-[#262626]">Payment History</h1>
          <p className="mt-1 text-[13px] text-[#8c8c8c]">View and filter all customer payments</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-5 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8c8c8c]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order number, user..."
            className="h-10 w-full rounded-lg border border-[#f0f0f0] bg-white pl-10 pr-4 text-[13px] text-[#262626] placeholder:text-[#8c8c8c] focus:border-[#1677ff] focus:outline-none"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8c8c8c] hover:text-[#262626]">
              <X size={14} />
            </button>
          )}
        </div>

        <div className="relative">
          <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8c8c8c]" />
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPagination((p) => ({ ...p, page: 1 })); }}
            className="h-10 w-[160px] rounded-lg border border-[#f0f0f0] bg-white pl-9 pr-8 text-[13px] text-[#262626] appearance-none focus:border-[#1677ff] focus:outline-none"
          >
            <option value="">All Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
          <ChevronDown size={12} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8c8c8c]" />
        </div>

        <div className="relative">
          <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8c8c8c]" />
          <select
            value={methodFilter}
            onChange={(e) => { setMethodFilter(e.target.value); setPagination((p) => ({ ...p, page: 1 })); }}
            className="h-10 w-[180px] rounded-lg border border-[#f0f0f0] bg-white pl-9 pr-8 text-[13px] text-[#262626] appearance-none focus:border-[#1677ff] focus:outline-none"
          >
            <option value="">All Methods</option>
            <option value="stripe">Online (Stripe)</option>
            <option value="cod">Cash on Delivery</option>
          </select>
          <ChevronDown size={12} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8c8c8c]" />
        </div>
      </div>

      {/* Payments Table */}
      <div className="mt-4 overflow-x-auto rounded-lg border border-[#f0f0f0] bg-white">
        <table className="w-full min-w-[650px]">
          <thead>
            <tr className="border-b border-[#f0f0f0] bg-[#fafafb]">
              <th className="px-4 py-3 text-left text-[12px] font-medium text-[#8c8c8c]">Order</th>
              <th className="px-4 py-3 text-left text-[12px] font-medium text-[#8c8c8c]">Customer</th>
              <th className="px-4 py-3 text-left text-[12px] font-medium text-[#8c8c8c]">Method</th>
              <th className="px-4 py-3 text-left text-[12px] font-medium text-[#8c8c8c]">Status</th>
              <th className="px-4 py-3 text-left text-[12px] font-medium text-[#8c8c8c]">Amount</th>
              <th className="px-4 py-3 text-left text-[12px] font-medium text-[#8c8c8c]">Date</th>
              <th className="px-4 py-3 text-left text-[12px] font-medium text-[#8c8c8c]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment._id} className="border-b border-[#f0f0f0] last:border-0 hover:bg-[#fafafb]">
                <td className="px-4 py-3">
                  <Link href={`/admin/orders/${payment._id}`} className="text-[13px] font-medium text-[#1677ff] hover:underline">
                    {payment.orderNumber}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f5f5f5] text-[#8c8c8c] text-[12px] font-medium">
                      {payment.user.name?.charAt(0) || "C"}
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-[#262626]">{payment.user.name}</p>
                      <p className="text-[11px] text-[#8c8c8c]">{payment.user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1.5 rounded px-2 py-1 text-[11px] font-medium ${paymentMethodColors[payment.paymentMethod]}`}>
                    <CreditCard size={12} />
                    {paymentMethodLabels[payment.paymentMethod]}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1.5 rounded px-2 py-1 text-[11px] font-medium capitalize ${paymentStatusColors[payment.paymentStatus]}`}>
                    <DollarSign size={12} />
                    {payment.paymentStatus}
                  </span>
                </td>
                <td className="px-4 py-3 text-[13px] font-semibold text-[#262626]">{currency(payment.total)}</td>
                <td className="px-4 py-3 text-[12px] text-[#8c8c8c]">
                  {new Date(payment.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/orders/${payment._id}`}
                    className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#1677ff] hover:underline"
                  >
                    <Eye size={14} /> View
                  </Link>
                </td>
              </tr>
            ))}
            {payments.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-[13px] text-[#8c8c8c]">
                  No payments found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-between border-t border-[#f0f0f0] px-4 py-3">
            <p className="text-[12px] text-[#8c8c8c]">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} payments
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="h-8 w-8 rounded-lg border border-[#f0f0f0] bg-white text-[13px] text-[#262626] hover:bg-[#f5f5f5] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={14} className="rotate-180" />
              </button>
              {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                let pageNum;
                if (pagination.pages <= 5) {
                  pageNum = i + 1;
                } else if (pagination.page <= 3) {
                  pageNum = i + 1;
                } else if (pagination.page >= pagination.pages - 2) {
                  pageNum = pagination.pages - 4 + i;
                } else {
                  pageNum = pagination.page - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`h-8 w-8 rounded-lg text-[13px] font-medium ${pagination.page === pageNum ? "bg-[#1677ff] text-white" : "text-[#8c8c8c] hover:bg-[#f5f5f5]"}`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="h-8 w-8 rounded-lg border border-[#f0f0f0] bg-white text-[13px] text-[#262626] hover:bg-[#f5f5f5] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}