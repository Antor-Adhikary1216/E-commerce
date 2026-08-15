"use client";
import { useState } from "react";
import { 
  Search, 
  Package, 
  CheckCircle2, 
  Clock, 
  Truck, 
  MapPin,
  XCircle,
  Calendar
} from "lucide-react";
import { apiClient } from "@/services/api-client";
import { currency } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface TrackingStep {
  status: string;
  label: string;
  completed: boolean;
}

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
    name?: string;
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  shippingDetail?: {
    name?: string;
    phone?: string;
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
}

const statusIcons: Record<string, React.ReactNode> = {
  pending: <Clock size={16} />,
  confirmed: <CheckCircle2 size={16} />,
  packed: <Package size={16} />,
  shipped: <Truck size={16} />,
  out_for_delivery: <Truck size={16} />,
  delivered: <CheckCircle2 size={16} />,
  cancelled: <XCircle size={16} />,
};

const statusColors: Record<string, string> = {
  pending: "bg-[#fff7e6] text-[#d48806]",
  confirmed: "bg-[#e6f7ff] text-[#0050b3]",
  packed: "bg-[#f0f5ff] text-[#1d39c4]",
  shipped: "bg-[#f9f0ff] text-[#531dab]",
  out_for_delivery: "bg-[#fff7e6] text-[#d46b08]",
  delivered: "bg-[#f6ffed] text-[#389e0d]",
  cancelled: "bg-[#fff2f0] text-[#cf1322]",
};

