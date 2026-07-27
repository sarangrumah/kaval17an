import EditorTabel from "@/components/EditorTabel";
import { Eyebrow, DataGagal } from "@/components/ui";
import { readSheet } from "@/lib/sheets";
import { keAngka } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminAnggaran() {
  let pos, kategori;
  try {
    [pos, kategori] = await Promise.all([
      readSheet("PosAnggaran"), readSheet("KategoriAnggaran"),
    ]);
  } catch {
    return <DataGagal />;
  }
  const pilihanKategori = kategori
    .filter((k) => (k.status || "aktif") !== "batal")
    .sort((a, b) => keAngka(a.urutan) - keAngka(b.urutan))
    .map((k) => ({ nilai: k.id, label: k.nama }));
  const namaKategori = (id) => kategori.find((k) => k.id === id)?.nama || id;

  return (
    <>
      <header className="mb-5">
        <Eyebrow className="text-red-700">Estimasi anggaran</Eyebrow>
        <h1 className="mt-2 font-serif text-3xl font-bold">Pos anggaran</h1>
        <p className="mt-2 text-sm text-slate-600">
          Kategori anggaran dipakai sebagai penghubung ke catatan pengeluaran, jadi
          jangan diganti setelah ada belanja yang memakainya. Daftar pilihannya
          diatur di tab <span className="font-mono">KategoriAnggaran</span> pada spreadsheet.
        </p>
      </header>

      <EditorTabel
        tab="PosAnggaran"
        ladang={[
          { nama: "id", label: "Kategori anggaran", wajib: true, pilihan: pilihanKategori },
          { nama: "nama", label: "Nama pos", wajib: true, contoh: "Lomba & Hadiah" },
          { nama: "pagu", label: "Pagu anggaran", tipe: "number", wajib: true, contoh: "6000000" },
          { nama: "urutan", label: "Urutan tampil", tipe: "number", contoh: "1" },
          { nama: "catatan", label: "Catatan untuk warga", lebar: "penuh", contoh: "Wajib diisi bila pos melewati pagu" },
        ]}
        baris={pos.map((r) => ({
          ...r,
          _ringkas: {
            utama: r.nama,
            sisi: `kategori: ${namaKategori(r.id)}${r.catatan ? ` · ${r.catatan}` : ""}`,
            nilai: keAngka(r.pagu),
          },
        }))}
      />
    </>
  );
}
