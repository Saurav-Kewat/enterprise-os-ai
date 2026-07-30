"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Users, Clock, BrainCircuit, CheckCircle2,
  Zap, DollarSign, TrendingUp, TrendingDown,
  Download, Sparkles, ThumbsUp, Star,
} from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { DashboardCard } from "@/components/ui/DashboardCard";
import { AnimatedStatCard } from "@/components/ui/AnimatedStatCard";
import { ResponsiveGrid } from "@/components/ui/ResponsiveGrid";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ANALYTICS_STATS, SESSION_TREND, TOP_AGENTS_PERF,
  USAGE_BY_DEPT, DAILY_COST,
} from "@/lib/pagesData";
import { cn } from "@/lib/utils";

// ─── Icon map ─────────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, React.ReactNode> = {
  Users:        <Users size={14} />,
  Clock:        <Clock size={14} />,
  BrainCircuit: <BrainCircuit size={14} />,
  CheckCircle2: <CheckCircle2 size={14} />,
  Zap:          <Zap size={14} />,
  DollarSign: <DollarSign size={14} />,
};

// ─── Custom tooltip ───────────────────────────────────────────────────────────

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}

function ChartTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1a2232] border border-border rounded-lg px-3 py-2.5 text-xs shadow-xl">
      <p className="text-secondary mb-1.5 font-medium">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-secondary capitalize">{entry.name}</span>
          </div>
          <span className="font-semibold text-foreground tabular-nums">{entry.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Date range picker (decorative) ──────────────────────────────────────────

const RANGES = ["7D", "30D", "90D", "YTD"];

function DateRangePicker() {
  const [active, setActive] = useState("30D");
  return (
    <div className="flex items-center gap-1 p-0.5 rounded-md bg-background border border-border">
      {RANGES.map((r) => (
        <button
          key={r}
          onClick={() => setActive(r)}
          className={cn(
            "px-2.5 py-1 rounded text-xs font-medium transition-colors",
            active === r ? "bg-primary text-white" : "text-secondary hover:text-foreground"
          )}
        >
          {r}
        </button>
      ))}
    </div>
  );
}

// ─── Agent performance table ──────────────────────────────────────────────────

function AgentPerfTable() {
  return (
    <DashboardCard title="Agent Performance" description="Request volume, latency, and cost — all agents">
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border">
              {["Agent", "Requests", "Success Rate", "Avg Latency", "Cost (USD)"].map((h) => (
                <th key={h} className="px-3 py-2 text-left text-[10px] font-semibold text-secondary uppercase tracking-wider first:pl-0">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {TOP_AGENTS_PERF.map((agent, i) => (
              <motion.tr
                key={agent.name}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04, duration: 0.25 }}
                className="hover:bg-accent/30 transition-colors"
              >
                <td className="pl-0 px-3 py-2.5 font-medium text-foreground">{agent.name}</td>
                <td className="px-3 py-2.5 text-secondary tabular-nums">{agent.requests.toLocaleString()}</td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-success"
                        style={{ width: `${agent.success}%`, opacity: 0.7 }}
                      />
                    </div>
                    <span className={cn("font-medium tabular-nums", agent.success >= 99 ? "text-success" : agent.success >= 97 ? "text-warning" : "text-destructive")}>
                      {agent.success}%
                    </span>
                  </div>
                </td>
                <td className="px-3 py-2.5 tabular-nums">
                  <span className={agent.avgLatency > 2 ? "text-warning" : "text-foreground"}>
                    {agent.avgLatency}s
                  </span>
                </td>
                <td className="px-3 py-2.5 text-secondary tabular-nums">${agent.cost}</td>
              </motion.tr>
            ))}
          </tbody>
          <tfoot className="border-t border-border">
            <tr>
              <td className="pl-0 px-3 py-2.5 font-semibold text-foreground">Total</td>
              <td className="px-3 py-2.5 font-semibold text-foreground tabular-nums">
                {TOP_AGENTS_PERF.reduce((s, a) => s + a.requests, 0).toLocaleString()}
              </td>
              <td className="px-3 py-2.5" />
              <td className="px-3 py-2.5" />
              <td className="px-3 py-2.5 font-semibold text-foreground tabular-nums">
                ${TOP_AGENTS_PERF.reduce((s, a) => s + a.cost, 0).toFixed(1)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </DashboardCard>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  return (
    <PageContainer>
      <SectionTitle
        title="Analytics"
        description="Platform usage, agent performance, and cost intelligence"
        action={
          <div className="flex items-center gap-2">
            <DateRangePicker />
            <Button variant="outline" size="sm">
              <Download size={14} /> Export
            </Button>
          </div>
        }
      />

      {/* AI Insight Banner */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-start gap-3 p-4 rounded-xl border border-primary/25 bg-primary/5 mb-6"
      >
        <div className="p-1.5 rounded-md bg-primary/15 shrink-0">
          <Sparkles size={14} className="text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-xs font-semibold text-primary mb-0.5">AI-Generated Insight · July 29 2026</p>
          <p className="text-sm text-secondary leading-relaxed">
            Platform query volume increased <strong className="text-foreground">+19.4%</strong> week-over-week, driven primarily by
            Finance and Engineering departments. Agent accuracy improved to <strong className="text-foreground">99.1%</strong> — up 0.3pts.
            Cost-per-request decreased <strong className="text-foreground">12.1%</strong> following Knowledge Agent optimisations.
            Recommended action: review <strong className="text-foreground">Email Agent</strong> SMTP configuration to restore full throughput.
          </p>
        </div>
        <Badge variant="default" className="text-[10px] shrink-0">watsonx</Badge>
      </motion.div>

      {/* Satisfaction score cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: "User Satisfaction",  value: "94.2%", sub: "NPS +68", icon: ThumbsUp,  color: "#24A148" },
          { label: "AI Response Quality", value: "4.7/5", sub: "12,847 ratings", icon: Star, color: "#F1C21B" },
          { label: "Task Completion",     value: "91.8%", sub: "+3.2% this week", icon: CheckCircle2, color: "#0F62FE" },
        ].map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="flex items-center gap-4 p-4 rounded-lg border border-border bg-card"
          >
            <div className="p-2.5 rounded-lg shrink-0" style={{ backgroundColor: `${m.color}1a` }}>
              <m.icon size={18} style={{ color: m.color } as React.CSSProperties} />
            </div>
            <div>
              <p className="text-[11px] text-secondary uppercase tracking-wide">{m.label}</p>
              <p className="text-xl font-bold text-foreground tabular-nums">{m.value}</p>
              <p className="text-xs text-secondary">{m.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* KPI stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {ANALYTICS_STATS.map((s) => (
          <AnimatedStatCard
            key={s.title}
            title={s.title}
            value={s.value}
            displayValue={s.display}
            delta={s.delta}
            trend={s.trend}
            icon={ICON_MAP[s.icon]}
          />
        ))}
      </div>

      {/* Session trend + Dept usage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Session trend chart */}
        <div className="lg:col-span-2">
          <DashboardCard
            title="Session Trend"
            description="Weekly active sessions — last 8 weeks"
            headerAction={<span className="text-xs text-success font-medium">+19.4% vs prior period</span>}
          >
            <div className="h-[200px] mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={SESSION_TREND} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="sessGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0F62FE" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#0F62FE" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="activeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#24A148" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#24A148" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#243244" vertical={false} />
                  <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip content={<ChartTooltip />} cursor={{ stroke: "#243244", strokeWidth: 1 }} />
                  <Area type="monotone" dataKey="sessions" name="sessions" stroke="#0F62FE" strokeWidth={2} fill="url(#sessGrad)" dot={false} activeDot={{ r: 4, fill: "#0F62FE", strokeWidth: 0 }} />
                  <Area type="monotone" dataKey="active" name="active" stroke="#24A148" strokeWidth={1.5} fill="url(#activeGrad)" dot={false} activeDot={{ r: 4, fill: "#24A148", strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </DashboardCard>
        </div>

        {/* Department usage donut */}
        <DashboardCard title="Usage by Department" description="Share of AI queries today">
          <div className="space-y-2.5 mt-2">
            {USAGE_BY_DEPT.map((dept, i) => (
              <motion.div
                key={dept.dept}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05, duration: 0.25 }}
                className="flex items-center gap-2.5"
              >
                <span className="text-xs text-secondary w-20 shrink-0">{dept.dept}</span>
                <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: dept.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${dept.pct}%` }}
                    transition={{ delay: i * 0.06 + 0.2, duration: 0.7, ease: "easeOut" }}
                  />
                </div>
                <span className="text-xs font-semibold tabular-nums w-10 text-right" style={{ color: dept.color }}>
                  {dept.pct}%
                </span>
              </motion.div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-border text-xs text-secondary">
            {USAGE_BY_DEPT.reduce((s, d) => s + d.queries, 0).toLocaleString()} total queries today
          </div>
        </DashboardCard>
      </div>

      {/* Agent perf table + Daily cost */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <AgentPerfTable />
        </div>

        {/* Daily cost breakdown */}
        <DashboardCard
          title="Daily Cost Breakdown"
          description="Inference · Storage · Network (USD)"
          headerAction={<span className="text-xs text-secondary">7-day view</span>}
        >
          <div className="h-[220px] mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DAILY_COST} margin={{ top: 4, right: 8, left: -20, bottom: 0 }} barGap={2} barCategoryGap="28%">
                <CartesianGrid strokeDasharray="3 3" stroke="#1d2d3e" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(36,50,68,0.4)" }} />
                <Bar dataKey="inference" name="inference" fill="#0F62FE" fillOpacity={0.85} radius={[3, 3, 0, 0]} />
                <Bar dataKey="storage" name="storage" fill="#24A148" fillOpacity={0.7} radius={[3, 3, 0, 0]} />
                <Bar dataKey="network" name="network" fill="#F1C21B" fillOpacity={0.6} radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-4 mt-2">
            {[{ label: "Inference", color: "#0F62FE" }, { label: "Storage", color: "#24A148" }, { label: "Network", color: "#F1C21B" }].map(({ label, color }) => (
              <div key={label} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: color }} />
                <span className="text-xs text-secondary">{label}</span>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>
    </PageContainer>
  );
}
