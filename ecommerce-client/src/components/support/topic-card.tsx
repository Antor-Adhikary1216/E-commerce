import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface TopicCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  className?: string;
}

export function TopicCard({ icon: Icon, title, description, href, className }: TopicCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex flex-col items-start gap-3 rounded-xl border border-slate-200 bg-white p-5 transition hover:border-[#2874f0] hover:shadow-md",
        className
      )}
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2874f0]/10 text-[#2874f0] transition group-hover:bg-[#2874f0] group-hover:text-white">
        <Icon size={20} />
      </span>
      <div>
        <h3 className="text-sm font-semibold text-[#1c2734]">{title}</h3>
        <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
      </div>
    </Link>
  );
}
