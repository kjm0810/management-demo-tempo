"use client";

import { useState, type FormEvent } from "react";
import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Company } from "@/components/orgData";

type ProjectFormModalProps = {
  company: Company;
  onClose: () => void;
  onSubmit: (name: string, managerName: string) => void;
};

export default function ProjectFormModal({ company, onClose, onSubmit }: ProjectFormModalProps) {
  const [name, setName] = useState("");
  const [managerName, setManagerName] = useState("");

  const canSubmit = name.trim().length > 0;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit(name.trim(), managerName.trim());
  }

  return (
    <Modal title="프로젝트 추가" onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <p className="rounded-lg border border-white/10 bg-black/10 px-3 py-2 text-xs text-slate-400">
          <span className="text-slate-300">{company.name}</span>에 프로젝트를 추가합니다 (1 관리자 : 1 회사이므로
          다른 회사는 선택할 수 없습니다)
        </p>

        <div className="flex flex-col gap-2">
          <Label htmlFor="project-name" className="text-xs text-slate-400">
            프로젝트명
          </Label>
          <Input
            id="project-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="프로젝트명 입력"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="project-manager" className="text-xs text-slate-400">
            담당 관리자 <span className="text-slate-600">(선택)</span>
          </Label>
          <Input
            id="project-manager"
            value={managerName}
            onChange={(e) => setManagerName(e.target.value)}
            placeholder="아직 배정되지 않았다면 비워두세요"
          />
        </div>

        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            취소
          </Button>
          <Button type="submit" disabled={!canSubmit}>
            추가
          </Button>
        </div>
      </form>
    </Modal>
  );
}
