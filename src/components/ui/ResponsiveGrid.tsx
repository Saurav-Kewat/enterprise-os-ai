"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ResponsiveGridProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4;
  className?: string;
}

const colsMap = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
};

export function ResponsiveGrid({ children, cols = 4, className }: ResponsiveGridProps) {
  return (
    <div className={cn("grid gap-4", colsMap[cols], className)}>
      {children}
    </div>
  );
}
