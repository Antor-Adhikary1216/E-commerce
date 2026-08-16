"use client";
import { useEffect, useCallback, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import toast from "react-hot-toast";
import { ShoppingBag, PackageCheck, Zap, X } from "lucide-react";
import { useAuthUser } from "@/lib/use-auth-user";
import { getFirebaseAuth } from "@/lib/firebase";
import { setAccessToken } from "@/lib/token";
import { apiClient } from "@/services/api-client";
import { EASE } from "@/components/motion/reveal";

const DISMISS_KEY = "vanta-login-prompt-dismissed";

const benefits = [
  { icon: ShoppingBag, text: "Save items to your wishlist" },
  { icon: PackageCheck, text: "Track orders in real time" },
  { icon: Zap, text: "Faster checkout every time" },
];

export function LoginPrompt() {
  const user = useAuthUser();
  const pathname = usePathname();
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    if (user !== null) return;
    if (pathname === "/login" || pathname === "/account") return;
    if (typeof window !== "undefined" && window.sessionStorage.getItem(DISMISS_KEY)) return;
    const timer = setTimeout(() => setVisible(true), 1800);
    return () => clearTimeout(timer);
  }, [user, pathname]);

  const dismiss = useCallback(() => {
    window.sessionStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
  }, []);

  useEffect(() => {
    if (!visible) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") dismiss();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible, dismiss]);

  async function handleGoogleLogin() {
    const auth = getFirebaseAuth();
    if (!auth) {
      toast.error("Firebase isn't configured.");
      return;
    }
    setGoogleLoading(true);
    try {
      const cred = await signInWithPopup(auth, new GoogleAuthProvider());
      const idToken = await cred.user.getIdToken(true);
      const { data } = await apiClient.post("/auth/exchange", { idToken });
      setAccessToken(data.accessToken as string);
      dismiss();
      toast.success("Welcome back.");
      router.push("/account");
    } catch (error) {
      const code = (error as { code?: string }).code ?? "";
      if (code === "auth/popup-closed-by-user") return;
      dismiss();
      toast.error("Something went wrong. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {visible && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="login-prompt-title">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
          >
            <button onClick={dismiss} aria-label="Close" className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600">
              <X size={16} />
            </button>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#e5ead9] to-[#d4e4c8] text-[#16815d]">
              <ShoppingBag size={24} />
            </div>

            <h2 id="login-prompt-title" className="mt-4 text-lg font-bold">
              Sign in to Vanta
            </h2>
            <p className="mt-1.5 text-[13px] leading-6 text-slate-500">
              Create a free account to unlock these benefits:
            </p>

            <ul className="mt-4 space-y-2.5">
              {benefits.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3 text-[13px] text-slate-600">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#f1eee6] text-[#16815d]">
                    <Icon size={14} />
                  </span>
                  {text}
                </li>
              ))}
            </ul>

            <div className="mt-5 space-y-2">
              <button
                onClick={handleGoogleLogin}
                disabled={googleLoading}
                className="flex h-11 w-full items-center justify-center gap-2.5 rounded-full border border-slate-200 px-5 text-[13px] font-semibold transition hover:bg-slate-50 disabled:opacity-50"
              >
                <svg viewBox="0 0 48 48" className="h-4 w-4" aria-hidden="true">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
                {googleLoading ? "Signing in…" : "Continue with Google"}
              </button>

              <div className="flex items-center gap-3 text-[11px] uppercase tracking-wide text-slate-400">
                <span className="h-px flex-1 bg-slate-200" />
                or
                <span className="h-px flex-1 bg-slate-200" />
              </div>

              <Link
                href="/login"
                onClick={dismiss}
                className="block w-full rounded-full bg-[#16815d] px-5 py-2.5 text-center text-[13px] font-semibold text-white transition hover:bg-[#147a56]"
              >
                Log in with email
              </Link>
            </div>

            <button onClick={dismiss} className="mt-3 w-full text-center text-[12px] font-medium text-slate-400 transition-colors hover:text-slate-600">
              Not now
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
