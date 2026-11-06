"use client";

import * as React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { MonthlyTrendData } from "@/mock/analytics";

export interface MonthlyTrendChartProps {
  data: MonthlyTrendData[];
  height?: number;
}

export function MonthlyTrendChart({
  data,
  height = 280,
}: MonthlyTrendChartProps) {
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
        Loading trend visualization...
      </div>
    );
  }

  return (
    <div style={{ height, width: "100%" }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorReported" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0F172A" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#0F172A" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0D9488" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#0D9488" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
          <XAxis
            dataKey="month"
            tick={{ fill: "#64748B", fontSize: 11 }}
            axisLine={{ stroke: "#E2E8F0" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#64748B", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#FFFFFF",
              borderRadius: "0.5rem",
              border: "1px solid #E2E8F0",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              fontSize: "12px",
            }}
          />
          <Legend
            verticalAlign="top"
            align="right"
            iconType="circle"
            wrapperStyle={{ paddingBottom: 10, fontSize: 12 }}
          />
          <Area
            type="monotone"
            dataKey="reported"
            name="Issues Reported"
            stroke="#0F172A"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorReported)"
          />
          <Area
            type="monotone"
            dataKey="resolved"
            name="Issues Resolved"
            stroke="#0D9488"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorResolved)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

