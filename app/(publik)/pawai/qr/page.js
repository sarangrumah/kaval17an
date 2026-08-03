import Link from "next/link";
import KodeQR, { TombolCetak } from "@/components/KodeQR";
import { Konfeti, Kerlip, LogoHUT } from "@/components/Dekor";
import { Eyebrow } from "@/components/ui";

export const metadata = {
  title: "Poster QR Voting Pawai — HUT RI ke-81 Kavling AL",
  description: "Pindai kode QR untuk memilih juara Sepeda Hias dan Kustom Pawai.",
};

/*
 * Poster QR voting untuk ditayangkan di layar panggung / dibagikan ke grup
 * WhatsApp begitu pentas seni dimulai. QR menuju /pawai; sebelum panitia
 * membuka voting, halaman itu masih berupa hitung mundur.
 */
export default function HalamanQRPawai() {
  return (
    <main className="mx-auto max-w-4xl px-3 py-6 sm:px-6">
      <section className="animate-muncul overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xl shadow-red-100">

        {/* kepala poster */}
        <div className="relative bg-gradient-to-br from-slate-900 via-merah-pekat to-slate-900 p-6 text-center text-white sm:p-8">
          <Konfeti />
          <Kerlip />
          <div className="relative flex flex-col items-center">
            <LogoHUT lebar="w-28 sm:w-32" className="animate-melayang" />
            <Eyebrow className="mt-4 text-amber-200">✦ Pentas seni · 17 Agustus 2026 ✦</Eyebrow>
            <h1 className="mt-2 font-serif text-3xl font-bold drop-shadow sm:text-5xl">
              Vote Juara <span className="text-amber-300">Pawai Kemerdekaan!</span>
            </h1>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-red-50">
              🚲 Sepeda Hias &middot; 🎭 Kustom Pawai &mdash; lima nominator per
              kategori. Juaranya ditentukan suara warga malam ini juga.
            </p>
          </div>
        </div>

        {/* isi poster */}
        <div className="p-6 sm:p-8">
          <div className="grid items-center gap-8 sm:grid-cols-[auto,1fr]">
            <KodeQR path="/pawai" />

            <div>
              <h2 className="font-serif text-2xl font-bold">
                Satu HP, satu suara. <span className="inline-block animate-goyang">🗳️</span>
              </h2>
              <ol className="mt-4 space-y-3">
                {[
                  ["1", "Arahkan kamera HP ke kode QR di samping."],
                  ["2", "Pilih satu jagoanmu di tiap kategori."],
                  ["3", "Tetap di halaman itu — pengumuman juara tampil di HP-mu juga."],
                ].map(([n, teks]) => (
                  <li key={n} className="flex items-start gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-merah font-mono text-sm font-bold text-white shadow-sm shadow-red-200">
                      {n}
                    </span>
                    <p className="pt-0.5 text-sm leading-relaxed text-slate-700">{teks}</p>
                  </li>
                ))}
              </ol>
              <p className="mt-4 text-xs leading-relaxed text-slate-500">
                Satu perangkat hanya bisa memilih sekali per kategori dan pilihan
                tidak bisa diganti. Voting ditutup sebelum pengumuman dari panggung.
              </p>
            </div>
          </div>
        </div>

        {/* kaki poster */}
        <div className="strip-merah-putih h-2" aria-hidden />
      </section>

      <div className="animate-muncul jeda-1 mt-5 flex flex-wrap items-center justify-center gap-4 print:hidden">
        <TombolCetak />
        <Link
          href="/pawai"
          className="text-sm font-semibold text-merah-tua hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-merah"
        >
          Atau buka halaman votingnya langsung &rarr;
        </Link>
      </div>

      <p className="animate-muncul jeda-2 mt-4 text-center text-xs text-slate-500 print:hidden">
        Tayangkan poster ini di layar panggung saat pentas seni dimulai, atau
        bagikan tangkapan layarnya ke grup WhatsApp.
      </p>
    </main>
  );
}
