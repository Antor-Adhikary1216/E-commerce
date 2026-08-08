"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      toast.success("Thanks for subscribing!");
      setEmail("");
      setLoading(false);
    }, 600);
  }

  return (
    <form onSubmit={submit} className="flex gap-2">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email address"
        aria-label="Email address"
        disabled={loading}
        className="h-11 w-full min-w-0 flex-1 rounded-full bg-white/10 px-5 text-[13px] text-white placeholder:text-white/50 disabled:opacity-50"
      />
      <Button type="submit" loading={loading} className="h-11 shrink-0 rounded-full bg-[#d8ef72] px-5 text-xs font-bold text-[#1c2734] hover:bg-[#cfe563]">
        SUBSCRIBE
      </Button>
    </form>
  );
}
