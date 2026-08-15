"use client";
import { AccountSidebar } from "@/components/account-sidebar";
import { AuthRequired } from "@/components/auth-required";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthRequired>
      <div className="flex min-h-[calc(100vh-64px)]">
        <AccountSidebar />
        <main className="flex-1 overflow-y-auto bg-white">
          {children}
        </main>
      </div>
    </AuthRequired>
  );
}
