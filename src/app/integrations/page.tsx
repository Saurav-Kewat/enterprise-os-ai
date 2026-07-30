"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2, LayoutGrid, Database, MessageSquare,
  Server, Kanban, PieChart, HardDrive, ShieldCheck, Users,
  Plug, RefreshCw, Settings, Plus, CheckCircle2,
  AlertTriangle, XCircle, Loader2, Search, Activity,
  ArrowRight,
} from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { DashboardCard } from "@/components/ui/DashboardCard";
import { AnimatedStatCard } from "@/components/ui/AnimatedStatCard";
import { ResponsiveGrid } from "@/components/ui/ResponsiveGrid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { INTEGRATIONS, type Integration, type IntegrationHealth, type IntegrationCategory } from "@/lib/pagesData";
import { cn } from "@/lib/utils";

// ─── Icon map ─────────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Building2, LayoutGrid, Database, MessageSquare,
  Server, Kanban, PieChart, HardDrive, ShieldCheck, Users,
};

// ─── Status config ────────────────────────────────────────────────────────────

const HEALTH_CONFIG: Record<IntegrationHealth, {
  label: string;
  badge: "success" | "warning" | "destructive" | "secondary";
  dot: string;
  pulse: boolean;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}> = {
  healthy:      { label: "Healthy",      badge: "success",     dot: "bg-success",     pulse: false, icon: CheckCircle2 },
  degraded:     { label: "Degraded",     badge: "warning",     dot: "bg-warning",     pulse: true,  icon: AlertTriangle },
  down:         { label: "Offline",      badge: "destructive", dot: "bg-destructive", pulse: false, icon: XCircle },
  configuring:  { label: "Configuring",  badge: "secondary" as const, dot: "bg-primary",     pulse: true,  icon: Loader2 },
};

const cardVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.3, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] },
  }),
};

// ─── Integration Card ─────────────────────────────────────────────────────────

