# CLAUDE.md

## Commands

- `npm run dev` — start development server
- `npm run build` — production build
- `npm run lint` — run ESLint (next/core-web-vitals + next/typescript)

## What is Lume

A modern Chinese literature app with three core features:

1. **Daily Poem** (`/poem`) — one poem per day, bilingual (original + Chinese translation). Focus on modern Western poetry (Rilke, Neruda, Szymborska, etc.), not classical Chinese poetry.
2. **Blind Box** (`/blindbox`) — read a book excerpt for ~5 minutes without knowing the title/author, then reveal. State machine: IDLE → READING → REVEAL.
3. **Books + Shelf** (`/books`, `/shelf`) — browse book catalog, get tag-based recommendations, manage a personal reading list (want-to-read / reading / finished) with ratings.

UI language is mixed Chinese/English: navigation in English (Poem, Blind Box, Books, Shelf), content in Chinese. The visual identity is modern editorial magazine (think The Paris Review, Granta) — not traditional Chinese calligraphy style.

## Architecture

Next.js 14 App Router, TypeScript (strict), Tailwind CSS 3.4.

- **Source**: `src/app/` (App Router, not Pages Router)
- **Components**: `src/components/` organized by feature (`layout/`, `poem/`, `blindbox/`, `books/`, `shelf/`, `ui/`)
- **Lib**: `src/lib/` — poems.ts, blindbox.ts, books.ts, shelf.ts, openLibrary.ts, utils.ts
- **Data**: `src/data/` — poems.json, excerpts.json, books.json (curated content, imported directly via resolveJsonModule)
- **Types**: `src/types/index.ts`
- **Path alias**: `@/*` → `./src/*`

## Styling

- Tailwind CSS with CSS custom properties defined in `globals.css`
- Warm neutral palette: `--bg-primary: #FAFAF8`, `--accent: #8B6F4E` (light); full dark mode via `prefers-color-scheme`
- Fonts: local Geist Sans (primary) + Geist Mono (dates/metadata), loaded in `layout.tsx`
- Animations: fadeInUp, fadeIn, slideReveal, gentlePulse — all defined in globals.css, kept subtle and purposeful
- No external UI library — custom components only

## Data Strategy

- Poems, book excerpts, and book catalog are local JSON files (curated, not API-fetched)
- Book covers from Open Library: `https://covers.openlibrary.org/b/isbn/{isbn}-L.jpg` (with fallback)
- User data (reading list) stored in localStorage under key `lume_shelf`
- All localStorage access goes through `lib/shelf.ts` with SSR guards

## Key Patterns

- Server Components by default; client components only where state/localStorage is needed (BlindBoxReader, ShelfPage, BooksPage, BookDetailPage, PoemPage)
- Daily poem selection is deterministic: `hashString(dateString) % poems.length`
- Blind box tracks last 5 shown excerpts in localStorage to avoid repeats
- Recommendation engine: tag overlap scoring + relatedBookIds boost
- JSON files with Chinese content must use Unicode escapes (`\u201c` not `"`) to avoid parse errors
