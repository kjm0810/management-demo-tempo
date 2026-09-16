"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type ScopeContextValue = {
  companyId: string;
  projectId: string;
  /** localStorage에서 이전 선택값을 읽어오는 작업이 끝났는지 여부 */
  hydrated: boolean;
  setCompanyId: (id: string) => void;
  setProjectId: (id: string) => void;
};

const STORAGE_KEY = "test-scope";

const ScopeContext = createContext<ScopeContextValue | null>(null);

export function ScopeProvider({ children }: { children: ReactNode }) {
  const [companyId, setCompanyIdState] = useState("");
  const [projectId, setProjectIdState] = useState("");
  const [hydrated, setHydrated] = useState(false);

  // 이 effect는 부모(ScopeProvider)에 속하므로, 자식 컴포넌트(CompanyRail/ProjectTabs)의 "기본값 채우기" effect보다
  // 나중에 실행된다. hydrated 플래그로 그 effect가 이 값을 먼저 덮어쓰지 못하게 막는다.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (typeof parsed.companyId === "string") setCompanyIdState(parsed.companyId);
        if (typeof parsed.projectId === "string") setProjectIdState(parsed.projectId);
      }
    } catch {
      // 무시: 저장된 값이 없거나 손상된 경우 기본값(빈 문자열)을 그대로 사용
    }
    setHydrated(true);
  }, []);

  const setCompanyId = useCallback((id: string) => {
    setCompanyIdState(id);
    setProjectIdState("");
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ companyId: id, projectId: "" }));
    } catch {
      // 저장 실패는 무시 (개인정보 보호 모드 등)
    }
  }, []);

  const setProjectId = useCallback(
    (id: string) => {
      setProjectIdState(id);
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ companyId, projectId: id }));
      } catch {
        // 저장 실패는 무시
      }
    },
    [companyId]
  );

  const value = useMemo(
    () => ({ companyId, projectId, hydrated, setCompanyId, setProjectId }),
    [companyId, projectId, hydrated, setCompanyId, setProjectId]
  );

  return <ScopeContext.Provider value={value}>{children}</ScopeContext.Provider>;
}

export function useScope() {
  const ctx = useContext(ScopeContext);
  if (!ctx) throw new Error("useScope must be used within a ScopeProvider");
  return ctx;
}
