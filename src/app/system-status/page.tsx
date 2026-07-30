import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/PageContainer";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { DashboardCard } from "@/components/ui/DashboardCard";
import { ResponsiveGrid } from "@/components/ui/ResponsiveGrid";
import { SystemStatus } from "@/components/dashboard/SystemStatus";
import { StatCard } from "@/components/ui/StatCard";
import { Activity, Server, Cpu, HardDrive } from "lucide-react";

export const metadata: Metadata = { title: "System Status" };

export default function SystemStatusPage() {
  return (
    <PageContainer>
      <SectionTitle title="System Status" description="Infrastructure health and service monitoring" />

      <ResponsiveGrid cols={4} className="mb-6">
        <StatCard title="Uptime" value="99.97%" trend="up" icon={<Activity size={14} />} deltaLabel="last 30 days" />
        <StatCard title="Active Nodes" value="12" trend="neutral" icon={<Server size={14} />} deltaLabel="of 12 total" />
        <StatCard title="CPU Avg" value="34%" trend="neutral" icon={<Cpu size={14} />} />
        <StatCard title="Storage Used" value="68%" trend="up" delta={2} icon={<HardDrive size={14} />} />
      </ResponsiveGrid>

      <div className="max-w-xl">
        <SystemStatus />
      </div>
    </PageContainer>
  );
}
