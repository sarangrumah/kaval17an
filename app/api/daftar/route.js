import { NextResponse } from "next/server";
import { appendRows, readSheet } from "@/lib/sheets";
import { rapikanWa, aktif, keAngka } from "@/lib/format";
import { PAGUYUBAN } from "@/lib/skema";

export const runtime = "nodejs";

export async function POST(req) {
  const b = await req.json().catch(() => ({}));
  const nama = String(b.nama || "").trim();
  const wa = rapikanWa(b.no_wa);
  const paguyuban = String(b.paguyuban || "").trim();
  const kategori = String(b.kategori_usia || "").trim();
  const catatan = String(b.catatan || "").trim().slice(0, 200);

  // Satu peserta boleh langsung memilih beberapa lomba dalam satu kiriman.
  // lomba_id tunggal tetap diterima demi formulir lama yang masih terbuka.
  const lombaIds = [...new Set(
    (Array.isArray(b.lomba_ids) ? b.lomba_ids : [b.lomba_id])
      .map((id) => String(id || "").trim())
      .filter(Boolean)
  )].slice(0, 20);

  if (nama.length < 3) {
    return NextResponse.json({ pesan: "Isi nama lengkap peserta." }, { status: 400 });
  }
  if (wa.length < 10 || wa.length > 15) {
    return NextResponse.json({ pesan: "Nomor WhatsApp belum benar. Contoh: 081234567890." }, { status: 400 });
  }
  if (!PAGUYUBAN.includes(paguyuban)) {
    return NextResponse.json({ pesan: "Pilih paguyuban Anda." }, { status: 400 });
  }
  if (lombaIds.length === 0) {
    return NextResponse.json({ pesan: "Centang minimal satu lomba yang mau diikuti." }, { status: 400 });
  }

  const [lomba, pendaftar] = await Promise.all([
    readSheet("Lomba"),
    readSheet("Pendaftaran"),
  ]);
  const lombaAktif = lomba.filter(aktif);
  const daftarAktif = pendaftar.filter(aktif);

  const waktu = new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });
  const barisBaru = [];
  const berhasil = [];
  const ditolak = [];

  for (const id of lombaIds) {
    const target = lombaAktif.find((l) => l.id === id);
    if (!target) {
      ditolak.push({ lomba: id, alasan: "sudah tidak dibuka" });
      continue;
    }

    const terisi = daftarAktif.filter((p) => p.lomba_id === id).length + barisBaru.filter((r) => r.lomba_id === id).length;
    const kuota = keAngka(target.kuota);
    if (kuota > 0 && terisi >= kuota) {
      ditolak.push({ lomba: target.nama, alasan: "kuota sudah penuh" });
      continue;
    }
    if (daftarAktif.some((p) => p.lomba_id === id && rapikanWa(p.no_wa) === wa && p.nama.toLowerCase() === nama.toLowerCase())) {
      ditolak.push({ lomba: target.nama, alasan: "nama ini sudah terdaftar di lomba tersebut" });
      continue;
    }

    barisBaru.push({
      waktu_daftar: waktu,
      nama,
      no_wa: "'" + wa,
      paguyuban,
      lomba_id: id,
      kategori_usia: kategori,
      catatan,
      status: "aktif",
    });
    berhasil.push(target.nama);
  }

  if (barisBaru.length === 0) {
    const rincian = ditolak.map((t) => `${t.lomba} (${t.alasan})`).join(", ");
    return NextResponse.json(
      { pesan: `Tidak ada lomba yang bisa didaftarkan: ${rincian}.`, ditolak },
      { status: 409 }
    );
  }

  await appendRows("Pendaftaran", barisBaru);

  return NextResponse.json({ ok: true, berhasil, ditolak });
}
