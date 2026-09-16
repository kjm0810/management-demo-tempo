"use client";

import { useState } from "react";
import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ParticipantCheckList from "./ParticipantCheckList";

type CreateRoomModalProps = {
  candidates: { id: string; name: string }[];
  onClose: () => void;
  onCreate: (name: string, participantIds: string[]) => void;
};

export default function CreateRoomModal({ candidates, onClose, onCreate }: CreateRoomModalProps) {
  const [name, setName] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const canCreate = selected.size > 0;

  return (
    <Modal title="채팅방 만들기" onClose={onClose} widthClassName="max-w-md">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="room-name" className="text-xs text-slate-400">
            방 이름 (선택)
          </Label>
          <Input
            id="room-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="비워두면 참여자 이름으로 자동 생성"
          />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs text-slate-400">참여자 선택</span>
          <ParticipantCheckList candidates={candidates} selected={selected} onToggle={toggle} />
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            취소
          </Button>
          <Button onClick={() => onCreate(name.trim(), [...selected])} disabled={!canCreate}>
            만들기
          </Button>
        </div>
      </div>
    </Modal>
  );
}
