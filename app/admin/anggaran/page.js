import EditorTabel from "@/components/EditorTabel";
import { Eyebrow } from "@/components/ui";
import { readSheet } from "@/lib/sheets";
import { keAngka } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminAnggaran() {
  const pos = await readSheet("PosAnggaran");

  return (
    <>
      <header className="mb-5">
        <Eyebrow className="text-red-700">Estimasi anggaran</Eyebrow>
        <h1 className="mt-2 font-serif text-3xl font-bold">Pos anggaran</h1>
        <p className="mt-2 text-sm text-slate-600">
          Kode pos dipakai sebagai penghubung ke catatan pengeluaran, jadi jangan
          diubah setelah ada belanja yang memakainya. Ubah namanya saja bila perlu.
        </p>
      </header>

      <EditorTabel
        tab="PosAnggaran"
        ladang={[
          { nama: "id", label: "Kode pos", wajib: true, contoh: "lomba, panggung, konsumsi" },
          { nama: "nama", label: "Nama pos", wajib: true, contoh: "Lomba & Hadiah" },
          { nama: "pagu", label: "Pagu anggaran", tipe: "number", wajib: true, contoh: "6000000" },
          { nama: "urutan", label: "Urutan tampil", tipe: "number", contoh: "1" },
          { nama: "catatan", label: "Catatan untuk warga", lebar: "penuh", contoh: "Wajib diisi bila pos melewati pagu" },
        ]}
        baris={pos}
        ringkas={(r) => ({
          utama: r.nama,
          sisi: `kode: ${r.id}${r.catatan ? ` · ${r.catatan}` : ""}`,
          nilai: keAngka(r.pagu),
        })}
      />
    </>
  );
}
