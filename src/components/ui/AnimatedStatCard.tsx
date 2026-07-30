"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnimatedStatCardProps {
  title: string;
  value: number;
  displayValue: string;
  delta?: number;
  deltaLabel?: string;
  trend?: "up" | "down" | "neutral";
  icon: React.ReactNode;
  suffix?: string;
  className?: string;
}

function useCountUp(target: number, duration: number = 1500) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  useEffect(() => {
    if (!inView) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // ease-out-quart
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else setCount(target);
    };
    requestAnimationFrame(step);
  }, [inView, target, duration]);

  return { count, ref };
}

const trendConfig = {
  up: { Icon: TrendingUp, color: "text-success" },
  down: { Icon: TrendingDown, color: "text-destructive" },
  neutral: { Icon: Minus, color: "text-secondary" },
};

const cardVariant = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

export function AnimatedStatCard({
  title,
  value,
  displayValue,
  delta,
  deltaLabel,
  trend = "neutral",
  icon,
  suffix = "",
  className,
}: AnimatedStatCardProps) {
  const { count, ref } = useCountUp(value);
  const { Icon, color } = trendConfig[trend];

  // Format the animated value to match the display format
  const formatAnimated = (n: number) => {
    if (suffix === "%") return n.toFixed(1) + "%";
    if (suffix === "s") return n.toFixed(2) + "s";
    if (n >= 1000) return Math.round(n).toLocaleString();
    return Math.round(n).toString();
  };

  return (
    <motion.div
      variants={cardVariant}
      className={cn(
        "relative bg-card border border-border rounded-lg p-4 overflow-hidden group",
        className
      )}
      whileHover={{
        y: -2,
        borderColor: "#0F62FE40",
        transition: { duration: 0.2 },
      }}
      role="article"
      aria-label={`${title}: ${displayValue}`}
    >
      {/* Subtle top accent on hover */}
      <div className="absolute inset-x-0 top-0 h-px bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-medium text-secondary uppercase tracking-wider leading-tight">
          {title}
        </p>
        <div className="p-1.5 rounded-md bg-primary/10 text-primary shrink-0">
          {icon}
        </div>
      </div>

      <div className="space-y-1">
        <p ref={ref} className="text-2xl font-semibold text-foreground tabular-nums">
          {formatAnimated(count)}
        </p>

        {(delta !== undefined || deltaLabel) && (
          <div className={cn("flex items-center gap-1", color)}>
            <Icon size={11} className="shrink-0" />
            {delta !== undefined && (
              <span className="text-xs font-medium tabular-nums">
                {delta > 0 ? "+" : ""}
                {Math.abs(delta)}%
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
