import { createHash, randomInt } from "node:crypto";
import { EmailOtpModel } from "../models/email-otp.model.js";
import { EmailVerificationModel } from "../models/email-verification.model.js";
import { sendEmail } from "../config/email.js";

const RESEND_COOLDOWN_MS = 60_000;
const OTP_TTL_MS = 10 * 60_000;
const MAX_ATTEMPTS = 5;

const hash = (value: string) => createHash("sha256").update(value).digest("hex");

export async function sendVerificationCode(email: string): Promise<"sent" | "rate_limited"> {
  const normalized = email.trim().toLowerCase();
  const existing = await EmailOtpModel.findOne({ email: normalized });
  if (existing && existing.updatedAt && Date.now() - existing.updatedAt.getTime() < RESEND_COOLDOWN_MS) {
    return "rate_limited";
  }
  const code = String(randomInt(0, 1_000_000)).padStart(6, "0");
  await EmailOtpModel.findOneAndUpdate(
    { email: normalized },
    { $set: { codeHash: hash(code), expiresAt: new Date(Date.now() + OTP_TTL_MS), attempts: 0 } },
    { upsert: true, new: true }
  );
  await sendEmail({
    to: normalized,
    subject: "Your Vanta verification code",
    html: `<p>Your Vanta verification code is:</p><h2>${code}</h2><p>It expires in 10 minutes.</p>`,
  });
  return "sent";
}

export async function verifyEmailCode(email: string, code: string): Promise<"ok" | "expired" | "invalid" | "locked"> {
  const normalized = email.trim().toLowerCase();
  const record = await EmailOtpModel.findOne({ email: normalized });
  if (!record) return "invalid";
  if (record.attempts >= MAX_ATTEMPTS) return "locked";
  if (record.expiresAt.getTime() < Date.now()) return "expired";
  if (record.codeHash !== hash(code.trim())) {
    await record.updateOne({ $inc: { attempts: 1 } });
    return "invalid";
  }
  await EmailVerificationModel.findOneAndUpdate(
    { email: normalized },
    { $set: { verifiedAt: new Date() } },
    { upsert: true, new: true }
  );
  await EmailOtpModel.deleteOne({ email: normalized });
  return "ok";
}

export async function isEmailVerified(email: string): Promise<boolean> {
  return (await EmailVerificationModel.exists({ email: email.trim().toLowerCase() })) !== null;
}
