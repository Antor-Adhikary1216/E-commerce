import type { ProductCardData } from "@/components/product-card";

export interface CatalogCategory {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  count: number;
}

export function toCard(product: CatalogProduct): ProductCardData {
  return {
    name: product.name,
    slug: product.slug,
    price: product.price,
    finalPrice: product.finalPrice,
    rating: product.rating,
    image: product.images[0] ?? "",
    badge: productBadge(product),
  };
}

export interface CatalogProduct {
  _id: string;
  name: string;
  slug: string;
  brand: string;
  price: number;
  discount: number;
  finalPrice: number;
  rating: number;
  reviewCount: number;
  images: string[];
  category: { _id: string; name: string; slug: string };
  description: string;
  shortDescription: string;
  colors: string[];
  sizes: string[];
  featured: boolean;
  bestSeller: boolean;
  flashSale: boolean;
  newArrival: boolean;
}

export interface CatalogPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface CatalogQuery {
  category?: string;
  q?: string;
  sort?: string;
  feature?: string;
  page?: number;
  limit?: number;
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function fetchCategories(): Promise<CatalogCategory[]> {
  const res = await fetch(`${apiUrl}/categories`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Categories request failed (${res.status})`);
  const data = (await res.json()) as { items: CatalogCategory[] };
  return data.items;
}

export async function fetchCatalog(query: CatalogQuery = {}): Promise<{ items: CatalogProduct[]; pagination: CatalogPagination }> {
  const params = new URLSearchParams();
  if (query.category) params.set("category", query.category);
  if (query.q) params.set("q", query.q);
  if (query.sort) params.set("sort", query.sort);
  if (query.feature) params.set("feature", query.feature);
  if (query.page && query.page > 1) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));

  const res = await fetch(`${apiUrl}/products?${params}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Products request failed (${res.status})`);
  return (await res.json()) as { items: CatalogProduct[]; pagination: CatalogPagination };
}

export async function fetchProduct(slug: string): Promise<CatalogProduct | null> {
  const res = await fetch(`${apiUrl}/products/${encodeURIComponent(slug)}`, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Product request failed (${res.status})`);
  return (await res.json()) as CatalogProduct;
}

export function productBadge(product: CatalogProduct): string | undefined {
  if (product.bestSeller) return "Best seller";
  if (product.flashSale) return "Flash sale";
  if (product.newArrival) return "New";
  if (product.featured) return "Featured";
  return undefined;
}
