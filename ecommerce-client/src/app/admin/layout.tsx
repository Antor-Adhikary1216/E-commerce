"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";
import { apiClient } from "@/services/api-client";
import { AdminSidebar } from "@/components/admin-sidebar";
import { Spinner } from "@/components/ui/spinner";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) {
      router.push("/login?redirect=/admin/dashboard");
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login?redirect=/admin/dashboard");
        return;
      }

      try {
        const { data } = await apiClient.get("/user/profile");
        if (data.user?.role !== "admin") {
          router.push("/");
          return;
        }
        setAuthorized(true);
      } catch {
        router.push("/");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f5f5]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!authorized) return null;

  return (
    <div className="flex min-h-screen bg-[#f5f5f5]">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-[#1c2734] px-8 py-5 flex items-center gap-4 shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#d8ef72] text-[#1c2734]">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <div>
            <h1 className="text-[18px] font-bold text-white leading-tight">Admin Panel</h1>
            <p className="text-[12px] text-white/50">Manage your store</p>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
