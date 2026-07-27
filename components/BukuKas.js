"use client";

import { useState, useMemo } from "react";
import { rp, tanggalPendek } from "@/lib/format";
import { Cip, Kosong } from "@/components/ui";

export default function BukuKas({ masuk, keluar, pos }) {
  const [tab, setTab] = useState("keluar");
  const [cari, setCari] = useState("");
  const [posAktif, setPosAktif] = useState(null);

  const namaPos = (id) => pos.find((p) => p.id === id)?.nama || id;

  const baris = useMemo(() => {
    const q = cari.trim().toLowerCase();
    const sumber = tab === "masuk" ? masuk : keluar;
    return sumber.filter((b) => {
      if (tab === "keluar" && posAktif && b.pos_id !== posAktif) return false;
      if (!q) return true;
      const gabung = [
        b.uraian, b.sumber, b.penanggung_jawab, tab === "keluar" ? namaPos(b.pos_id) : "",
      ].join(" ").toLowerCase();
      return gabung.includes(q);
    });
  }, [tab, cari, posAktif, masuk, keluar, pos]);

  const total = baris.reduce((a, b) => a + b.jumlah, 0);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex rounded-md border border-stone-300 p-0.5">
          {[["keluar", "Uang keluar"], ["masuk", "Uang masuk"]].map(([id, label]) => (
            <button
              key={id}
              onClick={() => { setTab(id); setPosAktif(null); }}
              className={
                "rounded px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 " +
                (tab === id ? "bg-slate-900 text-stone-50" : "text-slate-600 hover:bg-stone-100")
              }
            >
              {label}
            </button>
          ))}
        </div>
        <input
          value={cari}
          onChange={(e) => setCari(e.target.value)}
          placeholder="Cari keperluan, pos, atau penanggung jawab"
          className="flex-1 rounded-md border border-stone-300 px-3 py-1.5 text-sm placeholder:text-stone-400 focus:border-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
        />
      </div>

      {tab === "keluar" && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {pos.map((p) => (
            <button
              key={p.id}
              onClick={() => setPosAktif(posAktif === p.id ? null : p.id)}
              className={
                "rounded-full px-2.5 py-1 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 " +
                (posAktif === p.id
                  ? "bg-red-700 text-white"
                  : "bg-stone-100 text-slate-600 hover:bg-stone-200")
              }
            >
              {p.nama}
            </button>
          ))}
        </div>
      )}

      <div className="mt-4 divide-y divide-stone-200 border-t border-stone-200">
        {baris.length === 0 && <Kosong>Tidak ada catatan yang cocok. Coba kata kunci lain.</Kosong>}
        {baris.map((b, i) => (
          <div key={i} className="flex items-start gap-3 py-3">
            <span className="w-14 shrink-0 pt-0.5 font-mono text-xs tabular-nums text-slate-400">
              {tanggalPendek(b.tanggal)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm leading-snug">{b.uraian}</p>
              <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
                <span>{tab === "masuk" ? b.sumber : namaPos(b.pos_id)}</span>
                {tab === "keluar" && (
                  <>
                    <span className="text-stone-300">|</span>
                    <span>{b.penanggung_jawab}</span>
                    <Cip nada={b.nota ? "baik" : "ingat"}>
                      {b.nota ? "nota ada" : "nota menyusul"}
                    </Cip>
                  </>
                )}
              </p>
            </div>
            <span
              className={
                "shrink-0 pt-0.5 font-mono text-sm tabular-nums " +
                (tab === "masuk" ? "text-emerald-700" : "text-slate-900")
              }
            >
              {tab === "masuk" ? "+" : "\u2212"}{rp(b.jumlah).replace("Rp ", "")}
            </span>
          </div>
        ))}
      </div>

      {baris.length > 0 && (
        <div className="mt-3 flex items-baseline justify-between border-t-2 border-slate-900 pt-3">
          <span className="font-mono text-[11px] uppercase tracking-widest text-slate-500">
            Jumlah {baris.length} catatan
          </span>
          <span className="font-mono text-base font-bold tabular-nums">{rp(total)}</span>
        </div>
      )}
    </div>
  );
}
