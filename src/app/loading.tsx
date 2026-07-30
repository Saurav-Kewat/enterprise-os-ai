import { StatCardSkeleton, ChartSkeleton, CardSkeleton } from "@/components/ui/Skeleton";
import { ResponsiveGrid } from "@/components/ui/ResponsiveGrid";
import { Skeleton } from "@/components/ui/Skeleton";

/**
 * Root loading.tsx — shown while the dashboard page suspends.
 * Matches the exact dashboard layout so there's no layout shift.
 */
export default function DashboardLoading() {
  return (
    <div className="p-6 space-y-6" aria-busy="true" aria-label="Loading dashboard">
      {/* Page title skeleton */}
      <div className="space-y-1.5 mb-6">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-3.5 w-64" />
      </div>

      {/* Stat cards */}
      <ResponsiveGrid cols={4}>
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </ResponsiveGrid>

      {/* Business overview */}
      <CardSkeleton />

      {/* Charts row */}
      <ResponsiveGrid cols={2}>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="space-y-2 mb-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
          <ChartSkeleton height={220} />
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="space-y-2 mb-4">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-3 w-44" />
          </div>
          <ChartSkeleton height={220} />
        </div>
      </ResponsiveGrid>
    </div>
  );
}
