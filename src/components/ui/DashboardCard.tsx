"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  headerAction?: React.ReactNode;
}

const itemVariant = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

export function DashboardCard({
  title,
  description,
  children,
  className,
  headerAction,
}: DashboardCardProps) {
  return (
    <motion.div
      variants={itemVariant}
      className={cn(
        "bg-card border border-border rounded-lg overflow-hidden",
        className
      )}
      whileHover={{ borderColor: "rgba(36,50,68,0.9)", transition: { duration: 0.15 } }}
    >
      {(title || headerAction) && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div>
            {title && (
              <h3 className="text-sm font-semibold text-foreground">{title}</h3>
            )}
            {description && (
              <p className="text-xs text-secondary mt-0.5">{description}</p>
            )}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className="p-4">{children}</div>
    </motion.div>
  );
}
