# 🚀 PANDUAN DEPLOYMENT: MASANDIGITAL.COM

## Dari Komputer Lokal (Laragon) ke GitHub, Supabase, dan Netlify

Panduan ini disusun secara langkah-demi-langkah untuk membantu Anda memindahkan seluruh kode sumber website **masandigital.com** dari lingkungan lokal Windows (Laragon) menuju server produksi yang stabil, cepat, dan 100% aman di cloud.

---

## 📋 Prasyarat Sebelum Memulai

Pastikan Anda sudah memiliki akun di layanan berikut:

1. **GitHub** ([github.com](https://github.com)) - Untuk menyimpan source code secara aman.
2. **Supabase** ([supabase.com](https://supabase.com)) - Untuk database awan (Cloud Database) & Autentikasi.
3. **Netlify** ([netlify.com](https://netlify.com)) - Untuk hosting frontend Next.js yang super cepat dan gratis.
4. **Git** terinstal di komputer Windows Anda ([git-scm.com](https://git-scm.com)).

---

## 🛠️ LANGKAH 1: Inisialisasi Git & Upload Kode ke GitHub

1. Buka terminal **Git Bash** atau Command Prompt (CMD) di dalam direktori proyek Anda:
   ```bash
   cd c:\laragon\www\masandigital
   ```
2. Pastikan file `.gitignore` sudah ada di root folder untuk mencegah folder besar (seperti `node_modules` atau `.next`) ikut terupload. (File `.gitignore` sudah saya siapkan secara otomatis).
3. Jalankan perintah inisialisasi Git secara berurutan:

   ```bash
   # 1. Inisialisasi repositori Git lokal
   git init

   # 2. Tambahkan semua file ke area staging
   git add .

   # 3. Lakukan commit pertama Anda
   git commit -m "Initial commit - Premium Editorial CMS Portal"
   ```

4. Buka **GitHub** Anda, klik tombol **New** untuk membuat repositori baru:
   - **Repository name**: `masandigital`
   - **Public/Private**: Pilih **Private** jika Anda ingin merahasiakan source code Anda (Sangat Direkomendasikan).
   - Jangan centang _"Add a README file"_, _"Add .gitignore"_, atau _"Choose a license"_ karena kita sudah memilikinya secara lokal.
   - Klik **Create repository**.
5. Salin tautan repositori GitHub Anda, lalu jalankan perintah berikut di terminal komputer Anda untuk menghubungkannya:

   ```bash
   # Hubungkan folder lokal ke GitHub (ganti USERNAME dengan username GitHub Anda)
   git remote add origin https://github.com/mychiara/masandigital.git

   # Set nama branch utama ke main
   git branch -M main

   # Upload seluruh kode ke GitHub
   git push -u origin main
   ```

---

## 🗄️ LANGKAH 2: Migrasi Database ke Supabase

1. Masuk ke **Supabase Dashboard** ([supabase.com](https://supabase.com)) dan klik **New Project**.
2. Isikan detail proyek Anda:
   - **Project Name**: `masandigital`
   - **Database Password**: Buat password yang kuat dan catat secara aman.
   - **Region**: Pilih region terdekat (misalnya: `Singapore - ap-southeast-1` untuk akses tercepat dari Indonesia).
   - Klik **Create new project** (tunggu sekitar 1-2 menit hingga database selesai disiapkan).
3. Setelah proyek aktif, klik menu **SQL Editor** di bilah sisi kiri dashboard Supabase Anda.
4. Klik tombol **New Query**.
5. Buka file `supabase.sql` di komputer Anda, salin seluruh isi kodenya, lalu tempel (_paste_) di SQL Editor Supabase.
6. Klik tombol **Run** (tombol berwarna hijau di kanan atas) untuk mengeksekusi script SQL.
   - _Status sukses_: Skema tabel `articles`, `settings`, artikel demo awal, serta seluruh aturan **Row Level Security (RLS)** yang ketat akan langsung terpasang di database cloud Anda.
7. Masuk ke menu **Authentication** (ikon orang) -> **Users** -> Klik **Add User** -> **Create User**. Buatlah akun administrator utama Anda di sini (masukkan email dan password pilihan Anda). Akun inilah yang akan Anda gunakan untuk login sebagai Admin.
8. Masuk ke menu **Project Settings** (ikon gerigi) -> **API** di sisi kiri, lalu salin nilai dari:
   - **Project API URL** (Ini adalah `NEXT_PUBLIC_SUPABASE_URL`)
   - **anon / public** (Ini adalah `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

---

## 🌐 LANGKAH 3: Deploy Website ke Netlify

1. Masuk ke **Netlify Dashboard** ([netlify.com](https://netlify.com)).
2. Klik tombol **Add new site** di kanan atas -> Pilih **Import an existing project**.
3. Pilih **GitHub** sebagai provider Anda (otorisasikan koneksi akun jika baru pertama kali).
4. Cari dan pilih repositori `masandigital` yang Anda buat pada Langkah 1.
5. Netlify secara otomatis mendeteksi bahwa ini adalah proyek Next.js dan akan mengatur konfigurasi build secara otomatis:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `.next` (atau diatur otomatis oleh plugin Next.js Netlify).
6. Sebelum mengklik Deploy, gulir ke bawah ke bagian **Environment Variables** (Variabel Lingkungan) dan klik **Add Variable** (ini adalah langkah kritikal agar website bisa terhubung dengan Supabase):
   - Masukkan variable pertama:
     - **Key**: `NEXT_PUBLIC_SUPABASE_URL`
     - **Value**: _(Tempelkan URL Supabase yang Anda salin pada Langkah 2 poin 8)_
   - Masukkan variable kedua:
     - **Key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - **Value**: _(Tempelkan Anon Key Supabase yang Anda salin pada Langkah 2 poin 8)_
7. Klik tombol **Deploy masandigital**!
8. Netlify akan mulai memproses kompilasi kode Anda. Anda dapat memantau log build secara langsung di panel tersebut. Proses ini memakan waktu sekitar 2-3 menit.
9. Setelah selesai (_Site is live_), Netlify akan memberikan URL acak gratis (contoh: `https://masandigital.netlify.app`). Klik tautan tersebut untuk menguji website Anda yang sudah mengudara!

---

## 🎯 LANGKAH 4: Menghubungkan Domain Kustom (masandigital.com)

Jika Anda ingin website Netlify Anda diakses langsung menggunakan domain kustom Anda `masandigital.com`:

1. Di Netlify Dashboard, masuk ke menu **Site Configuration** -> **Domain Management** -> klik **Add custom domain**.
2. Masukkan nama domain Anda: `masandigital.com` (dan `www.masandigital.com`).
3. Netlify akan memberikan instruksi konfigurasi DNS:
   - **Opsi Terbaik**: Ubah Name Server (NS) domain Anda di penyedia domain Anda (seperti Niagahoster/Rumahweb/IDCloudHost) ke Name Server milik Netlify (misalnya: `dns1.p01.nsone.net`, dst).
   - **Opsi Alternatif**: Tambahkan rekor **CNAME** untuk `www` yang mengarah ke URL Netlify Anda, dan rekor **A** untuk `@` (root domain) yang mengarah ke IP Netlify.
4. Tunggu proses propagasi DNS (biasanya berkisar 5 menit hingga beberapa jam).
5. Setelah terhubung, Netlify secara otomatis akan menerbitkan sertifikat **SSL Let's Encrypt GRATIS** untuk mengamankan situs Anda dengan jalur HTTPS (`https://masandigital.com`).

---

## 💡 Tips & Cara Update Kode di Masa Depan

Kelebihan utama menggunakan integrasi GitHub + Netlify adalah fitur **Continuous Integration & Continuous Deployment (CI/CD)**:

Setiap kali Anda mengubah kode secara lokal di Laragon dan ingin meng-update website di internet, Anda **tidak perlu mengunggah file manual lagi**. Anda cukup menjalankan 3 perintah sederhana ini di terminal lokal Anda:

```bash
# 1. Tandai semua file yang diubah
git add .

# 2. Tulis catatan perubahan
git commit -m "Update fitur: Penambahan animasi baru"

# 3. Kirim ke GitHub
git push origin main
```

Netlify akan otomatis mendeteksi perubahan tersebut di GitHub, melakukan proses build ulang di latar belakang, dan memperbarui website live Anda dalam hitungan menit secara otomatis tanpa downtime!
