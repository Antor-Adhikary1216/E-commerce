import { Skeleton } from "@/components/ui/skeleton";
import { ProductCardSkeleton } from "@/components/product-card-skeleton";

export default function Loading() {
  return (
    <main className="mx-auto max-w-[1440px] space-y-5 py-5">
      <div className="mx-3 rounded-2xl bg-white px-3 py-5 shadow-[0_1px_4px_rgba(0,0,0,.12)]">
        <div className="mx-auto grid max-w-[1240px] grid-cols-4 gap-3 sm:grid-cols-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <Skeleton className="h-14 w-14 rounded-2xl" />
              <Skeleton className="h-3 w-14" />
            </div>
          ))}
        </div>
      </div>

      <Skeleton className="mx-3 h-[310px] rounded-2xl" />

      {[0, 1].map((row) => (
        <div key={row} className="mx-3 rounded-2xl bg-white p-2 shadow-[0_1px_4px_rgba(0,0,0,.12)]">
          <div className="flex items-center justify-between px-3 py-3">
            <div>
              <Skeleton className="h-5 w-44" />
              <Skeleton className="mt-1.5 h-3 w-64" />
            </div>
            <Skeleton className="h-8 w-24 rounded-full" />
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      ))}

      <div className="mx-3 grid gap-3 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-40 rounded-2xl" />
        ))}
      </div>
    </main>
  );
}
