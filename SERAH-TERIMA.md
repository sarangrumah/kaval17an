# Catatan serah terima

Ceklis ini menandai apa yang sudah selesai dan apa yang tinggal Anda kerjakan.

## Sudah selesai

- [x] Seluruh kode situs, sudah diuji build tanpa error
- [x] Diuji ujung-ke-ujung dengan data tiruan: perhitungan saldo, deteksi pos
      yang melewati pagu, kuota lomba penuh, catatan berstatus `batal` yang
      berhenti dihitung, penjagaan halaman admin, dan penolakan API tulis
      tanpa sesi — semuanya berperilaku benar
- [x] Skrip penyiap spreadsheet (`scripts/buat-spreadsheet.gs`)
- [x] Skrip API spreadsheet (`scripts/api.gs`)
- [x] Repository git dengan commit awal, tinggal `git push`
- [x] Kunci sesi dan pasangan password sudah dibuatkan (lihat di bawah)

## Tinggal Anda kerjakan — semuanya di akun Anda sendiri

| # | Langkah | Perkiraan |
|---|---|---|
| 1 | Buat spreadsheet, jalankan `buat-spreadsheet.gs` | 5 menit |
| 2 | Tempel `api.gs`, jalankan `buatKunciApi`, deploy sebagai Web app | 7 menit |
| 3 | Push repo ini ke GitHub | 3 menit |
| 4 | Import di Vercel, isi 5 environment variable, Deploy | 5 menit |

Panduan rincinya ada di `README.md`.

## Nilai yang sudah disiapkan

Kunci penanda tangan cookie sesi — tempel apa adanya ke Vercel:

```
SESSION_SECRET="chIyM5079gmsIONWS7deh7h/0PUrUS/dtkMInyTSoq0="
```

Pasangan login sementara:

```
ADMIN_USERNAME="bendahara"
ADMIN_PASSWORD_HASH="$2a$10$j/bsFYdn/1wos29lKHAuSec7kxBdBMmQyo8jWnA4rulDRMpytvCVC"
```

Password untuk pasangan hash di atas adalah **panggung-merdeka-2227**.

Dua catatan tentang password ini. Pertama, password itu tertulis di riwayat
percakapan tempat berkas ini dibuat, jadi perlakukan sebagai sementara —
ganti dengan `npm run hash -- "passwordbaru"` begitu sempat. Kedua, sebaiknya
hanya dua orang yang memegangnya, misalnya ketua panitia dan bendahara.
Semakin banyak yang tahu, semakin sulit menelusuri siapa yang mengubah angka
bila kelak ada selisih.
