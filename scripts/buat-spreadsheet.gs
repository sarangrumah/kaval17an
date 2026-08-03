/**
 * Skrip sekali pakai untuk menyiapkan seluruh tab spreadsheet.
 *
 * Cara pakai:
 * 1. Buat Google Spreadsheet baru.
 * 2. Menu Ekstensi > Apps Script.
 * 3. Hapus isi editor, tempel seluruh isi berkas ini, lalu Simpan.
 * 4. Pilih fungsi siapkanSpreadsheet, klik Jalankan, izinkan aksesnya.
 * 5. Kembali ke spreadsheet — semua tab sudah terbentuk beserta contoh isinya.
 */

/**
 * Daftar lomba resmi hasil rapat panitia (spreadsheet perencanaan lomba).
 * Biaya daftar semua lomba gratis — angka biaya di spreadsheet perencanaan
 * adalah belanja perlengkapan panitia, bukan biaya pendaftaran.
 * Kolom kategori memakai kata kunci yang dikenali aplikasi:
 * "anak" / "remaja" / "dewasa" / "ibu" / "bapak" (lihat lib/skema.js).
 */
function dataLomba() {
  return [
    // ---- 15 Agustus: remaja & dewasa ----
    ['tebak-warna-dewasa', 'Tebak Warna', 'Remaja & Dewasa', 60, 0, 'Lapangan Kavling AL', '15 Agustus, 08.00-09.00', 'Individu, 10 ronde @ 5 menit. Terpal, balon, dan karet gelang dari panitia.', 'aktif'],
    ['sumpit-pinggang', 'Memasukkan Sumpit ke Botol dengan Pinggang', 'Remaja & Dewasa', 60, 0, 'Lapangan Kavling AL', '15 Agustus, 09.00-10.00', 'Beregu, 10 ronde @ 5 menit. Sumpit diikat tali di pinggang.', 'aktif'],
    ['estafet-gelas-balon', 'Estafet Gelas dengan Balon Tiup', 'Remaja & Dewasa', 60, 0, 'Lapangan Kavling AL', '15 Agustus, 10.00-11.00', 'Beregu 5 orang, gelas plastik dipindahkan memakai balon tiup.', 'aktif'],
    ['makan-kerupuk', 'Makan Kerupuk dengan Tongkat', 'Remaja & Dewasa', 60, 0, 'Lapangan Kavling AL', '15 Agustus, 15.30-16.30', 'Beregu, kerupuk digantung di bambu.', 'aktif'],
    ['isi-baskom-kaki', 'Isi Baskom dengan Air Menggunakan Kaki', 'Remaja & Dewasa', 60, 0, 'Lapangan Kavling AL', '15 Agustus, 16.30-17.30', 'Lomba basah, beregu 5 orang. Siapkan baju ganti.', 'aktif'],
    ['balap-karung', 'Balap Karung', 'Remaja & Dewasa', 60, 0, 'Lapangan Kavling AL', '15 Agustus, 16.30-17.30', 'Individu, karung disediakan panitia.', 'aktif'],
    ['mobile-legends', 'Mobile Legends', 'Remaja & Dewasa', 0, 0, 'Lapangan Kavling AL', '15 Agustus, 19.00-21.00', 'Turnamen beregu, bawa HP sendiri. PIC: Rico MBG.', 'aktif'],
    // ---- 16 Agustus: dewasa ----
    ['jatuhkan-gelas', 'Jatuhkan Gelas dengan Balon', 'Dewasa', 60, 0, 'Lapangan Kavling AL', '16 Agustus, 08.00-09.00', 'Individu, gelas di atas meja dijatuhkan memakai balon.', 'aktif'],
    ['tenis-meja', 'Tenis Meja', 'Dewasa', 20, 0, 'Lapangan Kavling AL', '16 Agustus, 10.00-17.30', 'Individu, 3 babak per pertandingan; menang 2 babak berturut langsung juara.', 'aktif'],
    ['catur', 'Catur', 'Dewasa', 20, 0, 'Lapangan Kavling AL', '16 Agustus, 19.00-22.00', 'Individu, sekitar 30 menit per partai. Papan catur boleh bawa sendiri.', 'aktif'],
    ['gaple', 'Gaple', 'Dewasa', 40, 0, 'Lapangan Kavling AL', '16 Agustus, 19.00-22.00', 'Satu meja 4 pemain, sekitar 30 menit per ronde.', 'aktif'],
    // ---- 17 Agustus: anak-anak ----
    ['pindah-bendera', 'Pindahkan Bendera', 'Anak-anak (3-5 tahun)', 40, 0, 'Lapangan Kavling AL', '17 Agustus, 08.00-09.00', 'Individu, 10 ronde @ 5 menit. Bendera dipindahkan memakai sedotan.', 'aktif'],
    ['estafet-gelas-jepitan', 'Estafet Gelas dengan Jepitan', 'Anak-anak (3-10 tahun)', 60, 0, 'Lapangan Kavling AL', '17 Agustus, 10.00-11.30', 'Beregu 5 anak, 8 ronde. Gelas dioper memakai jepitan jemuran.', 'aktif'],
    ['sumpit-tongkat', 'Masukkan Sumpit ke Botol dengan Tongkat', 'Anak-anak (3-10 tahun)', 40, 0, 'Lapangan Kavling AL', '17 Agustus, 15.30-16.30', 'Individu, 10 ronde @ 5 menit.', 'aktif'],
    ['tebak-warna-anak', 'Tebak Warna', 'Anak-anak (3-10 tahun)', 60, 0, 'Lapangan Kavling AL', '17 Agustus, 16.30-17.30', 'Beregu, 8 ronde @ 5 menit. Terpal, balon, dan karet gelang dari panitia.', 'aktif'],
    ['tiup-bola-pingpong', 'Pindahkan Bola di Air dengan Ditiup', 'Anak-anak (3-10 tahun)', 40, 0, 'Lapangan Kavling AL', '17 Agustus, 16.30-17.30', 'Individu, lomba basah. Bola pingpong ditiup antar gelas.', 'aktif'],
    ['spons-air', 'Mengisi Air ke Botol dengan Spons', 'Anak-anak (4-10 tahun)', 60, 0, 'Lapangan Kavling AL', '17 Agustus, 16.30-17.30', 'Beregu 5 anak, lomba basah, 8 ronde.', 'aktif']
  ];
}

function siapkanSpreadsheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  var tabel = {
    KategoriAnggaran: {
      header: ['id', 'nama', 'urutan', 'status'],
      isi: [
        ['lomba', 'Lomba & Hadiah', 1, 'aktif'],
        ['panggung', 'Panggung, Sound & Lampu', 2, 'aktif'],
        ['karnaval', 'Karnaval', 3, 'aktif'],
        ['konsumsi', 'Konsumsi', 4, 'aktif'],
        ['pentas', 'Pentas Seni', 5, 'aktif'],
        ['dekorasi', 'Dekorasi & Umbul-umbul', 6, 'aktif'],
        ['operasional', 'Operasional & Cadangan', 7, 'aktif'],
        ['publikasi', 'Dokumentasi & Publikasi', 8, 'aktif']
      ]
    },
    PosAnggaran: {
      header: ['id', 'nama', 'pagu', 'urutan', 'catatan', 'status'],
      isi: [
        ['lomba', 'Lomba & Hadiah', 6000000, 1, '', 'aktif'],
        ['panggung', 'Panggung, Sound & Lampu', 5500000, 2, '', 'aktif'],
        ['karnaval', 'Karnaval 3 Paguyuban', 3500000, 3, '', 'aktif'],
        ['konsumsi', 'Konsumsi', 3500000, 4, '', 'aktif'],
        ['pentas', 'Pentas Seni Anak', 3000000, 5, '', 'aktif'],
        ['dekorasi', 'Dekorasi & Umbul-umbul', 2750000, 6, '', 'aktif'],
        ['operasional', 'Operasional & Cadangan', 1500000, 7, '', 'aktif'],
        ['publikasi', 'Dokumentasi & Publikasi', 1000000, 8, '', 'aktif']
      ]
    },
    Pemasukan: {
      header: ['tanggal', 'uraian', 'sumber', 'jumlah', 'nota', 'status'],
      isi: [
        ['2026-07-01', 'Saldo kas bersama tahun lalu', 'Umum', 1500000, '', 'aktif'],
        ['2026-07-05', 'Iuran warga 48 KK', 'Cluster Dahlia', 7200000, '', 'aktif'],
        ['2026-07-08', 'Iuran warga 52 KK', 'Paguyuban Camar Guyub', 7800000, '', 'aktif'],
        ['2026-07-10', 'Iuran warga 40 KK', 'Paguyuban Kav. AL', 6000000, '', 'aktif'],
        ['2026-07-14', 'Donasi UMKM & warga, 12 donatur', 'Umum', 4250000, '', 'aktif']
      ]
    },
    Pengeluaran: {
      header: ['tanggal', 'uraian', 'pos_id', 'penanggung_jawab', 'jumlah', 'nota', 'status'],
      isi: [
        ['2026-07-11', 'Cetak poster & spanduk animo', 'publikasi', 'Ade', 385000, '', 'aktif'],
        ['2026-07-15', 'Umbul-umbul & bendera 150 pcs', 'dekorasi', 'Pak Bambang', 1680000, '', 'aktif'],
        ['2026-07-16', 'DP panggung, sound & lampu', 'panggung', 'Pak Hendra', 3000000, '', 'aktif'],
        ['2026-07-18', 'Hadiah lomba anak 20 paket', 'lomba', 'Bu Rina', 1850000, '', 'aktif']
      ]
    },
    Lomba: {
      header: ['id', 'nama', 'kategori', 'kuota', 'biaya', 'lokasi', 'jadwal', 'deskripsi', 'status'],
      isi: dataLomba()
    },
    Jadwal: {
      header: ['tanggal', 'waktu', 'agenda', 'lokasi', 'pic', 'status'],
      isi: [
        ['2026-08-16', '20.00-22.00', 'Malam tirakatan & doa bersama', 'Pos Ronda Dahlia', 'Pak Hendra', 'aktif'],
        ['2026-08-17', '07.00-08.30', 'Upacara & karnaval tiga paguyuban', 'Start Pos Ronda Dahlia', 'Pak Yudi', 'aktif'],
        ['2026-08-17', '09.00-12.00', 'Lomba anak', 'Lapangan Kavling AL', 'Bu Rina', 'aktif'],
        ['2026-08-17', '15.00-17.00', 'Lomba dewasa antar paguyuban', 'Lapangan Kavling AL', 'Pak Doni', 'aktif'],
        ['2026-08-17', '19.30-22.00', 'Pentas seni anak & pengumuman juara', 'Panggung utama', 'Bu Ratna', 'aktif']
      ]
    },
    Pendaftaran: {
      header: ['waktu_daftar', 'nama', 'no_wa', 'paguyuban', 'lomba_id', 'kategori_usia', 'catatan', 'status'],
      isi: []
    },
    Dukungan: {
      header: ['waktu', 'nama', 'no_wa', 'asal', 'bentuk', 'deskripsi', 'nilai', 'catatan', 'status'],
      isi: []
    },
    Nominasi: {
      header: ['id', 'kategori', 'nama', 'deskripsi', 'urutan', 'status'],
      isi: [
        ['sepeda-01', 'Sepeda Hias', 'Contoh: Keluarga Pak Budi', 'Sepeda naga merah-putih', 1, 'aktif'],
        ['kustom-01', 'Kustom Pawai', 'Contoh: RT 03 Camar Guyub', 'Gerobak kapal pinisi', 1, 'aktif']
      ]
    },
    Suara: {
      header: ['waktu', 'nominasi_id', 'kategori', 'perangkat', 'status'],
      isi: []
    },
    Pawai: {
      header: ['kunci', 'nilai', 'status'],
      isi: [
        ['mulai', '', 'aktif'],
        ['selesai', '', 'aktif'],
        ['pengumuman', 'tidak', 'aktif']
      ]
    }
  };

  Object.keys(tabel).forEach(function (nama) {
    var sheet = ss.getSheetByName(nama) || ss.insertSheet(nama);
    sheet.clear();
    var t = tabel[nama];
    sheet.getRange(1, 1, 1, t.header.length).setValues([t.header])
         .setFontWeight('bold').setBackground('#1e293b').setFontColor('#ffffff');
    if (t.isi.length) {
      sheet.getRange(2, 1, t.isi.length, t.header.length).setValues(t.isi);
    }
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, t.header.length);
  });

  var sisa = ss.getSheetByName('Sheet1') || ss.getSheetByName('Sheet 1');
  if (sisa && ss.getSheets().length > 1) ss.deleteSheet(sisa);

  SpreadsheetApp.flush();
  // Jangan pakai getUi().alert() di sini — dialognya muncul di tab spreadsheet,
  // dan kalau tab itu tidak sedang dibuka skrip menggantung sampai kena batas
  // 6 menit ("Exceeded maximum execution time").
  ss.toast('Selesai. Sebelas tab sudah siap dipakai.', 'Setup', 10);
  Logger.log('Selesai. Sebelas tab sudah siap dipakai.');
}

