"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

/*
 * QR dibuat di browser dari window.location.origin sehingga selalu
 * menunjuk ke domain tempat situs ini dibuka — tak perlu konfigurasi.
 */
export default function KodeQR({ path = "/lomba" }) {
  const [svg, setSvg] = useState("");
  const [alamat, setAlamat] = useState("");

  useEffect(() => {
    const url = window.location.origin + path;
    setAlamat(url);
    QRCode.toString(url, {
      type: "svg",
      margin: 1,
      errorCorrectionLevel: "M",
      color: { dark: "#8F0F14", light: "#ffffff" },
    })
      .then(setSvg)
      .catch(() => setSvg(""));
  }, [path]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative rounded-2xl bg-white p-4 shadow-xl ring-4 ring-merah/80 sm:p-5">
        {/* sudut pita merah-putih kecil sebagai aksen */}
        <span aria-hidden className="strip-merah-putih absolute -top-1.5 left-6 right-6 h-1.5 rounded-full" />
        <div
          className="h-52 w-52 sm:h-64 sm:w-64 [&_svg]:h-full [&_svg]:w-full"
          role="img"
          aria-label={"Kode QR menuju " + alamat}
          dangerouslySetInnerHTML={{ __html: svg }}
        />
        {!svg && (
          <p className="absolute inset-0 flex items-center justify-center text-center text-xs text-slate-400">
            Menyiapkan kode QR…
          </p>
        )}
      </div>
      {alamat && (
        <p className="mt-3 break-all text-center font-mono text-xs text-slate-500">{alamat}</p>
      )}
    </div>
  );
}

/** Tombol cetak poster; disembunyikan saat halaman dicetak. */
export function TombolCetak() {
  return (
    <button
      onClick={() => window.print()}
      className="rounded-full bg-gradient-to-r from-merah to-merah-tua px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-red-200 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 print:hidden"
    >
      🖨️ Cetak poster ini
    </button>
  );
}
