"use client";
import { useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { useAuthUser } from "@/lib/use-auth-user";

export function useRequireAuth() {
  const user = useAuthUser();
  const router = useRouter();
  const pathname = usePathname();

  return useCallback(() => {
    if (user === undefined) return false;
    if (user === null) {
      toast("Please sign in to continue.");
      const redirect = encodeURIComponent(pathname);
      router.push(`/login?redirect=${redirect}`);
      return false;
    }
    return true;
  }, [user, router, pathname]);
}
