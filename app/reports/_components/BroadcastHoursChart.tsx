"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { StreamerReportStat } from "../_data";

type BroadcastHoursChartProps = {
  stats: StreamerReportStat[];
};

export default function BroadcastHoursChart({
  stats,
}: BroadcastHoursChartProps) {
  const data = [...stats].sort((a, b) => b.broadcastHours - a.broadcastHours);

  return (
    <>
      <h3 className="text-sm font-semibold text-white">방송 시간 비교</h3>

      {data.length === 0 ? (
        <p className="text-xs text-slate-600">데이터가 없습니다.</p>
      ) : (
        <div
          className="w-full"
          style={{ height: Math.max(180, data.length * 40) }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 8, right: 24, bottom: 0, left: 0 }}
            >
              <CartesianGrid horizontal={false} stroke="#ffffff10" />

              <XAxis
                type="number"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 10 }}
                tickFormatter={(value) => `${value}h`}
              />

              <YAxis
                type="category"
                dataKey="streamer"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                width={70}
              />

              <Tooltip
                cursor={false}
                formatter={(value) => [
                  `${Number(value).toLocaleString()}시간`,
                  "방송 시간",
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
                dataKey="broadcastHours"
                name="방송 시간"
                fill="#8b5cf6"
                radius={[0, 4, 4, 0]}
                barSize={12}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </>
  );
}
