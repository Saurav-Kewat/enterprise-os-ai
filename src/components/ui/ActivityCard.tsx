"use client";

import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, XCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityCardProps {
  title: string;
  description: string;
  timestamp: string;
  status: "success" | "warning" | "error" | "info";
  agent?: string;
  className?: string;
}

const statusConfig = {
  success: {
    icon: CheckCircle2,
    color: "text-success",
    bg: "bg-success/10",
    border: "border-success/20",
  },
  warning: {
    icon: AlertTriangle,
    color: "text-warning",
    bg: "bg-warning/10",
    border: "border-warning/20",
  },
  error: {
    icon: XCircle,
    color: "text-destructive",
    bg: "bg-destructive/10",
    border: "border-destructive/20",
  },
  info: {
    icon: Info,
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
  },
};

const itemVariant = {
  hidden: { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

export function ActivityCard({
  title,
  description,
  timestamp,
  status,
  agent,
  className,
}: ActivityCardProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <motion.div
      variants={itemVariant}
      className={cn(
        "flex items-start gap-3 p-3 rounded-md border border-border hover:bg-accent transition-colors",
        className
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center w-7 h-7 rounded-md shrink-0 border mt-0.5",
          config.bg,
          config.border
        )}
        aria-hidden="true"
      >
        <Icon size={14} className={config.color} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium text-foreground truncate">{title}</p>
          <span className="text-xs text-secondary/60 shrink-0 whitespace-nowrap">
            {timestamp}
          </span>
        </div>
        <p className="text-xs text-secondary mt-0.5 line-clamp-2">{description}</p>
        {agent && (
          <p className="text-xs text-secondary/60 mt-1">
            <span className="font-medium text-primary/80">{agent}</span>
          </p>
        )}
      </div>
    </motion.div>
  );
}
