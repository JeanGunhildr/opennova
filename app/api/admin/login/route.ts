import { type NextRequest, NextResponse } from "next/server";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "";
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET ?? "opennova-admin";

function makeToken() {
  return Buffer.from(`admin:${SESSION_SECRET}:${Date.now()}`).toString("base64");
}

export async function POST(request: NextRequest) {
  let body: { email?: string; password?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email dan password wajib diisi." },
      { status: 400 }
    );
  }

  if (
    email.trim().toLowerCase() !== ADMIN_EMAIL.trim().toLowerCase() ||
    password !== ADMIN_PASSWORD
  ) {
    return NextResponse.json(
      { error: "Email atau password salah." },
      { status: 401 }
    );
  }

  const token = makeToken();

  const response = NextResponse.json({ ok: true });

  // HTTP-only cookie, valid for 8 hours
  response.cookies.set("admin_session", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return response;
}
