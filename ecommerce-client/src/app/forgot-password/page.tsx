"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import axios from "axios";

const inputClass =
  "h-11 w-full rounded-full border border-slate-200 bg-[#faf9f5] px-5 text-[13px] text-[#1c2734] placeholder:text-slate-400 focus:border-[#16815d] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16815d]/15";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "";
const RESEND_SECONDS = 60;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "otp" | "password" | "done">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = useCallback(() => {
    setResendCooldown(RESEND_SECONDS);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    try {
      const { data } = await axios.post(`${BASE}/auth/send-reset-otp`, { email });
      toast.success(data.message || "Code sent to your email.");
      setStep("otp");
      startTimer();
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? (err.response?.data as { message?: string })?.message ?? "Could not send code."
        : "Could not send code.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    if (otp.length !== 6) return;
    setStep("password");
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    setSubmitting(true);
    try {
      await axios.post(`${BASE}/auth/verify-reset-otp`, {
        email,
        code: otp,
        newPassword: password,
      });
      toast.success("Password updated successfully!");
      setStep("done");
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? (err.response?.data as { message?: string })?.message ?? "Something went wrong."
        : "Something went wrong.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-[calc(100vh-7rem)] items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 inline-flex items-center gap-1.5 text-[15px] font-black tracking-tight text-[#1c2734] md:hidden">
          SHOPPING IN INDIA.in
        </Link>

        <div className="rounded-3xl bg-white p-6 shadow-[0_1px_4px_rgba(0,0,0,.12)] sm:p-8">
          <Link
            href="/login"
            className="mb-6 inline-flex items-center gap-1.5 text-[13px] font-semibold text-slate-500 hover:text-[#1c2734]"
          >
            <ArrowLeft size={16} />
            Back to sign in
          </Link>

          {/* Step 1: Enter Email */}
          {step === "email" && (
            <div className="space-y-5">
              <div>
                <h1 className="text-xl font-black">Forgot your password?</h1>
                <p className="mt-1.5 text-[13px] leading-6 text-slate-500">
                  Enter your email and we&apos;ll send you a 6-digit code to reset your password.
                </p>
              </div>
              <form onSubmit={handleSendOtp} className="space-y-4">
                <label className="block">
                  <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Email address
                  </span>
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={inputClass}
                  />
                </label>
                <button
                  type="submit"
                  disabled={submitting || !email.trim()}
                  className="h-11 w-full rounded-full bg-[#16815d] px-5 text-[13px] font-semibold text-white transition hover:bg-[#147a56] active:scale-[.99] disabled:opacity-50"
                >
                  {submitting ? "Sending..." : "Send code"}
                </button>
              </form>
            </div>
          )}

          {/* Step 2: Enter OTP */}
          {step === "otp" && (
            <div className="space-y-5">
              <div>
                <h1 className="text-xl font-black">Check your email</h1>
                <p className="mt-1.5 text-[13px] leading-6 text-slate-500">
                  Enter the 6-digit code sent to{" "}
                  <span className="font-semibold text-slate-700">{email}</span>.
                </p>
              </div>
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <label className="block">
                  <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Verification code
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    autoFocus
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="6-digit code"
                    className={inputClass + " text-center text-lg tracking-[0.5em]"}
                  />
                </label>
                <button
                  type="submit"
                  disabled={submitting || otp.length !== 6}
                  className="h-11 w-full rounded-full bg-[#16815d] px-5 text-[13px] font-semibold text-white transition hover:bg-[#147a56] disabled:opacity-50"
                >
                  {submitting ? "Verifying..." : "Continue"}
                </button>
                <div className="flex items-center justify-between text-[13px]">
                  {resendCooldown > 0 ? (
                    <span className="font-medium text-slate-400">
                      Resend code in {resendCooldown}s
                    </span>
                  ) : (
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={async () => {
                        try {
                          const { data } = await axios.post(`${BASE}/auth/send-reset-otp`, { email });
                          toast.success(data.message || "Code resent.");
                          startTimer();
                        } catch {
                          toast.error("Could not resend code.");
                        }
                      }}
                      className="font-semibold text-[#16815d] hover:underline disabled:opacity-50"
                    >
                      Resend code
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => { setStep("email"); setOtp(""); if (timerRef.current) clearInterval(timerRef.current); setResendCooldown(0); }}
                    className="text-slate-500"
                  >
                    Change email
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Step 3: New Password */}
          {step === "password" && (
            <div className="space-y-5">
              <div>
                <h1 className="text-xl font-black">Set new password</h1>
                <p className="mt-1.5 text-[13px] leading-6 text-slate-500">
                  Create a new password for <span className="font-semibold text-slate-700">{email}</span>.
                </p>
              </div>
              <form onSubmit={handleResetPassword} className="space-y-4">
                <label className="block">
                  <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    New password
                  </span>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={6}
                      autoFocus
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
                    >
                      {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                  </div>
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Confirm password
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    className={inputClass}
                  />
                </label>
                <button
                  type="submit"
                  disabled={submitting || !password || !confirmPassword}
                  className="h-11 w-full rounded-full bg-[#16815d] px-5 text-[13px] font-semibold text-white transition hover:bg-[#147a56] active:scale-[.99] disabled:opacity-50"
                >
                  {submitting ? "Updating..." : "Update password"}
                </button>
              </form>
            </div>
          )}

          {/* Step 4: Done */}
          {step === "done" && (
            <div className="space-y-5 text-center">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#16815d]/10 text-[#16815d]">
                <CheckCircle2 size={32} />
              </span>
              <h1 className="text-xl font-black">Password updated</h1>
              <p className="text-[13px] leading-6 text-slate-500">
                Your password has been successfully reset. You can now sign in with your new password.
              </p>
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="mt-4 inline-block h-11 rounded-full bg-[#16815d] px-8 text-[13px] font-semibold text-white transition hover:bg-[#147a56]"
              >
                Sign in
              </button>
            </div>
          )}
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
