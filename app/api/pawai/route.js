import { NextResponse } from "next/server";
import {
  bacaPawai, faseVoting, keWaktuWib, papanKategori,
  COOKIE_PERANGKAT, OPSI_COOKIE_PERANGKAT,
} from "@/lib/pawai";
import { KATEGORI_PAWAI } from "@/lib/skema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Status voting untuk halaman /pawai. Sekalian menanam cookie penanda
 * perangkat sedini mungkin — begitu warga membuka halaman, bukan saat
 * memilih — supaya satu HP dikenali sebagai satu pemilih.
 */
export async function GET(req) {
  let perangkat = req.cookies.get(COOKIE_PERANGKAT)?.value || "";
  const cookieBaru = !perangkat;
  if (cookieBaru) perangkat = crypto.randomUUID();

  const { konf, nominasi, suara, perNominasi } = await bacaPawai();
  const fase = faseVoting(konf);

  // Kategori mana saja yang sudah dipilih dari perangkat ini.
  const sudah = {};
  for (const s of suara) {
    if (s.perangkat === perangkat) sudah[s.kategori] = s.nominasi_id;
  }

  const badan = {
    ok: true,
    fase,
    mulai: keWaktuWib(konf.mulai),
    selesai: keWaktuWib(konf.selesai),
    kini: Date.now(),
    kategori: KATEGORI_PAWAI,
    // Jumlah suara per nominasi dirahasiakan selama voting supaya tidak
    // ikut-ikutan; baru dibuka bersamaan dengan pengumuman di panggung.
    nominasi: nominasi.map((n) => ({
      id: n.id, kategori: n.kategori, nama: n.nama, deskripsi: n.deskripsi,
    })),
    papan: fase === "umum"
      ? Object.fromEntries(KATEGORI_PAWAI.map((k) => [k, papanKategori(nominasi, perNominasi, k)]))
      : null,
    sudah,
    totalSuara: suara.length,
  };

  const res = NextResponse.json(badan, { headers: { "Cache-Control": "no-store" } });
  if (cookieBaru) {
    res.cookies.set(COOKIE_PERANGKAT, perangkat, OPSI_COOKIE_PERANGKAT);
  }
  return res;
}