/**
 * Kosongkan seluruh data tanpa menyentuh header dan formatnya.
 * Dipakai saat data contoh sudah tidak diperlukan dan panitia siap
 * mengisi data sungguhan lewat halaman admin.
 * (Beda dengan siapkanSpreadsheet yang menulis ulang data contoh.)
 */
function kosongkanData() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var nama = ['KategoriAnggaran', 'PosAnggaran', 'Pemasukan', 'Pengeluaran',
              'Lomba', 'Jadwal', 'Pendaftaran', 'Dukungan',
              'Nominasi', 'Suara', 'Pawai'];
  nama.forEach(function (n) {
    var sheet = ss.getSheetByName(n);
    if (!sheet) return;
    var terakhir = sheet.getMaxRows();
    if (terakhir > 1) sheet.deleteRows(2, terakhir - 1);
    // Sisakan beberapa baris kosong supaya sheet tidak terlihat terpotong.
    sheet.insertRowsAfter(1, 20);
  });
  SpreadsheetApp.flush();
  ss.toast('Semua data dikosongkan. Header tetap utuh.', 'Kosongkan', 10);
  Logger.log('Semua data dikosongkan. Header tetap utuh.');
}

/**
 * Untuk spreadsheet yang sudah dipakai sebelum ada tab KategoriAnggaran.
 * Fungsi ini HANYA membuat tab KategoriAnggaran bila belum ada — tidak
 * menyentuh tab lain sama sekali, jadi aman dijalankan di tengah acara.
 * Isinya diambil dari pos yang sudah ada di tab PosAnggaran supaya
 * catatan lama langsung cocok dengan pilihan dropdown.
 * (Jangan jalankan ulang siapkanSpreadsheet: fungsi itu mengosongkan semua tab.)
 */
