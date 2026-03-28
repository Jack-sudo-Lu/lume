"use client";

import { useState } from "react";
import { ZrcComment } from "@/types";

export function ZrcCommentSection({
  comments,
  onAddComment,
}: {
  comments: ZrcComment[];
  onAddComment: (content: string) => void;
}) {
  const [newComment, setNewComment] = useState("");

  const handleSubmit = () => {
    if (!newComment.trim()) return;
    onAddComment(newComment.trim());
    setNewComment("");
  };

  return (
    <div className="mt-6 pt-6 border-t border-border-light">
      <h4 className="text-sm font-mono text-text-tertiary tracking-wider uppercase mb-4">
        评论 ({comments.length})
      </h4>

      {comments.map((comment) => {
        const date = new Date(comment.createdAt).toLocaleDateString("zh-CN", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
        return (
          <div key={comment.id} className="mb-4 pb-4 border-b border-border-light last:border-0">
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-xs text-text-secondary">{comment.authorName}</span>
              <span className="text-xs text-text-muted font-mono">{date}</span>
            </div>
            <p className="text-sm text-text-primary leading-relaxed">{comment.content}</p>
          </div>
        );
      })}

      <div className="mt-4">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={3}
          placeholder="写下你的评论..."
          className="w-full rounded-lg border border-border-light bg-bg-secondary text-text-primary text-sm px-4 py-3 leading-relaxed resize-y focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all placeholder:text-text-muted"
        />
        <button
          onClick={handleSubmit}
          disabled={!newComment.trim()}
          className="mt-2 text-sm px-5 py-2 rounded-lg bg-accent text-white hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          发表评论
        </button>
      </div>
    </div>
  );
}
