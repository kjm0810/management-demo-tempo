import { ActivityIcon, DollarIcon, MonitorIcon, UserIcon } from "@/components/icons";

type StatCardsProps = {
  streamerCount: number;
  adminCount: number;
  totalDonation: number;
  donationDeltaPct: number | null;
  broadcastCount: number;
};

export default function StatCards({
  streamerCount,
  adminCount,
  totalDonation,
  donationDeltaPct,
  broadcastCount,
}: StatCardsProps) {
  const stats = [
    {
      label: "참여 스트리머",
      value: `${streamerCount}명`,
      icon: UserIcon,
      accent: "text-violet-300",
    },
    {
      label: "담당 관리자",
      value: `${adminCount}명`,
      icon: MonitorIcon,
      accent: "text-blue-300",
    },
    {
      label: "이번 달 총 후원",
      value: `${totalDonation.toLocaleString()}원`,
      icon: DollarIcon,
      accent: "text-emerald-300",
      delta: donationDeltaPct,
    },
    {
      label: "이번 달 방송 횟수",
      value: `${broadcastCount}회`,
      icon: ActivityIcon,
      accent: "text-orange-300",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="flex flex-col gap-3 rounded-xl border border-white/10 bg-black/20 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">{s.label}</span>
            <s.icon className={`h-4 w-4 ${s.accent}`} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-semibold text-white">{s.value}</span>
            {typeof s.delta === "number" && (
              <span className={`text-xs font-medium ${s.delta >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                {s.delta >= 0 ? "▲" : "▼"} {Math.abs(s.delta).toFixed(1)}%
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
