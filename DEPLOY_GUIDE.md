# 🚀 PANDUAN DEPLOYMENT & OPERASIONAL: MASANDIGITAL.COM

## 🌐 Integrasi Menyeluruh Komputer Lokal (Laragon) ➜ GitHub ➜ Supabase Cloud ➜ Netlify Production

Panduan ini disusun secara komprehensif dan diperbarui hingga **Mei 2026** mencakup seluruh fitur premium portal berita/editorial **masandigital.com** — termasuk **SEO Traffic Multiplier Engine**, **Database Performance Optimization**, **Glassmorphic Admin UI**, **RSS Feed**, **Dynamic Sitemap**, dan **Instant Indexing Console**.

---

## 📋 DAFTAR ISI

1. [📋 Prasyarat Sebelum Memulai](#-prasyarat-sebelum-memulai)
2. [🛠️ LANGKAH 1: Inisialisasi Git & Sinkronisasi Repo GitHub](#%EF%B8%8F-langkah-1-inisialisasi-git--sinkronisasi-repo-github)
3. [🗄️ LANGKAH 2: Migrasi Database ke Supabase Cloud](#%EF%B8%8F-langkah-2-migrasi-database-ke-supabase-cloud-singapore-region)
4. [🤖 LANGKAH 3: Aktivasi Eternal Keep-Alive (Anti-Paused)](#-langkah-3-aktivasi-fitur-eternal-keep-alive-anti-paused-supabase)
5. [🌐 LANGKAH 4: Deploy & Konfigurasi Build di Netlify](#-langkah-4-deploy--konfigurasi-build-di-netlify)
6. [🎯 LANGKAH 5: Domain Kustom & SSL](#-langkah-5-menghubungkan-domain-kustom-masandigitalcom--ssl)
7. [⚡ LANGKAH 6: Optimasi Database (RPC Function)](#-langkah-6-optimasi-database-supabase-rpc-function)
8. [🔍 LANGKAH 7: Konfigurasi SEO & Instant Indexing](#-langkah-7-konfigurasi-seo--instant-indexing)
9. [📊 FITUR OPERASIONAL: Dashboard & Diagnostics](#-fitur-operasional-dashboard--diagnostics)
10. [🚀 FITUR SEO TRAFFIC MULTIPLIER](#-fitur-seo-traffic-multiplier)
11. [⚙️ ARSITEKTUR DATABASE PERFORMA TINGGI](#%EF%B8%8F-arsitektur-database-performa-tinggi)
12. [💡 Panduan Pembaruan Kode & CI/CD](#-panduan-pembaruan-kode--alur-kerja-cicd-sekali-klik)

---

## 📋 Prasyarat Sebelum Memulai

Pastikan Anda memiliki akun aktif di layanan cloud premium gratis berikut:

1. **GitHub** ([github.com](https://github.com)) – Untuk penyimpanan kode sumber (*source code*) dan pemicu otomatisasi.
2. **Supabase** ([supabase.com](https://supabase.com)) – Untuk database PostgreSQL Cloud super cepat & manajemen otentikasi.
3. **Netlify** ([netlify.com](https://netlify.com)) – Hosting serverless Next.js berkecepatan tinggi dengan garansi uptime global.
4. **Git CLI** terinstal di Windows Anda ([git-scm.com](https://git-scm.com)).

---

## 🛠️ LANGKAH 1: Inisialisasi Git & Sinkronisasi Repo GitHub

1. Buka terminal **Git Bash** atau **PowerShell** dan masuk ke direktori proyek:
   ```bash
   cd c:\laragon\www\masandigital
   ```
2. Pastikan file `.gitignore` terpasang di root direktori untuk mengabaikan folder cache besar (`.next/`, `node_modules/`).
3. Inisialisasi repositori Git lokal dan buat commit pertama:
   ```bash
   git init
   git add .
   git commit -m "feat: setup premium editorial CMS portal"
   ```
4. Buka **GitHub**, buat repositori baru:
   * **Repository name**: `masandigital`
   * **Privacy**: **Private** (sangat direkomendasikan)
   * Jangan centang opsi README, `.gitignore`, atau lisensi apa pun.
5. Hubungkan dan push:
   ```bash
   git remote add origin https://github.com/mychiara/masandigital.git
   git branch -M main
   git push -u origin main
   ```

---

## 🗄️ LANGKAH 2: Migrasi Database ke Supabase Cloud (Singapore Region)

1. Masuk ke **Supabase Dashboard** ➜ **New Project**.
2. Konfigurasi:
   * **Project Name**: `masandigital`
   * **Database Password**: Buat password kuat dan catat.
   * **Region**: **Singapore (ap-southeast-1)** — latensi terkecil dari Indonesia (<50ms RTT).
3. **Eksekusi Struktur SQL**:
   * Menu **SQL Editor** ➜ **New Query**.
   * Salin seluruh isi file **`supabase.sql`** dari folder root proyek ➜ paste ➜ klik **Run**.
   * *Hasil*: Tabel `articles`, `settings`, artikel bawaan, dan RLS sukses dibuat.
4. **Buat Akun Login Admin**:
   * Menu **Authentication** ➜ **Users** ➜ **Add User** ➜ **Create User**.
   * Masukkan email dan password untuk kredensial admin.
5. **Salin API Credentials**:
   * **Project Settings** ➜ **API**.
   * Salin **Project API URL** (`NEXT_PUBLIC_SUPABASE_URL`).
   * Salin **anon / public key** (`NEXT_PUBLIC_SUPABASE_ANON_KEY`).

---

## 🤖 LANGKAH 3: Aktivasi Fitur Eternal Keep-Alive (Anti-Paused Supabase)

Supabase Free Tier mem-**pause** proyek jika tidak ada aktivitas selama 7 hari.

Sistem **GitHub Actions Keep-Alive Scheduler** (`.github/workflows/keep-alive.yml`) secara otomatis setiap **3 hari sekali** pukul **07:00 WIB**:
1. Mengirim HTTP request langsung ke API Supabase (tabel `settings`).
2. Melakukan ping ke `https://masandigital.com` untuk memicu render server-side.

### 🛠️ Pengujian Manual:
* GitHub Repo ➜ tab **Actions** ➜ pilih **"Supabase Auto Keep-Alive"** ➜ klik **Run workflow**.

---

## 🌐 LANGKAH 4: Deploy & Konfigurasi Build di Netlify

1. **Netlify Dashboard** ➜ **Add new site** ➜ **Import an existing project** ➜ pilih **GitHub**.
2. Pilih repo `masandigital`.
3. Konfigurasi build:
   * **Build command**: `npm run build`
   * **Publish directory**: `.next`
4. **Environment Variables** (WAJIB sebelum Deploy):

   | Key | Value |
   | :--- | :--- |
   | `NEXT_PUBLIC_SUPABASE_URL` | *URL Supabase Cloud dari Langkah 2* |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | *Anon Public Key dari Langkah 2* |

5. Klik **Deploy masandigital** — proses build ±2-3 menit.

---

## 🎯 LANGKAH 5: Menghubungkan Domain Kustom (masandigital.com) & SSL

1. Netlify Dashboard ➜ **Site Configuration** ➜ **Domain Management** ➜ **Add custom domain**.
2. Masukkan `masandigital.com` dan `www.masandigital.com`.
3. Ganti Name Server domain Anda di penyedia domain (Niagahoster/Cloudflare/dll) ke Name Server yang diberikan Netlify.
4. Setelah propagasi DNS (5-15 menit), sertifikat **SSL Let's Encrypt** diterbitkan otomatis gratis.

---

## ⚡ LANGKAH 6: Optimasi Database — Supabase RPC Function

Untuk performa **increment views 2x lebih cepat** (1 query atomic, bukan 2 query), jalankan SQL berikut di **Supabase SQL Editor**:

```sql
-- Atomic view counter (single query instead of SELECT + UPDATE)
CREATE OR REPLACE FUNCTION increment_views(row_id uuid)
RETURNS integer AS $$
  UPDATE articles SET views = views + 1
  WHERE id = row_id RETURNING views;
$$ LANGUAGE sql;
```

> **Catatan**: Tanpa fungsi ini, sistem tetap berjalan normal menggunakan fallback 2-query. RPC function ini hanya menambahkan optimasi kecepatan ekstra.

---

## 🔍 LANGKAH 7: Konfigurasi SEO & Instant Indexing

Semua konfigurasi SEO tersedia di panel Admin ➜ tab **Settings**:

### Google Search Console Indexing API
1. Buka [Google Search Console](https://search.google.com/search-console) ➜ tambahkan property `masandigital.com`.
2. Salin **meta tag verifikasi** Google (contoh: `google1234567890abcde`).
3. Paste di Admin ➜ Settings ➜ **Google Site Verification (GSC Tag)**.

### Bing Webmaster & IndexNow API
1. Daftar di [Bing Webmaster Tools](https://www.bing.com/webmasters).
2. Salin API Key Bing.
3. Paste di Admin ➜ Settings ➜ **Bing API Key**.
4. Token verifikasi IndexNow sudah tersedia di: `public/f565b93d39504505bf77df4c74070a25.txt`

### Instant Indexing Console (Admin Panel)
* Tab **SEO Center** ➜ bagian **Status Indeksasi Publikasi Aktif**
* Klik **Request Indexing** per-artikel atau **Request Indexing Seluruhnya** untuk bulk submission.
* Status **INDEXED** tersimpan di `localStorage` dan bertahan setelah refresh halaman.
* Popup sukses ditampilkan dalam modal **glassmorphic premium** (bukan `alert()` browser).

---

## 📊 FITUR OPERASIONAL: Dashboard & Diagnostics

### 🗄️ Database Monitor (Admin ➜ Tab "Database Monitor")
* **Primary Instance Status**: Koneksi real-time ke region **ap-southeast-1 (Singapore)**.
* **Ping Latency Test (RTT)**: Ukur response time Supabase dalam milidetik.
* **Row Audit System**: Verifikasi hitungan record tabel `articles` dan `settings` real-time.
* **PostgreSQL Transaction Terminal**: Log diagnostik bergaya konsol hijau-hitam.

### 🤖 AI Auto-Generator (Admin ➜ Tab "Auto Generator")
* Dukungan provider: **Google Gemini**, **OpenAI**, dan **Simulasi Lokal**.
* Generasi artikel massal dengan jadwal interval terbit otomatis.
* Target jumlah kata (500–5000 kata), kategori otomatis, dan tag SEO.

### 📰 SEO Control Center (Admin ➜ Tab "SEO Center")
* **Live SEO Score Calculator**: Analisis real-time judul, slug, deskripsi, dan focus keyword.
* **Keyword Density Auditor**: Optimal 1.5%–2.5% untuk menghindari stuffing penalty.
* **SERP Preview**: Pratinjau tampilan di Google untuk mobile dan desktop.
* **AI Content Brief Generator**: Generasi outline dan struktur artikel otomatis.

### 📦 Article Import/Export (Admin Panel)
* Import artikel via JSON paste langsung di panel admin.
* Dukungan format data lengkap dengan validasi otomatis.

---

## 🚀 FITUR SEO TRAFFIC MULTIPLIER

Fitur-fitur berikut telah terintegrasi untuk memaksimalkan indeksasi, trafik organik, dan retensi pembaca:

### 1. Dynamic RSS 2.0 Feed (`/feed.xml`)
* 30 artikel terbaru dengan `content:encoded` lengkap.
* Enclosure WebP untuk kompatibilitas **Google Discover**.
* Header XML: `xmlns:content`, `xmlns:dc`, `xmlns:media`.

### 2. Dynamic XML Sitemap (`/sitemap.xml`)
* Semua artikel published dengan priority `0.9` dan frequency `daily`.
* Halaman statis (about, contact, privacy, terms, disclaimer) otomatis termasuk.

### 3. SEO Internal Link Auto-Linker Engine
* Otomatis mendeteksi judul artikel lain di dalam konten artikel.
* Menyisipkan hyperlink internal `<a>` secara server-side.
* Maksimal 15 kandidat per artikel (white-hat Google-friendly).
* Menghindari penempatan di dalam tag HTML atau markdown bracket.

### 4. Navbar Trending Ticker Widget
* Bilah atas vertikal scrolling menampilkan 5 topik terpopuler.
* Berbasis akumulasi `views` dari artikel terkini.

### 5. Dynamic "Baca Juga" (Related Articles)
* Kartu related articles disebarkan otomatis setiap **3 paragraf** di dalam artikel.
* Meningkatkan internal linking flow dan retensi pembaca.

### 6. Rich Article Layout Engine
* **Drop Cap** megah pada paragraf pembuka.
* Deteksi otomatis heading sub-bab (Markdown `##` atau kalimat pendek tanpa titik).
* Perataan justify dengan border dekoratif biru pada subheading.
* FAQ Schema JSON-LD untuk Google Rich Snippets.

### 7. IndexNow Verification
* Token file: `public/f565b93d39504505bf77df4c74070a25.txt`
* Otomatis ditemukan oleh Bing Bot saat crawling.

---

## ⚙️ ARSITEKTUR DATABASE PERFORMA TINGGI

### Tiered Caching System (`src/lib/db.ts`)

| Cache Layer | TTL | Deskripsi |
| :--- | :--- | :--- |
| `articlesLight` | **60 detik** | Daftar artikel TANPA kolom `content` (hemat MB transfer) |
| `articlesFull` | **30 detik** | Artikel lengkap (untuk admin & RSS feed) |
| `settings` | **120 detik** | Pengaturan situs (jarang berubah) |
| `articleBySlug` | **30 detik** | Cache per-artikel individual |

### Optimasi yang Aktif:

1. **Selective Column Fetch**: Homepage, sitemap, sidebar, auto-linker hanya mengambil kolom ringan (`id, title, slug, excerpt, category, views, ...`) — kolom `content` (puluhan KB) tidak diambil.

2. **Stale-While-Revalidate**: Jika cache expired tapi data lama masih ada, data lama langsung dikembalikan ke user sambil refresh di background. User tidak pernah menunggu.

3. **Request Coalescing**: Mencegah duplikasi query paralel ke Supabase saat banyak request masuk bersamaan.

4. **Fire-and-Forget View Counter**: `incrementViews()` mencoba RPC atomic dulu, fallback ke 2-query. Update kedua cache (light + full) secara bersamaan.

5. **Cache Warming**: Saat server Next.js start, `articlesLight` + `settings` langsung di-pre-fetch secara otomatis. Visitor pertama tidak kena cold start.

### Caller Mapping:

| Halaman / Fitur | Method | Alasan |
| :--- | :--- | :--- |
| Homepage | `getArticlesLight()` | Tidak butuh content |
| Sitemap | `getArticlesLight()` | Hanya perlu slug + tanggal |
| Auto-Linker | `getArticlesLight()` | Hanya perlu title + slug |
| Related Articles | `getArticlesLight()` | Tidak butuh content |
| generateStaticParams | `getArticlesLight()` | Hanya perlu slug |
| RSS Feed (`/feed.xml`) | `getArticles()` | Butuh content lengkap |
| Admin Panel | `getArticles()` | Butuh content untuk editing |

---

## 🤖 404 AUTO-REDIRECT TO HOMEPAGE

* Halaman custom `not-found.tsx` di `src/app/not-found.tsx`.
* Loading transisi premium selama 1 detik sebelum redirect otomatis ke beranda.

---

## 💡 Panduan Pembaruan Kode & Alur Kerja CI/CD Sekali Klik

Website sudah terintegrasi penuh dengan alur **CI/CD** GitHub + Netlify. Setiap perubahan kode, jalankan:

```bash
# 1. Tandai semua file yang dirubah
git add .

# 2. Commit dengan pesan deskriptif
git commit -m "feat: optimasi database dan fitur SEO baru"

# 3. Push ke GitHub
git push origin main
```

**Selesai!** Netlify langsung mendeteksi, build ulang, dan deploy dalam <2 menit tanpa downtime! 🚀

---

## 📁 STRUKTUR FILE UTAMA

```
masandigital/
├── .env.local                          # API keys Supabase (JANGAN commit!)
├── .github/workflows/keep-alive.yml    # Auto keep-alive scheduler
├── public/
│   └── f565b93d39504505bf77df4c74070a25.txt  # IndexNow verification token
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Homepage (client-side)
│   │   ├── layout.tsx                  # Root layout + SEO metadata
│   │   ├── sitemap.ts                  # Dynamic XML sitemap
│   │   ├── robots.ts                   # robots.txt generator
│   │   ├── not-found.tsx               # 404 auto-redirect
│   │   ├── admin/page.tsx              # Admin dashboard + SEO Center
│   │   ├── admin/edit/page.tsx         # Article editor
│   │   ├── article/[slug]/page.tsx     # Article SSG + auto-linker
│   │   ├── article/[slug]/ArticleClient.tsx  # Client-side article reader
│   │   ├── feed.xml/route.ts           # Dynamic RSS 2.0 feed
│   │   ├── ads.txt/route.ts            # ads.txt dynamic handler
│   │   ├── login/page.tsx              # Authentication page
│   │   └── (about|contact|privacy|terms|disclaimer|tools)/
│   ├── components/
│   │   ├── Navbar.tsx                  # Navigation + trending ticker
│   │   ├── Footer.tsx                  # Site footer
│   │   └── AdSlot.tsx                  # Ad placement component
│   └── lib/
│       ├── db.ts                       # Database layer + tiered cache
│       └── auth.ts                     # Authentication utilities
├── supabase.sql                        # Database schema + seed data
├── DEPLOY_GUIDE.md                     # Panduan ini
└── package.json                        # Dependencies & scripts
```

---

*Terakhir diperbarui: 18 Mei 2026 — Versi Portal: v3.0 (Database Optimization + SEO Traffic Multiplier)*
