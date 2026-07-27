/**
 * API spreadsheet untuk situs HUT RI ke-81 Kavling AL.
 *
 * Skrip ini menggantikan seluruh keperluan Google Cloud Console:
 * tidak perlu project, tidak perlu service account, tidak perlu berkas JSON.
 *
 * Cara pasang ada di README bagian 2.
 */

var TAB = {
  PosAnggaran:  ['id', 'nama', 'pagu', 'urutan', 'catatan', 'status'],
  Pemasukan:    ['tanggal', 'uraian', 'sumber', 'jumlah', 'nota', 'status'],
  Pengeluaran:  ['tanggal', 'uraian', 'pos_id', 'penanggung_jawab', 'jumlah', 'nota', 'status'],
  Lomba:        ['id', 'nama', 'kategori', 'kuota', 'biaya', 'lokasi', 'jadwal', 'deskripsi', 'status'],
  Jadwal:       ['tanggal', 'waktu', 'agenda', 'lokasi', 'pic', 'status'],
  Pendaftaran:  ['waktu_daftar', 'nama', 'no_wa', 'paguyuban', 'lomba_id', 'kategori_usia', 'catatan', 'status']
};

function balas(obj, kode) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function kunciSah(k) {
  var asli = PropertiesService.getScriptProperties().getProperty('KUNCI_API');
  return asli && k && String(k) === String(asli);
}

function bacaTab(nama) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(nama);
  if (!sheet) return [];
  var nilai = sheet.getDataRange().getDisplayValues();
  if (nilai.length < 2) return [];
  var header = nilai[0];
  var hasil = [];
  for (var i = 1; i < nilai.length; i++) {
    var baris = nilai[i];
    if (baris.join('').trim() === '') continue;
    var obj = { _baris: i + 1 };
    for (var c = 0; c < header.length; c++) {
      obj[String(header[c]).trim()] = baris[c] !== undefined ? String(baris[c]).trim() : '';
    }
    hasil.push(obj);
  }
  return hasil;
}

function doPost(e) {
  var b;
  try {
    b = JSON.parse(e.postData.contents);
  } catch (err) {
    return balas({ pesan: 'Kiriman tidak terbaca.' });
  }

  if (!kunciSah(b.kunci)) {
    return balas({ pesan: 'Kunci API tidak cocok.' });
  }

  try {
    if (b.aksi === 'baca_semua') {
      var semua = {};
      Object.keys(TAB).forEach(function (t) { semua[t] = bacaTab(t); });
      return balas({ ok: true, data: semua });
    }

    if (b.aksi === 'baca') {
      if (!TAB[b.tab]) return balas({ pesan: 'Tab tidak dikenal.' });
      return balas({ ok: true, data: bacaTab(b.tab) });
    }

    var kolom = TAB[b.tab];
    if (!kolom) return balas({ pesan: 'Tab tidak dikenal.' });
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(b.tab);
    if (!sheet) return balas({ pesan: 'Tab belum ada di spreadsheet.' });

    // Kunci sesaat supaya dua orang yang menyimpan bersamaan tidak saling menimpa.
    var gembok = LockService.getScriptLock();
    gembok.waitLock(10000);

    try {
      if (b.aksi === 'batal') {
        if (!b.baris || b.baris < 2) return balas({ pesan: 'Baris tidak sah.' });
        sheet.getRange(b.baris, kolom.indexOf('status') + 1).setValue('batal');
        return balas({ ok: true });
      }

      var nilai = kolom.map(function (k) {
        if (k === 'status') return b.data.status || 'aktif';
        return b.data[k] !== undefined && b.data[k] !== null ? String(b.data[k]) : '';
      });

      if (b.aksi === 'tambah') {
        sheet.appendRow(nilai);
        return balas({ ok: true });
      }

      if (b.aksi === 'ubah') {
        if (!b.baris || b.baris < 2) return balas({ pesan: 'Baris tidak sah.' });
        sheet.getRange(b.baris, 1, 1, nilai.length).setValues([nilai]);
        return balas({ ok: true });
      }

      return balas({ pesan: 'Aksi tidak dikenal.' });
    } finally {
      gembok.releaseLock();
    }
  } catch (err) {
    return balas({ pesan: 'Kesalahan di spreadsheet: ' + err.message });
  }
}

/** Jalankan sekali dari editor untuk membuat kunci API acak. */
function buatKunciApi() {
  var kunci = Utilities.getUuid().replace(/-/g, '') + Utilities.getUuid().replace(/-/g, '');
  PropertiesService.getScriptProperties().setProperty('KUNCI_API', kunci);
  Logger.log('Salin baris ini ke Vercel:\n\nAPPS_SCRIPT_KUNCI=' + kunci);
  return kunci;
}
