export type Platform = 'soop' | 'chzzk' | 'youtube';

export const platformMeta: Record<Platform, { label: string; color: string }> = {
  soop: { label: 'SOOP', color: 'bg-sky-600' },
  chzzk: { label: '치지직', color: 'bg-lime-600' },
  youtube: { label: '유튜브', color: 'bg-red-600' }
};

export type StreamerPlatformAccount = {
  platform: Platform;
  handle: string;
};

export type Streamer = {
  id: string;
  name: string;
  loginId: string;
  platformAccounts: StreamerPlatformAccount[];
  connectedAt: string;
};

/**
 * 회사 - 프로젝트 - 스트리머 구조.
 * 스트리머 한 명이 여러 회사의 여러 프로젝트에 동시에 속할 수 있음 (Membership으로 다대다 표현).
 * 회사/프로젝트는 관리자를 갖지만, 스트리머 계정 자체는 관리자가 될 수 없다 (권한 체계상 management/streamer role만 존재).
 */
export type Company = {
  id: string;
  name: string;
  managerName: string;
};

export type Project = {
  id: string;
  name: string;
  companyId: string;
  managerName: string;
};

export type Membership = {
  streamerId: string;
  projectId: string;
};

export type ProjectInviteStatus = 'pending' | 'accepted' | 'expired';

export type ProjectInvite = {
  id: string;
  projectId: string;
  inviteCode: string;
  status: ProjectInviteStatus;

  // 기존 가입자 초대
  streamerId?: string;

  // 미가입자 초대
  phoneNumber?: string;

  createdAt: string;
  expiresAt: string;
};

/** 관리자 등급. 슈퍼 관리자만 프로젝트 생성/관리자 배정/관리자 추가 같은 조직 구조 조작이 가능. */
export type AdminLevel = 'general' | 'super';

/**
 * 관리자는 스트리머처럼 여러 회사에 동시에 소속될 수 있다.
 * 등급(일반/슈퍼)은 관리자 개인의 속성이 아니라 회사별로 달라질 수 있어 AdminCompanyMembership에 둔다
 * (예: 회사 A에서는 슈퍼 관리자지만 회사 B에서는 일반 관리자로 참여).
 */
export type Admin = {
  id: string;
  name: string;
  loginId: string;
  password: string;
  /** 이 관리자가 특정 스트리머와 동일인(겸직)일 때 그 스트리머의 id를 가리킨다. */
  streamerId?: string;
};

/** 관리자 ↔ 회사 다대다 + 그 회사에서의 등급. 회사당 슈퍼 관리자는 정확히 1명이어야 한다. */
export type AdminCompanyMembership = {
  adminId: string;
  companyId: string;
  level: AdminLevel;
};

/** 기준일: 2026-09-15. connectedAt은 이 날짜 이전 범위(2025-11 ~ 2026-08)에 분산 배정. */
export const initialStreamers: Streamer[] = [
  {
    id: '1',
    name: '스트리머 A',
    loginId: 'streamer_a',
    platformAccounts: [
      { platform: 'soop', handle: 'moonlight_streamer' },
      { platform: 'chzzk', handle: 'moonlight_chzzk' }
    ],
    connectedAt: '2025-11-02'
  },
  {
    id: '2',
    name: '스트리머 B',
    loginId: 'streamer_b',
    platformAccounts: [{ platform: 'chzzk', handle: 'night_owl_b' }],
    connectedAt: '2025-11-10'
  },
  {
    id: '3',
    name: '스트리머 C',
    loginId: 'streamer_c',
    platformAccounts: [{ platform: 'youtube', handle: '@streamer_c_official' }],
    connectedAt: '2025-12-01'
  },
  {
    id: '4',
    name: '스트리머 D',
    loginId: 'streamer_d',
    platformAccounts: [{ platform: 'soop', handle: 'daybreak_d' }],
    connectedAt: '2025-12-18'
  },
  {
    id: '5',
    name: '스트리머 E',
    loginId: 'streamer_e',
    platformAccounts: [{ platform: 'chzzk', handle: 'firefly_e' }],
    connectedAt: '2026-02-05'
  },
  {
    id: '6',
    name: '스트리머 F',
    loginId: 'streamer_f',
    platformAccounts: [{ platform: 'youtube', handle: '@streamer_f_live' }],
    connectedAt: '2026-03-22'
  },
  {
    id: '7',
    name: '스트리머 G',
    loginId: 'streamer_g',
    platformAccounts: [{ platform: 'soop', handle: 'nova_g_stream' }],
    connectedAt: '2026-07-14'
  },
  {
    id: '8',
    name: '스트리머 H',
    loginId: 'streamer_h',
    platformAccounts: [{ platform: 'chzzk', handle: 'crescent_h' }],
    connectedAt: '2026-08-30'
  }
];

