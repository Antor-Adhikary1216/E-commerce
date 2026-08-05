import { Router } from "express";
import { z } from "zod";
import { requireAuth, type AuthRequest } from "../middleware/auth.js";
import {
  getProfile,
  updateProfile,
  addAddress,
  updateAddress,
  deleteAddress,
} from "../controllers/user.controller.js";

const router = Router();

const addressSchema = z.object({
  label: z.string().optional(),
  name: z.string().optional(),
  line1: z.string().optional(),
  line2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
  phone: z.string().optional(),
});

router.get("/profile", requireAuth, getProfile);

router.put(
  "/profile",
  requireAuth,
  (req, res, next) => {
    try {
      z.object({
        name: z.string().min(1).optional(),
        phone: z.string().optional(),
        gender: z.enum(["male", "female", "other"]).optional(),
        dateOfBirth: z.string().optional(),
        avatar: z.string().optional().or(z.literal("")),
      }).parse(req.body);
      next();
    } catch (e) {
      next(e);
    }
  },
  updateProfile
);

router.post(
  "/addresses",
  requireAuth,
  (req, res, next) => {
    try {
      addressSchema.parse(req.body);
      next();
    } catch (e) {
      next(e);
    }
  },
  addAddress
);

router.put(
  "/addresses/:id",
  requireAuth,
  (req, res, next) => {
    try {
      addressSchema.parse(req.body);
      next();
    } catch (e) {
      next(e);
    }
  },
  updateAddress
);

router.delete("/addresses/:id", requireAuth, deleteAddress);

export default router;
