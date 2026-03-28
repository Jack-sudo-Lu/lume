import Link from "next/link";
import { getPoemForDate } from "@/lib/poems";
import { getAllBooks } from "@/lib/books";
import { getTodayString, formatDateEN } from "@/lib/utils";
import { PoemMoodVisual } from "@/components/poem/PoemMoodVisual";
import { BookRecommendationRow } from "@/components/books/BookRecommendationRow";
import { ZrcGate } from "@/components/zrc/ZrcGate";

export default function Home() {
  const today = getTodayString();
  const poem = getPoemForDate(today);
  const recommendations = getAllBooks().slice(0, 5);

  const quoteLine = poem.linesCn.find((l) => l.trim().length > 0) || "";

  return (
    <div className="relative max-w-5xl mx-auto px-6 py-20">
      {/* ZRC Logo — top-left of content area */}
      <div className="absolute top-6 left-6">
        <ZrcGate />
      </div>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center min-h-[35vh] text-center animate-fade-in">
        <h1 className="text-4xl sm:text-5xl font-light tracking-tight text-text-primary mb-4">
          Lume
        </h1>
        <p className="text-lg text-text-secondary font-light max-w-md mx-auto leading-relaxed">
          Your Daily Dose of Literature
        </p>
        {quoteLine && (
          <p className="text-sm text-text-tertiary italic font-light mt-8 max-w-lg leading-relaxed">
            &ldquo;{quoteLine}&rdquo;
            <span className="not-italic ml-2">— {poem.poetCn}</span>
          </p>
        )}
      </section>

      {/* Feature cards */}
      <section className="py-12 border-t border-border-light">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FeatureCard
          href="/poem"
          title="Poem"
          subtitle="每日一诗"
          description="一首诗，开启新的一天"
        />
        <FeatureCard
          href="/blindbox"
          title="Blind Box"
          subtitle="盲盒阅读"
          description="五分钟的未知旅程，读完再揭晓"
        />
        <FeatureCard
          href="/recommendation"
          title="Books"
          subtitle="书目推荐"
          description="基于你的阅读，发现下一本好书"
        />
        </div>
      </section>

      {/* Today's poem preview */}
      <section className="py-12 border-t border-border-light">
        <div className="flex items-baseline justify-between mb-8">
          <div>
            <span className="text-xs font-mono text-text-tertiary tracking-wider uppercase">
              Today&apos;s Poem
            </span>
            <p className="text-xs text-text-muted font-mono mt-1">
              {formatDateEN(today)}
            </p>
          </div>
          <Link
            href="/poem"
            className="text-sm text-accent hover:text-accent-hover transition-colors duration-150"
          >
            Read full poem →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 md:gap-10 items-start">
          {/* Mood visual */}
          <PoemMoodVisual
            dateStr={today}
            className="md:w-[200px] flex-shrink-0"
          />

          {/* Poem text */}
          <div>
            {poem.linesCn.slice(0, 5).map((line, i) => (
              <p
                key={`cn-${i}`}
                className="text-text-primary leading-loose text-base min-h-[1.8em]"
              >
                {line || "\u00A0"}
              </p>
            ))}
            {poem.linesCn.length > 5 && (
              <p className="text-text-muted text-sm mt-2">...</p>
            )}

            <div className="mt-4">
              {poem.lines.slice(0, 4).map((line, i) => (
                <p
                  key={`orig-${i}`}
                  className="text-text-tertiary leading-relaxed text-sm font-light min-h-[1.5em]"
                >
                  {line || "\u00A0"}
                </p>
              ))}
              {poem.lines.length > 4 && (
                <p className="text-text-muted text-xs mt-1">...</p>
              )}
            </div>

            <p className="text-sm text-text-tertiary mt-4">
              {poem.poetCn}
              <span className="mx-2">·</span>
              <span className="text-text-muted">{poem.poet}</span>
            </p>
          </div>
        </div>
      </section>

      {/* Recommended books */}
      <section className="py-12 border-t border-border-light">
        <div className="flex items-baseline justify-between mb-8">
          <div>
            <span className="text-xs font-mono text-text-tertiary tracking-wider uppercase">
              Recommended
            </span>
            <p className="text-xs text-text-muted font-mono mt-1">为你推荐</p>
          </div>
          <Link
            href="/books"
            className="text-sm text-accent hover:text-accent-hover transition-colors duration-150"
          >
            Browse all →
          </Link>
        </div>
        <BookRecommendationRow books={recommendations} />
      </section>
    </div>
  );
}

function FeatureCard({
  href,
  title,
  subtitle,
  description,
}: {
  href: string;
  title: string;
  subtitle: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group block p-8 rounded-lg border border-border-light bg-bg-secondary/50 hover:bg-bg-secondary hover:border-border-medium transition-all duration-300"
    >
      <span className="text-xs font-mono text-text-tertiary tracking-wider uppercase">
        {title}
      </span>
      <h2 className="text-xl font-light text-text-primary mt-2 mb-3 group-hover:text-accent transition-colors duration-150">
        {subtitle}
      </h2>
      <p className="text-sm text-text-secondary leading-relaxed">
        {description}
      </p>
    </Link>
  );
}
