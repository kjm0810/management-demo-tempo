import type { ComponentType } from "react";

type StatCardProps = {
  icon: ComponentType<{ className?: string }>;
  iconBg: string;
  label: string;
  value: string;
  sub: string;
  deltaColor?: string;
  lineColor: string;
  points: number[];
};

function sparklinePath(points: number[]) {
  const w = 100;
  const h = 32;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const step = w / (points.length - 1);

  return points
    .map((p, i) => {
      const x = i * step;
      const y = h - ((p - min) / range) * h;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

export default function StatCard({
  icon: Icon,
  iconBg,
  label,
  value,
  sub,
  deltaColor = "text-emerald-400",
  lineColor,
  points,
}: StatCardProps) {
  return (
    <>
      <div className="flex items-center gap-3">
        <div className={`flex h-11 w-11 items-center justify-center rounded-full ${iconBg}`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <span className="text-sm text-slate-400">{label}</span>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-2xl font-semibold text-white">{value}</span>
        <span className={`text-xs ${deltaColor}`}>{sub}</span>
      </div>

      <svg viewBox="0 0 100 32" preserveAspectRatio="none" className="h-8 w-full">
        <path d={sparklinePath(points)} fill="none" stroke={lineColor} strokeWidth={2} />
      </svg>
    </>
  );
}
