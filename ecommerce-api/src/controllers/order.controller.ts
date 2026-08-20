import type { Response } from "express";
import mongoose from "mongoose";
import { OrderModel } from "../models/order.model.js";
import { ShippingDetailModel } from "../models/shipping-detail.model.js";
import { UserModel } from "../models/user.model.js";
import type { AuthRequest } from "../middleware/auth.js";
import { sendEmail } from "../config/email.js";

export async function listOrders(req: AuthRequest, res: Response): Promise<Response> {
  try {
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
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getOrder(req: AuthRequest, res: Response): Promise<Response> {
  try {
    const orderId = String(req.params.id);
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const order = await OrderModel.findOne({
      _id: orderId,
      user: req.auth!.userId,
    }).populate("shippingDetail").lean();
    if (!order) return res.status(404).json({ message: "Order not found" });
    return res.json({ order });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getOrderBySession(req: AuthRequest, res: Response): Promise<Response> {
  try {
    const { sessionId } = req.params;
    if (!sessionId) return res.status(400).json({ message: "Session ID is required" });
    const order = await OrderModel.findOne({ stripeSessionId: sessionId, user: req.auth!.userId })
      .select("orderNumber status total")
      .lean();
    if (!order) return res.status(404).json({ message: "Order not found" });
    return res.json({ order });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getOrderShippingDetail(req: AuthRequest, res: Response): Promise<Response> {
  try {
    const orderId = String(req.params.id);
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const detail = await ShippingDetailModel.findOne({
      order: orderId,
      user: req.auth!.userId,
    }).lean();
    if (!detail) return res.status(404).json({ message: "Shipping details not found" });
    return res.json({ shippingDetail: detail });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteOrder(req: AuthRequest, res: Response): Promise<Response> {
  try {
    const orderId = String(req.params.id);
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const order = await OrderModel.findOne({ _id: orderId, user: req.auth!.userId });
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (["packed", "shipped", "out_for_delivery", "delivered"].includes(order.status)) {
      return res.status(400).json({ message: "Cannot delete an order that is already being processed" });
    }

    await OrderModel.deleteOne({ _id: order._id });
    await ShippingDetailModel.deleteMany({ order: orderId });

    return res.json({ message: "Order deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function trackOrder(req: AuthRequest, res: Response): Promise<Response> {
  try {
    const orderNumber = String(req.params.orderNumber ?? "");
    if (!orderNumber) return res.status(400).json({ message: "Order number is required" });

    const order = await OrderModel.findOne({
      orderNumber: orderNumber.toUpperCase(),
      user: req.auth!.userId
    }).populate("shippingDetail").lean();

    if (!order) return res.status(404).json({ message: "Order not found" });

    const trackingSteps = [
      { status: "pending", label: "Order Placed", completed: true },
      { status: "confirmed", label: "Confirmed", completed: ["confirmed", "packed", "shipped", "out_for_delivery", "delivered"].includes(order.status) },
      { status: "packed", label: "Packed", completed: ["packed", "shipped", "out_for_delivery", "delivered"].includes(order.status) },
      { status: "shipped", label: "Shipped", completed: ["shipped", "out_for_delivery", "delivered"].includes(order.status) },
      { status: "out_for_delivery", label: "Out for Delivery", completed: ["out_for_delivery", "delivered"].includes(order.status) },
      { status: "delivered", label: "Delivered", completed: order.status === "delivered" },
    ];

    if (order.status === "cancelled") {
      trackingSteps.forEach(step => {
        step.completed = step.status === "pending";
      });
    }

    return res.json({ order, trackingSteps });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function cancelOrder(req: AuthRequest, res: Response): Promise<Response> {
  try {
    const orderId = String(req.params.id);
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const order = await OrderModel.findOne({ _id: orderId, user: req.auth!.userId });
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (!["pending", "confirmed"].includes(order.status)) {
      return res.status(400).json({ message: "Only pending or confirmed orders can be cancelled" });
    }

    order.status = "cancelled";
    await order.save();

    const user = await UserModel.findById(req.auth!.userId).lean();
    if (user?.email) {
      const itemNames = order.items.map((i) => i.name).join(", ");
      const wasPaid = order.paymentMethod === "stripe" && order.paymentStatus === "paid";

      if (wasPaid) {
        await sendEmail({
          to: user.email,
          subject: `Order ${order.orderNumber} cancelled – refund initiated`,
          html: `
            <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
              <h2 style="color:#cf1322">Order Cancelled</h2>
              <p>Hi ${user.name},</p>
              <p>Your order <strong>${order.orderNumber}</strong> (${itemNames}) has been cancelled.</p>
              <p>Since you paid online, a refund of <strong>₹${(order.total ?? 0).toFixed(2)}</strong> will be initiated to your original payment method within 5–7 business days.</p>
              <p style="color:#8c8c8c;font-size:13px;margin-top:24px">If you have any questions, contact our support team.</p>
              <p style="color:#8c8c8c;font-size:13px">– Shopping in India.in</p>
            </div>`,
        });
      } else {
        await sendEmail({
          to: user.email,
          subject: `Order ${order.orderNumber} cancelled`,
          html: `
            <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
              <h2 style="color:#cf1322">Order Cancelled</h2>
              <p>Hi ${user.name},</p>
              <p>Your order <strong>${order.orderNumber}</strong> (${itemNames}) has been cancelled.</p>
              <p style="color:#8c8c8c;font-size:13px;margin-top:24px">If you have any questions, contact our support team.</p>
              <p style="color:#8c8c8c;font-size:13px">– Shopping in India.in</p>
            </div>`,
        });
      }
    }

    return res.json({ message: "Order cancelled successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
