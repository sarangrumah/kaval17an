import EditorTabel from "@/components/EditorTabel";
import KendaliPawai from "@/components/KendaliPawai";
import { Eyebrow, Kartu, Judul, Bilah, Cip, Kosong, DataGagalRingan } from "@/components/ui";
import { readSheet } from "@/lib/sheets";
import { faseVoting } from "@/lib/pawai";
import { aktif } from "@/lib/format";
import { KATEGORI_PAWAI } from "@/lib/skema";

export const dynamic = "force-dynamic";

export default async function AdminPawai() {
  let pengaturan = [], nominasi = [], suara = [];
  let bacaGagal = false;
  try {
    [pengaturan, nominasi, suara] = await Promise.all([
      readSheet("Pawai"),
      readSheet("Nominasi"),
      readSheet("Suara"),
    ]);
  } catch {
    bacaGagal = true;
  }

  // Pengaturan kunci-nilai + nomor barisnya, supaya kendali bisa menimpa.
  const konf = {};
  const barisKunci = {};
  for (const r of pengaturan.filter(aktif)) {
    const k = String(r.kunci || "").trim().toLowerCase();
    if (!k) continue;
    konf[k] = String(r.nilai || "").trim();
    barisKunci[k] = r._baris;
  }
  const fase = faseVoting(konf);

  const suaraAktif = suara.filter(aktif);
  const perNominasi = {};
  for (const s of suaraAktif) {
    perNominasi[s.nominasi_id] = (perNominasi[s.nominasi_id] || 0) + 1;
  }
  const nominasiAktif = nominasi.filter(aktif);

  return (
    <>
      <header className="mb-5">
        <Eyebrow className="text-red-700">Pentas seni</Eyebrow>
        <h1 className="mt-2 font-serif text-3xl font-bold">Voting pawai kemerdekaan</h1>
        <p className="mt-2 text-sm text-slate-600">
          Isi lima nominator per kategori, tayangkan poster QR{" "}
          <a href="/pawai/qr" className="font-medium text-red-700 hover:underline">/pawai/qr</a>{" "}
          saat pentas seni dimulai, buka voting dari sini, lalu tekan
          &ldquo;Umumkan pemenang&rdquo; saat MC siap.
        </p>
      </header>

      {bacaGagal && <DataGagalRingan />}

      <div className="mb-5">
        <KendaliPawai fase={fase} konf={konf} barisKunci={barisKunci} />
      </div>

      <Kartu className="mb-5">
        <div className="flex items-baseline justify-between gap-3">
          <Judul kecil>Perolehan suara sementara</Judul>
          <Cip>{suaraAktif.length} suara</Cip>
        </div>
        <p className="mt-1 text-sm text-slate-600">
          Hanya panitia yang bisa melihat angka ini; warga baru melihatnya saat pengumuman.
        </p>
        {KATEGORI_PAWAI.map((k) => {
          const papan = nominasiAktif
            .filter((n) => n.kategori === k)
            .map((n) => ({ ...n, suara: perNominasi[n.id] || 0 }))
            .sort((a, b) => b.suara - a.suara);
          const maks = Math.max(1, ...papan.map((n) => n.suara));
          return (
            <div key={k} className="mt-4">
              <p className="font-mono text-[11px] uppercase tracking-widest text-red-700">{k}</p>
              <div className="mt-2 divide-y divide-stone-200 border-t border-stone-200">
                {papan.length === 0 && <Kosong>Belum ada nominator di kategori ini.</Kosong>}
                {papan.map((n, i) => (
                  <div key={n.id} className="flex items-center gap-3 py-2.5">
                    <span className="w-6 shrink-0 font-mono text-xs tabular-nums text-slate-300">{i + 1}</span>
                    <span className="w-40 shrink-0 truncate text-sm sm:w-56">{n.nama}</span>
                    <Bilah persen={Math.round((n.suara / maks) * 100)} />
                    <span className="w-16 shrink-0 text-right font-mono text-sm tabular-nums">{n.suara}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </Kartu>

      <EditorTabel
        tab="Nominasi"
        ladang={[
          { nama: "id", label: "Kode nominator", wajib: true, contoh: "sepeda-01" },
          { nama: "kategori", label: "Kategori", wajib: true, pilihan: KATEGORI_PAWAI },
          { nama: "nama", label: "Nama peserta / regu", wajib: true, contoh: "Keluarga Pak Budi" },
          { nama: "urutan", label: "Nomor urut tampil", tipe: "number", contoh: "1 sampai 5" },
          { nama: "deskripsi", label: "Keterangan singkat", lebar: "penuh", contoh: "Sepeda naga merah-putih" },
        ]}
        baris={nominasi.map((r) => ({
          ...r,
          _ringkas: {
            utama: r.nama,
            sisi: `${r.kategori} · ${perNominasi[r.id] || 0} suara${r.deskripsi ? " · " + r.deskripsi : ""}`,
            nilai: null,
          },
        }))}
      />
    </>
  );
}
