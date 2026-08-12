import { Router } from "express";
import { listOrders, getOrder, getOrderBySession, getOrderShippingDetail } from "../controllers/order.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, listOrders);
router.get("/session/:sessionId", requireAuth, getOrderBySession);
router.get("/:id/shipping-detail", requireAuth, getOrderShippingDetail);
router.get("/:id", requireAuth, getOrder);

export default router;
