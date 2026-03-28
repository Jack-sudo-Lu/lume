import { NextRequest, NextResponse } from "next/server";
import { loginUser } from "@/lib/authServer";

export async function POST(req: NextRequest) {
  const { nickname, password } = await req.json();

  if (!nickname || !password) {
    return NextResponse.json({ error: "请填写昵称和密码" }, { status: 400 });
  }

  const result = await loginUser(nickname, password);

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const res = NextResponse.json({ user: result.profile });
  res.cookies.set("lume_session", result.token, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
