import type { Metadata } from "next";

export const metadata: Metadata = { title: "Payment Methods" };

export default function PaymentsPage() {
  return (
    <main className="mx-auto max-w-[800px] px-4 py-10">
      <h1 className="text-2xl font-bold text-[#1c2734]">Payment Methods</h1>
      <div className="mt-6 space-y-4 text-sm leading-7 text-slate-600">
        <p>We accept a wide range of payment methods for your convenience:</p>
        <ul className="list-disc pl-5">
          <li><strong>UPI</strong> — Google Pay, PhonePe, Paytm, BHIM, and other UPI apps</li>
          <li><strong>Credit / Debit Cards</strong> — Visa, Mastercard, RuPay, Amex</li>
          <li><strong>Net Banking</strong> — All major banks supported</li>
          <li><strong>Wallets</strong> — Paytm, Mobikwik, Freecharge</li>
          <li><strong>Cash on Delivery (COD)</strong> — Available for eligible orders up to ₹50,000</li>
        </ul>

        <h2 className="text-base font-semibold text-[#1c2734]">Security</h2>
        <p>
          All transactions are secured with 256-bit SSL encryption. We do not store your card
          details on our servers. Payments are processed through PCI-DSS compliant gateways.
        </p>
      </div>
    </main>
  );
}
