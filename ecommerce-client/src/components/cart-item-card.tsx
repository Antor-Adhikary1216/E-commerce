"use client";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { currency } from "@/lib/utils";
import type { CartItem } from "@/store/cart";

interface CartItemCardProps {
  item: CartItem;
  onUpdateQuantity: (slug: string, qty: number) => void;
  onRemove: (slug: string, name: string) => void;
  onSave: (slug: string) => void;
  saved?: boolean;
}

export function CartItemCard({ item, onUpdateQuantity, onRemove, onSave, saved }: CartItemCardProps) {
  const { product, quantity } = item;
  const discount = product.price > product.finalPrice
    ? Math.round((1 - product.finalPrice / product.price) * 100)
    : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ type: "spring", stiffness: 380, damping: 30 }}
      className="flex gap-4 rounded-2xl bg-white p-4 shadow-[0_1px_4px_rgba(0,0,0,.12)] sm:gap-5"
    >
      {/* Image */}
      <Link
        href={`/products/${product.slug}`}
        className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[#f3f0e9] sm:h-28 sm:w-28"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="112px"
          className="object-contain p-2"
        />
      </Link>

      {/* Info */}
      <div className="flex min-w-0 flex-1 flex-col">
        <Link
          href={`/products/${product.slug}`}
          className="line-clamp-2 text-[13px] font-semibold leading-5 text-[#1c2734] hover:text-[#16815d]"
        >
          {product.name}
        </Link>

        {/* Price */}
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

        {/* Quantity + Actions row */}
        <div className="mt-auto flex flex-wrap items-center gap-3 pt-3">
          {/* Quantity controls */}
          <div className="inline-flex items-center rounded-full border border-slate-200">
            <button
              type="button"
              onClick={() => onUpdateQuantity(product.slug, quantity - 1)}
              aria-label="Decrease quantity"
              className="p-2 text-slate-500 transition hover:text-[#1c2734]"
            >
              <Minus size={14} />
            </button>
            <motion.span
              key={quantity}
              initial={{ scale: 1.3 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 480, damping: 24 }}
              className="w-8 text-center text-[13px] font-semibold"
            >
              {quantity}
            </motion.span>
            <button
              type="button"
              onClick={() => onUpdateQuantity(product.slug, quantity + 1)}
              aria-label="Increase quantity"
              className="p-2 text-slate-500 transition hover:text-[#1c2734]"
            >
              <Plus size={14} />
            </button>
          </div>

          {/* Remove */}
          <button
            type="button"
            onClick={() => onRemove(product.slug, product.name)}
            aria-label={`Remove ${product.name} from cart`}
            className="flex items-center gap-1.5 text-[12px] font-medium text-slate-500 transition hover:text-[#c0392b]"
          >
            <Trash2 size={14} />
            Remove
          </button>

          {/* Save for later */}
          <button
            type="button"
            onClick={() => onSave(product.slug)}
            aria-label={saved ? "Remove from saved" : "Save for later"}
            className="flex items-center gap-1.5 text-[12px] font-medium text-slate-500 transition hover:text-[#16815d]"
          >
            <Heart size={14} fill={saved ? "#16815d" : "none"} className={saved ? "text-[#16815d]" : ""} />
            Save for later
          </button>
        </div>
      </div>
    </motion.div>
  );
}
