export type StreamerDonation = {
  streamer: string;
  gradient: string;
  amount: number;
  companyId: string;
  projectId: string;
};

/** 캘린더 데모 데이터(app/calendar/_data.ts)와 동일한 회사/프로젝트 배정을 사용해 스코프 필터링이 일관되게 동작한다. */
export const donationsThisMonth: StreamerDonation[] = [
  { streamer: "스트리머 C", gradient: "from-teal-500 to-emerald-700", amount: 1850000, companyId: "co2", projectId: "p3" },
  { streamer: "스트리머 A", gradient: "from-violet-500 to-purple-700", amount: 1420000, companyId: "co1", projectId: "p1" },
  { streamer: "스트리머 E", gradient: "from-orange-500 to-amber-700", amount: 980000, companyId: "co1", projectId: "p2" },
  { streamer: "스트리머 B", gradient: "from-blue-500 to-indigo-700", amount: 760000, companyId: "co1", projectId: "p1" },
  { streamer: "스트리머 F", gradient: "from-yellow-500 to-amber-600", amount: 520000, companyId: "co2", projectId: "p4" },
  { streamer: "스트리머 D", gradient: "from-slate-500 to-slate-700", amount: 210000, companyId: "co2", projectId: "p4" },
];

export const donationsLastMonth: StreamerDonation[] = [
  { streamer: "스트리머 A", gradient: "from-violet-500 to-purple-700", amount: 1180000, companyId: "co1", projectId: "p1" },
  { streamer: "스트리머 C", gradient: "from-teal-500 to-emerald-700", amount: 1560000, companyId: "co2", projectId: "p3" },
  { streamer: "스트리머 E", gradient: "from-orange-500 to-amber-700", amount: 860000, companyId: "co1", projectId: "p2" },
  { streamer: "스트리머 B", gradient: "from-blue-500 to-indigo-700", amount: 690000, companyId: "co1", projectId: "p1" },
  { streamer: "스트리머 F", gradient: "from-yellow-500 to-amber-600", amount: 430000, companyId: "co2", projectId: "p4" },
  { streamer: "스트리머 D", gradient: "from-slate-500 to-slate-700", amount: 150000, companyId: "co2", projectId: "p4" },
];
