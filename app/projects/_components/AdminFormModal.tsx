"use client";

import { useState, type FormEvent } from "react";
import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AdminFormModalProps = {
  companyName: string;
  onClose: () => void;
  onSubmit: (name: string, loginId: string, password: string) => void;
};

export default function AdminFormModal({ companyName, onClose, onSubmit }: AdminFormModalProps) {
  const [name, setName] = useState("");
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const canSubmit = name.trim().length > 0 && loginId.trim().length > 0 && password.trim().length > 0;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit(name.trim(), loginId.trim(), password.trim());
  }

  return (
    <Modal title="일반 관리자 추가" onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <p className="rounded-lg border border-white/10 bg-black/10 px-3 py-2 text-xs text-slate-400">
          <span className="text-slate-300">{companyName}</span>에 일반 관리자를 추가합니다. (슈퍼 관리자는 회사당
          1명으로 고정되어 이 화면에서 만들 수 없습니다)
        </p>

        <div className="flex flex-col gap-2">
          <Label htmlFor="admin-name" className="text-xs text-slate-400">
            이름
          </Label>
          <Input
            id="admin-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="관리자 이름 입력"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="admin-login-id" className="text-xs text-slate-400">
            아이디
          </Label>
          <Input
            id="admin-login-id"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
            placeholder="로그인 아이디 입력"
            autoComplete="off"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="admin-password" className="text-xs text-slate-400">
            비밀번호
          </Label>
          <Input
            id="admin-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호 입력"
            autoComplete="new-password"
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
