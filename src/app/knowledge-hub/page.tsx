"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Search, Plus, RefreshCw, Upload,
  Scale, DollarSign, Users, Megaphone, Code2,
  Database, Layers, ArrowRight, CornerDownRight,
  Sparkles, TrendingUp, Flame, Bot,
} from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { DashboardCard } from "@/components/ui/DashboardCard";
import { AnimatedStatCard } from "@/components/ui/AnimatedStatCard";
import { ResponsiveGrid } from "@/components/ui/ResponsiveGrid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NAMESPACES, RECENT_QUERIES, type KnowledgeNamespace, type NamespaceStatus } from "@/lib/pagesData";
import { cn } from "@/lib/utils";

// ─── Icon map ─────────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Scale, DollarSign, BookOpen, Users, Megaphone, Code2,
};

// ─── Trending topics ──────────────────────────────────────────────────────────

const TRENDING = [
  { topic: "GDPR data retention",       ns: "Legal", queries: 48, hot: true  },
  { topic: "Q3 budget variance",        ns: "Finance", queries: 37, hot: true  },
  { topic: "API rate limiting",         ns: "Product", queries: 31, hot: false },
  { topic: "Employee equity vesting",   ns: "HR",      queries: 24, hot: false },
  { topic: "APAC market entry regs",    ns: "Legal",   queries: 19, hot: false },
  { topic: "Cloud cost optimisation",   ns: "Eng",     queries: 17, hot: false },
];

// ─── AI Recommendations ───────────────────────────────────────────────────────

const AI_RECS = [
  { text: "47 new HR Policy documents are awaiting indexing — complete ingestion to improve HR Agent accuracy.",  action: "Index Now",  namespace: "HR Policies",   priority: "high" },
  { text: "Legal & Compliance namespace has 12 documents older than 180 days — consider refreshing for GDPR relevance.", action: "Review", namespace: "Legal", priority: "medium" },
  { text: "Finance KB queries increased 34% this week — consider expanding with Q2 board minutes.", action: "Upload", namespace: "Finance", priority: "low" },
];

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<NamespaceStatus, {
  label: string;
  badge: "success" | "warning" | "destructive" | "secondary";
  dot: string;
  pulse: boolean;
}> = {
  synced:   { label: "Synced",    badge: "success",     dot: "bg-success",     pulse: false },
  indexing: { label: "Indexing",  badge: "warning",     dot: "bg-warning",     pulse: true  },
  error:    { label: "Error",     badge: "destructive", dot: "bg-destructive", pulse: false },
  paused:   { label: "Paused",    badge: "secondary",   dot: "bg-secondary",   pulse: false },
};

const cardVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.3, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] },
  }),
};

// ─── Namespace Card ───────────────────────────────────────────────────────────

