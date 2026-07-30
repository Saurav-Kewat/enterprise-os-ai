"use client";

import { motion } from "framer-motion";
import { DashboardCard } from "@/components/ui/DashboardCard";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown } from "lucide-react";
import { businessMetrics } from "@/lib/mockData";
import { cn } from "@/lib/utils";

const metrics = businessMetrics;

export function BusinessOverview() {
  return (
    <DashboardCard
      title="Business Overview"
      description="Key performance metrics — last 30 days"
      headerAction={
        <Button variant="ghost" size="sm" className="text-xs text-primary">
          View Report
        </Button>
      }
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px bg-border rounded-md overflow-hidden">
        {metrics.map((metric, i) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, delay: i * 0.05, ease: "easeOut" }}
            className="bg-card px-4 py-3 flex flex-col gap-1 hover:bg-accent/40 transition-colors"
          >
            <p className="text-xs text-secondary">{metric.label}</p>
            <p className="text-base font-semibold text-foreground tabular-nums">
              {metric.value}
            </p>
            {metric.change !== 0 ? (
              <div
                className={cn(
                  "flex items-center gap-1",
                  metric.trend === "up" ? "text-success" : "text-destructive"
                )}
              >
                {metric.change > 0 ? (
                  <TrendingUp size={11} />
                ) : (
                  <TrendingDown size={11} />
                )}
                <span className="text-xs font-medium tabular-nums">
                  {metric.change > 0 ? "+" : ""}
                  {metric.change}%
                </span>
              </div>
            ) : (
              <span className="text-[11px] text-secondary/60">Stable</span>
            )}
          </motion.div>
        ))}
      </div>
    </DashboardCard>
  );
}
