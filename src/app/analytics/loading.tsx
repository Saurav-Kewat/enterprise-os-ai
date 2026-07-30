import { Skeleton, ChartSkeleton, StatCardSkeleton } from "@/components/ui/Skeleton";
import { ResponsiveGrid } from "@/components/ui/ResponsiveGrid";

export default function AnalyticsLoading() {
  return (
    <div className="p-6" aria-busy="true">
      <div className="space-y-1.5 mb-6">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-3.5 w-64" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {Array.from({ length: 6 }).map((_, i) => <StatCardSkeleton key={i} />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-lg p-4">
          <Skeleton className="h-4 w-32 mb-2" />
          <Skeleton className="h-3 w-48 mb-4" />
          <ChartSkeleton height={200} />
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <Skeleton className="h-4 w-36 mb-4" />
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-2.5 w-full mb-3" />)}
        </div>
      </div>
    </div>
  );
}
