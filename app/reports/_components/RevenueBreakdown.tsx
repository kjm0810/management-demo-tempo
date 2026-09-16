"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { RevenueSlice } from "../_data";

type RevenueBreakdownProps = {
  slices: RevenueSlice[];
};

const COLOR_HEX: Record<string, string> = {
  "bg-violet-500": "#8b5cf6",
  "bg-blue-500": "#3b82f6",
  "bg-teal-500": "#14b8a6",
};

export default function RevenueBreakdown({ slices }: RevenueBreakdownProps) {
  const total = slices.reduce((sum, slice) => sum + slice.amount, 0);

  return (
    <>
      <h3 className="text-sm font-semibold text-white">수익 구성</h3>

      {total === 0 ? (
        <p className="text-xs text-slate-600">데이터가 없습니다.</p>
      ) : (
        <div className="flex items-center gap-5">
          <div className="h-28 w-28 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={slices}
                  dataKey="amount"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  innerRadius={42}
                  outerRadius={56}
                  stroke="none"
                >
                  {slices.map((slice) => (
                    <Cell
                      key={slice.label}
                      fill={COLOR_HEX[slice.color] ?? "#64748b"}
                    />
                  ))}
                </Pie>

                <Tooltip
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
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-1 flex-col gap-2">
            {slices.map((slice) => (
              <div
                key={slice.label}
                className="flex items-center gap-2 text-xs"
              >
                <span
                  className={`h-2.5 w-2.5 shrink-0 rounded-full ${slice.color}`}
                />
                <span className="text-slate-300">{slice.label}</span>

                <span className="ml-auto text-slate-400">
                  {slice.amount.toLocaleString()}원
                </span>

                <span className="w-10 text-right text-slate-600">
                  {((slice.amount / total) * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
