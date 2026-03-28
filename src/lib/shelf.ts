import { ShelfItem, UserData } from "@/types";

const STORAGE_KEY = "lume_shelf";

function getDefaultData(): UserData {
  return { shelf: [] };
}

export function getUserData(): UserData {
  if (typeof window === "undefined") return getDefaultData();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : getDefaultData();
  } catch {
    return getDefaultData();
  }
}

function saveUserData(data: UserData) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getShelf(): ShelfItem[] {
  return getUserData().shelf;
}

export function addToShelf(
  bookId: string,
  status: ShelfItem["status"] = "want-to-read"
) {
  const data = getUserData();
  if (data.shelf.some((item) => item.bookId === bookId)) return;
  data.shelf.push({
    bookId,
    addedAt: new Date().toISOString(),
    status,
  });
  saveUserData(data);
}

export function updateShelfItem(
  bookId: string,
  updates: Partial<ShelfItem>
) {
  const data = getUserData();
  const idx = data.shelf.findIndex((item) => item.bookId === bookId);
  if (idx === -1) return;
  data.shelf[idx] = { ...data.shelf[idx], ...updates };
  if (updates.status === "finished" && !data.shelf[idx].finishedAt) {
    data.shelf[idx].finishedAt = new Date().toISOString();
  }
  saveUserData(data);
}

export function removeFromShelf(bookId: string) {
  const data = getUserData();
  data.shelf = data.shelf.filter((item) => item.bookId !== bookId);
  saveUserData(data);
}

export function isOnShelf(bookId: string): boolean {
  return getShelf().some((item) => item.bookId === bookId);
}
