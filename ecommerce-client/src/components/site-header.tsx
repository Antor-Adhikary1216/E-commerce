"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Menu, Search, ShoppingCart, UserRound } from "lucide-react";
import { useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";
import { useAuthUser } from "@/lib/use-auth-user";
import { motion } from "framer-motion";
import { Logo } from "@/components/logo";

const nav = ["Mobiles", "Laptops", "Headphones", "Earbuds", "Sneakers", "Skincare", "Kitchen Appliances", "Furniture", "Sports", "Books", "Toys", "Grocery"];

export function SiteHeader() {
  const { count: cartCount } = useCart();
  const { count: savedCount } = useWishlist();
  const user = useAuthUser();
  const signedIn = Boolean(user);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-[#1c2734]/80 text-white backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-[1360px] items-center gap-5 px-5">
          <button className="md:hidden" aria-label="Open navigation">
            <Menu size={24} />
          </button>

          <Link href="/" className="shrink-0">
            <Logo className="h-11 w-auto" />
          </Link>

          <form onSubmit={handleSearch} className="relative hidden flex-1 md:block">
            <span className="sr-only">Search products</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 w-full rounded-full bg-white/10 px-5 pr-11 text-[14px] text-white placeholder:text-white/60"
              placeholder="Search products, brands and categories"
            />
            <button type="submit" aria-label="Search" className="absolute right-3 top-3 text-[#d8ef72]">
              <Search size={20} />
            </button>
          </form>

          <div className="ml-auto flex items-center gap-2">
            {signedIn && (
              <Link href="/wishlist" aria-label="Saved items" className="relative flex h-11 w-11 items-center justify-center rounded-full transition hover:bg-white/10">
                <Heart size={22} />
                {savedCount > 0 && (
                  <motion.span
                    key={savedCount}
                    initial={{ scale: 0.4 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 520, damping: 20 }}
                    className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#d8ef72] px-1 text-[11px] font-bold text-[#1c2734]"
                  >
                    {savedCount}
                  </motion.span>
                )}
              </Link>
            )}

            {signedIn && (
              <Link href="/cart" aria-label="Cart" className="relative flex h-11 w-11 items-center justify-center rounded-full transition hover:bg-white/10">
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0.4 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 520, damping: 20 }}
                    className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#d8ef72] px-1 text-[11px] font-bold text-[#1c2734]"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </Link>
            )}

            {signedIn && (
              <Link href="/account" aria-label="My account" className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full transition hover:ring-2 hover:ring-white/20">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="" className="h-full w-full rounded-full object-cover" />
                ) : (
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#d8ef72] text-[#1c2734]">
                    <UserRound size={22} />
                  </div>
                )}
              </Link>
            )}

            {!signedIn && (
              <Link href="/login" className="rounded-full bg-[#d8ef72] px-5 py-2.5 text-[13px] font-semibold text-[#1c2734] transition hover:scale-105">
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>

      <nav aria-label="Primary categories" className="hidden border-b bg-[#f7f4ee]/80 backdrop-blur-xl md:block">
        <ul className="mx-auto flex h-12 max-w-[1360px] items-center justify-center gap-3 overflow-x-auto px-4">
          {nav.map((item) => (
            <li key={item} className="shrink-0">
              <Link href={`/shop?category=${encodeURIComponent(item)}`} className="whitespace-nowrap rounded-full px-3.5 py-2 text-[14px] font-medium hover:bg-[#e5ead9] hover:text-[#16815d]">
                {item}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
