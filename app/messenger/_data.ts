export type Room = {
  id: string;
  projectId: string;
  name: string;
  /** "mgmt", 스트리머 id, 또는 관리자 id */
  participantIds: string[];
};

export type Message = {
  id: string;
  roomId: string;
  senderId: string;
  text: string;
  time: string;
};

/**
 * 채팅방은 프로젝트 단위로 만들어지고, 그 프로젝트의 참여자(매니지먼트사 + 참여 관리자 + 스트리머들) 중
 * 원하는 인원으로 구성된다. 스트리머·매니지먼트사·관리자 누구나 방을 만들고, 사람을 초대하고, 나갈 수 있다.
 */
export const initialRooms: Room[] = [
  { id: "r1", projectId: "p1", name: "9월 정규 방송 전체", participantIds: ["mgmt", "1", "2"] },
  { id: "r2", projectId: "p3", name: "게임 크루 프로젝트 전체", participantIds: ["mgmt", "1", "3"] },
  { id: "r3", projectId: "p4", name: "가을 이벤트 방송 전체", participantIds: ["mgmt", "1", "4", "6", "a2"] },
  { id: "r4", projectId: "p2", name: "여름 콜라보 기획 회고", participantIds: ["mgmt", "1", "3", "5"] },
];

export const initialMessages: Record<string, Message[]> = {
  r1: [
    { id: "m1", roomId: "r1", senderId: "1", text: "이번 주 후원 정산 언제 되나요?", time: "10:02" },
    { id: "m2", roomId: "r1", senderId: "mgmt", text: "10월 5일에 일괄 정산 예정입니다!", time: "10:15" },
    { id: "m3", roomId: "r1", senderId: "1", text: "네 감사합니다", time: "10:16" },
  ],
  r2: [
    { id: "m4", roomId: "r2", senderId: "mgmt", text: "촬영 일정 조율 부탁드려요", time: "11:30" },
    { id: "m5", roomId: "r2", senderId: "3", text: "이번 주 금요일 오후는 어떠신가요?", time: "11:42" },
    { id: "m6", roomId: "r2", senderId: "1", text: "저도 금요일 괜찮습니다!", time: "11:50" },
  ],
  r3: [
    { id: "m7", roomId: "r3", senderId: "mgmt", text: "가을 이벤트 방송 컨셉 회의 9월 18일로 잡았어요, 다들 확인해주세요", time: "09:20" },
    { id: "m8", roomId: "r3", senderId: "4", text: "네 확인했습니다!", time: "09:25" },
    { id: "m9", roomId: "r3", senderId: "a2", text: "저도 참석하겠습니다. 회의실은 제가 예약해둘게요", time: "09:31" },
    { id: "m10", roomId: "r3", senderId: "6", text: "감사합니다 :)", time: "09:33" },
  ],
  r4: [
    { id: "m11", roomId: "r4", senderId: "5", text: "여름 콜라보 기획 마무리 미팅 자료 미리 공유드려요", time: "14:05" },
    { id: "m12", roomId: "r4", senderId: "mgmt", text: "감사합니다! 다음 시즌 기획에도 참고할게요", time: "14:12" },
  ],
};
