import Link from "next/link";
import { motion } from "framer-motion";
import { FileQuestion, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = { title: "404 — Page Not Found" };

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-8 text-center">
      <div className="max-w-sm">
        {/* Status code */}
        <p className="text-8xl font-bold text-primary/20 select-none mb-2 leading-none">
          404
        </p>

        {/* Icon */}
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 mx-auto mb-6">
          <FileQuestion size={24} className="text-primary" />
        </div>

        <h1 className="text-lg font-semibold text-foreground mb-2">
          Page not found
        </h1>
        <p className="text-sm text-secondary leading-relaxed mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Use the navigation on the left to find what you need.
        </p>

        <div className="flex items-center justify-center gap-3">
          <Button asChild size="sm">
            <Link href="/">
              <Home size={14} />
              Go to Dashboard
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/ai-workspace">
              <ArrowLeft size={14} />
              AI Workspace
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
