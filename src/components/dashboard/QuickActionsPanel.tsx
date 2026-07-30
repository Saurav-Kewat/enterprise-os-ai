"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileBarChart2,
  BrainCircuit,
  Upload,
  ShieldCheck,
  RefreshCw,
  Search,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { DashboardCard } from "@/components/ui/DashboardCard";
import { quickActionItems } from "@/lib/mockData";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  FileBarChart2,
  BrainCircuit,
  Upload,
  ShieldCheck,
  RefreshCw,
  Search,
};

type ActionState = "idle" | "loading" | "done";

const cardVariants = {
  hidden: { opacity: 0, scale: 0.94, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.3, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] },
  }),
};

interface QuickActionButtonProps {
  id: string;
  label: string;
  description: string;
  icon: string;
  color: string;
  index: number;
}

function QuickActionButton({ id, label, description, icon, color, index }: QuickActionButtonProps) {
  const [state, setState] = useState<ActionState>("idle");
  const Icon = iconMap[icon];

  const handleClick = () => {
    if (state !== "idle") return;
    setState("loading");
    setTimeout(() => {
      setState("done");
      setTimeout(() => setState("idle"), 2000);
    }, 1400);
  };

  return (
    <motion.button
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={state === "idle" ? { y: -2, scale: 1.01 } : {}}
      whileTap={state === "idle" ? { scale: 0.97 } : {}}
      onClick={handleClick}
      disabled={state === "loading"}
      className={cn(
        "relative w-full flex flex-col items-center gap-2.5 p-4 rounded-lg border border-border bg-card",
        "text-center transition-colors duration-200 overflow-hidden group",
        state === "idle" && "hover:border-primary/30 hover:bg-accent/50",
        state === "loading" && "opacity-80 cursor-wait",
        state === "done" && "border-success/30 bg-success/5"
      )}
      aria-label={label}
    >
      {/* Background shimmer on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center top, ${color}0d 0%, transparent 70%)`,
        }}
      />

      {/* Icon */}
      <div
        className="flex items-center justify-center w-10 h-10 rounded-xl transition-transform duration-200 group-hover:scale-105"
        style={{ backgroundColor: `${color}1a` }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {state === "loading" ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, rotate: -45 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Loader2 size={18} className="animate-spin" style={{ color }} />
            </motion.div>
          ) : state === "done" ? (
            <motion.div
              key="done"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <CheckCircle2 size={18} className="text-success" />
            </motion.div>
          ) : (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {Icon && (
                <Icon
                  size={18}
                  className="transition-colors"
                  // @ts-expect-error lucide className only; color applied via wrapper bg
                  style={{ color }}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Label */}
      <div>
        <p className="text-xs font-semibold text-foreground leading-tight">{label}</p>
        <p className="text-[11px] text-secondary mt-0.5 leading-tight">{description}</p>
      </div>

      {/* Done label */}
      <AnimatePresence>
        {state === "done" && (
          <motion.span
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-[10px] font-medium text-success"
          >
            Done
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

export function QuickActionsPanel() {
  return (
    <DashboardCard
      title="Quick Actions"
      description="Frequently used platform operations"
    >
      <div className="grid grid-cols-3 gap-2.5">
        {quickActionItems.map((item, i) => (
          <QuickActionButton key={item.id} {...item} index={i} />
        ))}
      </div>
    </DashboardCard>
  );
}
