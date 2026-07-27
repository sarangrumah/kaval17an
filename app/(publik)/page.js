import Link from "next/link";
import HitungMundur from "@/components/HitungMundur";
import { Konfeti, Kerlip, LogoHUT, PitaMerdeka } from "@/components/Dekor";
import { Eyebrow, Kartu, Judul, Bilah, DataGagal } from "@/components/ui";
import { ambilSemua } from "@/lib/data";
import { rp, tanggalPendek } from "@/lib/format";

export const revalidate = 60;

export default async function Beranda() {
  const d = await ambilSemua();
  if (d.gagal) return (<main className="mx-auto max-w-4xl px-3 py-6 sm:px-6"><DataGagal /></main>);
  const lombaDibuka = d.rincianLomba.filter((l) => !l.penuh).length;
  const agendaDekat = d.jadwal.slice(0, 3);

  return (
    <main className="mx-auto max-w-4xl px-3 py-6 sm:px-6">

      {/* Tesis acara: ini pertama kalinya tiga paguyuban jadi satu */}
      <header className="animate-muncul relative overflow-hidden rounded-2xl bg-gradient-to-br from-merah via-merah-tua to-merah-pekat text-white shadow-xl shadow-red-200">
        <Konfeti />
        <Kerlip />
        <div className="relative p-6 sm:p-10">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="max-w-xl">
              <Eyebrow className="text-amber-200">
                ✦ 17 Agustus 2026 &middot; HUT RI ke-81 ✦
              </Eyebrow>
              <h1 className="mt-3 font-serif text-3xl font-bold leading-tight drop-shadow sm:text-5xl">
                Tahun ini kita rayakan <span className="text-amber-300">bersama</span>.
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-red-50 sm:text-base">
                Untuk pertama kalinya Cluster Dahlia, Paguyuban Camar Guyub, dan
                Paguyuban Ka. AL menggelar satu perayaan. Satu karnaval, satu panggung,
                satu buku kas yang boleh dibaca siapa saja.
              </p>
            </div>
            <LogoHUT className="animate-melayang shrink-0" />
          </div>

          <div className="mt-8 border-t border-white/20 pt-6">
            <Eyebrow className="mb-3 text-red-100/80">Menuju detik-detik proklamasi</Eyebrow>
            <HitungMundur />
            <p className="mt-5 text-sm text-red-100">
              <span className="font-mono text-lg font-bold tabular-nums text-white">{d.totalPendaftar}</span>{" "}
              warga sudah mendaftar lomba. Jangan sampai ketinggalan!
            </p>
          </div>
        </div>
        <PitaMerdeka />
      </header>

      {/* Dua pintu utama */}
      <div className="mt-6 grid gap-5 sm:grid-cols-2">

        <Link
          href="/lomba"
          className="animate-muncul jeda-1 group relative overflow-hidden rounded-2xl border-2 border-stone-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-merah hover:shadow-xl hover:shadow-red-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-merah sm:p-7"
        >
          <span aria-hidden className="absolute -right-6 -top-6 text-7xl opacity-10 transition-all duration-300 group-hover:rotate-12 group-hover:scale-125 group-hover:opacity-25">🏆</span>
          <Eyebrow className="text-merah-tua">Pintu 1</Eyebrow>
          <h2 className="mt-2 font-serif text-2xl font-bold">Daftar lomba</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Isi nama, nomor WhatsApp, dan pilih lombanya. Selesai dalam satu menit,
            tanpa perlu datang ke sekretariat.
          </p>
          <div className="mt-5 border-t border-stone-200 pt-4">
            <p className="font-mono text-2xl font-bold tabular-nums text-merah-tua">{lombaDibuka}</p>
            <Eyebrow className="mt-1 text-slate-500">lomba masih terbuka</Eyebrow>
          </div>
          <p className="mt-4 text-sm font-semibold text-merah-tua">
            Buka daftar lomba{" "}
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">&rarr;</span>
          </p>
        </Link>

        <Link
          href="/keuangan"
          className="animate-muncul jeda-2 group relative overflow-hidden rounded-2xl border-2 border-stone-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-merah hover:shadow-xl hover:shadow-red-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-merah sm:p-7"
        >
          <span aria-hidden className="absolute -right-6 -top-6 text-7xl opacity-10 transition-all duration-300 group-hover:-rotate-12 group-hover:scale-125 group-hover:opacity-25">💰</span>
          <Eyebrow className="text-merah-tua">Pintu 2</Eyebrow>
          <h2 className="mt-2 font-serif text-2xl font-bold">Anggaran &amp; kas</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Rencana belanja, realisasinya, dan setiap catatan uang masuk maupun
            keluar &mdash; lengkap dengan penanggung jawabnya.
          </p>
          <div className="mt-5 border-t border-stone-200 pt-4">
            <p className="font-mono text-2xl font-bold tabular-nums text-merah-tua">{rp(d.saldo)}</p>
            <Eyebrow className="mt-1 text-slate-500">sisa saldo hari ini</Eyebrow>
            <div className="mt-3">
              <Bilah persen={d.persenTerpakai} />
              <p className="mt-2 font-mono text-[11px] tabular-nums text-slate-500">
                {d.persenTerpakai}% dari pagu {rp(d.totalPagu)} terpakai
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm font-semibold text-merah-tua">
            Lihat laporan kas{" "}
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">&rarr;</span>
          </p>
        </Link>
      </div>

      {/* Agenda terdekat */}
      <Kartu className="animate-muncul jeda-3 mt-5">
        <div className="flex items-baseline justify-between gap-3">
          <Judul>Agenda terdekat</Judul>
          <Link
            href="/jadwal"
            className="group text-sm font-semibold text-merah-tua hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-merah"
          >
            Rundown lengkap{" "}
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
          </Link>
        </div>
        <div className="mt-4 divide-y divide-stone-200 border-t border-stone-200">
          {agendaDekat.length === 0 && (
            <p className="py-6 text-sm text-slate-500">
              Rundown sedang disusun panitia. Cek lagi beberapa hari ke depan.
            </p>
          )}
          {agendaDekat.map((j, i) => (
            <div key={i} className="flex items-start gap-3 py-3 transition-colors hover:bg-red-50/60">
              <span className="w-14 shrink-0 pt-0.5 font-mono text-xs tabular-nums text-merah-tua">
                {tanggalPendek(j.tanggal)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm leading-snug">{j.agenda}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {j.waktu} &middot; {j.lokasi}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Kartu>

      <footer className="animate-muncul jeda-4 mt-5 rounded-2xl border border-stone-200 bg-white p-5 text-sm leading-relaxed text-slate-600 shadow-sm sm:p-7">
        <p>
          Halaman ini dikelola Panitia HUT RI ke-81 Kavling AL. Ada pertanyaan,
          koreksi angka, atau usulan lomba? Sampaikan lewat grup WhatsApp paguyuban
          masing-masing. 🇮🇩
        </p>
        <div className="mt-4 flex items-center justify-between border-t border-stone-200 pt-4">
          <Eyebrow className="text-slate-400">Diperbarui otomatis tiap menit</Eyebrow>
          <Link href="/login" className="text-xs text-slate-400 transition-colors hover:text-merah-tua">
            Masuk panitia
          </Link>
        </div>
      </footer>
    </main>
  );
}
