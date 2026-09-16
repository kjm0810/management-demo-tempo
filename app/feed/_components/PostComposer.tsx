"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendIcon } from "@/components/icons";
import { colorForStreamer } from "@/components/orgData";

type PostComposerProps = {
  authorId: string;
  authorName: string;
  onSubmit: (text: string) => void;
};

export default function PostComposer({ authorId, authorName, onSubmit }: PostComposerProps) {
  const [text, setText] = useState("");
  const [focused, setFocused] = useState(false);
  const { gradient } = colorForStreamer(authorId);

  function handleSubmit() {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setText("");
  }

  return (
    <div className="flex gap-3">
      <span
        className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${gradient} text-sm font-semibold text-white shadow-sm`}
      >
        {authorName.slice(0, 1)}
      </span>

      <div
        className={`flex flex-1 flex-col gap-3 rounded-2xl border bg-black/20 p-3.5 transition-colors ${
          focused ? "border-violet-500/60" : "border-white/10"
        }`}
      >
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={`${authorName}(으)로 프로젝트 참여자들과 공유할 소식을 남겨보세요`}
          rows={2}
          className="w-full resize-none border-none bg-transparent p-0 shadow-none focus-visible:ring-0 dark:bg-transparent"
        />
        <div className="flex items-center justify-end">
          <Button onClick={handleSubmit} disabled={!text.trim()} size="sm" className="rounded-full">
            <SendIcon className="h-3.5 w-3.5" />
            게시
          </Button>
        </div>
      </div>
    </div>
  );
}
