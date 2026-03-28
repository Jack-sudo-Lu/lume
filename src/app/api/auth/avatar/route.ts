import { NextRequest, NextResponse } from "next/server";
import { getUserByToken, updateUserProfile } from "@/lib/authServer";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("lume_session")?.value;
  if (!token) return NextResponse.json({ error: "未登录" }, { status: 401 });

  const user = getUserByToken(token);
  if (!user) return NextResponse.json({ error: "未登录" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("avatar") as File | null;

  if (!file) {
    return NextResponse.json({ error: "请选择图片" }, { status: 400 });
  }

  // Validate file type
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "请上传图片文件" }, { status: 400 });
  }

  // Validate file size (max 2MB)
  if (file.size > 2 * 1024 * 1024) {
    return NextResponse.json({ error: "图片大小不能超过2MB" }, { status: 400 });
  }

  const ext = file.name.split(".").pop() || "jpg";
  const filename = `${user.id}.${ext}`;
  const avatarDir = path.join(process.cwd(), "public/avatars");

  if (!fs.existsSync(avatarDir)) {
    fs.mkdirSync(avatarDir, { recursive: true });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(path.join(avatarDir, filename), buffer);

  const avatarUrl = `/avatars/${filename}`;
  const result = updateUserProfile(user.id, { avatarUrl });

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ user: result });
}
