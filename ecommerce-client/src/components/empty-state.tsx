import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  message: string;
  action?: { href: string; label: string };
}

export function EmptyState({ icon, title, message, action }: EmptyStateProps) {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-[1240px] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-[0_1px_4px_rgba(0,0,0,.12)]">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e5ead9] text-[#16815d]">{icon}</div>
        <h1 className="mt-5 text-xl font-bold">{title}</h1>
        <p className="mt-2 text-[13px] leading-6 text-slate-500">{message}</p>
        {action && (
          <Link href={action.href} className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-[#16815d] px-5 py-2.5 text-xs font-semibold text-white hover:scale-[1.02]">
            {action.label} <ArrowRight size={14} />
          </Link>
        )}
      </div>
    </main>
  );
}
