'use client';

import { type ReactNode, createContext, useCallback, useContext, useMemo, useState } from 'react';

import {
  type Admin,
  type AdminCompanyMembership,
  type AdminMembership,
  type Company,
  type Membership,
  type Platform,
  type Project,
  type ProjectInvite,
  type Streamer,
  initialAdminCompanyMemberships,
  initialAdminMemberships,
  initialAdmins,
  initialCompanies,
  initialMemberships,
  initialProjectInvites,
  initialProjects,
  initialStreamers
} from './orgData';

type OrgContextValue = {
  streamers: Streamer[];
  companies: Company[];
  projects: Project[];
  memberships: Membership[];
  projectInvites: ProjectInvite[];
  admins: Admin[];
  adminMemberships: AdminMembership[];
  adminCompanyMemberships: AdminCompanyMembership[];
  updateStreamer: (id: string, name: string) => void;
  removeStreamer: (id: string) => void;
  addCompany: (name: string, managerName: string) => void;
  removeCompany: (id: string) => void;
  addProject: (companyId: string, name: string, managerName: string) => Project;
  removeProject: (id: string) => void;
  setStreamerProjects: (streamerId: string, projectIds: string[]) => void;
  /** 슈퍼 관리자가 자기 회사에 일반 관리자를 새로 만든다 (super는 이 흐름으로 만들지 않음 — 회사당 1명 고정). */
  addAdmin: (companyId: string, name: string, loginId: string, password: string) => void;
  /** 슈퍼 관리자가 일반 관리자를 프로젝트에 연결/해제한다. */
  setAdminProjects: (adminId: string, projectIds: string[]) => void;
  /** 슈퍼 관리자가 프로젝트 기준으로 참여 관리자 목록을 수정한다 (위 setAdminProjects의 반대 방향). */
  setProjectAdmins: (projectId: string, adminIds: string[]) => void;
  inviteStreamers: (projectId: string, streamerIds: string[], phoneNumbers: string[]) => void;
  removeStreamerFromProject: (streamerId: string, projectId: string) => void;
  acceptProjectInvite: (inviteId: string) => void;
};

const OrgContext = createContext<OrgContextValue | null>(null);

