import { NextResponse } from "next/server";
import { appendRow } from "@/lib/sheets";
import {
  bacaPawai, faseVoting, COOKIE_PERANGKAT, OPSI_COOKIE_PERANGKAT,
} from "@/lib/pawai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req) {
  const b = await req.json().catch(() => ({}));
  const nominasiId = String(b.nominasi_id || "").trim();
  if (!nominasiId) {
    return NextResponse.json({ pesan: "Pilih dulu nominatornya." }, { status: 400 });
  }

  let perangkat = req.cookies.get(COOKIE_PERANGKAT)?.value || "";
  const cookieBaru = !perangkat;
  if (cookieBaru) perangkat = crypto.randomUUID();

  const { konf, nominasi, suara } = await bacaPawai();
  const fase = faseVoting(konf);
  if (fase === "siap") {
    return NextResponse.json({ pesan: "Voting belum dibuka. Tunggu aba-aba dari panggung." }, { status: 409 });
  }
  if (fase !== "vote") {
    return NextResponse.json({ pesan: "Voting sudah ditutup. Terima kasih sudah antusias!" }, { status: 409 });
  }

  const target = nominasi.find((n) => n.id === nominasiId);
  if (!target) {
    return NextResponse.json({ pesan: "Nominator itu tidak ada di daftar." }, { status: 400 });
  }

  // Satu perangkat satu suara per kategori — sebisanya perangkat dikenali
  // lewat cookie; ini penjagaan wajar untuk voting kampung, bukan brankas.
  const sudah = suara.find((s) => s.perangkat === perangkat && s.kategori === target.kategori);
  if (sudah) {
    return NextResponse.json(
      { pesan: `HP ini sudah memilih untuk kategori ${target.kategori}.`, sudah: sudah.nominasi_id },
      { status: 409 }
    );
  }

  await appendRow("Suara", {
    waktu: new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" }),
    nominasi_id: target.id,
    kategori: target.kategori,
    perangkat,
    status: "aktif",
  });

  const res = NextResponse.json({ ok: true, kategori: target.kategori, nominasi_id: target.id });
  if (cookieBaru) {
    res.cookies.set(COOKIE_PERANGKAT, perangkat, OPSI_COOKIE_PERANGKAT);
  }
  return res;
}
