"use client";

import { useEffect } from "react";
import { useRole } from "./RoleContext";
import { useOrg } from "./OrgContext";
import { useScope } from "./ScopeContext";
import { useAdminLevel } from "./useAdminLevel";
import {
  CURRENT_STREAMER_ID,
  CURRENT_ADMIN_ID,
  projectsForAdmin,
  projectsForStreamerInCompany,
  projectsInCompany,
} from "./orgData";

/**
 * 헤더에 현재 회사(왼쪽 CompanyRail에서 선택됨)의 프로젝트를 탭/칩으로 노출 — 슈퍼/일반 관리자·스트리머 공통 UI.
 * 슈퍼 관리자는 회사 전체 프로젝트, 일반 관리자는 본인이 연결된 프로젝트만 볼 수 있다.
 * (등급은 회사마다 다를 수 있어 useAdminLevel이 "지금 선택된 회사"를 기준으로 계산한다)
 */
export default function ProjectTabs() {
  const { role } = useRole();
  const adminLevel = useAdminLevel();
  const { projects, memberships, adminMemberships } = useOrg();
  const { companyId, projectId, hydrated, setProjectId } = useScope();

  const isManagement = role === "management";

  const managementProjects =
    adminLevel === "super"
      ? projectsInCompany(companyId, projects)
      : projectsForAdmin(CURRENT_ADMIN_ID, projects, adminMemberships);

  const availableProjects = companyId
    ? isManagement
      ? managementProjects
      : projectsForStreamerInCompany(CURRENT_STREAMER_ID, companyId, projects, memberships)
    : [];

  // "전체"는 없음 — 항상 프로젝트가 하나 선택되어 있어야 하며 선택값은 기억됨(localStorage).
  // 회사가 바뀌거나(CompanyRail) 등급이 바뀌어 현재 선택이 더 이상 유효하지 않으면 첫 번째 항목으로 맞춘다.
  useEffect(() => {
    if (!hydrated || !companyId) return;
    const validProjectIds = new Set(availableProjects.map((p) => p.id));
    if (!projectId || !validProjectIds.has(projectId)) {
      if (availableProjects.length > 0) setProjectId(availableProjects[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, companyId, projectId, isManagement, adminLevel, projects, memberships, adminMemberships]);

  if (availableProjects.length === 0) return null;

  return (
    <div className="flex min-h-11 w-full shrink-0 items-center gap-3 overflow-x-auto border-b border-white/5 bg-[#0b0e1a] px-4 py-2">
      <div className="flex items-center gap-1.5">
        {availableProjects.map((p) => {
          const active = p.id === projectId;
          return (
            <button
              key={p.id}
              onClick={() => setProjectId(p.id)}
              className={
                active
                  ? "shrink-0 rounded-md bg-violet-600 px-3 py-1.5 text-xs font-medium text-white"
                  : "shrink-0 rounded-md px-3 py-1.5 text-xs font-medium text-slate-400 hover:bg-white/5 hover:text-slate-200"
              }
            >
              {p.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
