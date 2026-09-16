export type ScheduleEvent = {
  id: string;
  streamer: string;
  gradient: string;
  companyId: string;
  projectId: string;
  startHour: number;
  endHour: number;
  label: string;
  color: string;
};

function makeKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

// 데모 목적: 스트리머별 기본 소속 회사/프로젝트를 고정 배정 (스트리머 A는 여러 회사·프로젝트에 걸쳐 있어 이벤트별로 override됨).
// 기준일 2026-09-15 — 그 이전은 "방송 완료", 그날은 "방송 진행 중", 이후는 "방송 예정"으로 구성.
const A = { streamer: "스트리머 A", gradient: "from-violet-500 to-purple-700", color: "bg-violet-600", companyId: "co1", projectId: "p1" };
const B = { streamer: "스트리머 B", gradient: "from-blue-500 to-indigo-700", color: "bg-blue-600", companyId: "co1", projectId: "p1" };
const C = { streamer: "스트리머 C", gradient: "from-teal-500 to-emerald-700", color: "bg-teal-600", companyId: "co2", projectId: "p3" };
const D = { streamer: "스트리머 D", gradient: "from-slate-500 to-slate-700", color: "bg-slate-600", companyId: "co2", projectId: "p4" };
const E = { streamer: "스트리머 E", gradient: "from-orange-500 to-amber-700", color: "bg-orange-600", companyId: "co1", projectId: "p2" };
const F = { streamer: "스트리머 F", gradient: "from-yellow-500 to-amber-600", color: "bg-yellow-600", companyId: "co2", projectId: "p4" };
const G = { streamer: "스트리머 G", gradient: "from-pink-500 to-rose-700", color: "bg-pink-600", companyId: "co1", projectId: "p5" };
const H = { streamer: "스트리머 H", gradient: "from-cyan-500 to-sky-700", color: "bg-cyan-600", companyId: "co2", projectId: "p6" };

export const scheduleByDate: Record<string, ScheduleEvent[]> = {
  [makeKey(2026, 8, 1)]: [
    { id: "1-a", ...A, startHour: 14, endHour: 17, label: "방송 완료" },
    { id: "1-c", ...C, startHour: 20, endHour: 23, label: "방송 완료" },
  ],
  [makeKey(2026, 8, 3)]: [{ id: "3-b", ...B, startHour: 19, endHour: 22, label: "방송 완료" }],
  [makeKey(2026, 8, 5)]: [
    // 스트리머 A는 낮/저녁 두 번 방송 — 같은 회사(회사 A) 안에서도 서로 다른 프로젝트 소속
    { id: "5-a1", ...A, startHour: 13.1, endHour: 16.7, label: "방송 완료" },
    { id: "5-a2", ...A, projectId: "p2", startHour: 20, endHour: 22.5, label: "방송 완료" },
    { id: "5-b", ...B, startHour: 15.2, endHour: 16.7, label: "방송 완료" },
    { id: "5-c", ...C, startHour: 12.0, endHour: 14.1, label: "방송 완료" },
    { id: "5-d", ...D, startHour: 18.1, endHour: 19.6, label: "방송 완료" },
    { id: "5-e", ...E, startHour: 14.0, endHour: 18.5, label: "방송 완료" },
    { id: "5-f", ...F, startHour: 15.5, endHour: 17.0, label: "방송 완료" },
  ],
  [makeKey(2026, 8, 8)]: [
    { id: "8-b", ...B, startHour: 13, endHour: 16, label: "방송 완료" },
    { id: "8-d", ...D, startHour: 16, endHour: 19, label: "방송 완료" },
  ],
  [makeKey(2026, 8, 10)]: [{ id: "10-e", ...E, startHour: 18, endHour: 21, label: "방송 완료" }],
  [makeKey(2026, 8, 12)]: [
    // 이 날은 스트리머 A가 회사 B 쪽 프로젝트로 방송 (다른 회사)
    { id: "12-a", ...A, companyId: "co2", projectId: "p3", startHour: 15, endHour: 18, label: "방송 완료" },
    { id: "12-f", ...F, startHour: 19, endHour: 21.5, label: "방송 완료" },
  ],
  [makeKey(2026, 8, 14)]: [
    { id: "14-a", ...A, startHour: 13, endHour: 15, label: "방송 완료" },
    { id: "14-b", ...B, startHour: 15, endHour: 17, label: "방송 완료" },
    { id: "14-c", ...C, startHour: 17, endHour: 19, label: "방송 완료" },
  ],
  // 2026-09-15: 오늘 — 낮 방송은 이미 끝났고, 저녁 방송이 진행 중
  [makeKey(2026, 8, 15)]: [
    { id: "15-b", ...B, startHour: 11, endHour: 13, label: "방송 완료" },
    { id: "15-a", ...A, startHour: 19, endHour: 23, label: "방송 진행 중" },
    { id: "15-c", ...C, startHour: 20, endHour: 22, label: "방송 진행 중" },
  ],
  [makeKey(2026, 8, 17)]: [{ id: "17-c", ...C, startHour: 14, endHour: 17, label: "방송 예정" }],
  [makeKey(2026, 8, 19)]: [
    { id: "19-d", ...D, startHour: 12, endHour: 15, label: "방송 예정" },
    { id: "19-e", ...E, startHour: 16, endHour: 19, label: "방송 예정" },
    { id: "19-f", ...F, startHour: 19.5, endHour: 22, label: "방송 예정" },
  ],
  [makeKey(2026, 8, 21)]: [
    // 신규 프로젝트 킥오프 방송 — 스트리머 G/H가 합류 후 첫 방송을 준비
    { id: "21-g", ...G, startHour: 20, endHour: 22, label: "첫 방송 예정" },
  ],
  [makeKey(2026, 8, 24)]: [
    { id: "24-a", ...A, startHour: 14, endHour: 16.5, label: "방송 예정" },
    { id: "24-h", ...H, startHour: 21, endHour: 23, label: "첫 방송 예정" },
  ],
  [makeKey(2026, 8, 27)]: [
    { id: "27-b", ...B, startHour: 15, endHour: 18, label: "방송 예정" },
    { id: "27-f", ...F, startHour: 19, endHour: 21.5, label: "방송 예정" },
  ],
};
