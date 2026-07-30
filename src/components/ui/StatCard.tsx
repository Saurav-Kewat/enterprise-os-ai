"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  delta?: number;
  deltaLabel?: string;
  icon?: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  className?: string;
}

const itemVariant = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

const TrendIcon = {
  up: TrendingUp,
  down: TrendingDown,
  neutral: Minus,
};

const trendColor = {
  up: "text-success",
  down: "text-destructive",
  neutral: "text-secondary",
};

export function StatCard({
  title,
  value,
  delta,
  deltaLabel,
  icon,
  trend = "neutral",
  className,
}: StatCardProps) {
  const Icon = TrendIcon[trend];

  return (
    <motion.div
      variants={itemVariant}
      className={cn(
        "bg-card border border-border rounded-lg p-4 flex flex-col gap-3 hover:border-border/80 transition-colors",
        className
      )}
      whileHover={{ y: -1, transition: { duration: 0.15 } }}
      role="article"
    >
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium text-secondary uppercase tracking-wider">{title}</p>
        {icon && (
          <div className="p-1.5 rounded-md bg-primary/10 text-primary">{icon}</div>
        )}
      </div>
      <div>
        <p className="text-2xl font-semibold text-foreground tabular-nums">{value}</p>
        {(delta !== undefined || deltaLabel) && (
          <div className={cn("flex items-center gap-1 mt-1", trendColor[trend])}>
            <Icon size={12} />
            {delta !== undefined && (
              <span className="text-xs font-medium">
                {delta >= 0 ? "+" : ""}
                {delta}%
              </span>
            )}
            {deltaLabel && (
              <span className="text-xs text-secondary">{deltaLabel}</span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
