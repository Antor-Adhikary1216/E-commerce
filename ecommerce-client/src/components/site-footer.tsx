import Link from "next/link";
import { RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { NewsletterForm } from "@/components/newsletter-form";

const shopLinks = [
  { label: "Mobiles", href: "/shop?category=Mobiles" },
  { label: "Laptops", href: "/shop?category=Laptops" },
  { label: "Headphones", href: "/shop?category=Headphones" },
  { label: "Sneakers", href: "/shop?category=Sneakers" },
  { label: "Furniture", href: "/shop?category=Furniture" },
  { label: "Today's offers", href: "/sale" },
];

const helpLinks = [
  { label: "Contact us", href: "/about" },
  { label: "Shipping", href: "/shipping" },
  { label: "Payments", href: "/payments" },
  { label: "Returns", href: "/returns" },
];

const companyLinks = [
  { label: "About us", href: "/about" },
  { label: "Privacy policy", href: "/privacy" },
  { label: "Wishlist", href: "/wishlist" },
  { label: "Your account", href: "/account" },
];

const trust = [
  { icon: Truck, title: "Free delivery", text: "On orders over the mark" },
  { icon: RotateCcw, title: "Easy returns", text: "7-day no-questions returns" },
  { icon: ShieldCheck, title: "Secure checkout", text: "Payments you can trust" },
];

function LinkColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-[.18em] text-white/40">{title}</h3>
      <ul className="mt-4 space-y-2.5 text-[13px]">
        {links.map((link) => (
          <li key={link.label}>
            <Link href={link.href} className="text-white/75 transition hover:text-[#d8ef72]">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-10 bg-[#1c2734] text-white">
      <div className="border-b border-white/10">
        <div className="mx-auto grid max-w-[1360px] gap-6 px-6 py-6 text-center sm:grid-cols-3">
          {trust.map((item) => (
            <div key={item.title} className="flex items-center justify-center gap-3 sm:justify-start">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-[#d8ef72]">
                <item.icon size={18} />
              </span>
              <span className="text-left">
                <span className="block text-[13px] font-semibold">{item.title}</span>
                <span className="block text-[12px] text-white/50">{item.text}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto grid max-w-[1360px] gap-10 px-6 py-14 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <Link href="/" className="text-2xl font-black tracking-tight">
            VANTA<span className="text-[#d8ef72]">/</span>
          </Link>
          <p className="mt-3 max-w-xs text-[13px] leading-6 text-white/60">A considered destination for everyday essentials — good things, better prices.</p>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[.18em] text-white/40">Get the good stuff first</p>
          <div className="mt-3 max-w-sm">
            <NewsletterForm />
          </div>
        </div>
        <LinkColumn title="Shop" links={shopLinks} />
        <LinkColumn title="Help" links={helpLinks} />
        <LinkColumn title="Company" links={companyLinks} />
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1360px] flex-col items-center justify-between gap-3 px-6 py-6 text-xs text-white/50 md:flex-row">
          <p>© {year} Vanta Commerce. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="transition hover:text-white">Privacy</Link>
            <Link href="/returns" className="transition hover:text-white">Returns</Link>
            <Link href="/shipping" className="transition hover:text-white">Shipping</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
