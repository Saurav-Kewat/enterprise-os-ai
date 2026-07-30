"use client";

import { motion } from "framer-motion";
import {
  Bot, BrainCircuit, CheckCircle2, AlertTriangle,
  Zap, TrendingUp, Activity, ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// ─── Live agent status mini-row ───────────────────────────────────────────────

const LIVE_AGENTS = [
  { name: "Finance Agent",   status: "running",   color: "#0F62FE" },
  { name: "HR Agent",        status: "running",   color: "#24A148" },
  { name: "Knowledge Agent", status: "running",   color: "#F1C21B" },
  { name: "Report Agent",    status: "completed", color: "#FF7EB6" },
  { name: "Email Agent",     status: "error",     color: "#DA1E28" },
  { name: "Project Agent",   status: "idle",      color: "#8A3FFC" },
];

const statusDot: Record<string, string> = {
  running:   "bg-success",
  completed: "bg-primary",
  error:     "bg-destructive",
  idle:      "bg-secondary/40",
};

// ─── Animated token counter ───────────────────────────────────────────────────

function PulsingMetric({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <motion.p
        className="text-xl font-bold text-foreground tabular-nums"
        animate={{ opacity: [1, 0.7, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        {value}
      </motion.p>
      <p className="text-[10px] text-secondary uppercase tracking-wider">{label}</p>
    </div>
  );
}

// ─── Hero Banner ──────────────────────────────────────────────────────────────

export function DashboardHero() {
  const runningCount = LIVE_AGENTS.filter((a) => a.status === "running").length;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative mb-6 rounded-xl border border-border bg-card overflow-hidden"
    >
      {/* Subtle IBM blue top accent */}
      <div className="absolute inset-x-0 top-0 h-px bg-primary" />

      {/* Faint grid texture */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative px-6 py-5">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          {/* Left: identity */}
          <div className="flex-1">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary">
                <BrainCircuit size={18} className="text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-bold text-foreground tracking-tight">
                    EnterpriseOS AI
                  </h1>
                  <Badge variant="default" className="text-[10px] py-0 px-1.5">
                    IBM watsonx
                  </Badge>
                </div>
                <p className="text-xs text-secondary">Enterprise Intelligence Platform · Live</p>
              </div>
            </div>
            <p className="text-sm text-secondary leading-relaxed max-w-lg">
              Your enterprise AI operating system — orchestrating intelligent agents, synthesising
              executive insights, and managing your organisation's knowledge in real time.
            </p>
            <div className="flex items-center gap-3 mt-3">
              <Link href="/ai-workspace">
                <Button size="sm" className="h-7 text-xs">
                  <Zap size={12} />
                  Open AI Workspace
                  <ArrowRight size={12} />
                </Button>
              </Link>
              <Link href="/executive-reports">
                <Button variant="outline" size="sm" className="h-7 text-xs">
                  View Reports
                </Button>
              </Link>
            </div>
          </div>

          {/* Center divider */}
          <div className="hidden lg:block w-px h-16 bg-border" />

          {/* Center: live metrics */}
          <div className="hidden lg:flex items-center gap-8 px-4">
            <PulsingMetric value="12,847" label="Queries Today" />
            <PulsingMetric value="97.3%"  label="Accuracy" />
            <PulsingMetric value="1.24s"  label="Avg Latency" />
            <PulsingMetric value="$0.0024" label="Cost/Request" />
          </div>

          {/* Right divider */}
          <div className="hidden lg:block w-px h-16 bg-border" />

          {/* Right: agent status */}
          <div className="shrink-0">
            <div className="flex items-center gap-2 mb-2">
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-success"
                animate={{ opacity: [1, 0.3, 1], scale: [1, 1.3, 1] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              />
              <span className="text-xs font-medium text-success">
                {runningCount} agents running
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {LIVE_AGENTS.map((agent) => (
                <motion.div
                  key={agent.name}
                  whileHover={{ y: -1 }}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-background border border-border"
                  title={`${agent.name} — ${agent.status}`}
                >
                  <motion.div
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusDot[agent.status]}`}
                    animate={
                      agent.status === "running"
                        ? { opacity: [1, 0.3, 1] }
                        : {}
                    }
                    transition={{ duration: 1.6, repeat: Infinity }}
                  />
                  <span className="text-[11px] text-foreground font-medium">
                    {agent.name.replace(" Agent", "")}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
