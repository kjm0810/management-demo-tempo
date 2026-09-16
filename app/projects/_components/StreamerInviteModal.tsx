'use client';

import { useMemo, useState } from 'react';

import Modal from '@/components/Modal';
import type { Membership, Project, ProjectInvite, Streamer } from '@/components/orgData';
import { platformMeta } from '@/components/orgData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';

type StreamerInviteModalProps = {
  project: Project;
  projects: Project[];
  streamers: Streamer[];
  memberships: Membership[];
  projectInvites: ProjectInvite[];
  onClose: () => void;
  onInvite: (streamerIds: string[], phoneNumbers: string[]) => void;
};

export default function StreamerInviteModal({
  project,
  projects,
  streamers,
  memberships,
  projectInvites,
  onClose,
  onInvite
}: StreamerInviteModalProps) {
  const [selectedStreamerIds, setSelectedStreamerIds] = useState<string[]>([]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>([]);
  const [phoneError, setPhoneError] = useState('');

  const pendingInvites = projectInvites.filter(
    (invite) => invite.projectId === project.id && invite.status === 'pending'
  );

  const pendingStreamerIds = new Set(
    pendingInvites.map((invite) => invite.streamerId).filter((id): id is string => Boolean(id))
  );

  const pendingPhoneNumbers = new Set(
    pendingInvites.map((invite) => invite.phoneNumber).filter((phone): phone is string => Boolean(phone))
  );

  const existingStreamers = useMemo(() => {
    const companyProjectIds = new Set(
      projects.filter((item) => item.companyId === project.companyId).map((item) => item.id)
    );

    const companyStreamerIds = new Set(
      memberships
        .filter((membership) => companyProjectIds.has(membership.projectId))
        .map((membership) => membership.streamerId)
    );

    const currentProjectStreamerIds = new Set(
      memberships.filter((membership) => membership.projectId === project.id).map((membership) => membership.streamerId)
    );

    return streamers.filter(
      (streamer) => companyStreamerIds.has(streamer.id) && !currentProjectStreamerIds.has(streamer.id)
    );
  }, [memberships, project, projects, streamers]);

  function toggleStreamer(streamerId: string) {
    setSelectedStreamerIds((prev) =>
      prev.includes(streamerId) ? prev.filter((id) => id !== streamerId) : [...prev, streamerId]
    );
  }

  function addPhoneNumber() {
    const value = phoneNumber.trim();

    setPhoneError('');

    if (!value) return;

    if (phoneNumbers.includes(value)) {
      setPhoneError('이미 추가한 휴대폰 번호입니다.');
      return;
    }

    if (pendingPhoneNumbers.has(value)) {
      setPhoneError('이미 초대 대기 중인 휴대폰 번호입니다.');
      return;
    }

    setPhoneNumbers((prev) => [...prev, value]);
    setPhoneNumber('');
  }

  function removePhoneNumber(value: string) {
    setPhoneNumbers((prev) => prev.filter((phone) => phone !== value));
  }

  const inviteCount = selectedStreamerIds.length + phoneNumbers.length;
  const canInvite = inviteCount > 0;

  return (
    <Modal title='스트리머 초대' onClose={onClose} widthClassName='max-w-lg'>
      <div className='flex flex-col gap-5'>
        <p className='rounded-lg border border-white/10 bg-black/10 px-3 py-2 text-xs text-slate-400'>
          <span className='text-slate-300'>{project.name}</span> 프로젝트에 참여할 스트리머를 초대합니다.
        </p>

        <section className='flex flex-col gap-2'>
          <div>
            <h3 className='text-sm font-medium'>기존 스트리머</h3>
            <p className='text-xs text-muted-foreground'>이 회사와 기존 프로젝트에서 연결된 스트리머입니다.</p>
          </div>

          {existingStreamers.length === 0 ? (
            <p className='rounded-lg border border-white/10 bg-black/10 px-3 py-3 text-xs text-muted-foreground'>
              기존 스트리머가 없습니다.
            </p>
          ) : (
            <div className='flex max-h-44 flex-col gap-1.5 overflow-y-auto'>
              {existingStreamers.map((streamer) => {
                const isPending = pendingStreamerIds.has(streamer.id);

                return (
                  <label
                    key={streamer.id}
                    className='flex cursor-pointer items-center gap-3 rounded-lg border border-white/10 px-3 py-2'>
                    <Checkbox
                      checked={isPending || selectedStreamerIds.includes(streamer.id)}
                      disabled={isPending}
                      onCheckedChange={() => toggleStreamer(streamer.id)}
                    />

                    <div className='min-w-0'>
                      <div className='flex items-center gap-2'>
                        <p className='truncate text-sm'>{streamer.name}</p>
                        {isPending && <span className='text-xs text-amber-300'>초대 대기</span>}
                      </div>
                      <div className='mt-1 flex flex-wrap gap-1.5'>
                        {streamer.platformAccounts.map((account) => (
                          <div key={account.platform} className='flex items-center gap-1'>
                            <Badge className={`text-white ${platformMeta[account.platform].color}`}>
                              {platformMeta[account.platform].label}
                            </Badge>
                            <span className='text-xs text-muted-foreground'>{account.handle}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          )}
        </section>

        <div className='h-px bg-border' />

        <section className='flex flex-col gap-2'>
          <div>
            <h3 className='text-sm font-medium'>새 스트리머 초대</h3>
            <p className='text-xs text-muted-foreground'>휴대폰 번호로 프로젝트 초대코드를 발송합니다.</p>
          </div>

          <div className='flex gap-2'>
            <Input
              type='tel'
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(e.target.value);
                setPhoneError('');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addPhoneNumber();
                }
              }}
              placeholder='010-0000-0000'
            />

            <Button type='button' variant='outline' onClick={addPhoneNumber}>
              추가
            </Button>
          </div>
          {phoneError && <p className='text-xs text-destructive'>{phoneError}</p>}

          {phoneNumbers.length > 0 && (
            <div className='flex flex-col gap-1.5'>
              {phoneNumbers.map((phone) => (
                <div key={phone} className='flex items-center rounded-lg border border-white/10 px-3 py-2'>
                  <span className='text-sm'>{phone}</span>

                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    className='ml-auto'
                    onClick={() => removePhoneNumber(phone)}>
                    삭제
                  </Button>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className='flex items-center justify-between'>
          <span className='text-xs text-muted-foreground'>총 {inviteCount}명</span>

          <div className='flex gap-2'>
            <Button type='button' variant='ghost' onClick={onClose}>
              취소
            </Button>

            <Button type='button' disabled={!canInvite} onClick={() => onInvite(selectedStreamerIds, phoneNumbers)}>
              초대 발송
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
