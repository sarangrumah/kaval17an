"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { rp } from "@/lib/format";

/**
 * Editor sederhana untuk satu tab spreadsheet.
 * `ladang` mendeskripsikan kolom: { nama, label, tipe, pilihan, lebar }
 * Tiap baris membawa `_ringkas` ({ utama, sisi, nilai }) yang sudah dihitung
 * di server — fungsi tidak boleh diserahkan ke client component.
 */
export default function EditorTabel({ tab, ladang, baris }) {
  const router = useRouter();
  const kosong = Object.fromEntries(ladang.map((l) => [l.nama, ""]));

  const [form, setForm] = useState(kosong);
  const [sedangUbah, setSedangUbah] = useState(null);
  const [sibuk, setSibuk] = useState(false);
  const [pesan, setPesan] = useState("");
  const [salah, setSalah] = useState("");

  const ubah = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function kirim(aksi, muatan = {}) {
    setSibuk(true); setSalah(""); setPesan("");
    try {
      const r = await fetch("/api/admin/row", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tab, aksi, ...muatan }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) { setSalah(j.pesan || "Gagal menyimpan."); return false; }
      router.refresh();
      return true;
    } catch {
      setSalah("Koneksi terputus. Data belum tersimpan.");
      return false;
    } finally {
      setSibuk(false);
    }
  }

  async function simpan() {
    const wajib = ladang.filter((l) => l.wajib && !String(form[l.nama] || "").trim());
    if (wajib.length) {
      setSalah("Lengkapi dulu: " + wajib.map((l) => l.label).join(", ") + ".");
      return;
    }
    const ok = sedangUbah
      ? await kirim("ubah", { data: form, baris: sedangUbah })
      : await kirim("tambah", { data: form });
    if (ok) {
      setPesan(sedangUbah ? "Perubahan tersimpan." : "Catatan baru tersimpan.");
      setForm(kosong);
      setSedangUbah(null);
    }
  }

  async function batalkan(b, label) {
    if (!confirm(`Batalkan "${label}"? Barisnya tetap ada di spreadsheet, hanya ditandai batal.`)) return;
    if (await kirim("batal", { baris: b })) setPesan("Catatan ditandai batal.");
  }

  function suntingBaris(r) {
    setSedangUbah(r._baris);
    setForm(Object.fromEntries(ladang.map((l) => [l.nama, r[l.nama] ?? ""])));
    setSalah(""); setPesan("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const isi = "mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600";

  return (
    <div>
      <div className="rounded-lg border border-stone-300 bg-white p-5 sm:p-7">
        <h2 className="font-serif text-lg font-bold">
          {sedangUbah ? "Ubah catatan" : "Tambah catatan"}
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {ladang.map((l) => (
            <div key={l.nama} className={l.lebar === "penuh" ? "sm:col-span-2" : ""}>
              <label htmlFor={l.nama} className="block text-sm font-medium text-slate-700">
                {l.label}
                {!l.wajib && <span className="font-normal text-slate-400"> (boleh kosong)</span>}
              </label>
              {l.pilihan ? (
                <select id={l.nama} value={form[l.nama]} onChange={ubah(l.nama)} className={isi}>
                  <option value="">Pilih {l.label.toLowerCase()}</option>
                  {l.pilihan.map((o) => (
                    <option key={o.nilai ?? o} value={o.nilai ?? o}>{o.label ?? o}</option>
                  ))}
                </select>
              ) : (
                <input id={l.nama} type={l.tipe || "text"} value={form[l.nama]}
                       onChange={ubah(l.nama)} placeholder={l.contoh} className={isi} />
              )}
            </div>
          ))}
        </div>

        {salah && <p className="mt-4 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800">{salah}</p>}
        {pesan && <p className="mt-4 rounded-md border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{pesan}</p>}

        <div className="mt-5 flex flex-wrap gap-3">
          <button onClick={simpan} disabled={sibuk}
                  className="rounded-md bg-red-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-800 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600">
            {sibuk ? "Menyimpan…" : sedangUbah ? "Simpan perubahan" : "Tambahkan"}
          </button>
          {sedangUbah && (
            <button onClick={() => { setSedangUbah(null); setForm(kosong); }}
                    className="rounded-md border border-stone-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600">
              Batal mengubah
            </button>
          )}
        </div>
      </div>

      <div className="mt-5 rounded-lg border border-stone-300 bg-white p-5 sm:p-7">
        <h2 className="font-serif text-lg font-bold">Catatan tersimpan</h2>
        <div className="mt-4 divide-y divide-stone-200 border-t border-stone-200">
          {baris.length === 0 && (
            <p className="py-8 text-center text-sm text-slate-500">
              Belum ada catatan. Tambahkan lewat formulir di atas.
            </p>
          )}
          {baris.map((r) => {
            const dibatalkan = (r.status || "").toLowerCase() === "batal";
            const ringkas = r._ringkas || { utama: "", sisi: "", nilai: null };
            return (
              <div key={r._baris} className={"flex items-start gap-3 py-3 " + (dibatalkan ? "opacity-50" : "")}>
                <span className="w-8 shrink-0 pt-0.5 font-mono text-xs tabular-nums text-slate-300">
                  {r._baris}
                </span>
                <div className="min-w-0 flex-1">
                  <p className={"text-sm leading-snug " + (dibatalkan ? "line-through" : "")}>
                    {ringkas.utama}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">{ringkas.sisi}</p>
                </div>
                {ringkas.nilai != null && (
                  <span className="shrink-0 pt-0.5 font-mono text-sm tabular-nums">
                    {rp(ringkas.nilai)}
                  </span>
                )}
                {!dibatalkan && (
                  <div className="flex shrink-0 gap-2 pt-0.5">
                    <button onClick={() => suntingBaris(r)}
                            className="text-xs font-medium text-slate-600 hover:text-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600">
                      ubah
                    </button>
                    <button onClick={() => batalkan(r._baris, ringkas.utama)}
                            className="text-xs font-medium text-slate-400 hover:text-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600">
                      batalkan
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
