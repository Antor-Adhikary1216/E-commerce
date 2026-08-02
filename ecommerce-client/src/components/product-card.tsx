"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, Star } from "lucide-react";
import { currency } from "@/lib/utils";
import { savedForLater } from "@/lib/swal";
import { useWishlist } from "@/store/wishlist";
import { useRequireAuth } from "@/lib/use-require-auth";

export interface ProductCardData {
  name: string;
  slug: string;
  price: number;
  finalPrice: number;
  rating: number;
  image: string;
  badge?: string;
}

export function ProductCard({ product }: { product: ProductCardData }) {
  const { isSaved, toggle } = useWishlist();
  const requireAuth = useRequireAuth();
  const saved = isSaved(product.slug);

  function handleSaved() {
    if (!requireAuth()) return;
    savedForLater(product.name, toggle(product));
  }

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 320, damping: 20 }}
      className="group relative rounded-xl bg-white p-3 shadow-[0_1px_4px_rgba(0,0,0,.04)] hover:shadow-[0_10px_28px_rgba(28,39,52,.12)]"
    >
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden rounded-lg bg-[#f3f0e9]">
          <Image src={product.image} alt={product.name} fill sizes="(max-width:768px) 50vw, 25vw" className="object-contain p-3 transition duration-300 group-hover:scale-105" />
          {product.badge && <span className="absolute left-2 top-2 rounded-full bg-[#1c2734] px-2 py-1 text-xs font-semibold text-white">{product.badge}</span>}
        </div>
        <div className="mt-3">
          <h3 className="line-clamp-2 min-h-8 text-[13px] font-medium">{product.name}</h3>
          <div className="mt-2 flex items-center justify-between">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#e5ead9] px-2 py-1 text-xs font-semibold text-[#16815d]">
              {product.rating}
              <Star size={10} fill="currentColor" />
            </span>
            {product.finalPrice < product.price && <span className="text-xs font-semibold text-[#16815d]">{Math.round((1 - product.finalPrice / product.price) * 100)}% off</span>}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="text-[16px] font-bold">{currency(product.finalPrice)}</span>
            {product.finalPrice < product.price && <del className="text-xs text-slate-500">{currency(product.price)}</del>}
          </div>
        </div>
      </Link>
      <motion.button
        type="button"
        onClick={handleSaved}
        whileTap={{ scale: 0.75 }}
        animate={saved ? { scale: [1, 1.35, 1] } : { scale: 1 }}
        transition={saved ? { duration: 0.35, ease: "easeOut" } : { duration: 0.2 }}
        aria-label={saved ? `Remove ${product.name} from saved` : `Save ${product.name} for later`}
        className={`absolute right-3 top-3 rounded-full bg-white p-2 shadow transition focus-visible:opacity-100 ${saved ? "opacity-100 text-[#16815d]" : "opacity-0 group-hover:opacity-100"}`}
      >
        <Heart size={16} fill={saved ? "currentColor" : "none"} />
      </motion.button>
    </motion.article>
  );
}
