export type DailyReportEntry = {
  date: string;
  revenue: number;
  viewers: number;
  watchMinutes: number;
  broadcastCount: number;
};

export type RevenueSlice = {
  label: string;
  amount: number;
  color: string;
};

export type StreamerReportStat = {
  streamer: string;
  gradient: string;
  broadcastHours: number;
  broadcastCount: number;
  avgViewers: number;
  chatCount: number;
  donationCount: number;
  revenue: number;
};

/** Math.sin 기반 결정론적 생성 — 서버/클라이언트 렌더링 결과가 항상 같아야 하므로 Math.random은 쓰지 않는다. */
function genDaily(seed: number, days = 14): DailyReportEntry[] {
  const entries: DailyReportEntry[] = [];
  for (let i = 0; i < days; i++) {
    const wave = Math.sin((i + seed * 2) / 2.3);
    const growth = i * (6000 + seed * 1500);
    const revenue = Math.max(60000, Math.round(280000 + seed * 60000 + wave * 130000 + growth));
    const viewers = Math.max(8, Math.round(55 + seed * 12 + wave * 18 + i * 1.1));
    const watchMinutes = Math.max(60, Math.round(viewers * (16 + wave * 3.5)));
    const broadcastCount = wave > 0.15 ? 2 : 1;
    entries.push({
      date: `9.${i + 2}`,
      revenue,
      viewers,
      watchMinutes,
      broadcastCount,
    });
  }
  return entries;
}

/** 프로젝트별 일별 리포트 (기준일 2026-09-15, 최근 14일인 9월 2일~15일 기준 데모 데이터) */
export const dailyReportsByProject: Record<string, DailyReportEntry[]> = {
  p1: genDaily(1),
  p2: genDaily(0.6),
  p3: genDaily(1.6),
  p4: genDaily(0.9),
};

/** 전월 총수익 (증감률 계산용) */
export const lastMonthRevenueByProject: Record<string, number> = {
  p1: 1870000,
  p2: 720000,
  p3: 1540000,
  p4: 640000,
};

/** 프로젝트별 수익 구성 (후원/구독/광고) */
export const revenueBreakdownByProject: Record<string, RevenueSlice[]> = {
  p1: [
    { label: "후원", amount: 2180000, color: "bg-violet-500" },
    { label: "구독", amount: 640000, color: "bg-blue-500" },
    { label: "광고", amount: 210000, color: "bg-teal-500" },
  ],
  p2: [
    { label: "후원", amount: 980000, color: "bg-violet-500" },
    { label: "구독", amount: 310000, color: "bg-blue-500" },
    { label: "광고", amount: 90000, color: "bg-teal-500" },
  ],
  p3: [
    { label: "후원", amount: 1850000, color: "bg-violet-500" },
    { label: "구독", amount: 520000, color: "bg-blue-500" },
    { label: "광고", amount: 175000, color: "bg-teal-500" },
  ],
  p4: [
    { label: "후원", amount: 730000, color: "bg-violet-500" },
    { label: "구독", amount: 260000, color: "bg-blue-500" },
    { label: "광고", amount: 80000, color: "bg-teal-500" },
  ],
};

/** 프로젝트별 스트리머 방송 통계 (수익 랭킹, 방송 통계 리포트 공용) */
export const streamerReportsByProject: Record<string, StreamerReportStat[]> = {
  p1: [
    {
      streamer: "스트리머 A",
      gradient: "from-violet-500 to-purple-700",
      broadcastHours: 62,
      broadcastCount: 18,
      avgViewers: 410,
      chatCount: 8420,
      donationCount: 186,
      revenue: 1420000,
    },
    {
      streamer: "스트리머 B",
      gradient: "from-blue-500 to-indigo-700",
      broadcastHours: 48,
      broadcastCount: 15,
      avgViewers: 265,
      chatCount: 5210,
      donationCount: 97,
      revenue: 760000,
    },
  ],
  p2: [
    {
      streamer: "스트리머 E",
      gradient: "from-orange-500 to-amber-700",
      broadcastHours: 39,
      broadcastCount: 12,
      avgViewers: 198,
      chatCount: 3640,
      donationCount: 74,
      revenue: 980000,
    },
  ],
  p3: [
    {
      streamer: "스트리머 C",
      gradient: "from-teal-500 to-emerald-700",
      broadcastHours: 71,
      broadcastCount: 20,
      avgViewers: 520,
      chatCount: 11230,
      donationCount: 241,
      revenue: 1850000,
    },
  ],
  p4: [
    {
      streamer: "스트리머 F",
      gradient: "from-yellow-500 to-amber-600",
      broadcastHours: 33,
      broadcastCount: 11,
      avgViewers: 150,
      chatCount: 2680,
      donationCount: 58,
      revenue: 520000,
    },
    {
      streamer: "스트리머 D",
      gradient: "from-slate-500 to-slate-700",
      broadcastHours: 21,
      broadcastCount: 8,
      avgViewers: 92,
      chatCount: 1340,
      donationCount: 29,
      revenue: 210000,
    },
  ],
};
