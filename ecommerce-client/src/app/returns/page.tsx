"use client";
import { AuthRequired } from "@/components/auth-required";

export default function ReturnsPage() {
  return (
    <AuthRequired>
      <main className="mx-auto max-w-[800px] px-4 py-10">
        <h1 className="text-2xl font-bold text-[#1c2734]">Returns & Cancellation Policy</h1>
        <div className="mt-6 space-y-4 text-sm leading-7 text-slate-600">
          <h2 className="text-base font-semibold text-[#1c2734]">Return Policy</h2>
          <ul className="list-disc pl-5">
            <li>Most items can be returned within 7 days of delivery</li>
            <li>Item must be unused, undamaged, and in original packaging</li>
            <li>Electronics may have a 48-hour return window — check product page</li>
            <li>Perishable goods, innerwear, and customized items are non-returnable</li>
          </ul>

          <h2 className="text-base font-semibold text-[#1c2734]">How to Return</h2>
          <ol className="list-decimal pl-5">
            <li>Go to My Orders and select the item</li>
            <li>Click &quot;Return&quot; and select a reason</li>
            <li>Schedule a pickup or drop off at the nearest center</li>
            <li>Refund is processed within 24-48 hours after inspection</li>
          </ol>

          <h2 className="text-base font-semibold text-[#1c2734]">Cancellation</h2>
          <p>
            You can cancel an order before it is shipped. Once shipped, cancellation is not possible
            — you can refuse delivery or return the item after receiving it.
          </p>
        </div>
      </main>
    </AuthRequired>
  );
}
