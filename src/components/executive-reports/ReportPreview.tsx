"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Download, Share2, CheckCircle2, AlertTriangle,
  TrendingUp, TrendingDown, FileText, BarChart3,
  Users, Target, ArrowRight, Sparkles, Bot,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Report } from "@/lib/pagesData";
import { cn } from "@/lib/utils";

// ─── Mock report content (for Q3 Financial Overview) ─────────────────────────

const EXEC_SUMMARY = `EnterpriseOS AI has analysed Q3 2026 financial performance across all business units. 
Revenue of **$8.2M** exceeded the forecast by **12.4%**, driven primarily by the Enterprise SaaS segment 
(+18.7%). Operating costs increased by **2.1%**, resulting in a net margin improvement of **310bps** 
year-over-year. EBITDA stands at **$5.1M**, up from $4.4M in Q3 2025.`;

const DEPT_INSIGHTS = [
  { dept: "Enterprise SaaS",  revenue: "$3.8M", vs: "+18.7%", status: "up"   },
  { dept: "Professional Services", revenue: "$2.1M", vs: "+4.2%",  status: "up"   },
  { dept: "Support & Maintenance", revenue: "$1.4M", vs: "-1.8%",  status: "down" },
  { dept: "Consulting",       revenue: "$0.9M", vs: "+8.1%",  status: "up"   },
];

const RECOMMENDATIONS = [
  "Accelerate Enterprise SaaS sales motion — current momentum exceeds forecast by 18%.",
  "Review Support & Maintenance pricing model to address 1.8% revenue decline.",
  "Expand Professional Services headcount to capture growing demand (+4.2%).",
];

const RISKS = [
  { risk: "APAC expansion costs may impact Q4 margins by $0.3–0.6M.", severity: "medium" },
  { risk: "Salesforce integration degradation could affect pipeline visibility.", severity: "high" },
];

// ─── Types ────────────────────────────────────────────────────────────────────

interface ReportPreviewProps {
  report: Report;
  onClose: () => void;
}

// ─── Mini metric card inside preview ─────────────────────────────────────────

