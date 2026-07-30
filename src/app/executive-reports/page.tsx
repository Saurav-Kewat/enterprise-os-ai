"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileBarChart2, Download, Eye, RefreshCw, Plus,
  CheckCircle2, Clock, AlertTriangle, Archive,
  Tag, TrendingUp, Search,
} from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AnimatedStatCard } from "@/components/ui/AnimatedStatCard";
import { ResponsiveGrid } from "@/components/ui/ResponsiveGrid";
import { ReportPreview } from "@/components/executive-reports/ReportPreview";
import { REPORTS, type Report, type ReportStatus, type ReportCategory } from "@/lib/pagesData";
import { cn } from "@/lib/utils";

// ─── Config ───────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<ReportStatus, {
  label: string; badge: "success" | "default" | "warning" | "secondary" | "destructive";
  icon: React.ComponentType<{ size?: number; className?: string }>;
}> = {
  ready:      { label: "Ready",      badge: "success",     icon: CheckCircle2 },
  generating: { label: "Generating", badge: "default",     icon: RefreshCw },
  review:     { label: "In Review",  badge: "warning",     icon: AlertTriangle },
  draft:      { label: "Draft",      badge: "secondary",   icon: Clock },
  archived:   { label: "Archived",   badge: "secondary",   icon: Archive },
};

const CATEGORY_COLORS: Record<ReportCategory, string> = {
  financial:   "#0F62FE",
  operations:  "#3DDBD9",
  compliance:  "#24A148",
  market:      "#FF7EB6",
  people:      "#F1C21B",
};

const CATEGORY_LABELS: Record<ReportCategory, string> = {
  financial:   "Financial",
  operations:  "Operations",
  compliance:  "Compliance",
  market:      "Market",
  people:      "People",
};

const cardVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.3, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] },
  }),
};

// ─── Report Card ──────────────────────────────────────────────────────────────

