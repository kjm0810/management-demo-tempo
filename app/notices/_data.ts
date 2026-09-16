export type Notice = {
  id: string;
  companyId: string;
  /** 빈 문자열이면 회사 전체 공지, 값이 있으면 해당 프로젝트 참여자만 보는 공지 */
  projectId: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
};

/** 공지사항은 회사별로, 필요하면 프로젝트 단위로도 분리된다. 기준일 2026-09-15. */
export const initialNotices: Notice[] = [
  {
    id: "1",
    companyId: "co1",
    projectId: "",
    title: "9월 정산 일정 안내",
    content:
      "9월 후원/수익 정산은 10월 5일에 일괄 지급됩니다. 정산 내역은 리포트 페이지에서 확인할 수 있으며, 이의가 있는 경우 정산일 기준 3영업일 이내로 메신저를 통해 문의해 주세요.",
    author: "운영팀",
    createdAt: "2026-09-10",
  },
  {
    id: "2",
    companyId: "co1",
    projectId: "",
    title: "엑셀방송 신규 스튜디오 오픈",
    content:
      "9월 말부터 신규 스튜디오 2관을 오픈합니다. 예약은 캘린더 페이지에서 가능하며, 기존 1관 대비 방음/조명 시설이 개선되었습니다.",
    author: "운영팀",
    createdAt: "2026-08-28",
  },
  {
    id: "3",
    companyId: "co2",
    projectId: "p3",
    title: "게임 크루 프로젝트 촬영 일정 변경",
    content:
      "다음 주 촬영 일정이 목요일에서 금요일로 변경되었습니다. 참여 스트리머분들은 캘린더에서 변경된 일정을 확인해 주세요.",
    author: "회사 B",
    createdAt: "2026-09-08",
  },
  {
    id: "4",
    companyId: "co2",
    projectId: "",
    title: "플랫폼 연동 점검 안내",
    content:
      "8월 22일 새벽 2시~4시 사이 SOOP/치지직 연동 점검이 예정되어 있습니다. 해당 시간 동안 실시간 모니터링 수치가 일시적으로 표시되지 않을 수 있습니다.",
    author: "시스템",
    createdAt: "2026-08-20",
  },
  {
    id: "5",
    companyId: "co1",
    projectId: "p2",
    title: "여름 콜라보 기획 마무리 미팅",
    content: "여름 콜라보 기획 참여 스트리머 대상 마무리 회고 미팅을 진행합니다. 메신저로 링크를 보내드릴게요.",
    author: "회사 A",
    createdAt: "2026-08-15",
  },
  {
    id: "6",
    companyId: "co2",
    projectId: "p4",
    title: "가을 이벤트 방송 사전 회의",
    content: "가을 이벤트 방송 컨셉 회의를 9월 18일에 진행합니다. 참여 스트리머분들은 일정 확인 부탁드려요.",
    author: "회사 B",
    createdAt: "2026-09-05",
  },
  {
    id: "7",
    companyId: "co1",
    projectId: "p5",
    title: "연말 이벤트 기획 킥오프 안내",
    content:
      "연말 이벤트 기획 프로젝트가 새로 시작됩니다. 담당 관리자는 곧 배정될 예정이며, 참여 스트리머는 첫 방송 일정을 캘린더에서 확인해 주세요.",
    author: "회사 A",
    createdAt: "2026-09-12",
  },
  {
    id: "8",
    companyId: "co2",
    projectId: "p6",
    title: "신인 발굴 프로젝트 참여 스트리머 모집 완료",
    content: "신인 발굴 프로젝트 1기 참여 스트리머 모집이 완료되었습니다. 첫 방송은 9월 24일로 예정되어 있습니다.",
    author: "회사 B",
    createdAt: "2026-09-14",
  },
  {
    id: "9",
    companyId: "co1",
    projectId: "",
    title: "정기 시스템 점검 안내",
    content: "9월 20일 새벽 1시~3시 사이 정기 시스템 점검이 진행됩니다. 해당 시간 동안 일부 기능 이용이 제한될 수 있습니다.",
    author: "시스템",
    createdAt: "2026-09-15",
  },
];
