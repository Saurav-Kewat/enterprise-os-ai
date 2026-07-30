import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/PageContainer";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ResponsiveGrid } from "@/components/ui/ResponsiveGrid";
import { AnimatedStatCard } from "@/components/ui/AnimatedStatCard";
import { BusinessOverview } from "@/components/dashboard/BusinessOverview";
import { SuggestedActions } from "@/components/dashboard/SuggestedActions";
import { SystemStatus } from "@/components/dashboard/SystemStatus";
import { QueryVolumeChart } from "@/components/dashboard/QueryVolumeChart";
import { AccuracyTrendChart } from "@/components/dashboard/AccuracyTrendChart";
import { ResponseTimeChart } from "@/components/dashboard/ResponseTimeChart";
import { DepartmentUsageChart } from "@/components/dashboard/DepartmentUsageChart";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { QuickActionsPanel } from "@/components/dashboard/QuickActionsPanel";
import { DashboardHero } from "@/components/dashboard/DashboardHero";
import { kpiStats } from "@/lib/mockData";
import { MessageSquare, Target, Bot, Clock } from "lucide-react";

export const metadata: Metadata = { title: "Dashboard" };

const iconMap: Record<string, React.ReactNode> = {
  MessageSquare: <MessageSquare size={14} />,
  Target:        <Target size={14} />,
  Bot:           <Bot size={14} />,
  Clock:         <Clock size={14} />,
};

export default function DashboardPage() {
  return (
    <PageContainer>
      {/* ── Hero banner ─────────────────────────────────────────────────── */}
      <DashboardHero />

      {/* ── Animated KPI stat cards ─────────────────────────────────────── */}
      <ResponsiveGrid cols={4} className="mb-6">
        {kpiStats.map((stat) => (
          <AnimatedStatCard
            key={stat.id}
            title={stat.title}
            value={stat.value}
            displayValue={stat.displayValue}
            delta={stat.delta}
            deltaLabel={stat.deltaLabel}
            trend={stat.trend}
            icon={iconMap[stat.icon]}
            suffix={stat.suffix}
          />
        ))}
      </ResponsiveGrid>

      {/* ── Business Overview ─────────────────────────────────────────────── */}
      <div className="mb-6">
        <BusinessOverview />
      </div>

      {/* ── Charts row 1: Query Volume + Accuracy Trend ───────────────────── */}
      <ResponsiveGrid cols={2} className="mb-6">
        <QueryVolumeChart />
        <AccuracyTrendChart />
      </ResponsiveGrid>

      {/* ── Charts row 2: Response Time + Department Usage ───────────────── */}
      <ResponsiveGrid cols={2} className="mb-6">
        <ResponseTimeChart />
        <DepartmentUsageChart />
      </ResponsiveGrid>

      {/* ── Quick Actions + System Status ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <QuickActionsPanel />
        </div>
        <div>
          <SystemStatus />
        </div>
      </div>

      {/* ── Suggested Actions + Activity Feed ─────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SuggestedActions />
        <ActivityFeed />
      </div>
    </PageContainer>
  );
}


