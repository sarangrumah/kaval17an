import SiteNav from "@/components/SiteNav";

/*
 * Menu dirender di layout, bukan di tiap halaman, supaya tetap tampil dan
 * bisa diklik selagi halaman tujuan masih mengambil data spreadsheet.
 */
export default function LayoutPublik({ children }) {
  return (
    <>
      <SiteNav />
      {children}
    </>
  );
}
