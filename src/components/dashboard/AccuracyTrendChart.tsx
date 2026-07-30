"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { DashboardCard } from "@/components/ui/DashboardCard";
import { accuracyTrendData } from "@/lib/mockData";

const COLORS = {
  accuracy: "#0F62FE",
  baseline: "#243244",
  grid: "#1d2d3e",
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
      <p className="text-secondary mb-1.5 font-medium">{label} 2026</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-secondary capitalize">{entry.name}</span>
          </div>
          <span className="font-semibold text-foreground tabular-nums">{entry.value}%</span>
        </div>
      ))}
    </div>
  );
}

export function AccuracyTrendChart() {
  return (
    <DashboardCard
      title="Model Accuracy Trend"
      description="Response accuracy vs baseline — Feb–Jul 2026"
      headerAction={
        <span className="text-xs text-primary font-medium">97.3% current</span>
      }
    >
      <div className="h-[220px] mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={accuracyTrendData}
            margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: COLORS.axis }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[90, 100]}
              tick={{ fontSize: 11, fill: COLORS.axis }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "#243244", strokeWidth: 1 }}
            />
            <ReferenceLine
              y={92}
              stroke={COLORS.baseline}
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{ value: "Baseline 92%", position: "insideTopRight", fill: "#94A3B8", fontSize: 10 }}
            />
            <Line
              type="monotone"
              dataKey="accuracy"
              name="accuracy"
              stroke={COLORS.accuracy}
              strokeWidth={2.5}
              dot={{ fill: COLORS.accuracy, r: 4, strokeWidth: 0 }}
              activeDot={{ r: 6, fill: COLORS.accuracy, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  );
}
