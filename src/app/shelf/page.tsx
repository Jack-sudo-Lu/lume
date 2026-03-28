"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ShelfItem } from "@/types";
import {
  fetchShelf,
  updateShelfItemApi,
  removeFromShelfApi,
} from "@/lib/shelfApi";
import { useAuth } from "@/components/auth/AuthProvider";
import { getBookById } from "@/lib/books";
import { getBookCoverUrl } from "@/lib/openLibrary";

type Tab = "want-to-read" | "reading" | "finished";

const tabLabels: Record<Tab, string> = {
  "want-to-read": "想读",
  reading: "在读",
  finished: "读过",
};

export default function ShelfPage() {
  const [shelf, setShelf] = useState<ShelfItem[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("want-to-read");
  const { user, loading } = useAuth();

  const refreshShelf = useCallback(async () => {
    if (user) {
      const s = await fetchShelf();
      setShelf(s);
    }
  }, [user]);

  useEffect(() => {
    refreshShelf();
  }, [refreshShelf]);

  // Not logged in
  if (!loading && !user) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-12 animate-fade-in">
        <div className="mb-10">
          <span className="text-xs font-mono text-text-tertiary tracking-wider uppercase">
            Shelf
          </span>
          <h1 className="text-3xl font-light text-text-primary mt-2">
            我的书架
          </h1>
        </div>
        <div className="text-center py-20">
          <p className="text-sm text-text-muted mb-2">
            登录后即可使用书架功能
          </p>
          <p className="text-xs text-text-muted">
            记录你想读、在读、读过的书
          </p>
        </div>
      </div>
    );
  }

  const handleUpdate = async (bookId: string, updates: Partial<ShelfItem>) => {
    const s = await updateShelfItemApi(bookId, updates);
    setShelf(s);
  };

  const handleRemove = async (bookId: string) => {
    const s = await removeFromShelfApi(bookId);
    setShelf(s);
  };

  const filtered = shelf.filter((item) => item.status === activeTab);

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 animate-fade-in">
      <div className="mb-10">
        <span className="text-xs font-mono text-text-tertiary tracking-wider uppercase">
          Shelf
        </span>
        <h1 className="text-3xl font-light text-text-primary mt-2">
          我的书架
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-border-light mb-8">
        {(Object.keys(tabLabels) as Tab[]).map((tab) => {
          const count = shelf.filter((s) => s.status === tab).length;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm transition-colors duration-150 relative ${
                activeTab === tab
                  ? "text-accent"
                  : "text-text-tertiary hover:text-text-primary"
              }`}
            >
              {tabLabels[tab]}
              {count > 0 && (
                <span className="ml-1.5 text-xs text-text-muted">
                  {count}
                </span>
              )}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
              )}
            </button>
          );
        })}
      </div>

      {/* Book list */}
      {filtered.length === 0 ? (
        <EmptyState tab={activeTab} />
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => (
            <ShelfBookItem
              key={item.bookId}
              item={item}
              onUpdate={handleUpdate}
              onRemove={handleRemove}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ShelfBookItem({
  item,
  onUpdate,
  onRemove,
}: {
  item: ShelfItem;
  onUpdate: (bookId: string, updates: Partial<ShelfItem>) => void;
  onRemove: (bookId: string) => void;
}) {
  const book = getBookById(item.bookId);
  if (!book) return null;

  const coverUrl = getBookCoverUrl(book.isbn);

  return (
    <div className="flex gap-4 p-4 rounded-lg border border-border-light bg-bg-secondary/30 hover:bg-bg-secondary transition-colors duration-150">
      {/* Cover */}
      <Link href={`/books/${book.id}`} className="flex-shrink-0 w-16">
        <div className="aspect-[2/3] bg-bg-tertiary rounded overflow-hidden">
          {coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={coverUrl}
              alt={book.titleCn}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : null}
        </div>
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <Link href={`/books/${book.id}`}>
          <h3 className="text-sm text-text-primary hover:text-accent transition-colors line-clamp-1">
            {book.titleCn}
          </h3>
        </Link>
        <p className="text-xs text-text-tertiary mt-0.5">{book.authorCn}</p>

        {/* Rating for finished books */}
        {item.status === "finished" && (
          <div className="flex gap-1 mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => onUpdate(item.bookId, { rating: star })}
                className={`text-sm ${
                  (item.rating || 0) >= star
                    ? "text-accent"
                    : "text-text-muted hover:text-accent-light"
                }`}
              >
                ★
              </button>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 mt-2">
          {item.status !== "reading" && (
            <button
              onClick={() => onUpdate(item.bookId, { status: "reading" })}
              className="text-xs text-text-tertiary hover:text-accent transition-colors"
            >
              在读
            </button>
          )}
          {item.status !== "finished" && (
            <button
              onClick={() => onUpdate(item.bookId, { status: "finished" })}
              className="text-xs text-text-tertiary hover:text-accent transition-colors"
            >
              读过
            </button>
          )}
          <button
            onClick={() => onRemove(item.bookId)}
            className="text-xs text-text-muted hover:text-error transition-colors"
          >
            移除
          </button>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ tab }: { tab: Tab }) {
  const messages: Record<Tab, string> = {
    "want-to-read": "还没有想读的书？去 Blind Box 发现一本吧。",
    reading: "还没有在读的书。",
    finished: "读完一本书后，在这里记录你的感受。",
  };

  return (
    <div className="text-center py-20">
      <p className="text-sm text-text-muted mb-4">{messages[tab]}</p>
      <Link
        href={tab === "want-to-read" ? "/blindbox" : "/books"}
        className="text-sm text-accent hover:text-accent-hover transition-colors"
      >
        {tab === "want-to-read" ? "Go to Blind Box →" : "Browse books →"}
      </Link>
    </div>
  );
}
