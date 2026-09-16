'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { type Role, useRole } from './RoleContext';
import {
  BarIcon,
  CalendarIcon,
  FeedIcon,
  FolderIcon,
  HomeIcon,
  MegaphoneIcon,
  MessageIcon,
  MonitorIcon,
  SettingsIcon,
  UserIcon
} from './icons';
import { useAdminLevel } from './useAdminLevel';

const navItems: {
  href: string;
  label: string;
  icon: typeof HomeIcon;
  roles: Role[];
  /** true면 슈퍼 관리자에게만 보인다. */
  superOnly?: boolean;
}[] = [
  { href: '/', label: '홈', icon: HomeIcon, roles: ['management', 'streamer'] },
  { href: '/management', label: '매니지먼트', icon: MonitorIcon, roles: ['management'] },
  { href: '/streamers', label: '업체/스트리머 관리', icon: UserIcon, roles: ['management'] },
  { href: '/projects', label: '프로젝트 관리', icon: FolderIcon, roles: ['management'], superOnly: true },
  { href: '/calendar', label: '캘린더', icon: CalendarIcon, roles: ['management', 'streamer'] },
  { href: '/messenger', label: '메신저', icon: MessageIcon, roles: ['management', 'streamer'] },
  { href: '/feed', label: '피드', icon: FeedIcon, roles: ['management', 'streamer'] },
  { href: '/reports', label: '리포트', icon: BarIcon, roles: ['management'] },
  { href: '/notices', label: '공지사항', icon: MegaphoneIcon, roles: ['management', 'streamer'] }
];

export default function Sidebar() {
  const pathname = usePathname();
  const { role } = useRole();
  const adminLevel = useAdminLevel();
  const items = navItems.filter((item) => item.roles.includes(role) && (!item.superOnly || adminLevel === 'super'));

  return (
    <aside className='flex h-full w-20 shrink-0 flex-col items-center justify-between border-r border-white/5 bg-[#0b0e1a] py-6'>
      <div className='flex flex-col items-center gap-3'>
        {items.map(({ href, label, icon: Icon }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              title={label}
              className={
                active
                  ? 'flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-600/30'
                  : 'flex h-12 w-12 items-center justify-center rounded-2xl text-slate-500 transition-colors hover:bg-white/5 hover:text-slate-300'
              }>
              <Icon />
            </Link>
          );
        })}
      </div>

      <div className='flex flex-col items-center gap-3'>
        <Link
          href='/settings'
          title='설정'
          className={
            pathname.startsWith('/settings')
              ? 'flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-600/30'
              : 'flex h-12 w-12 items-center justify-center rounded-2xl text-slate-500 transition-colors hover:bg-white/5 hover:text-slate-300'
          }>
          <SettingsIcon />
        </Link>
        <div className='h-11 w-11 rounded-full bg-slate-700' />
      </div>
    </aside>
  );
}
