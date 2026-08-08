import type { Metadata } from "next";

export const metadata: Metadata = { title: "About Us" };

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-[800px] px-4 py-10">
      <h1 className="text-2xl font-bold text-[#1c2734]">About Shopping India</h1>
      <div className="mt-6 space-y-4 text-sm leading-7 text-slate-600">
        <p>
          Shopping India is your one-stop online marketplace for everyday essentials across India.
          We bring you great products at better prices, with a shopping experience designed to be
          fast, reliable, and enjoyable.
        </p>
        <p>
          From mobiles and electronics to fashion, home goods, and groceries — we partner with
          thousands of sellers to offer millions of products at your fingertips.
        </p>
        <p>
          Our mission is to make online shopping accessible to every Indian, with secure payments,
          fast delivery, and hassle-free returns.
        </p>
      </div>
    </main>
  );
}
