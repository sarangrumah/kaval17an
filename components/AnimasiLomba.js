/*
 * Adegan lomba anak-anak khas tujuh belasan — murni SVG + CSS,
 * aman dirender di server. Keyframes-nya ada di globals.css.
 */

const KULIT = "#F2C29B";
const RAMBUT = "#3B2B20";
const CELANA = "#33475C";

/** Bocah bersorak di dalam karung goni, lengkap dengan nomor dada. */
function BocahKarung({ baju = "#ED1C24", nomor = 1 }) {
  return (
    <svg viewBox="0 0 60 96" className="h-full w-full">
      {/* lengan sorak */}
      <path d="M21 34 Q10 26 11 15" fill="none" stroke={KULIT} strokeWidth="5" strokeLinecap="round" />
      <path d="M39 34 Q50 26 49 15" fill="none" stroke={KULIT} strokeWidth="5" strokeLinecap="round" />
      <circle cx="11" cy="13" r="3.5" fill={KULIT} />
      <circle cx="49" cy="13" r="3.5" fill={KULIT} />
      {/* badan */}
      <rect x="19" y="27" width="22" height="27" rx="7" fill={baju} stroke="#00000022" />
      <rect x="24" y="34" width="12" height="10" rx="2" fill="#fff" stroke="#d6d3d1" />
      <text x="30" y="42" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#8F0F14">{nomor}</text>
      {/* kepala */}
      <circle cx="30" cy="15" r="9.5" fill={KULIT} />
      <path d="M20.5 15 a9.5 9.5 0 0 1 19 0 z" fill={RAMBUT} />
      <circle cx="26.5" cy="17" r="1.2" fill="#333" />
      <circle cx="33.5" cy="17" r="1.2" fill="#333" />
      <path d="M26 20.5 Q30 23.5 34 20.5" fill="none" stroke="#333" strokeWidth="1.3" strokeLinecap="round" />
      {/* karung goni */}
      <path d="M14 50 L46 50 L42 91 Q30 96 18 91 Z" fill="#C68A3F" stroke="#9C6A2E" strokeWidth="1.5" />
      <rect x="12.5" y="46" width="35" height="7" rx="2.5" fill="#A9752F" />
      <path d="M22 58 Q24 70 22 82 M38 58 Q36 70 38 82" fill="none" stroke="#9C6A2E" strokeWidth="1.2" />
    </svg>
  );
}

