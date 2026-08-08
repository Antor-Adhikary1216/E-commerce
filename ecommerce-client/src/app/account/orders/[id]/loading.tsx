import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="mx-auto max-w-[1240px] px-4 py-10">
      <Skeleton className="h-4 w-32" />
      <div className="mt-6 flex items-center gap-3">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-5 w-24 rounded-full" />
      </div>
      <Skeleton className="mt-2 h-3 w-64" />

      <div className="mt-8 rounded-2xl bg-white p-5 shadow-[0_1px_4px_rgba(0,0,0,.12)]">
        <Skeleton className="h-4 w-28" />
        <div className="mt-4 flex items-center gap-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-1 flex-col items-center">
              <Skeleton className="h-7 w-7 rounded-full" />
              <Skeleton className="mt-1 h-2 w-16" />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-white p-5 shadow-[0_1px_4px_rgba(0,0,0,.12)]">
        <Skeleton className="h-4 w-28" />
        <div className="mt-4 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="h-16 w-16 shrink-0 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-48" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-white p-5 shadow-[0_1px_4px_rgba(0,0,0,.12)]">
        <Skeleton className="h-4 w-36" />
        <div className="mt-4 space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex justify-between">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-16" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
