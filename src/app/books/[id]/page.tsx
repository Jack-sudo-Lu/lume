"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getBookById } from "@/lib/books";
import { getBookCoverUrl } from "@/lib/openLibrary";
import { addToShelfApi, fetchShelf } from "@/lib/shelfApi";
import { useAuth } from "@/components/auth/AuthProvider";
import { Book } from "@/types";

export default function BookDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const book = getBookById(id);
  const [onShelf, setOnShelf] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [currentReason, setCurrentReason] = useState(
    book?.recommendationReason || ""
  );
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchShelf().then((shelf) => {
        setOnShelf(shelf.some((s) => s.bookId === id));
      });
    }
  }, [id, user]);

  if (!book) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <p className="text-text-muted">Book not found.</p>
        <Link href="/books" className="text-accent text-sm mt-4 inline-block">
          Back to books
        </Link>
      </div>
    );
  }

  const coverUrl = getBookCoverUrl(book.isbn);
  const relatedBooks = book.relatedBookIds
    .map((rid) => getBookById(rid))
    .filter(Boolean) as Book[];

  const handleAddToShelf = async () => {
    if (!user) return;
    await addToShelfApi({
      bookId: book.id,
      addedAt: new Date().toISOString(),
      status: "want-to-read",
    });
    setOnShelf(true);
  };

  const handleSaveSuccess = (newReason: string) => {
    setCurrentReason(newReason);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 animate-fade-in">
      <Link
        href="/books"
        className="text-xs text-text-tertiary hover:text-text-primary transition-colors duration-150 mb-8 inline-block"
      >
        &larr; Back to books
      </Link>

      {/* Hero */}
      <div className="flex flex-col sm:flex-row gap-8 mb-12">
        {/* Cover */}
        <div className="w-40 sm:w-48 flex-shrink-0">
          <div className="aspect-[2/3] bg-bg-tertiary rounded-lg overflow-hidden">
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
            ) : (
              <div className="w-full h-full flex items-center justify-center p-4">
                <span className="text-lg font-light text-text-tertiary text-center">
                  {book.titleCn}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-light text-text-primary mb-1">
            {book.titleCn}
          </h1>
          <p className="text-sm text-text-tertiary font-mono mb-3">
            {book.title}
          </p>
          <p className="text-sm text-text-secondary mb-1">
            {book.authorCn}
            <span className="text-text-muted mx-1">·</span>
            <span className="text-text-muted">{book.author}</span>
          </p>
          <p className="text-xs text-text-muted mb-4">
            {book.nationality} · {book.publishYear}
            {book.pages && ` · ${book.pages} pages`}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-6">
            {book.genre.map((g) => (
              <span
                key={g}
                className="text-xs px-3 py-1 rounded-full bg-bg-tertiary text-text-tertiary"
              >
                {g}
              </span>
            ))}
          </div>

          <div className="flex gap-3">
            {user ? (
              <button
                onClick={handleAddToShelf}
                disabled={onShelf}
                className={`text-sm px-6 py-2.5 rounded-lg transition-colors duration-150 ${
                  onShelf
                    ? "bg-bg-tertiary text-text-muted cursor-default"
                    : "bg-accent text-white hover:bg-accent-hover"
                }`}
              >
                {onShelf ? "已在书架" : "加入书架"}
              </button>
            ) : (
              <span className="text-xs text-text-muted px-6 py-2.5">
                登录后可加入书架
              </span>
            )}
            <button
              onClick={() => setShowEditor(true)}
              className="text-sm px-5 py-2.5 rounded-lg border border-border-light text-text-secondary hover:text-text-primary hover:border-accent transition-colors duration-150"
            >
              编辑内容
            </button>
          </div>
        </div>
      </div>

      {/* Description */}
      <section className="mb-12">
        <p className="text-text-primary leading-relaxed">{book.description}</p>
      </section>

      {/* Recommendation reason */}
      {(currentReason || book.recommendationReason) && (
        <section className="mb-12 p-6 rounded-lg bg-bg-secondary border border-border-light">
          <span className="text-xs font-mono text-text-tertiary tracking-wider uppercase mb-3 block">
            Why this book
          </span>
          <p className="text-sm text-text-secondary leading-relaxed">
            {currentReason || book.recommendationReason}
          </p>
        </section>
      )}

      {/* Related books */}
      {relatedBooks.length > 0 && (
        <section>
          <span className="text-xs font-mono text-text-tertiary tracking-wider uppercase mb-4 block">
            Related
          </span>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {relatedBooks.map((rb) => (
              <Link
                key={rb.id}
                href={`/books/${rb.id}`}
                className="flex-shrink-0 w-32 group"
              >
                <div className="aspect-[2/3] bg-bg-tertiary rounded overflow-hidden mb-2">
                  {rb.isbn ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`/covers/${rb.isbn}.jpg`}
                      alt={rb.titleCn}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : null}
                </div>
                <p className="text-xs text-text-secondary group-hover:text-accent transition-colors line-clamp-1">
                  {rb.titleCn}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Edit Modal */}
      {showEditor && (
        <EditModal
          bookId={book.id}
          bookTitle={book.titleCn}
          initialReason={currentReason || book.recommendationReason || ""}
          onClose={() => setShowEditor(false)}
          onSave={handleSaveSuccess}
        />
      )}
    </div>
  );
}

function EditModal({
  bookId,
  bookTitle,
  initialReason,
  onClose,
  onSave,
}: {
  bookId: string;
  bookTitle: string;
  initialReason: string;
  onClose: () => void;
  onSave: (newReason: string) => void;
}) {
  const [excerpt, setExcerpt] = useState("");
  const [reason, setReason] = useState(initialReason);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Load current excerpt on mount
  useEffect(() => {
    fetch(`/api/books/${bookId}`)
      .then((r) => r.json())
      .then((data) => {
        setExcerpt(data.excerpt || "");
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [bookId]);

  const handleSave = useCallback(async () => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch(`/api/books/${bookId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          excerpt: excerpt || undefined,
          recommendationReason: reason || undefined,
        }),
      });
      if (!res.ok) throw new Error("Save failed");
      setMessage("保存成功");
      onSave(reason);
      setTimeout(() => onClose(), 800);
    } catch {
      setMessage("保存失败，请重试");
    } finally {
      setSaving(false);
    }
  }, [bookId, excerpt, reason, onSave, onClose]);



  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-bg-primary rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4 p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-light text-text-primary">
            编辑 · {bookTitle}
          </h2>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary text-xl leading-none transition-colors"
          >
            ×
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8 text-text-muted text-sm">
            加载中...
          </div>
        ) : (
          <>
            {/* Excerpt editor */}
            <div className="mb-6">
              <label className="text-xs font-mono text-text-tertiary tracking-wider uppercase mb-2 block">
                盲盒阅读片段
              </label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={10}
                placeholder="粘贴书籍片段内容..."
                className="w-full rounded-lg border border-border-light bg-bg-secondary text-text-primary text-sm p-4 leading-relaxed resize-y focus:outline-none focus:border-accent transition-colors placeholder:text-text-muted"
              />
              <p className="text-xs text-text-muted mt-1">
                约 {excerpt.length} 字
                {excerpt.length > 0 &&
                  ` · 预计阅读 ${Math.max(1, Math.ceil(excerpt.length / 500))} 分钟`}
              </p>
            </div>

            {/* Recommendation reason editor */}
            <div className="mb-6">
              <label className="text-xs font-mono text-text-tertiary tracking-wider uppercase mb-2 block">
                推荐理由
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
                placeholder="为什么推荐这本书..."
                className="w-full rounded-lg border border-border-light bg-bg-secondary text-text-primary text-sm p-4 leading-relaxed resize-y focus:outline-none focus:border-accent transition-colors placeholder:text-text-muted"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <span
                className={`text-xs ${message.includes("成功") ? "text-green-600" : "text-red-500"}`}
              >
                {message}
              </span>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="text-sm px-5 py-2 rounded-lg border border-border-light text-text-secondary hover:text-text-primary transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="text-sm px-5 py-2 rounded-lg bg-accent text-white hover:bg-accent-hover transition-colors disabled:opacity-50"
                >
                  {saving ? "保存中..." : "保存"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
