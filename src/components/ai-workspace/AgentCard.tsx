"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  Users,
  FolderKanban,
  BookOpen,
  Mail,
  FileBarChart2,
  Play,
  Pause,
  RotateCcw,
  ChevronDown,
  Terminal,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { AgentData, AgentStatus } from "@/lib/aiWorkspaceData";
import { cn } from "@/lib/utils";

// ─── Icon map ─────────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  TrendingUp,
  Users,
  FolderKanban,
  BookOpen,
  Mail,
  FileBarChart2,
};

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  AgentStatus,
  { label: string; badge: "success" | "warning" | "destructive" | "secondary" | "default"; pulse: boolean }
> = {
  running: { label: "Running", badge: "success", pulse: true },
  idle: { label: "Idle", badge: "secondary", pulse: false },
  paused: { label: "Paused", badge: "warning", pulse: false },
  error: { label: "Error", badge: "destructive", pulse: false },
  completed: { label: "Completed", badge: "default", pulse: false },
};

// ─── Animated progress bar ────────────────────────────────────────────────────

interface ProgressBarProps {
  progress: number;
  color: string;
  status: AgentStatus;
}

function ProgressBar({ progress, color, status }: ProgressBarProps) {
  const isActive = status === "running";

  return (
    <div className="relative h-1.5 bg-white/5 rounded-full overflow-hidden" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
      <motion.div
        className="absolute inset-y-0 left-0 rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      />
      {/* Shimmer on active agents */}
      {isActive && progress < 100 && (
        <motion.div
          className="absolute inset-y-0 w-12 rounded-full"
          style={{
            background: `linear-gradient(90deg, transparent, ${color}60, transparent)`,
            left: `${Math.max(0, progress - 8)}%`,
          }}
          animate={{ left: [`${Math.max(0, progress - 12)}%`, `${Math.min(100, progress + 4)}%`] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </div>
  );
}

// ─── Log terminal ─────────────────────────────────────────────────────────────

const logTypeStyle = {
  info: "text-secondary",
  success: "text-success",
  warning: "text-warning",
  error: "text-destructive",
};

const logPrefix = {
  info: "INFO",
  success: " OK ",
  warning: "WARN",
  error: " ERR",
};

interface LogTerminalProps {
  logs: AgentData["logs"];
  color: string;
}

function LogTerminal({ logs, color }: LogTerminalProps) {
  return (
    <div className="mt-2 rounded-md bg-background border border-border p-2.5 font-mono space-y-1 max-h-24 overflow-y-auto">
      {logs.map((log) => (
        <motion.div
          key={log.id}
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          className="flex items-start gap-2 text-[11px] leading-snug"
        >
          <span className="text-secondary/40 shrink-0 tabular-nums">{log.timestamp}</span>
          <span
            className="shrink-0 font-bold tabular-nums"
            style={{ color: log.type === "info" ? "#94A3B8" : undefined }}
          >
            <span className={cn(logTypeStyle[log.type])}>[{logPrefix[log.type]}]</span>
          </span>
          <span className="text-secondary/80">{log.message}</span>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Agent card ───────────────────────────────────────────────────────────────

interface AgentCardProps {
  agent: AgentData;
  index: number;
  onToggle: (id: string) => void;
  onRestart: (id: string) => void;
}

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] },
  }),
};

export function AgentCard({ agent, index, onToggle, onRestart }: AgentCardProps) {
  const [logsOpen, setLogsOpen] = useState(false);
  const Icon = ICON_MAP[agent.icon];
  const statusCfg = STATUS_CONFIG[agent.status];

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      layout
      className={cn(
        "rounded-lg border bg-card overflow-hidden transition-colors",
        agent.status === "error"
          ? "border-destructive/30"
          : agent.status === "running"
          ? "border-border hover:border-primary/20"
          : "border-border"
      )}
    >
      {/* Top accent bar */}
      <div
        className="h-0.5 w-full"
        style={{ backgroundColor: agent.status === "error" ? "#DA1E28" : agent.color }}
      />

      <div className="p-3.5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2.5">
            {/* Icon */}
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${agent.color}1a` }}
            >
              {statusCfg.pulse ? (
                <motion.div
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <span style={{ color: agent.color }}>
                    {Icon && <Icon size={15} />}
                  </span>
                </motion.div>
              ) : (
                <span style={{ color: agent.color }}>
                  {Icon && <Icon size={15} />}
                </span>
              )}
            </div>

            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground leading-tight truncate">
                {agent.name}
              </p>
              <p className="text-[11px] text-secondary truncate">{agent.role}</p>
            </div>
          </div>

          {/* Status badge */}
          <div className="flex items-center gap-1.5 shrink-0">
            {statusCfg.pulse && (
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-success"
                animate={{ opacity: [1, 0.3, 1], scale: [1, 1.3, 1] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              />
            )}
            <Badge variant={statusCfg.badge} className="capitalize text-[10px] py-0 px-1.5">
              {statusCfg.label}
            </Badge>
          </div>
        </div>

        {/* Current task */}
        <p className="text-[11px] text-secondary mb-2 leading-snug line-clamp-2">
          {agent.currentTask}
        </p>

        {/* Progress */}
        <div className="mb-2.5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-secondary/60 uppercase tracking-wide">Progress</span>
            <span
              className="text-[11px] font-semibold tabular-nums"
              style={{ color: agent.color }}
            >
              {agent.progress}%
            </span>
          </div>
          <ProgressBar progress={agent.progress} color={agent.color} status={agent.status} />
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1">
            <p className="text-[10px] text-secondary/60">Tasks done</p>
            <p className="text-xs font-semibold text-foreground tabular-nums">{agent.tasksCompleted.toLocaleString()}</p>
          </div>
          <div className="flex-1">
            <p className="text-[10px] text-secondary/60">Tokens used</p>
            <p className="text-xs font-semibold text-foreground tabular-nums">
              {agent.tokensUsed >= 1000000
                ? `${(agent.tokensUsed / 1000000).toFixed(1)}M`
                : `${(agent.tokensUsed / 1000).toFixed(0)}k`}
            </p>
          </div>
          <div className="flex-1">
            <p className="text-[10px] text-secondary/60">Model</p>
            <p className="text-[11px] font-medium text-secondary truncate">{agent.model.split("/").pop()}</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5">
          {agent.status === "running" ? (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 h-7 text-xs"
              onClick={() => onToggle(agent.id)}
            >
              <Pause size={11} />
              Pause
            </Button>
          ) : agent.status === "error" ? (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 h-7 text-xs border-destructive/30 text-destructive hover:bg-destructive/10"
              onClick={() => onRestart(agent.id)}
            >
              <RotateCcw size={11} />
              Restart
            </Button>
          ) : agent.status === "completed" ? (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 h-7 text-xs"
              onClick={() => onRestart(agent.id)}
            >
              <Zap size={11} />
              Re-run
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 h-7 text-xs"
              onClick={() => onToggle(agent.id)}
            >
              <Play size={11} />
              Start
            </Button>
          )}

          {/* Logs toggle */}
          <button
            onClick={() => setLogsOpen((p) => !p)}
            className={cn(
              "flex items-center gap-1 px-2 h-7 rounded-md border text-[11px] transition-colors",
              logsOpen
                ? "border-primary/30 bg-primary/10 text-primary"
                : "border-border text-secondary hover:text-foreground"
            )}
            aria-expanded={logsOpen}
            aria-label="Toggle logs"
          >
            <Terminal size={11} />
            <ChevronDown
              size={11}
              className={cn("transition-transform duration-200", logsOpen && "rotate-180")}
            />
          </button>
        </div>

        {/* Expandable log terminal */}
        <AnimatePresence initial={false}>
          {logsOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              style={{ overflow: "hidden" }}
            >
              <LogTerminal logs={agent.logs} color={agent.color} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
