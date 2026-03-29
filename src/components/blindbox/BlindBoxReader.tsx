"use client";

import { useState, useEffect, useCallback } from "react";
import { BookExcerpt } from "@/types";
import { getRandomExcerpt } from "@/lib/blindbox";
import { addToShelfApi, fetchShelf } from "@/lib/shelfApi";
import { useAuth } from "@/components/auth/AuthProvider";

type BlindBoxState = "idle" | "reading" | "reveal";

export function BlindBoxReader() {
  const [state, setState] = useState<BlindBoxState>("idle");
  const [excerpt, setExcerpt] = useState<BookExcerpt | null>(null);
  const startReading = useCallback(() => {
    const picked = getRandomExcerpt();
    setExcerpt(picked);
    setState("reading");
  }, []);

  if (state === "idle") {
    return <IdleView onStart={startReading} />;
  }

  if (state === "reading" && excerpt) {
    return (
      <ReadingView
        excerpt={excerpt}
        onFinish={() => setState("reveal")}
      />
    );
  }

  if (state === "reveal" && excerpt) {
    return (
      <RevealView
        excerpt={excerpt}
        onTryAnother={() => {
          setState("idle");
          setExcerpt(null);
        }}
      />
    );
  }

  return null;
}

function IdleView({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in">
      <div className="w-32 h-32 rounded-full bg-bg-tertiary/60 flex items-center justify-center mb-8 animate-gentle-pulse">
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          className="text-accent"
        >
          <path
            d="M8 8h12v12H8V8zm20 0h12v12H28V8zM8 28h12v12H8V28zm20 0h12v12H28V28z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14 14v0m10-6v0m-10 20v0m10 6v0"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <h2 className="text-2xl font-light text-text-primary mb-3">
        Blind Box
      </h2>
      <p className="text-sm text-text-secondary max-w-sm leading-relaxed mb-8">
        遮去书名与作者，只留文字本身。<br />
        读到触动你的那一刻，再揭晓它的来处。
      </p>

      <button
        onClick={onStart}
        className="px-8 py-3 rounded-lg bg-accent text-white text-sm tracking-wide hover:bg-accent-hover transition-colors duration-150"
      >
        开启盲盒
      </button>
    </div>
  );
}

function ReadingView({
  excerpt,
  onFinish,
}: {
  excerpt: BookExcerpt;
  onFinish: () => void;
}) {
  return (
    <div className="animate-fade-in">
      {/* Reading content */}
      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="prose-like">
          {excerpt.content.split("\n\n").map((paragraph, i) => (
            <p
              key={i}
              className="text-text-primary text-lg leading-[2] mb-6 font-light"
            >
              {paragraph}
            </p>
          ))}
        </div>

        {/* Finish button — always available */}
        <div className="text-center mt-16">
          <button
            onClick={onFinish}
            className="px-8 py-3 rounded-lg border border-border-medium text-sm text-text-secondary hover:text-text-primary hover:border-accent transition-all duration-300"
          >
            揭晓答案
          </button>
        </div>
      </div>
    </div>
  );
}

function RevealView({
  excerpt,
  onTryAnother,
}: {
  excerpt: BookExcerpt;
  onTryAnother: () => void;
}) {
  const { book } = excerpt;
  const coverUrl = book.isbn
    ? `/covers/${book.isbn}.jpg`
    : null;
  const [onShelf, setOnShelf] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchShelf().then((shelf) => {
        setOnShelf(shelf.some((s) => s.bookId === book.id));
      });
    }
  }, [book.id, user]);

  const handleAdd = async () => {
    if (!user) return;
    await addToShelfApi({
      bookId: book.id,
      addedAt: new Date().toISOString(),
      status: "want-to-read",
    });
    setOnShelf(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="animate-slide-reveal">
        <p className="text-xs font-mono text-text-tertiary tracking-wider uppercase mb-8">
          The book is...
        </p>

        {/* Book card */}
        <div className="bg-bg-secondary border border-border-light rounded-lg p-8 max-w-sm mx-auto">
          {coverUrl && (
            <div className="w-32 h-48 mx-auto mb-6 rounded overflow-hidden bg-bg-tertiary">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={coverUrl}
                alt={book.titleCn}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          )}

          <h3 className="text-xl font-light text-text-primary mb-1">
            {book.titleCn}
          </h3>
          <p className="text-sm text-text-tertiary mb-1">{book.title}</p>
          <p className="text-sm text-text-secondary">
            {book.authorCn}
            <span className="text-text-muted mx-1">·</span>
            <span className="text-text-muted">{book.author}</span>
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-4 justify-center mt-8">
          {user ? (
            <button
              onClick={handleAdd}
              disabled={onShelf}
              className={`px-6 py-2.5 rounded-lg text-sm transition-colors duration-150 ${
                onShelf
                  ? "bg-bg-tertiary text-text-muted cursor-default"
                  : "bg-accent text-white hover:bg-accent-hover"
              }`}
            >
              {onShelf ? "已在书架" : "加入书架"}
            </button>
          ) : (
            <span className="px-6 py-2.5 text-xs text-text-muted">
              登录后可加入书架
            </span>
          )}
          <button
            onClick={onTryAnother}
            className="px-6 py-2.5 rounded-lg border border-border-medium text-sm text-text-secondary hover:text-text-primary hover:border-border-light transition-colors duration-150"
          >
            再来一次
          </button>
        </div>
      </div>
    </div>
  );
}
