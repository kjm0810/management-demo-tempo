"use client";

import { useState, type FormEvent } from "react";
import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Company, Project } from "@/components/orgData";

type NoticeFormValues = {
  companyId: string;
  projectId: string;
  title: string;
  content: string;
};

type NoticeFormModalProps = {
  title: string;
  submitLabel: string;
  companies: Company[];
  projects: Project[];
  initial?: NoticeFormValues;
  onClose: () => void;
  onSubmit: (companyId: string, projectId: string, title: string, content: string) => void;
};

const ALL_PROJECTS = "__all__";

export default function NoticeFormModal({
  title,
  submitLabel,
  companies,
  projects,
  initial,
  onClose,
  onSubmit,
}: NoticeFormModalProps) {
  const [companyId, setCompanyId] = useState(initial?.companyId ?? companies[0]?.id ?? "");
  const [projectId, setProjectId] = useState(initial?.projectId ?? "");
  const [noticeTitle, setNoticeTitle] = useState(initial?.title ?? "");
  const [content, setContent] = useState(initial?.content ?? "");

  const projectsInCompany = projects.filter((p) => p.companyId === companyId);
  const canSubmit = companyId.length > 0 && noticeTitle.trim().length > 0 && content.trim().length > 0;

  function handleCompanyChange(nextCompanyId: string | null) {
    setCompanyId(nextCompanyId ?? "");
    setProjectId("");
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit(companyId, projectId, noticeTitle.trim(), content.trim());
  }

  return (
    <Modal title={title} onClose={onClose} widthClassName="max-w-lg">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="notice-company" className="text-xs text-slate-400">
            대상 회사
          </Label>
          <Select value={companyId} onValueChange={handleCompanyChange}>
            <SelectTrigger id="notice-company" className="w-full">
              <SelectValue>{companies.find((c) => c.id === companyId)?.name}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {companies.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="notice-project" className="text-xs text-slate-400">
            대상 프로젝트
          </Label>
          <Select
            value={projectId || ALL_PROJECTS}
            onValueChange={(v) => setProjectId(!v || v === ALL_PROJECTS ? "" : v)}
          >
            <SelectTrigger id="notice-project" className="w-full">
              <SelectValue>
                {projectId ? projectsInCompany.find((p) => p.id === projectId)?.name : "전체 (회사 공지)"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_PROJECTS}>전체 (회사 공지)</SelectItem>
              {projectsInCompany.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="notice-title" className="text-xs text-slate-400">
            제목
          </Label>
          <Input
            id="notice-title"
            value={noticeTitle}
            onChange={(e) => setNoticeTitle(e.target.value)}
            placeholder="공지 제목 입력"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="notice-content" className="text-xs text-slate-400">
            내용
          </Label>
          <Textarea
            id="notice-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="공지 내용 입력"
            rows={6}
            className="resize-none"
          />
        </div>

        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            취소
          </Button>
          <Button type="submit" disabled={!canSubmit}>
            {submitLabel}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
