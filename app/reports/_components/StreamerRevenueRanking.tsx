import type { StreamerReportStat } from "../_data";

type StreamerRevenueRankingProps = {
  stats: StreamerReportStat[];
};

export default function StreamerRevenueRanking({ stats }: StreamerRevenueRankingProps) {
  const sorted = [...stats].sort((a, b) => b.revenue - a.revenue);
  const total = sorted.reduce((sum, s) => sum + s.revenue, 0);
  const max = Math.max(1, ...sorted.map((s) => s.revenue));

  return (
    <>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">스트리머별 수익 순위</h3>
        <span className="text-xs text-slate-500">
          합계 <span className="text-slate-300">{total.toLocaleString()}원</span>
        </span>
      </div>

      {sorted.length === 0 ? (
        <p className="text-xs text-slate-600">데이터가 없습니다.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {sorted.map((s, i) => {
            const pct = (s.revenue / max) * 100;
            const share = ((s.revenue / total) * 100).toFixed(1);
            return (
              <div key={s.streamer} className="flex items-center gap-3">
                <span className="w-5 shrink-0 text-right text-xs text-slate-500">{i + 1}</span>
                <span className={`h-8 w-8 shrink-0 rounded-full bg-gradient-to-br ${s.gradient}`} />
                <div className="flex-1">
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-slate-200">{s.streamer}</span>
                    <span className="text-slate-400">
                      {s.revenue.toLocaleString()}원 <span className="text-slate-600">· {share}%</span>
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-black/30">
                    <div className={`h-2 rounded-full bg-gradient-to-r ${s.gradient}`} style={{ width: `${pct}%` }} />
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
