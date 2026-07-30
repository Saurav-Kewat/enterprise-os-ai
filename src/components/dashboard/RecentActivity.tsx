"use client";

import { DashboardCard } from "@/components/ui/DashboardCard";
import { ActivityCard } from "@/components/ui/ActivityCard";
import { Button } from "@/components/ui/button";

const activities = [
  {
    id: "1",
    title: "Report Synthesis Completed",
    description: "Q3 financial executive report generated with 94.2% confidence.",
    timestamp: "2m ago",
    status: "success" as const,
    agent: "FinanceAgent-01",
  },
  {
    id: "2",
    title: "Salesforce Integration Warning",
    description: "API response latency exceeds configured SLA threshold.",
    timestamp: "14m ago",
    status: "warning" as const,
    agent: "IntegrationWatcher",
  },
  {
    id: "3",
    title: "Knowledge Base Updated",
    description: "428 documents ingested and vectorised into the Legal namespace.",
    timestamp: "1h ago",
    status: "info" as const,
    agent: "KnowledgeIndexer",
  },
  {
    id: "4",
    title: "Agent Execution Failed",
    description: "MarketingAgent-03 encountered a timeout error on campaign analysis.",
    timestamp: "2h ago",
    status: "error" as const,
    agent: "MarketingAgent-03",
  },
  {
    id: "5",
    title: "User Session Authenticated",
    description: "Admin login from 10.0.0.24 — Jane Doe.",
    timestamp: "3h ago",
    status: "success" as const,
  },
  {
    id: "6",
    title: "Analytics Pipeline Completed",
    description: "Daily aggregation job processed 2.1M records successfully.",
    timestamp: "5h ago",
    status: "success" as const,
    agent: "AnalyticsEngine",
  },
];

export function RecentActivity() {
  return (
    <DashboardCard
      title="Recent Activity"
      description="Live feed across all platform services"
      headerAction={
        <Button variant="ghost" size="sm" className="text-xs text-primary">
          Full Log
        </Button>
      }
    >
      <div className="space-y-2">
        {activities.map((activity) => (
          <ActivityCard key={activity.id} {...activity} />
        ))}
      </div>
    </DashboardCard>
  );
}
