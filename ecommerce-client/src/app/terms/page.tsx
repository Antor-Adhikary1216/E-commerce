import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Use" };

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-[800px] px-4 py-10">
      <h1 className="text-2xl font-bold text-[#1c2734]">Terms of Use</h1>
      <div className="mt-6 space-y-4 text-sm leading-7 text-slate-600">
        <p><em>Last updated: January 2026</em></p>

        <h2 className="text-base font-semibold text-[#1c2734]">Acceptance of Terms</h2>
        <p>
          By accessing or using Shopping India, you agree to be bound by these Terms of Use.
          If you do not agree, please do not use the platform.
        </p>

        <h2 className="text-base font-semibold text-[#1c2734]">Account Responsibilities</h2>
        <p>
          You are responsible for maintaining the confidentiality of your account credentials
          and for all activities under your account. You must be at least 18 years old to use
          the platform.
        </p>

        <h2 className="text-base font-semibold text-[#1c2734]">Orders & Pricing</h2>
        <p>
          All orders are subject to product availability. We reserve the right to cancel orders
          at our discretion. Prices may change without notice, but confirmed orders will be
          honored at the listed price.
        </p>

        <h2 className="text-base font-semibold text-[#1c2734]">Intellectual Property</h2>
        <p>
          All content on Shopping India — including logos, images, text, and software — is
          owned by or licensed to us. You may not reproduce, distribute, or create derivative
          works without written permission.
        </p>
      </div>
    </main>
  );
}
