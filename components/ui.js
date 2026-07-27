export function Eyebrow({ children, className = "" }) {
  return (
    <p className={"font-mono text-[11px] uppercase tracking-widest " + className}>{children}</p>
  );
}

export function Kartu({ children, className = "" }) {
  return (
    <section
      className={
        "rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-md sm:p-7 " +
        className
      }
    >
      {children}
    </section>
  );
}

export function Judul({ children, kecil = false }) {
  return (
    <h2 className={"font-serif font-bold " + (kecil ? "text-lg" : "text-xl sm:text-2xl")}>
      <span className="mr-2 inline-block h-2.5 w-2.5 rounded-sm bg-merah align-baseline" aria-hidden />
      {children}
    </h2>
  );
}

export function Bilah({ persen, lewat = false, tinggi = "h-1.5" }) {
  return (
    <div className={"w-full overflow-hidden rounded-full bg-stone-200 " + tinggi}>
      <div
        className={"h-full rounded-full transition-all duration-700 " + (lewat ? "bg-amber-500" : "bg-merah")}
        style={{ width: `${Math.min(100, Math.max(0, persen))}%` }}
      />
    </div>
  );
}

export function Cip({ nada = "netral", children }) {
  const gaya = {
    netral: "bg-stone-100 text-slate-700",
    baik: "bg-emerald-50 text-emerald-800",
    ingat: "bg-amber-50 text-amber-800",
    penting: "bg-red-50 text-red-800",
  }[nada];
  return (
    <span className={"rounded px-1.5 py-0.5 text-xs font-medium " + gaya}>{children}</span>
  );
}

export function Kosong({ children }) {
  return <p className="py-8 text-center text-sm text-slate-500">{children}</p>;
}

/**
 * Peringatan untuk halaman admin yang punya formulir tambah: pembacaan gagal,
 * tetapi editor tetap ditampilkan supaya panitia bisa terus mencatat.
 * Penulisan memakai request terpisah, jadi masih mungkin berhasil.
 */
export function DataGagalRingan() {
  return (
    <div className="mb-5 rounded-2xl border border-amber-300 bg-amber-50 p-4 sm:p-5">
      <p className="font-serif text-base font-bold text-amber-900">
        Daftar catatan belum bisa dibaca
      </p>
      <p className="mt-1 text-sm leading-relaxed text-amber-900">
        Halaman tidak berhasil membaca spreadsheet panitia, jadi catatan tersimpan
        belum bisa ditampilkan. Formulir tambah di bawah tetap bisa dipakai &mdash;
        catatan baru langsung ditulis ke spreadsheet. Muat ulang halaman untuk
        mencoba membaca lagi, atau hubungi pengurus bila terus berulang.
      </p>
    </div>
  );
}

export function DataGagal() {
  return (
    <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5 sm:p-7">
      <h2 className="font-serif text-lg font-bold text-amber-900">
        Data belum bisa ditampilkan
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-amber-900">
        Halaman tidak berhasil membaca spreadsheet panitia. Angka sengaja tidak
        ditampilkan supaya tidak ada yang salah baca. Coba muat ulang sebentar lagi,
        atau hubungi pengurus bila terus berulang.
      </p>
    </div>
  );
}
