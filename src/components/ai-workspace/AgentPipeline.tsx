"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp, Users, FolderKanban, BookOpen,
  Mail, FileBarChart2, ArrowRight, CheckCircle2,
  Loader2, AlertTriangle, ChevronRight,
  Network, Sparkles, Database,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type NodeStatus = "running" | "idle" | "completed" | "error";

interface PipelineNode {
  id: string;
  name: string;
  shortName: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  status: NodeStatus;
  task: string;
  progress: number;
  kb: string;   // knowledge base source
}

// ─── Static pipeline data ─────────────────────────────────────────────────────

const PIPELINE: PipelineNode[] = [
  { id: "finance",  name: "Finance Agent",   shortName: "Finance",   icon: TrendingUp,    color: "#0F62FE", status: "running",   progress: 67, task: "Revenue variance analysis",   kb: "Finance KB" },
  { id: "hr",       name: "HR Agent",        shortName: "HR",        icon: Users,         color: "#24A148", status: "running",   progress: 42, task: "Headcount forecast FY2027",    kb: "HR KB" },
  { id: "project",  name: "Project Agent",   shortName: "Project",   icon: FolderKanban,  color: "#8A3FFC", status: "idle",      progress: 0,  task: "Awaiting trigger — 10:00",     kb: "Project KB" },
  { id: "knowledge",name: "Knowledge Agent", shortName: "Knowledge", icon: BookOpen,      color: "#F1C21B", status: "running",   progress: 88, task: "Vectorising 240 legal docs",   kb: "Legal KB" },
  { id: "email",    name: "Email Agent",     shortName: "Email",     icon: Mail,          color: "#DA1E28", status: "error",     progress: 0,  task: "SMTP relay timeout",           kb: "Comms KB" },
  { id: "report",   name: "Report Agent",    shortName: "Report",    icon: FileBarChart2, color: "#FF7EB6", status: "completed", progress: 100, task: "Q3 Board Report delivered",   kb: "All KBs" },
];

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CFG: Record<NodeStatus, { dot: string; badge: "success" | "warning" | "destructive" | "secondary" | "default" }> = {
  running:   { dot: "bg-success",     badge: "success" },
  idle:      { dot: "bg-secondary/40",badge: "secondary" },
  completed: { dot: "bg-primary",     badge: "default" },
  error:     { dot: "bg-destructive", badge: "destructive" },
};

// ─── Synthesis output ─────────────────────────────────────────────────────────

const SYNTHESIS_SNIPPETS = [
  "Analysing Q3 revenue variance across 3 business units…",
  "Correlating headcount changes with operational cost delta…",
  "Cross-referencing legal compliance requirements…",
  "Aggregating departmental KPIs from 4 source agents…",
  "Generating executive narrative with 94.2% confidence…",
  "✅ Q3 Board Report synthesised and delivered to 5 recipients.",
];

// ─── Single agent node ────────────────────────────────────────────────────────

function AgentNode({ node, index }: { node: PipelineNode; index: number }) {
  const Icon = node.icon;
  const cfg = STATUS_CFG[node.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.35 }}
      className={cn(
        "relative flex flex-col p-3 rounded-lg border bg-background transition-colors",
        node.status === "error"   && "border-destructive/40 bg-destructive/5",
        node.status === "running" && "border-primary/25",
        node.status === "completed" && "border-success/25 bg-success/5",
        node.status === "idle"    && "border-border",
      )}
    >
      {/* Top accent */}
      <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-lg" style={{ backgroundColor: node.status !== "idle" ? node.color : "transparent" }} />

      <div className="flex items-start justify-between mb-2">
        <div className="p-1.5 rounded-md" style={{ backgroundColor: `${node.color}1a` }}>
          <span style={{ color: node.color }}>
            <Icon size={13} />
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {node.status === "running" && (
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-success"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.6, repeat: Infinity }}
            />
          )}
          <Badge variant={cfg.badge} className="text-[9px] py-0 px-1 capitalize">
            {node.status}
          </Badge>
        </div>
      </div>

      <p className="text-xs font-semibold text-foreground mb-0.5 truncate">{node.shortName}</p>
      <p className="text-[10px] text-secondary leading-tight line-clamp-2 mb-2">{node.task}</p>

      {/* Progress */}
      {node.progress > 0 && (
        <div className="mt-auto">
          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: node.color }}
              initial={{ width: 0 }}
              animate={{ width: `${node.progress}%` }}
              transition={{ duration: 1.2, ease: "easeOut", delay: index * 0.08 + 0.3 }}
            />
          </div>
          <div className="flex items-center justify-between mt-0.5">
            <span className="text-[9px] text-secondary/60">{node.kb}</span>
            <span className="text-[9px] font-medium tabular-nums" style={{ color: node.color }}>{node.progress}%</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ─── Animated flow arrow ──────────────────────────────────────────────────────

