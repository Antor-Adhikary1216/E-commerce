"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  CreditCard, 
  UserRound, 
  LogOut,
  ChevronRight,
  Truck,
  ShieldCheck
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
  { href: "/account/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
  { href: "/account/orders", label: "My Orders", icon: <Package size={18} /> },
  { href: "/account/tracking", label: "Track Order", icon: <Truck size={18} /> },
  { href: "/account/payments", label: "Payments", icon: <CreditCard size={18} /> },
  { href: "/account", label: "Profile", icon: <UserRound size={18} /> },
];

export function AccountSidebar() {
  const pathname = usePathname();
  const user = useAuthUser();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      apiClient.get("/user/profile").then(({ data }) => setUserRole(data.user?.role || null)).catch(() => {});
    }
  }, [user]);

  async function handleSignOut() {
    const auth = getFirebaseAuth();
    if (!auth) return;
    await signOut(auth);
    try {
      await apiClient.post("/auth/logout");
    } catch {
      // session already cleared client-side
    }
    localStorage.removeItem("vanta.cart");
    localStorage.removeItem("vanta.saved");
    localStorage.removeItem("vanta.access-token");
    window.location.href = "/";
  }

  return (
    <aside className="w-64 shrink-0 border-r border-[#f0f0f0] bg-[#fafafb]">
      <div className="sticky top-0 flex h-screen flex-col">
        {/* User Info */}
        <div className="border-b border-[#f0f0f0] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e6f7ff] text-[#1677ff]">
              <UserRound size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px] font-medium text-[#262626]">
                {user?.displayName || "Customer"}
              </p>
              <p className="truncate text-[12px] text-[#8c8c8c]">
                {user?.email || ""}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 rounded px-3 py-2.5 text-[14px] font-medium transition-colors duration-150 ${
                      isActive
                        ? "bg-[#e6f7ff] text-[#1677ff]"
                        : "text-[#262626] hover:bg-[#f5f5f5]"
                    }`}
                  >
                    <span className={isActive ? "text-[#1677ff]" : "text-[#8c8c8c]"}>
                      {item.icon}
                    </span>
                    {item.label}
                    {isActive && <ChevronRight size={14} className="ml-auto text-[#1677ff]" />}
                  </Link>
                </li>
              );
            })}
            <li>
              <Link
                href="/admin/dashboard"
                className={`flex items-center gap-3 rounded px-3 py-2.5 text-[14px] font-medium transition-colors duration-150 ${
                  pathname.startsWith("/admin")
                    ? "bg-[#f9f0ff] text-[#531dab]"
                    : "text-[#262626] hover:bg-[#f5f5f5]"
                }`}
              >
                <span className={pathname.startsWith("/admin") ? "text-[#531dab]" : "text-[#8c8c8c]"}>
                  <ShieldCheck size={18} />
                </span>
                Admin Panel
                {pathname.startsWith("/admin") && <ChevronRight size={14} className="ml-auto text-[#531dab]" />}
              </Link>
            </li>
          </ul>
        </nav>

        {/* Sign Out */}
        <div className="border-t border-[#f0f0f0] p-3">
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] font-medium text-[#ff3b30] transition-all duration-200 hover:bg-[#ff3b30]/10 active:scale-[0.98]"
          >
            <LogOut size={18} />
            Sign out
          </button>
        </div>
      </div>
    </aside>
  );
}