function NamespaceCard({ ns, index }: { ns: KnowledgeNamespace; index: number }) {
  const Icon = ICON_MAP[ns.icon] ?? BookOpen;
  const status = STATUS_CONFIG[ns.status];

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      className="group bg-card border border-border rounded-lg overflow-hidden hover:border-primary/20 transition-colors"
    >
      <div className="h-0.5" style={{ backgroundColor: ns.color }} />
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="p-2 rounded-md shrink-0" style={{ backgroundColor: `${ns.color}1a` }}>
            <span style={{ color: ns.color }}>
              <Icon size={16} />
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {status.pulse && (
              <motion.div
                className={cn("w-1.5 h-1.5 rounded-full", status.dot)}
                animate={{ opacity: [1, 0.3, 1], scale: [1, 1.3, 1] }}
                transition={{ duration: 1.6, repeat: Infinity }}
              />
            )}
            <Badge variant={status.badge} className="text-[10px] py-0 px-1.5">{status.label}</Badge>
          </div>
        </div>

        <h3 className="text-sm font-semibold text-foreground mb-0.5">{ns.name}</h3>
        <p className="text-xs text-secondary leading-relaxed line-clamp-2 mb-3">{ns.description}</p>

        {/* Coverage bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-secondary/60 uppercase tracking-wide">Coverage</span>
            <span className="text-[10px] font-semibold tabular-nums" style={{ color: ns.color }}>{ns.coverage}%</span>
          </div>
          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: ns.color }}
              initial={{ width: 0 }}
              animate={{ width: `${ns.coverage}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: index * 0.05 }}
            />
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mb-3 text-xs">
          <div>
            <p className="text-[10px] text-secondary/60">Documents</p>
            <p className="font-semibold text-foreground tabular-nums">{ns.docs.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-[10px] text-secondary/60">Size</p>
            <p className="font-semibold text-foreground">{ns.size}</p>
          </div>
          <div className="col-span-2">
            <p className="text-[10px] text-secondary/60">Embedding Model</p>
            <p className="font-mono text-[11px] text-secondary">{ns.embedding}</p>
          </div>
          <div className="col-span-2">
            <p className="text-[10px] text-secondary/60">Last Sync</p>
            <p className="text-foreground text-[11px]">{ns.lastSync}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-3 border-t border-border">
          <Button variant="outline" size="sm" className="flex-1 h-7 text-xs">
            <Search size={11} /> Search
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <RefreshCw size={13} />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Upload size={13} />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function KnowledgeHubPage() {
  const [query, setQuery] = useState("");

  const totalDocs = NAMESPACES.reduce((s, n) => s + n.docs, 0);
  const totalSize = "20.5 GB";

  const statCards = [
    { title: "Total Documents", value: totalDocs, display: totalDocs.toLocaleString(), icon: <BookOpen size={14} />, trend: "up" as const, delta: 8.2, deltaLabel: "this week" },
    { title: "Namespaces", value: NAMESPACES.length, display: `${NAMESPACES.length}`, icon: <Layers size={14} />, trend: "neutral" as const },
    { title: "Index Coverage", value: 95.2, display: "95.2%", icon: <Database size={14} />, trend: "up" as const, delta: 1.4 },
    { title: "Queries Today", value: 8420, display: "8,420", icon: <Search size={14} />, trend: "up" as const, delta: 12.1 },
  ];

  return (
    <PageContainer>
      <SectionTitle
        title="Knowledge Hub"
        description="Enterprise vector knowledge bases — search, ingest, and manage document namespaces"
        action={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Upload size={14} /> Upload
            </Button>
            <Button size="sm">
              <Plus size={14} /> New Namespace
            </Button>
          </div>
        }
      />

      {/* KPI row */}
      <ResponsiveGrid cols={4} className="mb-6">
        {statCards.map((s) => (
          <AnimatedStatCard
            key={s.title} title={s.title} value={s.value}
            displayValue={s.display} delta={s.delta} deltaLabel={s.deltaLabel}
            trend={s.trend} icon={s.icon}
          />
        ))}
      </ResponsiveGrid>

      {/* Global search bar + trending + AI recs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Search */}
        <div className="lg:col-span-2">
          <DashboardCard title="Semantic Search" description="Query across all namespaces simultaneously">
            <div className="flex items-center gap-3">
              <div className={cn(
                "flex items-center gap-2 flex-1 h-9 px-3 rounded-md border bg-background transition-colors",
                query ? "border-primary/40" : "border-border"
              )}>
                <Search size={14} className="text-secondary shrink-0" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask anything across all knowledge bases…"
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-secondary/50 focus:outline-none"
                />
              </div>
              <Button disabled={!query.trim()} size="sm">
                Search <ArrowRight size={13} />
              </Button>
            </div>

            {/* Recent queries */}
            <div className="mt-4">
              <p className="text-xs font-medium text-secondary mb-2">Recent Queries</p>
              <div className="space-y-1.5">
                {RECENT_QUERIES.map((q, i) => (
                  <motion.button
                    key={q.id}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.25 }}
                    onClick={() => setQuery(q.query)}
                    className="w-full flex items-center gap-3 p-2.5 rounded-md bg-background border border-border hover:border-primary/30 hover:bg-accent/40 transition-colors text-left group"
                  >
                    <CornerDownRight size={11} className="text-secondary/40 shrink-0" />
                    <span className="flex-1 text-xs text-foreground truncate">{q.query}</span>
                    <span className="text-[10px] text-secondary shrink-0">{q.namespace}</span>
                    <span className="text-[10px] text-secondary/60 shrink-0">{q.timestamp}</span>
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-[10px] font-medium text-success">{q.confidence}%</span>
                      <span className="text-[10px] text-secondary/50">{q.results} results</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </DashboardCard>
        </div>

        {/* Trending topics */}
        <DashboardCard title="Trending Topics" description="Most queried this week">
          <div className="space-y-2">
            {TRENDING.map((t, i) => (
              <motion.button
                key={t.topic}
                initial={{ opacity: 0, x: 6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setQuery(t.topic)}
                className="w-full flex items-center gap-2.5 p-2.5 rounded-md bg-background border border-border hover:border-primary/30 transition-colors text-left"
              >
                <div className="flex items-center justify-center w-5 h-5 shrink-0">
                  {t.hot
                    ? <Flame size={13} className="text-warning" />
                    : <TrendingUp size={13} className="text-secondary/50" />
                  }
                </div>
                <span className="flex-1 text-xs text-foreground truncate">{t.topic}</span>
                <Badge variant="secondary" className="text-[9px] py-0 px-1 shrink-0">{t.ns}</Badge>
                <span className="text-[10px] text-secondary tabular-nums shrink-0">{t.queries}</span>
              </motion.button>
            ))}
          </div>
        </DashboardCard>
      </div>

      {/* AI Recommendations banner */}
      <div className="mb-6">
        <DashboardCard
          title="AI Recommendations"
          description="Intelligent suggestions to improve your knowledge base coverage"
          headerAction={
            <div className="flex items-center gap-1.5">
              <Bot size={12} className="text-primary" />
              <span className="text-xs text-primary">Powered by watsonx</span>
            </div>
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {AI_RECS.map((rec, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className={cn(
                  "flex flex-col gap-2.5 p-3 rounded-lg border",
                  rec.priority === "high"   && "border-warning/30 bg-warning/5",
                  rec.priority === "medium" && "border-primary/20 bg-primary/5",
                  rec.priority === "low"    && "border-border bg-background"
                )}
              >
                <div className="flex items-center gap-2">
                  <Sparkles size={12} className={cn(
                    rec.priority === "high" ? "text-warning" : "text-primary"
                  )} />
                  <Badge variant="secondary" className="text-[9px] py-0 px-1">{rec.namespace}</Badge>
                  <Badge
                    variant={rec.priority === "high" ? "warning" : rec.priority === "medium" ? "default" : "secondary"}
                    className="text-[9px] py-0 px-1 ml-auto capitalize"
                  >
                    {rec.priority}
                  </Badge>
                </div>
                <p className="text-xs text-secondary leading-relaxed flex-1">{rec.text}</p>
                <Button variant="outline" size="sm" className="h-6 text-[11px] w-fit">
                  {rec.action}
                </Button>
              </motion.div>
            ))}
          </div>
        </DashboardCard>
      </div>

      {/* Namespace grid */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-semibold text-foreground">
          Namespaces <span className="text-secondary font-normal ml-1">({NAMESPACES.length})</span>
        </p>
        <p className="text-xs text-secondary">{totalDocs.toLocaleString()} total documents · {totalSize}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {NAMESPACES.map((ns, i) => (
          <NamespaceCard key={ns.id} ns={ns} index={i} />
        ))}
      </div>
    </PageContainer>
  );
}
