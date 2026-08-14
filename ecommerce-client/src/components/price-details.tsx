"use client";
import { ShieldCheck, RotateCcw, CreditCard } from "lucide-react";
import { motion } from "framer-motion";
import { currency } from "@/lib/utils";

interface PriceDetailsProps {
  subtotal: number;
  itemCount: number;
  onCheckout: () => void;
  checkingOut: boolean;
  selectedItems?: number;
  totalItems?: number;
}

export function PriceDetails({ subtotal, itemCount, onCheckout, checkingOut, selectedItems, totalItems }: PriceDetailsProps) {
  const delivery = 0;
  const discount = 0;
  const total = subtotal - discount + delivery;
  const hasSelection = selectedItems === undefined || selectedItems > 0;

  return (
    <div className="rounded-2xl bg-white p-5 shadow-[0_1px_4px_rgba(0,0,0,.12)]">
      <h2 className="text-sm font-bold text-[#1c2734]">Price Details</h2>

      <dl className="mt-4 space-y-3 text-[13px]">
        {selectedItems !== undefined && totalItems !== undefined && (
          <div className="flex justify-between">
            <dt className="text-slate-500">Selected</dt>
            <dd className="font-medium text-[#1c2734]">
              {selectedItems} of {totalItems} item{totalItems !== 1 ? "s" : ""}
            </dd>
          </div>
        )}
        <div className="flex justify-between">
          <dt className="text-slate-500">Price ({itemCount} item{itemCount !== 1 ? "s" : ""})</dt>
          <dd className="font-medium text-[#1c2734]">{currency(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-500">Delivery</dt>
          <dd className="font-medium text-[#16815d]">Free</dd>
        </div>
        {discount > 0 && (
          <div className="flex justify-between">
            <dt className="text-slate-500">Discount</dt>
            <dd className="font-medium text-[#16815d]">-{currency(discount)}</dd>
          </div>
        )}
        <div className="flex justify-between border-t border-slate-100 pt-3 text-sm">
          <dt className="font-bold text-[#1c2734]">Total Amount</dt>
          <dd className="font-black text-[#1c2734]">
            <motion.span
              key={total}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 420, damping: 24 }}
            >
              {currency(total)}
            </motion.span>
          </dd>
        </div>
      </dl>

      <button
        type="button"
        onClick={onCheckout}
        disabled={checkingOut || !hasSelection}
        className="mt-5 w-full rounded-full bg-[#16815d] px-5 py-3 text-sm font-semibold text-white transition hover:scale-[1.02] disabled:opacity-60"
      >
        {checkingOut ? "Redirecting..." : "Place Order"}
      </button>

      {!hasSelection && (
        <p className="mt-3 text-center text-[12px] text-slate-400">Select at least one item to continue</p>
      )}

      {/* Trust signals */}
      <div className="mt-5 space-y-2.5 border-t border-slate-100 pt-4">
        <div className="flex items-center gap-2.5 text-[12px] text-slate-500">
          <ShieldCheck size={15} className="shrink-0 text-[#16815d]" />
          Safe and secure payments
        </div>
        <div className="flex items-center gap-2.5 text-[12px] text-slate-500">
          <RotateCcw size={15} className="shrink-0 text-[#16815d]" />
          7-day return policy
        </div>
        <div className="flex items-center gap-2.5 text-[12px] text-slate-500">
          <CreditCard size={15} className="shrink-0 text-[#16815d]" />
          EMI options available
        </div>
      </div>
    </div>
  );
}
