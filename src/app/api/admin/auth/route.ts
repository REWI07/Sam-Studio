import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const CREDS_PATH = path.join(process.cwd(), "src/data/credentials.json");

function readCreds() {
  return JSON.parse(fs.readFileSync(CREDS_PATH, "utf-8")) as { username: string; password: string };
}

// POST /api/admin/auth
// body: { action: "login", username, password }
//    or { action: "change-password", username, password, newPassword }
export async function POST(req: NextRequest) {
  const body = await req.json();
  const creds = readCreds();

  if (body.action === "login") {
    if (body.username === creds.username && body.password === creds.password) {
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: "Fel användarnamn eller lösenord" }, { status: 401 });
  }

  if (body.action === "change-password") {
    if (body.username !== creds.username || body.password !== creds.password) {
      return NextResponse.json({ error: "Nuvarande uppgifter stämmer inte" }, { status: 401 });
    }
    if (!body.newPassword || body.newPassword.length < 4) {
      return NextResponse.json({ error: "Nytt lösenord måste vara minst 4 tecken" }, { status: 400 });
    }
    const updated = { username: body.newUsername || creds.username, password: body.newPassword };
    fs.writeFileSync(CREDS_PATH, JSON.stringify(updated, null, 2));
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Okänd åtgärd" }, { status: 400 });
}
