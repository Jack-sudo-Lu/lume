"use client";

import Link from "next/link";
import { Book } from "@/types";
import { getBookCoverUrl } from "@/lib/openLibrary";

export function BookRecommendationRow({ books }: { books: Book[] }) {
  if (books.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-5">
      {books.map((book) => (
        <BookCoverCard key={book.id} book={book} />
      ))}
    </div>
  );
}

function BookCoverCard({ book }: { book: Book }) {
  const coverUrl = getBookCoverUrl(book.isbn);

  return (
    <Link
      href={`/books/${book.id}`}
      className="group"
    >
      <div className="aspect-[2/3] rounded-md overflow-hidden bg-bg-tertiary relative mb-2">
        {coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverUrl}
            alt={book.titleCn}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
              const fallback = target.nextElementSibling as HTMLElement;
              if (fallback) fallback.classList.remove("hidden");
            }}
          />
        ) : null}
        <div
          className={`absolute inset-0 flex items-center justify-center p-3 ${coverUrl ? "hidden" : ""}`}
        >
          <span className="text-sm font-light text-text-tertiary text-center leading-relaxed">
            {book.titleCn}
          </span>
        </div>
      </div>
      <p className="text-sm text-text-primary group-hover:text-accent transition-colors duration-150 line-clamp-1">
        {book.titleCn}
      </p>
      <p className="text-xs text-text-tertiary mt-0.5">
        {book.authorCn}
      </p>
    </Link>
  );
}
