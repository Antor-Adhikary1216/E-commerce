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
  try {
    const res = await fetch(`${apiUrl}/categories`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const data = (await res.json()) as { items: CatalogCategory[] };
    return data.items;
  } catch {
    return [];
  }
}

export async function fetchCatalog(query: CatalogQuery = {}): Promise<{ items: CatalogProduct[]; pagination: CatalogPagination }> {
  const empty = { items: [] as CatalogProduct[], pagination: { page: 1, limit: 12, total: 0, pages: 0 } };
  try {
    const params = new URLSearchParams();
    if (query.category) params.set("category", query.category);
    if (query.q) params.set("q", query.q);
    if (query.sort) params.set("sort", query.sort);
    if (query.feature) params.set("feature", query.feature);
    if (query.page && query.page > 1) params.set("page", String(query.page));
    if (query.limit) params.set("limit", String(query.limit));

    const res = await fetch(`${apiUrl}/products?${params}`, { next: { revalidate: 60 } });
    if (!res.ok) return empty;
    return (await res.json()) as { items: CatalogProduct[]; pagination: CatalogPagination };
  } catch {
    return empty;
  }
}

export async function fetchProduct(slug: string): Promise<CatalogProduct | null> {
  try {
    const res = await fetch(`${apiUrl}/products/${encodeURIComponent(slug)}`, { next: { revalidate: 120 } });
    if (res.status === 404) return null;
    if (!res.ok) return null;
    return (await res.json()) as CatalogProduct;
  } catch {
    return null;
  }
}

export function productBadge(product: CatalogProduct): string | undefined {
  if (product.bestSeller) return "Best seller";
  if (product.flashSale) return "Flash sale";
  if (product.newArrival) return "New";
  if (product.featured) return "Featured";
  return undefined;
}
