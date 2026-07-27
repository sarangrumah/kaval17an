import EditorTabel from "@/components/EditorTabel";
import { Eyebrow, DataGagalRingan } from "@/components/ui";
import { readSheet } from "@/lib/sheets";

export const dynamic = "force-dynamic";

export default async function AdminLomba() {
  let lomba = [];
  let bacaGagal = false;
  try {
    lomba = await readSheet("Lomba");
  } catch {
    bacaGagal = true;
  }

  return (
    <>
      <header className="mb-5">
        <Eyebrow className="text-red-700">Daftar lomba</Eyebrow>
        <h1 className="mt-2 font-serif text-3xl font-bold">Kelola lomba</h1>
        <p className="mt-2 text-sm text-slate-600">
          Isi kuota 0 bila peserta tidak dibatasi. Lomba yang dibatalkan langsung
          hilang dari pilihan di formulir pendaftaran warga.
        </p>
      </header>

      {bacaGagal && <DataGagalRingan />}

      <EditorTabel
        tab="Lomba"
        ladang={[
          { nama: "id", label: "Kode lomba", wajib: true, contoh: "balap-karung" },
          { nama: "nama", label: "Nama lomba", wajib: true, contoh: "Balap Karung" },
          { nama: "kategori", label: "Kategori peserta", wajib: true, contoh: "Anak 6–12 tahun" },
          { nama: "kuota", label: "Kuota peserta", tipe: "number", contoh: "0 bila tanpa batas" },
          { nama: "biaya", label: "Biaya pendaftaran", tipe: "number", contoh: "0 bila gratis" },
          { nama: "lokasi", label: "Lokasi", contoh: "Lapangan Kavling AL" },
          { nama: "jadwal", label: "Waktu pelaksanaan", contoh: "17 Agustus, 09.00" },
          { nama: "deskripsi", label: "Penjelasan singkat", lebar: "penuh", contoh: "Aturan main yang perlu diketahui peserta" },
        ]}
        baris={lomba.map((r) => ({
          ...r,
          _ringkas: {
            utama: r.nama,
            sisi: `${r.kategori} · kuota ${r.kuota || "bebas"} · ${r.jadwal || "jadwal menyusul"}`,
            nilai: null,
          },
        }))}
      />
    </>
  );
}
