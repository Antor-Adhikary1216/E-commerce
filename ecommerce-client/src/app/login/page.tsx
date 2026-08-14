"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, updateProfile, type Auth } from "firebase/auth";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import axios from "axios";
import { getFirebaseAuth } from "@/lib/firebase";
import { setAccessToken } from "@/lib/token";
import { useAuthUser } from "@/lib/use-auth-user";
import { apiClient } from "@/services/api-client";

const errorMessages: Record<string, string> = {
  "auth/invalid-credential": "Incorrect email or password.",
  "auth/user-not-found": "No account found with that email.",
  "auth/wrong-password": "Incorrect password.",
  "auth/email-already-in-use": "An account already exists for that email.",
  "auth/weak-password": "Password should be at least 6 characters.",
  "auth/popup-closed-by-user": "Sign-in was cancelled.",
  "auth/network-request-failed": "Network error. Check your connection.",
  "auth/invalid-api-key": "Firebase isn't configured. Add the Firebase keys to ecommerce-client/.env.local.",
};

const inputClass =
  "h-11 w-full rounded-full border border-slate-200 bg-[#faf9f5] px-5 text-[13px] text-[#1c2734] placeholder:text-slate-400 focus:border-[#16815d] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16815d]/15";

function messageFor(code: string) {
  return errorMessages[code] ?? "Something went wrong. Please try again.";
}