export function OrgProvider({ children }: { children: ReactNode }) {
  const [streamers, setStreamers] = useState<Streamer[]>(initialStreamers);
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [memberships, setMemberships] = useState<Membership[]>(initialMemberships);
  const [projectInvites, setProjectInvites] = useState<ProjectInvite[]>(initialProjectInvites);
  const [admins, setAdmins] = useState<Admin[]>(initialAdmins);
  const [adminMemberships, setAdminMemberships] = useState<AdminMembership[]>(initialAdminMemberships);
  const [adminCompanyMemberships, setAdminCompanyMemberships] =
    useState<AdminCompanyMembership[]>(initialAdminCompanyMemberships);

  const updateStreamer = useCallback((id: string, name: string) => {
    setStreamers((prev) => prev.map((streamer) => (streamer.id === id ? { ...streamer, name } : streamer)));
  }, []);

  const removeStreamer = useCallback((id: string) => {
    setStreamers((prev) => prev.filter((s) => s.id !== id));
    setMemberships((prev) => prev.filter((m) => m.streamerId !== id));
    setProjectInvites((prev) => prev.filter((invite) => invite.streamerId !== id));
  }, []);

  const addCompany = useCallback((name: string, managerName: string) => {
    setCompanies((prev) => [...prev, { id: crypto.randomUUID(), name, managerName }]);
  }, []);

  const removeCompany = useCallback((id: string) => {
    setProjects((prevProjects) => {
      const removedProjectIds = new Set(prevProjects.filter((p) => p.companyId === id).map((p) => p.id));
      setMemberships((prevM) => prevM.filter((m) => !removedProjectIds.has(m.projectId)));
      setAdminMemberships((prevM) => prevM.filter((m) => !removedProjectIds.has(m.projectId)));
      setProjectInvites((prev) => prev.filter((invite) => !removedProjectIds.has(invite.projectId)));
      return prevProjects.filter((p) => p.companyId !== id);
    });
    setAdminCompanyMemberships((prev) => prev.filter((m) => m.companyId !== id));
    setCompanies((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const addProject = useCallback((companyId: string, name: string, managerName: string) => {
    const project: Project = {
      id: crypto.randomUUID(),
      companyId,
      name,
      managerName
    };

    setProjects((prev) => [...prev, project]);

    return project;
  }, []);

  const removeProject = useCallback((id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setMemberships((prev) => prev.filter((m) => m.projectId !== id));
    setAdminMemberships((prev) => prev.filter((m) => m.projectId !== id));
    setProjectInvites((prev) => prev.filter((invite) => invite.projectId !== id));
  }, []);

  const setStreamerProjects = useCallback((streamerId: string, projectIds: string[]) => {
    setMemberships((prev) => [
      ...prev.filter((m) => m.streamerId !== streamerId),
      ...projectIds.map((projectId) => ({ streamerId, projectId }))
    ]);
  }, []);

  const inviteStreamers = useCallback((projectId: string, streamerIds: string[], phoneNumbers: string[]) => {
    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setDate(expiresAt.getDate() + 7);

    setProjectInvites((prev) => {
      const pendingInvites = prev.filter((invite) => invite.projectId === projectId && invite.status === 'pending');

      const pendingStreamerIds = new Set(
        pendingInvites.map((invite) => invite.streamerId).filter((id): id is string => Boolean(id))
      );

      const pendingPhoneNumbers = new Set(
        pendingInvites.map((invite) => invite.phoneNumber).filter((phone): phone is string => Boolean(phone))
      );

      const createInvite = (target: Pick<ProjectInvite, 'streamerId' | 'phoneNumber'>): ProjectInvite => ({
        id: crypto.randomUUID(),
        projectId,
        inviteCode: crypto.randomUUID(),
        status: 'pending',
        ...target,
        createdAt: now.toISOString(),
        expiresAt: expiresAt.toISOString()
      });

      const newInvites = [
        ...streamerIds
          .filter((streamerId) => !pendingStreamerIds.has(streamerId))
          .map((streamerId) => createInvite({ streamerId })),
        ...phoneNumbers
          .filter((phoneNumber) => !pendingPhoneNumbers.has(phoneNumber))
          .map((phoneNumber) => createInvite({ phoneNumber }))
      ];
      newInvites.forEach((invite) => {
        console.log(`초대 링크: /invites/${invite.inviteCode}`);
      });

      return [...prev, ...newInvites];
    });
  }, []);

  const removeStreamerFromProject = useCallback((streamerId: string, projectId: string) => {
    setMemberships((prev) =>
      prev.filter((membership) => !(membership.streamerId === streamerId && membership.projectId === projectId))
    );
  }, []);

  const acceptProjectInvite = useCallback((inviteId: string) => {
    setProjectInvites((prevInvites) => {
      const invite = prevInvites.find((item) => item.id === inviteId);

      if (
        !invite ||
        invite.status !== 'pending' ||
        !invite.streamerId ||
        new Date(invite.expiresAt).getTime() <= Date.now()
      ) {
        return prevInvites;
      }

      const streamerId = invite.streamerId;

      setMemberships((prevMemberships) => {
        const alreadyJoined = prevMemberships.some(
          (membership) => membership.projectId === invite.projectId && membership.streamerId === streamerId
        );

        if (alreadyJoined) return prevMemberships;

        return [
          ...prevMemberships,
          {
            projectId: invite.projectId,
            streamerId
          }
        ];
      });

      return prevInvites.map((item) =>
        item.id === inviteId
          ? {
              ...item,
              status: 'accepted' as const
            }
          : item
      );
    });
  }, []);

  const addAdmin = useCallback((companyId: string, name: string, loginId: string, password: string) => {
    const adminId = crypto.randomUUID();
    setAdmins((prev) => [...prev, { id: adminId, name, loginId, password }]);
    setAdminCompanyMemberships((prev) => [...prev, { adminId, companyId, level: 'general' }]);
  }, []);

  const setAdminProjects = useCallback((adminId: string, projectIds: string[]) => {
    setAdminMemberships((prev) => [
      ...prev.filter((m) => m.adminId !== adminId),
      ...projectIds.map((projectId) => ({ adminId, projectId }))
    ]);
  }, []);

  const setProjectAdmins = useCallback((projectId: string, adminIds: string[]) => {
    setAdminMemberships((prev) => [
      ...prev.filter((m) => m.projectId !== projectId),
      ...adminIds.map((adminId) => ({ adminId, projectId }))
    ]);
  }, []);

  const value = useMemo(
    () => ({
      streamers,
      companies,
      projects,
      memberships,
      admins,
      adminMemberships,
      adminCompanyMemberships,
      projectInvites,
      updateStreamer,
      removeStreamer,
      addCompany,
      removeCompany,
      addProject,
      removeProject,
      setStreamerProjects,
      addAdmin,
      setAdminProjects,
      setProjectAdmins,
      inviteStreamers,
      removeStreamerFromProject,
      acceptProjectInvite
    }),
    [
      streamers,
      companies,
      projects,
      memberships,
      admins,
      adminMemberships,
      adminCompanyMemberships,
      projectInvites,
      inviteStreamers,
      updateStreamer,
      removeStreamer,
      addCompany,
      removeCompany,
      addProject,
      removeProject,
      setStreamerProjects,
      addAdmin,
      setAdminProjects,
      setProjectAdmins,
      removeStreamerFromProject,
      acceptProjectInvite
    ]
  );

  return <OrgContext.Provider value={value}>{children}</OrgContext.Provider>;
}

export function useOrg() {
  const ctx = useContext(OrgContext);
  if (!ctx) throw new Error('useOrg must be used within an OrgProvider');
  return ctx;
}
