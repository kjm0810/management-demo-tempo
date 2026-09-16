"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendIcon, PlusIcon, PencilIcon } from "@/components/icons";
import { colorForStreamer } from "@/components/orgData";
import type { Message } from "../_data";

type ChatThreadProps = {
  roomName: string;
  participantNames: string[];
  messages: Message[];
  currentUserId: string;
  participantName: (id: string) => string;
  onSend: (text: string) => void;
  onInvite: () => void;
  onLeave: () => void;
  /** 아직 첫 메시지를 보내지 않아 실제 채팅방이 생성되지 않은 임시 대화 상태 */
  isDraft?: boolean;
  /** 채팅방 제목 변경. 임시 대화(isDraft)에서는 넘기지 않으면 수정 버튼이 숨겨진다. */
  onRename?: (name: string) => void;
};

function Avatar({ id, name }: { id: string; name: string }) {
  const { gradient } = colorForStreamer(id);
  return (
    <span
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${gradient} text-xs font-semibold text-white`}
    >
      {name.slice(0, 1)}
    </span>
  );
}

const todayLabel = new Date().toLocaleDateString("ko-KR", {
  year: "numeric",
  month: "long",
  day: "numeric",
  weekday: "long",
});

export default function ChatThread({
  roomName,
  participantNames,
  messages,
  currentUserId,
  participantName,
  onSend,
  onInvite,
  onLeave,
  isDraft = false,
  onRename,
}: ChatThreadProps) {
  const [draft, setDraft] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(roomName);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!editingName) setNameDraft(roomName);
  }, [roomName, editingName]);

  useEffect(() => {
    if (editingName) nameInputRef.current?.select();
  }, [editingName]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!draft.trim()) return;
    onSend(draft.trim());
    setDraft("");
  }

  function startEditingName() {
    if (!onRename) return;
    setNameDraft(roomName);
    setEditingName(true);
  }

  function commitName() {
    const trimmed = nameDraft.trim();
    if (trimmed && trimmed !== roomName) onRename?.(trimmed);
    setEditingName(false);
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-3">
        <div className="min-w-0">
          {editingName ? (
            <input
              ref={nameInputRef}
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              onBlur={commitName}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  commitName();
                } else if (e.key === "Escape") {
                  setNameDraft(roomName);
                  setEditingName(false);
                }
              }}
              className="w-full rounded border border-white/10 bg-transparent px-1 text-sm font-semibold text-slate-100 outline-none focus-visible:border-[#fee500]"
            />
          ) : (
            <div className="flex items-center gap-1">
              <div className="truncate text-sm font-semibold text-slate-100">
                {roomName} <span className="font-normal text-slate-500">{participantNames.length}</span>
              </div>
              {onRename && (
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={startEditingName}
                  title="채팅방 제목 수정"
                  className="shrink-0 text-slate-500 hover:text-slate-200"
                >
                  <PencilIcon className="h-3 w-3" />
                </Button>
              )}
            </div>
          )}
          <div className="truncate text-xs text-slate-500">{participantNames.join(", ")}</div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {!isDraft && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onInvite}
              title="대화상대 초대"
              className="text-slate-400 hover:text-slate-200"
            >
              <PlusIcon className="h-4 w-4" />
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={onLeave} className="text-slate-400 hover:text-red-400">
            {isDraft ? "닫기" : "나가기"}
          </Button>
        </div>
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto rounded-lg bg-[#0b0e1a] px-3 py-4">
        {messages.length === 0 && (
          <p className="flex flex-1 items-center justify-center text-sm text-slate-500">
            {isDraft ? "메시지를 보내면 대화가 시작됩니다." : "아직 대화가 없습니다."}
          </p>
        )}

        {messages.length > 0 && (
          <div className="mb-3 flex justify-center">
            <span className="rounded-full bg-white/5 px-3 py-1 text-[11px] text-slate-400">{todayLabel}</span>
          </div>
        )}

        {messages.map((m, i) => {
          const mine = m.senderId === currentUserId;
          const prev = messages[i - 1];
          const next = messages[i + 1];
          const firstInGroup = !prev || prev.senderId !== m.senderId;
          const lastInGroup = !next || next.senderId !== m.senderId;
          const corner = firstInGroup ? (mine ? "rounded-tr-sm" : "rounded-tl-sm") : "";

          return (
            <div
              key={m.id}
              className={`flex items-end gap-2 ${mine ? "flex-row-reverse" : ""} ${firstInGroup ? "mt-2.5" : "mt-0.5"}`}
            >
              {!mine && (
                <div className="w-9 shrink-0 self-start">
                  {firstInGroup && <Avatar id={m.senderId} name={participantName(m.senderId)} />}
                </div>
              )}

              <div className={`flex max-w-[70%] flex-col gap-0.5 ${mine ? "items-end" : "items-start"}`}>
                {!mine && firstInGroup && (
                  <span className="px-1 text-[11.5px] text-slate-400">{participantName(m.senderId)}</span>
                )}
                <div className={`flex items-end gap-1.5 ${mine ? "flex-row-reverse" : ""}`}>
                  <div
                    className={`rounded-2xl px-3.5 py-2 text-sm leading-relaxed break-words ${corner} ${
                      mine ? "bg-[#fee500] text-[#3c1e1e]" : "bg-[#1e2540] text-slate-100"
                    }`}
                  >
                    {m.text}
                  </div>
                  {lastInGroup && <span className="shrink-0 pb-0.5 text-[10px] text-slate-600">{m.time}</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-white/5 pt-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="shrink-0 rounded-full text-slate-400 hover:text-slate-200"
        >
          <PlusIcon className="h-4 w-4" />
        </Button>
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="메시지 입력"
          className="flex-1 rounded-full"
        />
        <Button
          type="submit"
          size="icon"
          disabled={!draft.trim()}
          className="shrink-0 rounded-full bg-[#fee500] text-[#3c1e1e] hover:bg-[#fada00]"
        >
          <SendIcon className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
