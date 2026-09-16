import { MegaphoneIcon } from "@/components/icons";
import type { Notice } from "@/app/notices/_data";

type RecentNoticesProps = {
  notices: Notice[];
};

export default function RecentNotices({ notices }: RecentNoticesProps) {
  return (
    <>
      <div className="flex items-center gap-2">
        <MegaphoneIcon className="h-4 w-4 text-slate-400" />
        <h3 className="text-sm font-semibold text-white">최근 공지사항</h3>
      </div>

      {notices.length === 0 ? (
        <p className="text-xs text-slate-600">등록된 공지사항이 없습니다.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {notices.map((n) => (
            <div key={n.id} className="rounded-lg border border-white/10 bg-black/20 px-3 py-2">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-sm text-slate-200">{n.title}</span>
                <span className="shrink-0 text-xs text-slate-500">{n.createdAt}</span>
              </div>
              <p className="mt-1 truncate text-xs text-slate-500">{n.content}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
