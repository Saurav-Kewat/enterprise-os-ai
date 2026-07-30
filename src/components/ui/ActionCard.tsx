"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ActionCardProps {
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  category: string;
  onAction?: () => void;
  className?: string;
}

const priorityBadge: Record<string, "destructive" | "warning" | "secondary"> = {
  high: "destructive",
  medium: "warning",
  low: "secondary",
};

const itemVariant = {
  hidden: { opacity: 0, x: -6 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

export function ActionCard({
  title,
  description,
  priority,
  category,
  onAction,
  className,
}: ActionCardProps) {
  return (
    <motion.div
      variants={itemVariant}
      className={cn(
        "flex items-start justify-between gap-3 p-3 rounded-md border border-border bg-card hover:bg-accent transition-colors cursor-pointer group",
        className
      )}
      whileHover={{ x: 2, transition: { duration: 0.15 } }}
      onClick={onAction}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onAction?.()}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <Badge variant={priorityBadge[priority]} className="capitalize">
            {priority}
          </Badge>
          <span className="text-xs text-secondary">{category}</span>
        </div>
        <p className="text-sm font-medium text-foreground truncate">{title}</p>
        <p className="text-xs text-secondary mt-0.5 line-clamp-2">{description}</p>
      </div>
      <ArrowRight
        size={14}
        className="shrink-0 text-secondary group-hover:text-primary transition-colors mt-1"
      />
    </motion.div>
  );
}
