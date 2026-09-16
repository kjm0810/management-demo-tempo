"use client";

import { useState } from "react";
import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { Company, Streamer, Project } from "@/components/orgData";

type MembershipModalProps = {
  streamer: Streamer;
  company: Company;
  projects: Project[];
  selectedProjectIds: string[];
  onClose: () => void;
  onSave: (projectIds: string[]) => void;
};

export default function MembershipModal({
  streamer,
  company,
  projects,
  selectedProjectIds,
  onClose,
  onSave,
}: MembershipModalProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set(selectedProjectIds));

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const projectsInCompany = projects.filter((p) => p.companyId === company.id);

  return (
    <Modal title={`${streamer.name} · ${company.name} 프로젝트 선택`} onClose={onClose} widthClassName="max-w-md">
      <div className="flex flex-col gap-4">
        {projectsInCompany.length === 0 ? (
          <p className="text-sm text-slate-500">이 회사에 등록된 프로젝트가 없습니다.</p>
        ) : (
          <div className="flex max-h-64 flex-col gap-1 overflow-y-auto">
            {projectsInCompany.map((p) => (
              <label
                key={p.id}
                className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 hover:bg-white/5"
              >
                <Checkbox checked={selected.has(p.id)} onCheckedChange={() => toggle(p.id)} />
                <div className="flex flex-col">
                  <span className="text-sm text-slate-200">{p.name}</span>
                  <span className="text-xs text-slate-500">담당 {p.managerName}</span>
                </div>
              </label>
            ))}
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            취소
          </Button>
          <Button onClick={() => onSave([...selected])}>저장</Button>
        </div>
      </div>
    </Modal>
  );
}
