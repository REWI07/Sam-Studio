import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const CREDS_PATH = path.join(process.cwd(), "src/data/credentials.json");
const SA_USER = "superadmin";
const SA_PASS = "aynenaynen";

function checkAuth(username: string, password: string) {
  if (username === SA_USER && password === SA_PASS) return true;
  const creds = JSON.parse(fs.readFileSync(CREDS_PATH, "utf-8")) as { username: string; password: string };
  return username === creds.username && password === creds.password;
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!checkAuth(username, password)) {
    return NextResponse.json({ error: "Ej behörig" }, { status: 401 });
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
