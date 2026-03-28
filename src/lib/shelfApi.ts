import { ShelfItem } from "@/types";

export async function fetchShelf(): Promise<ShelfItem[]> {
  const res = await fetch("/api/shelf");
  if (!res.ok) return [];
  const data = await res.json();
  return data.shelf;
}

export async function addToShelfApi(item: ShelfItem): Promise<ShelfItem[]> {
  const res = await fetch("/api/shelf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });
  const data = await res.json();
  return data.shelf ?? [];
}

export async function updateShelfItemApi(
  bookId: string,
  updates: Partial<ShelfItem>
): Promise<ShelfItem[]> {
  const res = await fetch("/api/shelf", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bookId, ...updates }),
  });
  const data = await res.json();
  return data.shelf ?? [];
}

export async function removeFromShelfApi(bookId: string): Promise<ShelfItem[]> {
  const res = await fetch("/api/shelf", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bookId }),
  });
  const data = await res.json();
  return data.shelf ?? [];
}

export async function mergeShelfApi(
  localShelf: ShelfItem[]
): Promise<ShelfItem[]> {
  const res = await fetch("/api/shelf/merge", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ shelf: localShelf }),
  });
  const data = await res.json();
  return data.shelf ?? [];
}
