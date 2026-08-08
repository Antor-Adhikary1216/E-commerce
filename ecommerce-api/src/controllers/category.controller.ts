import type { Request, Response } from "express";
import { CategoryModel } from "../models/category.model.js";

let cachedCategories: unknown = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000;

export async function listCategories(_req: Request, res: Response) {
  const now = Date.now();
  if (cachedCategories && now - cacheTimestamp < CACHE_TTL) {
    return res.json({ items: cachedCategories });
  }

  const categories = await CategoryModel.aggregate([
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "category",
        as: "products",
      },
    },
    {
      $project: {
        name: 1,
        slug: 1,
        image: 1,
        count: { $size: "$products" },
      },
    },
    { $match: { count: { $gt: 0 } } },
    { $sort: { name: 1 } },
  ]);

  cachedCategories = categories;
  cacheTimestamp = now;

  res.json({ items: categories });
}
