import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton() {
  return (
    <div className="rounded-xl bg-white p-3">
      <Skeleton className="aspect-square rounded-lg" />
      <div className="mt-3 space-y-2">
        <Skeleton className="h-3.5 w-4/5" />
        <Skeleton className="h-3.5 w-1/2" />
      </div>
      <div className="mt-3 flex items-center justify-between">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-4 w-12 rounded-full" />
      </div>
    </div>
  );
}
