import "dotenv/config";
import { connectDatabase } from "../config/database.js";
import { CategoryModel } from "../models/category.model.js";
import { ProductModel } from "../models/product.model.js";

type CatalogItem = { name: string; category: string; price: number; brand: string };

const catalog: CatalogItem[] = [
  // Mobiles
  { name: "Apple iPhone 16 Pro", category: "Mobiles", price: 119900, brand: "Apple" },
  { name: "Apple iPhone 15", category: "Mobiles", price: 74900, brand: "Apple" },
  { name: "Samsung Galaxy S25 Ultra", category: "Mobiles", price: 129999, brand: "Samsung" },
  { name: "Samsung Galaxy A55", category: "Mobiles", price: 38999, brand: "Samsung" },
  { name: "Google Pixel 9 Pro", category: "Mobiles", price: 99900, brand: "Google" },
  { name: "OnePlus 13", category: "Mobiles", price: 69999, brand: "OnePlus" },
  { name: "Nothing Phone (3a)", category: "Mobiles", price: 32999, brand: "Nothing" },
  { name: "Xiaomi 15", category: "Mobiles", price: 64999, brand: "Xiaomi" },
  { name: "Motorola Edge 50", category: "Mobiles", price: 32999, brand: "Motorola" },
  // Laptops
  { name: "MacBook Air M4", category: "Laptops", price: 99900, brand: "Apple" },
  { name: "MacBook Pro 14 M4", category: "Laptops", price: 199900, brand: "Apple" },
  { name: "Dell XPS 13", category: "Laptops", price: 129999, brand: "Dell" },
  { name: "HP Spectre x360", category: "Laptops", price: 114999, brand: "HP" },
  { name: "Lenovo ThinkPad X1 Carbon", category: "Laptops", price: 154999, brand: "Lenovo" },
  { name: "ASUS ROG Zephyrus G14", category: "Laptops", price: 149999, brand: "ASUS" },
  { name: "Microsoft Surface Laptop 7", category: "Laptops", price: 104999, brand: "Microsoft" },
  { name: "Acer Swift Go", category: "Laptops", price: 64999, brand: "Acer" },
  // Headphones
  { name: "Sony WH-1000XM6", category: "Headphones", price: 34990, brand: "Sony" },
  { name: "Bose QuietComfort Ultra", category: "Headphones", price: 39900, brand: "Bose" },
  { name: "Sennheiser Momentum 4", category: "Headphones", price: 32999, brand: "Sennheiser" },
  { name: "Audio-Technica ATH-M50x", category: "Headphones", price: 17999, brand: "Audio-Technica" },
  { name: "JBL Tune 770", category: "Headphones", price: 8999, brand: "JBL" },
  { name: "Sony WH-CH520", category: "Headphones", price: 4999, brand: "Sony" },
  // Earbuds
  { name: "Apple AirPods Pro 2", category: "Earbuds", price: 24900, brand: "Apple" },
  { name: "Apple AirPods 4", category: "Earbuds", price: 15900, brand: "Apple" },
  { name: "Sony WF-1000XM5", category: "Earbuds", price: 24990, brand: "Sony" },
  { name: "Samsung Galaxy Buds3 Pro", category: "Earbuds", price: 20999, brand: "Samsung" },
  { name: "Nothing Ear (2)", category: "Earbuds", price: 10999, brand: "Nothing" },
  { name: "JBL Wave Buds", category: "Earbuds", price: 3999, brand: "JBL" },
  // Sneakers
  { name: "Nike Air Max 90", category: "Sneakers", price: 12995, brand: "Nike" },
  { name: "Adidas Ultraboost 5", category: "Sneakers", price: 18999, brand: "Adidas" },
  { name: "Converse Chuck Taylor", category: "Sneakers", price: 5499, brand: "Converse" },
  { name: "New Balance 550", category: "Sneakers", price: 12999, brand: "New Balance" },
  { name: "Puma Suede Classic", category: "Sneakers", price: 6999, brand: "Puma" },
  { name: "Vans Old Skool", category: "Sneakers", price: 6499, brand: "Vans" },
  // Skincare
  { name: "Vitamin C Serum", category: "Skincare", price: 1299, brand: "Minimalist" },
  { name: "Hydrating Face Cream", category: "Skincare", price: 1599, brand: "CeraVe" },
  { name: "Niacinamide Serum", category: "Skincare", price: 999, brand: "The Ordinary" },
  { name: "Sunscreen SPF 50", category: "Skincare", price: 1099, brand: "Neutrogena" },
  { name: "Retinol Night Cream", category: "Skincare", price: 1799, brand: "Olay" },
  { name: "Gentle Foaming Cleanser", category: "Skincare", price: 899, brand: "Cetaphil" },
  // Kitchen Appliances
  { name: "Philips Air Fryer", category: "Kitchen Appliances", price: 8999, brand: "Philips" },
  { name: "BrewCo Coffee Maker", category: "Kitchen Appliances", price: 6999, brand: "BrewCo" },
  { name: "Havells Electric Kettle", category: "Kitchen Appliances", price: 2499, brand: "Havells" },
  { name: "Samsung Microwave Oven", category: "Kitchen Appliances", price: 10999, brand: "Samsung" },
  { name: "Bosch Hand Blender", category: "Kitchen Appliances", price: 4999, brand: "Bosch" },
  { name: "Instant Pot 6QT", category: "Kitchen Appliances", price: 8499, brand: "Instant Pot" },
  // Furniture
  { name: "Ergo Office Chair", category: "Furniture", price: 14999, brand: "Ergo" },
  { name: "Nordic Gaming Desk", category: "Furniture", price: 18999, brand: "Nordic" },
  { name: "Woodcraft Bookshelf", category: "Furniture", price: 11999, brand: "Woodcraft" },
  { name: "Cloud Sofa", category: "Furniture", price: 45999, brand: "HomeStory" },
  { name: "Oak Dining Table", category: "Furniture", price: 34999, brand: "Nordic" },
  { name: "Wardrobe 3-Door", category: "Furniture", price: 27999, brand: "Woodcraft" },
  // Sports
  { name: "Adidas Football", category: "Sports", price: 1999, brand: "Adidas" },
  { name: "SS Cricket Bat", category: "Sports", price: 4999, brand: "SS" },
  { name: "Yonex Badminton Racket", category: "Sports", price: 2999, brand: "Yonex" },
  { name: "Cosco Basketball", category: "Sports", price: 2499, brand: "Cosco" },
  { name: "Puma Gym Bag", category: "Sports", price: 1999, brand: "Puma" },
  { name: "Stag Table Tennis Racket", category: "Sports", price: 1499, brand: "Stag" },
  // Books
  { name: "Atomic Habits", category: "Books", price: 799, brand: "Penguin" },
  { name: "Deep Work", category: "Books", price: 699, brand: "Grand Central" },
  { name: "Clean Code", category: "Books", price: 999, brand: "Pearson" },
  { name: "The Psychology of Money", category: "Books", price: 499, brand: "Jaico" },
  { name: "The Pragmatic Programmer", category: "Books", price: 899, brand: "Addison" },
  { name: "Sapiens", category: "Books", price: 1099, brand: "Penguin" },
  // Toys
  { name: "Lego Building Blocks", category: "Toys", price: 1299, brand: "Lego" },
  { name: "Brio Wooden Train Set", category: "Toys", price: 1799, brand: "Brio" },
  { name: "Barbie Dreamhouse", category: "Toys", price: 8999, brand: "Mattel" },
  { name: "Hot Wheels 10-Pack", category: "Toys", price: 999, brand: "Mattel" },
  { name: "Rubik's Cube", category: "Toys", price: 599, brand: "Spin Master" },
  { name: "Paw Patrol RC Car", category: "Toys", price: 2999, brand: "Spin Master" },
  // Grocery
  { name: "Blue Tokai Coffee Beans", category: "Grocery", price: 899, brand: "Blue Tokai" },
  { name: "Natureland Artisan Honey", category: "Grocery", price: 599, brand: "Natureland" },
  { name: "Figaro Olive Oil", category: "Grocery", price: 1299, brand: "Figaro" },
  { name: "24 Mantra Organic Quinoa", category: "Grocery", price: 549, brand: "24 Mantra" },
  { name: "Tetley Green Tea 100 Bags", category: "Grocery", price: 399, brand: "Tetley" },
  { name: "Haldiram's Almonds 500g", category: "Grocery", price: 799, brand: "Haldiram's" },
  // T-Shirts
  { name: "Premium Cotton T-Shirt", category: "T-Shirts", price: 1999, brand: "Shopping in India.in" },
  { name: "Everyday Crew Tee", category: "T-Shirts", price: 1499, brand: "Shopping in India.in" },
  { name: "Graphic Tee", category: "T-Shirts", price: 1699, brand: "Roadster" },
  { name: "Polo Tee", category: "T-Shirts", price: 2199, brand: "US Polo Assn" },
  // Hoodies
  { name: "Oversized Hoodie", category: "Hoodies", price: 3999, brand: "Shopping in India.in" },
  { name: "Zip Hoodie", category: "Hoodies", price: 4599, brand: "HRX" },
  { name: "Essentials Hoodie", category: "Hoodies", price: 3499, brand: "Shopping in India.in" },
  // Jackets
  { name: "Denim Jacket", category: "Jackets", price: 5999, brand: "Shopping in India.in" },
  { name: "Bomber Jacket", category: "Jackets", price: 4999, brand: "HRX" },
  { name: "Puffer Jacket", category: "Jackets", price: 7999, brand: "Shopping in India.in" },
  // Shirts
  { name: "Linen Shirt", category: "Shirts", price: 3299, brand: "Shopping in India.in" },
  { name: "Oxford Shirt", category: "Shirts", price: 3499, brand: "Louis Philippe" },
  { name: "Casual Shirt", category: "Shirts", price: 2899, brand: "Peter England" },
  // Jeans
  { name: "Slim Fit Jeans", category: "Jeans", price: 3499, brand: "Shopping in India.in" },
  { name: "Straight Fit Jeans", category: "Jeans", price: 3999, brand: "Levi's" },
  { name: "Skinny Jeans", category: "Jeans", price: 3299, brand: "H&M" },
  // Running Shoes
  { name: "Puma Running Shoes", category: "Running Shoes", price: 6999, brand: "Puma" },
  { name: "Asics Gel Cumulus", category: "Running Shoes", price: 9999, brand: "Asics" },
  { name: "Reebok Flexagon", category: "Running Shoes", price: 5499, brand: "Reebok" },
  // Makeup
  { name: "Silk Matte Lipstick", category: "Makeup", price: 899, brand: "Rare Beauty" },
  { name: "Volumizing Mascara", category: "Makeup", price: 1099, brand: "Maybelline" },
  { name: "Setting Powder", category: "Makeup", price: 1299, brand: "MAC" },
  // Fitness
  { name: "Dumbbells Set", category: "Fitness", price: 4999, brand: "FitPro" },
  { name: "Yoga Mat", category: "Fitness", price: 1499, brand: "Manduka" },
  { name: "Resistance Bands", category: "Fitness", price: 999, brand: "Decathlon" },
  // Watches
  { name: "Classic Watch", category: "Watches", price: 8999, brand: "Titan" },
  { name: "Sport Chronograph", category: "Watches", price: 12999, brand: "Fossil" },
  { name: "Minimal Watch", category: "Watches", price: 7499, brand: "Daniel Wellington" },
  // Bags
  { name: "Leather Backpack", category: "Bags", price: 4999, brand: "Hidesign" },
  { name: "Travel Duffel", category: "Bags", price: 3499, brand: "American Tourister" },
  { name: "Sling Bag", category: "Bags", price: 1999, brand: "Wildcraft" },
  // Wallets
  { name: "Leather Wallet", category: "Wallets", price: 1999, brand: "Hidesign" },
  { name: "Card Holder", category: "Wallets", price: 1499, brand: "Tommy Hilfiger" },
  { name: "RFID Wallet", category: "Wallets", price: 2499, brand: "Hidesign" },
  // Sunglasses
  { name: "Polarized Sunglasses", category: "Sunglasses", price: 2999, brand: "Ray-Ban" },
  { name: "Classic Aviator", category: "Sunglasses", price: 3499, brand: "Ray-Ban" },
  { name: "Round Frames", category: "Sunglasses", price: 1999, brand: "Fastrack" },
  // Mobile Accessories
  { name: "Power Bank 20000mAh", category: "Mobile Accessories", price: 2499, brand: "Anker" },
  { name: "Fast Charger", category: "Mobile Accessories", price: 1299, brand: "Spigen" },
  { name: "Silicone Phone Case", category: "Mobile Accessories", price: 999, brand: "ESR" },
];

