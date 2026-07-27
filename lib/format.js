export const rp = (n) => "Rp " + Number(n || 0).toLocaleString("id-ID");
export const angka = (n) => Number(n || 0).toLocaleString("id-ID");
export const keAngka = (v) => {
  const n = Number(String(v ?? "").replace(/[^\d-]/g, ""));
  return Number.isFinite(n) ? n : 0;
};
export const aktif = (r) => (r.status || "aktif").toLowerCase() !== "batal";

/**
 * Tanggal di spreadsheet datang dalam dua rupa: ISO "2026-07-01" dari kolom
 * tanggal, dan "27/7/2026, 10.30.00" dari toLocaleString id-ID pada kolom
 * waktu pendaftaran/dukungan. Keduanya diterima di sini.
 */
export function keTanggal(v) {
  const s = String(v ?? "").trim();
  if (!s) return null;
  const idID = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (idID) return new Date(Number(idID[3]), Number(idID[2]) - 1, Number(idID[1]));
  const iso = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (iso) return new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]));
  const d = new Date(s);
  return isNaN(d) ? null : d;
}

export function tanggalPanjang(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

export function tanggalPendek(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short" });
}

/** Nomor WA disimpan rapi dalam format 62xxxx supaya bisa langsung di-broadcast. */
export function rapikanWa(v) {
  let s = String(v || "").replace(/[^\d]/g, "");
  if (s.startsWith("0")) s = "62" + s.slice(1);
  if (s.startsWith("8")) s = "62" + s;
  return s;
}
