"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DailyReportEntry } from "../_data";

type RevenueTrendChartProps = {
  data: DailyReportEntry[];
};

export default function RevenueTrendChart({ data }: RevenueTrendChartProps) {
  const maxVal = Math.max(1, ...data.map((d) => d.revenue));
  const step = Math.ceil(maxVal / 4 / 100000) * 100000 || 100000;
  const maxY = step * 4;

  return (
    <>
      <h3 className="text-sm font-semibold text-white">일별 수익 추이</h3>

      {data.length === 0 ? (
        <p className="text-xs text-slate-600">데이터가 없습니다.</p>
      ) : (
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
                interval={1}
              />

              <YAxis
                domain={[0, maxY]}
                ticks={[0, step, step * 2, step * 3, step * 4]}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 10 }}
                tickFormatter={(value) =>
                  `${(Number(value) / 10000).toFixed(0)}만`
                }
                width={40}
              />

              <Tooltip
                cursor={{
                  stroke: "#7c5cff",
                  strokeWidth: 1,
                  strokeDasharray: "4 4",
                }}
                formatter={(value) => [
                  `${Number(value).toLocaleString()}원`,
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
      )}
    </>
  );
}
