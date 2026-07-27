"use client";

/*
 * Bendera dinaikkan dari dasar tiang mengikuti persentase progres, seperti
 * upacara. Karena loading.js Next.js tidak menerima progres asli dari server,
 * angka ini disimulasikan: cepat di awal lalu melambat mendekati 100% sampai
 * halaman sesungguhnya menggantikan tampilan ini.
 */
import { useEffect, useState } from "react";

const TINGGI_BENDERA = "2.5rem"; // dua strip @ h-5 (1.25rem)

export default function BenderaLoading({ judul, keterangan }) {
  const [progres, setProgres] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setProgres((p) => Math.min(99, p + Math.max(0.4, (99 - p) * 0.055)));
    }, 100);
    return () => clearInterval(id);
  }, []);

  const persen = Math.round(progres);

  return (
    <div className="flex flex-col items-center text-center">
      <span className="relative block h-44" aria-hidden>
        {/* Kenop puncak tiang */}
        <span className="absolute -top-1.5 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-amber-500 shadow" />
        {/* Tiang */}
        <span className="block h-full w-1 rounded-full bg-amber-400 shadow" />
        {/* Dasar tiang */}
        <span className="absolute -bottom-1 left-1/2 h-1.5 w-6 -translate-x-1/2 rounded-full bg-stone-300" />
        {/* Bendera, naik dari dasar tiang mengikuti progres */}
        <span
          className="absolute left-[3px] inline-block origin-left animate-kibar overflow-hidden rounded-r-sm shadow-lg transition-[bottom] duration-150 ease-out"
          style={{
            bottom: `calc((100% - ${TINGGI_BENDERA}) * ${progres / 100})`,
          }}
        >
          <span className="block h-5 w-14 bg-merah" />
          <span className="block h-5 w-14 bg-white ring-1 ring-inset ring-stone-200" />
        </span>
      </span>
      <p className="mt-6 font-serif text-lg font-bold text-slate-800">
        {judul} {persen}%
      </p>
      {keterangan ? (
        <p className="mt-1 text-sm text-slate-500">{keterangan}</p>
      ) : null}
    </div>
  );
}
