import { CalendarIcon } from "@/components/icons";
import type { ScheduleEvent } from "@/app/calendar/_data";

type UpcomingItem = {
  dateKey: string;
  event: ScheduleEvent;
};

type UpcomingScheduleProps = {
  items: UpcomingItem[];
};

function formatDateKey(dateKey: string) {
  const [, m, d] = dateKey.split("-");
  return `${Number(m)}월 ${Number(d)}일`;
}

export default function UpcomingSchedule({ items }: UpcomingScheduleProps) {
  return (
    <>
      <div className="flex items-center gap-2">
        <CalendarIcon className="h-4 w-4 text-slate-400" />
        <h3 className="text-sm font-semibold text-white">다가오는 일정</h3>
      </div>

      {items.length === 0 ? (
        <p className="text-xs text-slate-600">예정된 일정이 없습니다.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map(({ dateKey, event }) => (
            <div
              key={event.id}
              className="flex items-center gap-3 rounded-lg border border-white/10 bg-black/20 px-3 py-2"
            >
              <span className="w-14 shrink-0 text-xs text-slate-500">{formatDateKey(dateKey)}</span>
              <span className={`h-6 w-6 shrink-0 rounded-full bg-gradient-to-br ${event.gradient}`} />
              <span className="flex-1 truncate text-sm text-slate-200">{event.streamer}</span>
              <span className="shrink-0 text-xs text-slate-500">
                {String(Math.floor(event.startHour)).padStart(2, "0")}:00
              </span>
              <span className="shrink-0 rounded-full border border-white/10 px-2 py-0.5 text-[11px] text-slate-400">
                {event.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
