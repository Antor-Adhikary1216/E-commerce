import { Router } from "express";
import { z } from "zod";
import { exchangeFirebaseToken, logout, refreshAccessToken } from "../controllers/auth.controller.js";
import { sendOtp, verifyOtp } from "../controllers/otp.controller.js";
import { sendResetOtp, verifyResetOtp } from "../controllers/password-reset.controller.js";

const router = Router();

router.post("/exchange", (req, res, next) => {
  try {
    z.object({
      idToken: z.string().min(1),
      profile: z.object({
        phone: z.string().optional(),
        gender: z.enum(["male", "female", "other"]).optional(),
        dateOfBirth: z.string().optional(),
      }).optional(),
    }).parse(req.body);
    next();
  } catch (e) { next(e); }
}, exchangeFirebaseToken);

router.post("/refresh", refreshAccessToken);
router.post("/logout", logout);

router.post("/send-otp", (req, res, next) => {
  try {
    z.object({ email: z.string().email() }).parse(req.body);
    next();
  } catch (e) { next(e); }
}, sendOtp);

router.post("/verify-otp", (req, res, next) => {
  try {
    z.object({ email: z.string().email(), code: z.string().regex(/^\d{6}$/) }).parse(req.body);
    next();
  } catch (e) { next(e); }
}, verifyOtp);

router.post("/send-reset-otp", (req, res, next) => {
  try {
    z.object({ email: z.string().email() }).parse(req.body);
    next();
  } catch (e) { next(e); }
}, sendResetOtp);

router.post("/verify-reset-otp", (req, res, next) => {
  try {
    z.object({
      email: z.string().email(),
      code: z.string().regex(/^\d{6}$/),
      newPassword: z.string().min(6),
    }).parse(req.body);
    next();
  } catch (e) { next(e); }
}, verifyResetOtp);

export default router;
