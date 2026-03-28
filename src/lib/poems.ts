import { Poem } from "@/types";
import poemsData from "@/data/poems.json";
import { hashString } from "./utils";

const poems: Poem[] = poemsData as Poem[];

/** Get poem for a specific date (deterministic) */
export function getPoemForDate(dateStr: string): Poem {
  const index = hashString(dateStr) % poems.length;
  return poems[index];
}

/** Get total number of poems */
export function getPoemCount(): number {
  return poems.length;
}
