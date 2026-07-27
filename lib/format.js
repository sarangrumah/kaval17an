export const rp = (n) => "Rp " + Number(n || 0).toLocaleString("id-ID");
export const angka = (n) => Number(n || 0).toLocaleString("id-ID");
export const keAngka = (v) => {
  const n = Number(String(v ?? "").replace(/[^\d-]/g, ""));
  return Number.isFinite(n) ? n : 0;
};
export const aktif = (r) => (r.status || "aktif").toLowerCase() !== "batal";

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