export const initialCompanies: Company[] = [
  { id: 'co1', name: '회사 A', managerName: '김민준' },
  { id: 'co2', name: '회사 B', managerName: '이서연' }
];

export const initialProjects: Project[] = [
  { id: 'p1', name: '9월 정규 방송', companyId: 'co1', managerName: '박지훈' },
  { id: 'p2', name: '여름 콜라보 기획', companyId: 'co1', managerName: '최유진' },
  { id: 'p3', name: '게임 크루 프로젝트', companyId: 'co2', managerName: '정하윤' },
  { id: 'p4', name: '가을 이벤트 방송', companyId: 'co2', managerName: '한소영' },
  // 이제 막 시작한 신규 프로젝트 — 담당 관리자 미배정 상태를 데모로 보여준다.
  { id: 'p5', name: '연말 이벤트 기획', companyId: 'co1', managerName: '' },
  { id: 'p6', name: '신인 발굴 프로젝트', companyId: 'co2', managerName: '' }
];

/**
 * 데모 계정(스트리머 A, id "1")은 여러 회사의 여러 프로젝트에 동시 참여 중이라고 가정:
 * 회사 A - 9월 정규 방송 / 여름 콜라보 기획, 회사 B - 게임 크루 프로젝트 / 가을 이벤트 방송.
 * 스트리머 G/H는 신규 프로젝트(p5/p6)에 막 합류해 아직 활동 이력이 없는 상태를 나타낸다.
 */
export const initialMemberships: Membership[] = [
  { streamerId: '1', projectId: 'p1' },
  { streamerId: '1', projectId: 'p2' },
  { streamerId: '1', projectId: 'p3' },
  { streamerId: '1', projectId: 'p4' },
  { streamerId: '2', projectId: 'p1' },
  { streamerId: '3', projectId: 'p2' },
  { streamerId: '3', projectId: 'p3' },
  { streamerId: '4', projectId: 'p4' },
  { streamerId: '5', projectId: 'p2' },
  { streamerId: '6', projectId: 'p4' },
  { streamerId: '7', projectId: 'p5' },
  { streamerId: '8', projectId: 'p6' }
];

export const initialProjectInvites: ProjectInvite[] = [];

export const initialAdmins: Admin[] = [
  { id: 'a1', name: '김민준', loginId: 'coa_super', password: 'coa1234!' },
  { id: 'a2', name: '이서연', loginId: 'cob_seoyeon', password: 'cob1234!' },
  { id: 'a3', name: '박서준', loginId: 'coa_seojun', password: 'coa1234!' },
  { id: 'a4', name: '정하윤', loginId: 'cob_super', password: 'cob1234!' },
  { id: 'a5', name: '오하늘', loginId: 'coa_ohaneul', password: 'coa1234!' },
  { id: 'a6', name: '노을', loginId: 'cob_noeul', password: 'cob1234!' },
  // 스트리머는 관리자를 겸직할 수 있다 — 스트리머 A(streamerId "1")가 회사 A의 일반 관리자도 겸임하는 데모.
  { id: 'a7', name: '스트리머 A', loginId: 'streamer_a_admin', password: 'coa1234!', streamerId: '1' }
];

/**
 * a1(김민준)은 회사 A에서는 슈퍼 관리자, 회사 B에서는 일반 관리자로 두 회사에 동시에 참여한다 —
 * 관리자도 스트리머처럼 여러 회사에 걸칠 수 있고 등급은 회사마다 다를 수 있음을 보여주는 데모.
 * 회사당 슈퍼 관리자는 정확히 1명(co1: a1, co2: a4)으로 유지된다.
 */
