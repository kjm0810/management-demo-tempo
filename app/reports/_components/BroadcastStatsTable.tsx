import type { StreamerReportStat } from "../_data";

type BroadcastStatsTableProps = {
  stats: StreamerReportStat[];
};

export default function BroadcastStatsTable({ stats }: BroadcastStatsTableProps) {
  const sorted = [...stats].sort((a, b) => b.broadcastHours - a.broadcastHours);

  return (
    <>
      <h3 className="text-sm font-semibold text-white">스트리머별 방송 지표</h3>

      {sorted.length === 0 ? (
        <p className="text-xs text-slate-600">데이터가 없습니다.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-180 border-collapse text-left text-sm">
            <thead>
              <tr className="text-xs text-slate-500">
                <th className="pb-2 font-medium">스트리머</th>
                <th className="pb-2 font-medium">방송 시간</th>
                <th className="pb-2 font-medium">방송 횟수</th>
                <th className="pb-2 font-medium">평균 시청자</th>
                <th className="pb-2 font-medium">채팅 수</th>
                <th className="pb-2 font-medium">후원 건수</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((s) => (
                <tr key={s.streamer} className="border-t border-white/5">
                  <td className="py-2.5">
                    <div className="flex items-center gap-2.5">
                      <span className={`h-6 w-6 shrink-0 rounded-full bg-gradient-to-br ${s.gradient}`} />
                      <span className="text-slate-200">{s.streamer}</span>
                    </div>
                  </td>
                  <td className="py-2.5 text-slate-300">{s.broadcastHours}시간</td>
                  <td className="py-2.5 text-slate-400">{s.broadcastCount}회</td>
                  <td className="py-2.5 text-slate-400">{s.avgViewers.toLocaleString()}명</td>
                  <td className="py-2.5 text-slate-400">{s.chatCount.toLocaleString()}건</td>
                  <td className="py-2.5 text-slate-400">{s.donationCount.toLocaleString()}건</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
