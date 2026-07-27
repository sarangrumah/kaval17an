"use client";

import { useEffect, useState } from "react";

const HARI_H = new Date("2026-08-17T07:00:00+07:00").getTime();

function pecah(ms) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return {
    hari: Math.floor(s / 86400),
    jam: Math.floor((s % 86400) / 3600),
    menit: Math.floor((s % 3600) / 60),
    detik: s % 60,
  };
}

function Kotak({ nilai, label, utama = false }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={
          "grid min-w-[3.4rem] place-items-center rounded-xl px-2 py-2.5 font-mono font-bold tabular-nums shadow-lg ring-1 sm:min-w-[4.2rem] sm:py-3 " +
          (utama
            ? "animate-detak bg-white text-2xl text-merah-tua ring-white/60 sm:text-4xl"
            : "bg-white/10 text-2xl text-white ring-white/20 backdrop-blur-sm sm:text-4xl")
        }
      >
        {String(nilai).padStart(2, "0")}
      </div>
      <span className="mt-1.5 font-mono text-[10px] uppercase tracking-widest text-red-100/80">
        {label}
      </span>
    </div>
  );
}

export default function HitungMundur() {
  const [sisa, setSisa] = useState(null);

  useEffect(() => {
    const hitung = () => setSisa(HARI_H - Date.now());
    hitung();
    const id = setInterval(hitung, 1000);
    return () => clearInterval(id);
  }, []);

  // Sebelum terpasang di browser, tampilkan strip kosong agar tidak lompat.
  const w = pecah(sisa ?? 0);
  const siap = sisa !== null;
  const sudahLewat = siap && sisa <= 0;

  if (sudahLewat) {
    return (
      <p className="animate-detak font-serif text-3xl font-bold text-white sm:text-4xl">
        MERDEKA! 🇮🇩
      </p>
    );
  }

  return (
    <div className={"flex items-start gap-2 sm:gap-3 " + (siap ? "" : "opacity-0")} aria-live="off">
      <Kotak nilai={w.hari} label="hari" utama />
      <span className="pt-2 text-xl font-bold text-white/50 sm:pt-3">:</span>
      <Kotak nilai={w.jam} label="jam" />
      <span className="pt-2 text-xl font-bold text-white/50 sm:pt-3">:</span>
      <Kotak nilai={w.menit} label="menit" />
      <span className="pt-2 text-xl font-bold text-white/50 sm:pt-3">:</span>
      <Kotak nilai={w.detik} label="detik" />
    </div>
  );
}