export default function TrackingPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [trackingSteps, setTrackingSteps] = useState<TrackingStep[]>([]);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!orderNumber.trim()) return;
    
    setLoading(true);
    setError("");
    setOrder(null);
    setTrackingSteps([]);
    
    try {
      const { data } = await apiClient.get(`/orders/track/${orderNumber.trim()}`);
      setOrder(data.order);
      setTrackingSteps(data.trackingSteps);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Order not found. Please check the order number and try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="px-6 py-6">
      {/* Header */}
      <div>
        <h1 className="text-[20px] font-semibold leading-[26px] text-[#262626]">Track Order</h1>
        <p className="mt-1 text-[13px] leading-[20px] text-[#8c8c8c]">Enter your order number to track your package</p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="mt-5">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8c8c8c]" />
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="Enter order number (e.g., VNT-202608-ABC123)"
              className="h-10 w-full rounded-lg border border-[#f0f0f0] bg-[#fafafb] pl-10 pr-4 text-[14px] text-[#262626] placeholder:text-[#8c8c8c] focus:border-[#1677ff] focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !orderNumber.trim()}
            className="rounded-lg bg-[#1677ff] px-5 py-2.5 text-[14px] font-medium text-white transition-colors duration-225 hover:bg-[#4096ff] disabled:opacity-50"
          >
            {loading ? "Tracking..." : "Track"}
          </button>
        </div>
      </form>

      {/* Error Message */}
      {error && (
        <div className="mt-4 rounded-lg border border-[#fff2f0] bg-[#fff2f0] p-4 text-[14px] text-[#cf1322]">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="mt-6 space-y-4">
          <div className="rounded-lg border border-[#f0f0f0] bg-[#fafafb] p-5">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="mt-3 h-4 w-48" />
            <Skeleton className="mt-2 h-4 w-40" />
          </div>
          <div className="rounded-lg border border-[#f0f0f0] bg-[#fafafb] p-5">
            <Skeleton className="h-5 w-24" />
            <div className="mt-4 space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tracking Results */}
      {order && !loading && (
        <div className="mt-6 space-y-5">
          {/* Order Info Card */}
          <div className="rounded-lg border border-[#f0f0f0] bg-[#fafafb] p-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-[16px] font-semibold text-[#262626]">{order.orderNumber}</h2>
                <p className="mt-1 text-[13px] text-[#8c8c8c]">
                  Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>
              <span className={`rounded px-2 py-1 text-[12px] font-medium capitalize ${statusColors[order.status] ?? "bg-[#f5f5f5] text-[#8c8c8c]"}`}>
                {order.status.replace(/_/g, " ")}
              </span>
            </div>
            
            <div className="mt-4 border-t border-[#f0f0f0] pt-4">
              <div className="grid grid-cols-2 gap-4 text-[13px]">
                <div>
                  <p className="text-[#8c8c8c]">Payment</p>
                  <p className="font-medium text-[#262626] capitalize">{order.paymentMethod} &middot; {order.paymentStatus}</p>
                </div>
                <div>
                  <p className="text-[#8c8c8c]">Total</p>
                  <p className="font-medium text-[#262626]">{currency(order.total)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tracking Timeline */}
          <div className="rounded-lg border border-[#f0f0f0] bg-[#fafafb] p-5">
            <h3 className="text-[14px] font-semibold text-[#262626]">Tracking Status</h3>
            
            {order.status === "cancelled" ? (
              <div className="mt-4 flex items-center gap-3 rounded-lg bg-[#fff2f0] p-4">
                <XCircle size={20} className="text-[#cf1322]" />
                <div>
                  <p className="text-[14px] font-medium text-[#cf1322]">Order Cancelled</p>
                  <p className="text-[12px] text-[#8c8c8c]">This order has been cancelled</p>
                </div>
              </div>
            ) : (
              <div className="mt-4 space-y-0">
                {trackingSteps.map((step, index) => {
                  const isLast = index === trackingSteps.length - 1;
                  const isCurrent = step.completed && !trackingSteps[index + 1]?.completed;
                  
                  return (
                    <div key={step.status} className="flex gap-3">
                      {/* Timeline Line & Dot */}
                      <div className="flex flex-col items-center">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                          step.completed 
                            ? isCurrent 
                              ? "bg-[#1677ff] text-white" 
                              : "bg-[#f6ffed] text-[#389e0d]"
                            : "bg-[#f5f5f5] text-[#8c8c8c]"
                        }`}>
                          {step.completed ? (
                            isCurrent ? statusIcons[step.status] : <CheckCircle2 size={16} />
                          ) : (
                            <span className="text-[12px] font-medium">{index + 1}</span>
                          )}
                        </div>
                        {!isLast && (
                          <div className={`w-0.5 flex-1 ${
                            step.completed ? "bg-[#389e0d]" : "bg-[#f0f0f0]"
                          }`} />
                        )}
                      </div>
                      
                      {/* Step Content */}
                      <div className={`pb-6 ${isLast ? "pb-0" : ""}`}>
                        <p className={`text-[14px] font-medium ${
                          step.completed ? "text-[#262626]" : "text-[#8c8c8c]"
                        }`}>
                          {step.label}
                        </p>
                        {isCurrent && (
                          <p className="mt-0.5 text-[12px] text-[#1677ff]">Current status</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Shipping Address */}
          {(order.shippingAddress || order.shippingDetail) && (
            <div className="rounded-lg border border-[#f0f0f0] bg-[#fafafb] p-5">
              <h3 className="flex items-center gap-2 text-[14px] font-semibold text-[#262626]">
                <MapPin size={16} className="text-[#8c8c8c]" />
                Shipping Address
              </h3>
              <div className="mt-3 text-[13px] leading-[20px] text-[#262626]">
                {order.shippingDetail ? (
                  <>
                    <p className="font-medium">{order.shippingDetail.name}</p>
                    <p>{order.shippingDetail.line1}</p>
                    {order.shippingDetail.line2 && <p>{order.shippingDetail.line2}</p>}
                    <p>{order.shippingDetail.city}, {order.shippingDetail.state} {order.shippingDetail.postalCode}</p>
                    <p>{order.shippingDetail.country}</p>
                    {order.shippingDetail.phone && <p className="mt-2 text-[#8c8c8c]">Phone: {order.shippingDetail.phone}</p>}
                  </>
                ) : order.shippingAddress ? (
                  <>
                    <p className="font-medium">{order.shippingAddress.name}</p>
                    <p>{order.shippingAddress.line1}</p>
                    {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
                    <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                    <p>{order.shippingAddress.country}</p>
                  </>
                ) : null}
              </div>
            </div>
          )}

          {/* Order Items */}
          <div className="rounded-lg border border-[#f0f0f0] bg-[#fafafb] p-5">
            <h3 className="text-[14px] font-semibold text-[#262626]">Order Items</h3>
            <div className="mt-3 space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  {item.image && (
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="h-12 w-12 rounded object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <p className="text-[13px] font-medium text-[#262626]">{item.name}</p>
                    <p className="text-[12px] text-[#8c8c8c]">Qty: {item.quantity} &middot; {currency(item.price)}</p>
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
