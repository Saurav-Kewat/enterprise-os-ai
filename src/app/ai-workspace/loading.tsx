import { Skeleton } from "@/components/ui/Skeleton";

export default function AIWorkspaceLoading() {
  return (
    <div
      className="flex gap-0 overflow-hidden"
      style={{ height: "calc(100vh - 56px)" }}
      aria-busy="true"
    >
      {/* Chat panel skeleton */}
      <div className="flex-1 flex flex-col p-4 border-r border-border gap-3">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-border bg-sidebar">
          <Skeleton className="w-8 h-8 rounded-lg" />
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-36" />
            <Skeleton className="h-2.5 w-28" />
          </div>
        </div>
        {/* Messages */}
        <div className="flex-1 space-y-4 pt-2 px-1">
          {[false, true, false, true, false].map((isUser, i) => (
            <div key={i} className={`flex items-end gap-2.5 ${isUser ? "flex-row-reverse" : ""}`}>
              <Skeleton className="w-7 h-7 rounded-full shrink-0" />
              <Skeleton className={`h-16 rounded-2xl ${isUser ? "w-3/5 rounded-br-sm" : "w-4/5 rounded-bl-sm"}`} />
            </div>
          ))}
        </div>
        {/* Input */}
        <Skeleton className="h-16 rounded-xl w-full" />
      </div>

      {/* Agent panel skeleton */}
      <div className="w-[420px] xl:w-[460px] shrink-0 flex flex-col p-4 gap-3">
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-border bg-sidebar">
          <Skeleton className="w-8 h-8 rounded-lg" />
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-40" />
            <Skeleton className="h-2.5 w-32" />
          </div>
        </div>
        <div className="flex-1 space-y-3 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-lg border border-border bg-card p-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="w-8 h-8 rounded-lg" />
                  <div className="space-y-1">
                    <Skeleton className="h-3.5 w-28" />
                    <Skeleton className="h-2.5 w-36" />
                  </div>
                </div>
                <Skeleton className="h-5 w-16 rounded" />
              </div>
              <Skeleton className="h-1.5 w-full rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
