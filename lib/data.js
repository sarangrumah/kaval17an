import { readAll } from "./sheets";
import { keAngka, aktif, keTanggal } from "./format";

const KOSONG = {
  pos: [], masuk: [], keluar: [], lomba: [], jadwal: [], pendaftaran: [], dukungan: [],
  totalMasuk: 0, totalKeluar: 0, saldo: 0, totalPagu: 0, persenTerpakai: 0,
  rincianPos: [], rincianLomba: [], totalPendaftar: 0,
  totalDukungan: 0, nilaiDukungan: 0, dukunganPerBentuk: [],
  danaKurang: 0, persenTerkumpul: 0,
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
    const dukungan = t.Dukungan || [];

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
    const dukunganAktif = dukungan
      .filter(aktif)
      .map((u) => ({ ...u, nilai: keAngka(u.nilai) }));

    return {
      gagal: false,
      pos: posAktif,
      masuk: masukAktif,
      keluar: keluarAktif,
      lomba: lombaAktif,
      jadwal: jadwalAktif,
      pendaftaran: daftarAktif,
      dukungan: dukunganAktif,
      ...hitung(posAktif, masukAktif, keluarAktif, lombaAktif, daftarAktif, dukunganAktif),
    };
  } catch (e) {
    console.error("Gagal membaca spreadsheet:", e?.message);
    return { gagal: true, ...KOSONG };
  }
}

function hitung(pos, masuk, keluar, lomba, pendaftaran, dukungan = []) {
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

  const perBentuk = {};
  for (const u of dukungan) {
    const b = u.bentuk || "Lainnya";
    perBentuk[b] = (perBentuk[b] || 0) + 1;
  }

  return {
    totalMasuk,
    totalKeluar,
    saldo: totalMasuk - totalKeluar,
    totalPagu,
    persenTerpakai: totalPagu > 0 ? Math.round((totalKeluar / totalPagu) * 100) : 0,
    rincianPos,
    rincianLomba,
    totalPendaftar: pendaftaran.length,
    totalDukungan: dukungan.length,
    nilaiDukungan: dukungan.reduce((a, b) => a + b.nilai, 0),
    dukunganPerBentuk: Object.entries(perBentuk)
      .map(([bentuk, jumlah]) => ({ bentuk, jumlah }))
      .sort((a, b) => b.jumlah - a.jumlah),
    danaKurang: Math.max(0, totalPagu - totalMasuk),
    persenTerkumpul: totalPagu > 0 ? Math.round((totalMasuk / totalPagu) * 100) : 0,
  };
}

/**
 * Rekap kegiatan per minggu (Senin–Minggu) untuk halaman ringkasan panitia:
 * berapa dana masuk, dana keluar, pendaftar baru, dan dukungan baru tiap
 * minggunya — supaya rapat mingguan tinggal membaca satu tabel.
 */
export function ringkasanMingguan({ masuk, keluar, pendaftaran, dukungan }) {
  const minggu = new Map();
  const slot = (tglMentah) => {
    const t = keTanggal(tglMentah);
    if (!t) return null;
    const awal = new Date(t.getFullYear(), t.getMonth(), t.getDate() - ((t.getDay() + 6) % 7));
    const kunci = awal.getTime();
    if (!minggu.has(kunci)) {
      const akhir = new Date(awal.getFullYear(), awal.getMonth(), awal.getDate() + 6);
      const pendek = (d) => d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
      minggu.set(kunci, {
        kunci,
        label: `${pendek(awal)} – ${pendek(akhir)}`,
        masuk: 0, keluar: 0, pendaftar: 0, dukungan: 0,
      });
    }
    return minggu.get(kunci);
  };

  for (const m of masuk) { const s = slot(m.tanggal); if (s) s.masuk += m.jumlah; }
  for (const k of keluar) { const s = slot(k.tanggal); if (s) s.keluar += k.jumlah; }
  for (const p of pendaftaran) { const s = slot(p.waktu_daftar); if (s) s.pendaftar += 1; }
  for (const u of dukungan) { const s = slot(u.waktu); if (s) s.dukungan += 1; }

  return [...minggu.values()].sort((a, b) => a.kunci - b.kunci);
}

export function alokasiIuran(rincianPos, iuranPerKk) {
  return rincianPos.map((p) => ({
    ...p,
    bagian: Math.round((p.porsi * iuranPerKk) / 100) * 100,
  }));
}
