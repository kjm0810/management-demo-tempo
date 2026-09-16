"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const chartData = {
  일간: [
    { date: "09.09", revenue: 10.5 },
    { date: "09.10", revenue: 13.2 },
    { date: "09.11", revenue: 11.5 },
    { date: "09.12", revenue: 14.0 },
    { date: "09.13", revenue: 24.85 },
    { date: "09.14", revenue: 19.5 },
    { date: "09.15", revenue: 20.8 },
  ],
  주간: [
    { date: "1주차", revenue: 72.4 },
    { date: "2주차", revenue: 85.6 },
    { date: "3주차", revenue: 79.2 },
    { date: "4주차", revenue: 96.8 },
    { date: "5주차", revenue: 91.5 },
  ],
  월간: [
    { date: "4월", revenue: 285.4 },
    { date: "5월", revenue: 312.8 },
    { date: "6월", revenue: 298.5 },
    { date: "7월", revenue: 356.2 },
    { date: "8월", revenue: 382.7 },
    { date: "9월", revenue: 341.6 },
  ],
};

const tabs = ["일간", "주간", "월간"] as const;

export default function RevenueTrendChart() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("일간");
  const data = chartData[tab];

  const maxRevenue = Math.max(...data.map((item) => item.revenue));
  const yAxisMax = Math.ceil(maxRevenue / 10) * 10;

  return (
    <>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">수익 추이</h3>

        <div className="flex gap-1 rounded-lg bg-black/30 p-1">
          {tabs.map((t) => (
            <Button
              key={t}
              size="sm"
              variant={t === tab ? "default" : "ghost"}
              onClick={() => setTab(t)}
              className={t === tab ? "" : "text-slate-400 hover:text-slate-200"}
            >
              {t}
            </Button>
          ))}
        </div>
      </div>

      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 24, right: 24, bottom: 0, left: 0 }}
          >
            <CartesianGrid vertical={false} stroke="#ffffff10" />

            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 10 }}
            />

            <YAxis
              domain={[0, yAxisMax]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 10 }}
              tickFormatter={(value) => `${value}M`}
              width={32}
            />

            <Tooltip
              cursor={{
                stroke: "#7c5cff",
                strokeWidth: 1,
                strokeDasharray: "4 4",
              }}
              formatter={(value) => [
                Math.round(Number(value) * 1_000_000).toLocaleString(),
                "수익",
              ]}
              contentStyle={{
                background: "rgba(0, 0, 0, 0.8)",
                border: "none",
                borderRadius: 8,
                fontSize: 12,
              }}
              labelStyle={{ color: "#cbd5e1" }}
              itemStyle={{ color: "#ffffff" }}
            />

            <Line
              type="linear"
              dataKey="revenue"
              stroke="#8b5cf6"
              strokeWidth={2.5}
              dot={{
                r: 3,
                fill: "#1e2540",
                stroke: "#8b5cf6",
                strokeWidth: 1.5,
              }}
              activeDot={{
                r: 5,
                fill: "#8b5cf6",
                stroke: "#8b5cf6",
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
