"use client";

import { useMemo, useState } from "react";
import Card from "@/components/Card";
import { useOrg } from "@/components/OrgContext";
import { useRole } from "@/components/RoleContext";
import { useScope } from "@/components/ScopeContext";
import { CURRENT_STREAMER_ID, MGMT_ID, MGMT_NAME } from "@/components/orgData";
import { FeedIcon } from "@/components/icons";
import PostComposer from "./_components/PostComposer";
import PostCard from "./_components/PostCard";
import { initialFeedPosts, initialFeedComments, type FeedPost, type FeedComment } from "./_data";

function nowLabel() {
  const d = new Date();
  return `${d.getMonth() + 1}.${d.getDate()} ${String(d.getHours()).padStart(2, "0")}:${String(
    d.getMinutes()
  ).padStart(2, "0")}`;
}

export default function FeedPage() {
  const { role } = useRole();
  const { streamers } = useOrg();
  const { projectId } = useScope();

  const [posts, setPosts] = useState<FeedPost[]>(initialFeedPosts);
  const [comments, setComments] = useState<FeedComment[]>(initialFeedComments);

  const currentUserId = role === "management" ? MGMT_ID : CURRENT_STREAMER_ID;
  const currentUserName =
    role === "management" ? MGMT_NAME : streamers.find((s) => s.id === CURRENT_STREAMER_ID)?.name ?? "스트리머";

  const projectPosts = useMemo(
    () => posts.filter((p) => p.projectId === projectId).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)),
    [posts, projectId]
  );

  function handleCreatePost(text: string) {
    const post: FeedPost = {
      id: crypto.randomUUID(),
      projectId,
      authorId: currentUserId,
      authorName: currentUserName,
      authorRole: role,
      text,
      createdAt: nowLabel(),
      likedBy: [],
    };
    setPosts((prev) => [post, ...prev]);
  }

  function handleDeletePost(postId: string) {
    if (!confirm("이 게시글을 삭제할까요?")) return;
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    setComments((prev) => prev.filter((c) => c.postId !== postId));
  }

  function handleToggleLike(postId: string) {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              likedBy: p.likedBy.includes(currentUserId)
                ? p.likedBy.filter((id) => id !== currentUserId)
                : [...p.likedBy, currentUserId],
            }
          : p
      )
    );
  }

  function handleAddComment(postId: string, text: string) {
    const comment: FeedComment = {
      id: crypto.randomUUID(),
      postId,
      authorId: currentUserId,
      authorName: currentUserName,
      text,
      createdAt: nowLabel(),
    };
    setComments((prev) => [...prev, comment]);
  }

  return (
    <main className="flex flex-1 flex-col overflow-y-auto p-6">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-violet-600/15 text-violet-300 ring-1 ring-inset ring-violet-500/20">
            <FeedIcon className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-lg font-semibold text-white">피드</h1>
            <p className="text-sm text-slate-400">
              이 프로젝트에 참여 중인 누구나 소식을 올리고 댓글을 남길 수 있습니다.
            </p>
          </div>
        </div>

        <Card>
          <PostComposer authorId={currentUserId} authorName={currentUserName} onSubmit={handleCreatePost} />
        </Card>

        <div className="flex flex-col">
          {projectPosts.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-white/10 py-14 text-center">
              <FeedIcon className="h-6 w-6 text-slate-600" />
              <p className="text-sm text-slate-500">아직 올라온 소식이 없습니다.</p>
              <p className="text-xs text-slate-600">위에서 첫 게시글을 남겨보세요.</p>
            </div>
          ) : (
            projectPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                comments={comments.filter((c) => c.postId === post.id)}
                currentUserId={currentUserId}
                currentUserName={currentUserName}
                onToggleLike={handleToggleLike}
                onDeletePost={handleDeletePost}
                onAddComment={handleAddComment}
              />
            ))
          )}
        </div>
      </div>
    </main>
  );
}
