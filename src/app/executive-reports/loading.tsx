import { Skeleton, CardSkeleton, StatCardSkeleton } from "@/components/ui/Skeleton";
import { ResponsiveGrid } from "@/components/ui/ResponsiveGrid";

export default function ExecutiveReportsLoading() {
  return (
    <div className="p-6" aria-busy="true">
      <div className="space-y-1.5 mb-6">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-3.5 w-72" />
      </div>
      <ResponsiveGrid cols={4} className="mb-6">
        {Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)}
      </ResponsiveGrid>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}
      </div>
    </div>
  );
}
