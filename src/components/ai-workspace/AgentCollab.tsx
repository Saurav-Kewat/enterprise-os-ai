"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Network,
  RefreshCw,
  SortAsc,
  Filter,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AgentCard } from "./AgentCard";
import { INITIAL_AGENTS, type AgentData, type AgentStatus } from "@/lib/aiWorkspaceData";
import { cn } from "@/lib/utils";

// ─── Progress simulation hook ────────────────────────────────────────────────

function useAgentSimulation(agents: AgentData[], setAgents: React.Dispatch<React.SetStateAction<AgentData[]>>) {
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    tickRef.current = setInterval(() => {
      setAgents((prev) =>
        prev.map((agent) => {
          if (agent.status !== "running") return agent;

          // Advance progress
          const newProgress = Math.min(agent.progress + (1 + Math.random() * 2), 100);
          const justCompleted = newProgress >= 100 && agent.progress < 100;

          if (justCompleted) {
            return {
              ...agent,
              progress: 100,
              status: "completed" as AgentStatus,
              currentTask: `✅ Completed — ${agent.currentTask.replace(/^Analysing|^Generating|^Vectorising|^Processing/, "Finished")}`,
              logs: [
                ...agent.logs,
                {
                  id: `${agent.id}-done-${Date.now()}`,
                  timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }),
                  message: "Task completed successfully",
                  type: "success" as const,
                },
              ],
            };
          }

          return { ...agent, progress: Math.round(newProgress) };
        })
      );
    }, 2000);

    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [setAgents]);
}

// ─── Collaboration feed ───────────────────────────────────────────────────────

interface CollabEvent {
  id: string;
  from: string;
  to: string;
  message: string;
  time: string;
  color: string;
}

const COLLAB_SEED: CollabEvent[] = [
  {
    id: "c1",
    from: "Finance Agent",
    to: "Executive Report Agent",
    message: "Forwarding Q3 revenue variance data",
    time: "09:13:50",
    color: "#0F62FE",
  },
  {
    id: "c2",
    from: "Knowledge Agent",
    to: "Finance Agent",
    message: "Retrieved 12 relevant compliance docs",
    time: "09:12:05",
    color: "#F1C21B",
  },
  {
    id: "c3",
    from: "HR Agent",
    to: "Executive Report Agent",
    message: "Headcount summary ready for inclusion",
    time: "09:11:22",
    color: "#24A148",
  },
];

