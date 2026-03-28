import { hashString } from "@/lib/utils";
import artworks from "@/data/artworks.json";

interface DailyArtProps {
  dateStr: string;
  className?: string;
}

export function PoemMoodVisual({ dateStr, className = "" }: DailyArtProps) {
  const index = hashString(dateStr) % artworks.length;
  const art = artworks[index];

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="overflow-hidden rounded-lg bg-bg-tertiary">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={art.src}
          alt={`${art.title} by ${art.artist}`}
          className="w-full h-auto object-contain"
        />
      </div>
      <p className="text-[10px] text-text-muted mt-2 leading-tight">
        {art.title},{" "}
        <span className="text-text-muted/60">
          {art.artist}, {art.year}
        </span>
      </p>
    </div>
  );
}
