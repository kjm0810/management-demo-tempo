'use client';

import { useState } from 'react';

import { useOrg } from '@/components/OrgContext';
import { useRole } from '@/components/RoleContext';
import { CURRENT_ADMIN_ID, CURRENT_STREAMER_ID, type Project, platformMeta } from '@/components/orgData';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

import StreamerFormModal from '../streamers/_components/StreamerFormModal';

export default function SettingsPage() {
  const { role } = useRole();
  const { streamers, companies, projects, memberships, admins, adminCompanyMemberships, updateStreamer } = useOrg();
  const [editingProfile, setEditingProfile] = useState(false);

  const currentStreamer = streamers.find((streamer) => streamer.id === CURRENT_STREAMER_ID);

  const joinedProjects =
    role === 'streamer' && currentStreamer
      ? memberships
          .filter((membership) => membership.streamerId === currentStreamer.id)
          .map((membership) => projects.find((project) => project.id === membership.projectId))
          .filter((project): project is Project => Boolean(project))
      : [];

  const platformConnections = (['soop', 'chzzk', 'youtube'] as const).map((platform) => ({
    platform,
    account: currentStreamer?.platformAccounts.find((account) => account.platform === platform) ?? null
  }));

  const currentAdmin = admins.find((admin) => admin.id === CURRENT_ADMIN_ID);

  const adminCompanies = adminCompanyMemberships
    .filter((membership) => membership.adminId === CURRENT_ADMIN_ID)
    .map((membership) => ({
      membership,
      company: companies.find((company) => company.id === membership.companyId)
    }))
    .filter((item) => Boolean(item.company));

  if (role === 'streamer' && !currentStreamer) {
    return (
      <main className='flex flex-1 items-center justify-center p-6'>
        <p className='text-sm text-slate-500'>스트리머 정보를 찾을 수 없습니다.</p>
      </main>
    );
  }

  return (
    <>
      <main className='flex flex-1 flex-col gap-5 overflow-y-auto p-6'>
        <div>
          <h1 className='text-lg font-semibold text-white'>설정</h1>
          <p className='text-sm text-slate-400'>계정 및 프로필 정보를 관리합니다.</p>
        </div>
        <section className='rounded-2xl border border-white/5 bg-[#141a2b] p-5'>
          <div className='flex flex-col gap-4'>
            <div>
              <h2 className='font-medium text-white'>계정 및 보안</h2>
              <p className='text-sm text-slate-400'>프로필과 로그인 정보를 관리합니다.</p>
            </div>

            <div className='flex items-center justify-between gap-4 border-b border-white/5 pb-4'>
              <div className='flex flex-col gap-1'>
                <span className='text-xs text-slate-500'>이름</span>
                <span className='text-sm text-slate-200'>
                  {role === 'streamer' ? currentStreamer?.name : currentAdmin?.name}
                </span>
              </div>

              {role === 'streamer' && (
                <Button variant='outline' size='sm' onClick={() => setEditingProfile(true)}>
                  프로필 수정
                </Button>
              )}
            </div>

            <div className='flex items-center justify-between gap-4 border-b border-white/5 pb-4'>
              <div className='flex flex-col gap-1'>
                <span className='text-xs text-slate-500'>로그인 아이디</span>
                <span className='text-sm text-slate-200'>
                  {role === 'management' ? currentAdmin?.loginId : currentStreamer?.loginId}
                </span>
              </div>
            </div>

            <div className='flex items-center justify-between gap-4'>
              <div className='flex flex-col gap-1'>
                <span className='text-sm text-slate-200'>비밀번호</span>
                <span className='text-xs text-slate-500'>계정 비밀번호를 변경합니다.</span>
              </div>

              <Button variant='outline' size='sm'>
                비밀번호 변경
              </Button>
            </div>
          </div>
        </section>
        {role === 'streamer' && currentStreamer && (
          <>
            <section className='rounded-2xl border border-white/5 bg-[#141a2b] p-5'>
              <div className='flex flex-col gap-4'>
                <div>
                  <h2 className='font-medium text-white'>연결된 플랫폼</h2>
                  <p className='text-sm text-slate-400'>방송 플랫폼 계정을 연결하고 관리합니다.</p>
                </div>

                <div className='flex flex-col divide-y divide-white/5'>
                  {platformConnections.map((connection) => (
                    <div
                      key={connection.platform}
                      className='flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0'>
                      <div className='flex flex-col gap-2'>
                        <div className='flex items-center gap-2'>
                          <Badge className={`text-white ${platformMeta[connection.platform].color}`}>
                            {platformMeta[connection.platform].label}
                          </Badge>

                          <Badge variant='outline' className={connection.account ? 'text-slate-300' : 'text-slate-500'}>
                            {connection.account ? '연결됨' : '미연결'}
                          </Badge>
                        </div>

                        <span className='text-xs text-slate-500'>
                          {connection.account?.handle ?? '연결된 계정 없음'}
                        </span>
                      </div>

                      <Button variant='outline' size='sm'>
                        {connection.account ? '연결 해제' : '연결'}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </section>
            <section className='rounded-2xl border border-white/5 bg-[#141a2b] p-5'>
              <div className='flex flex-col gap-4'>
                <div>
                  <h2 className='font-medium text-white'>참여 프로젝트</h2>
                  <p className='text-sm text-slate-400'>현재 참여 중인 프로젝트입니다.</p>
                </div>

                <div className='flex flex-col divide-y divide-white/5'>
                  {joinedProjects.length === 0 ? (
                    <p className='text-sm text-slate-500'>참여 중인 프로젝트가 없습니다.</p>
                  ) : (
                    joinedProjects.map((project) => {
                      const company = companies.find((item) => item.id === project.companyId);

                      return (
                        <div key={project.id} className='flex items-center justify-between py-3 first:pt-0 last:pb-0'>
                          <span className='text-sm text-slate-200'>{project.name}</span>
                          <span className='text-xs text-slate-500'>{company?.name}</span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </section>
          </>
        )}
        {role === 'management' && currentAdmin && (
          <>
            <section className='rounded-2xl border border-white/5 bg-[#141a2b] p-5'>
              <div className='flex flex-col gap-4'>
                <div>
                  <h2 className='font-medium text-white'>소속 회사</h2>
                  <p className='text-sm text-slate-400'>회사별 관리자 권한을 확인할 수 있습니다.</p>
                </div>

                <div className='flex flex-col divide-y divide-white/5'>
                  {adminCompanies.map(({ membership, company }) => (
                    <div
                      key={membership.companyId}
                      className='flex items-center justify-between py-3 first:pt-0 last:pb-0'>
                      <span className='text-sm text-slate-200'>{company?.name}</span>
                      <span className='text-xs text-slate-500'>
                        {membership.level === 'super' ? '슈퍼 관리자' : '일반 관리자'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
        <section className='rounded-2xl border border-white/5 bg-[#141a2b] p-5'>
          <div className='flex flex-col gap-4'>
            <div>
              <h2 className='font-medium text-white'>알림 설정</h2>
              <p className='text-sm text-slate-400'>서비스에서 받을 알림을 설정합니다.</p>
            </div>

            <div className='flex flex-col divide-y divide-white/5'>
              {[
                {
                  title: '프로젝트 알림',
                  description: '프로젝트 초대 및 변경 사항에 대한 알림을 받습니다.'
                },
                {
                  title: '메시지 알림',
                  description: '새로운 메시지가 도착하면 알림을 받습니다.'
                },
                {
                  title: '공지사항 알림',
                  description: '새로운 공지사항이 등록되면 알림을 받습니다.'
                }
              ].map((notification) => (
                <div
                  key={notification.title}
                  className='flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0'>
                  <div className='flex flex-col gap-1'>
                    <span className='text-sm text-slate-200'>{notification.title}</span>
                    <span className='text-xs text-slate-500'>{notification.description}</span>
                  </div>

                  <Switch defaultChecked aria-label={notification.title} />
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className='rounded-2xl border border-white/5 bg-[#141a2b] p-5'>
          <div className='flex flex-col gap-4'>
            <div>
              <h2 className='font-medium text-white'>계정 관리</h2>
              <p className='text-sm text-slate-400'>로그인 세션 및 계정을 관리합니다.</p>
            </div>

            <div className='flex items-center justify-between gap-4 border-b border-white/5 pb-4'>
              <div className='flex flex-col gap-1'>
                <span className='text-sm text-slate-200'>로그아웃</span>
                <span className='text-xs text-slate-500'>현재 계정에서 로그아웃합니다.</span>
              </div>

              <Button variant='outline'>로그아웃</Button>
            </div>

            <div className='flex items-center justify-between gap-4'>
              <div className='flex flex-col gap-1'>
                <span className='text-sm text-slate-200'>회원 탈퇴</span>
                <span className='text-xs text-slate-500'>계정을 삭제하고 서비스 이용을 종료합니다.</span>
              </div>

              <AlertDialog>
                <AlertDialogTrigger
                  render={
                    <Button type='button' variant='outline' className='hover:border-red-500/50 hover:text-red-400' />
                  }>
                  회원 탈퇴
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>정말 회원 탈퇴하시겠습니까?</AlertDialogTitle>
                    <AlertDialogDescription>
                      탈퇴하면 현재 계정으로 더 이상 서비스를 이용할 수 없습니다.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel>취소</AlertDialogCancel>
                    <AlertDialogAction className='bg-red-600 text-white hover:bg-red-500'>회원 탈퇴</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </section>
      </main>

      {role === 'streamer' && currentStreamer && editingProfile && (
        <StreamerFormModal
          title='내 프로필 수정'
          submitLabel='저장'
          initial={{
            name: currentStreamer.name
          }}
          onClose={() => setEditingProfile(false)}
          onSubmit={(name) => {
            updateStreamer(currentStreamer.id, name);
            setEditingProfile(false);
          }}
        />
      )}
    </>
  );
}
