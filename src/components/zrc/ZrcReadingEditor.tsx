"use client";

import { useState } from "react";
import { getAllBooks } from "@/lib/books";

interface ZrcReadingEditorProps {
  onClose: () => void;
  onSave: () => void;
}

export function ZrcReadingEditor({ onClose, onSave }: ZrcReadingEditorProps) {
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirm, setConfirm] = useState<(typeof allBooks)[0] | null>(null);
  const allBooks = getAllBooks();

  const filtered = search.trim()
    ? allBooks.filter(
        (b) =>
          b.titleCn.includes(search) ||
          b.title.toLowerCase().includes(search.toLowerCase()) ||
          b.authorCn.includes(search)
      ).slice(0, 10)
    : [];

  const handleSelect = async (book: (typeof allBooks)[0]) => {
    setSaving(true);
    try {
      await fetch("/api/zrc/books", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newBook: {
            bookId: book.id,
            title: book.title,
            titleCn: book.titleCn,
            author: book.author,
            authorCn: book.authorCn,
            isbn: book.isbn,
          },
        }),
      });
      onSave();
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-bg-primary rounded-xl shadow-xl w-full max-w-lg max-h-[80vh] mx-4 p-6 animate-slide-reveal flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-light text-text-primary">
            更换正在阅读
          </h2>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary text-xl leading-none transition-colors"
          >
            ×
          </button>
        </div>
        <p className="text-xs text-text-muted mb-4">
          选择新书后，当前正在阅读的书将自动归入已读书目
        </p>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="搜索书名或作者..."
          autoFocus
          className="w-full rounded-xl border border-border-light bg-bg-secondary text-text-primary text-sm px-4 py-3 text-left focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all placeholder:text-text-muted mb-4"
        />

        <div className="flex-1 overflow-y-auto space-y-1">
          {search.trim() && filtered.length === 0 && (
            <p className="text-xs text-text-muted text-center py-4">
              没有找到匹配的书
            </p>
          )}
          {filtered.map((book) => (
            <button
              key={book.id}
              onClick={() => setConfirm(book)}
              disabled={saving}
              className="w-full text-left px-4 py-3 rounded-lg hover:bg-bg-secondary transition-colors disabled:opacity-50"
            >
              <p className="text-sm text-text-primary">{book.titleCn}</p>
              <p className="text-xs text-text-muted">
                {book.authorCn} · {book.title}
              </p>
            </button>
          ))}

          {/* Confirmation */}
          {confirm && (
            <div className="mt-4 p-4 rounded-lg border border-accent/30 bg-accent/5 animate-fade-in">
              <p className="text-sm text-text-primary mb-1">
                确认更换为《{confirm.titleCn}》？
              </p>
              <p className="text-xs text-text-muted mb-3">
                当前正在阅读的书将自动归入已读书目
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleSelect(confirm)}
                  disabled={saving}
                  className="text-xs px-4 py-1.5 rounded-lg bg-accent text-white hover:bg-accent-hover transition-colors disabled:opacity-50"
                >
                  {saving ? "保存中..." : "确认"}
                </button>
                <button
                  onClick={() => setConfirm(null)}
                  className="text-xs px-4 py-1.5 rounded-lg border border-border-light text-text-secondary hover:text-text-primary transition-colors"
                >
                  取消
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
