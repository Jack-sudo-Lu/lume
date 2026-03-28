"use client";

import { useState } from "react";
import { getAllBooks, getAllGenres } from "@/lib/books";
import { BookCard } from "@/components/books/BookCard";

export default function BooksPage() {
  const [activeGenre, setActiveGenre] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const allBooks = getAllBooks();
  const genres = getAllGenres();

  const filtered = allBooks.filter((b) => {
    const matchesGenre = !activeGenre || b.genre.includes(activeGenre);
    const matchesSearch = !searchQuery ||
      b.titleCn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.authorCn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGenre && matchesSearch;
  });

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 animate-fade-in">
      <div className="mb-10">
        <span className="text-xs font-mono text-text-tertiary tracking-wider uppercase">
          Books
        </span>
        <h1 className="text-3xl font-light text-text-primary mt-2">
          书目
        </h1>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="搜索书名或作者..."
          className="w-full max-w-md px-4 py-2 rounded-lg border border-border-light bg-bg-secondary text-text-primary text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all placeholder:text-text-muted"
        />
      </div>

      {/* Genre filter */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
        <button
          onClick={() => setActiveGenre(null)}
          className={`text-xs px-4 py-1.5 rounded-full whitespace-nowrap transition-colors duration-150 ${
            activeGenre === null
              ? "bg-accent text-white"
              : "bg-bg-tertiary text-text-secondary hover:text-text-primary"
          }`}
        >
          All
        </button>
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => setActiveGenre(genre)}
            className={`text-xs px-4 py-1.5 rounded-full whitespace-nowrap transition-colors duration-150 ${
              activeGenre === genre
                ? "bg-accent text-white"
                : "bg-bg-tertiary text-text-secondary hover:text-text-primary"
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* Book grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {filtered.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-text-muted py-20">
          No books found in this category.
        </p>
      )}
    </div>
  );
}
