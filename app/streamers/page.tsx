'use client';

import { useMemo } from 'react';

import Card from '@/components/Card';
import { useOrg } from '@/components/OrgContext';
import RoleGate from '@/components/RoleGate';
import { useScope } from '@/components/ScopeContext';
import { CURRENT_ADMIN_ID, type Project } from '@/components/orgData';
import { useAdminLevel } from '@/components/useAdminLevel';

import ConnectedStreamerList from './_components/ConnectedStreamerList';

export default function StreamersPage() {
  const { streamers, projects, memberships, adminMemberships, removeStreamerFromProject } = useOrg();
  const isSuperAdmin = useAdminLevel() === 'super';
  const { companyId } = useScope();
  const companyProjectIds = useMemo(() => {
    return new Set(projects.filter((project) => project.companyId === companyId).map((project) => project.id));
  }, [projects, companyId]);

  const accessibleProjectIds = useMemo(() => {
    if (isSuperAdmin) {
      return companyProjectIds;
    }

    return new Set(
      adminMemberships
        .filter((membership) => membership.adminId === CURRENT_ADMIN_ID && companyProjectIds.has(membership.projectId))
        .map((membership) => membership.projectId)
    );
  }, [adminMemberships, companyProjectIds, isSuperAdmin]);

  const visibleStreamerIds = useMemo(() => {
    return new Set(
      memberships
        .filter((membership) => accessibleProjectIds.has(membership.projectId))
        .map((membership) => membership.streamerId)
    );
  }, [memberships, accessibleProjectIds]);

  const visibleStreamers = useMemo(() => {
    return streamers.filter((streamer) => visibleStreamerIds.has(streamer.id));
  }, [streamers, visibleStreamerIds]);

  const projectsByStreamer = useMemo(() => {
    const map: Record<string, Project[]> = {};

    for (const streamer of visibleStreamers) {
      map[streamer.id] = memberships
        .filter((membership) => membership.streamerId === streamer.id && accessibleProjectIds.has(membership.projectId))
        .map((membership) => projects.find((project) => project.id === membership.projectId))
        .filter((project): project is Project => Boolean(project));
    }

    return map;
  }, [visibleStreamers, memberships, projects, accessibleProjectIds]);

  return (
    <RoleGate allow={['management']}>
      <main className='flex flex-1 flex-col gap-5 overflow-y-auto p-6'>
        <Card>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-lg font-semibold text-white'>업체/스트리머 관리</h1>
              <p className='text-sm text-slate-400'>
                연결된 스트리머 목록입니다. 스트리머 한 명이 여러 회사의 여러 프로젝트에 동시에 참여할 수 있습니다.
              </p>
            </div>
          </div>

          <div className='mt-4'>
            <ConnectedStreamerList
              streamers={visibleStreamers}
              projectsByStreamer={projectsByStreamer}
              showProjects
              onRemoveFromProject={removeStreamerFromProject}
            />
          </div>
        </Card>
      </main>
    </RoleGate>
  );
}
