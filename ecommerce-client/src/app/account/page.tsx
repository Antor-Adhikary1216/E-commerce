"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { LogOut, Package, UserRound, MapPin, Plus, Pencil, Trash2, Check } from "lucide-react";
import { INDIAN_STATES } from "@/constants/indian-states";
import { INDIAN_CITIES } from "@/constants/indian-cities";
import { getFirebaseAuth } from "@/lib/firebase";
import { apiClient } from "@/services/api-client";
import { EmptyState } from "@/components/empty-state";
import { Skeleton } from "@/components/ui/skeleton";

interface Address {
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

interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  gender?: string;
  dateOfBirth?: string;
  addresses: Address[];
}

const inputClass =
  "h-11 w-full rounded-full border border-slate-200 bg-[#faf9f5] px-5 text-[13px] text-[#1c2734] placeholder:text-slate-400 focus:border-[#16815d] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16815d]/15";

const emptyAddress: Omit<Address, "_id"> = {
  label: "",
  name: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
  phone: "",
};

export default function AccountPage() {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: "", phone: "", gender: "", dateOfBirth: "", avatar: "" });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState("");

  const [editingAddress, setEditingAddress] = useState<string | null>(null);
  const [addingAddress, setAddingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState<Omit<Address, "_id">>(emptyAddress);
  const [savingAddress, setSavingAddress] = useState(false);

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) {
      setLoading(false);
      return;
    }
    return onAuthStateChanged(auth, (next) => {
      setFirebaseUser(next);
      if (next) fetchProfile();
      else setLoading(false);
    });
  }, []);

  async function fetchProfile() {
    try {
      const { data } = await apiClient.get("/user/profile");
      setProfile(data.user);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  async function handleSignOut() {
    const auth = getFirebaseAuth();
    if (!auth) return;
    await signOut(auth);
    try {
      await apiClient.post("/auth/logout");
    } catch {
      // session already cleared client-side
    }
    localStorage.removeItem("vanta.cart");
    localStorage.removeItem("vanta.saved");
    localStorage.removeItem("vanta.access-token");
    window.location.href = "/";
  }

  function startEditProfile() {
    setProfileError("");
    setProfileForm({
      name: profile?.name ?? "",
      phone: profile?.phone ?? "",
      gender: profile?.gender ?? "",
      dateOfBirth: profile?.dateOfBirth ? profile.dateOfBirth.split("T")[0] : "",
      avatar: profile?.avatar ?? "",
    });
    setEditingProfile(true);
  }

  async function saveProfile() {
    setSavingProfile(true);
    setProfileError("");
    try {
      const payload: Record<string, string> = {};
      if (profileForm.name) payload.name = profileForm.name;
      if (profileForm.phone) payload.phone = profileForm.phone;
      if (profileForm.gender) payload.gender = profileForm.gender;
      if (profileForm.dateOfBirth) payload.dateOfBirth = profileForm.dateOfBirth;
      if (profileForm.avatar) payload.avatar = profileForm.avatar;
      await apiClient.put("/user/profile", payload);
      await fetchProfile();
      setEditingProfile(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save profile";
      setProfileError(msg);
    } finally {
      setSavingProfile(false);
    }
  }

  function handleAvatarFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be under 2 MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setProfileForm((f) => ({ ...f, avatar: reader.result as string }));
    reader.readAsDataURL(file);
  }

  function startAddAddress() {
    setAddressForm(emptyAddress);
    setAddingAddress(true);
    setEditingAddress(null);
  }

  function startEditAddress(addr: Address) {
    setAddressForm({
      label: addr.label ?? "",
      name: addr.name ?? "",
      line1: addr.line1 ?? "",
      line2: addr.line2 ?? "",
      city: addr.city ?? "",
      state: addr.state ?? "",
      postalCode: addr.postalCode ?? "",
      country: addr.country ?? "",
      phone: addr.phone ?? "",
    });
    setEditingAddress(addr._id);
    setAddingAddress(false);
  }

  async function saveAddress() {
    setSavingAddress(true);
    try {
      if (editingAddress) {
        await apiClient.put(`/user/addresses/${editingAddress}`, addressForm);
      } else {
        await apiClient.post("/user/addresses", addressForm);
      }
      await fetchProfile();
      setEditingAddress(null);
      setAddingAddress(false);
    } catch {
      // ignore
    } finally {
      setSavingAddress(false);
    }
  }

  async function deleteAddress(id: string) {
    try {
      await apiClient.delete(`/user/addresses/${id}`);
      await fetchProfile();
    } catch {
      // ignore
    }
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-[1240px] px-4 py-10">
        <div className="mx-auto w-full max-w-2xl space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-[0_1px_4px_rgba(0,0,0,.12)] sm:p-8">
            <Skeleton className="h-5 w-24" />
            <div className="mt-5 flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-56" />
              </div>
            </div>
            <div className="mt-5 space-y-3 border-t border-slate-100 pt-5">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-[0_1px_4px_rgba(0,0,0,.12)] sm:p-8">
            <Skeleton className="h-5 w-28" />
            <div className="mt-5 space-y-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex items-start gap-3 rounded-xl border border-slate-200 p-4">
                  <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!firebaseUser) {
    return (
      <EmptyState
        icon={<UserRound size={28} />}
        title="You're not signed in"
        message="Sign in to manage your orders, address book and personal details."
        action={{ href: "/login", label: "Sign in" }}
      />
    );
  }

  return (
    <main className="mx-auto max-w-[1240px] px-4 py-10">
      <div className="mx-auto w-full max-w-2xl space-y-6">
        {/* Profile Card */}
        <div className="rounded-2xl bg-white p-6 shadow-[0_1px_4px_rgba(0,0,0,.12)] sm:p-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Profile</h2>
            {!editingProfile && (
              <button onClick={startEditProfile} className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#16815d] hover:underline">
                <Pencil size={14} /> Edit
              </button>
            )}
          </div>

          {editingProfile ? (
            <div className="mt-5 space-y-4">
              <div className="flex items-center gap-4">
                {profileForm.avatar ? (
                  <img src={profileForm.avatar} alt="" className="h-16 w-16 rounded-full object-cover" />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#e5ead9] text-[#16815d]">
                    <UserRound size={28} />
                  </div>
                )}
                <div className="flex-1">
                  <label className="block">
                    <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">Profile photo</span>
                    <input type="file" accept="image/*" onChange={handleAvatarFile} className="block w-full text-[13px] text-slate-500 file:mr-3 file:rounded-full file:border-0 file:bg-[#e5ead9] file:px-4 file:py-2 file:text-[12px] file:font-semibold file:text-[#16815d] hover:file:bg-[#d8e4cd]" />
                    {profileForm.avatar && (
                      <button type="button" onClick={() => setProfileForm((f) => ({ ...f, avatar: "" }))} className="mt-1.5 text-[11px] text-red-500 hover:underline">Remove photo</button>
                    )}
                  </label>
                </div>
              </div>
              <label className="block">
                <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">Full name</span>
                <input type="text" value={profileForm.name} onChange={(e) => setProfileForm((f) => ({ ...f, name: e.target.value }))} placeholder="Your name" className={inputClass} />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">Phone</span>
                <input type="tel" value={profileForm.phone} onChange={(e) => setProfileForm((f) => ({ ...f, phone: e.target.value }))} placeholder="+91 98765 43210" className={inputClass} />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">Gender</span>
                  <select value={profileForm.gender} onChange={(e) => setProfileForm((f) => ({ ...f, gender: e.target.value }))} className={inputClass + " appearance-none"}>
                    <option value="">Optional</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">Birthday</span>
                  <input type="date" value={profileForm.dateOfBirth} onChange={(e) => setProfileForm((f) => ({ ...f, dateOfBirth: e.target.value }))} className={inputClass + " text-slate-500"} />
                </label>
              </div>
              {profileError && <p className="text-[12px] text-red-500">{profileError}</p>}
              <div className="flex items-center gap-3">
                <button onClick={saveProfile} disabled={savingProfile} className="inline-flex items-center gap-1.5 rounded-full bg-[#16815d] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#147a56] disabled:opacity-50">
                  <Check size={14} /> {savingProfile ? "Saving..." : "Save changes"}
                </button>
                <button onClick={() => setEditingProfile(false)} className="rounded-full border border-slate-200 px-5 py-2.5 text-xs font-semibold hover:bg-slate-50">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-5 space-y-3 text-[13px]">
              <div className="flex items-center gap-3">
                {profile?.avatar || firebaseUser.photoURL ? (
                  <img src={profile?.avatar || firebaseUser.photoURL || ""} alt="" className="h-14 w-14 rounded-full object-cover" />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e5ead9] text-[#16815d]">
                    <UserRound size={24} />
                  </div>
                )}
                <div>
                  <p className="font-bold">{profile?.name ?? firebaseUser.displayName ?? "Customer"}</p>
                  <p className="text-slate-500">{firebaseUser.email}</p>
                </div>
              </div>
              <dl className="mt-4 space-y-2 border-t border-slate-100 pt-4">
                <div className="flex justify-between">
                  <dt className="text-slate-500">Phone</dt>
                  <dd className="font-medium">{profile?.phone || "---"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Gender</dt>
                  <dd className="font-medium capitalize">{profile?.gender || "---"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Birthday</dt>
                  <dd className="font-medium">{profile?.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "---"}</dd>
                </div>
              </dl>
            </div>
          )}
        </div>

        {/* Addresses Card */}
        <div className="rounded-2xl bg-white p-6 shadow-[0_1px_4px_rgba(0,0,0,.12)] sm:p-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Addresses</h2>
            {!addingAddress && !editingAddress && (
              <button onClick={startAddAddress} className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#16815d] hover:underline">
                <Plus size={14} /> Add new
              </button>
            )}
          </div>

          {/* Add / Edit Form */}
          {(addingAddress || editingAddress) && (
            <div className="mt-5 space-y-4 rounded-xl border border-slate-200 p-4">
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">Label</span>
                  <select value={addressForm.label} onChange={(e) => setAddressForm((f) => ({ ...f, label: e.target.value }))} className={inputClass + " appearance-none"}>
                    <option value="">Optional</option>
                    <option value="home">Home</option>
                    <option value="work">Work</option>
                    <option value="other">Other</option>
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">Full name</span>
                  <input type="text" value={addressForm.name} onChange={(e) => setAddressForm((f) => ({ ...f, name: e.target.value }))} placeholder="Recipient name" className={inputClass} />
                </label>
              </div>
              <label className="block">
                <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">Address line 1</span>
                <input type="text" value={addressForm.line1} onChange={(e) => setAddressForm((f) => ({ ...f, line1: e.target.value }))} placeholder="Street address" className={inputClass} />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">Address line 2</span>
                <input type="text" value={addressForm.line2} onChange={(e) => setAddressForm((f) => ({ ...f, line2: e.target.value }))} placeholder="Apartment, suite, etc. (optional)" className={inputClass} />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">State</span>
                  <select value={addressForm.state} onChange={(e) => setAddressForm((f) => ({ ...f, state: e.target.value, city: "" }))} className={inputClass + " appearance-none"}>
                    <option value="">Select state</option>
                    {INDIAN_STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">City</span>
                  <select value={addressForm.city} onChange={(e) => setAddressForm((f) => ({ ...f, city: e.target.value }))} className={inputClass + " appearance-none"} disabled={!addressForm.state}>
                    <option value="">{addressForm.state ? "Select city" : "Select state first"}</option>
                    {addressForm.state && INDIAN_CITIES[addressForm.state]?.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">Postal code</span>
                  <input type="text" value={addressForm.postalCode} onChange={(e) => setAddressForm((f) => ({ ...f, postalCode: e.target.value }))} placeholder="PIN code" className={inputClass} />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">Country</span>
                  <input type="text" value={addressForm.country} onChange={(e) => setAddressForm((f) => ({ ...f, country: e.target.value }))} placeholder="Country" className={inputClass} />
                </label>
              </div>
              <label className="block">
                <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">Phone</span>
                <input type="tel" value={addressForm.phone} onChange={(e) => setAddressForm((f) => ({ ...f, phone: e.target.value }))} placeholder="Contact number" className={inputClass} />
              </label>
              <div className="flex items-center gap-3">
                <button onClick={saveAddress} disabled={savingAddress} className="inline-flex items-center gap-1.5 rounded-full bg-[#16815d] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#147a56] disabled:opacity-50">
                  <Check size={14} /> {savingAddress ? "Saving..." : editingAddress ? "Update address" : "Add address"}
                </button>
                <button onClick={() => { setEditingAddress(null); setAddingAddress(false); }} className="rounded-full border border-slate-200 px-5 py-2.5 text-xs font-semibold hover:bg-slate-50">
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Address List */}
          <div className="mt-5 space-y-3">
            {profile?.addresses.length === 0 && !addingAddress && (
              <p className="text-[13px] text-slate-400">No addresses saved yet.</p>
            )}
            {profile?.addresses.map((addr) => (
              <div key={addr._id} className="flex items-start gap-3 rounded-xl border border-slate-200 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e5ead9] text-[#16815d]">
                  <MapPin size={16} />
                </div>
                <div className="min-w-0 flex-1 text-[13px]">
                  {addr.label && <span className="mr-2 rounded-full bg-[#e5ead9] px-2 py-0.5 text-[10px] font-semibold uppercase text-[#16815d]">{addr.label}</span>}
                  {addr.name && <p className="font-semibold">{addr.name}</p>}
                  <p className="text-slate-500">{[addr.line1, addr.line2].filter(Boolean).join(", ")}</p>
                  <p className="text-slate-500">{[addr.city, addr.state, addr.postalCode].filter(Boolean).join(", ")}</p>
                  {addr.country && <p className="text-slate-500">{addr.country}</p>}
                  {addr.phone && <p className="text-slate-500">{addr.phone}</p>}
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => startEditAddress(addr)} className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-[#16815d]">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => deleteAddress(addr._id)} className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-red-500">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
