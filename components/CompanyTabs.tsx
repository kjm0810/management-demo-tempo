"use client";

import { useEffect } from "react";
import { useRole } from "./RoleContext";
import { useOrg } from "./OrgContext";
import { useScope } from "./ScopeContext";
import { CURRENT_STREAMER_ID, CURRENT_ADMIN_ID, companiesForAdmin, companiesForStreamer } from "./orgData";

const PALETTE = ["bg-violet-600", "bg-blue-600", "bg-teal-600", "bg-orange-600", "bg-pink-600", "bg-amber-600"];

function colorForCompany(id: string) {
  let hash = 0;
  for (const ch of id) hash = (hash * 31 + ch.charCodeAt(0)) % PALETTE.length;
  return PALETTE[hash];
}

/**
 * 헤더 맨 위, 프로젝트 탭보다 위에 가로로 놓이는 회사 선택 — 슈퍼/일반 관리자·스트리머 공통 UI.
 * 관리자도 스트리머처럼 여러 회사에 동시에 소속될 수 있어 탭이 여러 개 뜰 수 있다.
 * (그 회사에서 슈퍼인지 일반인지는 여기서 다루지 않는다 — useAdminLevel이 선택된 회사 기준으로 따로 계산)
 */
export default function CompanyTabs() {
  const { role } = useRole();
  const { companies, projects, memberships, adminCompanyMemberships } = useOrg();
  const { companyId, hydrated, setCompanyId } = useScope();

  const isManagement = role === "management";

  const availableCompanies = isManagement
    ? companiesForAdmin(CURRENT_ADMIN_ID, companies, adminCompanyMemberships)
    : companiesForStreamer(CURRENT_STREAMER_ID, companies, projects, memberships);

  // "전체"는 없음 — 항상 회사가 하나 선택되어 있어야 하며 선택값은 기억됨(localStorage).
  // 현재 선택이 더 이상 유효하지 않으면(역할 전환 등) 목록의 첫 번째 항목으로 다시 맞춘다.
  useEffect(() => {
    if (!hydrated) return;
    const validCompanyIds = new Set(availableCompanies.map((c) => c.id));
    if (!companyId || !validCompanyIds.has(companyId)) {
      if (availableCompanies.length > 0) setCompanyId(availableCompanies[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, isManagement, companyId, companies, projects, memberships, adminCompanyMemberships]);

  if (availableCompanies.length === 0) return null;

  return (
    <div className="flex min-h-14 w-full shrink-0 items-center gap-3 overflow-x-auto border-b border-white/5 bg-[#0b0e1a] px-4 py-2">
      <div className="flex items-center gap-2">
        {availableCompanies.map((c) => {
          const active = c.id === companyId;
          return (
            <button
              key={c.id}
              onClick={() => setCompanyId(c.id)}
              title={c.name}
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-semibold text-white transition-opacity ${colorForCompany(
                c.id
              )} ${
                active
                  ? "opacity-100 ring-2 ring-white/50 ring-offset-2 ring-offset-[#0b0e1a]"
                  : "opacity-45 hover:opacity-80"
              }`}
            >
              {c.name.slice(-1)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
