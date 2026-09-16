import Link from 'next/link';

import { CloseIcon, PlusIcon } from '@/components/icons';
import {
  type Admin,
  type AdminLevel,
  type AdminMembership,
  type Company,
  type Project,
  type ProjectInvite,
  adminsForProject
} from '@/components/orgData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type CompanySectionProps = {
  company: Company;
  projects: Project[];
  /** 이 회사에 소속된 관리자들 + 이 회사에서의 등급 (다른 회사에서는 다른 등급일 수 있음) */
  companyAdmins: (Admin & { level: AdminLevel })[];
  adminMemberships: AdminMembership[];
  projectInvites: ProjectInvite[];
  onInviteStreamers: (project: Project) => void;
  onDeleteCompany: (id: string) => void;
  onDeleteProject: (id: string) => void;
  onAddAdmin: () => void;
  onManageAdminProjects: (admin: Admin) => void;
  onManageProjectAdmins: (project: Project) => void;
};

const levelLabel: Record<AdminLevel, string> = {
  general: '일반 관리자',
  super: '슈퍼 관리자'
};

export default function CompanySection({
  company,
  projects,
  companyAdmins,
  adminMemberships,
  projectInvites,
  onDeleteCompany,
  onDeleteProject,
  onAddAdmin,
  onManageAdminProjects,
  onManageProjectAdmins,
  onInviteStreamers
}: CompanySectionProps) {
  const companyProjects = projects.filter((p) => p.companyId === company.id);

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex items-center gap-2'>
        <span className='text-sm font-medium text-slate-200'>{company.name}</span>
        <Button
          variant='ghost'
          size='icon-sm'
          onClick={() => onDeleteCompany(company.id)}
          title='회사 삭제'
          className='ml-auto rounded-full text-slate-600 hover:text-red-400'>
          <CloseIcon className='h-3 w-3' />
        </Button>
      </div>

      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        <div className='flex flex-col gap-2'>
          <div className='flex items-center justify-between'>
            <span className='text-xs font-medium text-slate-400'>담당자 목록</span>
            <Button variant='outline' size='sm' onClick={onAddAdmin}>
              <PlusIcon className='h-3 w-3' />
              관리자 추가
            </Button>
          </div>
          {companyAdmins.length === 0 ? (
            <p className='text-xs text-slate-600'>등록된 담당자가 없습니다.</p>
          ) : (
            <div className='flex flex-col gap-1.5'>
              {companyAdmins.map((a) => (
                <div
                  key={a.id}
                  className='flex items-center gap-2 rounded-lg border border-white/10 bg-black/20 px-3 py-2'>
                  <span className='text-sm text-slate-200'>{a.name}</span>
                  <span className='text-xs text-slate-500'>{a.loginId}</span>
                  <Badge className={a.level === 'super' ? 'bg-violet-600 text-white' : 'bg-white/10 text-slate-300'}>
                    {levelLabel[a.level]}
                  </Badge>
                  {a.streamerId && <Badge className='bg-teal-500/10 text-teal-300'>스트리머 겸임</Badge>}
                  {a.level === 'general' && (
                    <Button variant='outline' size='sm' onClick={() => onManageAdminProjects(a)} className='ml-auto'>
                      프로젝트 연결
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className='flex flex-col gap-2'>
          <span className='text-xs font-medium text-slate-400'>프로젝트 목록</span>
          {companyProjects.length === 0 ? (
            <p className='text-xs text-slate-600'>등록된 프로젝트가 없습니다.</p>
          ) : (
            <div className='flex flex-col gap-1.5'>
              {companyProjects.map((p) => {
                const pendingInvites = projectInvites.filter(
                  (invite) => invite.projectId === p.id && invite.status === 'pending'
                );

                const pendingInviteCount = pendingInvites.length;

                return (
                  <div
                    key={p.id}
                    className='flex items-center gap-2 rounded-lg border border-white/10 bg-black/20 px-3 py-2'>
                    <span className='text-sm text-slate-200'>{p.name}</span>
                    {pendingInviteCount > 0 && (
                      <Badge variant='outline' className='text-amber-300'>
                        초대 대기 {pendingInviteCount}명
                      </Badge>
                    )}
                    {pendingInvites.length > 0 && (
                      <Link href={`/invites/${pendingInvites[0].inviteCode}`}>
                        <Button variant='ghost' size='sm'>
                          초대 테스트
                        </Button>
                      </Link>
                    )}
                    <Button variant='outline' size='sm' onClick={() => onInviteStreamers(p)} className='ml-auto'>
                      스트리머 초대
                    </Button>
                    <Button
                      variant='ghost'
                      size='icon-sm'
                      onClick={() => onDeleteProject(p.id)}
                      title='프로젝트 삭제'
                      className='rounded-full text-slate-500 hover:text-red-400'>
                      <CloseIcon className='h-3 w-3' />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className='flex flex-col gap-2'>
        <span className='text-xs font-medium text-slate-400'>프로젝트별 참여 관리자</span>
        {companyProjects.length === 0 ? (
          <p className='text-xs text-slate-600'>등록된 프로젝트가 없습니다.</p>
        ) : (
          <div className='flex flex-col gap-2'>
            {companyProjects.map((p) => {
              const projectAdmins = adminsForProject(p.id, companyAdmins, adminMemberships);
              return (
                <div
                  key={p.id}
                  className='flex flex-wrap items-center gap-2 rounded-lg border border-white/10 bg-black/10 px-3 py-2'>
                  <span className='text-sm text-slate-200'>{p.name}</span>
                  {projectAdmins.length === 0 ? (
                    <span className='text-xs text-slate-600'>참여 중인 관리자가 없습니다.</span>
                  ) : (
                    projectAdmins.map((a) => (
                      <Badge key={a.id} variant='outline' className='text-slate-300'>
                        {a.name}
                      </Badge>
                    ))
                  )}
                  <Button variant='outline' size='sm' onClick={() => onManageProjectAdmins(p)} className='ml-auto'>
                    관리자 수정
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
