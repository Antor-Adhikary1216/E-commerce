import { Router } from "express";
import { listOrders, getOrder, getOrderBySession, getOrderShippingDetail, deleteOrder, trackOrder, cancelOrder } from "../controllers/order.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, listOrders);
router.get("/track/:orderNumber", requireAuth, trackOrder);
router.get("/session/:sessionId", requireAuth, getOrderBySession);
router.get("/:id/shipping-detail", requireAuth, getOrderShippingDetail);
router.get("/:id", requireAuth, getOrder);
router.put("/:id/cancel", requireAuth, cancelOrder);
router.delete("/:id", requireAuth, deleteOrder);

export default router;
