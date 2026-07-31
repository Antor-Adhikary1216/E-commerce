import type { Request, Response } from "express";
import { CategoryModel } from "../models/category.model.js";

export async function listCategories(_req: Request, res: Response) {
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
  res.json({ items: categories });
}
