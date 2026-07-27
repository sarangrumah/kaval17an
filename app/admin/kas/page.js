import EditorTabel from "@/components/EditorTabel";
import { Eyebrow, DataGagal } from "@/components/ui";
import { readSheet } from "@/lib/sheets";
import { keAngka, tanggalPendek } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminKas() {
  let keluar, masuk, pos;
  try {
    [keluar, masuk, pos] = await Promise.all([
      readSheet("Pengeluaran"), readSheet("Pemasukan"), readSheet("PosAnggaran"),
    ]);
  } catch {
    return <DataGagal />;
  }
  const pilihanPos = pos
    .filter((p) => (p.status || "aktif") !== "batal")
    .map((p) => ({ nilai: p.id, label: p.nama }));
  const namaPos = (id) => pos.find((p) => p.id === id)?.nama || id;

  return (
    <>
      <header className="mb-5">
        <Eyebrow className="text-red-700">Buku kas</Eyebrow>
        <h1 className="mt-2 font-serif text-3xl font-bold">Uang keluar</h1>
        <p className="mt-2 text-sm text-slate-600">
          Isi nominal tanpa titik atau &ldquo;Rp&rdquo;. Contoh: 1850000.
        </p>
      </header>

      <EditorTabel
        tab="Pengeluaran"
        ladang={[
          { nama: "tanggal", label: "Tanggal", tipe: "date", wajib: true },
          { nama: "jumlah", label: "Nominal", tipe: "number", wajib: true, contoh: "1850000" },
          { nama: "uraian", label: "Untuk apa", wajib: true, lebar: "penuh", contoh: "Hadiah lomba anak 20 paket" },
          { nama: "pos_id", label: "Pos anggaran", wajib: true, pilihan: pilihanPos },
          { nama: "penanggung_jawab", label: "Penanggung jawab", wajib: true, contoh: "Bu Rina" },
          { nama: "nota", label: "Tautan foto nota", lebar: "penuh", contoh: "Tempel link Google Drive atau Foto" },
        ]}
        baris={keluar.slice().reverse().map((r) => ({
          ...r,
          _ringkas: {
            utama: r.uraian,
            sisi: `${tanggalPendek(r.tanggal)} · ${namaPos(r.pos_id)} · ${r.penanggung_jawab}${r.nota ? "" : " · nota belum ada"}`,
            nilai: keAngka(r.jumlah),
          },
        }))}
      />

      <header className="mb-5 mt-10">
        <h1 className="font-serif text-3xl font-bold">Uang masuk</h1>
      </header>

      <EditorTabel
        tab="Pemasukan"
        ladang={[
          { nama: "tanggal", label: "Tanggal", tipe: "date", wajib: true },
          { nama: "jumlah", label: "Nominal", tipe: "number", wajib: true, contoh: "7200000" },
          { nama: "uraian", label: "Keterangan", wajib: true, lebar: "penuh", contoh: "Iuran warga 48 KK" },
          { nama: "sumber", label: "Sumber", wajib: true, contoh: "Cluster Dahlia / Donatur / Kas bersama" },
          { nama: "nota", label: "Tautan bukti setor", contoh: "Link foto bukti transfer" },
        ]}
        baris={masuk.slice().reverse().map((r) => ({
          ...r,
          _ringkas: {
            utama: r.uraian,
            sisi: `${tanggalPendek(r.tanggal)} · ${r.sumber}`,
            nilai: keAngka(r.jumlah),
          },
        }))}
      />
    </>
  );
}
