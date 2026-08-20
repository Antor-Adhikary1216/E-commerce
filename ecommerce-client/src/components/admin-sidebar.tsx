"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  LogOut,
  ChevronRight,
  Store,
  CreditCard,
  MessageSquare,
  Menu,
  X
} from "lucide-react";
import { useAuthUser } from "@/lib/use-auth-user";
import { signOut } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";
import { apiClient } from "@/services/api-client";
import { useEffect, useState } from "react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
  { href: "/admin/products", label: "Products", icon: <Package size={18} /> },
  { href: "/admin/orders", label: "Orders", icon: <ShoppingCart size={18} /> },
  { href: "/admin/users", label: "Users", icon: <Users size={18} /> },
  { href: "/admin/payments", label: "Payments", icon: <CreditCard size={18} /> },
  { href: "/admin/conversations", label: "Customer Care", icon: <MessageSquare size={18} /> },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const user = useAuthUser();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  async function handleSignOut() {
    const auth = getFirebaseAuth();
    if (!auth) return;
    await signOut(auth);
    try {
      await apiClient.post("/auth/logout");
    } catch {
      // session already cleared client-side
    }
    localStorage.removeItem("shopping-in-india.cart");
    localStorage.removeItem("shopping-in-india.saved");
    localStorage.removeItem("shopping-in-india.access-token");
    window.location.href = "/";
  }

  function SidebarContent() {
    return (
      <>
        {/* Logo */}
        <div className="border-b border-white/10 p-5">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded bg-[#d8ef72] text-[#1c2734]">
              <Store size={20} />
            </div>
            <div>
              <p className="text-[14px] font-semibold text-white">Admin Panel</p>
              <p className="text-[11px] text-white/60">E-commerce Store</p>
            </div>
          </Link>
        </div>

        {/* User Info */}
        <div className="border-b border-white/10 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1677ff] text-white text-[13px] font-semibold">
              {user?.displayName?.charAt(0) || "A"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium text-white">
                {user?.displayName || "Admin"}
              </p>
              <p className="truncate text-[11px] text-white/60">
                {user?.email || ""}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3">
          <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-white/40">
            Menu
          </p>
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all duration-150 ${
                      isActive
                        ? "bg-[#1677ff] text-white"
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <span className={isActive ? "text-white" : "text-white/50"}>
                      {item.icon}
                    </span>
                    {item.label}
                    {isActive && <ChevronRight size={14} className="ml-auto text-white/70" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sign Out */}
        <div className="border-t border-white/10 p-3">
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-white/60 transition-all duration-200 hover:bg-[#ff3b30]/20 hover:text-[#ff3b30]"
          >
            <LogOut size={18} />
            Sign out
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed bottom-5 left-5 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#1c2734] text-white shadow-lg md:hidden"
        aria-label="Open admin menu"
      >
        <Menu size={22} />
      </button>

      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-[#f0f0f0] bg-[#1c2734] md:block">
        <div className="sticky top-0 flex h-screen flex-col">
          <SidebarContent />
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="relative flex h-full w-72 flex-col bg-[#1c2734] shadow-xl">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-white/60 hover:bg-white/10"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  );
}
