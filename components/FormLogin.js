"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function FormLogin() {
  const router = useRouter();
  const params = useSearchParams();
  const lanjut = params.get("lanjut") || "/admin";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [salah, setSalah] = useState("");
  const [kirim, setKirim] = useState(false);

  async function masuk() {
    setKirim(true);
    setSalah("");
    try {
      const r = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (r.ok) {
        router.push(lanjut);
        router.refresh();
      } else {
        const j = await r.json().catch(() => ({}));
        setSalah(j.pesan || "Nama pengguna atau password tidak cocok.");
      }
    } catch {
      setSalah("Koneksi terputus. Coba lagi.");
    } finally {
      setKirim(false);
    }
  }

  const isi = "mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600";

  return (
    <div className="grid gap-4">
      <div>
        <label htmlFor="u" className="block text-sm font-medium text-slate-700">Nama pengguna</label>
        <input id="u" value={username} onChange={(e) => setUsername(e.target.value)}
               onKeyDown={(e) => e.key === "Enter" && masuk()} autoComplete="username" className={isi} />
      </div>
      <div>
        <label htmlFor="p" className="block text-sm font-medium text-slate-700">Password</label>
        <input id="p" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
               onKeyDown={(e) => e.key === "Enter" && masuk()} autoComplete="current-password" className={isi} />
      </div>
      {salah && (
        <p className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800">{salah}</p>
      )}
      <button onClick={masuk} disabled={kirim}
              className="rounded-md bg-red-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-800 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600">
        {kirim ? "Memeriksa…" : "Masuk"}
      </button>
    </div>
  );
}
