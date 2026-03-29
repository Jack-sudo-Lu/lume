"use client";

import { useState } from "react";
import { ZrcBook } from "@/types";
import { getAllBooks } from "@/lib/books";

interface ZrcPlannedEditorProps {
  plannedBooks: ZrcBook[];
  onClose: () => void;
  onSave: () => void;
}

export function ZrcPlannedEditor({
  plannedBooks,
  onClose,
  onSave,
}: ZrcPlannedEditorProps) {
  const [search, setSearch] = useState("");
  const [planned, setPlanned] = useState<ZrcBook[]>(plannedBooks);
  const [busy, setBusy] = useState(false);
  const allBooks = getAllBooks();

  const plannedIds = new Set(planned.map((b) => b.bookId));

  const filtered = search.trim()
    ? allBooks
        .filter(
          (b) =>
            !plannedIds.has(b.id) &&
            (b.titleCn.includes(search) ||
              b.title.toLowerCase().includes(search.toLowerCase()) ||
              b.authorCn.includes(search))
        )
        .slice(0, 8)
    : [];

  const handleAdd = async (book: (typeof allBooks)[0]) => {
    setBusy(true);
    try {
      const res = await fetch("/api/zrc/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          book: {
            bookId: book.id,
            title: book.title,
            titleCn: book.titleCn,
            author: book.author,
            authorCn: book.authorCn,
            isbn: book.isbn,
          },
        }),
      });
      if (res.ok) {
        setPlanned([
          ...planned,
          {
            bookId: book.id,
            title: book.title,
            titleCn: book.titleCn,
            author: book.author,
            authorCn: book.authorCn,
            isbn: book.isbn,
            status: "planned",
          },
        ]);
        setSearch("");
      }
    } catch {
      // ignore
    } finally {
      setBusy(false);
    }
  };

  const handleRemove = async (bookId: string) => {
    setBusy(true);
    try {
      const res = await fetch("/api/zrc/books", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId }),
      });
      if (res.ok) {
        setPlanned(planned.filter((b) => b.bookId !== bookId));
      }
    } catch {
      // ignore
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onSave();
          onClose();
        }
      }}
    >
      <div className="bg-bg-primary rounded-xl shadow-xl w-full max-w-lg max-h-[80vh] mx-4 p-6 animate-slide-reveal flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-light text-text-primary">
            编辑计划书目
          </h2>
          <button
            onClick={() => {
              onSave();
              onClose();
            }}
            className="text-text-muted hover:text-text-primary text-xl leading-none transition-colors"
          >
            ×
          </button>
        </div>

        {/* Current planned books */}
        {planned.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-text-muted mb-2">当前计划</p>
            <div className="space-y-1">
              {planned.map((book) => (
                <div
                  key={book.bookId}
                  className="flex items-center justify-between px-4 py-2.5 rounded-lg bg-bg-secondary/50"
                >
                  <div>
                    <p className="text-sm text-text-primary">{book.titleCn}</p>
                    <p className="text-xs text-text-muted">{book.authorCn}</p>
                  </div>
                  <button
                    onClick={() => handleRemove(book.bookId)}
                    disabled={busy}
                    className="text-xs text-text-muted hover:text-error transition-colors disabled:opacity-50"
                  >
                    移除
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search to add */}
        <div className="border-t border-border-light pt-4">
          <p className="text-xs text-text-muted mb-2">添加书目</p>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索书名或作者..."
            className="w-full rounded-xl border border-border-light bg-bg-secondary text-text-primary text-sm px-4 py-3 text-left focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all placeholder:text-text-muted mb-3"
          />
          <div className="flex-1 overflow-y-auto space-y-1 max-h-48">
            {search.trim() && filtered.length === 0 && (
              <p className="text-xs text-text-muted text-center py-4">
                没有找到匹配的书
              </p>
            )}
            {filtered.map((book) => (
              <button
                key={book.id}
                onClick={() => handleAdd(book)}
                disabled={busy}
                className="w-full text-left px-4 py-2.5 rounded-lg hover:bg-bg-secondary transition-colors disabled:opacity-50"
              >
                <p className="text-sm text-text-primary">{book.titleCn}</p>
                <p className="text-xs text-text-muted">
                  {book.authorCn} · {book.title}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
