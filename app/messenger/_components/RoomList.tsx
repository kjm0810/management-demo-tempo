import { Button } from "@/components/ui/button";
import { PlusIcon } from "@/components/icons";
import { colorForStreamer } from "@/components/orgData";
import type { Room, Message } from "../_data";

type RoomListProps = {
  rooms: Room[];
  messagesByRoom: Record<string, Message[]>;
  selectedId: string;
  draftMemberId?: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
  participantName: (id: string) => string;
  members: { id: string; name: string }[];
  onSelectMember: (id: string) => void;
};

function RoomAvatar({ id, name }: { id: string; name: string }) {
  const { gradient } = colorForStreamer(id);
  return (
    <span
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${gradient} text-sm font-semibold text-white`}
    >
      {name.slice(0, 1)}
    </span>
  );
}

export default function RoomList({
  rooms,
  messagesByRoom,
  selectedId,
  draftMemberId = null,
  onSelect,
  onCreate,
  participantName,
  members,
  onSelectMember,
}: RoomListProps) {
  function dmRoomId(memberId: string) {
    return rooms.find((r) => r.participantIds.length === 2 && r.participantIds.includes(memberId))?.id;
  }

  return (
    <div className="flex w-72 shrink-0 flex-col gap-4 overflow-y-auto border-r border-white/5 pr-3">
      <div className="flex flex-col gap-2">
        <Button variant="outline" size="sm" onClick={onCreate}>
          <PlusIcon className="h-3.5 w-3.5" />
          채팅방 만들기
        </Button>

        <span className="px-1 text-[11px] font-medium text-slate-500">채팅방</span>

        {rooms.length === 0 && <p className="px-1 text-xs text-slate-500">참여 중인 채팅방이 없습니다.</p>}

        <div className="flex flex-col">
          {rooms.map((r) => {
            const last = messagesByRoom[r.id]?.at(-1);
            const active = r.id === selectedId;

            return (
              <button
                key={r.id}
                onClick={() => onSelect(r.id)}
                className={`flex items-center gap-3 rounded-lg px-2 py-2.5 text-left transition-colors ${
                  active ? "bg-[#fee500]/10" : "hover:bg-white/5"
                }`}
              >
                <RoomAvatar id={r.id} name={r.name} />

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-medium text-slate-100">{r.name}</span>
                    {last && <span className="shrink-0 text-[10px] text-slate-600">{last.time}</span>}
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-xs text-slate-500">
                      {last ? `${participantName(last.senderId)}: ${last.text}` : `참여자 ${r.participantIds.length}명`}
                    </span>
                    <span className="shrink-0 text-[10px] text-slate-600">{r.participantIds.length}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-1 border-t border-white/5 pt-3">
        <span className="px-1 text-[11px] font-medium text-slate-500">멤버 {members.length}</span>

        {members.length === 0 && <p className="px-1 text-xs text-slate-500">프로젝트에 참여 중인 멤버가 없습니다.</p>}

        <div className="flex flex-col">
          {members.map((m) => {
            const active = m.id === draftMemberId || (dmRoomId(m.id) === selectedId && selectedId !== "");

            return (
              <button
                key={m.id}
                onClick={() => onSelectMember(m.id)}
                className={`flex items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors ${
                  active ? "bg-[#fee500]/10" : "hover:bg-white/5"
                }`}
              >
                <RoomAvatar id={m.id} name={m.name} />
                <span className="truncate text-sm text-slate-200">{m.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
