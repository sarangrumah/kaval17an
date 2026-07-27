import { Eyebrow, Kartu, Judul, Kosong, DataGagal } from "@/components/ui";
import { ambilSemua } from "@/lib/data";
import { tanggalPanjang } from "@/lib/format";

export const revalidate = 60;

export default async function HalamanJadwal() {
  const d = await ambilSemua();
  if (d.gagal) return (<main className="mx-auto max-w-4xl px-3 py-6 sm:px-6"><DataGagal /></main>);

  const perHari = d.jadwal.reduce((acc, j) => {
    (acc[j.tanggal] ||= []).push(j);
    return acc;
  }, {});
  const hari = Object.keys(perHari).sort();

  return (
    <main className="mx-auto max-w-4xl px-3 py-6 sm:px-6">
      <header className="animate-muncul mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-merah via-merah-tua to-merah-pekat p-6 text-white shadow-lg shadow-red-200 sm:p-8">
        <Eyebrow className="text-amber-200">✦ Rundown acara ✦</Eyebrow>
        <h1 className="mt-2 font-serif text-3xl font-bold drop-shadow sm:text-4xl">
          Jadwal perayaan <span className="ml-1 inline-block animate-goyang">📅</span>
        </h1>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-red-50">
          Susunan acara bisa berubah. Perubahan langsung tampil di sini begitu panitia
          memperbaruinya.
        </p>
      </header>

      {hari.length === 0 && (
        <Kartu className="animate-muncul jeda-1"><Kosong>Rundown sedang disusun panitia.</Kosong></Kartu>
      )}

      {hari.map((tgl, urutan) => (
        <Kartu key={tgl} className={`animate-muncul jeda-${Math.min(urutan + 1, 5)} mb-5`}>
          <Judul kecil>{tanggalPanjang(tgl)}</Judul>
          <div className="mt-4 divide-y divide-stone-200 border-t border-stone-200">
            {perHari[tgl].map((j, i) => (
              <div key={i} className="flex items-start gap-4 py-3 transition-colors hover:bg-red-50/60">
                <span className="w-20 shrink-0 pt-0.5 font-mono text-xs tabular-nums text-merah-tua">
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
  );
}
