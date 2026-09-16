"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type ReportTab = "revenue" | "daily" | "broadcast";

const TABS: { id: ReportTab; label: string }[] = [
  { id: "revenue", label: "수익 리포트" },
  { id: "daily", label: "일별 리포트" },
  { id: "broadcast", label: "방송 통계" },
];

type ReportTabsProps = {
  active: ReportTab;
  onChange: (tab: ReportTab) => void;
};

export default function ReportTabs({ active, onChange }: ReportTabsProps) {
  return (
    <Tabs value={active} onValueChange={(v) => v && onChange(v as ReportTab)}>
      <TabsList>
        {TABS.map((t) => (
          <TabsTrigger
            key={t.id}
            value={t.id}
            className="data-active:bg-violet-600 data-active:text-white dark:data-active:bg-violet-600 dark:data-active:text-white"
          >
            {t.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
