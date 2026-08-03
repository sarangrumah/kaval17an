import VotingPawai from "@/components/VotingPawai";
import { Eyebrow } from "@/components/ui";

export const metadata = {
  title: "Voting Juara Pawai Kemerdekaan — HUT RI ke-81 Kavling AL",
  description:
    "Pilih juara Sepeda Hias dan Kustom Pawai. Voting dibuka saat pentas seni dimulai — satu HP satu suara per kategori.",
};

/*
 * Seluruh isi halaman hidup di sisi browser (VotingPawai) karena fasenya
 * bergeser mengikuti jam dan tombol panitia: hitung mundur, bilik suara,
 * ruang tunggu, sampai panggung pengumuman.
 */
export default function HalamanPawai() {
  return (
    <main className="mx-auto max-w-4xl px-3 py-6 sm:px-6">
      <header className="animate-muncul mb-6">
        <Eyebrow className="text-red-700">✦ Pentas seni · 17 Agustus 2026 ✦</Eyebrow>
        <h1 className="mt-2 font-serif text-3xl font-bold sm:text-4xl">
          Lomba Pawai Kemerdekaan 🎉
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600">
          Kategori <strong>Sepeda Hias</strong> dan <strong>Kustom Pawai</strong>,
          masing-masing lima nominator. Pemenang ditentukan murni dari jumlah
          suara warga di halaman ini.
        </p>
      </header>

      <div className="animate-muncul jeda-1">
        <VotingPawai />
      </div>
    </main>
  );
}
