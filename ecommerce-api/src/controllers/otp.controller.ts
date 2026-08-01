import type { Request, Response } from "express";
import { sendVerificationCode, verifyEmailCode } from "../services/otp.service.js";

export async function sendOtp(req: Request, res: Response) {
  const email = String(req.body.email || "");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(422).json({ message: "A valid email is required" });
  const result = await sendVerificationCode(email);
  if (result === "rate_limited") return res.status(429).json({ message: "Please wait a minute before requesting a new code" });
  res.json({ message: "Verification code sent" });
}

export async function verifyOtp(req: Request, res: Response) {
  const email = String(req.body.email || "");
  const code = String(req.body.code || "");
  const result = await verifyEmailCode(email, code);
  if (result === "ok") return res.json({ verified: true, message: "Email verified" });
  if (result === "expired") return res.status(400).json({ message: "Code expired. Request a new one" });
  if (result === "locked") return res.status(429).json({ message: "Too many attempts. Request a new code" });
  return res.status(400).json({ message: "Incorrect code" });
}
