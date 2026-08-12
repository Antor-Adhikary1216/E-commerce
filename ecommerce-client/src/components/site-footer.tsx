import Link from "next/link";
import { RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { FooterSubscribe } from "@/components/footer-subscribe";

const aboutLinks = [
  { label: "Contact Us", href: "/support" },
  { label: "About Us", href: "/about" },
  { label: "Careers", href: "/about" },
  { label: "Press", href: "/about" },
];

const helpLinks = [
  { label: "Payments", href: "/payments" },
  { label: "Shipping", href: "/shipping" },
  { label: "Returns & Cancellation", href: "/returns" },
  { label: "FAQ", href: "/support" },
];

const policyLinks = [
  { label: "Cancellation & Returns", href: "/returns" },
  { label: "Terms of Use", href: "/terms" },
  { label: "Security", href: "/privacy" },
  { label: "Privacy", href: "/privacy" },
  { label: "Sitemap", href: "/sitemap.xml" },
];

const companyLinks = [
  { label: "About Us", href: "/about" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Wishlist", href: "/wishlist" },
  { label: "Your Account", href: "/account" },
];

const trust = [
  { icon: Truck, title: "Free delivery", text: "On orders over ₹499" },
  { icon: RotateCcw, title: "Easy returns", text: "7-day return policy" },
  { icon: ShieldCheck, title: "Secure checkout", text: "100% secure payments" },
];

function LinkColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h3 className="text-[11px] font-bold uppercase tracking-[.18em] text-white/50">{title}</h3>
      <ul className="mt-3 space-y-2 text-[12px]">
        {links.map((link) => (
          <li key={link.label}>
            <Link href={link.href} className="text-white/70 transition hover:text-white">
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
      {/* Trust badges */}
      <div className="border-b border-white/10">
        <div className="mx-auto grid max-w-[1360px] gap-4 px-6 py-5 sm:grid-cols-3">
          {trust.map((item) => (
            <div key={item.title} className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-[#d8ef72]">
                <item.icon size={16} />
              </span>
              <span className="text-left">
                <span className="block text-[12px] font-semibold">{item.title}</span>
                <span className="block text-[11px] text-white/50">{item.text}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main footer columns */}
      <div className="mx-auto grid max-w-[1360px] gap-8 px-6 py-10 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="text-[11px] font-bold uppercase tracking-[.18em] text-white/50">About</h3>
          <ul className="mt-3 space-y-2 text-[12px]">
            {aboutLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="text-white/70 transition hover:text-white">{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <LinkColumn title="Help" links={helpLinks} />
        <LinkColumn title="Policies" links={policyLinks} />
        <div>
          <LinkColumn title="Company" links={companyLinks} />
          <div className="mt-5">
            <p className="text-[11px] font-bold uppercase tracking-[.18em] text-white/50">Mail Us</p>
            <p className="mt-2 text-[12px] leading-5 text-white/60">
              Shopping India Pvt. Ltd.<br />
              Tech Park, Outer Ring Road,<br />
              Bengaluru, Karnataka 560103
            </p>
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <FooterSubscribe />

      {/* Copyright */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1360px] flex-col items-center justify-between gap-3 px-6 py-5 text-[11px] text-white/40 md:flex-row">
          <p>&copy; {year} Shopping India. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="transition hover:text-white">Privacy</Link>
            <Link href="/terms" className="transition hover:text-white">Terms</Link>
            <Link href="/returns" className="transition hover:text-white">Returns</Link>
            <Link href="/shipping" className="transition hover:text-white">Shipping</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
