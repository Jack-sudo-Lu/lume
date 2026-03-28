import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const zrcPath = path.join(process.cwd(), "src/data/zrc.json");

export async function PUT(req: NextRequest) {
  const { bookId, progress } = await req.json();

  try {
    const raw = fs.readFileSync(zrcPath, "utf-8");
    const data = JSON.parse(raw);
    const book = data.books.find((b: { bookId: string }) => b.bookId === bookId);
    if (book) {
      book.progress = progress;
      fs.writeFileSync(zrcPath, JSON.stringify(data, null, 2), "utf-8");
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
