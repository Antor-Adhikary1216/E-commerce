import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Terms & Conditions – Shopping in India.in" };

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-[800px] px-4 py-10">
      <h1 className="text-2xl font-bold text-[#1c2734]">Terms &amp; Conditions</h1>
      <div className="mt-6 space-y-6 text-sm leading-7 text-slate-600">
        <p><em>Last updated: August 2026</em></p>

        {/* ─── 1. Acceptance ─── */}
        <section>
          <h2 className="text-base font-semibold text-[#1c2734]">1. Acceptance of Terms</h2>
          <p>
            By creating an account, logging in, or using any feature of{" "}
            <strong>Shopping in India.in</strong> (the &quot;Platform&quot;), you agree to be
            bound by these Terms &amp; Conditions. If you do not agree, please do not use the
            Platform.
          </p>
        </section>

        {/* ─── 2. Eligibility ─── */}
        <section>
          <h2 className="text-base font-semibold text-[#1c2734]">2. Eligibility</h2>
          <p>
            You must be at least <strong>18 years old</strong> (or the age of majority in your
            jurisdiction) to create an account. By registering, you confirm that you meet this
            requirement and that all information you provide is truthful and accurate.
          </p>
        </section>

        {/* ─── 3. Your Account ─── */}
        <section>
          <h2 className="text-base font-semibold text-[#1c2734]">3. Your Account</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>You are responsible for keeping your password and login credentials confidential.</li>
            <li>You are liable for all activity that occurs under your account.</li>
            <li>You must notify us immediately at <strong>support@shoppinginindia.in</strong> if you suspect unauthorized access.</li>
            <li>We may suspend or disable accounts that violate these Terms.</li>
          </ul>
        </section>

        {/* ─── 4. What You Can Do ─── */}
        <section>
          <h2 className="text-base font-semibold text-[#1c2734]">4. What You Can Do</h2>
          <p>As a registered user you may:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Browse, search, and purchase products listed on the Platform.</li>
            <li>Track your orders and view order history.</li>
            <li>Save items to your wishlist for later.</li>
            <li>Manage your shipping addresses and account profile.</li>
            <li>Contact customer support for order-related issues.</li>
            <li>Cancel eligible orders (pending or confirmed) from <strong>My Orders</strong>.</li>
            <li>Request a password reset via email.</li>
          </ul>
        </section>

        {/* ─── 5. What You Cannot Do ─── */}
        <section>
          <h2 className="text-base font-semibold text-[#1c2734]">5. What You Cannot Do</h2>
          <p>You agree <strong>not</strong> to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Use the Platform for any unlawful purpose or in violation of applicable laws.</li>
            <li>Attempt to gain unauthorized access to other accounts, systems, or networks.</li>
            <li>Use bots, scrapers, or automated tools to access or collect data from the Platform.</li>
            <li>Post false, misleading, or defamatory content in reviews or communications.</li>
            <li>Resell products purchased on the Platform without written permission.</li>
            <li>Interfere with or disrupt the Platform&apos;s infrastructure or security features.</li>
            <li>Reproduce, distribute, or create derivative works from Platform content.</li>
          </ul>
        </section>

        {/* ─── 6. Orders & Payments ─── */}
        <section>
          <h2 className="text-base font-semibold text-[#1c2734]">6. Orders &amp; Payments</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>All orders are subject to product availability. We reserve the right to cancel or limit quantities at our discretion.</li>
            <li>Prices may change without prior notice. Confirmed orders will be honored at the price shown at checkout.</li>
            <li>Payments are processed through secure third-party gateways (Stripe). We do not store your credit card details.</li>
            <li>Cash on Delivery (COD) orders must be paid in full at the time of delivery.</li>
            <li>Online payments that are confirmed are eligible for a refund if the order is cancelled before dispatch, processed within 5–7 business days.</li>
          </ul>
        </section>

        {/* ─── 7. Cancellations & Refunds ─── */}
        <section>
          <h2 className="text-base font-semibold text-[#1c2734]">7. Cancellations &amp; Refunds</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>You may cancel orders in <strong>pending</strong> or <strong>confirmed</strong> status from the My Orders section.</li>
            <li>Orders that are <strong>packed</strong>, <strong>shipped</strong>, or <strong>out for delivery</strong> cannot be cancelled by you — please contact support instead.</li>
            <li>Refunds for online payments are initiated to the original payment method within 5–7 business days of cancellation.</li>
            <li>COD orders do not involve a refund since payment is collected on delivery.</li>
          </ul>
        </section>

        {/* ─── 8. Data We Collect ─── */}
        <section>
          <h2 className="text-base font-semibold text-[#1c2734]">8. Data We Collect</h2>
          <p>
            When you use the Platform, you consent to the collection and processing of the
            following data:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Account Information:</strong> Name, email address, phone number, gender, date of birth — provided during sign-up or profile update.</li>
            <li><strong>Authentication Data:</strong> Firebase authentication tokens used to verify your identity. We do not see or store your password.</li>
            <li><strong>Order Data:</strong> Products purchased, order totals, shipping addresses, and payment method type (Stripe or COD).</li>
            <li><strong>Payment Metadata:</strong> Stripe session IDs and payment intent references. Full card numbers are <strong>never</strong> stored on our servers.</li>
            <li><strong>Usage Data:</strong> Pages visited, products viewed, and interaction patterns — used to improve the Platform experience.</li>
            <li><strong>Cookies &amp; Local Storage:</strong> Shopping cart, wishlist, and authentication tokens stored locally on your device for session continuity.</li>
          </ul>
        </section>

        {/* ─── 9. How We Use Your Data ─── */}
        <section>
          <h2 className="text-base font-semibold text-[#1c2734]">9. How We Use Your Data</h2>
          <p>We use the data described above to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Process and fulfil your orders, including shipping and delivery.</li>
            <li>Send transactional emails: order confirmations, cancellation notices, and refund updates.</li>
            <li>Authenticate your session and protect against fraud.</li>
            <li>Improve product recommendations, search relevance, and overall user experience.</li>
            <li>Communicate with you about support requests, policy changes, or promotional offers (you may opt out of marketing emails at any time).</li>
          </ul>
        </section>

        {/* ─── 10. Your Consent ─── */}
        <section>
          <h2 className="text-base font-semibold text-[#1c2734]">10. Your Consent</h2>
          <p>
            By checking the &quot;I agree to the Terms &amp; Conditions&quot; box and creating an
            account or signing in, you provide explicit consent to:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>The collection and processing of your personal data as described in Section 8.</li>
            <li>The use of your data for order fulfillment and communication as described in Section 9.</li>
            <li>The storage of authentication tokens and cart/wishlist data in your browser&apos;s local storage.</li>
            <li>Receiving transactional emails related to your orders and account security.</li>
          </ul>
          <p>
            You may withdraw consent by contacting us at <strong>support@shoppinginindia.in</strong>,
            though this may limit your ability to use certain Platform features.
          </p>
        </section>

        {/* ─── 11. Data Retention ─── */}
        <section>
          <h2 className="text-base font-semibold text-[#1c2734]">11. Data Retention</h2>
          <p>
            We retain your account and order data for as long as your account is active or as
            needed to provide services. You may request deletion of your account and associated
            data by contacting <strong>support@shoppinginindia.in</strong>.
          </p>
        </section>

        {/* ─── 12. Limitation of Liability ─── */}
        <section>
          <h2 className="text-base font-semibold text-[#1c2734]">12. Limitation of Liability</h2>
          <p>
            The Platform is provided &quot;as is&quot; without warranties of any kind. We are not
            liable for indirect, incidental, or consequential damages arising from your use of the
            Platform. Our total liability shall not exceed the amount you paid for the order in
            question.
          </p>
        </section>

        {/* ─── 13. Changes ─── */}
        <section>
          <h2 className="text-base font-semibold text-[#1c2734]">13. Changes to These Terms</h2>
          <p>
            We may update these Terms from time to time. Material changes will be communicated via
            email or a notice on the Platform. Continued use after changes constitutes acceptance
            of the updated Terms.
          </p>
        </section>

        {/* ─── 14. Contact ─── */}
        <section>
          <h2 className="text-base font-semibold text-[#1c2734]">14. Contact Us</h2>
          <p>
            For questions about these Terms, reach us at{" "}
            <strong>support@shoppinginindia.in</strong>.
          </p>
        </section>

        <div className="pt-4">
          <Link href="/login" className="text-[13px] font-semibold text-[#16815d] hover:underline">
            ← Back to Sign in
          </Link>
        </div>
      </div>
    </main>
  );
}
