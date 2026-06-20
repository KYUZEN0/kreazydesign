# Kreazy.Design — Website

Website pemesanan untuk Kreazy.Design. Dibangun dengan Next.js, Tailwind CSS,
dan Firebase Firestore sebagai database. Form order tersimpan ke database
lalu mengarahkan pelanggan ke WhatsApp dengan ringkasan pesanan.

## Kenapa arsitekturnya seperti ini (soal keamanan API key)

Banyak tutorial Firebase menaruh konfigurasi Firebase langsung di kode
client (browser). Itu sebenarnya **bukan rahasia** menurut Firebase — tapi
itu juga berarti siapa pun bisa melihatnya dan, kalau Security Rules
Firestore kamu longgar, bisa menulis data sembarangan ke database kamu.

Supaya order kamu lebih terlindungi, situs ini didesain berbeda:

- Form order di browser **tidak** terhubung langsung ke Firebase.
- Form mengirim data ke `/api/order`, sebuah API route yang **berjalan di
  server** (bukan di browser pengguna).
- API route itu yang berbicara ke Firestore, menggunakan **Firebase Admin
  SDK** dan **service account key** — kredensial ini hanya disimpan sebagai
  *environment variable* di server/Vercel, tidak pernah ikut terkirim ke
  kode yang dibuka di browser pengguna.
- API route juga memvalidasi data (nama wajib diisi, nomor WhatsApp valid,
  layanan harus salah satu dari daftar resmi) dan punya pembatasan jumlah
  request per IP, supaya tidak gampang dibanjiri spam.

Jadi kunci rahasia Firebase kamu betul-betul terpisah dari kode publik.

## Struktur folder penting

```
app/
  page.tsx              -> halaman utama (semua section)
  api/order/route.ts     -> API route aman yang menulis ke Firestore
components/               -> Nav, Hero, Services, About, Testimonials, OrderForm, Footer
lib/
  content.ts              -> isi teks, daftar layanan, nomor WhatsApp
  firebaseAdmin.ts         -> koneksi server-only ke Firebase
.env.local.example         -> contoh format environment variable
```

## 1. Setup Firebase

1. Buka [Firebase Console](https://console.firebase.google.com), buat
   project baru (atau pakai yang sudah ada).
2. Di menu kiri, buka **Build → Firestore Database**, klik **Create
   database**, pilih mode **production**.
3. Buka **Project settings (ikon gerigi) → Service accounts**.
4. Klik **Generate new private key**. Sebuah file `.json` akan terunduh —
   **simpan file ini baik-baik dan jangan pernah dibagikan atau di-upload
   ke GitHub.**
5. Dari file JSON tadi, kamu butuh 3 nilai untuk environment variable:
   - `project_id` → jadi `FIREBASE_PROJECT_ID`
   - `client_email` → jadi `FIREBASE_CLIENT_EMAIL`
   - `private_key` → jadi `FIREBASE_PRIVATE_KEY` (salin apa adanya, termasuk
     `\n` di dalamnya)

### Atur Security Rules Firestore

Karena semua tulis-menulis lewat Admin SDK di server (yang punya akses
penuh), kamu bisa kunci akses langsung dari browser sepenuhnya. Di
**Firestore Database → Rules**, gunakan:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

Ini berarti: tidak ada satu pun klien browser yang bisa baca/tulis langsung
ke database — hanya server (Admin SDK) yang bisa, sesuai arsitektur situs
ini.

## 2. Jalankan di lokal (opsional, untuk testing sebelum deploy)

```bash
npm install
cp .env.local.example .env.local
# isi .env.local dengan kredensial dari langkah 1
npm run dev
```

Buka `http://localhost:3000`.

## 3. Ganti nomor WhatsApp & isi konten

Buka `lib/content.ts`:

- `siteConfig.whatsappNumber` → ganti dengan nomor WhatsApp bisnis kamu,
  format `62xxxxxxxxxx` (tanpa `+` atau `0` di depan).
- `testimonials` → ganti dengan testimoni asli dari pelanggan kamu.
- `services` → sesuaikan kalau ada perubahan harga/layanan.

## 4. Deploy ke Vercel

1. Push folder ini ke repository GitHub (file `.env.local` otomatis tidak
   ikut ter-push karena ada di `.gitignore`).
2. Buka [vercel.com](https://vercel.com), klik **Add New → Project**, lalu
   import repository tadi.
3. Sebelum klik Deploy, buka bagian **Environment Variables** dan tambahkan
   tiga variabel ini (nilainya dari file JSON service account di langkah 1):
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_CLIENT_EMAIL`
   - `FIREBASE_PRIVATE_KEY` (tempel apa adanya termasuk `\n`)
4. Klik **Deploy**.

Setelah deploy selesai, setiap order yang masuk lewat website akan otomatis
tersimpan di koleksi `orders` pada Firestore, dan pelanggan akan diarahkan
ke WhatsApp kamu dengan ringkasan pesanan yang sudah terisi otomatis.

## 5. Melihat data order yang masuk

Buka Firebase Console → Firestore Database → koleksi `orders`. Setiap
dokumen berisi nama, nomor WhatsApp, layanan yang dipilih, detail
kebutuhan, deadline, status (`baru`), dan waktu order dibuat.

## Mengganti tampilan

- Warna & font diatur di `tailwind.config.js` dan `app/globals.css`.
- Teks hero, deskripsi, dan struktur halaman ada langsung di masing-masing
  file di folder `components/`.
