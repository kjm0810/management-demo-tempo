import { PersonSmallIcon, SignalIcon } from "@/components/icons";

const streams = [
  { viewers: "1,234", gradient: "from-fuchsia-700 via-purple-800 to-slate-900" },
  { viewers: "987", gradient: "from-indigo-800 via-slate-800 to-slate-900" },
  { viewers: "1,105", gradient: "from-sky-800 via-blue-900 to-slate-900" },
  { viewers: "1,653", gradient: "from-slate-700 via-indigo-900 to-slate-900" },
  { viewers: "1,320", gradient: "from-slate-800 via-slate-900 to-black" },
  { viewers: "1,089", gradient: "from-purple-800 via-fuchsia-900 to-slate-900" },
];

export default function LiveMonitoring() {
  return (
    <>
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-violet-500" />
        <h3 className="text-sm font-semibold tracking-wide text-white">LIVE MONITORING</h3>
      </div>

      <div className="grid flex-1 grid-cols-3 gap-3">
        {streams.map((s, i) => (
          <div
            key={i}
            className={`relative aspect-video overflow-hidden rounded-xl bg-gradient-to-br ${s.gradient}`}
          >
            <span className="absolute left-2 top-2 rounded bg-red-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
              LIVE
            </span>
            <div className="absolute bottom-2 left-2 flex items-center gap-1 text-[11px] text-white/90">
              <PersonSmallIcon />
              {s.viewers}
            </div>
            <div className="absolute bottom-2 right-2 text-emerald-400">
              <SignalIcon />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
