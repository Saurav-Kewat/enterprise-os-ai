import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/PageContainer";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { DashboardCard } from "@/components/ui/DashboardCard";
import { ResponsiveGrid } from "@/components/ui/ResponsiveGrid";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, AlertTriangle, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = { title: "Enterprise AI Supervisor" };

const rules = [
  { id: "1", rule: "No PII in external API calls", status: "enforced", violations: 0 },
  { id: "2", rule: "Human approval for financial actions >$10k", status: "enforced", violations: 0 },
  { id: "3", rule: "Data residency — EU region only", status: "enforced", violations: 0 },
  { id: "4", rule: "Rate limit: max 1000 LLM calls/min", status: "warning", violations: 3 },
  { id: "5", rule: "Content moderation on all outputs", status: "enforced", violations: 0 },
  { id: "6", rule: "Audit log for all agent actions", status: "enforced", violations: 0 },
];

export default function AISupervisorPage() {
  return (
    <PageContainer>
      <SectionTitle
        title="Enterprise AI Supervisor"
        description="Governance, policy enforcement, and compliance oversight"
      />

      <ResponsiveGrid cols={3} className="mb-6">
        <StatCard title="Policies Active" value="24" trend="neutral" icon={<ShieldCheck size={14} />} />
        <StatCard title="Violations Today" value="3" trend="down" delta={-40} deltaLabel="vs yesterday" icon={<AlertTriangle size={14} />} />
        <StatCard title="Compliance Score" value="98.7%" trend="up" delta={0.4} icon={<CheckCircle2 size={14} />} />
      </ResponsiveGrid>

      <DashboardCard title="Governance Rules" description="Active policy enforcement rules">
        <div className="space-y-2.5">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className="flex items-center justify-between gap-3 p-3 rounded-md bg-background border border-border"
            >
              <p className="text-sm text-foreground">{rule.rule}</p>
              <div className="flex items-center gap-3 shrink-0">
                {rule.violations > 0 && (
                  <span className="text-xs text-warning font-medium tabular-nums">
                    {rule.violations} violations
                  </span>
                )}
                <Badge variant={rule.status === "enforced" ? "success" : "warning"} className="capitalize">
                  {rule.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </DashboardCard>
    </PageContainer>
  );
}
