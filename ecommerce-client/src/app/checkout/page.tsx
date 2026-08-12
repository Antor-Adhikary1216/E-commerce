"use client";
import { useEffect, useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { onAuthStateChanged, type User } from "firebase/auth";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { INDIAN_STATES } from "@/constants/indian-states";
import { INDIAN_CITIES } from "@/constants/indian-cities";
import { getFirebaseAuth } from "@/lib/firebase";
import { useCart } from "@/store/cart";
import { currency } from "@/lib/utils";
import { EmptyState } from "@/components/empty-state";
import { useRequireAuth } from "@/lib/use-require-auth";
import { apiClient } from "@/services/api-client";
import toast from "react-hot-toast";

const inputClass =
  "h-11 w-full rounded-full border border-slate-200 bg-[#faf9f5] px-5 text-[13px] text-[#1c2734] placeholder:text-slate-400 focus:border-[#16815d] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16815d]/15";

interface ShippingForm {
  name: string;
  email: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

const emptyForm: ShippingForm = {
  name: "",
  email: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
};

function CheckoutContent() {
  const { items } = useCart();
  const requireAuth = useRequireAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState<ShippingForm>(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    requireAuth();
  }, []);

  // Pre-fill name & email from Firebase auth, phone from profile API
  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) return;
    const unsub = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        setForm((f) => ({
          ...f,
          name: user.displayName ?? f.name,
          email: user.email ?? f.email,
        }));
      }
    });
    apiClient
      .get("/user/profile")
      .then(({ data }) => {
        const u = data.user;
        setForm((f) => ({
          ...f,
          phone: u?.phone ?? f.phone,
        }));
      })
      .catch(() => {});
    return () => unsub();
  }, []);

  const itemSlugs = useMemo(() => {
    const raw = searchParams.get("items");
    return raw ? raw.split(",").filter(Boolean) : [];
  }, [searchParams]);

  const selectedItems = useMemo(
    () => items.filter((i) => itemSlugs.includes(i.product.slug)),
    [items, itemSlugs]
  );

  const subtotal = useMemo(
    () => selectedItems.reduce((sum, i) => sum + i.product.finalPrice * i.quantity, 0),
    [selectedItems]
  );

  const totalItems = useMemo(
    () => selectedItems.reduce((sum, i) => sum + i.quantity, 0),
    [selectedItems]
  );

  function update(field: keyof ShippingForm, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function isValid(): boolean {
    const required: (keyof ShippingForm)[] = ["name", "email", "phone", "line1", "city", "state", "postalCode", "country"];
    return required.every((k) => form[k].trim().length > 0);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid() || selectedItems.length === 0) return;

    setSubmitting(true);
    try {
      const { data } = await apiClient.post("/payments/create-checkout", {
        items: selectedItems.map((i) => ({ slug: i.product.slug, quantity: i.quantity })),
        shippingAddress: {
          name: form.name,
          phone: form.phone,
          line1: form.line1,
          line2: form.line2,
          city: form.city,
          state: form.state,
          postalCode: form.postalCode,
          country: form.country,
        },
      });
      window.location.href = data.url as string;
    } catch {
      toast.error("Could not start checkout. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (items.length === 0 || selectedItems.length === 0) {
    return (
      <EmptyState
        icon={<ShieldCheck size={28} />}
        title="No items selected"
        message="Go back and select items to purchase."
        action={{ href: "/place-order", label: "Select items" }}
      />
    );
  }

  return (
    <main className="mx-auto max-w-[1240px] px-4 py-8">
      <Link
        href="/place-order"
        className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-slate-500 transition hover:text-[#1c2734]"
      >
        <ArrowLeft size={16} />
        Back to item selection
      </Link>

      <h1 className="mt-4 text-2xl font-black text-[#1c2734]">Shipping Details</h1>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Form */}
        <form id="checkout-form" onSubmit={handleSubmit} className="space-y-5">
          {/* Contact */}
          <div className="rounded-2xl bg-white p-6 shadow-[0_1px_4px_rgba(0,0,0,.12)]">
            <h2 className="text-sm font-bold text-[#1c2734]">Contact Information</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Full Name *
                </span>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="John Doe"
                  className={inputClass}
                  required
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Email *
                </span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="john@example.com"
                  className={inputClass}
                  required
                />
              </label>
            </div>
            <label className="mt-4 block">
              <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Phone Number *
              </span>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="+91 98765 43210"
                className={inputClass}
                required
              />
            </label>
          </div>

          {/* Address */}
          <div className="rounded-2xl bg-white p-6 shadow-[0_1px_4px_rgba(0,0,0,.12)]">
            <h2 className="text-sm font-bold text-[#1c2734]">Shipping Address</h2>
            <div className="mt-4 space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Address Line 1 *
                </span>
                <input
                  type="text"
                  value={form.line1}
                  onChange={(e) => update("line1", e.target.value)}
                  placeholder="Street address, house number"
                  className={inputClass}
                  required
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Address Line 2
                </span>
                <input
                  type="text"
                  value={form.line2}
                  onChange={(e) => update("line2", e.target.value)}
                  placeholder="Apartment, suite, floor (optional)"
                  className={inputClass}
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    State *
                  </span>
                  <select
                    value={form.state}
                    onChange={(e) => {
                      update("state", e.target.value);
                      update("city", "");
                    }}
                    className={inputClass + " appearance-none"}
                    required
                  >
                    <option value="">Select state</option>
                    {INDIAN_STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    City *
                  </span>
                  <select
                    value={form.city}
                    onChange={(e) => update("city", e.target.value)}
                    className={inputClass + " appearance-none"}
                    required
                    disabled={!form.state}
                  >
                    <option value="">{form.state ? "Select city" : "Select state first"}</option>
                    {form.state && INDIAN_CITIES[form.state]?.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Postal Code *
                  </span>
                  <input
                    type="text"
                    value={form.postalCode}
                    onChange={(e) => update("postalCode", e.target.value)}
                    placeholder="PIN code"
                    className={inputClass}
                    required
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Country *
                  </span>
                  <input
                    type="text"
                    value={form.country}
                    onChange={(e) => update("country", e.target.value)}
                    placeholder="Country"
                    className={inputClass}
                    required
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Mobile submit button */}
          <button
            type="submit"
            disabled={submitting || !isValid()}
            className="w-full rounded-full bg-[#16815d] px-5 py-3 text-sm font-semibold text-white transition hover:scale-[1.02] disabled:opacity-50 lg:hidden"
          >
            {submitting ? "Redirecting..." : `Proceed to Payment (${totalItems})`}
          </button>
        </form>

        {/* Order Summary sidebar */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl bg-white p-5 shadow-[0_1px_4px_rgba(0,0,0,.12)]">
            <h2 className="text-sm font-bold text-[#1c2734]">Order Summary</h2>

            <ul className="mt-4 space-y-3">
              {selectedItems.map((item) => (
                <li key={item.product.slug} className="flex items-center gap-3 text-[13px]">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="h-12 w-12 shrink-0 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-[#1c2734]">{item.product.name}</p>
                    <p className="text-slate-500">Qty: {item.quantity}</p>
                  </div>
                  <span className="shrink-0 font-semibold text-[#1c2734]">
                    {currency(item.product.finalPrice * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <dl className="mt-4 space-y-3 border-t border-slate-100 pt-4 text-[13px]">
              <div className="flex justify-between">
                <dt className="text-slate-500">Subtotal</dt>
                <dd className="font-medium text-[#1c2734]">{currency(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Delivery</dt>
                <dd className="font-medium text-[#16815d]">Free</dd>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-3 text-sm">
                <dt className="font-bold text-[#1c2734]">Total</dt>
                <dd className="font-black text-[#1c2734]">{currency(subtotal)}</dd>
              </div>
            </dl>

            {/* Desktop submit button */}
            <button
              type="submit"
              form="checkout-form"
              disabled={submitting || !isValid()}
              className="mt-5 hidden w-full rounded-full bg-[#16815d] px-5 py-3 text-sm font-semibold text-white transition hover:scale-[1.02] disabled:opacity-50 lg:block"
            >
              {submitting ? "Redirecting..." : `Proceed to Payment (${totalItems})`}
            </button>

            <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
              <ShieldCheck size={14} />
              Safe &amp; secure payment
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-[1240px] px-4 py-8 text-center text-sm text-slate-400">Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
