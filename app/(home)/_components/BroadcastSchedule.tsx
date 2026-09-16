import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon } from "@/components/icons";

const hours = [12, 13, 14, 15, 16, 17, 18, 19, 20];
const RANGE_START = 12;
const RANGE_END = 20;

type Row = {
  name: string;
  gradient: string;
  bar: { start: number; end: number; label: string; color: string } | null;
};

const rows: Row[] = [
  { name: "스트리머 A", gradient: "from-violet-500 to-purple-700", bar: { start: 13.1, end: 16.7, label: "방송 진행 중", color: "bg-violet-600" } },
  { name: "스트리머 B", gradient: "from-blue-500 to-indigo-700", bar: { start: 15.2, end: 16.7, label: "방송 진행 중", color: "bg-blue-600" } },
  { name: "스트리머 C", gradient: "from-teal-500 to-emerald-700", bar: { start: 12.0, end: 14.1, label: "방송 완료", color: "bg-teal-600" } },
  { name: "스트리머 D", gradient: "from-slate-500 to-slate-700", bar: { start: 18.1, end: 19.6, label: "방송 예정", color: "bg-slate-600" } },
  { name: "스트리머 E", gradient: "from-orange-500 to-amber-700", bar: { start: 14.0, end: 18.5, label: "방송 진행 중", color: "bg-orange-600" } },
  { name: "스트리머 F", gradient: "from-yellow-500 to-amber-600", bar: { start: 15.5, end: 17.0, label: "방송 예정", color: "bg-yellow-600" } },
];

function pct(hour: number) {
  return ((hour - RANGE_START) / (RANGE_END - RANGE_START)) * 100;
}

export default function BroadcastSchedule() {
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-white">
          <CalendarIcon className="h-4 w-4 text-slate-400" />
          방송 스케줄
        </div>
        <div className="flex items-center gap-3 text-sm text-slate-300">
          <Button variant="ghost" size="icon-sm" className="text-slate-500">
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <span>2026.09.15 (화)</span>
          <Button variant="ghost" size="icon-sm" className="text-slate-500">
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-[100px_1fr]">
        <div />
        <div className="relative grid" style={{ gridTemplateColumns: `repeat(${hours.length - 1}, 1fr)` }}>
          {hours.slice(0, -1).map((h) => (
            <span key={h} className="text-[11px] text-slate-500">
              {h}:00
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {rows.map((row) => (
          <div key={row.name} className="grid grid-cols-[100px_1fr] items-center gap-2">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <span className={`h-6 w-6 shrink-0 rounded-full bg-gradient-to-br ${row.gradient}`} />
              <span className="truncate">{row.name}</span>
            </div>

            <div className="relative h-8 rounded-md bg-black/20">
              {hours.slice(1, -1).map((h) => (
                <span
                  key={h}
                  className="absolute top-0 h-full w-px bg-white/5"
                  style={{ left: `${pct(h)}%` }}
                />
              ))}
              <span
                className="absolute top-0 z-10 h-full w-0.5 bg-red-500"
                style={{ left: `${pct(16)}%` }}
              />
              {row.bar && (
                <div
                  className={`absolute top-1 bottom-1 flex items-center justify-center rounded px-2 text-[11px] font-medium text-white ${row.bar.color}`}
                  style={{
                    left: `${pct(row.bar.start)}%`,
                    width: `${pct(row.bar.end) - pct(row.bar.start)}%`,
                  }}
                >
                  <span className="truncate">{row.bar.label}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