function ReportCard({ report, index, onPreview }: { report: Report; index: number; onPreview: (r: Report) => void }) {
  const status = STATUS_CONFIG[report.status];
  const StatusIcon = status.icon;
  const isGenerating = report.status === "generating";

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      className="group bg-card border border-border rounded-lg overflow-hidden hover:border-primary/20 transition-colors"
    >
      {/* Category accent */}
      <div className="h-0.5" style={{ backgroundColor: CATEGORY_COLORS[report.category] }} />

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div
            className="p-2 rounded-md shrink-0"
            style={{ backgroundColor: `${CATEGORY_COLORS[report.category]}1a` }}
          >
            <FileBarChart2
              size={16}
              style={{ color: CATEGORY_COLORS[report.category] } as React.CSSProperties}
            />
          </div>
          <div className="flex items-center gap-1.5">
            <Badge variant={status.badge} className="text-[10px] py-0 px-1.5 capitalize flex items-center gap-1">
              {isGenerating
                ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}>
                    <StatusIcon size={10} />
                  </motion.div>
                : <StatusIcon size={10} />
              }
              {status.label}
            </Badge>
          </div>
        </div>

        {/* Title & summary */}
        <h3 className="text-sm font-semibold text-foreground leading-snug mb-1">
          {report.title}
        </h3>
        <p className="text-xs text-secondary leading-relaxed line-clamp-2 mb-3">
          {report.summary}
        </p>

        {/* Generating progress bar */}
        {isGenerating && (
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-secondary">Synthesis progress</span>
              <span className="text-[10px] text-primary font-medium">87%</span>
            </div>
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: "87%" }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            </div>
          </div>
        )}

        {/* Confidence */}
        {report.confidence > 0 && (
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-success/60"
                style={{ width: `${report.confidence}%` }}
              />
            </div>
            <span className="text-[10px] text-secondary tabular-nums">
              {report.confidence}% confidence
            </span>
          </div>
        )}

        {/* Meta row */}
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mb-3">
          <div>
            <p className="text-[10px] text-secondary/60 uppercase tracking-wide">Updated</p>
            <p className="text-xs text-foreground">{report.updated}</p>
          </div>
          {report.pages > 0 && (
            <div>
              <p className="text-[10px] text-secondary/60 uppercase tracking-wide">Pages</p>
              <p className="text-xs text-foreground tabular-nums">{report.pages} · {report.size}</p>
            </div>
          )}
          <div>
            <p className="text-[10px] text-secondary/60 uppercase tracking-wide">Author</p>
            <p className="text-xs text-primary/80 font-medium truncate">{report.author}</p>
          </div>
          <div>
            <p className="text-[10px] text-secondary/60 uppercase tracking-wide">Recipients</p>
            <p className="text-xs text-foreground truncate">{report.recipients.join(", ")}</p>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {report.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-white/5 text-secondary border border-border"
            >
              <Tag size={9} />
              {tag}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-3 border-t border-border">
          <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => onPreview(report)}>
            <Eye size={11} />
            View
          </Button>
          {report.status === "ready" && (
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Download size={13} />
            </Button>
          )}
          {report.status === "review" && (
            <Button size="sm" className="h-7 text-xs px-3">
              <CheckCircle2 size={11} />
              Approve
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type FilterCategory = "all" | ReportCategory;
type FilterStatus = "all" | ReportStatus;

export default function ExecutiveReportsPage() {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState<FilterCategory>("all");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [previewReport, setPreviewReport] = useState<Report | null>(null);

  const filtered = REPORTS.filter((r) => {
    if (catFilter !== "all" && r.category !== catFilter) return false;
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    if (search && !r.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const statCards = [
    { title: "Total Reports", value: REPORTS.length, display: `${REPORTS.length}`, icon: <FileBarChart2 size={14} />, trend: "up" as const, delta: 3, deltaLabel: "this month" },
    { title: "Ready to Deliver", value: REPORTS.filter(r => r.status === "ready").length, display: `${REPORTS.filter(r => r.status === "ready").length}`, icon: <CheckCircle2 size={14} />, trend: "up" as const },
    { title: "Pending Review", value: REPORTS.filter(r => r.status === "review").length, display: `${REPORTS.filter(r => r.status === "review").length}`, icon: <AlertTriangle size={14} />, trend: "neutral" as const },
    { title: "Avg Confidence", value: 90.2, display: "90.2%", icon: <TrendingUp size={14} />, trend: "up" as const, delta: 2.1, deltaLabel: "vs last month" },
  ];

  const categories: { value: FilterCategory; label: string }[] = [
    { value: "all", label: "All" },
    { value: "financial", label: "Financial" },
    { value: "operations", label: "Operations" },
    { value: "compliance", label: "Compliance" },
    { value: "market", label: "Market" },
    { value: "people", label: "People" },
  ];

  const statuses: { value: FilterStatus; label: string }[] = [
    { value: "all", label: "All Status" },
    { value: "ready", label: "Ready" },
    { value: "generating", label: "Generating" },
    { value: "review", label: "In Review" },
    { value: "draft", label: "Draft" },
  ];

  return (
    <PageContainer>
      {/* Report preview modal */}
      <AnimatePresence>
        {previewReport && (
          <ReportPreview report={previewReport} onClose={() => setPreviewReport(null)} />
        )}
      </AnimatePresence>

      <SectionTitle
        title="Executive Reports"
        description="AI-synthesised strategic documents — generated, reviewed, and delivered by autonomous agents"
        action={
          <Button size="sm">
            <Plus size={14} />
            New Report
          </Button>
        }
      />

      {/* KPI row */}
      <ResponsiveGrid cols={4} className="mb-6">
        {statCards.map((s) => (
          <AnimatedStatCard
            key={s.title}
            title={s.title}
            value={s.value}
            displayValue={s.display}
            delta={s.delta}
            deltaLabel={s.deltaLabel}
            trend={s.trend}
            icon={s.icon}
          />
        ))}
      </ResponsiveGrid>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        {/* Search */}
        <div className="flex items-center gap-2 h-8 px-3 rounded-md border border-border bg-card flex-1 min-w-[180px] max-w-xs">
          <Search size={13} className="text-secondary shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reports…"
            className="bg-transparent text-sm text-foreground placeholder:text-secondary/50 focus:outline-none flex-1"
          />
        </div>
        {/* Category filter */}
        <div className="flex items-center gap-1 overflow-x-auto">
          {categories.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setCatFilter(value)}
              className={cn(
                "px-2.5 py-1 rounded-md text-xs font-medium border transition-colors whitespace-nowrap",
                catFilter === value
                  ? "bg-primary/15 text-primary border-primary/30"
                  : "bg-card text-secondary border-border hover:text-foreground"
              )}
            >
              {label}
            </button>
          ))}
        </div>
        {/* Status filter */}
        <div className="flex items-center gap-1">
          {statuses.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setStatusFilter(value)}
              className={cn(
                "px-2.5 py-1 rounded-md text-xs font-medium border transition-colors whitespace-nowrap",
                statusFilter === value
                  ? "bg-primary/15 text-primary border-primary/30"
                  : "bg-card text-secondary border-border hover:text-foreground"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <AnimatePresence mode="popLayout">
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 text-secondary"
          >
            <FileBarChart2 size={32} className="mb-3 opacity-30" />
            <p className="text-sm">No reports match the current filters.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((report, i) => (
              <ReportCard key={report.id} report={report} index={i} onPreview={setPreviewReport} />
            ))}
          </div>
        )}
      </AnimatePresence>
    </PageContainer>
  );
}

