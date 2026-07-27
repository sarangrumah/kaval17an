import { Suspense } from "react";
import FormLogin from "@/components/FormLogin";

export default function HalamanLogin() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-4">
      <div className="w-full">
        <p className="font-mono text-[11px] uppercase tracking-widest text-red-700">
          Panitia HUT RI ke-81 &middot; Kavling AL
        </p>
        <h1 className="mt-2 font-serif text-3xl font-bold">Masuk panitia</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Halaman ini hanya untuk pengurus yang memperbarui anggaran, kas, lomba,
          dan jadwal. Warga tidak perlu masuk untuk melihat laporan.
        </p>
        <div className="mt-6 rounded-lg border border-stone-300 bg-white p-5 sm:p-7">
          <Suspense fallback={null}>
            <FormLogin />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
