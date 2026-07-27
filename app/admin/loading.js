/*
 * Umpan balik seketika saat menu panitia diklik — tanpa ini, klik terasa mati
 * selama server membaca spreadsheet.
 */
export default function MemuatAdmin() {
  return (
    <div className="grid min-h-[50vh] place-items-center px-6">
      <div className="flex flex-col items-center text-center">
        <span className="flex items-end" aria-hidden>
          <span className="h-16 w-1 rounded-full bg-amber-400 shadow" />
          <span className="-ml-px inline-block origin-left animate-kibar overflow-hidden rounded-r-sm shadow-lg">
            <span className="block h-5 w-14 bg-merah" />
            <span className="block h-5 w-14 bg-white ring-1 ring-inset ring-stone-200" />
          </span>
        </span>
        <p className="mt-5 font-serif text-lg font-bold text-slate-800">
          Membuka catatan panitia&hellip;
        </p>
      </div>
    </div>
  );
}