function tambahTabKategoriAnggaran() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (ss.getSheetByName('KategoriAnggaran')) {
    Logger.log('Tab KategoriAnggaran sudah ada. Tidak ada yang diubah.');
    return;
  }
  var header = ['id', 'nama', 'urutan', 'status'];
  var isi = [];
  var pos = ss.getSheetByName('PosAnggaran');
  if (pos) {
    var nilai = pos.getDataRange().getDisplayValues();
    for (var i = 1; i < nilai.length; i++) {
      if (String(nilai[i][0]).trim() === '') continue;
      // Kolom PosAnggaran: id, nama, pagu, urutan, catatan, status
      isi.push([nilai[i][0], nilai[i][1], nilai[i][3] || i, nilai[i][5] || 'aktif']);
    }
  }
  var sheet = ss.insertSheet('KategoriAnggaran');
  sheet.getRange(1, 1, 1, header.length).setValues([header])
       .setFontWeight('bold').setBackground('#1e293b').setFontColor('#ffffff');
  if (isi.length) {
    sheet.getRange(2, 1, isi.length, header.length).setValues(isi);
  }
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, header.length);
  SpreadsheetApp.flush();
  Logger.log('Tab KategoriAnggaran berhasil dibuat berisi ' + isi.length + ' kategori.');
}

/**
 * Untuk spreadsheet yang sudah dipakai sebelum halaman Dukungan ada.
 * Fungsi ini HANYA membuat tab Dukungan bila belum ada — tidak menyentuh
 * tab lain sama sekali, jadi aman dijalankan di tengah acara.
 * (Jangan jalankan ulang siapkanSpreadsheet: fungsi itu mengosongkan semua tab.)
 */
