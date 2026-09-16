"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { name: "스트리머 A", value: 35, color: "#8b5cf6" },
  { name: "스트리머 B", value: 25, color: "#3b82f6" },
  { name: "스트리머 C", value: 20, color: "#14b8a6" },
  { name: "스트리머 D", value: 12, color: "#f97316" },
  { name: "기타", value: 8, color: "#ec4899" },
];

export default function RevenueDistribution() {
  return (
    <>
      <h3 className="text-sm font-semibold text-white">수익 분포</h3>

      <div className="relative h-40 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={56}
              outerRadius={80}
              stroke="none"
            >
              {data.map((item) => (
                <Cell key={item.name} fill={item.color} />
              ))}
            </Pie>

            <Tooltip
              formatter={(value) => [`${value}%`, "수익 비율"]}
              contentStyle={{
                background: "rgba(0, 0, 0, 0.8)",
                border: "none",
                borderRadius: 8,
                fontSize: 12,
              }}
              labelStyle={{ color: "#cbd5e1" }}
              itemStyle={{ color: "#ffffff" }}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-lg font-semibold text-white">24,850,000</span>
          <span className="text-[11px] text-slate-400">오늘 총 수익</span>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        {data.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between text-xs"
          >
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: item.color }}
              />
              <span className="text-slate-300">{item.name}</span>
            </div>

            <span className="text-slate-400">{item.value}%</span>
          </div>
        ))}
      </div>
    </>
  );
}
