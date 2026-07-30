import { Skeleton, CardSkeleton } from "@/components/ui/Skeleton";

export default function SettingsLoading() {
  return (
    <div className="p-6" aria-busy="true">
      <div className="space-y-1.5 mb-6">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-3.5 w-72" />
      </div>
      <div className="flex gap-8">
        <div className="hidden md:flex flex-col gap-1 w-44 shrink-0">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-8 w-full rounded-md" />)}
        </div>
        <div className="flex-1 space-y-5">
          {Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      </div>
    </div>
  );
}
