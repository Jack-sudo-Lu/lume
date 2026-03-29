export function getBookCoverUrl(isbn?: string): string | null {
  if (!isbn) return null;
  return `/covers/${isbn}.jpg`;
}