const fallbackImage = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80";

const categoryImages: Record<string, string[]> = {
  Mobiles: ["photo-1511707171634-5f897ff02aa9", "photo-1601784551446-20c9e07cdbdb"],
  Laptops: ["photo-1517336714731-489689fd1ca8", "photo-1496181133206-80ce9b88a853"],
  Headphones: ["photo-1505740420928-5e560c06d30e", "photo-1583394838336-acd977736f90"],
  Earbuds: ["photo-1600294037681-c80b4cb5b434"],
  Sneakers: ["photo-1542291026-7eec264c27ff", "photo-1560769629-975ec94e6a86"],
  "Running Shoes": ["photo-1560769629-975ec94e6a86"],
  "T-Shirts": ["photo-1521572163474-6864f9cf17ab"],
  Hoodies: ["photo-1556821840-3a63f95609a7"],
  Jackets: ["photo-1551028719-00167b16eac5"],
  Shirts: ["photo-1602810318383-e386cc2a3ccf"],
  Jeans: ["photo-1542272604-787c3835535d"],
  Skincare: ["photo-1556228720-195a672e8a03"],
  Makeup: ["photo-1596462502278-27bfdc403348"],
  "Kitchen Appliances": ["photo-1556911220-bff31c812dba", "photo-1556910103-1c02745aae4d"],
  Furniture: ["photo-1555041469-a586c61ea9bc", "photo-1524758631624-e2822e304c36"],
  Sports: ["photo-1461896836934-ffe607ba8211"],
  Fitness: ["photo-1517836357463-d25dfeac3438"],
  Books: ["photo-1495446815901-a7297e633e8d", "photo-1512820790803-83ca734da794"],
  Toys: ["photo-1596464716127-f2a82984de30"],
  Grocery: ["photo-1542838132-92c53300491e", "photo-1579113800032-c38bd7635818"],
  Watches: ["photo-1523275335684-37898b6baf30"],
  Bags: ["photo-1553062407-98eeb64c6a62"],
  Wallets: ["photo-1553062407-98eeb64c6a62"],
  Sunglasses: ["photo-1572635196237-14b3f281503f"],
  "Mobile Accessories": ["photo-1511707171634-5f897ff02aa9"],
};

const image = (category: string, index: number) => {
  const pool = categoryImages[category] ?? [];
  const id = pool[index % pool.length];
  return id ? `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=80` : fallbackImage;
};

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
  const countByCategory = new Map<string, number>();

  for (const [index, row] of catalog.entries()) {
    const slug = slugify(row.name);
    const discount = [0, 10, 15, 20][index % 4];
    const finalPrice = Math.round(row.price * (1 - discount / 100));
    const categoryId = categories.find((c) => c.slug === slugify(row.category))!._id;
    const catIndex = countByCategory.get(row.category) ?? 0;
    countByCategory.set(row.category, catIndex + 1);

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
          images: [image(row.category, catIndex)],
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

  console.log(`Seeded ${catalog.length} products across ${countByCategory.size} categories.`);
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
