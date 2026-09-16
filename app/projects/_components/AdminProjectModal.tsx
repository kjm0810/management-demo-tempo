"use client";

import { useState } from "react";
import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { Admin, Project } from "@/components/orgData";

type AdminProjectModalProps = {
  admin: Admin;
  /** 이 관리자가 속한 회사의 프로젝트 목록 (1 관리자 : 1 회사이므로 이미 그 회사로 필터링된 상태) */
  projects: Project[];
  selectedProjectIds: string[];
  onClose: () => void;
  onSave: (projectIds: string[]) => void;
};

export default function AdminProjectModal({
  admin,
  projects,
  selectedProjectIds,
  onClose,
  onSave,
}: AdminProjectModalProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set(selectedProjectIds));

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <Modal title={`${admin.name} · 참여 프로젝트`} onClose={onClose} widthClassName="max-w-md">
      <div className="flex flex-col gap-4">
        {projects.length === 0 ? (
          <p className="text-sm text-slate-500">등록된 프로젝트가 없습니다.</p>
        ) : (
          <div className="flex max-h-64 flex-col gap-1 overflow-y-auto">
            {projects.map((p) => (
              <label
                key={p.id}
                className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 hover:bg-white/5"
              >
                <Checkbox checked={selected.has(p.id)} onCheckedChange={() => toggle(p.id)} />
                <span className="text-sm text-slate-200">{p.name}</span>
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
