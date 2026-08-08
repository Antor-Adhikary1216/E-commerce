"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { currency } from "@/lib/utils";
import type { CartItem } from "@/store/cart";

interface SelectItemCardProps {
  item: CartItem;
  selected: boolean;
  onToggle: (slug: string) => void;
}

export function SelectItemCard({ item, selected, onToggle }: SelectItemCardProps) {
  const { product, quantity } = item;
  const discount = product.price > product.finalPrice
    ? Math.round((1 - product.finalPrice / product.price) * 100)
    : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      onClick={() => onToggle(product.slug)}
      className={`flex items-center gap-4 rounded-2xl bg-white p-4 shadow-[0_1px_4px_rgba(0,0,0,.12)] transition-all cursor-pointer sm:gap-5 ${
        selected ? "ring-2 ring-[#16815d]" : "ring-1 ring-slate-200 hover:ring-slate-300"
      }`}
    >
      {/* Checkbox */}
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onToggle(product.slug)}
          aria-label={`Select ${product.name}`}
          className="peer sr-only"
        />
        <span
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors ${
            selected
              ? "border-[#16815d] bg-[#16815d]"
              : "border-slate-300 bg-white peer-focus-visible:ring-2 peer-focus-visible:ring-[#16815d] peer-focus-visible:ring-offset-2"
          }`}
        >
          {selected && (
            <svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="none">
              <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
      </div>

      {/* Image */}
      <Link
        href={`/products/${product.slug}`}
        onClick={(e) => e.stopPropagation()}
        className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#f3f0e9] sm:h-24 sm:w-24"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="96px"
          className="object-contain p-2"
        />
      </Link>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <Link
          href={`/products/${product.slug}`}
          onClick={(e) => e.stopPropagation()}
          className="line-clamp-2 text-[13px] font-semibold leading-5 text-[#1c2734] hover:text-[#16815d]"
        >
          {product.name}
        </Link>

        <div className="mt-1.5 flex flex-wrap items-baseline gap-2">
          <span className="text-sm font-bold text-[#1c2734]">{currency(product.finalPrice)}</span>
          {discount > 0 && (
            <>
              <del className="text-xs text-slate-400">{currency(product.price)}</del>
              <span className="rounded-sm bg-[#d8ef72] px-1.5 py-0.5 text-[10px] font-bold text-[#1c2734]">
                {discount}% off
              </span>
            </>
          )}
        </div>

        <p className="mt-1 text-[12px] text-slate-500">Qty: {quantity}</p>
      </div>
    </motion.div>
  );
}
