import type { StreamerDonation } from "../_data";

type DonationRankingProps = {
  donations: StreamerDonation[];
};

export default function DonationRanking({ donations }: DonationRankingProps) {
  const total = donations.reduce((sum, d) => sum + d.amount, 0);
  const max = Math.max(1, ...donations.map((d) => d.amount));

  return (
    <>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">스트리머별 후원 금액</h3>
        <span className="text-xs text-slate-500">
          이번 달 총 후원 <span className="text-slate-300">{total.toLocaleString()}원</span>
        </span>
      </div>

      {donations.length === 0 ? (
        <p className="text-xs text-slate-600">이 프로젝트에는 아직 후원 기록이 없습니다.</p>
      ) : (
      <div className="flex flex-col gap-3">
        {donations.map((d, i) => {
          const pct = (d.amount / max) * 100;
          const share = ((d.amount / total) * 100).toFixed(1);

          return (
            <div key={d.streamer} className="flex items-center gap-3">
              <span className="w-5 shrink-0 text-right text-xs text-slate-500">{i + 1}</span>
              <span className={`h-8 w-8 shrink-0 rounded-full bg-gradient-to-br ${d.gradient}`} />
              <div className="flex-1">
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-slate-200">{d.streamer}</span>
                  <span className="text-slate-400">
                    {d.amount.toLocaleString()}원 <span className="text-slate-600">· {share}%</span>
                  </span>
                </div>
                <div className="h-2 rounded-full bg-black/30">
                  <div
                    className={`h-2 rounded-full bg-gradient-to-r ${d.gradient}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      )}
    </>
  );
}
