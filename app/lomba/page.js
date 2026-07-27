import SiteNav from "@/components/SiteNav";
import FormDaftar from "@/components/FormDaftar";
import { Eyebrow, Kartu, Judul, Bilah, Cip, Kosong, DataGagal } from "@/components/ui";
import { ambilSemua } from "@/lib/data";
import { rp } from "@/lib/format";

export const revalidate = 30;

export default async function HalamanLomba() {
  const d = await ambilSemua();
  if (d.gagal) return (<><SiteNav /><main className="mx-auto max-w-4xl px-3 py-6 sm:px-6"><DataGagal /></main></>);

  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-4xl px-3 py-6 sm:px-6">
        <header className="mb-5">
          <Eyebrow className="text-red-700">Pendaftaran peserta</Eyebrow>
          <h1 className="mt-2 font-serif text-3xl font-bold sm:text-4xl">Lomba HUT RI ke-81</h1>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-slate-600">
            {d.totalPendaftar} warga sudah mendaftar. Satu orang boleh ikut lebih dari
            satu lomba &mdash; kirim formulirnya sekali per lomba.
          </p>
        </header>

        <Kartu>
          <Judul>Formulir pendaftaran</Judul>
          <div className="mt-5">
            <FormDaftar lomba={d.rincianLomba} />
          </div>
        </Kartu>

        <Kartu className="mt-5">
          <Judul>Daftar lomba dan sisa kuota</Judul>
          <div className="mt-4 divide-y divide-stone-200 border-t border-stone-200">
            {d.rincianLomba.length === 0 && <Kosong>Daftar lomba belum diumumkan panitia.</Kosong>}
            {d.rincianLomba.map((l) => {
              const persen = l.kuota > 0 ? Math.round((l.terisi / l.kuota) * 100) : 0;
              return (
                <div key={l.id} className="py-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                    <h3 className="text-sm font-semibold">{l.nama}</h3>
                    <div className="flex items-center gap-2">
                      {l.biaya > 0
                        ? <Cip nada="ingat">{rp(l.biaya)} per peserta</Cip>
                        : <Cip nada="baik">Gratis</Cip>}
                      {l.penuh && <Cip nada="penting">Kuota penuh</Cip>}
                    </div>
                  </div>
                  {l.deskripsi && (
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{l.deskripsi}</p>
                  )}
                  <p className="mt-1.5 text-xs text-slate-500">
                    {l.kategori} &middot; {l.jadwal} &middot; {l.lokasi}
                  </p>
                  {l.kuota > 0 && (
                    <div className="mt-3 flex items-center gap-3">
                      <Bilah persen={persen} />
                      <span className="w-24 shrink-0 text-right font-mono text-xs tabular-nums text-slate-500">
                        {l.terisi}/{l.kuota} slot
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Kartu>

        <Kartu className="mt-5">
          <Judul>Peserta yang sudah terdaftar</Judul>
          <p className="mt-1 text-sm text-slate-600">
            Nomor WhatsApp sengaja tidak ditampilkan di sini.
          </p>
          <div className="mt-4 divide-y divide-stone-200 border-t border-stone-200">
            {d.pendaftaran.length === 0 && <Kosong>Belum ada yang mendaftar. Jadilah yang pertama.</Kosong>}
            {d.pendaftaran.slice().reverse().map((p, i) => (
              <div key={i} className="flex items-baseline justify-between gap-3 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-sm">{p.nama}</p>
                  <p className="text-xs text-slate-500">{p.paguyuban}</p>
                </div>
                <span className="shrink-0 text-xs text-slate-600">
                  {d.rincianLomba.find((l) => l.id === p.lomba_id)?.nama || p.lomba_id}
                </span>
              </div>
            ))}
          </div>
        </Kartu>
      </main>
    </>
  );
}
