"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { BookmarkIcon, HeartIcon, MessageIcon, MoreHorizontalIcon, SendIcon } from "@/components/icons";
import { colorForStreamer } from "@/components/orgData";
import type { FeedComment, FeedPost } from "../_data";

type PostCardProps = {
  post: FeedPost;
  comments: FeedComment[];
  currentUserId: string;
  currentUserName: string;
  onToggleLike: (postId: string) => void;
  onDeletePost: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
};

const roleLabel = {
  management: "매니지먼트사",
  streamer: "스트리머",
};

function Avatar({ id, name, size = "h-8 w-8" }: { id: string; name: string; size?: string }) {
  const { gradient } = colorForStreamer(id);
  return (
    <span
      className={`flex ${size} shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${gradient} text-xs font-semibold text-white`}
    >
      {name.slice(0, 1)}
    </span>
  );
}

export default function PostCard({
  post,
  comments,
  currentUserId,
  currentUserName,
  onToggleLike,
  onDeletePost,
  onAddComment,
}: PostCardProps) {
  const [commentDraft, setCommentDraft] = useState("");
  const [showAllComments, setShowAllComments] = useState(false);
  const [burst, setBurst] = useState(false);
  const liked = post.likedBy.includes(currentUserId);
  const isMine = post.authorId === currentUserId;

  function submitComment() {
    const trimmed = commentDraft.trim();
    if (!trimmed) return;
    onAddComment(post.id, trimmed);
    setCommentDraft("");
  }

  function handleDoubleClick() {
    if (!liked) onToggleLike(post.id);
    setBurst(true);
    window.setTimeout(() => setBurst(false), 400);
  }

  const visibleComments = showAllComments ? comments : comments.slice(-2);
  const hiddenCount = comments.length - visibleComments.length;

  return (
    <article className="border-b border-white/5 py-5">
      <div className="flex items-center gap-2.5">
        <Avatar id={post.authorId} name={post.authorName} />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-sm font-semibold text-slate-100">{post.authorName}</span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-500">{roleLabel[post.authorRole]}</span>
          </div>
          <span className="text-[11px] text-slate-500">{post.createdAt}</span>
        </div>

        {isMine && (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="icon-sm" className="shrink-0 text-slate-500 hover:text-slate-200">
                  <MoreHorizontalIcon className="h-4 w-4" />
                </Button>
              }
            />
            <DropdownMenuContent align="end">
              <DropdownMenuItem variant="destructive" onClick={() => onDeletePost(post.id)}>
                삭제
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <p
        onDoubleClick={handleDoubleClick}
        className="mt-3 cursor-default text-[13.5px] leading-relaxed whitespace-pre-wrap text-slate-200"
      >
        <span className="mr-1.5 font-semibold text-slate-100">{post.authorName}</span>
        {post.text}
      </p>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <button
            onClick={() => onToggleLike(post.id)}
            className="text-slate-300 transition-transform active:scale-90"
            title="좋아요"
          >
            <HeartIcon
              className={`h-6 w-6 transition-transform ${burst ? "scale-125" : ""} ${
                liked ? "fill-red-500 text-red-500" : "hover:text-slate-100"
              }`}
            />
          </button>
          <MessageIcon className="h-6 w-6 text-slate-300" />
          <SendIcon className="h-5 w-5 -rotate-12 text-slate-300" />
        </div>
        <button title="저장" className="text-slate-300 hover:text-slate-100">
          <BookmarkIcon className="h-6 w-6" />
        </button>
      </div>

      {post.likedBy.length > 0 && (
        <p className="mt-2 text-[13px] font-semibold text-slate-100">좋아요 {post.likedBy.length}개</p>
      )}

      {comments.length > 0 && (
        <div className="mt-2 flex flex-col gap-1.5">
          {hiddenCount > 0 && (
            <button
              onClick={() => setShowAllComments(true)}
              className="text-left text-[13px] text-slate-500 hover:text-slate-300"
            >
              댓글 {comments.length}개 모두 보기
            </button>
          )}
          {visibleComments.map((c) => (
            <p key={c.id} className="text-[13px] leading-relaxed text-slate-300">
              <span className="mr-1.5 font-semibold text-slate-100">{c.authorName}</span>
              {c.text}
            </p>
          ))}
        </div>
      )}

      <div className="mt-3 flex items-center gap-2 border-t border-white/5 pt-3">
        <Input
          value={commentDraft}
          onChange={(e) => setCommentDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submitComment();
          }}
          placeholder={`${currentUserName}(으)로 댓글 달기...`}
          className="flex-1 border-none bg-transparent px-0 shadow-none focus-visible:ring-0"
        />
        {commentDraft.trim() && (
          <button
            onClick={submitComment}
            className="shrink-0 text-sm font-semibold text-sky-400 hover:text-sky-300"
          >
            게시
          </button>
        )}
      </div>
    </article>
  );
}
