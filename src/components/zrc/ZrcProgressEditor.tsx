"use client";

import { useState } from "react";

export function ZrcProgressEditor({
  bookId,
  currentProgress,
  onClose,
  onSave,
}: {
  bookId: string;
  currentProgress?: string;
  onClose: () => void;
  onSave: (progress: string) => void;
}) {
  const [progress, setProgress] = useState(currentProgress || "");

  const handleSubmit = async () => {
    try {
      const res = await fetch(`/api/zrc/progress`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId, progress }),
      });
      if (!res.ok) throw new Error("Save failed");
      onSave(progress);
      onClose();
    } catch {
      alert("保存失败，请重试");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-bg-primary rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-slide-reveal">
        <div className="p-6 border-b border-border-light">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-light text-text-primary">编辑阅读进度</h3>
            <button
              onClick={onClose}
              className="text-text-muted hover:text-text-primary text-xl leading-none transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6">
          <label className="text-xs font-mono text-text-tertiary tracking-wider uppercase mb-2 block">
            当前进度
          </label>
          <input
            type="text"
            value={progress}
            onChange={(e) => setProgress(e.target.value)}
            placeholder="第5章 / p.120"
            className="w-full rounded-lg border border-border-light bg-bg-secondary text-text-primary text-sm px-4 py-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all placeholder:text-text-muted"
            autoFocus
          />
        </div>

        <div className="p-6 pt-0 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 text-sm py-2.5 rounded-lg border border-border-light text-text-secondary hover:text-text-primary transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 text-sm py-2.5 rounded-lg bg-accent text-white hover:bg-accent-hover transition-colors"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
}
