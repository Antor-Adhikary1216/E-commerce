"use client";
import { useEffect, useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { onAuthStateChanged, type User } from "firebase/auth";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ShieldCheck, ShoppingCart, MapPin, Pencil, Check, ChevronDown, CreditCard, Banknote } from "lucide-react";
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

interface SavedAddress {
  _id: string;
  label?: string;
  name?: string;
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  phone?: string;
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
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [editingAddress, setEditingAddress] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "cod">("stripe");

  useEffect(() => {
    requireAuth();
  }, [requireAuth]);

  // Fetch profile with addresses and pre-fill from Firebase auth
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
        const addrs: SavedAddress[] = u?.addresses ?? [];
        setSavedAddresses(addrs);
        if (addrs.length > 0) {
          setSelectedAddressId(addrs[0]._id);
          const addr = addrs[0];
          setForm((f) => ({
            ...f,
            name: addr.name || f.name,
            phone: addr.phone || (u?.phone ?? f.phone),
            line1: addr.line1 || "",
            line2: addr.line2 || "",
            city: addr.city || "",
            state: addr.state || "",
            postalCode: addr.postalCode || "",
            country: addr.country || "India",
          }));
        } else {
          setForm((f) => ({
            ...f,
            phone: u?.phone ?? f.phone,
          }));
        }
      })
      .catch(() => {})
      .finally(() => setLoadingProfile(false));
    return () => unsub();
  }, []);

  function applyAddressToForm(addr: SavedAddress) {
    setForm((prev) => ({
      ...prev,
      name: addr.name || prev.name,
      phone: addr.phone || prev.phone,
      line1: addr.line1 || "",
      line2: addr.line2 || "",
      city: addr.city || "",
      state: addr.state || "",
      postalCode: addr.postalCode || "",
      country: addr.country || "India",
    }));
  }

  function selectAddress(addr: SavedAddress) {
    setSelectedAddressId(addr._id);
    setEditingAddress(false);
    applyAddressToForm(addr);
  }

  function handleEditAddress() {
    setEditingAddress(true);
    setSelectedAddressId(null);
  }

  function handleCancelEdit() {
    if (savedAddresses.length > 0) {
      setSelectedAddressId(savedAddresses[0]._id);
      applyAddressToForm(savedAddresses[0]);
      setEditingAddress(false);
    }
  }

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
      if (paymentMethod === "cod") {
        const { data } = await apiClient.post("/payments/create-cod", {
          items: selectedItems.map((i) => ({ slug: i.product.slug, quantity: i.quantity })),
          shippingAddress: {
            name: form.name,
            phone: form.phone,
            email: form.email,
            line1: form.line1,
            line2: form.line2,
            city: form.city,
            state: form.state,
            postalCode: form.postalCode,
            country: form.country,
          },
        });
        toast.success("Order placed successfully with Cash on Delivery!");
        router.push(`/checkout/success?order_number=${data.orderNumber}`);
      } else {
        const { data } = await apiClient.post("/payments/create-checkout", {
          items: selectedItems.map((i) => ({ slug: i.product.slug, quantity: i.quantity })),
          shippingAddress: {
            name: form.name,
            phone: form.phone,
            email: form.email,
            line1: form.line1,
            line2: form.line2,
            city: form.city,
            state: form.state,
            postalCode: form.postalCode,
            country: form.country,
          },
        });
        window.location.href = data.url;
      }
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? (err.response?.data as { message?: string })?.message ?? "Could not start checkout. Please try again."
        : "Could not start checkout. Please try again.";
      toast.error(msg);
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

  const hasSavedAddresses = savedAddresses.length > 0;
  const showForm = !hasSavedAddresses || editingAddress;

  return (
    <main className="mx-auto max-w-[1240px] px-4 py-8">
      <Link
        href="/cart"
        className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-slate-500 transition hover:text-[#1c2734]"
      >
        <ArrowLeft size={16} />
        Back to Cart
      </Link>

      <h1 className="mt-4 text-2xl font-black text-[#1c2734]">Shipping Details</h1>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Form */}
        <form id="checkout-form" onSubmit={handleSubmit} className="space-y-5">
          {/* Contact Information */}
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

          {/* Shipping Address — Saved Addresses or Form */}
          <div className="rounded-2xl bg-white p-6 shadow-[0_1px_4px_rgba(0,0,0,.12)]">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#1c2734]">Shipping Address</h2>
              {hasSavedAddresses && !editingAddress && (
                <button
                  type="button"
                  onClick={handleEditAddress}
                  className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#16815d] hover:underline"
                >
                  <Pencil size={14} />
                  Edit address
                </button>
              )}
              {editingAddress && savedAddresses.length > 0 && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-slate-500 hover:underline"
                >
                  Use saved address
                </button>
              )}
            </div>

            {/* Saved Addresses List */}
            <AnimatePresence mode="wait">
              {hasSavedAddresses && !editingAddress && (
                <motion.div
                  key="saved-addresses"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mt-4 space-y-3"
                >
                  {savedAddresses.map((addr) => {
                    const isSelected = selectedAddressId === addr._id;
                    return (
                      <button
                        key={addr._id}
                        type="button"
                        onClick={() => selectAddress(addr)}
                        className={`flex w-full items-start gap-3 rounded-xl border-2 p-4 text-left transition-all ${
                          isSelected
                            ? "border-[#16815d] bg-[#f0faf5]"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                            isSelected ? "bg-[#16815d] text-white" : "bg-[#e5ead9] text-[#16815d]"
                          }`}
                        >
                          <MapPin size={16} />
                        </div>
                        <div className="min-w-0 flex-1 text-[13px]">
                          <div className="flex items-center gap-2">
                            {addr.label && (
                              <span className="rounded-full bg-[#e5ead9] px-2 py-0.5 text-[10px] font-semibold uppercase text-[#16815d]">
                                {addr.label}
                              </span>
                            )}
                            {isSelected && (
                              <span className="flex items-center gap-1 text-[10px] font-semibold text-[#16815d]">
                                <Check size={12} />
                                Delivering here
                              </span>
                            )}
                          </div>
                          {addr.name && <p className="mt-1 font-semibold text-[#1c2734]">{addr.name}</p>}
                          <p className="text-slate-500">{[addr.line1, addr.line2].filter(Boolean).join(", ")}</p>
                          <p className="text-slate-500">{[addr.city, addr.state, addr.postalCode].filter(Boolean).join(", ")}</p>
                          {addr.country && <p className="text-slate-500">{addr.country}</p>}
                          {addr.phone && <p className="text-slate-500">{addr.phone}</p>}
                        </div>
                        <div className="shrink-0 pt-1">
                          <span
                            className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors ${
                              isSelected ? "border-[#16815d] bg-[#16815d]" : "border-slate-300"
                            }`}
                          >
                            {isSelected && (
                              <svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="none">
                                <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            )}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Address Form */}
            <AnimatePresence mode="wait">
              {showForm && (
                <motion.div
                  key="address-form"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mt-4 space-y-4"
                >
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
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Payment Method */}
          <div className="rounded-2xl bg-white p-6 shadow-[0_1px_4px_rgba(0,0,0,.12)]">
            <h2 className="text-sm font-bold text-[#1c2734]">Payment Method</h2>
            <div className="mt-4 space-y-3">
              <button
                type="button"
                onClick={() => setPaymentMethod("stripe")}
                className={`flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left transition-all ${
                  paymentMethod === "stripe"
                    ? "border-[#16815d] bg-[#f0faf5]"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                    paymentMethod === "stripe" ? "bg-[#16815d] text-white" : "bg-[#e5ead9] text-[#16815d]"
                  }`}
                >
                  <CreditCard size={16} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-[#1c2734]">Online Payment</p>
                  <p className="text-[12px] text-slate-500">Pay securely with UPI, Cards, or Net Banking</p>
                </div>
                <div className="shrink-0 pt-1">
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors ${
                      paymentMethod === "stripe" ? "border-[#16815d] bg-[#16815d]" : "border-slate-300"
                    }`}
                  >
                    {paymentMethod === "stripe" && (
                      <svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("cod")}
                className={`flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left transition-all ${
                  paymentMethod === "cod"
                    ? "border-[#16815d] bg-[#f0faf5]"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                    paymentMethod === "cod" ? "bg-[#16815d] text-white" : "bg-[#e5ead9] text-[#16815d]"
                  }`}
                >
                  <Banknote size={16} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-[#1c2734]">Cash on Delivery</p>
                  <p className="text-[12px] text-slate-500">Pay when your order arrives</p>
                </div>
                <div className="shrink-0 pt-1">
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors ${
                      paymentMethod === "cod" ? "border-[#16815d] bg-[#16815d]" : "border-slate-300"
                    }`}
                  >
                    {paymentMethod === "cod" && (
                      <svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Mobile submit button */}
          <motion.button
            type="submit"
            disabled={submitting || !isValid()}
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.02, boxShadow: "0 8px 28px rgba(0, 122, 255, 0.35)" }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="flex w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 px-5 py-3.5 text-[15px] font-semibold leading-none text-white shadow-[0_4px_14px_rgba(0,122,255,0.25)] transition-colors hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 lg:hidden"
          >
            {submitting ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <ShoppingCart size={17} className="shrink-0" />
            )}
            <span className="leading-none">
              {paymentMethod === "cod" ? "Place Order" : "Checkout"} ({totalItems})
            </span>
          </motion.button>
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
            <motion.button
              type="submit"
              form="checkout-form"
              disabled={submitting || !isValid()}
              whileTap={{ scale: 0.96 }}
              whileHover={{ scale: 1.02, boxShadow: "0 8px 28px rgba(0, 122, 255, 0.35)" }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="mt-5 hidden w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 px-5 py-3.5 text-[15px] font-semibold leading-none text-white shadow-[0_4px_14px_rgba(0,122,255,0.25)] transition-colors hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 lg:flex"
            >
              {submitting ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <ShoppingCart size={17} className="shrink-0" />
              )}
              <span className="leading-none">
                {paymentMethod === "cod" ? "Place Order" : "Checkout"} ({totalItems})
              </span>
            </motion.button>

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
