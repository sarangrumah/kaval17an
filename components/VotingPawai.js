"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Kerlip } from "@/components/Dekor";
import PengumumanPawai from "@/components/PengumumanPawai";

/*
 * Satu komponen untuk seluruh perjalanan voting pawai:
 *   siap  → hitung mundur sampai voting dibuka
 *   vote  → kartu nominator per kategori, satu suara per kategori per HP
 *   tutup → menunggu pengumuman dari panggung
 *   umum  → panggung pengumuman beranimasi
 * Status ditarik ulang tiap beberapa detik supaya HP warga ikut berpindah
 * fase begitu panitia membuka voting atau menekan tombol pengumuman.
 */

const KUNCI_LOKAL = "pawai_sudah";
const IKON = { "Sepeda Hias": "🚲", "Kustom Pawai": "🎭" };

function pecah(ms) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return {
    hari: Math.floor(s / 86400),
    jam: Math.floor((s % 86400) / 3600),
    menit: Math.floor((s % 3600) / 60),
    detik: s % 60,
  };
}

function KotakWaktu({ nilai, label }) {
  return (
    <div className="flex flex-col items-center">
      <div className="grid min-w-[3.2rem] place-items-center rounded-xl bg-white/10 px-2 py-2.5 font-mono text-2xl font-bold tabular-nums text-white ring-1 ring-white/20 backdrop-blur-sm sm:min-w-[4rem] sm:py-3 sm:text-3xl">
        {String(nilai).padStart(2, "0")}
      </div>
      <span className="mt-1.5 font-mono text-[10px] uppercase tracking-widest text-red-100/80">
        {label}
      </span>
    </div>
  );
}

/** Hitung mundur ke `target` (epoch ms); memanggil `saatHabis` sekali saat lewat. */
function Mundur({ target, saatHabis }) {
  const [sisa, setSisa] = useState(null);
  const sudahLapor = useRef(false);

  useEffect(() => {
    sudahLapor.current = false;
    const hitung = () => {
      const s = target - Date.now();
      setSisa(s);
      if (s <= 0 && !sudahLapor.current) {
        sudahLapor.current = true;
        saatHabis?.();
      }
    };
    hitung();
    const id = setInterval(hitung, 1000);
    return () => clearInterval(id);
  }, [target, saatHabis]);

  const w = pecah(sisa ?? 0);
  return (
    <div className={"flex items-start gap-2 sm:gap-3 " + (sisa === null ? "opacity-0" : "")}>
      {w.hari > 0 && (
        <>
          <KotakWaktu nilai={w.hari} label="hari" />
          <span className="pt-2 text-xl font-bold text-white/50">:</span>
        </>
      )}
      <KotakWaktu nilai={w.jam} label="jam" />
      <span className="pt-2 text-xl font-bold text-white/50">:</span>
      <KotakWaktu nilai={w.menit} label="menit" />
      <span className="pt-2 text-xl font-bold text-white/50">:</span>
      <KotakWaktu nilai={w.detik} label="detik" />
    </div>
  );
}

function Panggung({ children }) {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-merah-pekat to-slate-900 p-6 text-center text-white shadow-xl shadow-red-200 sm:p-10">
      <Kerlip />
      <div className="relative flex flex-col items-center">{children}</div>
    </section>
  );
}

