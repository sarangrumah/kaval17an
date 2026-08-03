"use client";

import { useState } from "react";
import { PAGUYUBAN, KATEGORI_USIA, cocokKelompok } from "@/lib/skema";

export default function FormDaftar({ lomba }) {
  const [f, setF] = useState({
    nama: "", no_wa: "", paguyuban: "", kategori_usia: "", catatan: "",
  });
  const [pilihan, setPilihan] = useState([]);
  const [kirim, setKirim] = useState(false);
  const [salah, setSalah] = useState("");
  const [selesai, setSelesai] = useState(null);

  const ubah = (k) => (e) => setF({ ...f, [k]: e.target.value });

  // Lomba tersaring mengikuti kelompok usia yang dipilih; ganti kelompok
  // ikut membuang centangan lomba yang tidak lagi sesuai.
  const sesuai = f.kategori_usia
    ? lomba.filter((l) => cocokKelompok(l.kategori, f.kategori_usia))
    : [];
  const ubahUsia = (e) => {
    const usia = e.target.value;
    setF({ ...f, kategori_usia: usia });
    setPilihan((p) =>
      p.filter((id) => {
        const l = lomba.find((x) => x.id === id);
        return l && cocokKelompok(l.kategori, usia);
      })
    );
  };

  const centang = (id) => () =>
    setPilihan((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  async function daftar() {
    if (!f.kategori_usia) {
      setSalah("Pilih dulu kelompok usianya supaya daftar lombanya muncul.");
      return;
    }
    if (pilihan.length === 0) {
      setSalah("Centang minimal satu lomba yang mau diikuti.");
      return;
    }
    setKirim(true);
    setSalah("");
    try {
      const r = await fetch("/api/daftar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...f, lomba_ids: pilihan }),
      });
      const j = await r.json();
      if (!r.ok) setSalah(j.pesan || "Pendaftaran gagal dikirim. Coba sebentar lagi.");
      else setSelesai({ berhasil: j.berhasil || [], ditolak: j.ditolak || [] });
    } catch {
      setSalah("Koneksi terputus. Periksa sinyal lalu kirim ulang.");
    } finally {
      setKirim(false);
    }
  }

  if (selesai) {
    return (
      <div className="animate-muncul rounded-2xl border border-emerald-300 bg-emerald-50 p-5 sm:p-7">
        <h3 className="font-serif text-xl font-bold text-emerald-900">🎉 Pendaftaran tercatat</h3>
        <p className="mt-2 text-sm leading-relaxed text-emerald-900">
          {f.nama} terdaftar di{" "}
          <strong>{selesai.berhasil.join(", ")}</strong>. Panitia akan menghubungi
          nomor {f.no_wa} sebelum hari H untuk konfirmasi teknis.
        </p>
        {selesai.ditolak.length > 0 && (
          <p className="mt-2 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
            Sebagian tidak ikut tercatat:{" "}
            {selesai.ditolak.map((t) => `${t.lomba} — ${t.alasan}`).join("; ")}.
          </p>
        )}
        <button
          onClick={() => {
            setSelesai(null);
            setPilihan([]);
            setF({ ...f, nama: "", kategori_usia: "", catatan: "" });
          }}
          className="mt-4 rounded-md bg-emerald-800 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
        >
          Daftarkan peserta lain
        </button>
      </div>
    );
  }

  const isi = "w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600";
  const label = "block text-sm font-medium text-slate-700";

  return (
    <div className="grid gap-4">
      <div>
        <label htmlFor="nama" className={label}>Nama lengkap peserta</label>
        <input id="nama" value={f.nama} onChange={ubah("nama")} className={"mt-1 " + isi} placeholder="Nama sesuai panggilan sehari-hari" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="wa" className={label}>Nomor WhatsApp</label>
          <input id="wa" value={f.no_wa} onChange={ubah("no_wa")} inputMode="numeric" className={"mt-1 " + isi} placeholder="081234567890" />
        </div>
        <div>
          <label htmlFor="pg" className={label}>Paguyuban</label>
          <select id="pg" value={f.paguyuban} onChange={ubah("paguyuban")} className={"mt-1 " + isi}>
            <option value="">Pilih paguyuban</option>
            {PAGUYUBAN.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="usia" className={label}>Kelompok usia peserta</label>
        <select id="usia" value={f.kategori_usia} onChange={ubahUsia} className={"mt-1 " + isi}>
          <option value="">Pilih kelompok</option>
          {KATEGORI_USIA.map((k) => <option key={k}>{k}</option>)}
        </select>
      </div>

      <fieldset>
        <legend className={label}>
          Lomba yang diikuti{" "}
          <span className="font-normal text-slate-400">(boleh centang lebih dari satu)</span>
        </legend>

        {!f.kategori_usia && (
          <p className="mt-2 rounded-lg border border-dashed border-stone-300 bg-stone-50 px-3 py-4 text-center text-sm text-slate-500">
            Pilih kelompok usia dulu — daftar lomba yang sesuai akan muncul di sini.
          </p>
        )}

        {f.kategori_usia && (
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {sesuai.length === 0 && (
              <p className="text-sm text-slate-500 sm:col-span-2">
                Belum ada lomba untuk kelompok {f.kategori_usia}.
              </p>
            )}
            {sesuai.map((l) => {
              const dipilih = pilihan.includes(l.id);
              return (
                <label
                  key={l.id}
                  className={
                    "flex items-start gap-2.5 rounded-lg border px-3 py-2.5 text-sm transition-colors " +
                    (l.penuh
                      ? "cursor-not-allowed border-stone-200 bg-stone-50 opacity-60"
                      : dipilih
                        ? "cursor-pointer border-red-400 bg-red-50 text-merah-pekat"
                        : "cursor-pointer border-stone-300 bg-white hover:bg-stone-50")
                  }
                >
                  <input
                    type="checkbox"
                    checked={dipilih}
                    disabled={l.penuh}
                    onChange={centang(l.id)}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-red-700"
                  />
                  <span className="min-w-0">
                    <span className="font-medium">{l.nama}</span>
                    <span className="block text-xs text-slate-500">
                      {l.kategori}
                      {l.penuh
                        ? " · kuota penuh"
                        : l.sisaKuota !== null
                          ? ` · sisa ${l.sisaKuota} slot`
                          : ""}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
        )}

        {pilihan.length > 1 && (
          <p className="mt-2 text-xs text-slate-500">
            {pilihan.length} lomba dipilih — semuanya terkirim dalam satu pendaftaran.
          </p>
        )}
      </fieldset>

      <div>
        <label htmlFor="cat" className={label}>Catatan untuk panitia <span className="font-normal text-slate-400">(boleh dikosongkan)</span></label>
        <input id="cat" value={f.catatan} onChange={ubah("catatan")} className={"mt-1 " + isi} placeholder="Misalnya: mendaftarkan anak, perlu pendamping" />
      </div>

      {salah && (
        <p className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800">{salah}</p>
      )}

      <div className="flex items-center gap-4">
        <button
          onClick={daftar}
          disabled={kirim}
          className="rounded-full bg-gradient-to-r from-merah to-merah-tua px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-red-200 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-300 disabled:translate-y-0 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
        >
          {kirim ? "Mengirim…" : "🚩 Kirim pendaftaran"}
        </button>
        <p className="text-xs text-slate-500">
          Nama dan paguyuban akan tampil di daftar peserta. Nomor WhatsApp hanya dilihat panitia.
        </p>
      </div>
    </div>
  );
}
