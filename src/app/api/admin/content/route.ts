import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const CONTENT_PATH = path.join(process.cwd(), "src/data/content.json");
const CREDS_PATH = path.join(process.cwd(), "src/data/credentials.json");

function checkAuth(username: string, password: string) {
  const creds = JSON.parse(fs.readFileSync(CREDS_PATH, "utf-8")) as { username: string; password: string };
  return username === creds.username && password === creds.password;
}

export async function GET() {
  const raw = fs.readFileSync(CONTENT_PATH, "utf-8");
  return NextResponse.json(JSON.parse(raw));
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { username, password, ...data } = body;

  if (!checkAuth(username, password)) {
    return NextResponse.json({ error: "Ej behörig" }, { status: 401 });
  }

  fs.writeFileSync(CONTENT_PATH, JSON.stringify(data, null, 2));
  return NextResponse.json({ success: true });
}
