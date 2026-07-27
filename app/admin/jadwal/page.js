import EditorTabel from "@/components/EditorTabel";
import { Eyebrow, DataGagal } from "@/components/ui";
import { readSheet } from "@/lib/sheets";
import { tanggalPendek } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminJadwal() {
  let jadwal;
  try {
    jadwal = await readSheet("Jadwal");
  } catch {
    return <DataGagal />;
  }

  return (
    <>
      <header className="mb-5">
        <Eyebrow className="text-red-700">Rundown acara</Eyebrow>
        <h1 className="mt-2 font-serif text-3xl font-bold">Kelola jadwal</h1>
        <p className="mt-2 text-sm text-slate-600">
          Agenda diurutkan otomatis menurut tanggal dan jam.
        </p>
      </header>

      <EditorTabel
        tab="Jadwal"
        ladang={[
          { nama: "tanggal", label: "Tanggal", tipe: "date", wajib: true },
          { nama: "waktu", label: "Jam", wajib: true, contoh: "07.00–09.00" },
          { nama: "agenda", label: "Agenda", wajib: true, lebar: "penuh", contoh: "Karnaval tiga paguyuban" },
          { nama: "lokasi", label: "Lokasi", wajib: true, contoh: "Start Pos Ronda Dahlia" },
          { nama: "pic", label: "Penanggung jawab", contoh: "Pak Yudi" },
        ]}
        baris={jadwal.map((r) => ({
          ...r,
          _ringkas: {
            utama: r.agenda,
            sisi: `${tanggalPendek(r.tanggal)} · ${r.waktu} · ${r.lokasi}${r.pic ? ` · ${r.pic}` : ""}`,
            nilai: null,
          },
        }))}
      />
    </>
  );
}
