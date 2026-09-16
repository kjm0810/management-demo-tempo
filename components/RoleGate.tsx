"use client";

import type { ReactNode } from "react";
import { useRole, type AdminLevel, type Role } from "./RoleContext";
import { useAdminLevel } from "./useAdminLevel";
import Card from "./Card";

type RoleGateProps = {
  allow: Role[];
  /** true면 role이 management여도 슈퍼 관리자가 아니면 막는다. */
  superAdminOnly?: boolean;
  children: ReactNode;
};

const roleLabel: Record<Role, string> = {
  management: "매니지먼트사",
  streamer: "스트리머",
};

const adminLevelLabel: Record<AdminLevel, string> = {
  general: "일반 관리자",
  super: "슈퍼 관리자",
};

export default function RoleGate({ allow, superAdminOnly = false, children }: RoleGateProps) {
  const { role } = useRole();
  const adminLevel = useAdminLevel();

  const allowed = allow.includes(role) && (!superAdminOnly || adminLevel === "super");

  if (!allowed) {
    return (
      <main className="flex flex-1 flex-col gap-5 overflow-y-auto p-6">
        <Card>
          <h1 className="text-lg font-semibold text-white">접근 권한이 없습니다</h1>
          <p className="text-sm text-slate-400">
            이 화면은 {allow.map((r) => roleLabel[r]).join(", ")}
            {superAdminOnly ? "(슈퍼 관리자)" : ""} 권한에서만 볼 수 있습니다. 현재 보기: {roleLabel[role]}
            {role === "management" ? ` · ${adminLevelLabel[adminLevel]}` : ""}
          </p>
        </Card>
      </main>
    );
  }

  return <>{children}</>;
}
