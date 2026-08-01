import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const CREDS_PATH = path.join(process.cwd(), "src/data/credentials.json");
const SA_USER = "superadmin";
const SA_PASS = "aynenaynen";

function readCreds() {
  return JSON.parse(fs.readFileSync(CREDS_PATH, "utf-8")) as { username: string; password: string };
}

function isSuperAdmin(username: string, password: string) {
  return username === SA_USER && password === SA_PASS;
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (body.action === "login") {
    if (isSuperAdmin(body.username, body.password)) {
      return NextResponse.json({ success: true, role: "superadmin" });
    }
    const creds = readCreds();
    if (body.username === creds.username && body.password === creds.password) {
      return NextResponse.json({ success: true, role: "admin" });
    }
    return NextResponse.json({ error: "Fel användarnamn eller lösenord" }, { status: 401 });
  }

  if (body.action === "change-password") {
    // superadmin can reset regular admin credentials
    const isSA = isSuperAdmin(body.username, body.password);
    if (!isSA) {
      const creds = readCreds();
      if (body.username !== creds.username || body.password !== creds.password) {
        return NextResponse.json({ error: "Nuvarande uppgifter stämmer inte" }, { status: 401 });
      }
    }
    if (!body.newPassword || body.newPassword.length < 4) {
      return NextResponse.json({ error: "Nytt lösenord måste vara minst 4 tecken" }, { status: 400 });
    }
    const creds = readCreds();
    const updated = { username: body.newUsername || creds.username, password: body.newPassword };
    fs.writeFileSync(CREDS_PATH, JSON.stringify(updated, null, 2));
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Okänd åtgärd" }, { status: 400 });
}
