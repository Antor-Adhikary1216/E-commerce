"use client";
import Link from "next/link";
import { Heart, Menu, Search, ShoppingCart, UserRound } from "lucide-react";
import { useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";
import { useAuthUser } from "@/lib/use-auth-user";
import { motion } from "framer-motion";

const nav = ["Mobiles", "Laptops", "Headphones", "Earbuds", "Sneakers", "Skincare", "Kitchen Appliances", "Furniture", "Sports", "Books", "Toys", "Grocery"];

export function SiteHeader() {
  const { count: cartCount } = useCart();
  const { count: savedCount } = useWishlist();
  const user = useAuthUser();
  const signedIn = Boolean(user);
  const accountHref = signedIn ? "/account" : "/login";

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-[#1c2734] text-white">
        <div className="mx-auto flex h-16 max-w-[1360px] items-center gap-4 px-4">
          <button className="md:hidden" aria-label="Open navigation">
            <Menu size={21} />
          </button>

          <Link href="/" className="shrink-0 text-xl font-black tracking-tight">
            VANTA<span className="text-[#d8ef72]">/</span>
            <span className="block text-[9px] font-medium uppercase tracking-[.18em] text-white/55">Everyday market</span>
          </Link>

          <label className="relative hidden flex-1 md:block">
            <span className="sr-only">Search products</span>
            <input className="h-10 w-full rounded-full bg-white/10 px-5 pr-11 text-[13px] text-white placeholder:text-white/60" placeholder="Search products, brands and categories" />
            <Search className="absolute right-4 top-2.5 text-[#d8ef72]" size={18} />
          </label>

          <div className="ml-auto flex items-center gap-1.5">
            <Link href={signedIn ? "/wishlist" : "/login"} aria-label="Saved items" className="relative flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-white/10">
              <Heart size={19} />
              {savedCount > 0 && (
                <motion.span
                  key={savedCount}
                  initial={{ scale: 0.4 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 520, damping: 20 }}
                  className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#d8ef72] px-1 text-[10px] font-bold text-[#1c2734]"
                >
                  {savedCount}
                </motion.span>
              )}
            </Link>

            <Link href={signedIn ? "/cart" : "/login"} aria-label="Cart" className="relative flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-white/10">
              <ShoppingCart size={19} />
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0.4 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 520, damping: 20 }}
                  className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#d8ef72] px-1 text-[10px] font-bold text-[#1c2734]"
                >
                  {cartCount}
                </motion.span>
              )}
            </Link>

            <Link href={accountHref} aria-label="My account" className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-white/10">
              <UserRound size={19} />
            </Link>
          </div>
        </div>
      </div>

      <nav aria-label="Primary categories" className="hidden border-b bg-[#f7f4ee] md:block">
        <ul className="mx-auto flex h-11 max-w-[1360px] items-center justify-center gap-2.5 overflow-x-auto px-3">
          {nav.map((item) => (
            <li key={item} className="shrink-0">
              <Link href={`/shop?category=${encodeURIComponent(item)}`} className="whitespace-nowrap rounded-full px-3 py-1.5 text-[13px] font-medium hover:bg-[#e5ead9] hover:text-[#16815d]">
                {item}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