/** Bocah memeluk tiang: kedua tangan meraih ke atas, kaki melilit. */
function BocahPanjat({ baju = "#ED1C24" }) {
  return (
    <svg viewBox="0 0 44 64" className="h-full w-full">
      <path d="M16 28 Q12 16 15 7" fill="none" stroke={KULIT} strokeWidth="5" strokeLinecap="round" />
      <path d="M28 28 Q32 16 29 7" fill="none" stroke={KULIT} strokeWidth="5" strokeLinecap="round" />
      <circle cx="15" cy="6" r="3.2" fill={KULIT} />
      <circle cx="29" cy="6" r="3.2" fill={KULIT} />
      <rect x="13" y="22" width="18" height="22" rx="6" fill={baju} stroke="#00000022" />
      <circle cx="22" cy="14" r="8" fill={KULIT} />
      <path d="M14 14 a8 8 0 0 1 16 0 z" fill={RAMBUT} />
      <circle cx="19" cy="15.5" r="1.1" fill="#333" />
      <circle cx="25" cy="15.5" r="1.1" fill="#333" />
      <path d="M19 18.5 Q22 21 25 18.5" fill="none" stroke="#333" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M17 43 Q8 50 13 58" fill="none" stroke={CELANA} strokeWidth="6" strokeLinecap="round" />
      <path d="M27 43 Q36 50 31 58" fill="none" stroke={CELANA} strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

/** Bocah kuda-kuda menarik tambang ke arah kanan (tim kanan cukup dicerminkan). */
function BocahTarik({ baju = "#ED1C24" }) {
  return (
    <svg viewBox="0 0 70 70" className="h-full w-full">
      {/* kaki kuda-kuda */}
      <path d="M32 45 L20 63" stroke={CELANA} strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M38 45 L48 62" stroke={CELANA} strokeWidth="6" fill="none" strokeLinecap="round" />
      {/* badan condong ke belakang */}
      <rect x="24" y="18" width="17" height="30" rx="7" fill={baju} stroke="#00000022" transform="rotate(-16 32 33)" />
      {/* lengan menggenggam tambang */}
      <path d="M38 26 L62 32" stroke={KULIT} strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M36 33 L60 38" stroke={KULIT} strokeWidth="5" fill="none" strokeLinecap="round" />
      <circle cx="62" cy="32" r="3.4" fill={KULIT} />
      <circle cx="60" cy="38" r="3.4" fill={KULIT} />
      {/* kepala */}
      <circle cx="26" cy="13" r="8.5" fill={KULIT} />
      <path d="M17.5 13 a8.5 8.5 0 0 1 17 0 z" fill={RAMBUT} />
      <circle cx="24" cy="14.5" r="1.1" fill="#333" />
      <circle cx="30" cy="14.5" r="1.1" fill="#333" />
      <path d="M25 18 Q28 20 31 17.5" stroke="#333" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/** Bendera finis kotak-kotak di ujung lintasan. */
function BenderaFinis() {
  return (
    <svg viewBox="0 0 34 64" className="h-full w-full">
      <rect x="4" y="2" width="3" height="60" rx="1.5" fill="#78716C" />
      <g className="origin-left animate-kibar">
        <rect x="7" y="4" width="24" height="16" fill="#fff" stroke="#a8a29e" strokeWidth="0.8" />
        <rect x="11" y="4" width="4" height="4" fill="#292524" />
        <rect x="19" y="4" width="4" height="4" fill="#292524" />
        <rect x="27" y="4" width="4" height="4" fill="#292524" />
        <rect x="7" y="8" width="4" height="4" fill="#292524" />
        <rect x="15" y="8" width="4" height="4" fill="#292524" />
        <rect x="23" y="8" width="4" height="4" fill="#292524" />
        <rect x="11" y="12" width="4" height="4" fill="#292524" />
        <rect x="19" y="12" width="4" height="4" fill="#292524" />
        <rect x="27" y="12" width="4" height="4" fill="#292524" />
        <rect x="7" y="16" width="4" height="4" fill="#292524" />
        <rect x="15" y="16" width="4" height="4" fill="#292524" />
        <rect x="23" y="16" width="4" height="4" fill="#292524" />
      </g>
    </svg>
  );
}

/** Hadiah kecil yang tergantung di lingkaran puncak pinang. */
function Hadiah({ warna = "#ED1C24", pita = "#FBBF24" }) {
  return (
    <svg viewBox="0 0 20 24" className="h-full w-full">
      <line x1="10" y1="0" x2="10" y2="7" stroke="#78350F" strokeWidth="1.2" />
      <rect x="3" y="7" width="14" height="14" rx="2" fill={warna} stroke="#00000022" />
      <rect x="8.5" y="7" width="3" height="14" fill={pita} />
      <rect x="3" y="12.5" width="14" height="3" fill={pita} />
    </svg>
  );
}

/** Balap karung tiga lajur dengan lintasan berperspektif (kesan 3D). */
export function AdeganBalapKarung({ className = "" }) {
  // Lajur belakang lebih kecil, lebih tinggi, dan lebih lambat — ilusi kedalaman.
  const pelari = [
    { baju: "#F59E0B", nomor: 3, posisi: "bottom-16", ukuran: "h-12 w-8", dur: "13s", jeda: "-7s", hop: "0.95s" },
    { baju: "#ffffff", nomor: 2, posisi: "bottom-9", ukuran: "h-16 w-10", dur: "11s", jeda: "-3s", hop: "0.85s" },
    { baju: "#ED1C24", nomor: 1, posisi: "bottom-2", ukuran: "h-20 w-12", dur: "9.5s", jeda: "0s", hop: "0.78s" },
  ];

  return (
    <div className={"scene-3d relative h-48 overflow-hidden rounded-xl bg-gradient-to-b from-sky-200 via-sky-100 to-emerald-100 sm:h-56 " + className} aria-hidden>
      {/* matahari & awan */}
      <div className="absolute right-6 top-4 h-10 w-10 rounded-full bg-amber-300/90 shadow-[0_0_24px_6px_rgba(252,211,77,0.55)]" />
      <div className="absolute left-8 top-6 h-4 w-16 rounded-full bg-white/80 blur-[1px]" />
      <div className="absolute left-1/2 top-12 h-3 w-12 rounded-full bg-white/70 blur-[1px]" />

      {/* lintasan rumput yang direbahkan */}
      <div className="lintasan-3d absolute -left-[20%] bottom-0 h-[170%] w-[140%]" />

      {/* bendera finis */}
      <div className="absolute bottom-6 right-4 h-16 w-9 sm:right-6">
        <BenderaFinis />
      </div>

      {pelari.map((p) => (
        <div
          key={p.nomor}
          className={"animasi-lintas absolute w-full " + p.posisi}
          style={{ animationDuration: p.dur, animationDelay: p.jeda }}
        >
          <div className={"relative " + p.ukuran}>
            <div
              className="animasi-bayang absolute -bottom-1 left-0 h-1.5 w-full rounded-full bg-emerald-900"
              style={{ animationDuration: p.hop }}
            />
            <div className="animasi-lompat h-full w-full" style={{ animationDuration: p.hop }}>
              <BocahKarung baju={p.baju} nomor={p.nomor} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/** Panjat pinang: dua bocah jadi pondasi, satu memanjat meraih hadiah. */
export function AdeganPanjatPinang({ className = "" }) {
  return (
    <div className={"relative h-72 overflow-hidden rounded-xl bg-gradient-to-b from-sky-200 via-amber-50 to-emerald-100 " + className} aria-hidden>
      <div className="absolute left-5 top-5 h-9 w-9 rounded-full bg-amber-300/90 shadow-[0_0_20px_5px_rgba(252,211,77,0.5)]" />
      <div className="absolute right-8 top-8 h-3 w-14 rounded-full bg-white/80 blur-[1px]" />

      {/* tanah */}
      <div className="absolute inset-x-0 bottom-0 h-8 bg-emerald-300/80" />
      <div className="absolute inset-x-0 bottom-6 h-2 rounded-full bg-emerald-400/60 blur-[2px]" />

      {/* tiang pinang berminyak */}
      <div className="absolute bottom-8 left-1/2 h-56 w-3 -translate-x-1/2 rounded-t-full bg-gradient-to-b from-amber-700 via-amber-800 to-amber-950 shadow-sm" />

      {/* bendera di puncak */}
      <div className="absolute left-1/2 top-2 -ml-0.5 flex items-start">
        <span className="block h-8 w-[3px] rounded-full bg-amber-900" />
        <span className="-ml-px inline-block origin-left animate-kibar overflow-hidden rounded-r-sm shadow-sm">
          <span className="block h-2.5 w-7 bg-merah" />
          <span className="block h-2.5 w-7 bg-white" />
        </span>
      </div>

      {/* lingkaran hadiah yang bergoyang — penempatan pakai margin
          supaya tidak ditimpa transform milik animasi */}
      <div className="absolute left-1/2 top-9 -ml-16 w-32">
        <div className="animate-goyang" style={{ transformOrigin: "top center" }}>
          <div className="mx-auto h-2.5 w-full rounded-full bg-amber-700 shadow" />
          <div className="mt-0 flex justify-between px-1">
            <span className="h-6 w-5"><Hadiah warna="#ED1C24" /></span>
            <span className="h-7 w-5"><Hadiah warna="#0EA5E9" pita="#fff" /></span>
            <span className="h-6 w-5"><Hadiah warna="#10B981" /></span>
            <span className="h-7 w-5"><Hadiah warna="#8F0F14" /></span>
          </div>
        </div>
      </div>

      {/* pondasi piramida */}
      <div className="absolute bottom-7 left-1/2 -ml-5 h-14 w-10"><BocahPanjat baju="#0EA5E9" /></div>
      <div className="absolute bottom-[54px] left-1/2 -ml-5 h-14 w-10"><BocahPanjat baju="#F59E0B" /></div>

      {/* pemanjat yang naik-turun */}
      <div className="absolute bottom-[100px] left-1/2 -ml-5 h-14 w-10">
        <div className="animasi-panjat h-full w-full">
          <BocahPanjat baju="#ED1C24" />
        </div>
      </div>
    </div>
  );
}

/** Tarik tambang dua tim; seluruh formasi tertarik kiri-kanan bergantian. */
export function AdeganTarikTambang({ className = "" }) {
  return (
    <div className={"relative h-72 overflow-hidden rounded-xl bg-gradient-to-b from-sky-200 via-sky-100 to-emerald-100 " + className} aria-hidden>
      <div className="absolute right-5 top-5 h-9 w-9 rounded-full bg-amber-300/90 shadow-[0_0_20px_5px_rgba(252,211,77,0.5)]" />
      <div className="absolute left-8 top-9 h-3 w-14 rounded-full bg-white/80 blur-[1px]" />

      {/* tanah dan garis batas tengah */}
      <div className="absolute inset-x-0 bottom-0 h-8 bg-emerald-300/80" />
      <div className="absolute bottom-0 left-1/2 h-10 w-1 -translate-x-1/2 bg-white/90" />

      <div className="animasi-tarik absolute inset-0">
        {/* tambang — tingginya disetel pas dengan tangan para penarik */}
        <div className="absolute left-[4%] right-[4%] top-[214px] h-1.5 rounded-full bg-amber-700 shadow-sm" />
        {/* pita penanda tengah */}
        <div className="absolute left-1/2 top-[215px] -translate-x-1/2">
          <div className="h-4 w-0.5 bg-amber-900" />
          <svg viewBox="0 0 14 10" className="h-3 w-4 animate-goyang" style={{ transformOrigin: "top center" }}>
            <path d="M0 0 H14 L7 10 Z" fill="#ED1C24" />
          </svg>
        </div>

        {/* tim kiri (menarik ke kiri, menghadap tengah) */}
        <div className="absolute bottom-10 left-[2%] flex">
          {["#ED1C24", "#ffffff", "#ED1C24"].map((warna, i) => (
            <div
              key={i}
              className={"animasi-hentak h-16 w-16 " + (i > 0 ? "-ml-5" : "")}
              style={{ animationDelay: `${i * 0.22}s` }}
            >
              <BocahTarik baju={warna} />
            </div>
          ))}
        </div>

        {/* tim kanan (cermin tim kiri) */}
        <div className="absolute bottom-10 right-[2%] flex -scale-x-100">
          {["#0EA5E9", "#ffffff", "#0EA5E9"].map((warna, i) => (
            <div
              key={i}
              className={"animasi-hentak h-16 w-16 " + (i > 0 ? "-ml-5" : "")}
              style={{ animationDelay: `${i * 0.22 + 0.5}s` }}
            >
              <BocahTarik baju={warna} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
