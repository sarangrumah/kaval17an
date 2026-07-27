/* Dekorasi tujuh belasan — murni CSS, aman dirender di server. */

/** Untaian bendera segitiga merah-putih yang bergoyang pelan. */
export function Bunting({ jumlah = 24 }) {
  return (
    <div aria-hidden className="pointer-events-none flex justify-center overflow-hidden">
      {Array.from({ length: jumlah }, (_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 30"
          className="h-6 w-7 shrink-0 animate-goyang drop-shadow-sm sm:h-7 sm:w-8"
          style={{ animationDelay: `${(i % 6) * 0.35}s`, transformOrigin: "top center" }}
        >
          <path d="M1 0 H23 L12 29 Z" fill={i % 2 === 0 ? "#ED1C24" : "#ffffff"} stroke="#d6d3d1" strokeWidth="1" />
        </svg>
      ))}
    </div>
  );
}

/** Bendera merah-putih kecil di tiang, berkibar. */
export function BenderaKecil({ className = "" }) {
  return (
    <span aria-hidden className={"inline-flex items-end " + className}>
      <span className="h-9 w-[3px] rounded-full bg-amber-300" />
      <span className="-ml-px inline-block origin-left animate-kibar overflow-hidden rounded-r-sm shadow-md">
        <span className="block h-3 w-8 bg-merah" />
        <span className="block h-3 w-8 bg-white" />
      </span>
    </span>
  );
}

/* Posisi konfeti dibuat tetap (bukan acak) agar render server dan browser sama. */
const KONFETI = [
  [4, 0, 2.8], [11, 1.6, 3.4], [19, 0.7, 2.6], [27, 2.3, 3.8], [34, 0.2, 3.1],
  [42, 1.2, 2.7], [49, 2.8, 3.5], [57, 0.5, 2.9], [64, 1.9, 3.7], [72, 0.9, 2.6],
  [79, 2.5, 3.3], [86, 0.3, 2.8], [93, 1.4, 3.6], [15, 3.1, 4.1], [46, 3.6, 4.3],
  [68, 3.3, 4.0], [88, 3.9, 4.4], [30, 4.2, 3.9], [8, 4.6, 4.2], [60, 4.9, 4.5],
];
const WARNA_KONFETI = ["bg-white", "bg-red-300", "bg-amber-300", "bg-white", "bg-red-200"];

/** Hujan konfeti pelan di dalam wadah ber-position:relative + overflow-hidden. */
export function Konfeti() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {KONFETI.map(([kiri, jeda, durasi], i) => (
        <span
          key={i}
          className={
            "absolute -top-3 block animate-jatuh rounded-[2px] opacity-70 " +
            WARNA_KONFETI[i % WARNA_KONFETI.length] +
            (i % 3 === 0 ? " h-2.5 w-1.5" : " h-1.5 w-2.5")
          }
          style={{ left: `${kiri}%`, animationDelay: `${jeda}s`, animationDuration: `${durasi + 3}s` }}
        />
      ))}
    </div>
  );
}

/** Kerlip bintang kecil untuk latar gelap. */
export function Kerlip() {
  const titik = [
    [6, 18, 0], [14, 68, 0.8], [88, 22, 0.4], [93, 62, 1.3], [78, 82, 0.2],
    [25, 88, 1.7], [55, 8, 1.0], [70, 14, 2.0],
  ];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {titik.map(([x, y, jeda], i) => (
        <span
          key={i}
          className="absolute block h-1 w-1 animate-kelip rounded-full bg-amber-200"
          style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${jeda}s` }}
        />
      ))}
    </div>
  );
}

/** Logo resmi HUT ke-81 RI di panel putih (sesuai pedoman: logo di latar terang). */
export function LogoHUT({ className = "", lebar = "w-36 sm:w-44" }) {
  return (
    <span className={"inline-block rounded-xl bg-white p-3 shadow-lg ring-1 ring-stone-200 " + lebar + " " + className}>
      {/* SVG resmi Setneg — jangan diubah warnanya, cukup ganti berkas bila ada pembaruan */}
      <img src="/logo-hut-ri-81.svg" alt="Logo resmi HUT ke-81 Republik Indonesia" className="h-auto w-full" />
    </span>
  );
}

/** Pita teks berjalan bertema — MERDEKA! */
export function PitaMerdeka() {
  const teks = "MERDEKA! ✦ HUT KE-81 REPUBLIK INDONESIA ✦ INDONESIA BERDAULAT, ADIL & MAKMUR ✦ ";
  return (
    <div aria-hidden className="overflow-hidden border-y border-red-800 bg-merah-tua py-1.5">
      <div className="flex w-max animate-geser whitespace-nowrap font-mono text-[11px] uppercase tracking-widest text-red-100">
        <span className="pr-4">{teks.repeat(4)}</span>
        <span className="pr-4">{teks.repeat(4)}</span>
      </div>
    </div>
  );
}
