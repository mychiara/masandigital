/**
 * CMS Bulk Importer - Via Supabase Service Role Key
 * -------------------------------------------------------------
 * Script ini mengimpor 100 artikel SEO langsung ke database Supabase
 * dengan menembus batasan Row Level Security (RLS) dan tanpa perlu konfirmasi email
 * karena menggunakan Service Role Key / Admin Key.
 */

const fs = require('fs');
const path = require('path');

// Konfigurasi Database Supabase
const SUPABASE_URL = "https://nnacnsqjuacvbmupwqde.supabase.co";

// Ambil Service Role Key dari environment variable atau parameter
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

async function main() {
  console.log("=== CMS BULK ARTICLE IMPORTER (SERVICE ROLE BYPASS) ===");
  
  if (!SERVICE_ROLE_KEY) {
    console.error("✗ ERROR: SUPABASE_SERVICE_ROLE_KEY tidak ditemukan!");
    console.log("\nCara Menjalankan Script ini:");
    console.log("1. Dapatkan 'service_role' key Anda dari Dashboard Supabase -> Project Settings -> API.");
    console.log("2. Jalankan perintah berikut di terminal (ganti dengan key asli Anda):");
    console.log("   $env:SUPABASE_SERVICE_ROLE_KEY=\"YOUR_SERVICE_ROLE_KEY\"; node scripts/bulk-import-via-service-role.js");
    return;
  }

  // Load artikel dari backup JSON
  const backupPath = path.join(__dirname, "..", "100_articles_cloud_ready.json");
  if (!fs.existsSync(backupPath)) {
    console.error(`✗ ERROR: File backup artikel tidak ditemukan di [${backupPath}]`);
    return;
  }

  console.log("Membaca 100 artikel dari file backup...");
  const articlesToInsert = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
  console.log(`✓ Berhasil memuat ${articlesToInsert.length} artikel.`);

  console.log("\nSedang mengunggah langsung ke database menggunakan Service Role Key...");
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/articles`, {
      method: 'POST',
      headers: {
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates' // UPSERT otomatis berdasarkan constraint slug!
      },
      body: JSON.stringify(articlesToInsert)
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errText}`);
    }

    console.log("\n✓ LUAR BIASA! 100 artikel SEO premium dengan penulis 'Mas Andy' telah sukses di-import LANGSUNG ke Supabase secara otomatis!");
    console.log("Bypass RLS Sukses! Semua artikel kini aktif dan siap dirayap oleh mesin pencari Google!");
    console.log("\n=== PROSES IMPOR SELESAI ===");
  } catch (err) {
    console.error("✗ Gagal mengimpor ke database Supabase:", err.message);
  }
}

main();
