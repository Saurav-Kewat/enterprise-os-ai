import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/PageContainer";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { DashboardCard } from "@/components/ui/DashboardCard";
import { ResponsiveGrid } from "@/components/ui/ResponsiveGrid";
import { Button } from "@/components/ui/button";
import {
  FileBarChart2, Upload, BrainCircuit, RefreshCw,
  Download, Search, Bell, Shield
} from "lucide-react";

export const metadata: Metadata = { title: "Quick Actions" };

const quickActions = [
  { icon: FileBarChart2, label: "Generate Report", desc: "Trigger AI report synthesis" },
  { icon: Upload, label: "Upload Documents", desc: "Add to knowledge base" },
  { icon: BrainCircuit, label: "Spawn Agent", desc: "Launch a new AI agent" },
  { icon: RefreshCw, label: "Sync Integrations", desc: "Force all connector sync" },
  { icon: Download, label: "Export Data", desc: "Download platform data" },
  { icon: Search, label: "Semantic Search", desc: "Query knowledge base" },
  { icon: Bell, label: "Create Alert", desc: "Set up a threshold alert" },
  { icon: Shield, label: "Run Audit", desc: "Execute compliance audit" },
];

export default function QuickActionsPage() {
  return (
    <PageContainer>
      <SectionTitle title="Quick Actions" description="Frequently used platform operations" />
      <ResponsiveGrid cols={4}>
        {quickActions.map(({ icon: Icon, label, desc }) => (
          <DashboardCard key={label}>
            <div className="flex flex-col items-center text-center gap-3 py-2">
              <div className="p-3 rounded-lg bg-primary/10">
                <Icon size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{label}</p>
                <p className="text-xs text-secondary mt-0.5">{desc}</p>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                Launch
              </Button>
            </div>
          </DashboardCard>
        ))}
      </ResponsiveGrid>
    </PageContainer>
  );
}
