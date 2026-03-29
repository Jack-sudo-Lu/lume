"use client";

import { useState } from "react";
import Link from "next/link";
import { getZrcBooks, getZrcActivity } from "@/lib/zrc";
import { ZrcBookCard } from "@/components/zrc/ZrcBookCard";
import { ZrcActivityEditor } from "@/components/zrc/ZrcActivityEditor";
import { ZrcReadingEditor } from "@/components/zrc/ZrcReadingEditor";
import { ZrcPlannedEditor } from "@/components/zrc/ZrcPlannedEditor";
import { ZrcActivity, ZrcBook } from "@/types";

export default function ZrcPage() {
  const [currentBook] = useState<ZrcBook | undefined>(
    getZrcBooks("reading")[0]
  );
  const [finishedBooks] = useState(getZrcBooks("finished"));
  const [plannedBooks] = useState(getZrcBooks("planned"));
  const [activity, setActivity] = useState<ZrcActivity>(getZrcActivity());
  const [showEditor, setShowEditor] = useState(false);
  const [showReadingEditor, setShowReadingEditor] = useState(false);
  const [showPlannedEditor, setShowPlannedEditor] = useState(false);


  return (
    <div className="max-w-5xl mx-auto px-6 py-12 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4 mb-12">
        <Link
          href="/"
          className="text-xl font-light text-text-primary hover:text-accent transition-colors"
        >
          Lume
        </Link>
        <span className="text-text-muted">/</span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/zrc_logo.png"
          alt="ZRC"
          className="w-20 h-20 rounded-full object-cover"
        />
      </div>

      <div className="text-center mb-16">
        <h1 className="text-3xl sm:text-4xl font-light text-text-primary mb-2">
          珠海文学读书会
        </h1>
        <p className="text-sm font-mono text-text-muted">Zhuhai Reading Club</p>
      </div>

      {/* Currently Reading */}
      <section className="mb-12 pb-12 border-b border-border-light">
        <div className="flex items-center justify-between mb-6">
          <span className="text-xs font-mono text-text-tertiary tracking-wider uppercase">
            正在阅读
          </span>
          <button
            onClick={() => setShowReadingEditor(true)}
            className="text-xs px-3 py-1.5 rounded-lg border border-border-light text-text-secondary hover:text-text-primary hover:border-accent transition-colors"
          >
            更换
          </button>
        </div>
        {currentBook ? (
          <Link
            href={`/zrc/book/${currentBook.bookId}`}
            className="block p-8 rounded-lg border border-border-light bg-bg-secondary/50 hover:bg-bg-secondary hover:border-border-medium transition-all duration-300"
          >
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="w-32 sm:w-40 flex-shrink-0">
                <div className="aspect-[2/3] bg-bg-tertiary rounded overflow-hidden">
                  {currentBook.isbn && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`https://covers.openlibrary.org/b/isbn/${currentBook.isbn}-L.jpg`}
                      alt={currentBook.titleCn}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  )}
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-light text-text-primary mb-1">
                  {currentBook.titleCn}
                </h2>
                <p className="text-sm text-text-tertiary mb-4">
                  {currentBook.title}
                </p>
                <p className="text-sm text-text-secondary mb-2">
                  {currentBook.authorCn}
                  <span className="text-text-muted mx-2">·</span>
                  <span className="text-text-muted">{currentBook.author}</span>
                </p>
                {currentBook.progress && (
                  <p className="text-sm text-accent font-mono">
                    进度：{currentBook.progress}
                  </p>
                )}
              </div>
            </div>
          </Link>
        ) : (
          <div className="text-center py-8 text-text-muted text-sm">
            暂无正在阅读的书，点击&ldquo;更换&rdquo;选择一本
          </div>
        )}
      </section>

      {/* This Week's Activity */}
      <section className="mb-12 pb-12 border-b border-border-light">
        <div className="flex items-center justify-between mb-6">
          <span className="text-xs font-mono text-text-tertiary tracking-wider uppercase">
            本周活动
          </span>
          <button
            onClick={() => setShowEditor(true)}
            className="text-xs px-3 py-1.5 rounded-lg border border-border-light text-text-secondary hover:text-text-primary hover:border-accent transition-colors"
          >
            编辑
          </button>
        </div>
        <div className="p-6 rounded-lg border border-border-light bg-bg-secondary/50">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-xs text-text-muted block mb-1">日期</span>
              <p className="text-sm text-text-primary font-mono">{activity.date}</p>
            </div>
            <div>
              <span className="text-xs text-text-muted block mb-1">时间</span>
              <p className="text-sm text-text-primary font-mono">{activity.time}</p>
            </div>
            <div>
              <span className="text-xs text-text-muted block mb-1">地点</span>
              <p className="text-sm text-text-primary">{activity.location}</p>
            </div>
            <div>
              <span className="text-xs text-text-muted block mb-1">阅读目标</span>
              <p className="text-sm text-text-primary">{activity.readingTarget || "待定"}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Finished Books */}
      {finishedBooks.length > 0 && (
        <section className="mb-12 pb-12 border-b border-border-light">
          <span className="text-xs font-mono text-text-tertiary tracking-wider uppercase mb-6 block">
            已读书目
          </span>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {finishedBooks.map((book) => (
              <ZrcBookCard key={book.bookId} book={book} size="medium" />
            ))}
          </div>
        </section>
      )}

      {/* Planned Books */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <span className="text-xs font-mono text-text-tertiary tracking-wider uppercase">
            计划书目
          </span>
          <button
            onClick={() => setShowPlannedEditor(true)}
            className="text-xs px-3 py-1.5 rounded-lg border border-border-light text-text-secondary hover:text-text-primary hover:border-accent transition-colors"
          >
            编辑
          </button>
        </div>
        {plannedBooks.length > 0 ? (
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {plannedBooks.map((book) => (
              <ZrcBookCard key={book.bookId} book={book} size="medium" />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-text-muted text-sm">
            暂无计划书目，点击&ldquo;编辑&rdquo;添加
          </div>
        )}
      </section>

      {/* Modals */}
      {showEditor && (
        <ZrcActivityEditor
          activity={activity}
          onClose={() => setShowEditor(false)}
          onSave={(updated) => {
            setActivity(updated);
            setShowEditor(false);
          }}
        />
      )}

      {showReadingEditor && (
        <ZrcReadingEditor
          onClose={() => setShowReadingEditor(false)}
          onSave={() => {
            // zrc.json was updated server-side, but getZrcBooks reads from the import
            // Need to reload the page to get fresh data
            window.location.reload();
          }}
        />
      )}

      {showPlannedEditor && (
        <ZrcPlannedEditor
          plannedBooks={plannedBooks}
          onClose={() => setShowPlannedEditor(false)}
          onSave={() => {
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}
