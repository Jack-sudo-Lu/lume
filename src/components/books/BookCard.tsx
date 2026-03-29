import Link from "next/link";
import { Book } from "@/types";
import { getBookCoverUrl } from "@/lib/openLibrary";

export function BookCard({ book }: { book: Book }) {
  const coverUrl = getBookCoverUrl(book.isbn);

  return (
    <Link
      href={`/books/${book.id}`}
      className="group block rounded-lg border border-border-light bg-bg-secondary/30 hover:bg-bg-secondary hover:border-border-medium transition-all duration-300 overflow-hidden"
    >
      {/* Cover */}
      <div className="aspect-[2/3] bg-bg-tertiary relative overflow-hidden">
        {coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverUrl}
            alt={book.titleCn}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/book-cover-placeholder.svg";
              (e.target as HTMLImageElement).onerror = null;
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

      {/* Info */}
      <div className="p-4">
        <h3 className="text-sm font-normal text-text-primary group-hover:text-accent transition-colors duration-150 mb-1 line-clamp-1">
          {book.titleCn}
        </h3>
        <p className="text-xs text-text-tertiary mb-2">
          {book.authorCn}
        </p>
        <div className="flex flex-wrap gap-1">
          {book.genre.slice(0, 2).map((g) => (
            <span
              key={g}
              className="text-[10px] px-2 py-0.5 rounded-full bg-bg-tertiary text-text-muted"
            >
              {g}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
