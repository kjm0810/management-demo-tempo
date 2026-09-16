'use client';

import { type FormEvent, useState } from 'react';

import Modal from '@/components/Modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type StreamerFormModalProps = {
  title: string;
  submitLabel: string;
  initial?: {
    name: string;
  };
  onClose: () => void;
  onSubmit: (name: string) => void;
};

export default function StreamerFormModal({ title, submitLabel, initial, onClose, onSubmit }: StreamerFormModalProps) {
  const [name, setName] = useState(initial?.name ?? '');

  const canSubmit = name.trim().length > 0;

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!canSubmit) return;

    onSubmit(name.trim());
  }

  return (
    <Modal title={title} onClose={onClose}>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <div className='flex flex-col gap-2'>
          <Label htmlFor='streamer-name' className='text-xs text-slate-400'>
            이름
          </Label>
          <Input
            id='streamer-name'
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder='스트리머 이름 입력'
          />
        </div>

        <div className='mt-2 flex justify-end gap-2'>
          <Button type='button' variant='ghost' onClick={onClose}>
            취소
          </Button>
          <Button type='submit' disabled={!canSubmit}>
            {submitLabel}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
