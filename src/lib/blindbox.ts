import { BookExcerpt } from "@/types";
import excerptsData from "@/data/excerpts.json";

const excerpts: BookExcerpt[] = excerptsData as BookExcerpt[];

const HISTORY_KEY = "lume_blindbox_history";
const MAX_HISTORY = 5;

/** Get a random excerpt, avoiding recently shown ones */
export function getRandomExcerpt(): BookExcerpt {
  if (typeof window === "undefined") return excerpts[0];

  const history = getHistory();
  const available = excerpts.filter((e) => !history.includes(e.id));
  const pool = available.length > 0 ? available : excerpts;
  const pick = pool[Math.floor(Math.random() * pool.length)];

  // Update history
  const newHistory = [pick.id, ...history].slice(0, MAX_HISTORY);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));

  return pick;
}

function getHistory(): string[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
