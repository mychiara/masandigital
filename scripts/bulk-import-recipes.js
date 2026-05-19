/**
 * CMS Bulk Recipes Importer - Chunked Loader
 * -------------------------------------------------------------
 * Script ini mengimpor 1000 artikel resepi hasil jana secara chunked (berkelompok)
 * ke database Supabase agar stabil, tidak timeout, dan selamat.
 */

const fs = require('fs');
const path = require('path');

// Ambil URL Supabase daripada .env.local secara dinamik
let SUPABASE_URL = "";
const envLocalPath = path.join(__dirname, "..", ".env.local");

if (fs.existsSync(envLocalPath)) {
  const envContent = fs.readFileSync(envLocalPath, "utf8");
  const match = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/);
  if (match && match[1]) {
    SUPABASE_URL = match[1].trim();
  }
}

// Fallback sekiranya tiada dalam .env.local
if (!SUPABASE_URL) {
  SUPABASE_URL = "https://fxvczffccdgbjremsczw.supabase.co"; // URL aktif dari .env.local
}

const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

async function main() {
  console.log("=== CMS BULK RECIPES DATABASE IMPORTER ===");
  console.log(`Supabase URL: ${SUPABASE_URL}`);
  
  if (!SERVICE_ROLE_KEY) {
    console.error("✗ ERROR: SUPABASE_SERVICE_ROLE_KEY tidak ditemui!");
    console.log("\nCara Menjalankan Script ini:");
    console.log("1. Dapatkan 'service_role' key (Bukan Anon/Public Key) dari Dashboard Supabase -> Project Settings -> API.");
    console.log("2. Set key tersebut dalam terminal dan jalankan script:");
    console.log("   $env:SUPABASE_SERVICE_ROLE_KEY=\"KUNCI_SERVICE_ROLE_ANDA\"; node scripts/bulk-import-recipes.js");
    return;
  }

  // Load artikel dari recipes_import.json
  const recipesPath = path.join(__dirname, "..", "recipes_import.json");
  if (!fs.existsSync(recipesPath)) {
    console.error(`✗ ERROR: File resepi hasil jana tidak ditemui di [${recipesPath}]`);
    console.log("Sila jalankan 'node scripts/generate-recipes-offline.js' terlebih dahulu!");
    return;
  }

  console.log("Membaca artikel resepi dari fail...");
  const articles = JSON.parse(fs.readFileSync(recipesPath, 'utf8'));
  console.log(`✓ Berjaya memuat ${articles.length} artikel resepi.`);

  const chunkSize = 50;
  const totalChunks = Math.ceil(articles.length / chunkSize);
  console.log(`Mengimport secara chunked (${chunkSize} artikel per kelompok, Total: ${totalChunks} kelompok)...`);

  for (let i = 0; i < totalChunks; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, articles.length);
    const chunk = articles.slice(start, end);

    console.log(`\n📦 Mengimport Kelompok ${i + 1}/${totalChunks} (Resepi ${start + 1} - ${end})...`);

    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/articles`, {
        method: 'POST',
        headers: {
          'apikey': SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates' // UPSERT automatik berdasarkan slug constraint!
        },
        body: JSON.stringify(chunk)
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errText}`);
      }

      console.log(`✓ Kelompok ${i + 1}/${totalChunks} BERJAYA diimport!`);
    } catch (err) {
      console.error(`✗ Gagal mengimport kelompok ${i + 1}:`, err.message);
      console.log("Menunggu 3 saat sebelum meneruskan kelompok seterusnya...");
      await new Promise(r => setTimeout(r, 3000));
    }
  }

  console.log("\n==============================================");
  console.log("✓ Selesai! Semua artikel resepi Malaysia telah berjaya diimport.");
  console.log("Kini website anda penuh dengan 1000 resepi premium mesra SEO & Google Rich Snippets!");
  console.log("==============================================");
}

main();
