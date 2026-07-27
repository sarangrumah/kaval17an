import Link from "next/link";
import { Eyebrow, Kartu, Judul, Bilah } from "@/components/ui";
import { ambilSemua } from "@/lib/data";
import { rp } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function RingkasanAdmin() {
  const d = await ambilSemua();
  const tanpaNota = d.keluar.filter((k) => !k.nota).length;
  const lewatPagu = d.rincianPos.filter((p) => p.lewatPagu);

  return (
    <>
      <header className="mb-5">
        <Eyebrow className="text-red-700">Ruang kerja panitia</Eyebrow>
        <h1 className="mt-2 font-serif text-3xl font-bold">Ringkasan</h1>
        <p className="mt-2 text-sm text-slate-600">
          Perubahan yang Anda simpan langsung masuk ke spreadsheet dan tampil di
          halaman warga dalam waktu sekitar satu menit.
        </p>
      </header>

      <div className="grid gap-5 sm:grid-cols-2">
        <Kartu>
          <Eyebrow className="text-slate-500">Sisa saldo</Eyebrow>
          <p className="mt-1 font-mono text-3xl font-bold tabular-nums">{rp(d.saldo)}</p>
          <div className="mt-4"><Bilah persen={d.persenTerpakai} /></div>
          <p className="mt-2 font-mono text-[11px] tabular-nums text-slate-500">
            {d.persenTerpakai}% dari pagu {rp(d.totalPagu)}
          </p>
        </Kartu>
        <Kartu>
          <Eyebrow className="text-slate-500">Pendaftar lomba</Eyebrow>
          <p className="mt-1 font-mono text-3xl font-bold tabular-nums">{d.totalPendaftar}</p>
          <p className="mt-4 text-sm text-slate-600">
            {d.rincianLomba.filter((l) => l.penuh).length} lomba sudah penuh dari{" "}
            {d.rincianLomba.length} lomba.
          </p>
        </Kartu>
      </div>

      <Kartu className="mt-5">
        <Judul kecil>Perlu ditindaklanjuti</Judul>
        <ul className="mt-4 grid gap-3 text-sm">
          <li className="flex items-start gap-3">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
            <span>
              {tanpaNota} pengeluaran belum ada notanya.{" "}
              <Link href="/admin/kas" className="font-medium text-red-700 hover:underline">
                Lengkapi di halaman kas
              </Link>
              .
            </span>
          </li>
          {lewatPagu.length > 0 ? (
            lewatPagu.map((p) => (
              <li key={p.id} className="flex items-start gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-600" />
                <span>
                  Pos <strong>{p.nama}</strong> melewati pagu {rp(p.terpakai - p.pagu)}. Tulis
                  alasannya di kolom catatan pos agar warga tahu.
                </span>
              </li>
            ))
          ) : (
            <li className="flex items-start gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
              <span>Semua pos anggaran masih di dalam pagu.</span>
            </li>
          )}
        </ul>
      </Kartu>
    </>
  );
}
