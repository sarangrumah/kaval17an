import Link from "next/link";
import { Eyebrow, Kartu, Judul, Bilah, Cip, DataGagal } from "@/components/ui";
import { ambilSemua, ringkasanMingguan } from "@/lib/data";
import { rp, angka } from "@/lib/format";

export const dynamic = "force-dynamic";

const HARI_H = new Date(2026, 7, 17); // 17 Agustus 2026

export default async function RingkasanAdmin() {
  const d = await ambilSemua();
  if (d.gagal) return <DataGagal />;

  const tanpaNota = d.keluar.filter((k) => !k.nota).length;
  const lewatPagu = d.rincianPos.filter((p) => p.lewatPagu);
  const lombaSepi = d.rincianLomba.filter((l) => l.kuota > 0 && l.terisi < l.kuota / 2);
  const perMinggu = ringkasanMingguan(d).slice(-8);
  const sisaHari = Math.max(0, Math.ceil((HARI_H - Date.now()) / 86400000));

  return (
    <>
      <header className="mb-5">
        <Eyebrow className="text-red-700">Ruang kerja panitia</Eyebrow>
        <h1 className="mt-2 font-serif text-3xl font-bold">Ringkasan</h1>
        <p className="mt-2 text-sm text-slate-600">
          <strong className="text-merah-tua">{sisaHari} hari</strong> menuju 17 Agustus.
          Perubahan yang Anda simpan langsung masuk ke spreadsheet dan tampil di
          halaman warga dalam waktu sekitar satu menit.
        </p>
      </header>

      {/* Empat angka kunci: kebutuhan, masuk, keluar, sisa */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Kartu>
          <Eyebrow className="text-slate-500">Kebutuhan anggaran</Eyebrow>
          <p className="mt-1 font-mono text-2xl font-bold tabular-nums">{rp(d.totalPagu)}</p>
          <p className="mt-3 text-xs text-slate-500">
            Total pagu {d.rincianPos.length} pos anggaran.{" "}
            <Link href="/admin/anggaran" className="font-medium text-red-700 hover:underline">
              Atur pos
            </Link>
          </p>
        </Kartu>
        <Kartu>
          <Eyebrow className="text-slate-500">Dana masuk</Eyebrow>
          <p className="mt-1 font-mono text-2xl font-bold tabular-nums text-emerald-700">
            {rp(d.totalMasuk)}
          </p>
          <div className="mt-3"><Bilah persen={d.persenTerkumpul} /></div>
          <p className="mt-2 font-mono text-[11px] tabular-nums text-slate-500">
            {d.persenTerkumpul}% dari kebutuhan
            {d.danaKurang > 0 ? ` · kurang ${rp(d.danaKurang)}` : " · sudah terpenuhi"}
          </p>
        </Kartu>
        <Kartu>
          <Eyebrow className="text-slate-500">Dana keluar</Eyebrow>
          <p className="mt-1 font-mono text-2xl font-bold tabular-nums text-red-700">
            {rp(d.totalKeluar)}
          </p>
          <div className="mt-3"><Bilah persen={d.persenTerpakai} /></div>
          <p className="mt-2 font-mono text-[11px] tabular-nums text-slate-500">
            {d.persenTerpakai}% dari pagu terpakai
          </p>
        </Kartu>
        <Kartu>
          <Eyebrow className="text-slate-500">Sisa saldo</Eyebrow>
          <p className="mt-1 font-mono text-2xl font-bold tabular-nums">{rp(d.saldo)}</p>
          <p className="mt-3 text-xs text-slate-500">
            Dana masuk dikurangi dana keluar.{" "}
            <Link href="/admin/kas" className="font-medium text-red-700 hover:underline">
              Buka kas
            </Link>
          </p>
        </Kartu>
      </div>

      {/* Progress mingguan — bahan rapat panitia */}
      <Kartu className="mt-5">
        <Judul kecil>Progress per minggu</Judul>
        <p className="mt-1 text-sm text-slate-600">
          Rekap Senin–Minggu: dana yang bergerak, pendaftar baru, dan dukungan warga baru.
        </p>
        {perMinggu.length === 0 ? (
          <p className="py-6 text-sm text-slate-500">Belum ada catatan bertanggal.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b-2 border-slate-900 text-left">
                  <th className="py-2 pr-3 font-mono text-[11px] uppercase tracking-widest text-slate-500">Minggu</th>
                  <th className="py-2 pr-3 text-right font-mono text-[11px] uppercase tracking-widest text-slate-500">Dana masuk</th>
                  <th className="py-2 pr-3 text-right font-mono text-[11px] uppercase tracking-widest text-slate-500">Dana keluar</th>
                  <th className="py-2 pr-3 text-right font-mono text-[11px] uppercase tracking-widest text-slate-500">Pendaftar baru</th>
                  <th className="py-2 text-right font-mono text-[11px] uppercase tracking-widest text-slate-500">Dukungan baru</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {perMinggu.map((m) => (
                  <tr key={m.kunci} className="transition-colors hover:bg-red-50/60">
                    <td className="py-2.5 pr-3 font-mono text-xs tabular-nums text-slate-600">{m.label}</td>
                    <td className="py-2.5 pr-3 text-right font-mono tabular-nums text-emerald-700">
                      {m.masuk ? rp(m.masuk) : "—"}
                    </td>
                    <td className="py-2.5 pr-3 text-right font-mono tabular-nums text-red-700">
                      {m.keluar ? rp(m.keluar) : "—"}
                    </td>
                    <td className="py-2.5 pr-3 text-right font-mono tabular-nums">{m.pendaftar || "—"}</td>
                    <td className="py-2.5 text-right font-mono tabular-nums">{m.dukungan || "—"}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-900 font-bold">
                  <td className="py-2.5 pr-3 font-mono text-[11px] uppercase tracking-widest text-slate-500">Total</td>
                  <td className="py-2.5 pr-3 text-right font-mono tabular-nums text-emerald-700">{rp(d.totalMasuk)}</td>
                  <td className="py-2.5 pr-3 text-right font-mono tabular-nums text-red-700">{rp(d.totalKeluar)}</td>
                  <td className="py-2.5 pr-3 text-right font-mono tabular-nums">{angka(d.totalPendaftar)}</td>
                  <td className="py-2.5 text-right font-mono tabular-nums">{angka(d.totalDukungan)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </Kartu>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        {/* Progress pendaftaran per lomba */}
        <Kartu>
          <div className="flex items-baseline justify-between gap-3">
            <Judul kecil>Progress pendaftaran</Judul>
            <Cip>{d.totalPendaftar} peserta</Cip>
          </div>
          <p className="mt-1 text-sm text-slate-600">
            {d.rincianLomba.filter((l) => l.penuh).length} dari {d.rincianLomba.length} lomba
            sudah penuh.
          </p>
          <div className="mt-4 grid gap-3">
            {d.rincianLomba.map((l) => (
              <div key={l.id}>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="truncate text-sm">{l.nama}</span>
                  <span className="shrink-0 font-mono text-xs tabular-nums text-slate-500">
                    {l.kuota > 0 ? `${l.terisi}/${l.kuota}` : `${l.terisi} (tanpa kuota)`}
                  </span>
                </div>
                <div className="mt-1.5">
                  <Bilah persen={l.kuota > 0 ? Math.round((l.terisi / l.kuota) * 100) : l.terisi > 0 ? 100 : 0} />
                </div>
              </div>
            ))}
            {d.rincianLomba.length === 0 && (
              <p className="py-4 text-sm text-slate-500">Belum ada lomba yang dibuka.</p>
            )}
          </div>
        </Kartu>

        {/* Dukungan warga */}
        <Kartu>
          <div className="flex items-baseline justify-between gap-3">
            <Judul kecil>Dukungan warga</Judul>
            <Cip nada={d.totalDukungan > 0 ? "baik" : "netral"}>{d.totalDukungan} dukungan</Cip>
          </div>
          <p className="mt-1 text-sm text-slate-600">
            Tawaran donasi, doorprize, dan bantuan lain dari halaman{" "}
            <Link href="/dukungan" className="font-medium text-red-700 hover:underline">/dukungan</Link>.
          </p>
          {d.nilaiDukungan > 0 && (
            <p className="mt-3 font-mono text-2xl font-bold tabular-nums">{rp(d.nilaiDukungan)}</p>
          )}
          {d.nilaiDukungan > 0 && (
            <Eyebrow className="mt-1 text-slate-500">perkiraan nilai yang ditawarkan</Eyebrow>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            {d.dukunganPerBentuk.map((b) => (
              <Cip key={b.bentuk}>{b.bentuk} · {b.jumlah}</Cip>
            ))}
            {d.totalDukungan === 0 && (
              <p className="text-sm text-slate-500">
                Belum ada yang masuk. Sebarkan tautan halaman dukungan lewat grup WhatsApp.
              </p>
            )}
          </div>
          <p className="mt-4 text-sm">
            <Link href="/admin/dukungan" className="font-semibold text-merah-tua hover:underline">
              Tindak lanjuti di halaman dukungan &rarr;
            </Link>
          </p>
        </Kartu>
      </div>

      {/* Daftar tindak lanjut */}
      <Kartu className="mt-5">
        <Judul kecil>Perlu ditindaklanjuti</Judul>
        <ul className="mt-4 grid gap-3 text-sm">
          {d.danaKurang > 0 && (
            <li className="flex items-start gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
              <span>
                Dana terkumpul baru {d.persenTerkumpul}% dari kebutuhan — kurang{" "}
                <strong>{rp(d.danaKurang)}</strong>. Ajak warga lewat{" "}
                <Link href="/dukungan" className="font-medium text-red-700 hover:underline">
                  halaman dukungan
                </Link>
                .
              </span>
            </li>
          )}
          {tanpaNota > 0 && (
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
          )}
          {lewatPagu.map((p) => (
            <li key={p.id} className="flex items-start gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-600" />
              <span>
                Pos <strong>{p.nama}</strong> melewati pagu {rp(p.terpakai - p.pagu)}. Tulis
                alasannya di kolom catatan pos agar warga tahu.
              </span>
            </li>
          ))}
          {lombaSepi.length > 0 && (
            <li className="flex items-start gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
              <span>
                {lombaSepi.length} lomba pendaftarnya masih di bawah separuh kuota (
                {lombaSepi.map((l) => l.nama).join(", ")}). Ingatkan lagi di grup WhatsApp.
              </span>
            </li>
          )}
          {d.danaKurang === 0 && tanpaNota === 0 && lewatPagu.length === 0 && lombaSepi.length === 0 && (
            <li className="flex items-start gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
              <span>Tidak ada yang menunggak. Semua catatan rapi — pertahankan!</span>
            </li>
          )}
        </ul>
      </Kartu>
    </>
  );
}
