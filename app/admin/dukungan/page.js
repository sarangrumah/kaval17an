import EditorTabel from "@/components/EditorTabel";
import { Eyebrow, DataGagal } from "@/components/ui";
import { readSheet } from "@/lib/sheets";
import { keAngka, rapikanWa } from "@/lib/format";
import { BENTUK_DUKUNGAN, ASAL_DUKUNGAN } from "@/lib/skema";

export const dynamic = "force-dynamic";

export default async function AdminDukungan() {
  let dukungan;
  try {
    dukungan = await readSheet("Dukungan");
  } catch {
    return <DataGagal />;
  }

  return (
    <>
      <header className="mb-5">
        <Eyebrow className="text-red-700">Partisipasi warga</Eyebrow>
        <h1 className="mt-2 font-serif text-3xl font-bold">Dukungan warga</h1>
        <p className="mt-2 text-sm text-slate-600">
          Tawaran donasi, doorprize, dan bantuan lain dari halaman warga. Hubungi
          donatur lewat nomor WhatsApp-nya untuk mengatur serah terima; dana yang
          benar-benar diterima tetap dicatat sebagai uang masuk di halaman kas.
          Nomor WhatsApp hanya terlihat panitia.
        </p>
      </header>

      <EditorTabel
        tab="Dukungan"
        ladang={[
          { nama: "waktu", label: "Waktu", wajib: true, contoh: "27/7/2026, 10.30" },
          { nama: "nama", label: "Nama / usaha", wajib: true, contoh: "Warung Barokah" },
          { nama: "no_wa", label: "Nomor WhatsApp", wajib: true, contoh: "081234567890" },
          { nama: "asal", label: "Asal", wajib: true, pilihan: ASAL_DUKUNGAN },
          { nama: "bentuk", label: "Bentuk dukungan", wajib: true, pilihan: BENTUK_DUKUNGAN },
          { nama: "deskripsi", label: "Apa yang disumbangkan", wajib: true, lebar: "penuh", contoh: "Dua kipas angin untuk doorprize" },
          { nama: "nilai", label: "Perkiraan nilai (Rp)", tipe: "number", contoh: "500000" },
          { nama: "catatan", label: "Catatan tindak lanjut", lebar: "penuh", contoh: "Sudah dihubungi, barang diambil 10 Agustus" },
        ]}
        baris={dukungan.slice().reverse().map((r) => ({
          ...r,
          _ringkas: {
            utama: `${r.nama} — ${r.deskripsi || r.bentuk}`,
            sisi: `${r.waktu} · ${r.asal} · ${r.bentuk} · wa.me/${rapikanWa(r.no_wa)}${r.catatan ? ` · ${r.catatan}` : " · belum ditindaklanjuti"}`,
            nilai: keAngka(r.nilai) > 0 ? keAngka(r.nilai) : null,
          },
        }))}
      />
    </>
  );
}
