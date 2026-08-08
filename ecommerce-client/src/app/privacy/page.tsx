import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-[800px] px-4 py-10">
      <h1 className="text-2xl font-bold text-[#1c2734]">Privacy Policy</h1>
      <div className="mt-6 space-y-4 text-sm leading-7 text-slate-600">
        <p><em>Last updated: January 2026</em></p>

        <h2 className="text-base font-semibold text-[#1c2734]">Information We Collect</h2>
        <p>
          We collect information you provide directly: name, email, phone number, delivery address,
          and payment details. We also collect usage data such as pages visited, search queries,
          and device information.
        </p>

        <h2 className="text-base font-semibold text-[#1c2734]">How We Use Your Information</h2>
        <ul className="list-disc pl-5">
          <li>To process and fulfill your orders</li>
          <li>To send order updates and promotional communications</li>
          <li>To improve our services and personalize your experience</li>
          <li>To detect and prevent fraud</li>
        </ul>

        <h2 className="text-base font-semibold text-[#1c2734]">Data Sharing</h2>
        <p>
          We do not sell your personal information. We share data only with delivery partners,
          payment gateways, and service providers as necessary to fulfill orders.
        </p>

        <h2 className="text-base font-semibold text-[#1c2734]">Your Rights</h2>
        <p>
          You can access, update, or delete your account data from Account Settings. For
          additional requests, contact us at privacy@shoppingindia.in.
        </p>
      </div>
    </main>
  );
}
