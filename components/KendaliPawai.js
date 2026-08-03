"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/*
 * Tombol kendali voting pawai untuk panitia di panggung: buka/tutup voting
 * dengan sekali tekan, atau pasang jadwalnya lebih dulu. Semua pengaturan
 * tersimpan sebagai baris kunci-nilai di tab Pawai lewat /api/admin/row.
 */

/** Waktu sekarang dalam WIB, format yang dimengerti input datetime-local. */
function wibSekarang() {
  return new Date()
    .toLocaleString("sv-SE", { timeZone: "Asia/Jakarta" })
    .slice(0, 16)
    .replace(" ", "T");
}

const LABEL_FASE = {
  siap: ["Voting belum dibuka", "bg-stone-100 text-slate-700"],
  vote: ["Voting SEDANG BERLANGSUNG", "bg-emerald-50 text-emerald-800"],
  tutup: ["Voting ditutup — menunggu pengumuman", "bg-amber-50 text-amber-800"],
  umum: ["PENGUMUMAN TAYANG di halaman warga", "bg-red-50 text-red-800"],
};

export default function KendaliPawai({ fase, konf, barisKunci }) {
  const router = useRouter();
  const [sibuk, setSibuk] = useState(false);
  const [pesan, setPesan] = useState("");
  const [salah, setSalah] = useState("");
  const [jadwal, setJadwal] = useState({
    mulai: (konf.mulai || "").slice(0, 16),
    selesai: (konf.selesai || "").slice(0, 16),
  });

  async function tulis(kunci, nilai) {
    const baris = barisKunci[kunci];
    const r = await fetch("/api/admin/row", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        baris
          ? { tab: "Pawai", aksi: "ubah", baris, data: { kunci, nilai, status: "aktif" } }
          : { tab: "Pawai", aksi: "tambah", data: { kunci, nilai, status: "aktif" } }
      ),
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j.pesan || "Gagal menyimpan pengaturan.");
  }

  async function jalankan(langkah, sukses) {
    setSibuk(true); setSalah(""); setPesan("");
    try {
      await langkah();
      setPesan(sukses);
      router.refresh();
    } catch (e) {
      setSalah(e.message || "Gagal menyimpan.");
    } finally {
      setSibuk(false);
    }
  }

  const bukaSekarang = () =>
    jalankan(async () => {
      const kini = wibSekarang();
      await tulis("mulai", kini);
      // Jadwal tutup yang sudah lewat ikut dihapus supaya fase benar-benar vote.
      if (konf.selesai && konf.selesai.slice(0, 16) <= kini) await tulis("selesai", "");
      if ((konf.pengumuman || "").toLowerCase() === "ya") await tulis("pengumuman", "tidak");
      setJadwal((s) => ({ ...s, mulai: kini }));
    }, "Voting dibuka. Halaman warga berpindah sendiri dalam beberapa detik.");

  const tutupSekarang = () =>
    jalankan(async () => {
      const kini = wibSekarang();
      await tulis("selesai", kini);
      setJadwal((s) => ({ ...s, selesai: kini }));
    }, "Voting ditutup. Suara yang masuk setelah ini otomatis ditolak.");

  const umumkan = () => {
    if (!confirm("Umumkan pemenang sekarang? Semua HP yang membuka /pawai langsung melihat panggung pengumuman.")) return;
    jalankan(async () => {
      if (faseButuhTutup()) await tulis("selesai", wibSekarang());
      await tulis("pengumuman", "ya");
    }, "Pengumuman tayang! Buka /pawai di layar panggung lalu tekan tombol drumroll-nya.");
  };
  const faseButuhTutup = () => fase === "vote" || fase === "siap";

  const sembunyikan = () =>
    jalankan(() => tulis("pengumuman", "tidak"), "Pengumuman disembunyikan lagi.");

  const simpanJadwal = () =>
    jalankan(async () => {
      await tulis("mulai", jadwal.mulai);
      await tulis("selesai", jadwal.selesai);
    }, "Jadwal voting tersimpan.");

  const [labelFase, gayaFase] = LABEL_FASE[fase] || LABEL_FASE.siap;
  const tombol = "rounded-md px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600";
  const isi = "mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600";

  return (
    <div className="rounded-lg border border-stone-300 bg-white p-5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-serif text-lg font-bold">Kendali voting</h2>
        <span className={"rounded px-2 py-1 text-xs font-medium " + gayaFase}>{labelFase}</span>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        {fase !== "vote" && fase !== "umum" && (
          <button onClick={bukaSekarang} disabled={sibuk} className={tombol + " bg-emerald-700 hover:bg-emerald-800"}>
            🔓 Buka voting sekarang
          </button>
        )}
        {fase === "vote" && (
          <button onClick={tutupSekarang} disabled={sibuk} className={tombol + " bg-amber-600 hover:bg-amber-700"}>
            🔒 Tutup voting sekarang
          </button>
        )}
        {fase !== "umum" ? (
          <button onClick={umumkan} disabled={sibuk} className={tombol + " bg-red-700 hover:bg-red-800"}>
            📣 Umumkan pemenang
          </button>
        ) : (
          <button onClick={sembunyikan} disabled={sibuk} className={tombol + " bg-slate-600 hover:bg-slate-700"}>
            🙈 Sembunyikan pengumuman
          </button>
        )}
      </div>

      <div className="mt-5 border-t border-stone-200 pt-4">
        <p className="text-sm font-medium text-slate-700">
          Atau pasang jadwalnya (WIB) — halaman warga menampilkan hitung mundur:
        </p>
        <div className="mt-2 grid gap-4 sm:grid-cols-[1fr,1fr,auto]">
          <div>
            <label htmlFor="pw-mulai" className="block text-xs text-slate-500">Voting dibuka</label>
            <input id="pw-mulai" type="datetime-local" value={jadwal.mulai}
                   onChange={(e) => setJadwal({ ...jadwal, mulai: e.target.value })} className={isi} />
          </div>
          <div>
            <label htmlFor="pw-selesai" className="block text-xs text-slate-500">Voting ditutup</label>
            <input id="pw-selesai" type="datetime-local" value={jadwal.selesai}
                   onChange={(e) => setJadwal({ ...jadwal, selesai: e.target.value })} className={isi} />
          </div>
          <button onClick={simpanJadwal} disabled={sibuk}
                  className="self-end rounded-md border border-stone-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-stone-100 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600">
            Simpan jadwal
          </button>
        </div>
      </div>

      {salah && <p className="mt-4 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800">{salah}</p>}
      {pesan && <p className="mt-4 rounded-md border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{pesan}</p>}
    </div>
  );
}
