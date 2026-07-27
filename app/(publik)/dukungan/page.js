import FormDukungan from "@/components/FormDukungan";
import { Kerlip } from "@/components/Dekor";
import { Eyebrow, Kartu, Judul, Cip, DataGagal } from "@/components/ui";
import { ambilSemua } from "@/lib/data";
import { rp } from "@/lib/format";

export const revalidate = 60;

const CARA_BANTU = [
  ["💰", "Dana tunai / transfer", "Berapa pun jumlahnya dicatat di buku kas terbuka dan bisa dicek siapa saja."],
  ["🎁", "Doorprize / hadiah", "Kipas angin, magic com, payung, apa saja — dibagikan di panggung malam puncak."],
  ["🍱", "Konsumsi", "Snack untuk peserta lomba, nasi kotak panitia, atau es teh satu termos pun berarti."],
  ["📦", "Barang & perlengkapan", "Terpal, sound kecil, bendera, kabel, meja kursi — pinjam atau hibah sama-sama membantu."],
  ["💪", "Tenaga / jasa", "Ikut pasang umbul-umbul, jaga lomba anak, dokumentasi, atau angkut panggung."],
  ["🏪", "Sponsor UMKM", "Nama usaha Anda disebut MC dan tampil di papan dukungan ini."],
];

export default async function HalamanDukungan() {
  const d = await ambilSemua();
  if (d.gagal) return (<main className="mx-auto max-w-4xl px-3 py-6 sm:px-6"><DataGagal /></main>);
  const papan = d.dukungan.slice().reverse();

  return (
    <main className="mx-auto max-w-4xl px-3 py-6 sm:px-6">

      {/* Ajakan */}
      <header className="animate-muncul relative overflow-hidden rounded-2xl bg-gradient-to-br from-merah via-merah-tua to-merah-pekat p-6 text-white shadow-xl shadow-red-200 sm:p-10">
        <Kerlip />
        <div className="relative max-w-2xl">
          <Eyebrow className="text-amber-200">✦ Gotong royong tiga paguyuban ✦</Eyebrow>
          <h1 className="mt-3 font-serif text-3xl font-bold leading-tight drop-shadow sm:text-4xl">
            Perayaan ini milik kita. <span className="text-amber-300">Yuk, ikut angkat.</span>
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-red-50 sm:text-base">
            Panitia tidak bisa bekerja sendirian. Dukungan Anda — dana, doorprize,
            konsumsi, barang, tenaga, atau sponsor UMKM — semuanya tercatat terbuka
            dan langsung terasa di lapangan.
          </p>
        </div>
      </header>

      {/* Kebutuhan dana hari ini */}
      <section className="animate-muncul jeda-1 mt-6 relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-merah-pekat p-5 text-stone-50 shadow-xl sm:p-7">
        <div className="relative">
          <div className="flex flex-wrap gap-x-10 gap-y-4">
            <div>
              <Eyebrow className="text-slate-400">Kebutuhan anggaran</Eyebrow>
              <p className="mt-1 font-mono text-lg tabular-nums sm:text-xl">{rp(d.totalPagu)}</p>
            </div>
            <div>
              <Eyebrow className="text-slate-400">Sudah terkumpul</Eyebrow>
              <p className="mt-1 font-mono text-lg tabular-nums text-emerald-300 sm:text-xl">{rp(d.totalMasuk)}</p>
            </div>
          </div>
          <div className="mt-5">
            <div className="mb-2 flex items-baseline justify-between">
              <Eyebrow className="text-slate-400">Dana terkumpul</Eyebrow>
              <span className="font-mono text-[11px] tabular-nums">{d.persenTerkumpul}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-700">
              <div className="h-full rounded-full bg-emerald-400 transition-all duration-700"
                   style={{ width: `${Math.min(100, d.persenTerkumpul)}%` }} />
            </div>
            <p className="mt-3 text-sm text-slate-300">
              {d.danaKurang > 0 ? (
                <>Masih kurang <strong className="font-mono tabular-nums text-amber-300">{rp(d.danaKurang)}</strong> untuk
                menutup seluruh rencana. Sekecil apa pun bantuan Anda memperpendek jarak itu.</>
              ) : (
                <>Alhamdulillah, kebutuhan dana sudah terpenuhi. Dukungan doorprize,
                konsumsi, dan tenaga tetap sangat dinanti!</>
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Cara membantu */}
      <section className="animate-muncul jeda-2 mt-6">
        <Judul>Enam cara ikut membantu</Judul>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CARA_BANTU.map(([emoji, judul, isi]) => (
            <div key={judul}
                 className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-merah hover:shadow-lg hover:shadow-red-100">
              <span aria-hidden className="text-2xl">{emoji}</span>
              <h3 className="mt-2 font-serif text-base font-bold">{judul}</h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">{isi}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Formulir */}
      <Kartu className="animate-muncul jeda-3 mt-6">
        <Judul>Sampaikan dukungan Anda</Judul>
        <p className="mt-1 text-sm text-slate-600">
          Isi formulir singkat ini, nanti seksi dana yang menghubungi Anda —
          tidak perlu datang ke sekretariat.
        </p>
        <div className="mt-5">
          <FormDukungan />
        </div>
      </Kartu>

      {/* Papan dukungan */}
      <Kartu className="animate-muncul jeda-4 mt-5">
        <div className="flex items-baseline justify-between gap-3">
          <Judul>Papan dukungan</Judul>
          {papan.length > 0 && <Cip nada="baik">{papan.length} dukungan</Cip>}
        </div>
        <div className="mt-4 divide-y divide-stone-200 border-t border-stone-200">
          {papan.length === 0 && (
            <p className="py-8 text-center text-sm text-slate-500">
              Jadilah yang pertama tercatat di papan ini. 🇮🇩
            </p>
          )}
          {papan.map((u, i) => (
            <div key={i} className="flex items-start gap-3 py-3 transition-colors hover:bg-red-50/60">
              <span aria-hidden className="pt-0.5">🤝</span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{u.nama}</p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {u.asal}
                  {u.deskripsi ? ` · ${u.deskripsi}` : ""}
                </p>
              </div>
              <Cip>{u.bentuk || "Dukungan"}</Cip>
            </div>
          ))}
        </div>
      </Kartu>

      <footer className="animate-muncul jeda-5 mt-5 rounded-2xl border border-stone-200 bg-white p-5 text-sm leading-relaxed text-slate-600 shadow-sm sm:p-7">
        <p>
          Semua dana yang masuk dicatat di{" "}
          <a href="/keuangan" className="font-medium text-merah-tua hover:underline">buku kas terbuka</a>{" "}
          dan bisa diperiksa siapa saja. Ingin menyerahkan langsung? Hubungi bendahara
          lewat grup WhatsApp paguyuban Anda. 🇮🇩
        </p>
      </footer>
    </main>
  );
}
