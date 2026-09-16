import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Streamer = {
  name: string;
  status: "LIVE" | "OFFLINE";
  viewers: string;
  duration: string;
  revenue: string;
  startedAt: string;
  gradient: string;
};

const streamers: Streamer[] = [
  { name: "스트리머 A", status: "LIVE", viewers: "1,234", duration: "3h 25m", revenue: "3,850,000", startedAt: "14:02", gradient: "from-violet-500 to-purple-700" },
  { name: "스트리머 B", status: "LIVE", viewers: "987", duration: "2h 10m", revenue: "2,450,000", startedAt: "15:10", gradient: "from-blue-500 to-indigo-700" },
  { name: "스트리머 C", status: "LIVE", viewers: "1,653", duration: "4h 05m", revenue: "4,120,000", startedAt: "13:58", gradient: "from-teal-500 to-emerald-700" },
  { name: "스트리머 D", status: "OFFLINE", viewers: "-", duration: "-", revenue: "-", startedAt: "-", gradient: "from-slate-500 to-slate-700" },
  { name: "스트리머 E", status: "LIVE", viewers: "1,105", duration: "2h 45m", revenue: "2,980,000", startedAt: "14:35", gradient: "from-orange-500 to-amber-700" },
];

export default function StreamerTable() {
  return (
    <>
      <h3 className="text-sm font-semibold text-white">스트리머 목록</h3>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-left text-sm">
          <thead>
            <tr className="text-xs text-slate-500">
              <th className="pb-3 font-medium">스트리머</th>
              <th className="pb-3 font-medium">상태</th>
              <th className="pb-3 font-medium">시청자 수</th>
              <th className="pb-3 font-medium">시청 시간</th>
              <th className="pb-3 font-medium">오늘 수익</th>
              <th className="pb-3 font-medium">방송 시작</th>
            </tr>
          </thead>
          <tbody>
            {streamers.map((s) => (
              <tr key={s.name} className="border-t border-white/5">
                <td className="py-3">
                  <div className="flex items-center gap-2.5">
                    <span className={`h-8 w-8 rounded-full bg-gradient-to-br ${s.gradient}`} />
                    <span className="text-slate-200">{s.name}</span>
                  </div>
                </td>
                <td className="py-3">
                  {s.status === "LIVE" ? (
                    <Badge className="bg-red-600 font-bold text-white">LIVE</Badge>
                  ) : (
                    <Badge className="bg-slate-700 text-slate-300">OFFLINE</Badge>
                  )}
                </td>
                <td className="py-3 text-slate-300">{s.viewers}</td>
                <td className="py-3 text-slate-300">{s.duration}</td>
                <td className="py-3 text-slate-300">{s.revenue}</td>
                <td className="py-3 text-slate-300">{s.startedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Button variant="ghost" size="sm" className="self-center text-slate-400 hover:text-slate-200">
        더 보기 ⌄
      </Button>
    </>
  );
}
