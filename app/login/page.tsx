'use client';

import { type FormEvent, use, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type LoginPageProps = {
  searchParams: Promise<{
    invite?: string;
  }>;
};

export default function LoginPage({ searchParams }: LoginPageProps) {
  const { invite: inviteCode } = use(searchParams);

  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    // TODO: 인증 API 연동
    console.log('로그인', {
      loginId,
      password,
      inviteCode
    });
  }

  return (
    <main className='flex min-h-screen items-center justify-center p-6'>
      <div className='flex w-full max-w-sm flex-col gap-6 rounded-2xl border border-border p-6'>
        <div className='flex flex-col gap-1'>
          <h1 className='text-xl font-semibold'>로그인</h1>
          <p className='text-sm text-muted-foreground'>
            {inviteCode ? '로그인 후 프로젝트 초대를 확인할 수 있습니다.' : '계정으로 로그인하세요.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <div className='flex flex-col gap-2'>
            <Label htmlFor='login-id'>아이디</Label>
            <Input
              id='login-id'
              value={loginId}
              onChange={(event) => setLoginId(event.target.value)}
              autoComplete='username'
              placeholder='아이디'
            />
          </div>

          <div className='flex flex-col gap-2'>
            <Label htmlFor='password'>비밀번호</Label>
            <Input
              id='password'
              type='password'
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete='current-password'
              placeholder='비밀번호'
            />
          </div>

          <Button type='submit' disabled={!loginId.trim() || !password}>
            로그인
          </Button>
        </form>
      </div>
    </main>
  );
}
