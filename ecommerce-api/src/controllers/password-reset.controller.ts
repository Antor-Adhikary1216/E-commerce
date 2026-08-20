import type { Request, Response } from "express";
import { getAuth } from "firebase-admin/auth";
import { UserModel } from "../models/user.model.js";
import { sendPasswordResetOtp, verifyPasswordResetOtp } from "../services/password-reset.service.js";

export async function sendResetOtp(req: Request, res: Response) {
  const email = String(req.body.email || "");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(422).json({ message: "A valid email is required" });
  }

  const user = await UserModel.findOne({ email: email.trim().toLowerCase() }).lean();
  if (!user) {
    return res.json({ message: "If an account exists with that email, a code has been sent." });
  }

  const result = await sendPasswordResetOtp(email);
  if (result === "rate_limited") {
    return res.status(429).json({ message: "Please wait a minute before requesting a new code" });
  }
  res.json({ message: "If an account exists with that email, a code has been sent." });
}

export async function verifyResetOtp(req: Request, res: Response) {
  const email = String(req.body.email || "");
  const code = String(req.body.code || "");
  const newPassword = String(req.body.newPassword || "");

  if (!newPassword || newPassword.length < 6) {
    return res.status(422).json({ message: "Password must be at least 6 characters" });
  }

  const result = await verifyPasswordResetOtp(email, code);
  if (result === "expired") return res.status(400).json({ message: "Code expired. Request a new one" });
  if (result === "locked") return res.status(429).json({ message: "Too many attempts. Request a new code" });
  if (result !== "ok") return res.status(400).json({ message: "Incorrect code" });

  const normalizedEmail = email.trim().toLowerCase();
  const user = await UserModel.findOne({ email: normalizedEmail }).lean();
  if (!user || !user.firebaseUid) {
    return res.status(400).json({ message: "Account not found" });
  }

  try {
    await getAuth().updateUser(user.firebaseUid, { password: newPassword });
  } catch {
    return res.status(500).json({ message: "Failed to update password. Please try again." });
  }

  return res.json({ message: "Password updated successfully" });
}
