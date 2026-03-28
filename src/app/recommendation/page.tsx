"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getRandomRecommendation } from "@/lib/books";
import { addToShelfApi, fetchShelf } from "@/lib/shelfApi";
import { useAuth } from "@/components/auth/AuthProvider";
import { Book, ShelfItem } from "@/types";

export default function RecommendationPage() {
  const [book, setBook] = useState<Book | null>(null);
  const [onShelf, setOnShelf] = useState(false);
  const [shelf, setShelf] = useState<ShelfItem[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchShelf().then((s) => {
        setShelf(s);
        const rec = getRandomRecommendation(s);
        setBook(rec);
        setOnShelf(s.some((item) => item.bookId === rec.id));
      });
    } else {
      const rec = getRandomRecommendation([]);
      setBook(rec);
    }
  }, [user]);

  const loadRecommendation = () => {
    const rec = getRandomRecommendation(shelf);
    setBook(rec);
    setOnShelf(shelf.some((s) => s.bookId === rec.id));
  };

  const handleAddToShelf = async () => {
    if (book && user) {
      await addToShelfApi({
        bookId: book.id,
        addedAt: new Date().toISOString(),
        status: "want-to-read",
      });
      setOnShelf(true);
      const s = await fetchShelf();
      setShelf(s);
    }
  };

  if (!book) return null;

  const coverUrl = book.isbn
    ? `https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`
    : null;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 animate-fade-in">
      <Link
        href="/"
        className="text-xs text-text-tertiary hover:text-text-primary transition-colors mb-8 inline-block"
      >
        &larr; 返回首页
      </Link>

      <div className="text-center mb-12">
        <span className="text-xs font-mono text-text-tertiary tracking-wider uppercase">
          为你推荐
        </span>
        <h1 className="text-3xl font-light text-text-primary mt-2">
          Why This Book
        </h1>
      </div>

      <div className="flex flex-col md:flex-row gap-8 mb-12">
        <Link href={`/books/${book.id}`} className="w-48 mx-auto md:mx-0 flex-shrink-0 group">
          <div className="aspect-[2/3] bg-bg-tertiary rounded overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow duration-300">
            {coverUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={coverUrl}
                alt={book.titleCn}
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            )}
          </div>
        </Link>

        <div className="flex-1">
          <h2 className="text-2xl font-light text-text-primary mb-1">
            {book.titleCn}
          </h2>
          <p className="text-sm text-text-tertiary mb-4">{book.title}</p>
          <p className="text-sm text-text-secondary mb-6">
            {book.authorCn}
            <span className="text-text-muted mx-2">&middot;</span>
            <span className="text-text-muted">{book.author}</span>
          </p>

          <div className="p-6 rounded-lg bg-bg-secondary/50 border border-border-light mb-6">
            <h3 className="text-xs font-mono text-text-tertiary tracking-wider uppercase mb-3">
              推荐理由
            </h3>
            <p className="text-sm text-text-primary leading-relaxed">
              {book.recommendationReason}
            </p>
          </div>

          <div className="flex gap-3">
            {user ? (
              !onShelf ? (
                <button
                  onClick={handleAddToShelf}
                  className="px-6 py-2.5 rounded-lg bg-accent text-white hover:bg-accent-hover transition-colors text-sm"
                >
                  加入书架
                </button>
              ) : (
                <span className="px-6 py-2.5 text-sm text-text-muted">
                  已在书架
                </span>
              )
            ) : (
              <span className="px-6 py-2.5 text-xs text-text-muted">
                登录后可加入书架
              </span>
            )}
            <button
              onClick={loadRecommendation}
              className="px-6 py-2.5 rounded-lg border border-border-light text-text-secondary hover:text-text-primary hover:border-accent transition-colors text-sm"
            >
              换一本
            </button>
          </div>
        </div>
      </div>

      <div className="text-center pt-8 border-t border-border-light">
        <Link
          href="/books"
          className="text-sm text-accent hover:text-accent-hover transition-colors"
        >
          浏览全部书目 →
        </Link>
      </div>
    </div>
  );
}
