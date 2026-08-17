import type { Response } from "express";
import { OrderModel } from "../models/order.model.js";
import { UserModel } from "../models/user.model.js";
import { ProductModel } from "../models/product.model.js";
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