export default function VotingPawai() {
  const [data, setData] = useState(null);
  const [gagal, setGagal] = useState(false);
  const [sudah, setSudah] = useState({});
  const [sibuk, setSibuk] = useState("");
  const [pesan, setPesan] = useState("");

  const muat = useCallback(async () => {
    try {
      const r = await fetch("/api/pawai", { cache: "no-store" });
      const j = await r.json();
      if (!j.ok) throw new Error();
      setData(j);
      setGagal(false);
      // Gabungkan catatan server dengan catatan lokal HP ini.
      let lokal = {};
      try { lokal = JSON.parse(localStorage.getItem(KUNCI_LOKAL) || "{}"); } catch {}
      setSudah({ ...lokal, ...j.sudah });
    } catch {
      setGagal(true);
    }
  }, []);

  useEffect(() => {
    muat();
    const id = setInterval(muat, 12000);
    const fokus = () => muat();
    window.addEventListener("focus", fokus);
    return () => { clearInterval(id); window.removeEventListener("focus", fokus); };
  }, [muat]);

  function catatLokal(kategori, id) {
    setSudah((s) => {
      const baru = { ...s, [kategori]: id };
      try { localStorage.setItem(KUNCI_LOKAL, JSON.stringify(baru)); } catch {}
      return baru;
    });
  }

  async function pilih(n) {
    if (!confirm(`Berikan suaramu untuk "${n.nama}" di kategori ${n.kategori}? Pilihan tidak bisa diganti.`)) return;
    setSibuk(n.id);
    setPesan("");
    try {
      const r = await fetch("/api/pawai/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nominasi_id: n.id }),
      });
      const j = await r.json().catch(() => ({}));
      if (r.ok) {
        catatLokal(n.kategori, n.id);
        setPesan(`✔ Suaramu untuk ${n.nama} tercatat. Terima kasih!`);
      } else {
        if (j.sudah) catatLokal(n.kategori, j.sudah);
        setPesan(j.pesan || "Suara belum terkirim. Coba sekali lagi.");
        muat();
      }
    } catch {
      setPesan("Koneksi terputus. Periksa sinyal lalu coba lagi.");
    } finally {
      setSibuk("");
    }
  }

  if (gagal && !data) {
    return (
      <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5 sm:p-7">
        <h2 className="font-serif text-lg font-bold text-amber-900">Data voting belum bisa dibaca</h2>
        <p className="mt-2 text-sm leading-relaxed text-amber-900">
          Coba muat ulang sebentar lagi, atau tanyakan ke panitia di lokasi.
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <Panggung>
        <p className="animate-detak font-mono text-xs uppercase tracking-widest text-red-100">
          Memuat status voting…
        </p>
      </Panggung>
    );
  }

  const { fase, mulai, selesai, kategori, nominasi, papan, totalSuara } = data;

  /* ---------- Pengumuman juara ---------- */
  if (fase === "umum") {
    return <PengumumanPawai kategori={kategori} papan={papan} totalSuara={totalSuara} />;
  }

  /* ---------- Voting ditutup, menunggu panggung ---------- */
  if (fase === "tutup") {
    return (
      <Panggung>
        <span className="animate-melayang text-5xl">🗳️</span>
        <h2 className="mt-4 font-serif text-2xl font-bold sm:text-3xl">Voting sudah ditutup</h2>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-red-100">
          <span className="font-mono font-bold text-white">{totalSuara}</span> suara masuk.
          Pemenangnya segera diumumkan dari panggung pentas seni — halaman ini
          akan berubah sendiri saat pengumuman dimulai.
        </p>
        <p className="mt-5 animate-detak font-mono text-xs uppercase tracking-widest text-amber-300">
          🥁 Menunggu pengumuman…
        </p>
      </Panggung>
    );
  }

  /* ---------- Belum dibuka: hitung mundur ---------- */
  if (fase === "siap") {
    return (
      <div className="grid gap-5">
        <Panggung>
          <span className="animate-melayang text-5xl">🚲🎭</span>
          <h2 className="mt-4 font-serif text-2xl font-bold sm:text-3xl">
            Voting Juara Pawai Kemerdekaan
          </h2>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-red-100">
            Dua kategori — Sepeda Hias dan Kustom Pawai — masing-masing lima
            nominator pilihan panitia. Juaranya kamu yang menentukan lewat voting
            di halaman ini saat pentas seni dimulai.
          </p>
          {mulai ? (
            <div className="mt-6 flex flex-col items-center gap-2">
              <p className="font-mono text-[11px] uppercase tracking-widest text-amber-300">
                Voting dibuka dalam
              </p>
              <Mundur target={mulai} saatHabis={muat} />
            </div>
          ) : (
            <p className="mt-6 animate-detak font-mono text-xs uppercase tracking-widest text-amber-300">
              Dibuka saat pentas seni dimulai — pantau terus 🎪
            </p>
          )}
        </Panggung>

        {nominasi.length > 0 && (
          <div className="animate-muncul jeda-1 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-7">
            <h3 className="font-serif text-lg font-bold">Para nominatornya</h3>
            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              {kategori.map((k) => (
                <div key={k}>
                  <p className="font-mono text-[11px] uppercase tracking-widest text-red-700">
                    {IKON[k]} {k}
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {nominasi.filter((n) => n.kategori === k).map((n) => (
                      <li key={n.id} className="rounded-lg bg-stone-50 px-3 py-2 text-sm">
                        {n.nama}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  /* ---------- Voting berlangsung ---------- */
  return (
    <div className="grid gap-5">
      <Panggung>
        <h2 className="font-serif text-2xl font-bold sm:text-3xl">🗳️ Voting sedang berlangsung!</h2>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-red-100">
          Pilih satu jagoanmu di tiap kategori. Satu HP satu suara per kategori,
          dan pilihan tidak bisa diganti.
        </p>
        {selesai && (
          <div className="mt-5 flex flex-col items-center gap-2">
            <p className="font-mono text-[11px] uppercase tracking-widest text-amber-300">
              Voting ditutup dalam
            </p>
            <Mundur target={selesai} saatHabis={muat} />
          </div>
        )}
      </Panggung>

      {pesan && (
        <p
          className={
            "animate-muncul rounded-md border px-3 py-2 text-sm " +
            (pesan.startsWith("✔")
              ? "border-emerald-300 bg-emerald-50 text-emerald-800"
              : "border-amber-300 bg-amber-50 text-amber-900")
          }
        >
          {pesan}
        </p>
      )}

      {kategori.map((k, ki) => {
        const daftar = nominasi.filter((n) => n.kategori === k);
        const pilihanKu = sudah[k];
        return (
          <section
            key={k}
            className={"animate-muncul rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-7 " + (ki === 1 ? "jeda-2" : "jeda-1")}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-serif text-xl font-bold">
                {IKON[k]} {k}
              </h3>
              {pilihanKu ? (
                <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-xs font-medium text-emerald-800">
                  ✔ Kamu sudah memilih
                </span>
              ) : (
                <span className="rounded bg-red-50 px-1.5 py-0.5 text-xs font-medium text-red-800">
                  Belum memilih
                </span>
              )}
            </div>

            {daftar.length === 0 && (
              <p className="py-8 text-center text-sm text-slate-500">
                Nominasi kategori ini belum diisi panitia.
              </p>
            )}

            <div className="mt-4 grid gap-2.5">
              {daftar.map((n) => {
                const terpilih = pilihanKu === n.id;
                return (
                  <button
                    key={n.id}
                    onClick={() => pilih(n)}
                    disabled={Boolean(pilihanKu) || sibuk !== ""}
                    className={
                      "flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 " +
                      (terpilih
                        ? "border-emerald-400 bg-emerald-50"
                        : pilihanKu
                          ? "border-stone-200 bg-stone-50 opacity-60"
                          : "border-stone-300 bg-white hover:-translate-y-0.5 hover:border-red-400 hover:bg-red-50 hover:shadow-md hover:shadow-red-100")
                    }
                  >
                    <span className="text-2xl">{terpilih ? "✅" : IKON[k]}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">{n.nama}</span>
                      {n.deskripsi && (
                        <span className="block truncate text-xs text-slate-500">{n.deskripsi}</span>
                      )}
                    </span>
                    {!pilihanKu && (
                      <span className="shrink-0 rounded-full bg-gradient-to-r from-merah to-merah-tua px-3 py-1 text-xs font-semibold text-white shadow-sm shadow-red-200">
                        {sibuk === n.id ? "Mengirim…" : "Pilih 🚩"}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}

      <p className="text-center text-xs text-slate-500">
        {totalSuara} suara sudah masuk. Perolehan tiap nominator dirahasiakan
        sampai pengumuman di panggung — biar seru! 🤫
      </p>
    </div>
  );
}