function tambahTabDukungan() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (ss.getSheetByName('Dukungan')) {
    Logger.log('Tab Dukungan sudah ada. Tidak ada yang diubah.');
    return;
  }
  var header = ['waktu', 'nama', 'no_wa', 'asal', 'bentuk', 'deskripsi', 'nilai', 'catatan', 'status'];
  var sheet = ss.insertSheet('Dukungan');
  sheet.getRange(1, 1, 1, header.length).setValues([header])
       .setFontWeight('bold').setBackground('#1e293b').setFontColor('#ffffff');
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, header.length);
  SpreadsheetApp.flush();
  Logger.log('Tab Dukungan berhasil dibuat.');
}

/**
 * Ganti isi tab Lomba dengan daftar lomba resmi hasil rapat panitia
 * (lihat dataLomba di atas). HANYA tab Lomba yang disentuh — header,
 * tab lain, dan data pendaftaran tetap utuh, jadi aman dijalankan
 * di spreadsheet yang sudah berisi data sungguhan.
 * (Jangan jalankan ulang siapkanSpreadsheet: fungsi itu mengosongkan semua tab.)
 *
 * Catatan: pendaftar lama yang lomba_id-nya tidak ada lagi di daftar baru
 * (tarik-tambang, gerak-jalan, tari-anak) perlu dicek manual di tab Pendaftaran.
 */
function perbaruiTabLomba() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var header = ['id', 'nama', 'kategori', 'kuota', 'biaya', 'lokasi', 'jadwal', 'deskripsi', 'status'];
  var sheet = ss.getSheetByName('Lomba');
  if (!sheet) {
    sheet = ss.insertSheet('Lomba');
    sheet.getRange(1, 1, 1, header.length).setValues([header])
         .setFontWeight('bold').setBackground('#1e293b').setFontColor('#ffffff');
    sheet.setFrozenRows(1);
  }
  var terakhir = sheet.getLastRow();
  if (terakhir > 1) {
    sheet.getRange(2, 1, terakhir - 1, sheet.getLastColumn()).clearContent();
  }
  var isi = dataLomba();
  sheet.getRange(2, 1, isi.length, header.length).setValues(isi);
  sheet.autoResizeColumns(1, header.length);
  SpreadsheetApp.flush();
  ss.toast('Tab Lomba diperbarui: ' + isi.length + ' lomba.', 'Lomba', 10);
  Logger.log('Tab Lomba diperbarui berisi ' + isi.length + ' lomba.');
}

/**
 * Untuk spreadsheet yang sudah dipakai sebelum fitur voting pawai ada.
 * Membuat tab Nominasi, Suara, dan Pawai HANYA bila belum ada — aman
 * dijalankan kapan saja, tab lain tidak disentuh sama sekali.
 * Setelah menjalankan ini, tempel ulang scripts/api.gs dan deploy ulang
 * (versi baru) supaya API mengenal tab barunya.
 */
function tambahTabPawai() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var tabel = {
    Nominasi: { header: ['id', 'kategori', 'nama', 'deskripsi', 'urutan', 'status'], isi: [] },
    Suara:    { header: ['waktu', 'nominasi_id', 'kategori', 'perangkat', 'status'], isi: [] },
    Pawai:    {
      header: ['kunci', 'nilai', 'status'],
      isi: [['mulai', '', 'aktif'], ['selesai', '', 'aktif'], ['pengumuman', 'tidak', 'aktif']]
    }
  };
  Object.keys(tabel).forEach(function (nama) {
    if (ss.getSheetByName(nama)) {
      Logger.log('Tab ' + nama + ' sudah ada. Dilewati.');
      return;
    }
    var t = tabel[nama];
    var sheet = ss.insertSheet(nama);
    sheet.getRange(1, 1, 1, t.header.length).setValues([t.header])
         .setFontWeight('bold').setBackground('#1e293b').setFontColor('#ffffff');
    if (t.isi.length) {
      sheet.getRange(2, 1, t.isi.length, t.header.length).setValues(t.isi);
    }
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, t.header.length);
    Logger.log('Tab ' + nama + ' berhasil dibuat.');
  });
  SpreadsheetApp.flush();
  Logger.log('Selesai. Tab voting pawai siap dipakai.');
}
