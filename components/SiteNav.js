"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bunting, BenderaKecil } from "@/components/Dekor";

const TAUTAN = [
  ["/", "Beranda"],
  ["/lomba", "Lomba"],
  ["/pawai", "Pawai"],
  ["/dukungan", "Dukungan"],
  ["/keuangan", "Keuangan"],
  ["/jadwal", "Jadwal"],
];

export default function SiteNav() {
  const jalur = usePathname();

  return (
    <div className="sticky top-0 z-50 print:hidden">
      {/* Strip merah-putih tipis khas tujuh belasan */}
      <div aria-hidden className="strip-merah-putih h-1.5" />

      <nav className="border-b border-stone-200 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center gap-1 overflow-x-auto px-3 py-2 sm:px-6">
          <Link
            href="/"
            className="mr-2 flex shrink-0 items-center gap-2 rounded-md px-1 py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-merah"
          >
            <BenderaKecil className="scale-75 sm:scale-90" />
            <span className="leading-tight">
              <span className="block font-serif text-sm font-bold text-merah-tua">Kavling AL</span>
              <span className="block font-mono text-[9px] uppercase tracking-widest text-slate-500">
                HUT RI ke-81
              </span>
            </span>
          </Link>

          <div className="ml-auto flex items-center gap-1">
            {TAUTAN.map(([href, label]) => {
              const aktif = jalur === href;
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={aktif ? "page" : undefined}
                  className={
                    "shrink-0 rounded-full px-3.5 py-2 text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-merah " +
                    (aktif
                      ? "bg-merah text-white shadow-md shadow-red-200"
                      : "text-slate-700 hover:-translate-y-0.5 hover:bg-red-50 hover:text-merah-tua")
                  }
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Untaian bendera menggantung di bawah menu */}
      <div className="pointer-events-none -mb-3 opacity-90">
        <Bunting />
      </div>
    </div>
  );
}
