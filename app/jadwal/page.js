import SiteNav from "@/components/SiteNav";
import { Eyebrow, Kartu, Judul, Kosong, DataGagal } from "@/components/ui";
import { ambilSemua } from "@/lib/data";
import { tanggalPanjang } from "@/lib/format";

export const revalidate = 60;

export default async function HalamanJadwal() {
  const d = await ambilSemua();
  if (d.gagal) return (<><SiteNav /><main className="mx-auto max-w-4xl px-3 py-6 sm:px-6"><DataGagal /></main></>);

  const perHari = d.jadwal.reduce((acc, j) => {
    (acc[j.tanggal] ||= []).push(j);
    return acc;
  }, {});
  const hari = Object.keys(perHari).sort();

  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-4xl px-3 py-6 sm:px-6">
        <header className="mb-5">
          <Eyebrow className="text-red-700">Rundown acara</Eyebrow>
          <h1 className="mt-2 font-serif text-3xl font-bold sm:text-4xl">Jadwal perayaan</h1>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-slate-600">
            Susunan acara bisa berubah. Perubahan langsung tampil di sini begitu panitia
            memperbaruinya.
          </p>
        </header>

        {hari.length === 0 && (
          <Kartu><Kosong>Rundown sedang disusun panitia.</Kosong></Kartu>
        )}

        {hari.map((tgl) => (
          <Kartu key={tgl} className="mb-5">
            <Judul kecil>{tanggalPanjang(tgl)}</Judul>
            <div className="mt-4 divide-y divide-stone-200 border-t border-stone-200">
              {perHari[tgl].map((j, i) => (
                <div key={i} className="flex items-start gap-4 py-3">
                  <span className="w-20 shrink-0 pt-0.5 font-mono text-xs tabular-nums text-red-700">
                    {j.waktu}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium leading-snug">{j.agenda}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {j.lokasi}{j.pic ? ` · penanggung jawab ${j.pic}` : ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Kartu>
        ))}
      </main>
    </>
  );
}
