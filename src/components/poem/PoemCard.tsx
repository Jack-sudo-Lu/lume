"use client";

import { Poem } from "@/types";

export function PoemCard({
  poem,
  variant = "full",
}: {
  poem: Poem;
  variant?: "full" | "preview";
}) {
  const displayLines = variant === "preview" ? 6 : poem.lines.length;
  const displayLinesCn = variant === "preview" ? 6 : poem.linesCn.length;

  return (
    <article className="animate-fade-in">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-text-primary mb-2">
          {poem.titleCn}
        </h1>
        <p className="text-sm text-text-tertiary font-mono tracking-wide">
          {poem.title}
        </p>
        <p className="text-sm text-text-secondary mt-3">
          {poem.poetCn}
          <span className="text-text-tertiary mx-2">·</span>
          <span className="text-text-tertiary">{poem.poet}</span>
        </p>
      </div>

      {/* Bilingual poem body */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {/* Original */}
        <div className="md:text-right md:border-r md:border-border-light md:pr-12">
          {poem.lines.slice(0, displayLines).map((line, i) => (
            <p
              key={`orig-${i}`}
              className="text-text-secondary leading-loose text-base font-light min-h-[1.8em]"
              style={{
                animationDelay: `${i * 80}ms`,
              }}
            >
              {line || "\u00A0"}
            </p>
          ))}
        </div>

        {/* Chinese */}
        <div>
          {poem.linesCn.slice(0, displayLinesCn).map((line, i) => (
            <p
              key={`cn-${i}`}
              className="text-text-primary leading-loose text-base min-h-[1.8em]"
              style={{
                animationDelay: `${i * 80}ms`,
              }}
            >
              {line || "\u00A0"}
            </p>
          ))}
        </div>
      </div>

      {/* Footer meta */}
      {variant === "full" && (
        <div className="mt-12 pt-8 border-t border-border-light text-center">
          {poem.translator && (
            <p className="text-xs text-text-tertiary mb-2">
              译者：{poem.translator}
            </p>
          )}
          {poem.source && (
            <p className="text-xs text-text-muted italic">{poem.source}</p>
          )}
          <div className="flex justify-center gap-2 mt-4">
            {poem.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1 rounded-full bg-bg-tertiary text-text-tertiary"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
