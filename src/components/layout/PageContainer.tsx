"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  /** Override the default 24px padding (e.g. for full-bleed pages) */
  noPadding?: boolean;
}

/** Stable reference — defined outside component so it's never recreated */
const containerVariants = {
  hidden:  { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.04 },
  },
} as const;

export function PageContainer({ children, className, noPadding }: PageContainerProps) {
  return (
    <motion.div
      className={cn(
        "w-full bg-background",
        !noPadding && "p-4 md:p-6",
        className
      )}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  );
}
