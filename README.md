# HUT RI ke-81 · Kavling AL

Situs perayaan tujuh belasan tiga paguyuban Kavling AL: pendaftaran lomba,
rencana anggaran beserta realisasinya, laporan kas terbuka, rundown acara,
dan halaman dukungan warga (donasi, doorprize, konsumsi, tenaga, sponsor UMKM).
Database-nya satu Google Spreadsheet. Hosting-nya Vercel, gratis.

Halaman warga bisa dibuka siapa saja tanpa login. Halaman panitia di `/admin`
butuh nama pengguna dan password.

---

## Yang dibutuhkan

- Akun Google (untuk spreadsheet)
- Akun GitHub — gratis
- Akun Vercel — gratis, daftar cukup pakai GitHub

Tidak perlu Google Cloud Console. Tidak perlu memasang apa pun di komputer.
Sekitar 20 menit untuk yang pertama kali.

---

## 1. Siapkan spreadsheet

1. Buat Google Spreadsheet baru, beri nama misalnya `Kas HUT RI 81 Kavling AL`.
2. Menu **Ekstensi → Apps Script**.
3. Hapus isi editor, tempel seluruh isi `scripts/buat-spreadsheet.gs`, simpan.
4. Pilih fungsi `siapkanSpreadsheet`, klik **Jalankan**, izinkan aksesnya.
5. Kembali ke spreadsheet — sebelas tab sudah terbentuk beserta contoh isinya.

> **Spreadsheet lama yang belum punya tab `KategoriAnggaran`, `Dukungan`, atau
> tab voting pawai (`Nominasi`/`Suara`/`Pawai`)?**
> Tempel ulang `scripts/buat-spreadsheet.gs`, lalu jalankan fungsi
> `tambahTabKategoriAnggaran`, `tambahTabDukungan`, dan/atau `tambahTabPawai`
> sesuai tab yang belum ada (bukan `siapkanSpreadsheet` — fungsi itu
> mengosongkan semua tab). Ketiganya hanya membuat tab yang hilang, tidak
> menyentuh data lain. Setelah itu tempel ulang juga `scripts/api.gs` dan
> deploy ulang (Deploy → Manage deployments → Edit → Version: New version)
> supaya API mengenal tab barunya.

---

## 2. Hidupkan API spreadsheet

Masih di **Ekstensi → Apps Script**, pada spreadsheet yang sama:

1. Klik tanda **+** di samping Files, buat berkas skrip baru bernama `api`.
2. Tempel seluruh isi `scripts/api.gs` ke situ, lalu simpan.
3. Pilih fungsi `buatKunciApi`, klik **Jalankan**. Buka **Execution log**
   di bawah — di situ tercetak `APPS_SCRIPT_KUNCI=...`. **Salin dan simpan.**
4. Klik **Deploy → New deployment**. Pilih jenis **Web app**, lalu atur:
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Klik Deploy dan salin **Web app URL**-nya. Bentuknya
   `https://script.google.com/macros/s/AKfyc.../exec`. **Simpan juga.**

Sekarang Anda punya dua nilai: URL dan kunci. Itu saja yang dibutuhkan situs
untuk membaca dan menulis spreadsheet — tidak ada berkas JSON, tidak ada
private key, tidak ada Google Cloud.

> **Kenapa "Anyone" aman di sini?** Alamatnya memang bisa diakses siapa saja,
> tapi setiap permintaan wajib menyertakan kunci acak 64 karakter yang tadi
> Anda buat. Tanpa kunci itu, jawabannya selalu ditolak. Kuncinya hanya
> tersimpan di pengaturan Vercel, tidak pernah dikirim ke browser warga.

Kalau suatu saat kunci itu bocor, jalankan lagi `buatKunciApi` untuk membuat
kunci baru, lalu perbarui nilainya di Vercel. Kunci lama otomatis mati.

---

## 3. Siapkan login panitia

