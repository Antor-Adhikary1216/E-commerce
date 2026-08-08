"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FaqItem {
  question: string;
  answer: string;
}

export function FaqAccordion({ items, title }: { items: FaqItem[]; title: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div>
      <h2 className="mb-4 text-base font-semibold text-[#1c2734]">{title}</h2>
      <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
        {items.map((item, i) => (
          <div key={i}>
            <button
              type="button"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              aria-expanded={openIndex === i}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium text-[#1c2734] transition hover:bg-slate-50"
            >
              <span>{item.question}</span>
              <ChevronDown
                size={16}
                className={cn(
                  "shrink-0 text-slate-400 transition-transform",
                  openIndex === i && "rotate-180"
                )}
              />
            </button>
            {openIndex === i && (
              <div className="px-5 pb-4 text-[13px] leading-6 text-slate-600">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
