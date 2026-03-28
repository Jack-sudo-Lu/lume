"use client";

import { useState } from "react";
import { ZrcActivity } from "@/types";

export function ZrcActivityEditor({
  activity,
  onClose,
  onSave,
}: {
  activity: ZrcActivity;
  onClose: () => void;
  onSave: (activity: ZrcActivity) => void;
}) {
  const [date, setDate] = useState(activity.date);
  const [time, setTime] = useState(activity.time);
  const [location, setLocation] = useState(activity.location);
  const [currentBook, setCurrentBook] = useState(activity.currentBook);
  const [readingTarget, setReadingTarget] = useState(activity.readingTarget || "");

  const handleSubmit = async () => {
    const updated: ZrcActivity = {
      date,
      time,
      location,
      currentBook,
      readingTarget: readingTarget || undefined,
    };

    try {
      const res = await fetch("/api/zrc/activity", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (!res.ok) throw new Error("Save failed");
      onSave(updated);
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
      <div className="bg-bg-primary rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden animate-slide-reveal">
        <div className="p-6 border-b border-border-light">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-light text-text-primary">编辑活动信息</h3>
            <button
              onClick={onClose}
              className="text-text-muted hover:text-text-primary text-xl leading-none transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="text-xs font-mono text-text-tertiary tracking-wider uppercase mb-2 block">
              日期
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border border-border-light bg-bg-secondary text-text-primary text-sm px-4 py-2 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-text-tertiary tracking-wider uppercase mb-2 block">
              时间
            </label>
            <input
              type="text"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="14:00-16:00"
              className="w-full rounded-lg border border-border-light bg-bg-secondary text-text-primary text-sm px-4 py-2 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all placeholder:text-text-muted"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-text-tertiary tracking-wider uppercase mb-2 block">
              地点
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded-lg border border-border-light bg-bg-secondary text-text-primary text-sm px-4 py-2 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-text-tertiary tracking-wider uppercase mb-2 block">
              当前书目
            </label>
            <input
              type="text"
              value={currentBook}
              onChange={(e) => setCurrentBook(e.target.value)}
              className="w-full rounded-lg border border-border-light bg-bg-secondary text-text-primary text-sm px-4 py-2 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-text-tertiary tracking-wider uppercase mb-2 block">
              阅读目标
            </label>
            <input
              type="text"
              value={readingTarget}
              onChange={(e) => setReadingTarget(e.target.value)}
              placeholder="第5-8章"
              className="w-full rounded-lg border border-border-light bg-bg-secondary text-text-primary text-sm px-4 py-2 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all placeholder:text-text-muted"
            />
          </div>
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
