import type { Request, Response } from "express";
import { ProductModel } from "../models/product.model.js";
import { CategoryModel } from "../models/category.model.js";

export async function listProducts(req: Request, res: Response) {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(48, Math.max(1, Number(req.query.limit) || 16));
  const filter: Record<string, unknown> = {};

  if (req.query.category) {
    const category = String(req.query.category);
    const matched = await CategoryModel.findOne({ $or: [{ slug: category }, { name: category }] })
      .select("_id")
      .lean();
    if (matched) filter.category = matched._id;
    else return res.json({ items: [], pagination: { page, limit, total: 0, pages: 0 } });
  }
  if (req.query.brand) filter.brand = req.query.brand;
  if (req.query.q) filter.$text = { $search: String(req.query.q) };
  if (req.query.feature) filter[String(req.query.feature)] = true;

  const sort = String(req.query.sort || "latest");
  const sortMap: Record<string, Record<string, 1 | -1>> = {
    price_asc: { finalPrice: 1 },
    price_desc: { finalPrice: -1 },
    rating: { rating: -1 },
    latest: { createdAt: -1 },
  };

  const [items, total] = await Promise.all([
    ProductModel.find(filter)
      .sort(sortMap[sort] ?? sortMap.latest)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    ProductModel.countDocuments(filter),
  ]);

  res.json({ items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
}

export async function getProduct(req: Request, res: Response) {
  const product = await ProductModel.findOne({ slug: req.params.slug })
    .populate("category", "name slug")
    .lean();
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
}
