"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, updateProfile, type Auth } from "firebase/auth";
import axios from "axios";
import { getFirebaseAuth } from "@/lib/firebase";
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

function messageFor(code: string) {
  return errorMessages[code] ?? "Something went wrong. Please try again.";
}

function apiMessage(error: unknown): string | null {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined;
    return data?.message ?? null;
  }
  return null;
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
  const [submitting, setSubmitting] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState("");
  const [verifyingEmail, setVerifyingEmail] = useState("");
  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);

  async function exchange() {
    const auth = getFirebaseAuth();
    const user = auth?.currentUser;
    if (!user) throw new Error("No session");
    const idToken = await user.getIdToken(true);
    await apiClient.post("/auth/exchange", {
      idToken,
      profile: {
        phone: phone || undefined,
        gender: gender || undefined,
        dateOfBirth: dateOfBirth || undefined,
      },
    });
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
        toast.error(apiMessage(error) ?? messageFor((error as { code?: string }).code ?? ""));
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
      toast.error(apiMessage(error) ?? "Could not send the code. Try again.");
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
      toast.error(apiMessage(error) ?? "Invalid code. Try again.");
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
      if (code !== "auth/popup-closed-by-user") toast.error(messageFor(code));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-[1240px] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-[0_1px_4px_rgba(0,0,0,.12)]">
        {otpStep ? (
          <div className="space-y-4">
            <h1 className="text-xl font-bold">Check your email</h1>
            <p className="text-[13px] text-slate-500">
              We sent a 6-digit code to <span className="font-semibold text-slate-700">{verifyingEmail || email}</span>. Enter it below to verify your email.
            </p>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="6-digit code"
              className="h-11 w-full rounded-full border border-slate-200 px-5 text-center text-lg tracking-[0.5em]"
            />
            <button
              type="button"
              onClick={submitOtp}
              disabled={otpVerifying || otp.length !== 6}
              className="w-full rounded-full bg-[#16815d] px-5 py-2.5 text-[13px] font-semibold text-white disabled:opacity-50"
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
          </div>
        ) : (
          <>
        <h1 className="text-xl font-bold">{mode === "signin" ? "Sign in to Vanta" : "Create your account"}</h1>
        <p className="mt-1.5 text-[13px] text-slate-500">
          {mode === "signin" ? "Welcome back. Sign in to see your orders and saved items." : "Join Vanta for faster checkout and saved favourites."}
        </p>

        <button type="button" onClick={google} disabled={submitting} className="mt-6 flex w-full items-center justify-center gap-2.5 rounded-full border border-slate-200 px-5 py-2.5 text-[13px] font-semibold hover:bg-slate-50 disabled:opacity-50">
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
          or
          <span className="h-px flex-1 bg-slate-200" />
        </div>

        <form onSubmit={submit} className="space-y-3">
          {mode === "signup" && (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="h-11 w-full rounded-full border border-slate-200 px-5 text-[13px]"
            />
          )}
          {mode === "signup" && (
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone (optional)"
              className="h-11 w-full rounded-full border border-slate-200 px-5 text-[13px]"
            />
          )}
          {mode === "signup" && (
            <div className="flex gap-3">
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="h-11 w-full rounded-full border border-slate-200 px-5 text-[13px]"
              >
                <option value="">Gender (optional)</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="h-11 w-full rounded-full border border-slate-200 px-5 text-[13px]"
              />
            </div>
          )}
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="h-11 w-full rounded-full border border-slate-200 px-5 text-[13px]"
          />
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="h-11 w-full rounded-full border border-slate-200 px-5 text-[13px]"
          />
          <button type="submit" disabled={submitting} className="w-full rounded-full bg-[#16815d] px-5 py-2.5 text-[13px] font-semibold text-white disabled:opacity-50">
            {submitting ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <p className="mt-5 text-center text-[13px] text-slate-500">
          {mode === "signin" ? "New to Vanta?" : "Already have an account?"}{" "}
          <button type="button" onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="font-semibold text-[#16815d]">
            {mode === "signin" ? "Create an account" : "Sign in"}
          </button>
        </p>
        <p className="mt-3 text-center">
          <Link href="/" className="text-[13px] underline">
            Continue browsing
          </Link>
        </p>
        </>
        )}
      </div>
    </main>
  );
}
