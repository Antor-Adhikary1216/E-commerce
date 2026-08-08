import type { Metadata } from "next";
import { Search, Package, CreditCard, RotateCcw, User, Truck, Wrench, Mail, Phone, MessageCircle } from "lucide-react";
import { TopicCard } from "@/components/support/topic-card";
import { FaqAccordion, type FaqItem } from "@/components/support/faq-accordion";
import { ContactCard } from "@/components/support/contact-card";

export const metadata: Metadata = {
  title: "Help Center",
  description: "Get help with orders, payments, returns, and more. Browse FAQs or contact our support team.",
};

const topics = [
  { icon: Package, title: "Orders & Tracking", description: "Track your order, view order history, or report an issue.", href: "#orders" },
  { icon: CreditCard, title: "Payments & Refunds", description: "Payment methods, failed transactions, and refund status.", href: "#payments" },
  { icon: RotateCcw, title: "Returns & Cancellations", description: "How to return a product or cancel an order.", href: "#returns" },
  { icon: User, title: "Account & Profile", description: "Manage your account, addresses, and preferences.", href: "#account" },
  { icon: Truck, title: "Delivery", description: "Shipping options, delivery timeframes, and location serviceability.", href: "#delivery" },
  { icon: Wrench, title: "Product Issues", description: "Warranty claims, defective products, and missing items.", href: "#product" },
];

const ordersFaq: FaqItem[] = [
  { question: "How do I track my order?", answer: "Go to My Orders in your account and click on the order you want to track. You will see the real-time status and estimated delivery date." },
  { question: "Can I change my delivery address after placing an order?", answer: "You can change the delivery address only before the order is shipped. Go to My Orders, select the order, and click 'Edit Address' if the option is available." },
  { question: "What does 'Order Confirmed' mean?", answer: "Order Confirmed means we have received your order and it is being prepared for dispatch. You will receive a notification once it ships." },
];

const paymentsFaq: FaqItem[] = [
  { question: "What payment methods are accepted?", answer: "We accept UPI, credit/debit cards, net banking, wallets, and cash on delivery (COD) for eligible orders." },
  { question: "My payment was debited but order was not placed.", answer: "This can happen due to network issues. The amount will be refunded within 5-7 business days. If not, contact support with your transaction ID." },
  { question: "How long does a refund take?", answer: "Refunds are processed within 24-48 hours after the return is approved. It may take 5-7 business days to reflect in your account depending on your bank." },
];

const returnsFaq: FaqItem[] = [
  { question: "How do I return a product?", answer: "Go to My Orders, select the item, and click 'Return'. Choose a reason and schedule a pickup. The pickup agent will collect the item within 2-3 days." },
  { question: "What is the return window?", answer: "Most items can be returned within 7 days of delivery. Some categories like electronics may have a shorter window. Check the product page for specific return policies." },
  { question: "Can I cancel an order after it is shipped?", answer: "Once shipped, you cannot cancel the order. However, you can refuse delivery or return the item after receiving it." },
];

const accountFaq: FaqItem[] = [
  { question: "How do I update my email or phone number?", answer: "Go to Account Settings > Profile and update your contact details. You may need to verify the new email or phone number." },
  { question: "I forgot my password. How do I reset it?", answer: "Click 'Forgot Password' on the login page. You will receive a reset link via email or an OTP on your phone." },
];

const deliveryFaq: FaqItem[] = [
  { question: "What are the delivery charges?", answer: "Delivery is free on orders above ₹499. For orders below ₹499, a flat fee of ₹40 is charged. Premium delivery options may have additional charges." },
  { question: "Do you deliver to my area?", answer: "Enter your pincode on the product page to check serviceability. We deliver to most pin codes across India." },
  { question: "Can I choose a delivery time slot?", answer: "Currently, we offer standard delivery. Time-slot based delivery is available in select cities for select products." },
];

const productFaq: FaqItem[] = [
  { question: "What if I receive a defective product?", answer: "Initiate a return from My Orders within 48 hours of delivery. Select 'Defective/Damaged' as the reason and upload photos. We will arrange a pickup and replacement." },
  { question: "How do I claim warranty?", answer: "Contact the brand's authorized service center with your invoice. Some brands also offer doorstep warranty service." },
];

export default function SupportPage() {
  return (
    <main className="mx-auto max-w-[1080px] px-4 py-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-[#1c2734]">Help Center</h1>
        <p className="mt-2 text-sm text-slate-500">How can we help you today?</p>

        <div className="mx-auto mt-6 flex max-w-lg items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
          <Search size={18} className="shrink-0 text-slate-400" />
          <input
            type="text"
            placeholder="Search for help..."
            className="w-full bg-transparent text-sm text-[#1c2734] outline-none placeholder:text-slate-400"
          />
        </div>
      </div>

      <section className="mt-10">
        <h2 className="mb-4 text-base font-semibold text-[#1c2734]">Browse Topics</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map((t) => (
            <TopicCard key={t.title} {...t} />
          ))}
        </div>
      </section>

      <section className="mt-12 space-y-8">
        <div id="orders"><FaqAccordion title="Orders & Tracking" items={ordersFaq} /></div>
        <div id="payments"><FaqAccordion title="Payments & Refunds" items={paymentsFaq} /></div>
        <div id="returns"><FaqAccordion title="Returns & Cancellations" items={returnsFaq} /></div>
        <div id="account"><FaqAccordion title="Account & Profile" items={accountFaq} /></div>
        <div id="delivery"><FaqAccordion title="Delivery" items={deliveryFaq} /></div>
        <div id="product"><FaqAccordion title="Product Issues" items={productFaq} /></div>
      </section>

      <section className="mt-12">
        <h2 className="mb-4 text-base font-semibold text-[#1c2734]">Still need help?</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <ContactCard icon={Mail} title="Email Us" value="support@shoppingindia.in" href="mailto:support@shoppingindia.in" />
          <ContactCard icon={Phone} title="Call Us" value="1800-123-4567" href="tel:18001234567" />
          <ContactCard icon={MessageCircle} title="Live Chat" value="Chat with us" href="#chat" />
        </div>
      </section>
    </main>
  );
}
