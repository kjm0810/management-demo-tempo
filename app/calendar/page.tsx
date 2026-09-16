"use client";

import { useMemo, useState } from "react";
import Card from "@/components/Card";
import { useRole } from "@/components/RoleContext";
import { useOrg } from "@/components/OrgContext";
import { useScope } from "@/components/ScopeContext";
import { CURRENT_STREAMER_ID } from "@/components/orgData";
import MonthView from "./_components/MonthView";
import DayView from "./_components/DayView";
import ScheduleFormModal, { type NewScheduleInput } from "./_components/ScheduleFormModal";
import { scheduleByDate as initialScheduleByDate, type ScheduleEvent } from "./_data";

function toKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(
    2,
    "0"
  )}`;
}

function filterEvents(
  eventsByDate: Record<string, ScheduleEvent[]>,
  companyId: string,
  projectId: string
): Record<string, ScheduleEvent[]> {
  const result: Record<string, ScheduleEvent[]> = {};
  for (const [date, events] of Object.entries(eventsByDate)) {
    const filtered = events.filter((e) => e.companyId === companyId && (!projectId || e.projectId === projectId));
    if (filtered.length > 0) result[date] = filtered;
  }
  return result;
}

const today = new Date();
const todayKey = toKey(today);
const initialSelected = new Date(2026, 8, 15); // 기준일(오늘)부터 바로 데모 데이터를 볼 수 있도록 시작

export default function CalendarPage() {
  const { role } = useRole();
  const { companies, projects, streamers, memberships } = useOrg();
  const { companyId, projectId } = useScope();

  const [scheduleByDate, setScheduleByDate] = useState<Record<string, ScheduleEvent[]>>(initialScheduleByDate);
  const [cursor, setCursor] = useState(initialSelected);
  const [selectedKey, setSelectedKey] = useState(toKey(initialSelected));
  const [showAddSchedule, setShowAddSchedule] = useState(false);

  const visibleScheduleByDate = useMemo(() => {
    if (!companyId) return scheduleByDate;
    return filterEvents(scheduleByDate, companyId, projectId);
  }, [scheduleByDate, companyId, projectId]);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();

  const selectedDate = useMemo(() => {
    const [y, m, d] = selectedKey.split("-").map(Number);
    return new Date(y, m - 1, d);
  }, [selectedKey]);

  const selectedEvents = visibleScheduleByDate[selectedKey] ?? [];

  // 일정 추가는 헤더에서 회사+프로젝트가 구체적으로 선택되어 있을 때만 가능 (페이지 안에서 따로 선택하지 않음)
  const canAddSchedule = Boolean(companyId && projectId);
  const activeCompany = companies.find((c) => c.id === companyId);
  const activeProject = projects.find((p) => p.id === projectId);

  function goToMonth(offset: number) {
    setCursor(new Date(year, month + offset, 1));
  }

  function goToday() {
    setCursor(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedKey(todayKey);
  }

  function handleAddSchedule(input: NewScheduleInput) {
    const event: ScheduleEvent = {
      id: crypto.randomUUID(),
      streamer: input.streamerName,
      gradient: input.gradient,
      color: input.color,
      companyId,
      projectId,
      startHour: input.startHour,
      endHour: input.endHour,
      label: input.label,
    };
    setScheduleByDate((prev) => ({
      ...prev,
      [input.dateKey]: [...(prev[input.dateKey] ?? []), event],
    }));
    setSelectedKey(input.dateKey);
    setShowAddSchedule(false);
  }

  return (
    <main className="flex flex-1 flex-col gap-5 overflow-y-auto p-6">
      <Card>
        <MonthView
          year={year}
          month={month}
          selectedKey={selectedKey}
          todayKey={todayKey}
          eventsByDate={visibleScheduleByDate}
          onSelect={setSelectedKey}
          onPrevMonth={() => goToMonth(-1)}
          onNextMonth={() => goToMonth(1)}
          onToday={goToday}
        />
      </Card>

      <Card>
        <DayView
          date={selectedDate}
          events={selectedEvents}
          onAdd={() => setShowAddSchedule(true)}
          canAdd={canAddSchedule}
        />
      </Card>

      {showAddSchedule && canAddSchedule && activeCompany && activeProject && (
        <ScheduleFormModal
          isManagement={role === "management"}
          defaultDate={selectedKey}
          currentStreamerId={CURRENT_STREAMER_ID}
          companyName={activeCompany.name}
          projectId={projectId}
          projectName={activeProject.name}
          streamers={streamers}
          memberships={memberships}
          onClose={() => setShowAddSchedule(false)}
          onSubmit={handleAddSchedule}
        />
      )}
    </main>
  );
}
