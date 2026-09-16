"use client";

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DailyReportEntry } from "../_data";

type ViewerTrendChartProps = {
  data: DailyReportEntry[];
};

export default function ViewerTrendChart({ data }: ViewerTrendChartProps) {
  const chartData = data.map((entry) => ({
    ...entry,
    watchHours: entry.watchMinutes / 60,
  }));

  return (
    <>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">
          시청자 / 시청 시간 추이
        </h3>

        <div className="flex items-center gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-violet-500" />
            시청자 수
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-blue-400" />
            시청 시간(h)
          </span>
        </div>
      </div>

      {data.length === 0 ? (
        <p className="text-xs text-slate-600">데이터가 없습니다.</p>
      ) : (
        <div className="h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 16, right: 0, bottom: 0, left: 0 }}
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
                yAxisId="viewers"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 10 }}
                width={36}
              />

              <YAxis
                yAxisId="hours"
                orientation="right"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 10 }}
                width={36}
              />

              <Tooltip
                formatter={(value, name) => [
                  name === "시청 시간"
                    ? `${Number(value).toFixed(1)}h`
                    : Number(value).toLocaleString(),
                  name,
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

              <Bar
                yAxisId="viewers"
                dataKey="viewers"
                name="시청자 수"
                fill="#7c5cff"
                radius={[3, 3, 0, 0]}
                opacity={0.85}
                barSize={24}
              />

              <Line
                yAxisId="hours"
                type="linear"
                dataKey="watchHours"
                name="시청 시간"
                stroke="#60a5fa"
                strokeWidth={2}
                dot={{
                  r: 3,
                  fill: "#60a5fa",
                  stroke: "#60a5fa",
                }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </>
  );
}
