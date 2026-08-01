import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const ADMIN_PASSWORD = "sam2024";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const password = formData.get("password") as string;

  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Fel lösenord" }, { status: 401 });
  }

  const file = formData.get("file") as File;
  if (!file) {
    return NextResponse.json({ error: "Ingen fil" }, { status: 400 });
  }

  const uploadDir = path.join(process.cwd(), "public/img/uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  const filepath = path.join(uploadDir, filename);

  fs.writeFileSync(filepath, buffer);

  return NextResponse.json({ path: `/img/uploads/${filename}` });
}