function IntegrationCard({ integration: int, index }: { integration: Integration; index: number }) {
  const Icon = ICON_MAP[int.logo] ?? Plug;
  const health = HEALTH_CONFIG[int.health];
  const HealthIcon = health.icon;

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      className={cn(
        "group bg-card border rounded-lg overflow-hidden transition-colors",
        int.health === "down" ? "border-destructive/30" : int.health === "degraded" ? "border-warning/30" : "border-border hover:border-primary/20"
      )}
    >
      <div className="h-0.5" style={{ backgroundColor: int.connected ? int.color : "#243244" }} />
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div
            className="p-2 rounded-md shrink-0"
            style={{ backgroundColor: int.connected ? `${int.color}1a` : "rgba(255,255,255,0.04)" }}
          >
            <span style={{ color: int.connected ? int.color : "#94A3B8" }}>
              <Icon size={16} />
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {health.pulse && (
              <motion.div
                className={cn("w-1.5 h-1.5 rounded-full", health.dot)}
                animate={{ opacity: [1, 0.3, 1], scale: [1, 1.3, 1] }}
                transition={{ duration: 1.6, repeat: Infinity }}
              />
            )}
            <Badge variant={health.badge} className="text-[10px] py-0 px-1.5 capitalize flex items-center gap-1">
              {int.health === "configuring"
                ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}><Loader2 size={10} /></motion.div>
                : <HealthIcon size={10} />
              }
              {health.label}
            </Badge>
          </div>
        </div>

        {/* Identity */}
        <h3 className="text-sm font-semibold text-foreground mb-0.5">{int.name}</h3>
        <p className="text-xs text-secondary mb-3 line-clamp-2 leading-relaxed">{int.description}</p>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mb-3 text-xs">
          <div>
            <p className="text-[10px] text-secondary/60">Category</p>
            <p className="font-medium text-foreground">{int.category}</p>
          </div>
          <div>
            <p className="text-[10px] text-secondary/60">Sync Frequency</p>
            <p className="font-medium text-foreground">{int.syncFreq}</p>
          </div>
          <div>
            <p className="text-[10px] text-secondary/60">Last Sync</p>
            <p className={cn("font-medium", int.health === "down" ? "text-destructive" : "text-foreground")}>
              {int.lastSync}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-secondary/60">Records</p>
            <p className="font-medium text-foreground tabular-nums">{int.records}</p>
          </div>
          {int.latency !== null && (
            <div className="col-span-2">
              <p className="text-[10px] text-secondary/60 mb-1">API Latency</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min((int.latency / 1000) * 100, 100)}%`,
                      backgroundColor: int.latency > 500 ? "#DA1E28" : int.latency > 200 ? "#F1C21B" : "#24A148",
                    }}
                  />
                </div>
                <span className={cn(
                  "text-[10px] font-semibold tabular-nums",
                  int.latency > 500 ? "text-destructive" : int.latency > 200 ? "text-warning" : "text-success"
                )}>
                  {int.latency}ms
                </span>
              </div>
            </div>
          )}
          <div className="col-span-2">
            <p className="text-[10px] text-secondary/60">Owner</p>
            <p className="font-medium text-secondary">{int.owner}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-3 border-t border-border">
          {int.connected ? (
            <>
              <Button variant="outline" size="sm" className="flex-1 h-7 text-xs">
                <Settings size={11} /> Configure
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <RefreshCw size={13} />
              </Button>
            </>
          ) : (
            <Button size="sm" className="flex-1 h-7 text-xs">
              <Plug size={11} /> Connect
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const CATEGORIES: IntegrationCategory[] = ["CRM", "ERP", "Data Warehouse", "Productivity", "Messaging", "BI", "Storage", "Security", "DevOps"];

export default function IntegrationsPage() {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState<IntegrationCategory | "all">("all");
  const [healthFilter, setHealthFilter] = useState<IntegrationHealth | "all">("all");

  const connected = INTEGRATIONS.filter((i) => i.connected).length;
  const healthy = INTEGRATIONS.filter((i) => i.health === "healthy").length;
  const issues = INTEGRATIONS.filter((i) => i.health === "degraded" || i.health === "down").length;

  const filtered = INTEGRATIONS.filter((int) => {
    if (catFilter !== "all" && int.category !== catFilter) return false;
    if (healthFilter !== "all" && int.health !== healthFilter) return false;
    if (search && !int.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const statCards = [
    { title: "Total Integrations", value: INTEGRATIONS.length, display: `${INTEGRATIONS.length}`, icon: <Plug size={14} />, trend: "up" as const },
    { title: "Connected", value: connected, display: `${connected}`, icon: <CheckCircle2 size={14} />, trend: "up" as const },
    { title: "Active Issues", value: issues, display: `${issues}`, icon: <AlertTriangle size={14} />, trend: issues > 0 ? "down" as const : "neutral" as const },
    { title: "Avg Latency", value: 128, display: "128ms", icon: <Activity size={14} />, trend: "up" as const, delta: -14.2, deltaLabel: "improved" },
  ];

  return (
    <PageContainer>
      <SectionTitle
        title="Integrations"
        description="Connected enterprise systems, APIs, and data pipelines"
        action={
          <Button size="sm">
            <Plus size={14} />
            Add Integration
          </Button>
        }
      />

      {/* KPI row */}
      <ResponsiveGrid cols={4} className="mb-6">
        {statCards.map((s) => (
          <AnimatedStatCard key={s.title} title={s.title} value={s.value} displayValue={s.display} delta={s.delta} deltaLabel={s.deltaLabel} trend={s.trend} icon={s.icon} />
        ))}
      </ResponsiveGrid>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="flex items-center gap-2 h-8 px-3 rounded-md border border-border bg-card flex-1 min-w-[160px] max-w-xs">
          <Search size={13} className="text-secondary shrink-0" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search integrations…" className="bg-transparent text-sm text-foreground placeholder:text-secondary/50 focus:outline-none flex-1" />
        </div>
        <div className="flex items-center gap-1 overflow-x-auto">
          {(["all", ...CATEGORIES] as const).map((c) => (
            <button key={c} onClick={() => setCatFilter(c)}
              className={cn("px-2.5 py-1 rounded-md text-xs font-medium border transition-colors whitespace-nowrap",
                catFilter === c ? "bg-primary/15 text-primary border-primary/30" : "bg-card text-secondary border-border hover:text-foreground"
              )}
            >{c === "all" ? "All" : c}</button>
          ))}
        </div>
        <div className="flex items-center gap-1">
          {(["all", "healthy", "degraded", "down"] as const).map((h) => (
            <button key={h} onClick={() => setHealthFilter(h)}
              className={cn("px-2.5 py-1 rounded-md text-xs font-medium border transition-colors capitalize",
                healthFilter === h ? "bg-primary/15 text-primary border-primary/30" : "bg-card text-secondary border-border hover:text-foreground"
              )}
            >{h === "all" ? "All Status" : h}</button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <AnimatePresence mode="popLayout">
        {filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-24 text-secondary">
            <Plug size={32} className="mb-3 opacity-30" />
            <p className="text-sm">No integrations match the current filters.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 xl:gap-5">
            {filtered.map((int, i) => (
              <IntegrationCard key={int.id} integration={int} index={i} />
            ))}
          </div>
        )}
      </AnimatePresence>
    </PageContainer>
  );
}
