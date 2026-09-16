import { Button } from "@/components/ui/button";
import { PlusIcon } from "@/components/icons";
import type { ScheduleEvent } from "../_data";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

type DayViewProps = {
  date: Date;
  events: ScheduleEvent[];
  onAdd: () => void;
  canAdd: boolean;
};

type StreamerRow = {
  streamer: string;
  gradient: string;
  events: ScheduleEvent[];
};

export default function DayView({ date, events, onAdd, canAdd }: DayViewProps) {
  const dateLabel = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(
    date.getDate()
  ).padStart(2, "0")} (${WEEKDAYS[date.getDay()]})`;

  const header = (
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-semibold text-white">
        {dateLabel} 일정 {events.length > 0 && <span className="text-slate-500">· 스케줄 {events.length}건</span>}
      </h3>
      <Button
        variant="outline"
        size="sm"
        onClick={onAdd}
        disabled={!canAdd}
        title={canAdd ? undefined : "헤더에서 회사와 프로젝트를 먼저 선택하세요"}
      >
        <PlusIcon className="h-3.5 w-3.5" />
        일정 추가
      </Button>
    </div>
  );

  if (events.length === 0) {
    return (
      <>
        {header}
        <p className="text-sm text-slate-500">이 날은 등록된 스케줄이 없습니다.</p>
      </>
    );
  }

  const rangeStart = Math.max(0, Math.floor(Math.min(...events.map((e) => e.startHour))) - 1);
  const rangeEnd = Math.min(24, Math.ceil(Math.max(...events.map((e) => e.endHour))) + 1);
  const hours: number[] = [];
  for (let h = rangeStart; h <= rangeEnd; h++) hours.push(h);

  function pct(hour: number) {
    return ((hour - rangeStart) / (rangeEnd - rangeStart)) * 100;
  }

  const rows: StreamerRow[] = [];
  for (const e of events) {
    let row = rows.find((r) => r.streamer === e.streamer);
    if (!row) {
      row = { streamer: e.streamer, gradient: e.gradient, events: [] };
      rows.push(row);
    }
    row.events.push(e);
  }

  return (
    <>
      {header}

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
          <div key={row.streamer} className="grid grid-cols-[100px_1fr] items-center gap-2">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <span className={`h-6 w-6 shrink-0 rounded-full bg-gradient-to-br ${row.gradient}`} />
              <span className="truncate">{row.streamer}</span>
            </div>

            <div className="relative h-8 rounded-md bg-black/20">
              {hours.slice(1, -1).map((h) => (
                <span key={h} className="absolute top-0 h-full w-px bg-white/5" style={{ left: `${pct(h)}%` }} />
              ))}

              {row.events.map((e) => (
                <div
                  key={e.id}
                  title={`${e.label} (${e.startHour}:00 ~ ${e.endHour}:00)`}
                  className={`absolute top-1 bottom-1 flex items-center justify-center overflow-hidden rounded px-2 text-[11px] font-medium text-white ${e.color}`}
                  style={{
                    left: `${pct(e.startHour)}%`,
                    width: `${pct(e.endHour) - pct(e.startHour)}%`,
                  }}
                >
                  <span className="truncate">{e.label}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
