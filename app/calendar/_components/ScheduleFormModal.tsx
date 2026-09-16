"use client";

import { useState, type FormEvent } from "react";
import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { streamersInProject, colorForStreamer, type Streamer, type Membership } from "@/components/orgData";

const labelOptions = ["방송 예정", "방송 진행 중", "방송 완료"];

export type NewScheduleInput = {
  dateKey: string;
  streamerName: string;
  gradient: string;
  color: string;
  startHour: number;
  endHour: number;
  label: string;
};

type ScheduleFormModalProps = {
  isManagement: boolean;
  defaultDate: string;
  currentStreamerId: string;
  companyName: string;
  projectId: string;
  projectName: string;
  streamers: Streamer[];
  memberships: Membership[];
  onClose: () => void;
  onSubmit: (input: NewScheduleInput) => void;
};

function toHour(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h + m / 60;
}

export default function ScheduleFormModal({
  isManagement,
  defaultDate,
  currentStreamerId,
  companyName,
  projectId,
  projectName,
  streamers,
  memberships,
  onClose,
  onSubmit,
}: ScheduleFormModalProps) {
  const [date, setDate] = useState(defaultDate);

  const streamerOptions = streamersInProject(projectId, streamers, memberships);
  const currentStreamer = streamers.find((s) => s.id === currentStreamerId);
  const [streamerId, setStreamerId] = useState(isManagement ? streamerOptions[0]?.id ?? "" : currentStreamerId);

  const [startTime, setStartTime] = useState("14:00");
  const [endTime, setEndTime] = useState("16:00");
  const [label, setLabel] = useState(labelOptions[0]);

  const selectedStreamer = isManagement ? streamers.find((s) => s.id === streamerId) : currentStreamer;

  const canSubmit =
    Boolean(date) && Boolean(selectedStreamer) && Boolean(startTime) && Boolean(endTime) && toHour(startTime) < toHour(endTime);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit || !selectedStreamer) return;
    const palette = colorForStreamer(selectedStreamer.id);
    onSubmit({
      dateKey: date,
      streamerName: selectedStreamer.name,
      gradient: palette.gradient,
      color: palette.color,
      startHour: toHour(startTime),
      endHour: toHour(endTime),
      label,
    });
  }

  return (
    <Modal title="일정 추가" onClose={onClose} widthClassName="max-w-md">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <p className="rounded-lg border border-white/10 bg-black/10 px-3 py-2 text-xs text-slate-400">
          <span className="text-slate-300">{companyName}</span> · <span className="text-slate-300">{projectName}</span>{" "}
          기준으로 추가됩니다 (헤더에서 변경)
        </p>

        <div className="flex flex-col gap-2">
          <Label htmlFor="schedule-date" className="text-xs text-slate-400">
            날짜
          </Label>
          <Input id="schedule-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>

        {isManagement ? (
          <div className="flex flex-col gap-2">
            <Label htmlFor="schedule-streamer" className="text-xs text-slate-400">
              스트리머
            </Label>
            <Select
              value={streamerId}
              onValueChange={(v) => setStreamerId(v ?? "")}
              disabled={streamerOptions.length === 0}
            >
              <SelectTrigger id="schedule-streamer" className="w-full">
                <SelectValue placeholder="이 프로젝트에 스트리머 없음">
                  {streamerOptions.find((s) => s.id === streamerId)?.name}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {streamerOptions.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <span className="text-xs text-slate-400">스트리머</span>
            <div className="rounded-lg border border-white/10 bg-black/10 px-3 py-2 text-sm text-slate-300">
              {currentStreamer?.name}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="schedule-start" className="text-xs text-slate-400">
              시작 시간
            </Label>
            <Input id="schedule-start" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="schedule-end" className="text-xs text-slate-400">
              종료 시간
            </Label>
            <Input id="schedule-end" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="schedule-label" className="text-xs text-slate-400">
            상태
          </Label>
          <Select value={label} onValueChange={(v) => setLabel(v ?? labelOptions[0])}>
            <SelectTrigger id="schedule-label" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {labelOptions.map((l) => (
                <SelectItem key={l} value={l}>
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            취소
          </Button>
          <Button type="submit" disabled={!canSubmit}>
            추가
          </Button>
        </div>
      </form>
    </Modal>
  );
}
