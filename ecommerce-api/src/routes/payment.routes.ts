import { Router } from "express";
import { createStripeCheckout } from "../controllers/payment.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.post("/create-checkout", requireAuth, createStripeCheckout);

export default router;
