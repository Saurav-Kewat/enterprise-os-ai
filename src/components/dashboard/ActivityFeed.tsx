"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  ChevronDown,
  Filter,
} from "lucide-react";
import { DashboardCard } from "@/components/ui/DashboardCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { activityFeed } from "@/lib/mockData";
import { cn } from "@/lib/utils";

type StatusFilter = "all" | "success" | "warning" | "error" | "info";

const statusConfig = {
  success: {
    Icon: CheckCircle2,
    iconColor: "text-success",
    bg: "bg-success/10",
    border: "border-success/20",
    badge: "success" as const,
  },
  warning: {
    Icon: AlertTriangle,
    iconColor: "text-warning",
    bg: "bg-warning/10",
    border: "border-warning/20",
    badge: "warning" as const,
  },
  error: {
    Icon: XCircle,
    iconColor: "text-destructive",
    bg: "bg-destructive/10",
    border: "border-destructive/20",
    badge: "destructive" as const,
  },
  info: {
    Icon: Info,
    iconColor: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
    badge: "default" as const,
  },
};

const filters: { label: string; value: StatusFilter }[] = [
  { label: "All", value: "all" },
  { label: "Success", value: "success" },
  { label: "Warning", value: "warning" },
  { label: "Error", value: "error" },
  { label: "Info", value: "info" },
];

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.28, delay: i * 0.04, ease: "easeOut" },
  }),
  exit: { opacity: 0, x: 10, transition: { duration: 0.15 } },
};

interface ActivityItemProps {
  item: (typeof activityFeed)[0];
  index: number;
  expanded: boolean;
  onToggle: () => void;
}

function ActivityItem({ item, index, expanded, onToggle }: ActivityItemProps) {
  const config = statusConfig[item.status];
  const { Icon } = config;

  return (
    <motion.div
      custom={index}
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
      className="group"
    >
      <button
        className="w-full text-left flex items-start gap-3 p-3 rounded-md border border-transparent hover:border-border hover:bg-accent/50 transition-all duration-150"
        onClick={onToggle}
        aria-expanded={expanded}
      >
        {/* Status icon */}
        <div
          className={cn(
            "flex items-center justify-center w-7 h-7 rounded-md shrink-0 border mt-0.5",
            config.bg,
            config.border
          )}
        >
          <Icon size={13} className={config.iconColor} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-medium text-foreground leading-snug">{item.title}</p>
            <span className="text-xs text-secondary/60 shrink-0 whitespace-nowrap mt-0.5">
              {item.timestamp}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary" className="text-xs py-0 px-1.5">
              {item.category}
            </Badge>
            {item.agent && (
              <span className="text-xs text-primary/70 font-medium truncate">
                {item.agent}
              </span>
            )}
          </div>

          {/* Expandable description */}
          <AnimatePresence initial={false}>
            {expanded && (
              <motion.p
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="text-xs text-secondary mt-1.5 overflow-hidden"
              >
                {item.description}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <ChevronDown
          size={14}
          className={cn(
            "shrink-0 text-secondary/40 mt-1 transition-transform duration-200",
            expanded && "rotate-180"
          )}
        />
      </button>
    </motion.div>
  );
}

export function ActivityFeed() {
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const filtered =
    filter === "all" ? activityFeed : activityFeed.filter((a) => a.status === filter);
  const visible = showAll ? filtered : filtered.slice(0, 5);

  const counts = {
    success: activityFeed.filter((a) => a.status === "success").length,
    warning: activityFeed.filter((a) => a.status === "warning").length,
    error: activityFeed.filter((a) => a.status === "error").length,
    info: activityFeed.filter((a) => a.status === "info").length,
  };

  return (
    <DashboardCard
      title="Activity Feed"
      description="Real-time events across all platform services"
      headerAction={
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
          <span className="text-xs text-secondary">Live</span>
        </div>
      }
    >
      {/* Status summary pills */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        {filters.map(({ label, value }) => {
          const count = value === "all" ? activityFeed.length : counts[value as keyof typeof counts];
          const isActive = filter === value;
          return (
            <button
              key={value}
              onClick={() => { setFilter(value); setExpandedId(null); }}
              className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors",
                isActive
                  ? "bg-primary/15 text-primary border border-primary/30"
                  : "bg-card text-secondary border border-border hover:text-foreground hover:border-border/80"
              )}
            >
              {label}
              {count > 0 && (
                <span
                  className={cn(
                    "w-4 h-4 rounded flex items-center justify-center text-[10px] font-bold",
                    isActive ? "bg-primary/20 text-primary" : "bg-white/5 text-secondary/60"
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Feed items */}
      <div className="space-y-0.5">
        <AnimatePresence mode="popLayout">
          {visible.length === 0 ? (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-secondary text-center py-8"
            >
              No {filter} events
            </motion.p>
          ) : (
            visible.map((item, i) => (
              <ActivityItem
                key={item.id}
                item={item}
                index={i}
                expanded={expandedId === item.id}
                onToggle={() =>
                  setExpandedId((prev) => (prev === item.id ? null : item.id))
                }
              />
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Show more / less */}
      {filtered.length > 5 && (
        <div className="mt-3 pt-3 border-t border-border text-center">
          <button
            onClick={() => setShowAll((p) => !p)}
            className="text-xs text-primary hover:underline"
          >
            {showAll
              ? "Show less"
              : `Show ${filtered.length - 5} more events`}
          </button>
        </div>
      )}
    </DashboardCard>
  );
}
