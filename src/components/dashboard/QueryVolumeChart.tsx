"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { DashboardCard } from "@/components/ui/DashboardCard";
import { queryVolumeData } from "@/lib/mockData";

const COLORS = {
  success: "#24A148",
  failed: "#DA1E28",
  grid: "#243244",
  axis: "#94A3B8",
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1a2232] border border-border rounded-lg px-3 py-2.5 text-xs shadow-xl">
      <p className="text-secondary mb-1.5 font-medium">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-secondary capitalize">{entry.name}</span>
          </div>
          <span className="font-semibold text-foreground tabular-nums">
            {entry.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

// Show every 7th label
const formatXAxis = (val: string, index: number) => {
  return index % 7 === 0 ? val : "";
};

export function QueryVolumeChart() {
  return (
    <DashboardCard
      title="Query Volume"
      description="Daily AI queries — last 30 days"
      headerAction={
        <span className="text-xs text-success font-medium">+18.4% vs prior period</span>
      }
    >
      <div className="h-[220px] mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={queryVolumeData}
            margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="successGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.success} stopOpacity={0.25} />
                <stop offset="95%" stopColor={COLORS.success} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="failedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.failed} stopOpacity={0.2} />
                <stop offset="95%" stopColor={COLORS.failed} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} vertical={false} />
            <XAxis
              dataKey="day"
              tickFormatter={formatXAxis}
              tick={{ fontSize: 11, fill: COLORS.axis }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: COLORS.axis }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#243244", strokeWidth: 1 }} />
            <Area
              type="monotone"
              dataKey="success"
              name="successful"
              stroke={COLORS.success}
              strokeWidth={2}
              fill="url(#successGradient)"
              dot={false}
              activeDot={{ r: 4, fill: COLORS.success, strokeWidth: 0 }}
            />
            <Area
              type="monotone"
              dataKey="failed"
              name="failed"
              stroke={COLORS.failed}
              strokeWidth={1.5}
              fill="url(#failedGradient)"
              dot={false}
              activeDot={{ r: 4, fill: COLORS.failed, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  );
}
