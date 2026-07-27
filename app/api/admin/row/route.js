import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { bacaSesi, NAMA_COOKIE } from "@/lib/auth";
import { appendRow, updateRow, batalkanBaris } from "@/lib/sheets";
import { SKEMA } from "@/lib/skema";

export const runtime = "nodejs";

export async function POST(req) {
  const sesi = await bacaSesi(cookies().get(NAMA_COOKIE)?.value);
  if (!sesi) {
    return NextResponse.json({ pesan: "Sesi habis. Masuk lagi ya." }, { status: 401 });
  }

  const { tab, aksi, data = {}, baris } = await req.json().catch(() => ({}));
  const skema = SKEMA[tab];
  if (!skema) {
    return NextResponse.json({ pesan: "Tab tidak dikenal." }, { status: 400 });
  }

  // Hanya kolom yang terdaftar di skema yang diteruskan.
  const bersih = Object.fromEntries(
    skema.kolom.map((k) => [k, k === "status" ? (data.status || "aktif") : String(data[k] ?? "")])
  );

  try {
    if (aksi === "batal") {
      if (!baris || baris < 2) return NextResponse.json({ pesan: "Baris tidak sah." }, { status: 400 });
      await batalkanBaris(tab, baris);
    } else if (aksi === "tambah") {
      await appendRow(tab, bersih);
    } else if (aksi === "ubah") {
      if (!baris || baris < 2) return NextResponse.json({ pesan: "Baris tidak sah." }, { status: 400 });
      await updateRow(tab, baris, bersih);
    } else {
      return NextResponse.json({ pesan: "Aksi tidak dikenal." }, { status: 400 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ pesan: e.message || "Gagal menulis ke spreadsheet." }, { status: 500 });
  }
}
