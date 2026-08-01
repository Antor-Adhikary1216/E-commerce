"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogIn, X } from "lucide-react";
import { useAuthUser } from "@/lib/use-auth-user";

const DISMISS_KEY = "vanta-login-prompt-dismissed";

export function LoginPrompt() {
  const user = useAuthUser();
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (user !== null) return;
    if (pathname === "/login" || pathname === "/account") return;
    if (typeof window !== "undefined" && window.sessionStorage.getItem(DISMISS_KEY)) return;
    const timer = setTimeout(() => setVisible(true), 1800);
    return () => clearTimeout(timer);
  }, [user, pathname]);

  if (!visible) return null;

  function dismiss() {
    window.sessionStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4" role="dialog" aria-modal="true" aria-labelledby="login-prompt-title">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <button onClick={dismiss} aria-label="Close" className="absolute ml-auto flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100">
          <X size={16} />
        </button>
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e5ead9] text-[#16815d]">
          <LogIn size={20} />
        </div>
        <h2 id="login-prompt-title" className="mt-4 text-lg font-bold">
          Sign in to Vanta
        </h2>
        <p className="mt-1.5 text-[13px] leading-6 text-slate-500">
          Log in or create a free account to save items, manage your cart and track orders.
        </p>
        <div className="mt-5 space-y-2">
          <Link href="/login" className="block w-full rounded-full bg-[#16815d] px-5 py-2.5 text-center text-[13px] font-semibold text-white">
            Log in / Create account
          </Link>
          <button onClick={dismiss} className="w-full rounded-full border border-slate-200 px-5 py-2.5 text-[13px] font-semibold hover:bg-slate-50">
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
