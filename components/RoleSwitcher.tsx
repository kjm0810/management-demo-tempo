"use client";

import { useRole, type Role } from "./RoleContext";
import { useAdminLevel } from "./useAdminLevel";

const options: { role: Role; label: string }[] = [
  { role: "management", label: "매니지먼트사" },
  { role: "streamer", label: "스트리머" },
];

const adminLevelLabel = { general: "일반 관리자", super: "슈퍼 관리자" };

export default function RoleSwitcher() {
  const { role, setRole } = useRole();
  const adminLevel = useAdminLevel();

  let currentLabel = "스트리머";
  if (role === "management") currentLabel = `매니지먼트사 · ${adminLevelLabel[adminLevel]}`;

  return (
    <div className="flex h-12 w-full shrink-0 items-center gap-3 border-b border-white/5 bg-[#0b0e1a] px-4">
      <span className="text-xs text-slate-500">테스트용 권한 전환</span>
      <div className="flex gap-1 rounded-lg bg-black/30 p-1">
        {options.map((o) => (
          <button
            key={o.role}
            onClick={() => setRole(o.role)}
            className={
              o.role === role
                ? "rounded-md bg-violet-600 px-3 py-1 text-xs font-medium text-white"
                : "rounded-md px-3 py-1 text-xs font-medium text-slate-400 hover:text-slate-200"
            }
          >
            {o.label}
          </button>
        ))}
      </div>
      <span className="text-xs text-slate-500">
        현재 보기: <span className="text-slate-300">{currentLabel}</span>
      </span>
      {role === "management" && (
        <span className="text-[11px] text-slate-600">
          (관리자 등급은 왼쪽 회사 아이콘에서 어느 회사를 보고 있는지에 따라 자동으로 바뀝니다)
        </span>
      )}
    </div>
  );
}
