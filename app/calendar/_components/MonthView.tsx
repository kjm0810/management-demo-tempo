import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";
import type { ScheduleEvent } from "../_data";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

function toKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

type Cell = {
  key: string;
  day: number;
  inCurrentMonth: boolean;
};

function buildCells(year: number, month: number): Cell[] {
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const cells: Cell[] = [];

  for (let i = firstWeekday - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    cells.push({ key: toKey(prevYear, prevMonth, day), day, inCurrentMonth: false });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ key: toKey(year, month, day), day, inCurrentMonth: true });
  }

  while (cells.length % 7 !== 0) {
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    const day = cells.length - (firstWeekday + daysInMonth) + 1;
    cells.push({ key: toKey(nextYear, nextMonth, day), day, inCurrentMonth: false });
  }

  return cells;
}

type MonthViewProps = {
  year: number;
  month: number;
  selectedKey: string;
  todayKey: string;
  eventsByDate: Record<string, ScheduleEvent[]>;
  onSelect: (key: string) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
};

export default function MonthView({
  year,
  month,
  selectedKey,
  todayKey,
  eventsByDate,
  onSelect,
  onPrevMonth,
  onNextMonth,
  onToday,
}: MonthViewProps) {
  const cells = buildCells(year, month);

  return (
    <>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">캘린더</h3>
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={onToday}>
            오늘
          </Button>
          <div className="flex items-center gap-3 text-sm text-slate-300">
            <Button variant="ghost" size="icon-sm" onClick={onPrevMonth} className="text-slate-500">
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <span className="w-24 text-center">
              {year}년 {month + 1}월
            </span>
            <Button variant="ghost" size="icon-sm" onClick={onNextMonth} className="text-slate-500">
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px overflow-hidden rounded-lg bg-white/5">
        {WEEKDAYS.map((w) => (
          <div key={w} className="bg-[#141a2b] py-2 text-center text-xs text-slate-500">
            {w}
          </div>
        ))}

        {cells.map((cell) => {
          const events = eventsByDate[cell.key] ?? [];
          const visible = events.slice(0, 2);
          const overflow = events.length - visible.length;
          const isSelected = cell.key === selectedKey;
          const isToday = cell.key === todayKey;

          return (
            <button
              key={cell.key}
              onClick={() => onSelect(cell.key)}
              className={`flex min-h-24 flex-col items-stretch gap-1 bg-[#141a2b] p-1.5 text-left transition-colors ${
                cell.inCurrentMonth ? "" : "opacity-40"
              } ${isSelected ? "ring-2 ring-inset ring-violet-500" : "hover:bg-white/5"}`}
            >
              <span
                className={`self-start rounded-full px-1.5 text-xs ${
                  isToday ? "bg-violet-600 text-white" : "text-slate-400"
                }`}
              >
                {cell.day}
              </span>

              <div className="flex flex-col gap-1">
                {visible.map((e) => (
                  <span
                    key={e.id}
                    className={`truncate rounded px-1.5 py-0.5 text-[10px] font-medium text-white ${e.color}`}
                  >
                    {e.streamer}
                  </span>
                ))}
                {overflow > 0 && <span className="px-1.5 text-[10px] text-slate-500">+{overflow}개 더</span>}
              </div>
            </button>
          );
        })}
      </div>
    </>
  );
}
