/*
 * Tampil seketika begitu tautan diklik, selama server masih mengambil data
 * spreadsheet. Tanpa berkas ini, klik menu terasa "mati" beberapa detik.
 */
import BenderaLoading from "@/components/BenderaLoading";

export default function Memuat() {
  return (
    <main className="grid min-h-[60vh] place-items-center px-6">
      <BenderaLoading
        judul="Mengibarkan halaman&hellip;"
        keterangan="Sedang membaca catatan panitia. Sebentar ya."
      />
    </main>
  );
}
