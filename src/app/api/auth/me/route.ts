import { NextRequest, NextResponse } from "next/server";
import { getUserByToken } from "@/lib/authServer";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("lume_session")?.value;

  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const user = getUserByToken(token);

  if (!user) {
    const res = NextResponse.json({ user: null }, { status: 401 });
    res.cookies.set("lume_session", "", { httpOnly: true, path: "/", maxAge: 0 });
    return res;
  }

  return NextResponse.json({ user });
}
