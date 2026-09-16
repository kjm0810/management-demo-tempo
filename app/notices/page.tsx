"use client";

import { useState } from "react";
import Card from "@/components/Card";
import { useRole } from "@/components/RoleContext";
import { useOrg } from "@/components/OrgContext";
import { useScope } from "@/components/ScopeContext";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@/components/icons";
import NoticeList from "./_components/NoticeList";
import NoticeFormModal from "./_components/NoticeFormModal";
import { initialNotices, type Notice } from "./_data";

export default function NoticesPage() {
  const { role } = useRole();
  const canManage = role === "management";
  const { companies, projects } = useOrg();
  const { companyId, projectId } = useScope();

  const [notices, setNotices] = useState<Notice[]>(initialNotices);
  const [showCreate, setShowCreate] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);

  const visibleNotices = !companyId
    ? notices
    : notices.filter(
        (n) => n.companyId === companyId && (!projectId || n.projectId === "" || n.projectId === projectId)
      );

  function handleCreate(companyId: string, projectId: string, title: string, content: string) {
    setNotices((prev) => [
      {
        id: crypto.randomUUID(),
        companyId,
        projectId,
        title,
        content,
        author: "매니지먼트사",
        createdAt: new Date().toISOString().slice(0, 10),
      },
      ...prev,
    ]);
    setShowCreate(false);
  }

  function handleEditSave(companyId: string, projectId: string, title: string, content: string) {
    if (!editingNotice) return;
    setNotices((prev) =>
      prev.map((n) => (n.id === editingNotice.id ? { ...n, companyId, projectId, title, content } : n))
    );
    setEditingNotice(null);
  }

  function handleDelete(id: string) {
    if (!confirm("이 공지사항을 삭제할까요?")) return;
    setNotices((prev) => prev.filter((n) => n.id !== id));
  }

  return (
    <main className="flex flex-1 flex-col gap-5 overflow-y-auto p-6">
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-white">공지사항</h1>
            <p className="text-sm text-slate-400">회사 공지사항을 전달하고 확인하는 공간입니다.</p>
          </div>
          {canManage && (
            <Button onClick={() => setShowCreate(true)}>
              <PlusIcon className="h-4 w-4" />
              공지 작성
            </Button>
          )}
        </div>

        <div className="mt-4">
          <NoticeList
            notices={visibleNotices}
            canManage={canManage}
            companies={companies}
            projects={projects}
            onEdit={setEditingNotice}
            onDelete={handleDelete}
          />
        </div>
      </Card>

      {showCreate && (
        <NoticeFormModal
          title="공지 작성"
          submitLabel="등록"
          companies={companies}
          projects={projects}
          onClose={() => setShowCreate(false)}
          onSubmit={handleCreate}
        />
      )}

      {editingNotice && (
        <NoticeFormModal
          title="공지 수정"
          submitLabel="저장"
          companies={companies}
          projects={projects}
          initial={{
            companyId: editingNotice.companyId,
            projectId: editingNotice.projectId,
            title: editingNotice.title,
            content: editingNotice.content,
          }}
          onClose={() => setEditingNotice(null)}
          onSubmit={handleEditSave}
        />
      )}
    </main>
  );
}
