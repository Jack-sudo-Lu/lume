import { NextRequest, NextResponse } from "next/server";
import { deleteSession } from "@/lib/authServer";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("lume_session")?.value;

  if (token) {
    deleteSession(token);
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("lume_session", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });
  return res;
}
