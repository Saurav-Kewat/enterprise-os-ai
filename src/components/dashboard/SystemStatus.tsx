"use client";

import { motion } from "framer-motion";
import { DashboardCard } from "@/components/ui/DashboardCard";
import { cn } from "@/lib/utils";
import { systemServices as services } from "@/lib/mockData";

const statusConfig = {
  operational: { label: "Operational", color: "bg-success", text: "text-success" },
  degraded: { label: "Degraded", color: "bg-warning", text: "text-warning" },
  down: { label: "Down", color: "bg-destructive", text: "text-destructive" },
};

export function SystemStatus() {
  const operationalCount = services.filter((s) => s.status === "operational").length;

  return (
    <DashboardCard
      title="System Status"
      description={`${operationalCount}/${services.length} services operational`}
    >
      <div className="space-y-3">
        {services.map((service, i) => {
          const config = statusConfig[service.status];
          // latency bar — max scale at 1000ms
          const latencyPct = service.latency
            ? Math.min((service.latency / 1000) * 100, 100)
            : 0;
          const barColor =
            service.status === "operational"
              ? service.latency! < 200
                ? "#24A148"
                : "#F1C21B"
              : "#DA1E28";

          return (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06, duration: 0.28, ease: "easeOut" }}
              className="space-y-1.5"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className={cn(
                      "w-1.5 h-1.5 rounded-full shrink-0",
                      service.status === "degraded" ? "bg-warning animate-pulse" : config.color
                    )}
                    aria-hidden="true"
                  />
                  <span className="text-xs text-foreground truncate">{service.name}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {service.latency !== undefined && (
                    <span className="text-xs text-secondary tabular-nums">
                      {service.latency}ms
                    </span>
                  )}
                  <span className={cn("text-xs font-medium", config.text)}>
                    {config.label}
                  </span>
                </div>
              </div>
              {/* Latency bar */}
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${latencyPct}%` }}
                  transition={{ delay: i * 0.06 + 0.2, duration: 0.5, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: barColor, opacity: 0.7 }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </DashboardCard>
  );
}
