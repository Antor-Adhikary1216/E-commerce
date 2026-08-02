import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="mx-auto max-w-[1240px] px-3 py-6">
      <Skeleton className="h-4 w-72" />
      <div className="mt-4 grid gap-6 md:grid-cols-2">
        <Skeleton className="aspect-square rounded-2xl" />
        <div className="space-y-4 rounded-2xl bg-white p-6 md:p-8">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-44" />
          <Skeleton className="h-20 w-full" />
          <div className="flex gap-3">
            <Skeleton className="h-11 flex-1 rounded-full" />
            <Skeleton className="h-11 w-14 rounded-full" />
          </div>
        </div>
      </div>
    </main>
  );
}
