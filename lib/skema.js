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
};

export const PAGUYUBAN = ["Cluster Dahlia", "Paguyuban Camar Guyub", "Paguyuban Ka. AL"];
