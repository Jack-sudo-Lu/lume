import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const zrcPath = path.join(process.cwd(), "src/data/zrc.json");

function readZrc() {
  const raw = fs.readFileSync(zrcPath, "utf-8");
  return JSON.parse(raw);
}

function writeZrc(data: Record<string, unknown>) {
  fs.writeFileSync(zrcPath, JSON.stringify(data, null, 2), "utf-8");
}

// Switch current reading book (old one becomes finished)
export async function PUT(req: NextRequest) {
  const { newBook } = await req.json();

  try {
    const data = readZrc();
    // Move current reading book to finished
    for (const b of data.books) {
      if (b.status === "reading") {
        b.status = "finished";
        delete b.progress;
      }
    }
    // Check if newBook already exists (e.g. from planned)
    const existing = data.books.find(
      (b: { bookId: string }) => b.bookId === newBook.bookId
    );
    if (existing) {
      existing.status = "reading";
      existing.progress = "未开始";
    } else {
      data.books.push({ ...newBook, status: "reading", progress: "未开始" });
    }
    writeZrc(data);
    return NextResponse.json({ success: true, books: data.books });
  } catch {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}

// Add a planned book
export async function POST(req: NextRequest) {
  const { book } = await req.json();

  try {
    const data = readZrc();
    const exists = data.books.some(
      (b: { bookId: string }) => b.bookId === book.bookId
    );
    if (exists) {
      return NextResponse.json({ error: "书已存在" }, { status: 400 });
    }
    data.books.push({ ...book, status: "planned" });
    writeZrc(data);
    return NextResponse.json({ success: true, books: data.books });
  } catch {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}

// Remove a planned book
export async function DELETE(req: NextRequest) {
  const { bookId } = await req.json();

  try {
    const data = readZrc();
    data.books = data.books.filter(
      (b: { bookId: string; status: string }) =>
        !(b.bookId === bookId && b.status === "planned")
    );
    writeZrc(data);
    return NextResponse.json({ success: true, books: data.books });
  } catch {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
