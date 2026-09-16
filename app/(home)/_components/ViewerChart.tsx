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

const data = [
  { date: "09.09", viewers: 42, hours: 420 },
  { date: "09.10", viewers: 48, hours: 460 },
  { date: "09.11", viewers: 55, hours: 500 },
  { date: "09.12", viewers: 62, hours: 620 },
  { date: "09.13", viewers: 70, hours: 780 },
  { date: "09.14", viewers: 88, hours: 900 },
  { date: "09.15", viewers: 60, hours: 640 },
];

export default function ViewerChart() {
  return (
    <>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">시청자 / 시청 시간</h3>

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

      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 16, right: 0, bottom: 0, left: 0 }}
          >
            <CartesianGrid vertical={false} stroke="#ffffff10" />

            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 10 }}
            />

            <YAxis
              yAxisId="viewers"
              domain={[0, 100]}
              ticks={[0, 20, 40, 60, 80, 100]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 10 }}
              width={28}
            />

            <YAxis
              yAxisId="hours"
              orientation="right"
              domain={[0, 1000]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 10 }}
              width={36}
            />

            <Tooltip
              formatter={(value, name) => [
                name === "시청 시간"
                  ? `${Number(value).toLocaleString()}h`
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
              dataKey="hours"
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
    </>
  );
}
