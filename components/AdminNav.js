"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const MENU = [
  ["/admin", "Ringkasan"],
  ["/admin/kas", "Kas"],
  ["/admin/anggaran", "Anggaran"],
  ["/admin/lomba", "Lomba"],
  ["/admin/jadwal", "Jadwal"],
  ["/admin/pendaftaran", "Pendaftar"],
  ["/admin/dukungan", "Dukungan"],
];

export default function AdminNav() {
  const path = usePathname();
  const router = useRouter();

  async function keluar() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-700 bg-slate-900/95 shadow-md backdrop-blur">
      <div className="mx-auto flex max-w-4xl items-center gap-1 overflow-x-auto px-3 py-2 sm:px-6">
        <span className="mr-3 shrink-0 font-mono text-[11px] uppercase tracking-widest text-red-400">
          🚩 Panitia
        </span>
        {MENU.map(([href, label]) => (
          <Link key={href} href={href}
                aria-current={path === href ? "page" : undefined}
                className={
                  "shrink-0 rounded-full px-3 py-1.5 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 " +
                  (path === href ? "bg-merah font-medium text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white")
                }>
            {label}
          </Link>
        ))}
        <button onClick={keluar}
                className="ml-auto shrink-0 rounded-full px-3 py-1.5 text-sm text-slate-400 transition-colors hover:bg-slate-800 hover:text-stone-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500">
          Keluar
        </button>
      </div>
    </nav>
  );
}
