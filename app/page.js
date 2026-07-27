import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import { Eyebrow, Kartu, Judul, Bilah, DataGagal } from "@/components/ui";
import { ambilSemua } from "@/lib/data";
import { rp, tanggalPendek } from "@/lib/format";

export const revalidate = 60;

const HARI_H = new Date("2026-08-17T07:00:00+07:00");

export default async function Beranda() {
  const d = await ambilSemua();
  if (d.gagal) return (<><SiteNav /><main className="mx-auto max-w-4xl px-3 py-6 sm:px-6"><DataGagal /></main></>);
  const sisaHari = Math.max(0, Math.ceil((HARI_H - new Date()) / 86400000));
  const lombaDibuka = d.rincianLomba.filter((l) => !l.penuh).length;
  const agendaDekat = d.jadwal.slice(0, 3);

  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-4xl px-3 py-6 sm:px-6">

        {/* Tesis acara: ini pertama kalinya tiga paguyuban jadi satu */}
        <header className="rounded-lg bg-slate-900 p-6 text-stone-50 shadow-lg sm:p-10">
          <Eyebrow className="text-red-400">
            17 Agustus 2026 &middot; HUT RI ke-81
          </Eyebrow>
          <h1 className="mt-3 font-serif text-3xl font-bold leading-tight sm:text-5xl">
            Tahun ini kita rayakan bersama.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
            Untuk pertama kalinya Cluster Dahlia, Paguyuban Camar Guyub, dan
            Paguyuban Ka. AL menggelar satu perayaan. Satu karnaval, satu panggung,
            satu buku kas yang boleh dibaca siapa saja.
          </p>
          <div className="mt-7 flex flex-wrap items-end gap-x-10 gap-y-4 border-t border-slate-700 pt-6">
            <div>
              <p className="font-mono text-4xl font-bold tabular-nums sm:text-5xl">{sisaHari}</p>
              <Eyebrow className="mt-1 text-slate-400">hari lagi</Eyebrow>
            </div>
            <div>
              <p className="font-mono text-4xl font-bold tabular-nums sm:text-5xl">
                {d.totalPendaftar}
              </p>
              <Eyebrow className="mt-1 text-slate-400">warga sudah mendaftar</Eyebrow>
            </div>
          </div>
        </header>

        {/* Dua pintu utama */}
        <div className="mt-5 grid gap-5 sm:grid-cols-2">

          <Link
            href="/lomba"
            className="group rounded-lg border border-stone-300 bg-white p-5 transition-colors hover:border-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 sm:p-7"
          >
            <Eyebrow className="text-red-700">Pintu 1</Eyebrow>
            <h2 className="mt-2 font-serif text-2xl font-bold">Daftar lomba</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Isi nama, nomor WhatsApp, dan pilih lombanya. Selesai dalam satu menit,
              tanpa perlu datang ke sekretariat.
            </p>
            <div className="mt-5 border-t border-stone-200 pt-4">
              <p className="font-mono text-2xl font-bold tabular-nums">{lombaDibuka}</p>
              <Eyebrow className="mt-1 text-slate-500">lomba masih terbuka</Eyebrow>
            </div>
            <p className="mt-4 text-sm font-medium text-red-700 group-hover:underline">
              Buka daftar lomba &rarr;
            </p>
          </Link>

          <Link
            href="/keuangan"
            className="group rounded-lg border border-stone-300 bg-white p-5 transition-colors hover:border-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 sm:p-7"
          >
            <Eyebrow className="text-red-700">Pintu 2</Eyebrow>
            <h2 className="mt-2 font-serif text-2xl font-bold">Anggaran &amp; kas</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Rencana belanja, realisasinya, dan setiap catatan uang masuk maupun
              keluar &mdash; lengkap dengan penanggung jawabnya.
            </p>
            <div className="mt-5 border-t border-stone-200 pt-4">
              <p className="font-mono text-2xl font-bold tabular-nums">{rp(d.saldo)}</p>
              <Eyebrow className="mt-1 text-slate-500">sisa saldo hari ini</Eyebrow>
              <div className="mt-3">
                <Bilah persen={d.persenTerpakai} />
                <p className="mt-2 font-mono text-[11px] tabular-nums text-slate-500">
                  {d.persenTerpakai}% dari pagu {rp(d.totalPagu)} terpakai
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm font-medium text-red-700 group-hover:underline">
              Lihat laporan kas &rarr;
            </p>
          </Link>
        </div>

        {/* Agenda terdekat */}
        <Kartu className="mt-5">
          <div className="flex items-baseline justify-between gap-3">
            <Judul>Agenda terdekat</Judul>
            <Link
              href="/jadwal"
              className="text-sm font-medium text-red-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
            >
              Rundown lengkap
            </Link>
          </div>
          <div className="mt-4 divide-y divide-stone-200 border-t border-stone-200">
            {agendaDekat.length === 0 && (
              <p className="py-6 text-sm text-slate-500">
                Rundown sedang disusun panitia. Cek lagi beberapa hari ke depan.
              </p>
            )}
            {agendaDekat.map((j, i) => (
              <div key={i} className="flex items-start gap-3 py-3">
                <span className="w-14 shrink-0 pt-0.5 font-mono text-xs tabular-nums text-slate-400">
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

        <footer className="mt-5 rounded-lg border border-stone-300 bg-white p-5 text-sm leading-relaxed text-slate-600 sm:p-7">
          <p>
            Halaman ini dikelola Panitia HUT RI ke-81 Kavling AL. Ada pertanyaan,
            koreksi angka, atau usulan lomba? Sampaikan lewat grup WhatsApp paguyuban
            masing-masing.
          </p>
          <div className="mt-4 flex items-center justify-between border-t border-stone-200 pt-4">
            <Eyebrow className="text-slate-400">Diperbarui otomatis tiap menit</Eyebrow>
            <Link href="/login" className="text-xs text-slate-400 hover:text-slate-700">
              Masuk panitia
            </Link>
          </div>
        </footer>
      </main>
    </>
  );
}