function formatError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined;
    if (data?.message) return data.message;
    if (!error.response) return "Could not reach the server. Check your connection and try again.";
  }
  const code = (error as { code?: string }).code ?? "";
  if (code) return messageFor(code);
  if (error instanceof Error && error.message) return error.message;
  return "Something went wrong. Please try again.";
}

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState("");
  const [verifyingEmail, setVerifyingEmail] = useState("");
  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);

  const user = useAuthUser();

  useEffect(() => {
    if (user) {
      const target = new URLSearchParams(window.location.search).get("redirect");
      const safeTarget = target && target.startsWith("/") && !target.startsWith("//") ? target : "/account";
      router.replace(safeTarget);
    }
  }, [user, router]);

  async function exchange() {
    const auth = getFirebaseAuth();
    const user = auth?.currentUser;
    if (!user) throw new Error("No session");
    const idToken = await user.getIdToken(true);
    const { data } = await apiClient.post("/auth/exchange", {
      idToken,
      profile: {
        phone: phone || undefined,
        gender: gender || undefined,
        dateOfBirth: dateOfBirth || undefined,
      },
    });
    setAccessToken(data.accessToken as string);
  }

  function finish() {
    toast.success(mode === "signin" ? "Welcome back." : "Account created.");
    const target = new URLSearchParams(window.location.search).get("redirect");
    const safeTarget = target && target.startsWith("/") && !target.startsWith("//") ? target : "/account";
    router.replace(safeTarget);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const auth: Auth | null = getFirebaseAuth();
    if (!auth) {
      toast.error("Firebase isn't configured. Add the Firebase keys to ecommerce-client/.env.local.");
      return;
    }
    setSubmitting(true);
    try {
      if (mode === "signin") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        if (name.trim()) await updateProfile(credential.user, { displayName: name.trim() });
      }
      await exchange();
      finish();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 403 && (error.response.data as { code?: string })?.code === "EMAIL_NOT_VERIFIED") {
        await startVerification();
      } else {
        toast.error(formatError(error));
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function startVerification() {
    const auth = getFirebaseAuth();
    const user = auth?.currentUser;
    if (!user) return;
    setVerifyingEmail(user.email ?? email);
    setOtpStep(true);
    await sendCode();
  }

  async function sendCode() {
    setOtpSending(true);
    try {
      await apiClient.post("/auth/send-otp", { email: verifyingEmail || email });
      toast.success("Verification code sent to your email.");
    } catch (error) {
      toast.error(formatError(error) || "Could not send the code. Try again.");
    } finally {
      setOtpSending(false);
    }
  }

  async function submitOtp() {
    setOtpVerifying(true);
    try {
      await apiClient.post("/auth/verify-otp", { email: verifyingEmail || email, code: otp });
      await exchange();
      finish();
    } catch (error) {
      toast.error(formatError(error) || "Invalid code. Try again.");
    } finally {
      setOtpVerifying(false);
    }
  }

  async function google() {
    const auth = getFirebaseAuth();
    if (!auth) {
      toast.error("Firebase isn't configured. Add the Firebase keys to ecommerce-client/.env.local.");
      return;
    }
    setSubmitting(true);
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      await exchange();
      finish();
    } catch (error) {
      const code = (error as { code?: string }).code ?? "";
      if (code === "auth/popup-closed-by-user") return;
      if (axios.isAxiosError(error) && error.response?.status === 403 && (error.response.data as { code?: string })?.code === "EMAIL_NOT_VERIFIED") {
        await startVerification();
      } else {
        toast.error(formatError(error));
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-[calc(100vh-7rem)] items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
          <Link href="/" className="mb-8 inline-flex items-center gap-1.5 text-[15px] font-black tracking-tight text-[#1c2734] md:hidden">
            VANTA<span className="text-[#16815d]">/</span>
          </Link>

          <div className="rounded-3xl bg-white p-6 shadow-[0_1px_4px_rgba(0,0,0,.12)] sm:p-8">
            <AnimatePresence mode="wait">
              {otpStep ? (
                <motion.div key="otp" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }} className="space-y-5">
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => setOtpStep(false)} aria-label="Back" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f1eee6] text-[#1c2734] hover:bg-[#e8e4da]">
                      <ArrowLeft size={16} />
                    </button>
                    <div>
                      <h1 className="text-lg font-bold leading-tight">Check your email</h1>
                      <p className="text-[12px] text-slate-400">Enter the code to verify your email</p>
                    </div>
                  </div>
                  <p className="text-[13px] leading-6 text-slate-500">
                    We sent a 6-digit code to <span className="font-semibold text-slate-700">{verifyingEmail || email}</span>.
                  </p>
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="6-digit code"
                    className={inputClass + " text-center text-lg tracking-[0.5em]"}
                  />
                  <button
                    type="button"
                    onClick={submitOtp}
                    disabled={otpVerifying || otp.length !== 6}
                    className="h-11 w-full rounded-full bg-[#16815d] px-5 text-[13px] font-semibold text-white transition hover:bg-[#147a56] disabled:opacity-50"
                  >
                    {otpVerifying ? "Verifying…" : "Verify email"}
                  </button>
                  <div className="flex items-center justify-between text-[13px]">
                    <button type="button" onClick={sendCode} disabled={otpSending} className="font-semibold text-[#16815d] disabled:opacity-50">
                      {otpSending ? "Sending…" : "Resend code"}
                    </button>
                    <button type="button" onClick={() => setOtpStep(false)} className="text-slate-500">
                      Cancel
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div key={mode} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}>
                  <header>
                    <h1 className="text-xl font-black">{mode === "signin" ? "Welcome back" : "Create your account"}</h1>
                    <p className="mt-1.5 text-[13px] leading-6 text-slate-500">
                      {mode === "signin" ? "Sign in to see your orders, saved items and more." : "Join Vanta for faster checkout and saved favourites."}
                    </p>
                  </header>

                  <div className="mt-6 grid grid-cols-2 gap-1 rounded-full bg-[#f1eee6] p-1">
                    <button
                      type="button"
                      onClick={() => setMode("signin")}
                      className={`rounded-full py-2 text-[13px] font-semibold transition ${mode === "signin" ? "bg-white text-[#1c2734] shadow-sm" : "text-slate-500 hover:text-[#1c2734]"}`}
                    >
                      Sign in
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode("signup")}
                      className={`rounded-full py-2 text-[13px] font-semibold transition ${mode === "signup" ? "bg-white text-[#1c2734] shadow-sm" : "text-slate-500 hover:text-[#1c2734]"}`}
                    >
                      Create account
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={google}
                    disabled={submitting}
                    className="mt-5 flex h-11 w-full items-center justify-center gap-2.5 rounded-full border border-slate-200 px-5 text-[13px] font-semibold transition hover:bg-slate-50 disabled:opacity-50"
                  >
                    <svg viewBox="0 0 48 48" className="h-4 w-4" aria-hidden="true">
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                    </svg>
                    Continue with Google
                  </button>

                  <div className="my-5 flex items-center gap-3 text-[11px] uppercase tracking-wide text-slate-400">
                    <span className="h-px flex-1 bg-slate-200" />
                    or continue with email
                    <span className="h-px flex-1 bg-slate-200" />
                  </div>

                  <form onSubmit={submit} className="space-y-3.5">
                    {mode === "signup" && (
                      <label className="block">
                        <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">Full name</span>
                        <input type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className={inputClass} />
                      </label>
                    )}
                    {mode === "signup" && (
                      <label className="block">
                        <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">Phone (optional)</span>
                        <input type="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" className={inputClass} />
                      </label>
                    )}
                    {mode === "signup" && (
                      <div className="grid grid-cols-2 gap-3">
                        <label className="block">
                          <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">Gender</span>
                          <select value={gender} onChange={(e) => setGender(e.target.value)} className={inputClass + " appearance-none"}>
                            <option value="">Optional</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        </label>
                        <label className="block">
                          <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">Birthday</span>
                          <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} className={inputClass + " text-slate-500"} />
                        </label>
                      </div>
                    )}
                    <label className="block">
                      <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">Email address</span>
                      <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={inputClass} />
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">Password</span>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          minLength={6}
                          autoComplete={mode === "signin" ? "current-password" : "new-password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="At least 6 characters"
                          className={inputClass + " pr-11"}
                        />
                        <button
                          type="button"
                          tabIndex={-1}
                          onClick={() => setShowPassword((s) => !s)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                        </button>
                      </div>
                    </label>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="h-11 w-full rounded-full bg-[#16815d] px-5 text-[13px] font-semibold text-white transition hover:bg-[#147a56] active:scale-[.99] disabled:opacity-50"
                    >
                      {submitting ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <p className="mt-5 text-center">
            <Link href="/" className="text-[13px] font-medium text-slate-500 underline-offset-4 hover:text-[#16815d] hover:underline">
              Continue browsing
            </Link>
          </p>
        </div>
    </main>
  );
}