export const initialAdminCompanyMemberships: AdminCompanyMembership[] = [
  { adminId: 'a1', companyId: 'co1', level: 'super' },
  { adminId: 'a1', companyId: 'co2', level: 'general' },
  { adminId: 'a2', companyId: 'co2', level: 'general' },
  { adminId: 'a3', companyId: 'co1', level: 'general' },
  { adminId: 'a4', companyId: 'co2', level: 'super' },
  { adminId: 'a5', companyId: 'co1', level: 'general' },
  { adminId: 'a6', companyId: 'co2', level: 'general' },
  { adminId: 'a7', companyId: 'co1', level: 'general' }
];

/**
 * 관리자 한 명이 같은 회사 안에서 여러 프로젝트에 참여할 수 있음 (스트리머-프로젝트와 같은 다대다 구조).
 * 단, 슈퍼 관리자는 회사 전체를 총괄하므로 개별 프로젝트 참여 대상이 아니다 (일반 관리자만 해당).
 */
export type AdminMembership = {
  adminId: string;
  projectId: string;
};

export const initialAdminMemberships: AdminMembership[] = [
  { adminId: 'a3', projectId: 'p1' },
  { adminId: 'a3', projectId: 'p2' },
  { adminId: 'a2', projectId: 'p4' },
  { adminId: 'a5', projectId: 'p5' },
  { adminId: 'a6', projectId: 'p6' },
  // 스트리머A(a7)는 본인이 직접 출연하지 않는 연말 이벤트 기획의 공동 담당 관리자로도 참여한다.
  { adminId: 'a7', projectId: 'p5' },
  // a1은 회사 B에서는 일반 관리자라 회사 전체가 아니라 연결된 프로젝트만 봐야 한다.
  { adminId: 'a1', projectId: 'p3' }
];

/** 테스트용 권한 전환에서 "스트리머" 선택 시 사용하는 고정 데모 계정 */
export const CURRENT_STREAMER_ID = '1';

/** 테스트용 권한 전환("매니지먼트사" 선택 시)에 사용하는 고정 데모 관리자 계정 — 여러 회사에 걸쳐 있을 수 있다. */
export const CURRENT_ADMIN_ID = 'a1';

/** 이 관리자가 소속된 회사 전체 (여러 회사에 동시 소속 가능) */
export function companiesForAdmin(
  adminId: string,
  companies: Company[],
  adminCompanyMemberships: AdminCompanyMembership[]
): Company[] {
  const companyIds = new Set(adminCompanyMemberships.filter((m) => m.adminId === adminId).map((m) => m.companyId));
  return companies.filter((c) => companyIds.has(c.id));
}

/** 특정 회사 안에서 이 관리자의 등급 — 그 회사에 소속되어 있지 않으면 undefined */
export function levelForAdminInCompany(
  adminId: string,
  companyId: string,
  adminCompanyMemberships: AdminCompanyMembership[]
): AdminLevel | undefined {
  return adminCompanyMemberships.find((m) => m.adminId === adminId && m.companyId === companyId)?.level;
}

/** 회사에 소속된 관리자들 + 그 회사에서의 등급 */
export function adminsInCompany(
  companyId: string,
  admins: Admin[],
  adminCompanyMemberships: AdminCompanyMembership[]
): (Admin & { level: AdminLevel })[] {
  return adminCompanyMemberships
    .filter((m) => m.companyId === companyId)
    .map((m) => {
      const admin = admins.find((a) => a.id === m.adminId);
      return admin ? { ...admin, level: m.level } : null;
    })
    .filter((a): a is Admin & { level: AdminLevel } => a !== null);
}

/** 프로젝트에 연결된(참여 중인) 관리자들 — 어떤 관리자를 연결할지는 UI에서 이미 일반 관리자로 걸러서 고르므로 여기선 순수 조회만 한다. */
export function adminsForProject(projectId: string, admins: Admin[], adminMemberships: AdminMembership[]): Admin[] {
  const adminIds = new Set(adminMemberships.filter((m) => m.projectId === projectId).map((m) => m.adminId));
  return admins.filter((a) => adminIds.has(a.id));
}

