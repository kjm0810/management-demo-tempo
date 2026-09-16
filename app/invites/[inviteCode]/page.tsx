'use client';

import { use } from 'react';

import Link from 'next/link';

import { useOrg } from '@/components/OrgContext';
import { isProjectInviteExpired } from '@/components/orgData';
import { Button } from '@/components/ui/button';

type InvitePageProps = {
  params: Promise<{
    inviteCode: string;
  }>;
};

export default function InvitePage({ params }: InvitePageProps) {
  const { inviteCode } = use(params);
  const { projectInvites, projects, companies, acceptProjectInvite } = useOrg();

  const invite = projectInvites.find((item) => item.inviteCode === inviteCode);
  const project = invite ? projects.find((item) => item.id === invite.projectId) : undefined;
  const company = project ? companies.find((item) => item.id === project.companyId) : undefined;

  if (!invite || !project || !company) {
    return (
      <main className='flex min-h-screen items-center justify-center p-6'>
        <p className='text-sm text-muted-foreground'>유효하지 않은 초대입니다.</p>
      </main>
    );
  }

  const isExpired = isProjectInviteExpired(invite);

  return (
    <main className='flex min-h-screen items-center justify-center p-6'>
      <div className='flex w-full max-w-md flex-col gap-5 rounded-2xl border border-border p-6'>
        <div className='flex flex-col gap-1'>
          <p className='text-sm text-muted-foreground'>{company.name}</p>
          <h1 className='text-xl font-semibold'>{project.name}</h1>
          <p className='text-sm text-muted-foreground'>프로젝트에 초대되었습니다.</p>
        </div>

        {isExpired ? (
          <p className='text-sm text-destructive'>만료된 초대입니다.</p>
        ) : invite.status === 'pending' ? (
          invite.streamerId ? (
            <Button onClick={() => acceptProjectInvite(invite.id)}>프로젝트 참여</Button>
          ) : (
            <div className='flex flex-col gap-3'>
              <p className='text-sm text-muted-foreground'>프로젝트에 참여하려면 로그인 또는 회원가입이 필요합니다.</p>
              <Link href={`/login?invite=${encodeURIComponent(invite.inviteCode)}`}>
                <Button className='w-full'>로그인 / 회원가입 후 참여</Button>
              </Link>
            </div>
          )
        ) : (
          <p className='text-sm text-muted-foreground'>이미 수락한 초대입니다.</p>
        )}
      </div>
    </main>
  );
}
