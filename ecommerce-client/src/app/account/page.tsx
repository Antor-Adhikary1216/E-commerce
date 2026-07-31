"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { LogOut, UserRound } from "lucide-react";
import { getFirebaseAuth } from "@/lib/firebase";
import { apiClient } from "@/services/api-client";
import { EmptyState } from "@/components/empty-state";

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) {
      setLoading(false);
      return;
    }
    return onAuthStateChanged(auth, (next) => {
      setUser(next);
      setLoading(false);
    });
  }, []);

  async function handleSignOut() {
    const auth = getFirebaseAuth();
    if (!auth) return;
    await signOut(auth);
    try {
      await apiClient.post("/auth/logout");
    } catch {
      // session already cleared client-side
    }
  }

  if (loading) return null;

  if (!user) {
    return (
      <EmptyState
        icon={<UserRound size={28} />}
        title="You're not signed in"
        message="Sign in to manage your orders, address book and personal details."
        action={{ href: "/login", label: "Sign in" }}
      />
    );
  }

  return (
    <main className="mx-auto max-w-[1240px] px-4 py-10">
      <div className="mx-auto w-full max-w-2xl rounded-2xl bg-white p-8 shadow-[0_1px_4px_rgba(0,0,0,.12)]">
        <div className="flex items-center gap-4">
          {user.photoURL ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.photoURL} alt="" className="h-14 w-14 rounded-full" />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e5ead9] text-[#16815d]">
              <UserRound size={24} />
            </div>
          )}
          <div>
            <h1 className="text-lg font-bold">{user.displayName ?? user.email?.split("@")[0] ?? "Customer"}</h1>
            <p className="text-[13px] text-slate-500">{user.email}</p>
          </div>
        </div>
        <p className="mt-6 border-t border-slate-100 pt-6 text-[13px] leading-6 text-slate-500">
          Orders, address book and preferences are coming soon. For now you can browse the market.
        </p>
        <div className="mt-6 flex items-center gap-3">
          <button onClick={handleSignOut} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-5 py-2.5 text-xs font-semibold hover:bg-slate-50">
            <LogOut size={14} /> Sign out
          </button>
          <Link href="/" className="inline-flex items-center rounded-full bg-[#16815d] px-5 py-2.5 text-xs font-semibold text-white">
            Continue browsing
          </Link>
        </div>
      </div>
    </main>
  );
}
