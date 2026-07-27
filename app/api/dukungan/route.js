import { NextResponse } from "next/server";
import { appendRow } from "@/lib/sheets";
import { rapikanWa, keAngka } from "@/lib/format";
import { BENTUK_DUKUNGAN, ASAL_DUKUNGAN } from "@/lib/skema";

export const runtime = "nodejs";

export async function POST(req) {
  const b = await req.json().catch(() => ({}));
  const nama = String(b.nama || "").trim();
  const wa = rapikanWa(b.no_wa);
  const asal = String(b.asal || "").trim();
  const bentuk = String(b.bentuk || "").trim();
  const deskripsi = String(b.deskripsi || "").trim().slice(0, 300);
  const nilai = keAngka(b.nilai);
  const catatan = String(b.catatan || "").trim().slice(0, 200);

  if (nama.length < 3) {
    return NextResponse.json({ pesan: "Isi nama Anda atau nama usaha Anda." }, { status: 400 });
  }
  if (wa.length < 10 || wa.length > 15) {
    return NextResponse.json({ pesan: "Nomor WhatsApp belum benar. Contoh: 081234567890." }, { status: 400 });
  }
  if (!ASAL_DUKUNGAN.includes(asal)) {
    return NextResponse.json({ pesan: "Pilih asal Anda." }, { status: 400 });
  }
  if (!BENTUK_DUKUNGAN.includes(bentuk)) {
    return NextResponse.json({ pesan: "Pilih bentuk dukungannya." }, { status: 400 });
  }
  if (deskripsi.length < 3) {
    return NextResponse.json(
      { pesan: "Tulis singkat apa yang ingin Anda sumbangkan. Contoh: dua kipas angin untuk doorprize." },
      { status: 400 }
    );
  }
  if (nilai < 0) {
    return NextResponse.json({ pesan: "Perkiraan nilai tidak boleh minus." }, { status: 400 });
  }

  const waktu = new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });
  await appendRow("Dukungan", {
    waktu,
    nama,
    no_wa: "'" + wa,
    asal,
    bentuk,
    deskripsi,
    nilai: nilai > 0 ? String(nilai) : "",
    catatan,
    status: "aktif",
  });

  return NextResponse.json({ ok: true });
}
