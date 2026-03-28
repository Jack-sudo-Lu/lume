import { Book, ShelfItem } from "@/types";
import booksData from "@/data/books.json";

const books: Book[] = booksData as Book[];

export function getAllBooks(): Book[] {
  return books;
}

export function getBookById(id: string): Book | undefined {
  return books.find((b) => b.id === id);
}

export function getBooksByGenre(genre: string): Book[] {
  return books.filter((b) => b.genre.includes(genre));
}

export function getAllGenres(): string[] {
  const genres = new Set<string>();
  books.forEach((b) => b.genre.forEach((g) => genres.add(g)));
  return Array.from(genres).sort();
}

/** Tag-based recommendation engine */
export function getRecommendations(shelf: ShelfItem[], limit = 6): Book[] {
  if (shelf.length === 0) {
    return books.slice(0, limit);
  }

  const shelfIds = new Set(shelf.map((s) => s.bookId));
  const shelfBooks = books.filter((b) => shelfIds.has(b.id));

  const tagCounts = new Map<string, number>();
  shelfBooks.forEach((b) =>
    b.tags.forEach((t) => tagCounts.set(t, (tagCounts.get(t) || 0) + 1))
  );

  const relatedIds = new Set<string>();
  shelfBooks.forEach((b) =>
    b.relatedBookIds.forEach((id) => relatedIds.add(id))
  );

  const candidates = books
    .filter((b) => !shelfIds.has(b.id))
    .map((b) => {
      let score = 0;
      b.tags.forEach((t) => {
        score += tagCounts.get(t) || 0;
      });
      if (relatedIds.has(b.id)) score += 3;
      return { book: b, score };
    })
    .sort((a, b) => b.score - a.score);

  return candidates.slice(0, limit).map((c) => c.book);
}

/** Get a random book recommendation based on finished books */
export function getRandomRecommendation(shelf: ShelfItem[]): Book {
  const finishedBooks = shelf.filter((s) => s.status === "finished");

  if (finishedBooks.length === 0) {
    return books[Math.floor(Math.random() * books.length)];
  }

  const shelfIds = new Set(shelf.map((s) => s.bookId));
  const finishedBookObjs = books.filter((b) =>
    finishedBooks.some((f) => f.bookId === b.id)
  );

  const relatedIds = new Set<string>();
  finishedBookObjs.forEach((b) =>
    b.relatedBookIds.forEach((id) => relatedIds.add(id))
  );

  const relatedUnread = books.filter(
    (b) => relatedIds.has(b.id) && !shelfIds.has(b.id)
  );

  if (relatedUnread.length > 0) {
    return relatedUnread[Math.floor(Math.random() * relatedUnread.length)];
  }

  const unread = books.filter((b) => !shelfIds.has(b.id));
  return unread.length > 0
    ? unread[Math.floor(Math.random() * unread.length)]
    : books[Math.floor(Math.random() * books.length)];
}
