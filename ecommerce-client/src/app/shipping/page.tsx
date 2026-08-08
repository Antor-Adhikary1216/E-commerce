import type { Metadata } from "next";

export const metadata: Metadata = { title: "Shipping Policy" };

export default function ShippingPage() {
  return (
    <main className="mx-auto max-w-[800px] px-4 py-10">
      <h1 className="text-2xl font-bold text-[#1c2734]">Shipping Policy</h1>
      <div className="mt-6 space-y-4 text-sm leading-7 text-slate-600">
        <h2 className="text-base font-semibold text-[#1c2734]">Delivery Charges</h2>
        <ul className="list-disc pl-5">
          <li>Free delivery on orders above ₹499</li>
          <li>Flat ₹40 delivery fee for orders below ₹499</li>
          <li>Premium delivery options available at checkout for select areas</li>
        </ul>

        <h2 className="text-base font-semibold text-[#1c2734]">Delivery Timeframes</h2>
        <ul className="list-disc pl-5">
          <li>Metro cities: 2-5 business days</li>
          <li>Tier 2-3 cities: 4-7 business days</li>
          <li>Rural areas: 5-10 business days</li>
        </ul>

        <h2 className="text-base font-semibold text-[#1c2734]">Tracking</h2>
        <p>
          Once your order is shipped, you will receive a tracking link via email and SMS.
          You can also track your order from the My Orders section in your account.
        </p>
      </div>
    </main>
  );
}
