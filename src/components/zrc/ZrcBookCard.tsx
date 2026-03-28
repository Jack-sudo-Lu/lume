"use client";

import Link from "next/link";
import { ZrcBook } from "@/types";

export function ZrcBookCard({ book, size = "medium" }: { book: ZrcBook; size?: "small" | "medium" | "large" }) {
  const coverUrl = book.isbn
    ? `https://covers.openlibrary.org/b/isbn/${book.isbn}-${size === "large" ? "L" : "M"}.jpg`
    : null;
  const googleBooksUrl = book.isbn
    ? `https://books.google.com/books/content?id=&printsec=frontcover&img=1&zoom=1&isbn=${book.isbn}`
    : null;

  const sizeClasses = {
    small: "w-24",
    medium: "w-32",
    large: "w-40 sm:w-48",
  };

  return (
    <Link href={`/zrc/book/${book.bookId}`} className="group block">
      <div className={`${sizeClasses[size]} flex-shrink-0`}>
        <div className="aspect-[2/3] bg-bg-tertiary rounded overflow-hidden mb-2">
          {coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={coverUrl}
              alt={book.titleCn}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (googleBooksUrl && target.src !== googleBooksUrl) {
                  target.src = googleBooksUrl;
                } else {
                  target.src = "/book-cover-placeholder.svg";
                  target.onerror = null;
                }
              }}
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src="/book-cover-placeholder.svg"
              alt={book.titleCn}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <p className="text-xs text-text-secondary group-hover:text-accent transition-colors line-clamp-2">
          {book.titleCn}
        </p>
        {book.progress && (
          <p className="text-xs text-text-muted mt-0.5">{book.progress}</p>
        )}
      </div>
    </Link>
  );
}
