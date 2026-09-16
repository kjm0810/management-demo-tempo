"use client";

import { useEffect, useMemo, useState } from "react";
import Card from "@/components/Card";
import { useRole } from "@/components/RoleContext";
import { useOrg } from "@/components/OrgContext";
import { useScope } from "@/components/ScopeContext";
import { CURRENT_STREAMER_ID, MGMT_ID, participantsForProject } from "@/components/orgData";
import RoomList from "./_components/RoomList";
import ChatThread from "./_components/ChatThread";
import CreateRoomModal from "./_components/CreateRoomModal";
import InviteModal from "./_components/InviteModal";
import { initialRooms, initialMessages, type Room, type Message } from "./_data";

function nowLabel() {
  return new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: false });
}

export default function MessengerPage() {
  const { role } = useRole();
  const { streamers, memberships, admins, adminMemberships } = useOrg();
  const { projectId } = useScope();

  const currentUserId = role === "management" ? MGMT_ID : CURRENT_STREAMER_ID;

  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [messagesByRoom, setMessagesByRoom] = useState<Record<string, Message[]>>(initialMessages);
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [draftMemberId, setDraftMemberId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showInvite, setShowInvite] = useState(false);

  const projectParticipants = useMemo(
    () => participantsForProject(projectId, streamers, memberships, admins, adminMemberships),
    [projectId, streamers, memberships, admins, adminMemberships]
  );

  function participantName(id: string) {
    return projectParticipants.find((p) => p.id === id)?.name ?? "알 수 없음";
  }

  // 이 프로젝트에서 "나"(현재 role)가 속해 있는 채팅방만
  const myRooms = useMemo(
    () => rooms.filter((r) => r.projectId === projectId && r.participantIds.includes(currentUserId)),
    [rooms, projectId, currentUserId]
  );

  // 가장 최근에 메시지가 온 채팅방이 위로 오도록 정렬 (메시지 없는 방은 맨 아래, 기존 순서 유지)
  const sortedRooms = useMemo(() => {
    return [...myRooms].sort((a, b) => {
      const aTime = messagesByRoom[a.id]?.at(-1)?.time ?? "";
      const bTime = messagesByRoom[b.id]?.at(-1)?.time ?? "";
      if (!aTime || !bTime) return aTime ? -1 : bTime ? 1 : 0;
      return bTime.localeCompare(aTime);
    });
  }, [myRooms, messagesByRoom]);

  useEffect(() => {
    if (draftMemberId) return;
    if (!myRooms.some((r) => r.id === selectedRoomId)) {
      setSelectedRoomId(myRooms[0]?.id ?? "");
    }
  }, [myRooms, selectedRoomId, draftMemberId]);

  useEffect(() => {
    setDraftMemberId(null);
  }, [projectId]);

  const activeRoom = myRooms.find((r) => r.id === selectedRoomId);

  function handleCreateRoom(name: string, participantIds: string[]) {
    const allIds = [...new Set([currentUserId, ...participantIds])];
    const autoName = allIds.map((id) => participantName(id)).join(", ");
    const room: Room = {
      id: crypto.randomUUID(),
      projectId,
      name: name || autoName,
      participantIds: allIds,
    };
    setRooms((prev) => [...prev, room]);
    setSelectedRoomId(room.id);
    setShowCreate(false);
  }

  function handleInvite(participantIds: string[]) {
    if (!activeRoom) return;
    setRooms((prev) =>
      prev.map((r) =>
        r.id === activeRoom.id ? { ...r, participantIds: [...new Set([...r.participantIds, ...participantIds])] } : r
      )
    );
    setShowInvite(false);
  }

  function handleRename(name: string) {
    if (!activeRoom) return;
    setRooms((prev) => prev.map((r) => (r.id === activeRoom.id ? { ...r, name } : r)));
  }

  function handleLeave() {
    if (!activeRoom) return;
    if (!confirm("이 채팅방에서 나가시겠습니까?")) return;
    setRooms((prev) =>
      prev.map((r) =>
        r.id === activeRoom.id ? { ...r, participantIds: r.participantIds.filter((id) => id !== currentUserId) } : r
      )
    );
    setSelectedRoomId("");
  }

  // 멤버를 누르면, 기존 1:1 방이 있으면 그 방을 열고, 없으면 첫 메시지를 보내기 전까지는
  // 실제 채팅방을 만들지 않고 "임시 대화" 상태로만 표시한다 (카카오톡처럼).
  function handleSelectMember(memberId: string) {
    const existing = myRooms.find(
      (r) => r.participantIds.length === 2 && r.participantIds.includes(memberId) && r.participantIds.includes(currentUserId)
    );
    if (existing) {
      setSelectedRoomId(existing.id);
      setDraftMemberId(null);
      return;
    }
    setSelectedRoomId("");
    setDraftMemberId(memberId);
  }

  function handleSend(text: string) {
    if (activeRoom) {
      setMessagesByRoom((prev) => ({
        ...prev,
        [activeRoom.id]: [
          ...(prev[activeRoom.id] ?? []),
          { id: crypto.randomUUID(), roomId: activeRoom.id, senderId: currentUserId, text, time: nowLabel() },
        ],
      }));
      return;
    }

    if (!draftMemberId) return;
    const room: Room = {
      id: crypto.randomUUID(),
      projectId,
      name: participantName(draftMemberId),
      participantIds: [currentUserId, draftMemberId],
    };
    setRooms((prev) => [...prev, room]);
    setMessagesByRoom((prev) => ({
      ...prev,
      [room.id]: [{ id: crypto.randomUUID(), roomId: room.id, senderId: currentUserId, text, time: nowLabel() }],
    }));
    setDraftMemberId(null);
    setSelectedRoomId(room.id);
  }

  const createCandidates = projectParticipants.filter((p) => p.id !== currentUserId);
  const inviteCandidates = activeRoom
    ? projectParticipants.filter((p) => !activeRoom.participantIds.includes(p.id))
    : [];

  return (
    <main className="flex flex-1 flex-col gap-5 overflow-y-auto p-6">
      <Card className="h-[70vh]" width={1}>
        <div className="flex h-full gap-4">
          <RoomList
            rooms={sortedRooms}
            messagesByRoom={messagesByRoom}
            selectedId={activeRoom?.id ?? ""}
            draftMemberId={activeRoom ? null : draftMemberId}
            onSelect={setSelectedRoomId}
            onCreate={() => setShowCreate(true)}
            participantName={participantName}
            members={createCandidates}
            onSelectMember={handleSelectMember}
          />

          {activeRoom ? (
            <ChatThread
              roomName={activeRoom.name}
              participantNames={activeRoom.participantIds.map((id) => participantName(id))}
              messages={messagesByRoom[activeRoom.id] ?? []}
              currentUserId={currentUserId}
              participantName={participantName}
              onSend={handleSend}
              onInvite={() => setShowInvite(true)}
              onLeave={handleLeave}
              onRename={handleRename}
            />
          ) : draftMemberId ? (
            <ChatThread
              roomName={participantName(draftMemberId)}
              participantNames={[participantName(currentUserId), participantName(draftMemberId)]}
              messages={[]}
              currentUserId={currentUserId}
              participantName={participantName}
              onSend={handleSend}
              onInvite={() => setShowInvite(true)}
              onLeave={() => setDraftMemberId(null)}
              isDraft
            />
          ) : (
            <p className="flex flex-1 items-center justify-center text-sm text-slate-500">
              왼쪽에서 채팅방을 선택하거나 새로 만들어보세요.
            </p>
          )}
        </div>
      </Card>

      {showCreate && (
        <CreateRoomModal
          candidates={createCandidates}
          onClose={() => setShowCreate(false)}
          onCreate={handleCreateRoom}
        />
      )}

      {showInvite && (
        <InviteModal candidates={inviteCandidates} onClose={() => setShowInvite(false)} onInvite={handleInvite} />
      )}
    </main>
  );
}
