"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PencilIcon, TrashIcon, ChevronDownIcon } from "@/components/icons";
import type { Company, Project } from "@/components/orgData";
import type { Notice } from "../_data";

type NoticeListProps = {
  notices: Notice[];
  canManage: boolean;
  companies: Company[];
  projects: Project[];
  onEdit: (notice: Notice) => void;
  onDelete: (id: string) => void;
};

export default function NoticeList({ notices, canManage, companies, projects, onEdit, onDelete }: NoticeListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(notices[0]?.id ?? null);

  if (notices.length === 0) {
    return <p className="text-sm text-slate-500">등록된 공지사항이 없습니다.</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      {notices.map((n) => {
        const expanded = n.id === expandedId;

        return (
          <div key={n.id} className="rounded-xl border border-white/5 bg-black/20">
            <div className="flex w-full items-center justify-between gap-3 px-4 py-3">
              <button
                onClick={() => setExpandedId(expanded ? null : n.id)}
                className="flex min-w-0 flex-1 flex-col gap-0.5 text-left"
              >
                <span className="truncate text-sm font-medium text-slate-100">{n.title}</span>
                <span className="text-xs text-slate-500">
                  {canManage && (
                    <>
                      <span className="text-violet-400">
                        {companies.find((c) => c.id === n.companyId)?.name ?? "알 수 없음"}
                      </span>{" "}
                      ·{" "}
                    </>
                  )}
                  {n.projectId && (
                    <>
                      <span className="text-slate-400">{projects.find((p) => p.id === n.projectId)?.name}</span>{" "}
                      ·{" "}
                    </>
                  )}
                  {n.author} · {n.createdAt}
                </span>
              </button>

              <div className="flex shrink-0 items-center gap-2">
                {canManage && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => onEdit(n)}
                      title="수정"
                      className="text-slate-500 hover:text-violet-300"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => onDelete(n.id)}
                      title="삭제"
                      className="text-slate-500 hover:text-red-400"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </>
                )}
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setExpandedId(expanded ? null : n.id)}
                  className="text-slate-500"
                >
                  <ChevronDownIcon className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
                </Button>
              </div>
            </div>

            {expanded && (
              <p className="whitespace-pre-line border-t border-white/5 px-4 py-3 text-sm text-slate-300">
                {n.content}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
