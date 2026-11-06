"use client";

import * as React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";
import { CategoryDistributionData } from "@/mock/analytics";

export interface CategoryDistributionChartProps {
  data: CategoryDistributionData[];
  height?: number;
}

export function CategoryDistributionChart({
  data,
  height = 280,
}: CategoryDistributionChartProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        style={{ height }}
        className="w-full rounded-xl bg-slate-50 animate-pulse flex items-center justify-center text-xs text-slate-400"
      >
        Loading category visualization...
      </div>
    );
  }

  return (
    <div style={{ height, width: "100%" }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
        >
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="category"
            tick={{ fill: "#334155", fontSize: 11, fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
            width={120}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#FFFFFF",
              borderRadius: "0.5rem",
              border: "1px solid #E2E8F0",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              fontSize: "12px",
            }}
            formatter={(value) => [`${value} issues`, "Volume"]}
          />
          <Bar dataKey="count" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
