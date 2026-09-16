"use client";

import { useState } from "react";
import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { Admin, Project } from "@/components/orgData";

type ProjectAdminModalProps = {
  project: Project;
  /** 이 프로젝트가 속한 회사의 일반 관리자 목록 (슈퍼 관리자는 개별 프로젝트에 참여하지 않으므로 대상 아님) */
  admins: Admin[];
  selectedAdminIds: string[];
  onClose: () => void;
  onSave: (adminIds: string[]) => void;
};

export default function ProjectAdminModal({
  project,
  admins,
  selectedAdminIds,
  onClose,
  onSave,
}: ProjectAdminModalProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set(selectedAdminIds));

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <Modal title={`${project.name} · 참여 관리자`} onClose={onClose} widthClassName="max-w-md">
      <div className="flex flex-col gap-4">
        {admins.length === 0 ? (
          <p className="text-sm text-slate-500">연결 가능한 일반 관리자가 없습니다.</p>
        ) : (
          <div className="flex max-h-64 flex-col gap-1 overflow-y-auto">
            {admins.map((a) => (
              <label
                key={a.id}
                className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 hover:bg-white/5"
              >
                <Checkbox checked={selected.has(a.id)} onCheckedChange={() => toggle(a.id)} />
                <span className="text-sm text-slate-200">{a.name}</span>
                <span className="text-xs text-slate-500">{a.loginId}</span>
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
