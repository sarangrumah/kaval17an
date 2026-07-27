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
    <nav className="border-b border-slate-700 bg-slate-900">
      <div className="mx-auto flex max-w-4xl items-center gap-1 overflow-x-auto px-3 py-2 sm:px-6">
        <span className="mr-3 shrink-0 font-mono text-[11px] uppercase tracking-widest text-red-400">
          Panitia
        </span>
        {MENU.map(([href, label]) => (
          <Link key={href} href={href}
                className={
                  "shrink-0 rounded px-2.5 py-1 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 " +
                  (path === href ? "bg-stone-50 text-slate-900" : "text-slate-300 hover:bg-slate-800")
                }>
            {label}
          </Link>
        ))}
        <button onClick={keluar}
                className="ml-auto shrink-0 rounded px-2.5 py-1 text-sm text-slate-400 hover:bg-slate-800 hover:text-stone-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500">
          Keluar
        </button>
      </div>
    </nav>
  );
}
