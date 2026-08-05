import type { Metadata } from "next";
import { Catalog } from "@/components/catalog";

export const metadata: Metadata = { title: "Search products" };

interface SearchPageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const q = params.q ?? "";
  const page = Math.max(1, Number(params.page) || 1);

  return (
    <Catalog
      basePath="/search"
      query={{ q, page }}
      title={q ? `Results for "${q}"` : "Search products"}
      subtitle={q ? "Showing matching products" : "Type a product name, brand or category"}
      emptyTitle="Coming Soon"
      emptyMessage={`No products found for "${q}". We're working on adding more — check back soon!`}
    />
  );
}
