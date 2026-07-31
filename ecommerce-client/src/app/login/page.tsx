"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, type Auth } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";
import { apiClient } from "@/services/api-client";

const errorMessages: Record<string, string> = {
  "auth/invalid-credential": "Incorrect email or password.",
  "auth/user-not-found": "No account found with that email.",
  "auth/wrong-password": "Incorrect password.",
  "auth/email-already-in-use": "An account already exists for that email.",
  "auth/weak-password": "Password should be at least 6 characters.",
  "auth/popup-closed-by-user": "Sign-in was cancelled.",
  "auth/network-request-failed": "Network error. Check your connection.",
  "auth/invalid-api-key": "Firebase isn't configured. Add the Firebase keys to ecommerce-client/.env.local.",
};

function messageFor(code: string) {
  return errorMessages[code] ?? "Something went wrong. Please try again.";
}

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function afterAuth() {
    const auth = getFirebaseAuth();
    const user = auth?.currentUser;
    if (!user) return;
    const idToken = await user.getIdToken();
    await apiClient.post("/auth/exchange", { idToken });
    toast.success(mode === "signin" ? "Welcome back." : "Account created.");
    router.replace("/account");
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const auth: Auth | null = getFirebaseAuth();
    if (!auth) {
      toast.error("Firebase isn't configured. Add the Firebase keys to ecommerce-client/.env.local.");
      return;
    }
    setSubmitting(true);
    try {
      if (mode === "signin") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      await afterAuth();
    } catch (error) {
      toast.error(messageFor((error as { code?: string }).code ?? ""));
    } finally {
      setSubmitting(false);
    }
  }

  async function google() {
    const auth = getFirebaseAuth();
    if (!auth) {
      toast.error("Firebase isn't configured. Add the Firebase keys to ecommerce-client/.env.local.");
      return;
    }
    setSubmitting(true);
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      await afterAuth();
    } catch (error) {
      const code = (error as { code?: string }).code ?? "";
      if (code !== "auth/popup-closed-by-user") toast.error(messageFor(code));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-[1240px] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-[0_1px_4px_rgba(0,0,0,.12)]">
        <h1 className="text-xl font-bold">{mode === "signin" ? "Sign in to Vanta" : "Create your account"}</h1>
        <p className="mt-1.5 text-[13px] text-slate-500">
          {mode === "signin" ? "Welcome back. Sign in to see your orders and saved items." : "Join Vanta for faster checkout and saved favourites."}
        </p>

        <button type="button" onClick={google} disabled={submitting} className="mt-6 flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 px-5 py-2.5 text-[13px] font-semibold hover:bg-slate-50 disabled:opacity-50">
          Continue with Google
        </button>

        <div className="my-5 flex items-center gap-3 text-[11px] uppercase tracking-wide text-slate-400">
          <span className="h-px flex-1 bg-slate-200" />
          or
          <span className="h-px flex-1 bg-slate-200" />
        </div>

        <form onSubmit={submit} className="space-y-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="h-11 w-full rounded-full border border-slate-200 px-5 text-[13px]"
          />
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="h-11 w-full rounded-full border border-slate-200 px-5 text-[13px]"
          />
          <button type="submit" disabled={submitting} className="w-full rounded-full bg-[#16815d] px-5 py-2.5 text-[13px] font-semibold text-white disabled:opacity-50">
            {submitting ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <p className="mt-5 text-center text-[13px] text-slate-500">
          {mode === "signin" ? "New to Vanta?" : "Already have an account?"}{" "}
          <button type="button" onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="font-semibold text-[#16815d]">
            {mode === "signin" ? "Create an account" : "Sign in"}
          </button>
        </p>
        <p className="mt-3 text-center">
          <Link href="/" className="text-[13px] underline">
            Continue browsing
          </Link>
        </p>
      </div>
    </main>
  );
}
