import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const zrcPath = path.join(process.cwd(), "src/data/zrc.json");

export async function PUT(req: NextRequest) {
  const activity = await req.json();

  try {
    const raw = fs.readFileSync(zrcPath, "utf-8");
    const data = JSON.parse(raw);
    data.activity = activity;
    fs.writeFileSync(zrcPath, JSON.stringify(data, null, 2), "utf-8");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
