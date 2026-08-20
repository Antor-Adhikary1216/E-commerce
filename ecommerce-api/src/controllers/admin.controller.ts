import type { Response } from "express";
import { Types } from "mongoose";
import { getAuth } from "firebase-admin/auth";
import { OrderModel } from "../models/order.model.js";
import { UserModel } from "../models/user.model.js";
import { ProductModel } from "../models/product.model.js";
import { ConversationModel } from "../models/conversation.model.js";
import { CartModel } from "../models/cart.model.js";
import { ReviewModel } from "../models/review.model.js";
import type { AuthRequest } from "../middleware/auth.js";

// ─── Dashboard Stats ────────────────────────────────────────────
export async function getDashboardStats(req: AuthRequest, res: Response): Promise<Response> {
  const [totalOrders, totalUsers, totalProducts, recentOrders] = await Promise.all([
    OrderModel.countDocuments(),
    UserModel.countDocuments(),
    ProductModel.countDocuments(),
    OrderModel.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("orderNumber status total createdAt")
      .lean(),
  ]);

  const ordersByStatus = await OrderModel.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  const totalRevenue = await OrderModel.aggregate([
    { $match: { paymentStatus: "paid" } },
    { $group: { _id: null, total: { $sum: "$total" } } },
  ]);

  return res.json({
    stats: {
      totalOrders,
      totalUsers,
      totalProducts,
      totalRevenue: totalRevenue[0]?.total || 0,
      ordersByStatus,
    },
    recentOrders,
  });
}

// ─── Products ───────────────────────────────────────────────────
export async function listProducts(req: AuthRequest, res: Response): Promise<Response> {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 20));
  const skip = (page - 1) * limit;
  const search = (req.query.search as string) || "";

  const filter: any = {};
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { brand: { $regex: search, $options: "i" } },
      { sku: { $regex: search, $options: "i" } },
    ];
  }

  const [products, total] = await Promise.all([
    ProductModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("category", "name")
      .lean(),
    ProductModel.countDocuments(filter),
  ]);

  return res.json({ products, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
}

export async function getProduct(req: AuthRequest, res: Response): Promise<Response> {
  const product = await ProductModel.findById(req.params.id).populate("category", "name").lean();
  if (!product) return res.status(404).json({ message: "Product not found" });
  return res.json({ product });
}

export async function createProduct(req: AuthRequest, res: Response): Promise<Response> {
  const { name, slug, description, shortDescription, price, discount, finalPrice, brand, category, sku, images, tags, colors, sizes, featured, bestSeller, flashSale, newArrival } = req.body;

  const existing = await ProductModel.findOne({ $or: [{ slug }, { sku }] });
  if (existing) return res.status(400).json({ message: "Product with same slug or SKU exists" });

  const product = await ProductModel.create({
    name, slug, description, shortDescription, price, discount, finalPrice, brand, category, sku, images, tags, colors, sizes, featured, bestSeller, flashSale, newArrival,
  });

  return res.status(201).json({ product });
}

export async function updateProduct(req: AuthRequest, res: Response): Promise<Response> {
  const product = await ProductModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!product) return res.status(404).json({ message: "Product not found" });
  return res.json({ product });
}

export async function deleteProduct(req: AuthRequest, res: Response): Promise<Response> {
  const product = await ProductModel.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  return res.json({ message: "Product deleted successfully" });
}

