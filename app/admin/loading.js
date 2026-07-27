/*
 * Umpan balik seketika saat menu panitia diklik — tanpa ini, klik terasa mati
 * selama server membaca spreadsheet.
 */
import BenderaLoading from "@/components/BenderaLoading";

export default function MemuatAdmin() {
  return (
    <div className="grid min-h-[50vh] place-items-center px-6">
      <BenderaLoading judul="Membuka catatan panitia&hellip;" />
    </div>
  );
}
