import type { DailyReportEntry } from "../_data";

type DailyStatsTableProps = {
  data: DailyReportEntry[];
};

export default function DailyStatsTable({ data }: DailyStatsTableProps) {
  const reversed = [...data].reverse();

  return (
    <>
      <h3 className="text-sm font-semibold text-white">일별 상세 지표</h3>

      {data.length === 0 ? (
        <p className="text-xs text-slate-600">데이터가 없습니다.</p>
      ) : (
        <div className="max-h-96 overflow-y-auto overflow-x-auto">
          <table className="w-full min-w-150 border-collapse text-left text-sm">
            <thead className="sticky top-0 bg-[#141a2b]">
              <tr className="text-xs text-slate-500">
                <th className="pb-2 font-medium">날짜</th>
                <th className="pb-2 font-medium">총수익</th>
                <th className="pb-2 font-medium">평균 시청자</th>
                <th className="pb-2 font-medium">시청 시간</th>
                <th className="pb-2 font-medium">방송 횟수</th>
              </tr>
            </thead>
            <tbody>
              {reversed.map((d) => (
                <tr key={d.date} className="border-t border-white/5">
                  <td className="py-2.5 text-slate-200">
                    {d.date.split(".")[0]}월 {d.date.split(".")[1]}일
                  </td>
                  <td className="py-2.5 text-slate-300">{d.revenue.toLocaleString()}원</td>
                  <td className="py-2.5 text-slate-400">{d.viewers.toLocaleString()}명</td>
                  <td className="py-2.5 text-slate-400">
                    {Math.floor(d.watchMinutes / 60)}h {d.watchMinutes % 60}m
                  </td>
                  <td className="py-2.5 text-slate-400">{d.broadcastCount}회</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
