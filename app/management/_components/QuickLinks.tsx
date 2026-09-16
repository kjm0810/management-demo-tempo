"use client";

import Link from "next/link";
import { BarIcon, CalendarIcon, FeedIcon, FolderIcon, MegaphoneIcon, MessageIcon, MonitorIcon } from "@/components/icons";
import { useAdminLevel } from "@/components/useAdminLevel";

const LINKS = [
  { href: "/streamers", label: "업체/스트리머 관리", icon: MonitorIcon, superOnly: false },
  { href: "/projects", label: "프로젝트 관리", icon: FolderIcon, superOnly: true },
  { href: "/calendar", label: "캘린더", icon: CalendarIcon, superOnly: false },
  { href: "/messenger", label: "메신저", icon: MessageIcon, superOnly: false },
  { href: "/feed", label: "피드", icon: FeedIcon, superOnly: false },
  { href: "/notices", label: "공지사항", icon: MegaphoneIcon, superOnly: false },
  { href: "/reports", label: "리포트", icon: BarIcon, superOnly: false },
];

export default function QuickLinks() {
  const adminLevel = useAdminLevel();
  const links = LINKS.filter((l) => !l.superOnly || adminLevel === "super");

  return (
    <>
      <h3 className="text-sm font-semibold text-white">바로가기</h3>
      <div className="flex flex-wrap gap-3">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-xs text-slate-300 transition-colors hover:border-violet-500/50 hover:text-violet-300"
          >
            <l.icon className="h-4 w-4" />
            {l.label}
          </Link>
        ))}
      </div>
    </>
  );
}
