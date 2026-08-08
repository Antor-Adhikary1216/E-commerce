import type { Response } from "express";
import { OrderModel } from "../models/order.model.js";
import type { AuthRequest } from "../middleware/auth.js";

export async function listOrders(req: AuthRequest, res: Response): Promise<Response> {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 20));
  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    OrderModel.find({ user: req.auth!.userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("orderNumber status paymentMethod paymentStatus items total createdAt")
      .lean(),
    OrderModel.countDocuments({ user: req.auth!.userId }),
  ]);

  return res.json({ orders, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
}

export async function getOrder(req: AuthRequest, res: Response): Promise<Response> {
  const order = await OrderModel.findOne({
    _id: req.params.id,
    user: req.auth!.userId,
  }).lean();
  if (!order) return res.status(404).json({ message: "Order not found" });
  return res.json({ order });
}

export async function getOrderBySession(req: AuthRequest, res: Response): Promise<Response> {
  const { sessionId } = req.params;
  if (!sessionId) return res.status(400).json({ message: "Session ID is required" });
  const order = await OrderModel.findOne({ stripeSessionId: sessionId, user: req.auth!.userId })
    .select("orderNumber status total")
    .lean();
  if (!order) return res.status(404).json({ message: "Order not found" });
  return res.json({ order });
}
