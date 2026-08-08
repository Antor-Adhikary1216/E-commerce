import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="mx-auto max-w-[1240px] px-4 py-10">
      <div className="mx-auto max-w-lg text-center">
        <Skeleton className="mx-auto h-16 w-16 rounded-full" />
        <Skeleton className="mx-auto mt-4 h-6 w-64" />
        <Skeleton className="mx-auto mt-2 h-4 w-80" />
        <Skeleton className="mx-auto mt-2 h-4 w-48" />
        <Skeleton className="mx-auto mt-6 h-12 w-48 rounded-full" />
      </div>
    </main>
  );
}
