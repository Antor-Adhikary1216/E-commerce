import type { Metadata } from "next";
import { Catalog } from "@/components/catalog";

export const metadata: Metadata = { title: "Shop all products" };

interface ShopPageProps {
  searchParams: Promise<{ category?: string; q?: string; sort?: string; page?: string }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  return (
    <Catalog
      basePath="/shop"
      query={{ category: params.category, q: params.q, sort: params.sort, page }}
      title="Shop all products"
      subtitle="Browse the full market"
      emptyTitle="No products in this category"
      emptyMessage="Try another category or check back later."
    />
  );
}
