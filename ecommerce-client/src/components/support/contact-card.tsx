import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContactCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  href: string;
  className?: string;
}

export function ContactCard({ icon: Icon, title, value, href, className }: ContactCardProps) {
  return (
    <a
      href={href}
      className={cn(
        "group flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 transition hover:border-[#2874f0] hover:shadow-md",
        className
      )}
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#2874f0]/10 text-[#2874f0] transition group-hover:bg-[#2874f0] group-hover:text-white">
        <Icon size={20} />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-slate-500">{title}</p>
        <p className="mt-0.5 truncate text-sm font-semibold text-[#1c2734]">{value}</p>
      </div>
    </a>
  );
}
