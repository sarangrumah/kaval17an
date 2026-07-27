"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BENTUK_DUKUNGAN, ASAL_DUKUNGAN } from "@/lib/skema";

export default function FormDukungan() {
  const router = useRouter();
  const [f, setF] = useState({
    nama: "", no_wa: "", asal: "", bentuk: "", deskripsi: "", nilai: "", catatan: "",
  });
  const [kirim, setKirim] = useState(false);
  const [salah, setSalah] = useState("");
  const [selesai, setSelesai] = useState(false);

  const ubah = (k) => (e) => setF({ ...f, [k]: e.target.value });

  async function kirimDukungan() {
    setKirim(true);
    setSalah("");
    try {
      const r = await fetch("/api/dukungan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(f),
      });
      const j = await r.json();
      if (!r.ok) setSalah(j.pesan || "Dukungan gagal dikirim. Coba sebentar lagi.");
      else {
        setSelesai(true);
        router.refresh();
      }
    } catch {
      setSalah("Koneksi terputus. Periksa sinyal lalu kirim ulang.");
    } finally {
      setKirim(false);
    }
  }

  if (selesai) {
    return (
      <div className="animate-muncul rounded-2xl border border-emerald-300 bg-emerald-50 p-5 sm:p-7">
        <h3 className="font-serif text-xl font-bold text-emerald-900">🙏 Terima kasih, {f.nama}!</h3>
        <p className="mt-2 text-sm leading-relaxed text-emerald-900">
          Tawaran dukungan Anda sudah tercatat. Bendahara atau seksi dana akan
          menghubungi nomor {f.no_wa} untuk mengatur serah terimanya. Nama Anda
          akan tampil di papan dukungan halaman ini.
        </p>
        <button
          onClick={() => {
            setSelesai(false);
            setF({ ...f, bentuk: "", deskripsi: "", nilai: "", catatan: "" });
          }}
          className="mt-4 rounded-md bg-emerald-800 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
        >
          Kirim dukungan lain
        </button>
      </div>
    );
  }

  const isi = "w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600";
  const label = "block text-sm font-medium text-slate-700";

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="d-nama" className={label}>Nama Anda / nama usaha</label>
          <input id="d-nama" value={f.nama} onChange={ubah("nama")} className={"mt-1 " + isi} placeholder="Misalnya: Bu Sari, Warung Barokah" />
        </div>
        <div>
          <label htmlFor="d-wa" className={label}>Nomor WhatsApp</label>
          <input id="d-wa" value={f.no_wa} onChange={ubah("no_wa")} inputMode="numeric" className={"mt-1 " + isi} placeholder="081234567890" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="d-asal" className={label}>Asal</label>
          <select id="d-asal" value={f.asal} onChange={ubah("asal")} className={"mt-1 " + isi}>
            <option value="">Pilih asal</option>
            {ASAL_DUKUNGAN.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="d-bentuk" className={label}>Bentuk dukungan</label>
          <select id="d-bentuk" value={f.bentuk} onChange={ubah("bentuk")} className={"mt-1 " + isi}>
            <option value="">Pilih bentuk</option>
            {BENTUK_DUKUNGAN.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="d-desk" className={label}>Apa yang ingin Anda sumbangkan?</label>
        <input id="d-desk" value={f.deskripsi} onChange={ubah("deskripsi")} className={"mt-1 " + isi} placeholder="Misalnya: dua kipas angin untuk doorprize, 50 kotak snack, tenaga dekorasi" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="d-nilai" className={label}>
            Perkiraan nilai (Rp) <span className="font-normal text-slate-400">(boleh dikosongkan)</span>
          </label>
          <input id="d-nilai" value={f.nilai} onChange={ubah("nilai")} type="number" inputMode="numeric" className={"mt-1 " + isi} placeholder="500000" />
        </div>
        <div>
          <label htmlFor="d-cat" className={label}>
            Catatan untuk panitia <span className="font-normal text-slate-400">(boleh dikosongkan)</span>
          </label>
          <input id="d-cat" value={f.catatan} onChange={ubah("catatan")} className={"mt-1 " + isi} placeholder="Misalnya: barang bisa diambil setelah tanggal 10" />
        </div>
      </div>

      {salah && (
        <p className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800">{salah}</p>
      )}

      <div className="flex items-center gap-4">
        <button
          onClick={kirimDukungan}
          disabled={kirim}
          className="rounded-full bg-gradient-to-r from-merah to-merah-tua px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-red-200 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-300 disabled:translate-y-0 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
        >
          {kirim ? "Mengirim…" : "🤝 Kirim tawaran dukungan"}
        </button>
        <p className="text-xs text-slate-500">
          Nama, asal, dan bentuk dukungan tampil di papan dukungan. Nomor WhatsApp
          dan perkiraan nilai hanya dilihat panitia.
        </p>
      </div>
    </div>
  );
}
