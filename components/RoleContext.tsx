"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { AdminLevel } from "./orgData";

export type Role = "management" | "streamer";
export type { AdminLevel };

type RoleContextValue = {
  role: Role;
  setRole: (role: Role) => void;
};

const STORAGE_KEY = "test-role-v3";

const RoleContext = createContext<RoleContextValue | null>(null);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>("management");

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed.role === "management" || parsed.role === "streamer") setRoleState(parsed.role);
    } catch {
      // 무시: 저장된 값이 없거나 손상된 경우 기본값을 그대로 사용
    }
  }, []);

  const setRole = useCallback((next: Role) => {
    setRoleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ role: next }));
    } catch {
      // 저장 실패는 무시
    }
  }, []);

  const value = useMemo(() => ({ role, setRole }), [role, setRole]);

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used within a RoleProvider");
  return ctx;
}
