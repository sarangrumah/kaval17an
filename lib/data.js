import { readAll } from "./sheets";
import { keAngka, aktif } from "./format";

const KOSONG = {
  pos: [], masuk: [], keluar: [], lomba: [], jadwal: [], pendaftaran: [],
  totalMasuk: 0, totalKeluar: 0, saldo: 0, totalPagu: 0, persenTerpakai: 0,
  rincianPos: [], rincianLomba: [], totalPendaftar: 0,
};

/**
 * Semua pembacaan publik lewat sini.
 * Kalau spreadsheet tidak bisa dibaca, kembalikan penanda `gagal` — jangan
 * menampilkan angka nol, karena saldo Rp 0 palsu lebih menyesatkan daripada
 * pesan error yang jelas.
 */
export async function ambilSemua() {
  try {
    const t = await readAll();
    const pos = t.PosAnggaran || [];
    const masuk = t.Pemasukan || [];
    const keluar = t.Pengeluaran || [];
    const lomba = t.Lomba || [];
    const jadwal = t.Jadwal || [];
    const daftar = t.Pendaftaran || [];

    const posAktif = pos
      .filter(aktif)
      .map((p) => ({ ...p, pagu: keAngka(p.pagu), urutan: keAngka(p.urutan) }))
      .sort((a, b) => a.urutan - b.urutan || b.pagu - a.pagu);

    const masukAktif = masuk.filter(aktif).map((m) => ({ ...m, jumlah: keAngka(m.jumlah) }));
    const keluarAktif = keluar.filter(aktif).map((k) => ({ ...k, jumlah: keAngka(k.jumlah) }));
    const lombaAktif = lomba
      .filter(aktif)
      .map((l) => ({ ...l, kuota: keAngka(l.kuota), biaya: keAngka(l.biaya) }));
    const daftarAktif = daftar.filter(aktif);
    const jadwalAktif = jadwal
      .filter(aktif)
      .sort((a, b) => (a.tanggal + a.waktu).localeCompare(b.tanggal + b.waktu));

    return {
      gagal: false,
      pos: posAktif,
      masuk: masukAktif,
      keluar: keluarAktif,
      lomba: lombaAktif,
      jadwal: jadwalAktif,
      pendaftaran: daftarAktif,
      ...hitung(posAktif, masukAktif, keluarAktif, lombaAktif, daftarAktif),
    };
  } catch (e) {
    console.error("Gagal membaca spreadsheet:", e?.message);
    return { gagal: true, ...KOSONG };
  }
}

function hitung(pos, masuk, keluar, lomba, pendaftaran) {
  const totalMasuk = masuk.reduce((a, b) => a + b.jumlah, 0);
  const totalKeluar = keluar.reduce((a, b) => a + b.jumlah, 0);
  const totalPagu = pos.reduce((a, b) => a + b.pagu, 0);

  const realisasi = Object.fromEntries(pos.map((p) => [p.id, 0]));
  for (const k of keluar) {
    if (k.pos_id in realisasi) realisasi[k.pos_id] += k.jumlah;
  }

  const rincianPos = pos.map((p) => {
    const terpakai = realisasi[p.id] || 0;
    return {
      ...p,
      terpakai,
      sisa: p.pagu - terpakai,
      persen: p.pagu > 0 ? Math.round((terpakai / p.pagu) * 100) : 0,
      lewatPagu: terpakai > p.pagu,
      porsi: totalPagu > 0 ? p.pagu / totalPagu : 0,
    };
  });

  const pendaftarPerLomba = {};
  for (const d of pendaftaran) {
    pendaftarPerLomba[d.lomba_id] = (pendaftarPerLomba[d.lomba_id] || 0) + 1;
  }
  const rincianLomba = lomba.map((l) => {
    const terisi = pendaftarPerLomba[l.id] || 0;
    return {
      ...l,
      terisi,
      sisaKuota: l.kuota > 0 ? Math.max(0, l.kuota - terisi) : null,
      penuh: l.kuota > 0 && terisi >= l.kuota,
    };
  });

  return {
    totalMasuk,
    totalKeluar,
    saldo: totalMasuk - totalKeluar,
    totalPagu,
    persenTerpakai: totalPagu > 0 ? Math.round((totalKeluar / totalPagu) * 100) : 0,
    rincianPos,
    rincianLomba,
    totalPendaftar: pendaftaran.length,
  };
}

export function alokasiIuran(rincianPos, iuranPerKk) {
  return rincianPos.map((p) => ({
    ...p,
    bagian: Math.round((p.porsi * iuranPerKk) / 100) * 100,
  }));
}
