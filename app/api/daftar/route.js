import { NextResponse } from "next/server";
import { appendRow, readSheet } from "@/lib/sheets";
import { rapikanWa, aktif, keAngka } from "@/lib/format";
import { PAGUYUBAN } from "@/lib/skema";

export const runtime = "nodejs";

export async function POST(req) {
  const b = await req.json().catch(() => ({}));
  const nama = String(b.nama || "").trim();
  const wa = rapikanWa(b.no_wa);
  const paguyuban = String(b.paguyuban || "").trim();
  const lombaId = String(b.lomba_id || "").trim();
  const kategori = String(b.kategori_usia || "").trim();
  const catatan = String(b.catatan || "").trim().slice(0, 200);

  if (nama.length < 3) {
    return NextResponse.json({ pesan: "Isi nama lengkap peserta." }, { status: 400 });
  }
  if (wa.length < 10 || wa.length > 15) {
    return NextResponse.json({ pesan: "Nomor WhatsApp belum benar. Contoh: 081234567890." }, { status: 400 });
  }
  if (!PAGUYUBAN.includes(paguyuban)) {
    return NextResponse.json({ pesan: "Pilih paguyuban Anda." }, { status: 400 });
  }

  const [lomba, pendaftar] = await Promise.all([
    readSheet("Lomba"),
    readSheet("Pendaftaran"),
  ]);
  const target = lomba.filter(aktif).find((l) => l.id === lombaId);
  if (!target) {
    return NextResponse.json({ pesan: "Lomba itu sudah tidak dibuka." }, { status: 400 });
  }

  const sudah = pendaftar.filter(aktif).filter((p) => p.lomba_id === lombaId);
  const kuota = keAngka(target.kuota);
  if (kuota > 0 && sudah.length >= kuota) {
    return NextResponse.json(
      { pesan: `Kuota ${target.nama} sudah penuh. Coba lomba lain, atau hubungi panitia.` },
      { status: 409 }
    );
  }
  if (sudah.some((p) => rapikanWa(p.no_wa) === wa && p.nama.toLowerCase() === nama.toLowerCase())) {
    return NextResponse.json(
      { pesan: "Nama ini sudah terdaftar di lomba tersebut." },
      { status: 409 }
    );
  }

  const waktu = new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });
  await appendRow("Pendaftaran", {
    waktu_daftar: waktu,
    nama,
    no_wa: "'" + wa,
    paguyuban,
    lomba_id: lombaId,
    kategori_usia: kategori,
    catatan,
    status: "aktif",
  });

  return NextResponse.json({ ok: true, lomba: target.nama });
}