function PreviewMetric({ label, value, change }: { label: string; value: string; change: string }) {
  const isPos = change.startsWith("+");
  return (
    <div className="bg-background rounded-lg p-3 border border-border">
      <p className="text-[10px] text-secondary uppercase tracking-wide mb-1">{label}</p>
      <p className="text-lg font-bold text-foreground tabular-nums">{value}</p>
      <div className={cn("flex items-center gap-1 mt-0.5", isPos ? "text-success" : "text-destructive")}>
        {isPos ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
        <span className="text-[11px] font-medium">{change}</span>
      </div>
    </div>
  );
}

// ─── Report Preview Modal ─────────────────────────────────────────────────────

export function ReportPreview({ report, onClose }: ReportPreviewProps) {
  const [activeTab, setActiveTab] = useState<"summary" | "insights" | "actions">("summary");

  const tabs = [
    { id: "summary",  label: "Executive Summary" },
    { id: "insights", label: "Department Insights" },
    { id: "actions",  label: "Actions & Risks" },
  ] as const;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 20 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-3xl max-h-[90vh] bg-card border border-border rounded-xl overflow-hidden flex flex-col shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label={`Report: ${report.title}`}
      >
        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between p-5 border-b border-border shrink-0">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10 shrink-0">
              <BarChart3 size={18} className="text-primary" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">{report.title}</h2>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <Badge variant="success" className="text-[10px]">
                  <CheckCircle2 size={9} className="mr-1" />
                  Ready
                </Badge>
                <span className="text-xs text-secondary">AI Confidence: {report.confidence}%</span>
                <span className="text-xs text-secondary">·</span>
                <span className="text-xs text-secondary">{report.pages} pages · {report.size}</span>
                <span className="text-xs text-secondary">·</span>
                <div className="flex items-center gap-1 text-xs text-primary/80">
                  <Bot size={10} />
                  {report.author}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" size="sm">
              <Share2 size={13} />
              Share
            </Button>
            <Button size="sm">
              <Download size={13} />
              Export PDF
            </Button>
            <button
              onClick={onClose}
              className="ml-1 flex items-center justify-center w-8 h-8 rounded-md text-secondary hover:text-foreground hover:bg-accent transition-colors"
              aria-label="Close preview"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* ── AI Attribution Banner ─────────────────────────────────────── */}
        <div className="flex items-center gap-2 px-5 py-2.5 bg-primary/5 border-b border-primary/15 shrink-0">
          <Sparkles size={12} className="text-primary" />
          <span className="text-xs text-primary/80">
            Generated by IBM watsonx Orchestrate · Synthesised from Finance KB, Project KB, HR KB
          </span>
          <span className="text-xs text-secondary ml-auto">Updated {report.updated}</span>
        </div>

        {/* ── Tab navigation ────────────────────────────────────────────── */}
        <div className="flex border-b border-border shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 py-2.5 text-xs font-medium transition-colors",
                activeTab === tab.id
                  ? "border-b-2 border-primary text-primary"
                  : "text-secondary hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Tab content ───────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto p-5">
          <AnimatePresence mode="wait">
            {activeTab === "summary" && (
              <motion.div
                key="summary"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                {/* KPI grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <PreviewMetric label="Revenue Q3"    value="$8.2M"  change="+12.4%" />
                  <PreviewMetric label="Operating Cost" value="$3.1M"  change="+2.1%" />
                  <PreviewMetric label="Net Margin"    value="62.2%"  change="+310bps" />
                  <PreviewMetric label="EBITDA"        value="$5.1M"  change="+15.9%" />
                </div>

                {/* Narrative */}
                <div className="rounded-lg bg-background border border-border p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText size={14} className="text-primary" />
                    <span className="text-sm font-semibold text-foreground">Executive Narrative</span>
                  </div>
                  <p className="text-sm text-secondary leading-relaxed">
                    {EXEC_SUMMARY.replace(/\*\*/g, "")}
                  </p>
                </div>

                {/* Trend sparkline placeholder */}
                <div className="rounded-lg bg-background border border-border p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-foreground">Revenue Trend</span>
                    <span className="text-xs text-secondary">Q3 2025 → Q3 2026</span>
                  </div>
                  {/* Visual bar chart */}
                  <div className="flex items-end gap-1.5 h-20">
                    {[60, 65, 70, 68, 75, 80, 78, 85, 88, 87, 90, 100].map((h, i) => (
                      <motion.div
                        key={i}
                        className="flex-1 rounded-sm"
                        style={{ backgroundColor: i === 11 ? "#0F62FE" : "#0F62FE40" }}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ delay: i * 0.04, duration: 0.6, ease: "easeOut" }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between mt-1 text-[10px] text-secondary">
                    <span>Q3 2025</span>
                    <span className="text-primary font-semibold">Q3 2026 ↑</span>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "insights" && (
              <motion.div
                key="insights"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                <p className="text-xs text-secondary">Revenue breakdown by business unit — Q3 2026</p>
                {DEPT_INSIGHTS.map((d, i) => (
                  <motion.div
                    key={d.dept}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-background border border-border"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-1.5 h-8 rounded-full",
                        d.status === "up" ? "bg-success" : "bg-destructive"
                      )} />
                      <div>
                        <p className="text-sm font-medium text-foreground">{d.dept}</p>
                        <p className="text-xs text-secondary tabular-nums">{d.revenue}</p>
                      </div>
                    </div>
                    <div className={cn(
                      "flex items-center gap-1 text-sm font-semibold tabular-nums",
                      d.status === "up" ? "text-success" : "text-destructive"
                    )}>
                      {d.status === "up" ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                      {d.vs} vs Q3 2025
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {activeTab === "actions" && (
              <motion.div
                key="actions"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Target size={14} className="text-primary" />
                    AI Recommendations
                  </h3>
                  <div className="space-y-2.5">
                    {RECOMMENDATIONS.map((rec, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.07 }}
                        className="flex items-start gap-3 p-3 rounded-lg bg-background border border-border"
                      >
                        <div className="w-5 h-5 rounded-full bg-primary/15 border border-primary/25 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-[10px] font-bold text-primary">{i + 1}</span>
                        </div>
                        <p className="text-sm text-secondary leading-snug">{rec}</p>
                        <ArrowRight size={13} className="text-secondary/40 shrink-0 mt-0.5" />
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <AlertTriangle size={14} className="text-warning" />
                    Risk Register
                  </h3>
                  <div className="space-y-2">
                    {RISKS.map((r, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.07 + 0.2 }}
                        className={cn(
                          "flex items-start gap-3 p-3 rounded-lg border",
                          r.severity === "high"
                            ? "bg-destructive/5 border-destructive/25"
                            : "bg-warning/5 border-warning/20"
                        )}
                      >
                        <Badge
                          variant={r.severity === "high" ? "destructive" : "warning"}
                          className="text-[9px] shrink-0 mt-0.5 capitalize"
                        >
                          {r.severity}
                        </Badge>
                        <p className="text-sm text-secondary leading-snug">{r.risk}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
