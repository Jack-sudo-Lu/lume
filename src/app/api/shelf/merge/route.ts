import { NextRequest, NextResponse } from "next/server";
import { getUserByToken, mergeShelf } from "@/lib/authServer";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("lume_session")?.value;
  if (!token) return NextResponse.json({ error: "未登录" }, { status: 401 });

  const user = getUserByToken(token);
  if (!user) return NextResponse.json({ error: "未登录" }, { status: 401 });

  const { shelf: localShelf } = await req.json();

  if (!Array.isArray(localShelf)) {
    return NextResponse.json({ error: "无效数据" }, { status: 400 });
  }

  const shelf = mergeShelf(user.id, localShelf);
  return NextResponse.json({ shelf });
}
