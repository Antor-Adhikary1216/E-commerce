import { Router } from "express";
import { createStripeCheckout, createCODOrder } from "../controllers/payment.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.post("/create-checkout", requireAuth, createStripeCheckout);
router.post("/create-cod", requireAuth, createCODOrder);

export default router;
