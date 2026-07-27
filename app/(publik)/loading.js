/*
 * Tampil seketika begitu tautan diklik, selama server masih mengambil data
 * spreadsheet. Tanpa berkas ini, klik menu terasa "mati" beberapa detik.
 */
export default function Memuat() {
  return (
    <main className="grid min-h-[60vh] place-items-center px-6">
      <div className="flex flex-col items-center text-center">
        <span className="flex items-end" aria-hidden>
          <span className="h-16 w-1 rounded-full bg-amber-400 shadow" />
          <span className="-ml-px inline-block origin-left animate-kibar overflow-hidden rounded-r-sm shadow-lg">
            <span className="block h-5 w-14 bg-merah" />
            <span className="block h-5 w-14 bg-white ring-1 ring-inset ring-stone-200" />
          </span>
        </span>
        <p className="mt-5 font-serif text-lg font-bold text-slate-800">
          Mengibarkan halaman&hellip;
        </p>
        <p className="mt-1 text-sm text-slate-500">
          Sedang membaca catatan panitia. Sebentar ya.
        </p>
      </div>
    </main>
  );
}
