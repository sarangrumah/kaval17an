import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { buatSesi, NAMA_COOKIE } from "@/lib/auth";

export const runtime = "nodejs";

// Penundaan kecil supaya menebak password satu per satu jadi tidak nyaman.
const jeda = (ms) => new Promise((r) => setTimeout(r, ms));

export async function POST(req) {
  const { username = "", password = "" } = await req.json().catch(() => ({}));
  await jeda(400);

  const userBenar = username.trim() === (process.env.ADMIN_USERNAME || "").trim();
  const passBenar =
    userBenar && bcrypt.compareSync(password, process.env.ADMIN_PASSWORD_HASH || "");

  if (!passBenar) {
    // Pesan sengaja tidak menyebut mana yang salah.
    return NextResponse.json(
      { pesan: "Nama pengguna atau password tidak cocok." },
      { status: 401 }
    );
  }

  const token = await buatSesi(username.trim());
  const res = NextResponse.json({ ok: true });
  res.cookies.set(NAMA_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return res;
}
