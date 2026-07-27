import { Eyebrow, Kartu, Judul, Cip, Kosong } from "@/components/ui";
import { readSheet } from "@/lib/sheets";
import { aktif, rapikanWa } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminPendaftaran() {
  const [daftar, lomba] = await Promise.all([readSheet("Pendaftaran"), readSheet("Lomba")]);
  const hidup = daftar.filter(aktif);
  const namaLomba = (id) => lomba.find((l) => l.id === id)?.nama || id;

  const perLomba = hidup.reduce((a, p) => {
    (a[p.lomba_id] ||= []).push(p);
    return a;
  }, {});

  return (
    <>
      <header className="mb-5">
        <Eyebrow className="text-red-700">Data peserta</Eyebrow>
        <h1 className="mt-2 font-serif text-3xl font-bold">Pendaftar lomba</h1>
        <p className="mt-2 text-sm text-slate-600">
          {hidup.length} pendaftaran masuk. Nomor WhatsApp di halaman ini hanya
          terlihat oleh panitia yang sudah masuk &mdash; jangan disebarkan ke luar panitia.
        </p>
      </header>

      {Object.keys(perLomba).length === 0 && (
        <Kartu><Kosong>Belum ada pendaftar.</Kosong></Kartu>
      )}

      {Object.entries(perLomba).map(([id, orang]) => (
        <Kartu key={id} className="mb-5">
          <div className="flex items-baseline justify-between gap-3">
            <Judul kecil>{namaLomba(id)}</Judul>
            <Cip>{orang.length} peserta</Cip>
          </div>
          <div className="mt-4 divide-y divide-stone-200 border-t border-stone-200">
            {orang.map((p, i) => (
              <div key={i} className="flex items-start gap-3 py-2.5">
                <span className="w-6 shrink-0 pt-0.5 font-mono text-xs tabular-nums text-slate-300">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm">{p.nama}</p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {p.paguyuban} &middot; {p.kategori_usia || "usia belum diisi"}
                    {p.catatan ? ` · ${p.catatan}` : ""}
                  </p>
                </div>
                <a
                  href={`https://wa.me/${rapikanWa(p.no_wa)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 font-mono text-xs text-red-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
                >
                  {rapikanWa(p.no_wa)}
                </a>
              </div>
            ))}
          </div>
        </Kartu>
      ))}
    </>
  );
}
