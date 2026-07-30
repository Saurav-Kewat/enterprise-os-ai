import { Skeleton, CardSkeleton, StatCardSkeleton } from "@/components/ui/Skeleton";
import { ResponsiveGrid } from "@/components/ui/ResponsiveGrid";

export default function KnowledgeHubLoading() {
  return (
    <div className="p-6" aria-busy="true">
      <div className="space-y-1.5 mb-6">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-3.5 w-80" />
      </div>
      <ResponsiveGrid cols={4} className="mb-6">
        {Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)}
      </ResponsiveGrid>
      <CardSkeleton />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
      </div>
    </div>
  );
}
