import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const CONTENT_PATH = path.join(process.cwd(), "src/data/content.json");
const ADMIN_PASSWORD = "sam2024";

export async function GET() {
  const raw = fs.readFileSync(CONTENT_PATH, "utf-8");
  return NextResponse.json(JSON.parse(raw));
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { password, ...data } = body;

  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Fel lösenord" }, { status: 401 });
  }

  fs.writeFileSync(CONTENT_PATH, JSON.stringify(data, null, 2));
  return NextResponse.json({ success: true });
}
