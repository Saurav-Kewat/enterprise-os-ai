"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { DashboardCard } from "@/components/ui/DashboardCard";
import { departmentUsageData } from "@/lib/mockData";

const total = departmentUsageData.reduce((sum, d) => sum + d.queries, 0);

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: { color: string } }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  const pct = ((item.value / total) * 100).toFixed(1);
  return (
    <div className="bg-[#1a2232] border border-border rounded-lg px-3 py-2.5 text-xs shadow-xl">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: item.payload.color }} />
        <span className="font-semibold text-foreground">{item.name}</span>
      </div>
      <p className="text-secondary">{item.value.toLocaleString()} queries</p>
      <p className="text-secondary">{pct}% of total</p>
    </div>
  );
}

interface CustomLabelProps {
  cx?: number;
  cy?: number;
  midAngle?: number;
  innerRadius?: number;
  outerRadius?: number;
  percent?: number;
}

function renderLabel({ cx = 0, cy = 0, midAngle = 0, innerRadius = 0, outerRadius = 0, percent = 0 }: CustomLabelProps) {
  if (percent < 0.08) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

export function DepartmentUsageChart() {
  return (
    <DashboardCard
      title="Usage by Department"
      description={`${total.toLocaleString()} total queries today`}
    >
      <div className="h-[220px] mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={departmentUsageData}
              cx="50%"
              cy="50%"
              innerRadius={52}
              outerRadius={88}
              paddingAngle={2}
              dataKey="queries"
              nameKey="department"
              labelLine={false}
              label={renderLabel}
            >
              {departmentUsageData.map((entry) => (
                <Cell key={entry.department} fill={entry.color} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {/* Custom legend */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-1">
        {departmentUsageData.map((d) => (
          <div key={d.department} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-sm shrink-0" style={{ backgroundColor: d.color }} />
            <span className="text-xs text-secondary truncate">{d.department}</span>
            <span className="text-xs text-foreground font-medium ml-auto tabular-nums">
              {((d.queries / total) * 100).toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}
