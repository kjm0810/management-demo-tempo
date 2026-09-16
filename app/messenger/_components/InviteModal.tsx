"use client";

import { useState } from "react";
import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import ParticipantCheckList from "./ParticipantCheckList";

type InviteModalProps = {
  candidates: { id: string; name: string }[];
  onClose: () => void;
  onInvite: (participantIds: string[]) => void;
};

export default function InviteModal({ candidates, onClose, onInvite }: InviteModalProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <Modal title="참여자 초대" onClose={onClose} widthClassName="max-w-md">
      <div className="flex flex-col gap-4">
        <ParticipantCheckList candidates={candidates} selected={selected} onToggle={toggle} />

        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            취소
          </Button>
          <Button onClick={() => onInvite([...selected])} disabled={selected.size === 0}>
            초대
          </Button>
        </div>
      </div>
    </Modal>
  );
}
