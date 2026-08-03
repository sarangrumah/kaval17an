"use client";

import { useEffect, useState } from "react";
import { Konfeti, Kerlip } from "@/components/Dekor";

/*
 * Panggung pengumuman juara pawai. Tiap kategori punya tombol pemicunya
 * sendiri supaya MC bisa mengatur tempo di atas panggung: drumroll tiga
 * hitungan, nominator diungkap satu-satu dari peringkat bawah, lalu
 * juaranya meletup ditaburi konfeti.
 */

const MEDALI = ["🥇", "🥈", "🥉", "4", "5", "6", "7"];

function PanggungKategori({ kategori, papan, ikon }) {
  // langkah: -1 diam · 0-2 drumroll (3,2,1) · 3.. ungkap dari peringkat buncit
  const [langkah, setLangkah] = useState(-1);
  const jumlah = papan.length;
  const langkahJuara = 2 + jumlah;
  const selesai = langkah >= langkahJuara;

  useEffect(() => {
    if (langkah < 0 || selesai) return;
    // Drumroll rapat; makin mendekati juara, jeda makin panjang biar tegang.
    const jeda = langkah < 3 ? 950 : langkah === langkahJuara - 1 ? 2400 : 1700;
    const id = setTimeout(() => setLangkah((l) => l + 1), jeda);
    return () => clearTimeout(id);
  }, [langkah, selesai, langkahJuara]);

  // Peringkat ke-i (0 = juara) tampil pada langkah 2 + (jumlah - i).
  const tampil = (i) => langkah >= 2 + (jumlah - i);
  const suaraMaks = Math.max(1, ...papan.map((n) => n.suara));

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-merah-pekat to-slate-900 p-5 text-white shadow-xl shadow-red-200 sm:p-7">
      <Kerlip />
      {selesai && <Konfeti />}

      <div className="relative">
        <p className="font-mono text-[11px] uppercase tracking-widest text-amber-300">
          ✦ Lomba Pawai Kemerdekaan ✦
        </p>
        <h3 className="mt-1 font-serif text-2xl font-bold sm:text-3xl">
          {ikon} {kategori}
        </h3>

        {jumlah === 0 && (
          <p className="mt-6 text-sm text-red-100">Nominasi kategori ini belum diisi panitia.</p>
        )}

        {jumlah > 0 && langkah === -1 && (
          <div className="mt-6 flex flex-col items-start gap-3">
            <p className="text-sm leading-relaxed text-red-100">
              {jumlah} nominator sudah dihitung suaranya. Siap mengungkap juaranya?
            </p>
            <button
              onClick={() => setLangkah(0)}
              className="animate-detak rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-6 py-3 font-serif text-lg font-bold text-slate-900 shadow-lg shadow-amber-900/40 transition-transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
            >
              🥁 Ungkap juaranya!
            </button>
          </div>
        )}

        {langkah >= 0 && langkah < 3 && (
          <div className="mt-6 flex flex-col items-center py-6">
            <span className="animate-gemetar text-7xl font-bold text-amber-300 sm:text-8xl">
              {3 - langkah}
            </span>
            <p className="mt-3 animate-detak font-mono text-xs uppercase tracking-widest text-red-100">
              🥁 drumroll…
            </p>
          </div>
        )}

        {langkah >= 3 && (
          <ol className="mt-6 grid gap-2.5">
            {papan.map((n, i) => {
              const juara = i === 0;
              if (!tampil(i)) {
                return (
                  <li
                    key={n.id}
                    className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white/50"
                  >
                    <span className="w-8 text-center text-lg">{MEDALI[i] || i + 1}</span>
                    <span className={"tracking-[0.3em] " + (langkah === 2 + (jumlah - i) - 1 ? "animate-gemetar" : "")}>
                      ? ? ? ? ?
                    </span>
                  </li>
                );
              }
              return (
                <li
                  key={n.id}
                  className={
                    juara
                      ? "animate-meletup relative rounded-xl border-2 border-amber-300 bg-gradient-to-r from-amber-400/95 to-amber-300/95 px-4 py-4 text-slate-900 shadow-lg shadow-amber-900/50"
                      : "animate-muncul flex items-center gap-3 rounded-xl border border-white/20 bg-white/10 px-4 py-3"
                  }
                >
                  {juara ? (
                    <div className="flex items-center gap-3">
                      <span className="text-4xl drop-shadow">👑</span>
                      <div className="min-w-0 flex-1">
                        <p className="font-mono text-[10px] uppercase tracking-widest text-amber-900">
                          Juara {kategori}
                        </p>
                        <p className="truncate font-serif text-xl font-bold sm:text-2xl">{n.nama}</p>
                        {n.deskripsi && (
                          <p className="mt-0.5 truncate text-xs text-amber-900/80">{n.deskripsi}</p>
                        )}
                      </div>
                      <span className="shrink-0 rounded-lg bg-slate-900/85 px-3 py-1.5 text-center font-mono text-white">
                        <span className="block text-lg font-bold leading-none">{n.suara}</span>
                        <span className="text-[9px] uppercase tracking-widest text-amber-300">suara</span>
                      </span>
                    </div>
                  ) : (
                    <>
                      <span className="w-8 shrink-0 text-center text-lg">{MEDALI[i] || i + 1}</span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{n.nama}</p>
                        <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/15">
                          <div
                            className="h-full rounded-full bg-red-300 transition-all duration-1000"
                            style={{ width: `${Math.round((n.suara / suaraMaks) * 100)}%` }}
                          />
                        </div>
                      </div>
                      <span className="shrink-0 font-mono text-sm tabular-nums text-red-100">
                        {n.suara} <span className="text-[10px] text-red-200/70">suara</span>
                      </span>
                    </>
                  )}
                </li>
              );
            })}
          </ol>
        )}

        {selesai && (
          <p className="mt-5 text-center font-serif text-lg font-bold text-amber-300">
            Selamat kepada sang juara! 🎉 MERDEKA!
          </p>
        )}
      </div>
    </section>
  );
}

export default function PengumumanPawai({ kategori, papan, totalSuara }) {
  const IKON = { "Sepeda Hias": "🚲", "Kustom Pawai": "🎭" };
  return (
    <div className="grid gap-5">
      <div className="animate-muncul text-center">
        <p className="font-mono text-[11px] uppercase tracking-widest text-red-700">
          Hasil voting warga · {totalSuara} suara masuk
        </p>
        <h2 className="mt-1 font-serif text-2xl font-bold sm:text-3xl">
          🏆 Pengumuman Juara Pawai
        </h2>
      </div>
      {kategori.map((k, i) => (
        <div key={k} className={"animate-muncul " + (i === 1 ? "jeda-2" : "jeda-1")}>
          <PanggungKategori kategori={k} papan={papan?.[k] || []} ikon={IKON[k] || "🏁"} />
        </div>
      ))}
    </div>
  );
}
