import { ActivityIcon, DollarIcon, GiftIcon, UserIcon } from "@/components/icons";

type RevenueStatCardsProps = {
  totalRevenue: number;
  deltaPct: number | null;
  totalDonationCount: number;
  avgViewers: number;
  totalBroadcastHours: number;
};

export default function RevenueStatCards({
  totalRevenue,
  deltaPct,
  totalDonationCount,
  avgViewers,
  totalBroadcastHours,
}: RevenueStatCardsProps) {
  const stats = [
    {
      label: "이번 달 총 수익",
      value: `${totalRevenue.toLocaleString()}원`,
      icon: DollarIcon,
      accent: "text-emerald-300",
      delta: deltaPct,
    },
    {
      label: "총 후원 건수",
      value: `${totalDonationCount.toLocaleString()}건`,
      icon: GiftIcon,
      accent: "text-orange-300",
    },
    {
      label: "평균 시청자",
      value: `${avgViewers.toLocaleString()}명`,
      icon: UserIcon,
      accent: "text-violet-300",
    },
    {
      label: "총 방송 시간",
      value: `${totalBroadcastHours.toLocaleString()}시간`,
      icon: ActivityIcon,
      accent: "text-blue-300",
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
