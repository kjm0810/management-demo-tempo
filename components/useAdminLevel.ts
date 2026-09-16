"use client";

import { useOrg } from "./OrgContext";
import { useRole } from "./RoleContext";
import { useScope } from "./ScopeContext";
import { CURRENT_ADMIN_ID, levelForAdminInCompany, type AdminLevel } from "./orgData";

/**
 * 관리자 등급은 더 이상 전역 상태가 아니라, 지금 헤더에서 선택된 회사에서의 등급이다
 * (한 관리자가 회사 A에서는 슈퍼, 회사 B에서는 일반일 수 있음). 불확실하면 안전하게 "general"로 취급한다.
 */
export function useAdminLevel(): AdminLevel {
  const { role } = useRole();
  const { adminCompanyMemberships } = useOrg();
  const { companyId } = useScope();

  if (role !== "management") return "general";
  return levelForAdminInCompany(CURRENT_ADMIN_ID, companyId, adminCompanyMemberships) ?? "general";
}
