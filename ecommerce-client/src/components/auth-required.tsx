"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthUser } from "@/lib/use-auth-user";
import { Spinner } from "@/components/ui/spinner";

export function AuthRequired({ children }: { children: React.ReactNode }) {
  const user = useAuthUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (user === null) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [user, router, pathname]);

  if (user === undefined) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (user === null) return null;

  return <>{children}</>;
}
