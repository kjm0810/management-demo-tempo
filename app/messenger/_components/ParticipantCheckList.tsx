import { Checkbox } from "@/components/ui/checkbox";

type ParticipantCheckListProps = {
  candidates: { id: string; name: string }[];
  selected: Set<string>;
  onToggle: (id: string) => void;
};

export default function ParticipantCheckList({ candidates, selected, onToggle }: ParticipantCheckListProps) {
  if (candidates.length === 0) {
    return <p className="text-sm text-slate-500">선택할 수 있는 참여자가 없습니다.</p>;
  }

  return (
    <div className="flex max-h-64 flex-col gap-1 overflow-y-auto">
      {candidates.map((c) => (
        <label
          key={c.id}
          className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 hover:bg-white/5"
        >
          <Checkbox checked={selected.has(c.id)} onCheckedChange={() => onToggle(c.id)} />
          <span className="text-sm text-slate-200">{c.name}</span>
        </label>
      ))}
    </div>
  );
}