export function projectsForStreamer(streamerId: string, projects: Project[], memberships: Membership[]): Project[] {
  const projectIds = new Set(memberships.filter((m) => m.streamerId === streamerId).map((m) => m.projectId));
  return projects.filter((p) => projectIds.has(p.id));
}

export function projectsForStreamerInCompany(
  streamerId: string,
  companyId: string,
  projects: Project[],
  memberships: Membership[]
): Project[] {
  return projectsForStreamer(streamerId, projects, memberships).filter((p) => p.companyId === companyId);
}

export function isProjectInviteExpired(invite: ProjectInvite): boolean {
  return invite.status === 'expired' || new Date(invite.expiresAt).getTime() <= Date.now();
}

/** 특정 스트리머로 한정하지 않는 버전 — 매니지먼트사가 회사 전체 프로젝트를 볼 때 사용 */
export function projectsInCompany(companyId: string, projects: Project[]): Project[] {
  return projects.filter((p) => p.companyId === companyId);
}

/** 일반 관리자가 실제로 연결된(참여 중인) 프로젝트만 — 슈퍼 관리자는 회사 전체를 보므로 이 함수를 쓰지 않는다. */
export function projectsForAdmin(adminId: string, projects: Project[], adminMemberships: AdminMembership[]): Project[] {
  const projectIds = new Set(adminMemberships.filter((m) => m.adminId === adminId).map((m) => m.projectId));
  return projects.filter((p) => projectIds.has(p.id));
}

export function companiesForStreamer(
  streamerId: string,
  companies: Company[],
  projects: Project[],
  memberships: Membership[]
): Company[] {
  const myProjects = projectsForStreamer(streamerId, projects, memberships);
  const companyIds = new Set(myProjects.map((p) => p.companyId));
  return companies.filter((c) => companyIds.has(c.id));
}

export function streamersInProject(projectId: string, streamers: Streamer[], memberships: Membership[]): Streamer[] {
  const streamerIds = new Set(memberships.filter((m) => m.projectId === projectId).map((m) => m.streamerId));
  return streamers.filter((s) => streamerIds.has(s.id));
}

/** 채팅 등에서 "매니지먼트사"를 하나의 참여자로 다루기 위한 고정 id/이름 */
export const MGMT_ID = 'mgmt';
export const MGMT_NAME = '매니지먼트사';

export type ChatParticipant = {
  id: string;
  name: string;
};

/** 프로젝트 참여자 전체 = 매니지먼트사 + 그 프로젝트에 참여 중인 관리자들 + 그 프로젝트에 속한 스트리머들 */
export function participantsForProject(
  projectId: string,
  streamers: Streamer[],
  memberships: Membership[],
  admins: Admin[],
  adminMemberships: AdminMembership[]
): ChatParticipant[] {
  return [
    { id: MGMT_ID, name: MGMT_NAME },
    ...adminsForProject(projectId, admins, adminMemberships).map((a) => ({ id: a.id, name: a.name })),
    ...streamersInProject(projectId, streamers, memberships).map((s) => ({ id: s.id, name: s.name }))
  ];
}

const STREAMER_PALETTE = [
  { gradient: 'from-violet-500 to-purple-700', color: 'bg-violet-600' },
  { gradient: 'from-blue-500 to-indigo-700', color: 'bg-blue-600' },
  { gradient: 'from-teal-500 to-emerald-700', color: 'bg-teal-600' },
  { gradient: 'from-slate-500 to-slate-700', color: 'bg-slate-600' },
  { gradient: 'from-orange-500 to-amber-700', color: 'bg-orange-600' },
  { gradient: 'from-yellow-500 to-amber-600', color: 'bg-yellow-600' }
];

/** 스트리머 id를 기준으로 일정/채팅 등에서 쓸 색상을 결정론적으로 배정 */
export function colorForStreamer(streamerId: string) {
  let hash = 0;
  for (const ch of streamerId) hash = (hash * 31 + ch.charCodeAt(0)) % STREAMER_PALETTE.length;
  return STREAMER_PALETTE[hash];
}
