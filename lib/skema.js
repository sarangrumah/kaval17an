/**
 * Daftar putih tab dan kolom yang boleh disentuh admin.
 * API tulis hanya menerima nama tab yang ada di sini, dan hanya
 * menulis kolom yang terdaftar — dengan urutan yang persis sama
 * seperti header di spreadsheet.
 */
export const SKEMA = {
  Pemasukan: {
    kolom: ["tanggal", "uraian", "sumber", "jumlah", "nota", "status"],
    kolomStatus: "F",
    label: "Uang masuk",
  },
  Pengeluaran: {
    kolom: ["tanggal", "uraian", "pos_id", "penanggung_jawab", "jumlah", "nota", "status"],
    kolomStatus: "G",
    label: "Uang keluar",
  },
  PosAnggaran: {
    kolom: ["id", "nama", "pagu", "urutan", "catatan", "status"],
    kolomStatus: "F",
    label: "Pos anggaran",
  },
  Lomba: {
    kolom: ["id", "nama", "kategori", "kuota", "biaya", "lokasi", "jadwal", "deskripsi", "status"],
    kolomStatus: "I",
    label: "Lomba",
  },
  Jadwal: {
    kolom: ["tanggal", "waktu", "agenda", "lokasi", "pic", "status"],
    kolomStatus: "F",
    label: "Rundown acara",
  },
  Pendaftaran: {
    kolom: ["waktu_daftar", "nama", "no_wa", "paguyuban", "lomba_id", "kategori_usia", "catatan", "status"],
    kolomStatus: "H",
    label: "Pendaftar lomba",
  },
  Dukungan: {
    kolom: ["waktu", "nama", "no_wa", "asal", "bentuk", "deskripsi", "nilai", "catatan", "status"],
    kolomStatus: "I",
    label: "Dukungan warga",
  },
  Nominasi: {
    kolom: ["id", "kategori", "nama", "deskripsi", "urutan", "status"],
    kolomStatus: "F",
    label: "Nominasi pawai",
  },
  Suara: {
    kolom: ["waktu", "nominasi_id", "kategori", "perangkat", "status"],
    kolomStatus: "E",
    label: "Suara voting pawai",
  },
  Pawai: {
    kolom: ["kunci", "nilai", "status"],
    kolomStatus: "C",
    label: "Pengaturan voting pawai",
  },
};

export const PAGUYUBAN = ["Cluster Dahlia", "Paguyuban Camar Guyub", "Paguyuban Kav. AL"];

/**
 * Kelompok peserta mengikuti klasifikasi panitia lomba di spreadsheet
 * perencanaan: anak-anak dilombakan terpisah, dewasa dibagi remaja,
 * ibu-ibu, dan bapak-bapak (masing-masing berkuota sendiri).
 */
export const KATEGORI_USIA = [
  "Anak-anak (3–10 tahun)",
  "Remaja (10–19 tahun)",
  "Ibu-Ibu",
  "Bapak-Bapak",
];

/*
 * Kolom kategori di tab Lomba diisi panitia dengan teks bebas ("Anak 6-12
 * tahun", "Semua usia", "Dewasa 18+", "Ibu-ibu"). Pencocokan ke kelompok
 * usia peserta dilakukan lewat kata kuncinya: "dewasa" terbuka untuk
 * remaja, ibu-ibu, dan bapak-bapak sesuai klasifikasi panitia.
 */
const KUNCI_KELOMPOK = {
  "Anak-anak (3–10 tahun)": /anak/,
  "Remaja (10–19 tahun)": /remaja|dewasa/,
  "Ibu-Ibu": /ibu|dewasa/,
  "Bapak-Bapak": /bapak|dewasa/,
};

/** Apakah lomba berkategori `kategoriLomba` terbuka untuk `kelompok` usia ini? */
export function cocokKelompok(kategoriLomba, kelompok) {
  const t = String(kategoriLomba || "").toLowerCase();
  // Tanpa kata kunci usia ("Semua usia", teks bebas, kosong) → terbuka untuk semua.
  if (!/anak|remaja|ibu|bapak|dewasa/.test(t)) return true;
  const kunci = KUNCI_KELOMPOK[kelompok];
  return kunci ? kunci.test(t) : true;
}

/**
 * Dua kategori lomba pawai kemerdekaan yang diumumkan di pentas seni.
 * Masing-masing berisi lima nominator (diisi panitia di tab Nominasi).
 */
export const KATEGORI_PAWAI = ["Sepeda Hias", "Kustom Pawai"];

/** Pilihan bentuk partisipasi di halaman dukungan warga. */
export const BENTUK_DUKUNGAN = [
  "Dana tunai / transfer",
  "Doorprize / hadiah",
  "Konsumsi",
  "Barang & perlengkapan",
  "Tenaga / jasa",
  "Sponsor UMKM",
];

/** Donatur tidak harus warga tiga paguyuban — UMKM sekitar juga boleh ikut. */
export const ASAL_DUKUNGAN = [...PAGUYUBAN, "Warga umum / UMKM sekitar"];