function CollabFeed({ agents }: { agents: AgentData[] }) {
  const [events, setEvents] = useState<CollabEvent[]>(COLLAB_SEED);

  useEffect(() => {
    const names = agents.filter((a) => a.status === "running").map((a) => a.name);
    if (names.length < 2) return;

    const interval = setInterval(() => {
      const fromAgent = agents[Math.floor(Math.random() * agents.length)];
      const toAgent = agents.filter((a) => a.id !== fromAgent.id)[
        Math.floor(Math.random() * (agents.length - 1))
      ];
      const messages = [
        "Forwarding updated data payload",
        "Requesting knowledge base query",
        "Sharing intermediate analysis",
        "Dispatching task result",
        "Awaiting confirmation signal",
      ];
      const newEvent: CollabEvent = {
        id: `c-${Date.now()}`,
        from: fromAgent.name,
        to: toAgent.name,
        message: messages[Math.floor(Math.random() * messages.length)],
        time: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }),
        color: fromAgent.color,
      };
      setEvents((prev) => [newEvent, ...prev].slice(0, 6));
    }, 4500);

    return () => clearInterval(interval);
  }, [agents]);

  return (
    <div className="space-y-1.5">
      <AnimatePresence mode="popLayout">
        {events.map((evt) => (
          <motion.div
            key={evt.id}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="flex items-start gap-2 px-3 py-2 rounded-md bg-background border border-border text-[11px]"
          >
            <div
              className="w-1.5 h-1.5 rounded-full mt-1 shrink-0"
              style={{ backgroundColor: evt.color }}
            />
            <div className="flex-1 min-w-0">
              <span className="font-medium text-foreground">{evt.from}</span>
              <span className="text-secondary mx-1">→</span>
              <span className="font-medium text-foreground">{evt.to}</span>
              <p className="text-secondary mt-0.5 truncate">{evt.message}</p>
            </div>
            <span className="text-secondary/50 shrink-0 tabular-nums">{evt.time}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ─── Main panel ───────────────────────────────────────────────────────────────

type SortOption = "default" | "status" | "progress";
type FilterOption = "all" | AgentStatus;

const STATUS_ORDER: Record<AgentStatus, number> = {
  running: 0,
  error: 1,
  paused: 2,
  idle: 3,
  completed: 4,
};

export function AgentCollab() {
  const [agents, setAgents] = useState<AgentData[]>(INITIAL_AGENTS);
  const [sort, setSort] = useState<SortOption>("default");
  const [filter, setFilter] = useState<FilterOption>("all");
  const [showCollab, setShowCollab] = useState(true);

  useAgentSimulation(agents, setAgents);

  const toggleAgent = (id: string) => {
    setAgents((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a;
        if (a.status === "running") return { ...a, status: "paused" as AgentStatus };
        if (a.status === "paused" || a.status === "idle") return { ...a, status: "running" as AgentStatus };
        return a;
      })
    );
  };

  const restartAgent = (id: string) => {
    const original = INITIAL_AGENTS.find((a) => a.id === id);
    if (!original) return;
    setAgents((prev) =>
      prev.map((a) =>
        a.id === id ? { ...original, status: "running" as AgentStatus, progress: 0 } : a
      )
    );
  };

  const filteredSorted = agents
    .filter((a) => filter === "all" || a.status === filter)
    .sort((a, b) => {
      if (sort === "status") return STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
      if (sort === "progress") return b.progress - a.progress;
      return 0;
    });

  const runningCount = agents.filter((a) => a.status === "running").length;
  const errorCount = agents.filter((a) => a.status === "error").length;
  const completedCount = agents.filter((a) => a.status === "completed").length;

  return (
    <div className="flex flex-col h-full bg-background rounded-lg border border-border overflow-hidden">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-sidebar shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Network size={16} className="text-primary" />
          </div>
          <div>
            <span className="text-sm font-semibold text-foreground">Agent Collaboration</span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[11px] text-success font-medium">{runningCount} running</span>
              {errorCount > 0 && (
                <span className="text-[11px] text-destructive font-medium">{errorCount} error</span>
              )}
              {completedCount > 0 && (
                <span className="text-[11px] text-secondary">{completedCount} done</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Sort */}
          <button
            onClick={() => setSort((s) => s === "default" ? "status" : s === "status" ? "progress" : "default")}
            className={cn(
              "flex items-center gap-1 px-2 h-7 rounded-md border text-[11px] transition-colors",
              sort !== "default"
                ? "border-primary/30 bg-primary/10 text-primary"
                : "border-border text-secondary hover:text-foreground"
            )}
            aria-label="Sort agents"
          >
            <SortAsc size={11} />
            {sort === "default" ? "Sort" : sort === "status" ? "Status" : "Progress"}
          </button>

          {/* Filter */}
          <button
            onClick={() => {
              const opts: FilterOption[] = ["all", "running", "idle", "error", "completed"];
              const idx = opts.indexOf(filter);
              setFilter(opts[(idx + 1) % opts.length]);
            }}
            className={cn(
              "flex items-center gap-1 px-2 h-7 rounded-md border text-[11px] transition-colors capitalize",
              filter !== "all"
                ? "border-primary/30 bg-primary/10 text-primary"
                : "border-border text-secondary hover:text-foreground"
            )}
            aria-label="Filter agents"
          >
            <Filter size={11} />
            {filter === "all" ? "Filter" : filter}
          </button>
        </div>
      </div>

      {/* ── Scrollable body ───────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {filteredSorted.map((agent, i) => (
          <AgentCard
            key={agent.id}
            agent={agent}
            index={i}
            onToggle={toggleAgent}
            onRestart={restartAgent}
          />
        ))}

        {filteredSorted.length === 0 && (
          <div className="flex items-center justify-center h-32">
            <p className="text-sm text-secondary">No agents match the current filter</p>
          </div>
        )}

        {/* ── Collaboration feed ─────────────────────────────────────────── */}
        <div className="mt-1">
          <button
            className="flex items-center gap-2 mb-2 w-full"
            onClick={() => setShowCollab((p) => !p)}
          >
            <Activity size={12} className="text-secondary" />
            <span className="text-xs font-medium text-secondary">Inter-Agent Communication</span>
            <div className="flex-1 h-px bg-border" />
            <motion.div
              animate={{ rotate: showCollab ? 0 : -90 }}
              transition={{ duration: 0.2 }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-secondary" />
              </svg>
            </motion.div>
          </button>

          <AnimatePresence initial={false}>
            {showCollab && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22 }}
                style={{ overflow: "hidden" }}
              >
                <CollabFeed agents={agents} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
