import { NextRequest, NextResponse } from "next/server";
import { getUserByToken, updateUserProfile } from "@/lib/authServer";

export async function PUT(req: NextRequest) {
  const token = req.cookies.get("lume_session")?.value;
  if (!token) return NextResponse.json({ error: "未登录" }, { status: 401 });

  const user = getUserByToken(token);
  if (!user) return NextResponse.json({ error: "未登录" }, { status: 401 });

  const { nickname, avatarUrl } = await req.json();
  const result = updateUserProfile(user.id, { nickname, avatarUrl });

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ user: result });
}
