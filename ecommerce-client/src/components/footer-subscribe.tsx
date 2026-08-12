"use client";
import { useAuthUser } from "@/lib/use-auth-user";
import { NewsletterForm } from "@/components/newsletter-form";

export function FooterSubscribe() {
  const user = useAuthUser();

  if (!user) return null;

  return (
    <div className="border-t border-white/10">
      <div className="mx-auto flex max-w-[1360px] flex-col items-start gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[.18em] text-white/50">Subscribe for deals</p>
          <p className="mt-1 text-[12px] text-white/50">Get the best offers delivered to your inbox.</p>
        </div>
        <div className="w-full max-w-sm">
          <NewsletterForm />
        </div>
      </div>
    </div>
  );
}
