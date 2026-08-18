import Link from "next/link";
import { RotateCcw, ShieldCheck, Truck, Phone, Mail, MessageCircle } from "lucide-react";

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.757-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
    </svg>
  );
}

const socialLinks = [
  { icon: LinkedinIcon, href: "https://www.linkedin.com/in/antor-adhikary", label: "LinkedIn" },
  { icon: FacebookIcon, href: "https://www.facebook.com/antor.adhikary.504041", label: "Facebook" },
  { icon: GithubIcon, href: "https://github.com/Antor-Adhikary1216", label: "GitHub" },
  { icon: InstagramIcon, href: "https://www.instagram.com/antor_adhikar_y/", label: "Instagram" },
];

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
      <div className="mx-auto grid max-w-[1360px] gap-8 px-6 py-10 sm:grid-cols-2 lg:grid-cols-5">
        <LinkColumn title="About" links={aboutLinks} />
        <LinkColumn title="Help" links={helpLinks} />
        <LinkColumn title="Policies" links={policyLinks} />
        <LinkColumn title="Company" links={companyLinks} />
        <div>
          <h3 className="text-[11px] font-bold uppercase tracking-[.18em] text-white/50">Live Support</h3>
          <ul className="mt-3 space-y-3 text-[12px]">
            <li>
              <a href="tel:18001234567" className="flex items-center gap-2.5 text-white/70 transition hover:text-white">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-[#d8ef72]">
                  <Phone size={14} />
                </span>
                <div>
                  <span className="block font-semibold text-white">1800-123-4567</span>
                  <span className="text-[11px] text-white/40">Toll-free, 24/7</span>
                </div>
              </a>
            </li>
            <li>
              <a href="mailto:support@shoppingindia.in" className="flex items-center gap-2.5 text-white/70 transition hover:text-white">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-[#d8ef72]">
                  <Mail size={14} />
                </span>
                <div>
                  <span className="block font-semibold text-white">support@shoppingindia.in</span>
                  <span className="text-[11px] text-white/40">We reply within 24 hrs</span>
                </div>
              </a>
            </li>
            <li>
              <Link href="/support" className="flex items-center gap-2.5 text-white/70 transition hover:text-white">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-[#d8ef72]">
                  <MessageCircle size={14} />
                </span>
                <div>
                  <span className="block font-semibold text-white">Live Chat</span>
                  <span className="text-[11px] text-white/40">Chat with our team</span>
                </div>
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1360px] flex-col items-center justify-between gap-3 px-6 py-5 text-[11px] text-white/40 md:flex-row">
          <p>&copy; {year} Shopping India. All rights reserved.</p>
          <p className="mt-1">Created by <a href="https://antoradhikari-rho.vercel.app/" target="_blank" rel="noopener noreferrer" className="font-semibold text-white/60 transition hover:text-white">Antor Adhikari</a></p>
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 transition hover:text-white"
                aria-label={social.label}
              >
                <social.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
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
