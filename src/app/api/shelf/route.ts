import { NextRequest, NextResponse } from "next/server";
import {
  getUserByToken,
  getUserShelf,
  addToUserShelf,
  updateUserShelfItem,
  removeFromUserShelf,
} from "@/lib/authServer";

function getUser(req: NextRequest) {
  const token = req.cookies.get("lume_session")?.value;
  if (!token) return null;
  return getUserByToken(token);
}

export async function GET(req: NextRequest) {
  const user = getUser(req);
  if (!user) return NextResponse.json({ error: "未登录" }, { status: 401 });

  const shelf = getUserShelf(user.id);
  return NextResponse.json({ shelf });
}

export async function POST(req: NextRequest) {
  const user = getUser(req);
  if (!user) return NextResponse.json({ error: "未登录" }, { status: 401 });

  const item = await req.json();
  const result = addToUserShelf(user.id, item);

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ shelf: result });
}

export async function PUT(req: NextRequest) {
  const user = getUser(req);
  if (!user) return NextResponse.json({ error: "未登录" }, { status: 401 });

  const { bookId, ...updates } = await req.json();
  const result = updateUserShelfItem(user.id, bookId, updates);

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ shelf: result });
}

export async function DELETE(req: NextRequest) {
  const user = getUser(req);
  if (!user) return NextResponse.json({ error: "未登录" }, { status: 401 });

  const { bookId } = await req.json();
  const result = removeFromUserShelf(user.id, bookId);

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ shelf: result });
}