function FlowArrow({ active }: { active: boolean }) {
  return (
    <div className="flex items-center justify-center w-4 shrink-0">
      <motion.div
        animate={active ? { x: [0, 2, 0] } : {}}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronRight size={12} className={cn("transition-colors", active ? "text-primary" : "text-border")} />
      </motion.div>
    </div>
  );
}

// ─── Synthesis panel ──────────────────────────────────────────────────────────

function SynthesisPanel() {
  const [lineIndex, setLineIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setLineIndex((p) => (p + 1) % SYNTHESIS_SNIPPETS.length);
    }, 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="mt-4 rounded-lg border border-primary/25 bg-primary/5 p-3">
      <div className="flex items-center gap-2 mb-2.5">
        <div className="flex items-center gap-1.5">
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-primary"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          />
          <span className="text-xs font-semibold text-primary">
            Supervisor · Synthesising
          </span>
        </div>
        <div className="flex-1 h-px bg-primary/20" />
        <Sparkles size={11} className="text-primary/60" />
      </div>

      <div className="font-mono text-[11px] space-y-1 min-h-[60px]">
        <AnimatePresence mode="wait">
          <motion.p
            key={lineIndex}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 6 }}
            transition={{ duration: 0.25 }}
            className={cn(
              "text-secondary",
              SYNTHESIS_SNIPPETS[lineIndex].startsWith("✅") && "text-success font-medium"
            )}
          >
            <span className="text-primary/40 mr-1.5">›</span>
            {SYNTHESIS_SNIPPETS[lineIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Source attribution */}
      <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
        <span className="text-[10px] text-secondary/60">Sources:</span>
        {["Finance KB", "HR KB", "Legal KB", "Project KB"].map((kb) => (
          <span
            key={kb}
            className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-primary/10 text-primary border border-primary/20"
          >
            <Database size={8} />
            {kb}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function AgentPipeline() {
  const runningCount = PIPELINE.filter((n) => n.status === "running").length;

  return (
    <div className="flex flex-col h-full bg-background rounded-lg border border-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-sidebar shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-md bg-primary/10">
            <Network size={15} className="text-primary" />
          </div>
          <div>
            <span className="text-sm font-semibold text-foreground">Agent Pipeline</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-success"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.6, repeat: Infinity }}
              />
              <span className="text-[11px] text-success">{runningCount} agents active</span>
            </div>
          </div>
        </div>
        <Badge variant="default" className="text-[10px]">IBM watsonx</Badge>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* Pipeline nodes — vertical stack */}
        <div className="space-y-1.5">
          {PIPELINE.map((node, i) => (
            <div key={node.id} className="relative">
              {/* Connector line above (except first) */}
              {i > 0 && (
                <div className="flex items-center gap-2 h-3 pl-5 mb-1">
                  <div className="w-px h-full bg-border mx-auto" />
                </div>
              )}
              <AgentNode node={node} index={i} />
            </div>
          ))}
        </div>

        {/* Synthesis panel */}
        <SynthesisPanel />
      </div>
    </div>
  );
}