Butuh dua nilai lagi: `SESSION_SECRET` (string acak minimal 32 karakter) dan
`ADMIN_PASSWORD_HASH` (password yang sudah di-hash).

**Bila Node.js terpasang di komputer**, jalankan di dalam folder ini:

```bash
npm install
npm run hash -- "passwordpilihananda"
```

Salin baris `ADMIN_PASSWORD_HASH="..."` yang tercetak ke `.env.local` dan ke
Environment Variables di Vercel.

**Bila tidak**, pakai pasangan yang sudah disiapkan di catatan penyerahan,
lalu ganti belakangan ketika sempat.

Yang tersimpan hanya hash bcrypt-nya. Password aslinya tidak ada di mana pun
dalam sistem ini — termasuk tidak di pengaturan Vercel.

---

## 4. Naikkan ke Vercel

1. Unggah folder ini ke GitHub sebagai repository baru.
   Repo sudah berisi satu commit awal, jadi tinggal:

   ```bash
   git remote add origin https://github.com/NAMA_ANDA/NAMA_REPO.git
   git push -u origin main
   ```

   Berkas `.env.local` tidak akan ikut terunggah — sudah dijaga `.gitignore`.

2. Buka <https://vercel.com>, masuk dengan GitHub, klik **Add New → Project**,
   pilih repository tadi.

3. Sebelum menekan Deploy, buka **Environment Variables** dan isi lima nilai:

   | Nama | Isi |
   |---|---|
   | `APPS_SCRIPT_URL` | Web app URL dari langkah 2 |
   | `APPS_SCRIPT_KUNCI` | Kunci dari langkah 2 |
   | `ADMIN_USERNAME` | nama pengguna pilihan Anda |
   | `ADMIN_PASSWORD_HASH` | hash dari langkah 3 |
   | `SESSION_SECRET` | string acak dari langkah 3 |

4. **Deploy**. Sekitar dua menit kemudian situs hidup di `nama-project.vercel.app`.

### Memakai alamat sendiri

Domain `.my.id` sekitar Rp 15–20 ribu setahun di registrar lokal. Setelah dibeli,
tambahkan lewat **Settings → Domains** di Vercel dan ikuti petunjuk DNS-nya.
Alamat pendek jauh lebih enak dibagikan lewat broadcast WhatsApp.

---

## Kalau lebih suka jalur service account

Jalur Apps Script di atas cukup untuk skala satu kampung. Bila Anda sudah
terbiasa dengan Google Cloud atau butuh kuota lebih besar, kosongkan
`APPS_SCRIPT_URL` dan isi `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY`,
serta `SHEET_ID`. Kode memilih jalurnya sendiri; tidak ada yang perlu diubah.
Jangan lupa bagikan spreadsheet ke alamat service account sebagai **Editor**.

---

## Cara panitia memakainya

Buka `/admin`, masuk dengan nama pengguna dan password.

| Halaman | Untuk apa |
|---|---|
| Ringkasan | Kebutuhan anggaran, dana masuk/keluar, progress pendaftaran, rekap per minggu, dan hal yang perlu ditindaklanjuti |
| Kas | Menambah dan mengubah catatan uang masuk dan uang keluar |
| Anggaran | Mengatur pos anggaran dan pagunya. Kategori anggaran dipilih dari dropdown; daftar pilihannya diatur di tab `KategoriAnggaran` pada spreadsheet |
| Lomba | Menambah lomba, mengatur kuota dan biaya |
| Jadwal | Menyusun rundown acara |
| Pawai | Mengisi nominator Sepeda Hias & Kustom Pawai, membuka/menutup voting, melihat perolehan suara, dan menekan tombol pengumuman pemenang |
| Pendaftar | Melihat peserta per lomba, lengkap dengan tautan WhatsApp |
| Dukungan | Menindaklanjuti tawaran donasi, doorprize, dan bantuan warga yang masuk lewat halaman `/dukungan` |

