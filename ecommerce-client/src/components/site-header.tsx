"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Heart, Menu, Search, ShoppingCart, Clock, X, ShieldCheck } from "lucide-react";
import { MdDashboard } from "react-icons/md";
import { useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";
import { useAuthUser } from "@/lib/use-auth-user";
import { useSearchHistory } from "@/lib/use-search-history";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/logo";

const popular = ["iPhone", "Samsung", "Headphones", "Sneakers", "Watch", "Backpack"];

export function SiteHeader() {
  const { count: cartCount } = useCart();
  const { count: savedCount } = useWishlist();
  const user = useAuthUser();
  const signedIn = Boolean(user);
  const router = useRouter();
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    if (signedIn) {
      import("@/services/api-client").then(({ apiClient }) =>
        apiClient.get("/user/profile").then(({ data }) => setUserRole(data.user?.role || null)).catch(() => {})
      );
    }
  }, [signedIn]);

  const { history, add, remove, clear } = useSearchHistory();
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setMounted(true); }, []);

  const suggestions = searchQuery.trim()
    ? history.filter((h) => h.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const q = searchQuery.trim();
      if (!q) return;
      add(q);
      setDropdownOpen(false);
      router.push(`/search?q=${encodeURIComponent(q)}`);
    },
    [searchQuery, add, router]
  );

  const pick = useCallback(
    (q: string) => {
      setSearchQuery(q);
      add(q);
      setDropdownOpen(false);
      router.push(`/search?q=${encodeURIComponent(q)}`);
    },
    [add, router]
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showDropdown = dropdownOpen && (searchQuery.trim() ? suggestions.length > 0 : history.length > 0);

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

          {/* Search */}
          <div ref={wrapperRef} className="relative hidden flex-1 md:block">
            <form onSubmit={handleSubmit} className="relative">
              <span className="sr-only">Search products</span>
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setDropdownOpen(true)}
                className="h-11 w-full rounded-full bg-white/10 px-5 pr-11 text-[14px] text-white placeholder:text-white/60"
                placeholder="Search products, brands and categories"
              />
              <button type="submit" aria-label="Search" className="absolute right-3 top-3 text-[#d8ef72]">
                <Search size={20} />
              </button>
            </form>

            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl bg-white text-[#1c2734] shadow-[0_8px_30px_rgba(0,0,0,.18)]"
                >
                  {searchQuery.trim() ? (
                    <div>
                      <div className="px-4 pt-3 pb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Suggestions</div>
                      {suggestions.map((q) => (
                        <button
                          key={q}
                          onMouseDown={(e) => { e.preventDefault(); pick(q); }}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-[13px] hover:bg-[#f0efe9] transition"
                        >
                          <Clock size={14} className="shrink-0 text-slate-400" />
                          <span className="flex-1 text-left">{q}</span>
                        </button>
                      ))}
                      <button
                        onMouseDown={(e) => { e.preventDefault(); handleSubmit(e as unknown as React.FormEvent); }}
                        className="flex w-full items-center gap-3 border-t border-slate-100 px-4 py-2.5 text-[13px] font-semibold text-[#16815d] hover:bg-[#f0efe9] transition"
                      >
                        <Search size={14} className="shrink-0" />
                        Search for &ldquo;{searchQuery.trim()}&rdquo;
                      </button>
                    </div>
                  ) : (
                    <div>
                      {history.length > 0 && (
                        <div>
                          <div className="flex items-center justify-between px-4 pt-3 pb-1">
                            <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Recent searches</span>
                            <button onMouseDown={(e) => { e.preventDefault(); clear(); }} className="text-[11px] font-semibold text-[#16815d] hover:underline">
                              Clear all
                            </button>
                          </div>
                          {history.map((q) => (
                            <div key={q} className="flex items-center gap-3 px-4 py-2.5 text-[13px] hover:bg-[#f0efe9] transition">
                              <Clock size={14} className="shrink-0 text-slate-400" />
                              <button onMouseDown={(e) => { e.preventDefault(); pick(q); }} className="flex-1 text-left">
                                {q}
                              </button>
                              <button onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); remove(q); }} className="rounded-full p-0.5 text-slate-400 hover:text-red-500 transition">
                                <X size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="border-t border-slate-100">
                        <div className="px-4 pt-3 pb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Popular</div>
                        {popular.map((q) => (
                          <button
                            key={q}
                            onMouseDown={(e) => { e.preventDefault(); pick(q); }}
                            className="flex w-full items-center gap-3 px-4 py-2.5 text-[13px] hover:bg-[#f0efe9] transition"
                          >
                            <Search size={14} className="shrink-0 text-slate-400" />
                            <span className="text-left">{q}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

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
              <Link href="/account/dashboard" aria-label="Dashboard" className="flex h-11 w-11 items-center justify-center rounded-full bg-[#d8ef72] text-[#1c2734] transition hover:ring-2 hover:ring-white/20">
                <MdDashboard size={22} />
              </Link>
            )}

            {signedIn && userRole === "admin" && (
              <Link 
                href={pathname.startsWith("/admin") ? "/account/dashboard" : "/admin/dashboard"} 
                aria-label={pathname.startsWith("/admin") ? "Customer Panel" : "Admin Panel"} 
                className="flex h-11 items-center justify-center gap-2 rounded-full bg-white/10 px-4 text-[13px] font-semibold text-white transition hover:bg-white/20"
              >
                {pathname.startsWith("/admin") ? <MdDashboard size={18} /> : <ShieldCheck size={18} />}
                {pathname.startsWith("/admin") ? "Customer Panel" : "Admin Panel"}
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

      {/* Backdrop rendered via portal at body level — blurs page, leaves header/search clear */}
      {mounted && createPortal(
        <AnimatePresence>
          {showDropdown && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/10 backdrop-blur-sm"
              onClick={() => setDropdownOpen(false)}
              style={{ backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
            />
          )}
        </AnimatePresence>,
        document.body
      )}
    </header>
  );
}
