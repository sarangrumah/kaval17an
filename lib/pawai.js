import { readSheet } from "./sheets";
import { aktif, keAngka } from "./format";
import { KATEGORI_PAWAI } from "./skema";

/**
 * Voting lomba pawai kemerdekaan yang diumumkan di pentas seni.
 *
 * Tiga tab spreadsheet terlibat:
 *   Pawai    — pengaturan kunci/nilai: mulai, selesai, pengumuman
 *   Nominasi — lima nominator per kategori (Sepeda Hias & Kustom Pawai)
 *   Suara    — satu baris per suara masuk, dengan penanda perangkat
 *
 * Fase dihitung dari pengaturan itu:
 *   siap  — voting belum dibuka (hitung mundur bila jadwalnya sudah diisi)
 *   vote  — warga bisa memilih
 *   tutup — waktu habis, menunggu pengumuman di panggung
 *   umum  — panitia menyalakan pengumuman; pemenang boleh ditampilkan
 */

/** Nama cookie penanda perangkat pemilih — dipakai kedua route API pawai. */
export const COOKIE_PERANGKAT = "pawai_perangkat";

/** Umur cookie penanda perangkat: cukup sampai jauh melewati hari H. */
export const UMUR_COOKIE_PERANGKAT = 60 * 60 * 24 * 90;

/** Opsi cookie perangkat; secure dilonggarkan saat pengembangan lokal (http). */
export const OPSI_COOKIE_PERANGKAT = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: UMUR_COOKIE_PERANGKAT,
};

/**
 * Waktu pengaturan ditulis "2026-08-17T19:30" dari input datetime-local.
 * Server Vercel berjalan di UTC, jadi nilai tanpa zona dianggap WIB.
 */
export function keWaktuWib(v) {
  const s = String(v || "").trim();
  if (!s) return null;
  const tanpaZona = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/.test(s);
  const t = new Date(tanpaZona ? s + "+07:00" : s).getTime();
  return Number.isFinite(t) ? t : null;
}

export function faseVoting(konf, kini = Date.now()) {
  if ((konf.pengumuman || "").toLowerCase() === "ya") return "umum";
  const mulai = keWaktuWib(konf.mulai);
  const selesai = keWaktuWib(konf.selesai);
  if (!mulai || kini < mulai) return "siap";
  if (selesai && kini >= selesai) return "tutup";
  return "vote";
}

/**
 * Baca ketiga tab sekaligus. Tab yang belum dibuat panitia dianggap kosong
 * supaya halaman publik tetap hidup (menampilkan "belum dibuka").
 */
export async function bacaPawai() {
  const [pengaturan, nominasi, suara] = await Promise.all([
    readSheet("Pawai").catch(() => []),
    readSheet("Nominasi").catch(() => []),
    readSheet("Suara").catch(() => []),
  ]);

  const konf = {};
  for (const r of pengaturan.filter(aktif)) {
    const k = String(r.kunci || "").trim().toLowerCase();
    if (k) konf[k] = String(r.nilai || "").trim();
  }

  const nominasiAktif = nominasi
    .filter(aktif)
    .filter((n) => n.id && KATEGORI_PAWAI.includes(n.kategori))
    .map((n) => ({ ...n, urutan: keAngka(n.urutan) }))
    .sort((a, b) => a.urutan - b.urutan || a.nama.localeCompare(b.nama));

  const suaraAktif = suara.filter(aktif);
  const perNominasi = {};
  for (const s of suaraAktif) {
    perNominasi[s.nominasi_id] = (perNominasi[s.nominasi_id] || 0) + 1;
  }

  return { konf, nominasi: nominasiAktif, suara: suaraAktif, perNominasi };
}

/** Nominasi satu kategori diurutkan dari suara terbanyak (untuk pengumuman). */
export function papanKategori(nominasi, perNominasi, kategori) {
  return nominasi
    .filter((n) => n.kategori === kategori)
    .map((n) => ({ ...n, suara: perNominasi[n.id] || 0 }))
    .sort((a, b) => b.suara - a.suara || a.urutan - b.urutan);
}