Voting pawai kemerdekaan berjalan di halaman publik `/pawai`: sebelum dibuka
warga melihat hitung mundur, selama voting tiap HP hanya bisa memberi satu
suara per kategori (dikenali lewat cookie perangkat — penjagaan wajar untuk
voting kampung, bukan sistem pemilu), dan begitu panitia menekan "Umumkan
pemenang" halaman berubah menjadi panggung pengumuman beranimasi. Poster QR-nya
ada di `/pawai/qr` — tayangkan saat pentas seni dimulai. Perolehan suara
dirahasiakan dari warga sampai pengumuman; panitia bisa memantaunya kapan saja
dari halaman admin.

Warga menawarkan bantuan lewat halaman publik `/dukungan` — dana, doorprize,
konsumsi, barang, tenaga, atau sponsor UMKM. Nama dan bentuk dukungannya tampil
di papan dukungan sebagai apresiasi; nomor WhatsApp dan perkiraan nilainya hanya
terlihat panitia. Dana yang benar-benar diterima tetap dicatat sebagai uang
masuk di halaman kas supaya buku kas terbuka tetap satu-satunya sumber angka.

Perubahan langsung tersimpan ke spreadsheet. Halaman warga menyusul dalam waktu
sekitar satu menit karena hasilnya di-cache sebentar agar hemat kuota API.

Bendahara yang lebih nyaman bekerja langsung di spreadsheet tetap bisa melakukannya —
kedua cara menulis ke tempat yang sama.

---

## Catatan keamanan

- Password tidak pernah dikirim ke browser. Pemeriksaannya terjadi di server,
  dan yang disimpan hanya hash bcrypt.
- Sesi login dipegang cookie `httpOnly` yang ditandatangani, berlaku 8 jam.
  JavaScript di halaman tidak bisa membacanya.
- Seluruh alamat di bawah `/admin` dijaga middleware. API tulis memeriksa sesi
  sekali lagi secara terpisah, jadi tidak bisa ditembus hanya dengan menebak URL.
- API tulis hanya menerima nama tab dan nama kolom yang sudah terdaftar di
  `lib/skema.js`. Kiriman di luar daftar itu ditolak.
- Nomor WhatsApp pendaftar hanya muncul di halaman panitia, tidak di halaman warga.
- Kunci Apps Script hanya hidup di pengaturan Vercel, tidak pernah masuk ke repository maupun ke browser warga.
- Setiap penulisan ke spreadsheet dikunci sesaat (LockService), jadi dua pengurus yang menyimpan bersamaan tidak saling menimpa.

Satu hal yang perlu disepakati di luar kode: **password admin sebaiknya dipegang
dua orang saja**, misalnya ketua panitia dan bendahara. Semakin banyak yang tahu,
semakin sulit menelusuri siapa yang mengubah angka bila kelak ada selisih.

---

## Bila ada yang tidak jalan

| Gejala | Kemungkinan penyebab |
|---|---|
| Halaman warga menampilkan "Data belum bisa ditampilkan" | `APPS_SCRIPT_URL` atau `APPS_SCRIPT_KUNCI` salah, atau deployment Apps Script belum diatur "Anyone" |
| Login selalu ditolak | `ADMIN_PASSWORD_HASH` tersalin tidak utuh, atau masih memakai nilai contoh |
| Admin bisa membuka halaman tapi gagal menyimpan | Apps Script di-deploy dengan "Execute as" selain **Me** |
| Build Vercel gagal dengan keluhan `SESSION_SECRET` | Nilainya kurang dari 32 karakter |
| Angka di halaman warga belum berubah | Cache satu menit. Tunggu sebentar lalu muat ulang |
| Form dukungan atau halaman pawai menolak dengan "Tab tidak dikenal" atau "Tab belum ada di spreadsheet" | `scripts/api.gs` di Apps Script masih versi lama, atau tab `Dukungan`/`Nominasi`/`Suara`/`Pawai` belum dibuat — ikuti catatan migrasi di bagian 1 |
