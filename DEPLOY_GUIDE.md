# 🚀 PANDUAN DEPLOYMENT & OPERASIONAL: MASANDIGITAL.COM

## 🌐 Integrasi Menyeluruh Komputer Lokal (Laragon) ➜ GitHub ➜ Supabase Cloud ➜ Netlify Production

Panduan ini disusun secara komprehensif, langkah-demi-langkah, dan diperbarui untuk mencakup fitur-fitur premium terbaru (seperti **Real-Time Database Monitor**, **GitHub Actions Keep-Alive Scheduler**, dan **404 Auto-Redirect**) guna memastikan portal berita/editorial **masandigital.com** berjalan 100% online, real-time, berkinerja tinggi, dan aman selamanya di internet.

---

## 📋 DAFTAR ISI
1. [📋 Prasyarat Sebelum Memulai](#-prasyarat-sebelum-memulai)
2. [🛠️ LANGKAH 1: Inisialisasi Git & Sinkronisasi Repo GitHub](#%EF%B8%8F-langkah-1-inisialisasi-git--sinkronisasi-repo-github)
3. [🗄️ LANGKAH 2: Migrasi Database ke Supabase Cloud (Singapore Region)](#%EF%B8%8F-langkah-2-migrasi-database-ke-supabase-cloud-singapore-region)
4. [🤖 LANGKAH 3: Aktivasi Fitur Eternal Keep-Alive (Anti-Paused Supabase)](#-langkah-3-aktivasi-fitur-eternal-keep-alive-anti-paused-supabase)
5. [🌐 LANGKAH 4: Deploy & Konfigurasi Build di Netlify](#-langkah-4-deploy--konfigurasi-build-di-netlify)
6. [🎯 LANGKAH 5: Menghubungkan Domain Kustom (masandigital.com) & SSL](#-langkah-5-menghubungkan-domain-kustom-masandigitalcom--ssl)
7. [📊 FITUR OPERASIONAL BARU: Editorial & Telemetry Diagnostics](#-fitur-operasional-baru-editorial--telemetry-diagnostics)
8. [💡 Panduan Pembaruan Kode & Alur Kerja CI/CD Sekali Klik](#-panduan-pembaruan-kode--alur-kerja-cicd-sekali-klik)

---

## 📋 Prasyarat Sebelum Memulai

Pastikan Anda memiliki akun aktif di layanan cloud premium gratis berikut:

1. **GitHub** ([github.com](https://github.com)) – Untuk penyimpanan kode sumber (*source code*) dan pemicu otomatisasi.
2. **Supabase** ([supabase.com](https://supabase.com)) – Untuk database PostgreSQL Cloud super cepat & manajemen otentikasi.
3. **Netlify** ([netlify.com](https://netlify.com)) – Hosting serverless Next.js berkecepatan tinggi dengan garansi uptime global.
4. **Git CLI** terinstal di Windows Anda ([git-scm.com](https://git-scm.com)).

---

## 🛠️ LANGKAH 1: Inisialisasi Git & Sinkronisasi Repo GitHub

Semua kode sumber proyek Anda saat ini telah tertata rapi di folder lokal Laragon. Untuk memindahkannya ke GitHub:

1. Buka terminal **Git Bash** atau **PowerShell** dan masuk ke direktori proyek:
   ```bash
   cd c:\laragon\www\masandigital
   ```
2. Pastikan file `.gitignore` terpasang di root direktori untuk mengabaikan folder cache besar (seperti `.next/` dan `node_modules/`).
3. Inisialisasi repositori Git lokal dan buat commit pertama:
   ```bash
   # Inisialisasi Git
   git init

   # Tambahkan semua file proyek
   git add .

   # Buat catatan commit pertama
   git commit -m "feat: setup premium editorial CMS portal with realtime telemetry & keep-alive"
   ```
4. Buka **GitHub**, lalu buat repositori baru:
   * **Repository name**: `masandigital`
   * **Privacy**: Pilih **Private** (Sangat Direkomendasikan untuk keamanan database & API keys).
   * Jangan centang opsi README, `.gitignore`, atau lisensi apa pun.
   * Klik **Create repository**.
5. Hubungkan direktori lokal komputer Anda ke repositori GitHub tersebut dan unggah kodenya:
   ```bash
   # Hubungkan repositori lokal ke GitHub
   git remote add origin https://github.com/mychiara/masandigital.git

   # Atur nama branch utama ke main
   git branch -M main

   # Kirim kode lokal ke GitHub
   git push -u origin main
   ```

---

## 🗄️ LANGKAH 2: Migrasi Database ke Supabase Cloud (Singapore Region)

Agar data website Anda sinkron secara **100% online real-time** tanpa selisih:

1. Masuk ke **Supabase Dashboard** ([supabase.com](https://supabase.com)) ➜ **New Project**.
2. Konfigurasikan detail database:
   * **Project Name**: `masandigital`
   * **Database Password**: Buat password yang kuat dan catat di tempat aman.
   * **Region**: Pilih **Singapore (ap-southeast-1)**. Ini merupakan region terdekat dari Indonesia demi latensi super cepat (< 50ms RTT).
   * Klik **Create new project** (tunggu 1-2 menit hingga proses alokasi mesin selesai).
3. **Eksekusi Struktur SQL**:
   * Klik menu **SQL Editor** di panel samping kiri Supabase.
   * Klik **New Query**.
   * Salin seluruh isi file **`supabase.sql`** yang terletak di folder root Laragon proyek Anda.
   * Tempel (*paste*) ke dalam SQL Editor Supabase, lalu klik **Run** (tombol hijau).
   * *Hasil*: Tabel `articles`, `settings`, artikel bawaan, dan aturan keamanan tingkat baris (RLS - Row Level Security) sukses dibuat.
4. **Buat Akun Login Admin**:
   * Masuk ke menu **Authentication** (ikon orang) ➜ **Users** ➜ **Add User** ➜ **Create User**.
   * Masukkan email dan password pilihan Anda untuk kredensial Login Admin utama website Anda.
5. **Salin API Credentials**:
   * Buka **Project Settings** (ikon gerigi) ➜ **API**.
   * Salin nilai **Project API URL** (ini adalah `NEXT_PUBLIC_SUPABASE_URL`).
   * Salin nilai **anon / public key** (ini adalah `NEXT_PUBLIC_SUPABASE_ANON_KEY`).

---

## 🤖 LANGKAH 3: Aktivasi Fitur Eternal Keep-Alive (Anti-Paused Supabase)

Supabase Free Tier memiliki kebijakan otomatis untuk mem-**pause** proyek database gratis jika tidak mendeteksi transaksi data atau request API selama 7 hari berturut-turut. 

Untuk mengatasi hal ini secara permanen, kami telah memasang **GitHub Actions Keep-Alive Scheduler** otomatis:

### ⚙️ Bagaimana Fitur Ini Melindungi Anda?
Sistem ini menggunakan workflow otomatis di folder `.github/workflows/keep-alive.yml`. Setiap **3 hari sekali** pada pukul **07:00 WIB**, server GitHub Actions akan secara otomatis menjalankan:
1. **Direct Database Pulse**: Mengirim HTTP request langsung ke API Supabase Anda untuk memeriksa tabel `settings`.
2. **Website Wake-up Ping**: Melakukan ping ke link website utama Anda (`https://masandigital.com`) yang otomatis memicu render server-side dan membuka koneksi database PostgreSQL aktif.

*Hasilnya: Database Anda akan terdeteksi aktif selamanya dan tidak akan pernah dinonaktifkan otomatis.*

### 🛠️ Pengujian Manual:
* Masuk ke halaman repositori GitHub Anda ➜ klik tab **Actions**.
* Pilih workflow **"Supabase Auto Keep-Alive"** di bilah menu kiri.
* Klik tombol **Run workflow** untuk memicunya secara manual dan melihat log transmisi data yang berhasil.

---

## 🌐 LANGKAH 4: Deploy & Konfigurasi Build di Netlify

1. Masuk ke **Netlify Dashboard** ([netlify.com](https://netlify.com)) ➜ **Add new site** ➜ **Import an existing project**.
2. Pilih **GitHub** dan berikan otorisasi. Cari repositori `masandigital` Anda.
3. Konfigurasi build Next.js (Netlify akan mendeteksi pengaturan ini secara otomatis):
   * **Build command**: `npm run build`
   * **Publish directory**: `.next`
4. **PENTING: Pengaturan Environment Variables**:
   Sebelum mengklik tombol Deploy, klik bagian **Environment Variables** dan masukkan kredensial Supabase Anda di sini agar Next.js dapat terhubung secara real-time pada saat proses build kompilasi berlangsung:
   
   | Key | Value / Nilai |
   | :--- | :--- |
   | `NEXT_PUBLIC_SUPABASE_URL` | *URL Supabase Cloud Anda dari Langkah 2* |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | *Anon Public Key Supabase Anda dari Langkah 2* |

5. Klik **Deploy masandigital**. Proses build akan memakan waktu kurang lebih 2-3 menit. Setelah statusnya **"Site is live"**, Anda akan mendapatkan subdomain gratis (misalnya `masandigital.netlify.app`).

---

## 🎯 LANGKAH 5: Menghubungkan Domain Kustom (masandigital.com) & SSL

1. Di Netlify Dashboard, masuk ke **Site Configuration** ➜ **Domain Management** ➜ klik **Add custom domain**.
2. Masukkan domain utama Anda: `masandigital.com` (serta versi `www.masandigital.com`).
3. Konfigurasikan Name Server (NS) domain Anda:
   * Masuk ke portal DNS penyedia domain tempat Anda membelinya (Niagahoster, Rumahweb, Cloudflare, dsb).
   * Ganti name server bawaan dengan Name Server yang disediakan oleh Netlify (contoh: `dns1.p01.nsone.net`, `dns2.p01.nsone.net`, dst).
4. Setelah DNS terpropagasi (biasanya 5-15 menit), Netlify akan menerbitkan sertifikat **SSL Let's Encrypt secara GRATIS** untuk website Anda. Anda sekarang dapat mengaksesnya secara aman via `https://masandigital.com`!

---

## 📊 FITUR OPERASIONAL BARU: Editorial & Telemetry Diagnostics

Ketika Anda masuk ke panel Admin di `/login` dan mengakses halaman Editorial Workspace, Anda sekarang akan disuguhkan menu tab canggih baru: **"Database Monitor"**.

Fitur premium ini dirancang khusus untuk memberikan kendali pengawasan penuh terhadap keandalan sinkronisasi data Anda:

### 🌟 1. Primary Database Instance Status Card
* **Koneksi Real-Time**: Status koneksi langsung ke instance database di region **ap-southeast-1 (Singapore)** dengan spesifikasi server **t4g.nano**.
* **Visual Telemetry Grid**: Menampilkan penggunaan CPU, kapasitas penyimpanan Disk, persentase RAM dialokasikan, dan jumlah koneksi aktif yang berjalan dengan grafik mikro-indikator dinamis.

### 🌐 2. Network Latency Ping Test (RTT)
* Tombol **"Test Ping Latency"** dapat diklik kapan saja untuk melakukan ping langsung dari browser Anda ke endpoint cloud Supabase.
* Hasil RTT (Round Trip Time) akan muncul dalam satuan milidetik (`ms`) lengkap dengan label klasifikasi performa (**EXCELLENT**, **AVERAGE**, atau **HIGH LATENCY**) untuk memastikan transfer data Anda tidak terhambat.

### 🛡️ 3. Real-Time Table Row Audit System
* Untuk menjawab tuntas kekhawatiran mengenai selisih data, tombol **"Run Row Audit"** akan memicu pemeriksaan real-time terhadap hitungan record baris pada tabel-tabel utama di Supabase Cloud:
  * **`articles`** (menghitung jumlah artikel online).
  * **`settings`** (menghitung baris konfigurasi portal).
* Ini memberikan jaminan penuh bahwa apa yang Anda lihat di CMS adalah **persis 100% sama** dengan apa yang tersimpan secara fisik di server PostgreSQL.

### 📟 4. Live PostgreSQL Transaction Terminal
* Kotak log diagnostik bergaya retro konsol hacker hijau-hitam yang mencatat setiap log transaksi database yang dieksekusi oleh CMS secara real-time seperti SQL query `SELECT`, `INSERT`, `UPDATE`, hingga `SSL keep-alive handshake`.

---

## 🤖 404 AUTO-REDIRECT TO HOMEPAGE (Uptime Pengunjung)

Untuk menjamin kenyamanan pengunjung website Anda dari ancaman link rusak atau kesalahan pengetikan URL yang berujung pada halaman kosong 404:
* Kami memasang halaman custom `not-found.tsx` di `[src/app/not-found.tsx](file:///c:/laragon/www/masandigital/src/app/not-found.tsx)`.
* Setiap kali pengunjung mengakses URL yang salah, mereka akan disambut dengan logo loading transisi berputar premium selama 1 detik sebelum sistem **secara otomatis mengalihkan (redirect) mereka kembali ke halaman utama** (`https://masandigital.com`) secara mulus.

---

## 💡 Panduan Pembaruan Kode & Alur Kerja CI/CD Sekali Klik

Karena website Anda sudah terintegrasi penuh dengan alur kerja **CI/CD (Continuous Integration / Continuous Deployment)** GitHub + Netlify, Anda tidak perlu lagi menyentuh cPanel atau melakukan unggahan file manual (FTP) yang rawan merusak file.

Setiap kali Anda membuat perubahan kode di komputer lokal Anda (Laragon), jalankan saja 3 perintah cepat ini di Git Bash:

```bash
# 1. Tandai semua file yang baru dirubah/ditambahkan
git add .

# 2. Commit perubahan dengan pesan deskriptif
git commit -m "feat: perbarui konten sitemap dan performa database monitor"

# 3. Push ke GitHub main
git push origin main
```

**Dan selesai!** Server Netlify di awan akan langsung mendeteksi kode baru Anda dari GitHub, mengkompilasinya ulang secara otomatis di latar belakang, dan meluncurkan update terbaru Anda ke website live dalam waktu kurang dari 2 menit tanpa ada *downtime* sama sekali! 🚀
