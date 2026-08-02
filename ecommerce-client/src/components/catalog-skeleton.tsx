import { Skeleton } from "@/components/ui/skeleton";
import { ProductCardSkeleton } from "@/components/product-card-skeleton";

export function CatalogSkeleton() {
  return (
    <main className="mx-auto max-w-[1440px] px-3 py-5">
      <header className="px-3">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="mt-2 h-3.5 w-36" />
      </header>
      <div className="my-4 flex flex-wrap items-center justify-between gap-3 px-3">
        <div className="flex gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-24 rounded-full" />
          ))}
        </div>
        <div className="flex gap-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-20 rounded-full" />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 px-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </main>
  );
}
