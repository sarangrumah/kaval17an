import BukuKas from "@/components/BukuKas";
import { Kerlip } from "@/components/Dekor";
import { Eyebrow, Kartu, Judul, Bilah, DataGagal } from "@/components/ui";
import { ambilSemua, alokasiIuran } from "@/lib/data";
import { rp } from "@/lib/format";

export const revalidate = 60;

const IURAN_PER_KK = 150000;

const WARNA = [
  "bg-merah-tua", "bg-merah", "bg-red-500", "bg-amber-500",
  "bg-amber-400", "bg-slate-500", "bg-slate-400", "bg-stone-300",
];

export default async function HalamanKeuangan() {
  const d = await ambilSemua();
  if (d.gagal) return (<main className="mx-auto max-w-4xl px-3 py-6 sm:px-6"><DataGagal /></main>);
  const alokasi = alokasiIuran(d.rincianPos, IURAN_PER_KK);

  return (
    <main className="mx-auto max-w-4xl px-3 py-6 sm:px-6">
      <header className="animate-muncul mb-6">
        <Eyebrow className="text-merah-tua">✦ Panitia HUT RI ke-81 &middot; Kavling AL ✦</Eyebrow>
        <h1 className="mt-2 font-serif text-3xl font-bold sm:text-4xl">Anggaran &amp; kas terbuka</h1>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-slate-600">
          Setiap rupiah iuran warga tiga paguyuban dicatat di sini. Bendahara
          memperbarui halaman ini tiap kali ada uang masuk atau keluar.
        </p>
      </header>

      {/* Papan kas */}
      <section className="animate-muncul jeda-1 relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-merah-pekat p-5 text-stone-50 shadow-xl sm:p-7">
        <Kerlip />
        <div className="relative">
          <div className="flex flex-wrap gap-x-10 gap-y-4">
            <div>
              <Eyebrow className="text-slate-400">Uang masuk</Eyebrow>
              <p className="mt-1 font-mono text-lg tabular-nums text-emerald-300 sm:text-xl">{rp(d.totalMasuk)}</p>
            </div>
            <div>
              <Eyebrow className="text-slate-400">Sudah dibelanjakan</Eyebrow>
              <p className="mt-1 font-mono text-lg tabular-nums text-red-300 sm:text-xl">{rp(d.totalKeluar)}</p>
            </div>
          </div>
          <div className="my-5 border-t border-slate-700" />
          <Eyebrow className="text-slate-400">Sisa saldo</Eyebrow>
          <p className="mt-1 font-mono text-4xl font-bold tabular-nums tracking-tight sm:text-5xl">
            {rp(d.saldo)}
          </p>
          <div className="mt-6">
            <div className="mb-2 flex items-baseline justify-between">
              <Eyebrow className="text-slate-400">Anggaran terpakai</Eyebrow>
              <span className="font-mono text-[11px] tabular-nums">{d.persenTerpakai}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-700">
              <div className="h-full rounded-full bg-merah transition-all duration-700"
                   style={{ width: `${Math.min(100, d.persenTerpakai)}%` }} />
            </div>
            <p className="mt-2 font-mono text-[11px] tabular-nums text-slate-400">
              Pagu total {rp(d.totalPagu)}
            </p>
          </div>
        </div>
      </section>

      {/* Alokasi satu iuran */}
      <Kartu className="animate-muncul jeda-2 mt-5">
        <Judul>Iuran Anda {rp(IURAN_PER_KK)} dipakai untuk apa?</Judul>
        <p className="mt-1 text-sm text-slate-600">
          Rincian satu iuran per kepala keluarga, dibagi sesuai porsi pagu tiap pos.
        </p>
        <div className="mt-5 flex h-4 w-full overflow-hidden rounded-full">
          {alokasi.map((p, i) => (
            <div key={p.id} title={`${p.nama} · ${rp(p.bagian)}`}
                 style={{ width: `${p.porsi * 100}%` }}
                 className={"transition-all duration-300 hover:opacity-80 " + WARNA[i % WARNA.length]} />
          ))}
        </div>
        <ul className="mt-5 grid gap-x-8 gap-y-2 sm:grid-cols-2">
          {alokasi.map((p, i) => (
            <li key={p.id} className="flex items-center gap-2.5 text-sm">
              <span className={"h-2.5 w-2.5 shrink-0 rounded-sm " + WARNA[i % WARNA.length]} />
              <span className="flex-1 truncate text-slate-700">{p.nama}</span>
              <span className="font-mono tabular-nums">{rp(p.bagian)}</span>
            </li>
          ))}
        </ul>
      </Kartu>

      {/* Estimasi vs realisasi */}
      <Kartu className="animate-muncul jeda-3 mt-5">
        <Judul>Estimasi anggaran dan realisasinya</Judul>
        <p className="mt-1 text-sm text-slate-600">
          Angka kiri adalah yang sudah dibelanjakan, angka kanan adalah pagu yang direncanakan.
        </p>
        <div className="mt-4 divide-y divide-stone-200 border-t border-stone-200">
          {d.rincianPos.map((p) => (
            <div key={p.id} className="py-3 transition-colors hover:bg-red-50/60">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-sm font-medium">{p.nama}</span>
                <span className="shrink-0 font-mono text-xs tabular-nums text-slate-500">
                  {rp(p.terpakai)} <span className="text-stone-400">/ {rp(p.pagu)}</span>
                </span>
              </div>
              <div className="mt-2 flex items-center gap-3">
                <Bilah persen={p.persen} lewat={p.lewatPagu} />
                <span className="w-9 shrink-0 text-right font-mono text-xs tabular-nums text-slate-500">
                  {p.persen}%
                </span>
              </div>
              {p.lewatPagu && (
                <p className="mt-1.5 text-xs text-amber-800">
                  Melebihi pagu {rp(p.terpakai - p.pagu)}. {p.catatan || "Menunggu penjelasan panitia."}
                </p>
              )}
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-baseline justify-between border-t-2 border-slate-900 pt-3">
          <span className="font-mono text-[11px] uppercase tracking-widest text-slate-500">
            Total realisasi terhadap pagu
          </span>
          <span className="font-mono text-base font-bold tabular-nums">
            {rp(d.totalKeluar)} / {rp(d.totalPagu)}
          </span>
        </div>
      </Kartu>

      {/* Buku kas */}
      <Kartu className="animate-muncul jeda-4 mt-5">
        <Judul>Buku kas</Judul>
        <div className="mt-4">
          <BukuKas masuk={d.masuk} keluar={d.keluar} pos={d.rincianPos} />
        </div>
      </Kartu>

      <footer className="animate-muncul jeda-5 mt-5 rounded-2xl border border-stone-200 bg-white p-5 text-sm leading-relaxed text-slate-600 shadow-sm sm:p-7">
        <p>
          Menemukan angka yang keliru atau ingin melihat notanya? Hubungi bendahara
          panitia lewat grup WhatsApp paguyuban Anda. Catatan yang salah tidak dihapus,
          melainkan dibatalkan dan diganti catatan baru, supaya jejaknya tetap terbaca.
        </p>
      </footer>
    </main>
  );
}
