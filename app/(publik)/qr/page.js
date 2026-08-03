import Link from "next/link";
import KodeQR, { TombolCetak } from "@/components/KodeQR";
import { AdeganBalapKarung } from "@/components/AnimasiLomba";
import { Konfeti, Kerlip, LogoHUT } from "@/components/Dekor";
import { Eyebrow } from "@/components/ui";

export const metadata = {
  title: "Poster QR Pendaftaran Lomba — HUT RI ke-81 Kavling AL",
  description: "Pindai kode QR untuk langsung membuka formulir pendaftaran lomba tujuh belasan.",
};

/*
 * Poster QR untuk ditempel di pos ronda, musala, dan grup WhatsApp.
 * Warga cukup memindai — langsung masuk ke formulir /lomba.
 */
export default function HalamanQR() {
  return (
    <main className="mx-auto max-w-4xl px-3 py-6 sm:px-6">
      <section className="animate-muncul overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xl shadow-red-100">

        {/* kepala poster */}
        <div className="relative bg-gradient-to-br from-merah via-merah-tua to-merah-pekat p-6 text-center text-white sm:p-8">
          <Konfeti />
          <Kerlip />
          <div className="relative flex flex-col items-center">
            <LogoHUT lebar="w-28 sm:w-32" className="animate-melayang" />
            <Eyebrow className="mt-4 text-amber-200">✦ 17 Agustus 2026 · HUT RI ke-81 ✦</Eyebrow>
            <h1 className="mt-2 font-serif text-3xl font-bold drop-shadow sm:text-5xl">
              Ayo Ikut Lomba <span className="text-amber-300">Tujuh Belasan!</span>
            </h1>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-red-50">
              Balap karung, panjat pinang, tarik tambang, dan banyak lagi —
              untuk warga Cluster Dahlia, Paguyuban Camar Guyub, dan Paguyuban Kav. AL.
            </p>
          </div>
        </div>

        {/* isi poster */}
        <div className="p-6 sm:p-8">
          <div className="grid items-center gap-8 sm:grid-cols-[auto,1fr]">
            <KodeQR path="/lomba" />

            <div>
              <h2 className="font-serif text-2xl font-bold">
                Pindai, isi, selesai. <span className="inline-block animate-goyang">📱</span>
              </h2>
              <ol className="mt-4 space-y-3">
                {[
                  ["1", "Arahkan kamera HP ke kode QR di samping."],
                  ["2", "Isi nama, nomor WhatsApp, dan centang lombanya — boleh lebih dari satu."],
                  ["3", "Kirim — panitia akan menghubungi sebelum hari H."],
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
                Gratis untuk sebagian besar lomba. Satu orang boleh ikut beberapa
                lomba sekaligus dalam sekali daftar. Pendaftaran ditutup bila kuota penuh.
              </p>
            </div>
          </div>

          {/* adegan balap karung sebagai penyemangat — tak ikut tercetak */}
          <div className="mt-6 print:hidden">
            <AdeganBalapKarung />
          </div>
        </div>

        {/* kaki poster */}
        <div className="strip-merah-putih h-2" aria-hidden />
      </section>

      <div className="animate-muncul jeda-1 mt-5 flex flex-wrap items-center justify-center gap-4 print:hidden">
        <TombolCetak />
        <Link
          href="/lomba"
          className="text-sm font-semibold text-merah-tua hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-merah"
        >
          Atau buka formulirnya langsung &rarr;
        </Link>
      </div>

      <p className="animate-muncul jeda-2 mt-4 text-center text-xs text-slate-500 print:hidden">
        Tempel poster ini di pos ronda, musala, atau bagikan tangkapan layarnya ke grup WhatsApp.
      </p>
    </main>
  );
}
