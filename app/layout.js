import "./globals.css";

export const metadata = {
  title: "HUT RI ke-81 · Kavling AL",
  description:
    "Pendaftaran lomba, rencana anggaran, dan laporan kas terbuka perayaan HUT RI ke-81 warga Kavling AL.",
  icons: { icon: "/logo-hut-ri-81.svg" },
};

export const viewport = { themeColor: "#ED1C24" };

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-stone-100 font-sans text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
