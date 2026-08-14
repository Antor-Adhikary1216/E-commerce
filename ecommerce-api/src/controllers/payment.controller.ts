import type { Request, Response } from "express";
import type Stripe from "stripe";
import { env } from "../config/env.js";
import { getStripe } from "../config/stripe.js";
import { ProductModel } from "../models/product.model.js";
import { OrderModel } from "../models/order.model.js";
import { ShippingDetailModel } from "../models/shipping-detail.model.js";
import type { AuthRequest } from "../middleware/auth.js";

const currency = "inr";

interface CheckoutLine {
  slug: string;
  quantity: number;
}

function orderNumber(): string {
  const now = new Date();
  const prefix = `VNT-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}`;
  return `${prefix}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

async function resolveItems(rawItems: unknown[]): Promise<{ items: CheckoutLine[]; bySlug: Map<string, any> }> {
  const items: CheckoutLine[] = rawItems.map((raw) => {
    const item = raw as { slug?: unknown; quantity?: unknown };
    return {
      slug: String(item.slug ?? ""),
      quantity: Math.max(1, Math.floor(Number(item.quantity) || 1)),
    };
  });

  const products = await ProductModel.find({ slug: { $in: items.map((i) => i.slug) } }).lean();
  const bySlug = new Map(products.map((p) => [p.slug, p]));
  const missing = items.filter((i) => !bySlug.has(i.slug)).map((i) => i.slug);
  if (missing.length > 0) throw new Error(`Unknown products: ${missing.join(", ")}`);

  return { items, bySlug };
}

function buildOrderItems(items: CheckoutLine[], bySlug: Map<string, any>) {
  return items.map((item) => {
    const product = bySlug.get(item.slug)!;
    return {
      product: product._id,
      name: product.name,
      image: product.images[0] ?? "",
      price: product.finalPrice,
      quantity: item.quantity,
    };
  });
}

async function createShippingDetail(shippingAddress: any, userId: string): Promise<string | undefined> {
  if (!shippingAddress || !shippingAddress.name || !shippingAddress.line1 || !shippingAddress.city) return undefined;
  const detail = await ShippingDetailModel.create({
    order: undefined,
    user: userId,
    name: shippingAddress.name,
    email: shippingAddress.email ?? "",
    phone: shippingAddress.phone ?? "",
    line1: shippingAddress.line1,
    line2: shippingAddress.line2 ?? "",
    city: shippingAddress.city,
    state: shippingAddress.state,
    postalCode: shippingAddress.postalCode,
    country: shippingAddress.country ?? "India",
  });
  return detail._id.toString();
}

// ─── Stripe Checkout ────────────────────────────────────────────
export async function createStripeCheckout(req: AuthRequest, res: Response): Promise<Response> {
  const stripe = getStripe();
  if (!stripe) return res.status(503).json({ message: "Stripe is not configured on the API" });

  const rawItems = Array.isArray(req.body?.items) ? req.body.items : null;
  if (!rawItems || rawItems.length === 0) return res.status(422).json({ message: "Items are required" });

  try {
    const { items, bySlug } = await resolveItems(rawItems);
    const orderItems = buildOrderItems(items, bySlug);
    const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingAddress = req.body?.shippingAddress ?? null;
    const shippingDetailId = await createShippingDetail(shippingAddress, req.auth!.userId);

    const order = await OrderModel.create({
      orderNumber: orderNumber(),
      user: req.auth!.userId,
      items: orderItems,
      status: "pending",
      paymentMethod: "stripe",
      paymentStatus: "pending",
      shippingDetail: shippingDetailId,
      shippingAddress,
      subtotal,
      discount: 0,
      shippingCost: 0,
      tax: 0,
      total: subtotal,
    });

    if (shippingDetailId) {
      await ShippingDetailModel.updateOne({ _id: shippingDetailId }, { $set: { order: order._id } });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      client_reference_id: order.id,
      line_items: orderItems.map((item) => ({
        quantity: item.quantity,
        price_data: {
          currency,
          unit_amount: Math.round(item.price * 100),
          product_data: { name: item.name, images: item.image ? [item.image] : undefined },
        },
      })),
      success_url: `${env.CLIENT_ORIGIN}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.CLIENT_ORIGIN}/cart?canceled=1`,
      metadata: { orderId: order.id, orderNumber: String(order.orderNumber ?? "") },
      expires_at: Math.floor(Date.now() / 1000) + 60 * 30,
    });

    order.stripeSessionId = session.id;
    await order.save();

    return res.json({ url: session.url, orderNumber: order.orderNumber });
  } catch (err: any) {
    return res.status(400).json({ message: err.message || "Checkout failed" });
  }
}

// ─── Stripe Webhook ─────────────────────────────────────────────
export async function handleStripeWebhook(req: Request, res: Response): Promise<Response> {
  const stripe = getStripe();
  const secret = env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) return res.status(503).json({ message: "Stripe webhooks are not configured" });

  const signature = req.headers["stripe-signature"] as string | undefined;
  if (!signature) return res.status(400).json({ message: "Missing signature" });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(req.body as Buffer, signature, secret);
  } catch {
    return res.status(400).json({ message: "Invalid signature" });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;
    if (orderId) {
      await OrderModel.updateOne(
        { _id: orderId },
        { paymentStatus: "paid", status: "confirmed", stripePaymentIntent: String(session.payment_intent ?? "") },
      );
    }
  } else if (event.type === "checkout.session.expired" || event.type === "checkout.session.async_payment_failed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;
    if (orderId) await OrderModel.updateOne({ _id: orderId }, { paymentStatus: "failed" });
  }

  return res.json({ received: true });
}

// ─── Legacy alias (kept for backward compat) ────────────────────
export async function createCheckout(req: AuthRequest, res: Response): Promise<Response> {
  return createStripeCheckout(req, res);
}

export async function handleWebhook(req: Request, res: Response): Promise<Response> {
  return handleStripeWebhook(req, res);
}
