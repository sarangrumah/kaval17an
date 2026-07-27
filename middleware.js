import { NextResponse } from "next/server";
import { bacaSesi, NAMA_COOKIE } from "./lib/auth";

/** Semua yang di bawah /admin wajib punya cookie sesi yang sah. */
export async function middleware(req) {
  const token = req.cookies.get(NAMA_COOKIE)?.value;
  const sesi = await bacaSesi(token);
  if (sesi) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.searchParams.set("lanjut", req.nextUrl.pathname);
  return NextResponse.redirect(url);
}

export const config = { matcher: ["/admin/:path*"] };
