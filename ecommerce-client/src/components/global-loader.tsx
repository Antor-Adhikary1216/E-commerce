"use client";
import { useEffect, useRef, useState } from "react";
import { useIsGlobalLoading } from "@/contexts/loading-context";

export function GlobalLoader() {
  const isLoading = useIsGlobalLoading();
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (isLoading) {
      // Minimum 200ms display to prevent flicker
      setVisible(true);
    } else {
      // Keep visible for at least 200ms after loading finishes
      timerRef.current = setTimeout(() => setVisible(false), 200);
    }
    return () => clearTimeout(timerRef.current);
  }, [isLoading]);

  if (!visible) return null;

  return (
    <div
      aria-live="polite"
      aria-label="Loading"
      className="pointer-events-none fixed inset-0 z-[9998] flex items-center justify-center bg-white/60 backdrop-blur-[2px] transition-opacity duration-300"
      style={{ opacity: isLoading ? 1 : 0 }}
    >
      <div className="flex flex-col items-center gap-3">
        <span className="h-10 w-10 animate-spin rounded-full border-[3px] border-[#1c2734] border-t-transparent" />
        <span className="text-xs font-medium tracking-wide text-[#1c2734]/70">Loading...</span>
      </div>
    </div>
  );
}
