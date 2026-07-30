"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log error to error reporting service in production
    console.error("[EnterpriseOS Error]", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="max-w-md"
      >
        {/* Icon */}
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-destructive/10 border border-destructive/20 mx-auto mb-6">
          <AlertTriangle size={28} className="text-destructive" />
        </div>

        {/* Heading */}
        <h1 className="text-xl font-semibold text-foreground mb-2">
          Something went wrong
        </h1>
        <p className="text-sm text-secondary leading-relaxed mb-2">
          An unexpected error occurred in this part of the platform.
          The error has been logged automatically.
        </p>
        {error.digest && (
          <p className="text-xs text-secondary/50 font-mono mb-6">
            Error ID: {error.digest}
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center justify-center gap-3">
          <Button onClick={reset} size="sm">
            <RefreshCw size={14} />
            Try again
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/">
              <Home size={14} />
              Dashboard
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
