"use client";

import { ZrcForumPost } from "@/types";

const POST_TYPE_LABELS = {
  question: "疑问",
  essay: "随笔",
  fanfic: "二创",
};

const POST_TYPE_COLORS = {
  question: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  essay: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  fanfic: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
};

export function ZrcPostCard({
  post,
  onClick,
}: {
  post: ZrcForumPost;
  onClick?: () => void;
}) {
  const date = new Date(post.createdAt).toLocaleDateString("zh-CN", {
    month: "short",
    day: "numeric",
  });

  return (
    <div
      onClick={onClick}
      className="p-6 rounded-lg border border-border-light bg-bg-secondary/50 hover:bg-bg-secondary hover:border-border-medium transition-all duration-300 cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <span
          className={`text-xs px-2 py-1 rounded-full ${POST_TYPE_COLORS[post.type]}`}
        >
          {POST_TYPE_LABELS[post.type]}
        </span>
        <span className="text-xs text-text-muted font-mono">{date}</span>
      </div>
      <h3 className="text-base font-light text-text-primary mb-2">
        {post.title}
      </h3>
      <p className="text-sm text-text-secondary line-clamp-2 mb-3">
        {post.content}
      </p>
      <div className="flex items-center justify-between text-xs text-text-muted">
        <span>{post.authorName}</span>
        <span>{post.comments.length} 条评论</span>
      </div>
    </div>
  );
}
