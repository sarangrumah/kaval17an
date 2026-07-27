import Link from "next/link";

const TAUTAN = [
  ["/", "Beranda"],
  ["/lomba", "Lomba"],
  ["/keuangan", "Keuangan"],
  ["/jadwal", "Jadwal"],
];

export default function SiteNav() {
  return (
    <nav className="border-b border-stone-300 bg-stone-50">
      <div className="mx-auto flex max-w-4xl items-center gap-1 overflow-x-auto px-3 py-2 sm:px-6">
        <span className="mr-3 shrink-0 font-mono text-[11px] uppercase tracking-widest text-red-700">
          Kavling AL
        </span>
        {TAUTAN.map(([href, label]) => (
          <Link
            key={href}
            href={href}
            className="shrink-0 rounded px-2.5 py-1 text-sm text-slate-700 hover:bg-stone-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