// ─── Orders ─────────────────────────────────────────────────────
export async function listAllOrders(req: AuthRequest, res: Response): Promise<Response> {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 20));
  const skip = (page - 1) * limit;
  const status = (req.query.status as string) || "";

  const filter: any = {};
  if (status) filter.status = status;

  const [orders, total] = await Promise.all([
    OrderModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "name email")
      .lean(),
    OrderModel.countDocuments(filter),
  ]);

  return res.json({ orders, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
}

export async function updateOrderStatus(req: AuthRequest, res: Response): Promise<Response> {
  const { status } = req.body;
  const validStatuses = ["pending", "confirmed", "packed", "shipped", "out_for_delivery", "delivered", "cancelled"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const order = await OrderModel.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!order) return res.status(404).json({ message: "Order not found" });
  return res.json({ order });
}

// ─── Users ──────────────────────────────────────────────────────
export async function listUsers(req: AuthRequest, res: Response): Promise<Response> {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 20));
  const skip = (page - 1) * limit;
  const search = (req.query.search as string) || "";

  const filter: any = {};
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const [users, total] = await Promise.all([
    UserModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-refreshTokenHash")
      .lean(),
    UserModel.countDocuments(filter),
  ]);

  return res.json({ users, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
}

export async function updateUserRole(req: AuthRequest, res: Response): Promise<Response> {
  const { role } = req.body;
  if (!["customer", "admin"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  const user = await UserModel.findByIdAndUpdate(req.params.id, { role }, { new: true }).select("-refreshTokenHash");
  if (!user) return res.status(404).json({ message: "User not found" });
  return res.json({ user });
}

export async function deleteUser(req: AuthRequest, res: Response): Promise<Response> {
  const user = await UserModel.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  if (user.role === "admin") {
    return res.status(400).json({ message: "Cannot delete an admin user" });
  }

  const firebaseUid = user.firebaseUid;

  await Promise.all([
    CartModel.deleteMany({ user: user._id }),
    ReviewModel.deleteMany({ user: user._id }),
    ConversationModel.deleteMany({ user: user._id }),
  ]);

  await UserModel.findByIdAndDelete(user._id);

  try {
    const auth = getAuth();
    await auth.deleteUser(firebaseUid);
  } catch {
    // Firebase user may not exist; continue
  }

  return res.json({ message: "User permanently deleted" });
}

// ─── Payment History ──────────────────────────────────────────────
export async function listPayments(req: AuthRequest, res: Response): Promise<Response> {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
  const skip = (page - 1) * limit;
  const status = (req.query.status as string) || "";
  const method = (req.query.method as string) || "";
  const userId = (req.query.userId as string) || "";

  const filter: any = {};
  if (status) filter.paymentStatus = status;
  if (method) filter.paymentMethod = method;
  if (userId) filter.user = userId;

  const [payments, total] = await Promise.all([
    OrderModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "name email")
      .lean(),
    OrderModel.countDocuments(filter),
  ]);

  return res.json({ payments, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
}

// ─── Customer Care / Conversations ────────────────────────────────
export async function listConversations(req: AuthRequest, res: Response): Promise<Response> {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 20));
  const skip = (page - 1) * limit;
  const status = (req.query.status as string) || "";

  const filter: any = {};
  if (status) filter.status = status;

  const [conversations, total] = await Promise.all([
    ConversationModel.find(filter)
      .sort({ lastMessageAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "name email avatar")
      .populate("admin", "name email")
      .lean(),
    ConversationModel.countDocuments(filter),
  ]);

  return res.json({ conversations, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
}

export async function getConversation(req: AuthRequest, res: Response): Promise<Response> {
  const conversation = await ConversationModel.findById(req.params.id)
    .populate("user", "name email avatar")
    .populate("admin", "name email")
    .lean();

  if (!conversation) return res.status(404).json({ message: "Conversation not found" });

  return res.json({ conversation });
}

export async function sendMessage(req: AuthRequest, res: Response): Promise<Response> {
  const { content } = req.body;
  if (!content || !content.trim()) {
    return res.status(400).json({ message: "Message content is required" });
  }

  const conversation = await ConversationModel.findById(req.params.id);
  if (!conversation) return res.status(404).json({ message: "Conversation not found" });

  const message = {
    sender: req.auth!.userId,
    content: content.trim(),
    isAdmin: true,
    read: false,
    createdAt: new Date(),
  };

  conversation.messages.push(message);
  conversation.lastMessageAt = new Date();
  conversation.status = "waiting";
  if (!conversation.admin) conversation.admin = new Types.ObjectId(req.auth!.userId);

  await conversation.save();

  await conversation.populate("user", "name email avatar");
  await conversation.populate("admin", "name email");

  return res.json({ conversation });
}

export async function updateConversationStatus(req: AuthRequest, res: Response): Promise<Response> {
  const { status } = req.body;
  if (!["open", "waiting", "closed"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const conversation = await ConversationModel.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  ).populate("user", "name email avatar");

  if (!conversation) return res.status(404).json({ message: "Conversation not found" });

  return res.json({ conversation });
}
