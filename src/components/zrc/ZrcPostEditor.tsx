"use client";

import { useState, useRef, useEffect } from "react";

const POST_TYPES = [
  { value: "question" as const, label: "疑问" },
  { value: "essay" as const, label: "随笔" },
  { value: "fanfic" as const, label: "二创" },
];

export function ZrcPostEditor({
  onClose,
  onSubmit,
}: {
  bookId: string;
  onClose: () => void;
  onSubmit: (post: { type: "question" | "essay" | "fanfic"; title: string; content: string }) => void;
}) {
  const [type, setType] = useState<"question" | "essay" | "fanfic">("question");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return;
    onSubmit({ type, title: title.trim(), content: content.trim() });
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-bg-primary rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto animate-slide-reveal">
        <div className="p-6 border-b border-border-light">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-light text-text-primary">发表新帖</h3>
            <button
              onClick={onClose}
              className="text-text-muted hover:text-text-primary text-xl leading-none transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <label className="text-xs font-mono text-text-tertiary tracking-wider uppercase mb-2 block">
              类型
            </label>
            <div className="flex gap-2">
              {POST_TYPES.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setType(t.value)}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                    type === t.value
                      ? "bg-accent text-white"
                      : "bg-bg-tertiary text-text-secondary hover:bg-bg-accent"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="text-xs font-mono text-text-tertiary tracking-wider uppercase mb-2 block">
              标题
            </label>
            <input
              ref={titleRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="输入标题..."
              className="w-full rounded-lg border border-border-light bg-bg-secondary text-text-primary text-sm px-4 py-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all placeholder:text-text-muted"
            />
          </div>

          <div className="mb-6">
            <label className="text-xs font-mono text-text-tertiary tracking-wider uppercase mb-2 block">
              内容
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              placeholder="分享你的想法..."
              className="w-full rounded-lg border border-border-light bg-bg-secondary text-text-primary text-sm px-4 py-3 leading-relaxed resize-y focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all placeholder:text-text-muted"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 text-sm py-2.5 rounded-lg border border-border-light text-text-secondary hover:text-text-primary transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleSubmit}
              disabled={!title.trim() || !content.trim()}
              className="flex-1 text-sm py-2.5 rounded-lg bg-accent text-white hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              发布
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
