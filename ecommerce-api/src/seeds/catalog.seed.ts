import "dotenv/config";
import { connectDatabase } from "../config/database.js";
import { CategoryModel } from "../models/category.model.js";
import { ProductModel } from "../models/product.model.js";

type CatalogItem = { name: string; category: string; price: number; brand: string };

const catalog: CatalogItem[] = [
  { name: "Apple iPhone 16 Pro", category: "Mobiles", price: 119900, brand: "Apple" },
  { name: "Samsung Galaxy S25 Ultra", category: "Mobiles", price: 129999, brand: "Samsung" },
  { name: "MacBook Air M4", category: "Laptops", price: 99900, brand: "Apple" },
  { name: "Sony WH-1000XM6", category: "Headphones", price: 34990, brand: "Sony" },
  { name: "Apple AirPods Pro", category: "Earbuds", price: 24900, brand: "Apple" },
  { name: "Premium Cotton T-Shirt", category: "T-Shirts", price: 1999, brand: "Vanta" },
  { name: "Oversized Hoodie", category: "Hoodies", price: 3999, brand: "Vanta" },
  { name: "Denim Jacket", category: "Jackets", price: 5999, brand: "Vanta" },
  { name: "Linen Shirt", category: "Shirts", price: 3299, brand: "Vanta" },
  { name: "Slim Fit Jeans", category: "Jeans", price: 3499, brand: "Vanta" },
  { name: "Nike Air Max", category: "Sneakers", price: 12995, brand: "Nike" },
  { name: "Adidas Ultraboost", category: "Sneakers", price: 18999, brand: "Adidas" },
  { name: "Puma Running Shoes", category: "Running Shoes", price: 6999, brand: "Puma" },
  { name: "Converse Chuck Taylor", category: "Sneakers", price: 5499, brand: "Converse" },
  { name: "Vitamin C Serum", category: "Skincare", price: 1299, brand: "Minimalist" },
  { name: "Silk Matte Lipstick", category: "Makeup", price: 899, brand: "Rare Beauty" },
  { name: "Hydrating Face Cream", category: "Skincare", price: 1599, brand: "CeraVe" },
  { name: "Air Fryer", category: "Kitchen Appliances", price: 8999, brand: "Philips" },
  { name: "Coffee Maker", category: "Kitchen Appliances", price: 6999, brand: "BrewCo" },
  { name: "Electric Kettle", category: "Kitchen Appliances", price: 2499, brand: "Havells" },
  { name: "Office Chair", category: "Furniture", price: 14999, brand: "Ergo" },
  { name: "Gaming Desk", category: "Furniture", price: 18999, brand: "Nordic" },
  { name: "Wooden Bookshelf", category: "Furniture", price: 11999, brand: "Woodcraft" },
  { name: "Dumbbells Set", category: "Fitness", price: 4999, brand: "FitPro" },
  { name: "Yoga Mat", category: "Fitness", price: 1499, brand: "Manduka" },
  { name: "Football", category: "Sports", price: 1999, brand: "Adidas" },
  { name: "Cricket Bat", category: "Sports", price: 4999, brand: "SS" },
  { name: "Atomic Habits", category: "Books", price: 799, brand: "Penguin" },
  { name: "Deep Work", category: "Books", price: 699, brand: "Grand Central" },
  { name: "Clean Code", category: "Books", price: 999, brand: "Pearson" },
  { name: "The Psychology of Money", category: "Books", price: 499, brand: "Jaico" },
  { name: "The Pragmatic Programmer", category: "Books", price: 899, brand: "Addison" },
  { name: "Building Blocks", category: "Toys", price: 1299, brand: "Lego" },
  { name: "Wooden Train Set", category: "Toys", price: 1799, brand: "Brio" },
  { name: "Organic Coffee Beans", category: "Grocery", price: 899, brand: "Blue Tokai" },
  { name: "Artisan Honey", category: "Grocery", price: 599, brand: "Natureland" },
  { name: "Classic Watch", category: "Watches", price: 8999, brand: "Titan" },
  { name: "Sport Chronograph", category: "Watches", price: 12999, brand: "Fossil" },
  { name: "Leather Backpack", category: "Bags", price: 4999, brand: "Hidesign" },
  { name: "Leather Wallet", category: "Wallets", price: 1999, brand: "Hidesign" },
  { name: "Polarized Sunglasses", category: "Sunglasses", price: 2999, brand: "Ray-Ban" },
  { name: "Power Bank 20000mAh", category: "Mobile Accessories", price: 2499, brand: "Anker" },
];

const image = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80";
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const apparelCategories = new Set(["T-Shirts", "Hoodies", "Jackets", "Shirts", "Jeans", "Sneakers", "Running Shoes"]);

async function seed() {
  await connectDatabase();

  for (const category of new Set(catalog.map((item) => item.category))) {
    await CategoryModel.updateOne(
      { slug: slugify(category) },
      { $setOnInsert: { name: category, slug: slugify(category) } },
      { upsert: true }
    );
  }

  const categories = await CategoryModel.find().lean();

  for (const [index, row] of catalog.entries()) {
    const slug = slugify(row.name);
    const discount = [0, 10, 15, 20][index % 4];
    const finalPrice = Math.round(row.price * (1 - discount / 100));
    const categoryId = categories.find((c) => c.slug === slugify(row.category))!._id;

    await ProductModel.updateOne(
      { sku: `VNT-${String(index + 1).padStart(4, "0")}` },
      {
        $setOnInsert: {
          name: row.name,
          slug,
          description: `A carefully selected ${row.name} designed for daily use.`,
          shortDescription: `Premium ${row.name} from ${row.brand}.`,
          price: row.price,
          discount,
          finalPrice,
          brand: row.brand,
          category: categoryId,
          sku: `VNT-${String(index + 1).padStart(4, "0")}`,
          images: [image],
          tags: [row.category, row.brand],
          rating: 4.2 + (index % 8) / 10,
          reviewCount: 12 + index * 3,
          colors: ["Black", "White"],
          sizes: apparelCategories.has(row.category) ? ["S", "M", "L"] : [],
          featured: index % 5 === 0,
          bestSeller: index % 6 === 0,
          flashSale: index % 7 === 0,
          newArrival: index % 4 === 0,
        },
      },
      { upsert: true }
    );
  }

  console.log(`Seeded ${catalog.length} products.`);
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
