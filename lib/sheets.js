import { google } from "googleapis";
import { revalidateTag } from "next/cache";

/**
 * Dua cara menyambung ke Google Sheets. Situs memilih sendiri:
 *
 *   Jalur Apps Script  — dipakai bila APPS_SCRIPT_URL diisi. Paling mudah,
 *                        tidak perlu Google Cloud Console sama sekali.
 *   Jalur service account — dipakai bila tidak. Untuk yang sudah terbiasa
 *                        dengan Google Cloud atau butuh kuota lebih besar.
 *
 * Kredensial keduanya hanya hidup di server, tidak pernah sampai ke browser.
 */
const pakaiScript = () => Boolean(process.env.APPS_SCRIPT_URL);

/* ---------- Jalur Apps Script ---------- */

async function panggilScript(muatan, opsiCache = { cache: "no-store" }) {
  const res = await fetch(process.env.APPS_SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...muatan, kunci: process.env.APPS_SCRIPT_KUNCI }),
    ...opsiCache,
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`Apps Script menolak (HTTP ${res.status}).`);
  const j = await res.json().catch(() => null);
  if (!j || !j.ok) throw new Error(j?.pesan || "Apps Script tidak mengembalikan data.");
  return j.data;
}

/* ---------- Jalur service account ---------- */

function client() {
  const key = (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n");
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  return google.sheets({ version: "v4", auth });
}

const SHEET_ID = () => process.env.SHEET_ID;

function keObjek(rows) {
  if (!rows || rows.length < 2) return [];
  const header = rows[0].map((h) => String(h).trim());
  return rows.slice(1)
    .filter((r) => r.join("").trim() !== "")
    .map((r, i) => {
      const obj = { _baris: i + 2 };
      header.forEach((h, c) => { obj[h] = r[c] !== undefined ? String(r[c]).trim() : ""; });
      return obj;
    });
}

/* ---------- Antarmuka yang dipakai seluruh aplikasi ---------- */

const SEMUA_TAB = ["KategoriAnggaran", "PosAnggaran", "Pemasukan", "Pengeluaran", "Lomba", "Jadwal", "Pendaftaran", "Dukungan"];

/*
 * Satu round-trip ke Apps Script makan 2–6 detik, jadi hasil baca disimpan
 * di cache server paling lama 60 detik. Setiap penulisan menghapus cache
 * lewat tag "sheets" — perubahan lewat situs langsung terlihat, hanya
 * suntingan langsung di spreadsheet yang butuh menunggu semenit.
 * Penulisan tetap tanpa cache (no-store di bawaan panggilScript).
 */
const TAG_SHEETS = "sheets";
const CACHE_BACA = { next: { revalidate: 60, tags: [TAG_SHEETS] } };

/** Baca satu tab. Baris pertama dipakai sebagai nama kolom. */
export async function readSheet(tab) {
  if (pakaiScript()) return await panggilScript({ aksi: "baca", tab }, CACHE_BACA);
  const res = await client().spreadsheets.values.get({
    spreadsheetId: SHEET_ID(),
    range: `${tab}!A1:Z10000`,
  });
  return keObjek(res.data.values || []);
}

/** Baca seluruh tab sekaligus. Jauh lebih hemat daripada enam panggilan terpisah. */
export async function readAll() {
  if (pakaiScript()) return await panggilScript({ aksi: "baca_semua" }, CACHE_BACA);
  const res = await client().spreadsheets.values.batchGet({
    spreadsheetId: SHEET_ID(),
    ranges: SEMUA_TAB.map((t) => `${t}!A1:Z10000`),
  });
  const hasil = {};
  SEMUA_TAB.forEach((t, i) => {
    hasil[t] = keObjek(res.data.valueRanges?.[i]?.values || []);
  });
  return hasil;
}

/** Tambah satu baris di akhir tab. */
export async function appendRow(tab, data) {
  if (pakaiScript()) {
    await panggilScript({ aksi: "tambah", tab, data });
    revalidateTag(TAG_SHEETS);
    return;
  }
  const { SKEMA } = await import("./skema");
  const nilai = SKEMA[tab].kolom.map((k) =>
    k === "status" ? (data.status || "aktif") : String(data[k] ?? "")
  );
  await client().spreadsheets.values.append({
    spreadsheetId: SHEET_ID(),
    range: `${tab}!A1`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [nilai] },
  });
  revalidateTag(TAG_SHEETS);
}

/**
 * Tambah beberapa baris sekaligus dalam satu round-trip — dipakai pendaftaran
 * multi-lomba supaya tidak menunggu Apps Script berkali-kali.
 * Apps Script versi lama belum mengenal aksi tambah_banyak; kalau ditolak,
 * baris dikirim satu per satu sebagai cadangan.
 */
export async function appendRows(tab, banyak) {
  if (!banyak.length) return;
  if (pakaiScript()) {
    try {
      await panggilScript({ aksi: "tambah_banyak", tab, banyak });
    } catch (e) {
      if (!/aksi tidak dikenal/i.test(e?.message || "")) throw e;
      for (const data of banyak) await panggilScript({ aksi: "tambah", tab, data });
    }
    revalidateTag(TAG_SHEETS);
    return;
  }
  const { SKEMA } = await import("./skema");
  const nilai = banyak.map((data) =>
    SKEMA[tab].kolom.map((k) =>
      k === "status" ? (data.status || "aktif") : String(data[k] ?? "")
    )
  );
  await client().spreadsheets.values.append({
    spreadsheetId: SHEET_ID(),
    range: `${tab}!A1`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: nilai },
  });
  revalidateTag(TAG_SHEETS);
}

/** Timpa satu baris yang sudah ada. */
export async function updateRow(tab, baris, data) {
  if (pakaiScript()) {
    await panggilScript({ aksi: "ubah", tab, baris, data });
    revalidateTag(TAG_SHEETS);
    return;
  }
  const { SKEMA } = await import("./skema");
  const nilai = SKEMA[tab].kolom.map((k) =>
    k === "status" ? (data.status || "aktif") : String(data[k] ?? "")
  );
  await client().spreadsheets.values.update({
    spreadsheetId: SHEET_ID(),
    range: `${tab}!A${baris}`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [nilai] },
  });
  revalidateTag(TAG_SHEETS);
}

/**
 * Tandai baris sebagai dibatalkan, bukan menghapusnya.
 * Buku kas tidak boleh kehilangan jejak: catatan yang salah dibatalkan,
 * riwayatnya tetap terbaca, lalu diganti catatan baru.
 */
export async function batalkanBaris(tab, baris) {
  if (pakaiScript()) {
    await panggilScript({ aksi: "batal", tab, baris });
    revalidateTag(TAG_SHEETS);
    return;
  }
  const { SKEMA } = await import("./skema");
  await client().spreadsheets.values.update({
    spreadsheetId: SHEET_ID(),
    range: `${tab}!${SKEMA[tab].kolomStatus}${baris}`,
    valueInputOption: "RAW",
    requestBody: { values: [["batal"]] },
  });
  revalidateTag(TAG_SHEETS);
}
