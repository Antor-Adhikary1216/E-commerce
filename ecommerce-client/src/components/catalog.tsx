import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { fetchCatalog, fetchCategories, productBadge, type CatalogQuery } from "@/lib/catalog";
import type { ProductCardData } from "@/components/product-card";
import { ProductGrid } from "@/components/motion/product-grid";
import { EmptyState } from "@/components/empty-state";

const sortOptions = [
  { key: "", label: "Newest" },
  { key: "price_asc", label: "Price: Low to High" },
  { key: "price_desc", label: "Price: High to Low" },
  { key: "rating", label: "Top Rated" },
];

const fallbackImage = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80";

export interface CatalogProps {
  basePath: string;
  query: CatalogQuery;
  title: string;
  subtitle: string;
  emptyTitle?: string;
  emptyMessage?: string;
}

export async function Catalog({ basePath, query, title, subtitle, emptyTitle = "Nothing to show here", emptyMessage = "Try another category or check back later." }: CatalogProps) {
  const [categories, { items, pagination }] = await Promise.all([fetchCategories(), fetchCatalog(query)]);

  const activeCategory = query.category ? categories.find((c) => c.slug === query.category || c.name === query.category) : undefined;
  const heading = activeCategory?.name ?? title;
  const headingSubtitle = activeCategory ? `${activeCategory.count} product${activeCategory.count === 1 ? "" : "s"}` : subtitle;

  function href(overrides: { category?: string | null; sort?: string; page?: number }) {
    const params = new URLSearchParams();
    if (query.feature) params.set("feature", query.feature);
    const category = overrides.category !== undefined ? overrides.category : query.category;
    const sort = overrides.sort !== undefined ? overrides.sort : query.sort;
    const page = overrides.page !== undefined ? overrides.page : query.page;
    if (category) params.set("category", category);
    if (sort) params.set("sort", sort);
    if (page && page > 1) params.set("page", String(page));
    const qs = params.toString();
    return `${basePath}${qs ? `?${qs}` : ""}`;
  }

  const cards: ProductCardData[] = items.map((product) => ({
    name: product.name,
    slug: product.slug,
    price: product.price,
    finalPrice: product.finalPrice,
    rating: product.rating,
    image: product.images[0] ?? fallbackImage,
    badge: productBadge(product),
  }));

  return (
    <main className="mx-auto max-w-[1440px] px-3 py-5">
      <header className="px-3">
        <h1 className="text-2xl font-black">{heading}</h1>
        <p className="mt-1 text-[13px] text-slate-500">{headingSubtitle}</p>
      </header>

      <div className="my-4 flex flex-wrap items-center justify-between gap-3 px-3">
        <div className="flex gap-2 overflow-x-auto pb-1">
          <Link
            href={href({ category: null })}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-semibold transition ${!activeCategory ? "bg-[#1c2734] text-white" : "bg-white text-[#1c2734] hover:bg-[#e5ead9]"}`}
          >
            All
          </Link>
          {categories.map((category) => (
            <Link
              key={category._id}
              href={href({ category: category.slug })}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-semibold transition ${activeCategory?.slug === category.slug ? "bg-[#1c2734] text-white" : "bg-white text-[#1c2734] hover:bg-[#e5ead9]"}`}
            >
              {category.name}
              <span className="ml-1.5 text-[11px] opacity-60">{category.count}</span>
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-1 text-[13px]">
          {sortOptions.map((option) => (
            <Link
              key={option.key || "latest"}
              href={href({ sort: option.key || undefined })}
              className={`rounded-full px-3 py-2 font-medium transition ${(query.sort || "") === option.key ? "bg-[#e5ead9] text-[#16815d]" : "text-slate-500 hover:text-[#1c2734]"}`}
            >
              {option.label}
            </Link>
          ))}
        </div>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={<span className="text-2xl">{"{}"}</span>}
          title={emptyTitle}
          message={emptyMessage}
          action={{ href: basePath, label: "View all products" }}
        />
      ) : (
        <ProductGrid cards={cards} className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6" />
      )}

      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-8">
          <Link
            href={href({ page: pagination.page - 1 })}
            aria-label="Previous page"
            className={`inline-flex items-center rounded-full bg-white p-2 shadow-[0_1px_4px_rgba(0,0,0,.12)] ${pagination.page <= 1 ? "pointer-events-none opacity-40" : "hover:bg-[#e5ead9]"}`}
          >
            <ChevronLeft size={16} />
          </Link>
          <span className="text-[13px] font-medium text-slate-500">
            Page {pagination.page} of {pagination.pages}
          </span>
          <Link
            href={href({ page: pagination.page + 1 })}
            aria-label="Next page"
            className={`inline-flex items-center rounded-full bg-white p-2 shadow-[0_1px_4px_rgba(0,0,0,.12)] ${pagination.page >= pagination.pages ? "pointer-events-none opacity-40" : "hover:bg-[#e5ead9]"}`}
          >
            <ChevronRight size={16} />
          </Link>
        </div>
      )}
    </main>
  );
}
