import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const booksPath = path.join(process.cwd(), "src/data/books.json");
const excerptsPath = path.join(process.cwd(), "src/data/excerpts.json");

interface UpdateBody {
  excerpt?: string;
  recommendationReason?: string;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const bookId = params.id;

  // Read current excerpt for this book
  const excerptsRaw = fs.readFileSync(excerptsPath, "utf-8");
  const excerpts = JSON.parse(excerptsRaw);
  const excerpt = excerpts.find(
    (e: { book: { id: string } }) => e.book.id === bookId
  );

  return NextResponse.json({
    excerpt: excerpt?.content || "",
  });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const bookId = params.id;
  const body: UpdateBody = await req.json();

  // Update recommendationReason in books.json
  if (body.recommendationReason !== undefined) {
    const booksRaw = fs.readFileSync(booksPath, "utf-8");
    const books = JSON.parse(booksRaw);
    const bookIndex = books.findIndex(
      (b: { id: string }) => b.id === bookId
    );
    if (bookIndex === -1) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }
    books[bookIndex].recommendationReason = body.recommendationReason;
    fs.writeFileSync(booksPath, JSON.stringify(books, null, 2), "utf-8");
  }

  // Update or create excerpt in excerpts.json
  if (body.excerpt !== undefined) {
    const excerptsRaw = fs.readFileSync(excerptsPath, "utf-8");
    const excerpts = JSON.parse(excerptsRaw);
    const excerptIndex = excerpts.findIndex(
      (e: { book: { id: string } }) => e.book.id === bookId
    );

    if (excerptIndex !== -1) {
      // Update existing excerpt
      excerpts[excerptIndex].content = body.excerpt;
      excerpts[excerptIndex].estimatedReadMinutes = Math.max(
        1,
        Math.ceil(body.excerpt.length / 500)
      );
    } else {
      // Create new excerpt — need book info
      const booksRaw = fs.readFileSync(booksPath, "utf-8");
      const books = JSON.parse(booksRaw);
      const book = books.find((b: { id: string }) => b.id === bookId);
      if (!book) {
        return NextResponse.json(
          { error: "Book not found" },
          { status: 404 }
        );
      }
      excerpts.push({
        id: `excerpt-${bookId.replace("book-", "")}`,
        content: body.excerpt,
        estimatedReadMinutes: Math.max(
          1,
          Math.ceil(body.excerpt.length / 500)
        ),
        book: {
          id: book.id,
          title: book.title,
          titleCn: book.titleCn,
          author: book.author,
          authorCn: book.authorCn,
          isbn: book.isbn,
        },
      });
    }

    fs.writeFileSync(
      excerptsPath,
      JSON.stringify(excerpts, null, 2),
      "utf-8"
    );
  }

  return NextResponse.json({ success: true });
}
