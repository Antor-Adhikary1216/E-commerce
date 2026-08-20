import { createHash, randomInt } from "node:crypto";
import { PasswordResetOtpModel } from "../models/password-reset-otp.model.js";
import { sendEmail } from "../config/email.js";

const RESEND_COOLDOWN_MS = 60_000;
const OTP_TTL_MS = 10 * 60_000;
const MAX_ATTEMPTS = 5;

const hash = (value: string) => createHash("sha256").update(value).digest("hex");

export async function sendPasswordResetOtp(email: string): Promise<"sent" | "rate_limited"> {
  const normalized = email.trim().toLowerCase();
  const existing = await PasswordResetOtpModel.findOne({ email: normalized });
  if (existing && existing.updatedAt && Date.now() - existing.updatedAt.getTime() < RESEND_COOLDOWN_MS) {
    return "rate_limited";
  }
  const code = String(randomInt(0, 1_000_000)).padStart(6, "0");
  await PasswordResetOtpModel.findOneAndUpdate(
    { email: normalized },
    { $set: { codeHash: hash(code), expiresAt: new Date(Date.now() + OTP_TTL_MS), attempts: 0 } },
    { upsert: true, new: true }
  );
  try {
    await sendEmail({
      to: normalized,
      subject: "Your Shopping in India.in password reset code",
      html: `<p>Your Shopping in India.in password reset code is:</p><h2>${code}</h2><p>It expires in 10 minutes. If you didn't request this, ignore this email.</p>`,
    });
  } catch (err) {
    console.error(`[password-reset] Failed to send OTP to ${normalized}:`, err);
    throw err;
  }
  return "sent";
}

export async function verifyPasswordResetOtp(
  email: string,
  code: string
): Promise<"ok" | "expired" | "invalid" | "locked"> {
  const normalized = email.trim().toLowerCase();
  const record = await PasswordResetOtpModel.findOne({ email: normalized });
  if (!record) return "invalid";
  if (record.attempts >= MAX_ATTEMPTS) return "locked";
  if (record.expiresAt.getTime() < Date.now()) return "expired";
  if (record.codeHash !== hash(code.trim())) {
    await record.updateOne({ $inc: { attempts: 1 } });
    return "invalid";
  }
  await PasswordResetOtpModel.deleteOne({ email: normalized });
  return "ok";
}
