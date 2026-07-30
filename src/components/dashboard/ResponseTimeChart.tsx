"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { DashboardCard } from "@/components/ui/DashboardCard";
import { responseTimeData } from "@/lib/mockData";

const SLA_THRESHOLD = 2.0;

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
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-secondary">{entry.name}</span>
          </div>
          <span className="font-semibold text-foreground tabular-nums">{entry.value}s</span>
        </div>
      ))}
    </div>
  );
}

export function ResponseTimeChart() {
  return (
    <DashboardCard
      title="Agent Response Time"
      description="P50 / P95 / P99 latency — last 7 days"
      headerAction={
        <span className="text-xs text-secondary">
          SLA <span className="text-warning font-medium">&lt;2.0s</span>
        </span>
      }
    >
      <div className="h-[220px] mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={responseTimeData}
            margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
            barCategoryGap="28%"
            barGap={3}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1d2d3e" vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 11, fill: "#94A3B8" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#94A3B8" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}s`}
              domain={[0, 4]}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(36,50,68,0.4)" }} />
            <Bar dataKey="p50" name="P50" radius={[3, 3, 0, 0]}>
              {responseTimeData.map((entry) => (
                <Cell
                  key={`p50-${entry.day}`}
                  fill={entry.p50 > SLA_THRESHOLD ? "#DA1E28" : "#0F62FE"}
                  fillOpacity={0.9}
                />
              ))}
            </Bar>
            <Bar dataKey="p95" name="P95" radius={[3, 3, 0, 0]}>
              {responseTimeData.map((entry) => (
                <Cell
                  key={`p95-${entry.day}`}
                  fill={entry.p95 > SLA_THRESHOLD ? "#DA1E28" : "#24A148"}
                  fillOpacity={0.75}
                />
              ))}
            </Bar>
            <Bar dataKey="p99" name="P99" radius={[3, 3, 0, 0]}>
              {responseTimeData.map((entry) => (
                <Cell
                  key={`p99-${entry.day}`}
                  fill={entry.p99 > SLA_THRESHOLD ? "#DA1E28" : "#F1C21B"}
                  fillOpacity={0.6}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Legend */}
      <div className="flex items-center gap-5 mt-2">
        {[
          { label: "P50 Median", color: "#0F62FE" },
          { label: "P95", color: "#24A148" },
          { label: "P99", color: "#F1C21B" },
        ].map(({ label, color }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: color }} />
            <span className="text-xs text-secondary">{label}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5 ml-auto">
          <span className="w-2 h-2 rounded-sm bg-destructive" />
          <span className="text-xs text-secondary">SLA breach</span>
        </div>
      </div>
    </DashboardCard>
  );
}
