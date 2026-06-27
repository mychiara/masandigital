/**
 * Supabase Admin Provisioner - Via Service Role Key
 * -------------------------------------------------------------
 * Script ini membuat akun admin "admin@masandigital.com" dengan password "admin123"
 * langsung di server Supabase Auth dan menyatakannya "Terkonfirmasi" (Auto-Confirmed)
 * secara instan dengan menembus batasan verifikasi email.
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
  SUPABASE_URL = "https://fcwnjateagykjsqhurio.supabase.co"; // URL aktif dari .env.local
}

// Ambil Service Role Key dari environment variable
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

async function main() {
  console.log("=== SUPABASE ADMIN PROVISIONER (SERVICE ROLE BYPASS) ===");
  console.log(`Supabase URL: ${SUPABASE_URL}`);
  
  if (!SERVICE_ROLE_KEY) {
    console.error("✗ ERROR: SUPABASE_SERVICE_ROLE_KEY tidak ditemukan!");
    console.log("\nCara Menjalankan Script ini:");
    console.log("1. Salin 'service_role' key Anda dari Dashboard Supabase proyek baru Anda.");
    console.log("2. Jalankan perintah berikut di terminal (ganti dengan key asli Anda):");
    console.log("   $env:SUPABASE_SERVICE_ROLE_KEY=\"YOUR_SERVICE_ROLE_KEY\"; node scripts/create-admin-via-service-role.js");
    return;
  }

  console.log("Menghubungi server Supabase Auth untuk membuat admin...");
  try {
    // Kita menembak endpoint admin Auth Supabase
    const response = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
      method: 'POST',
      headers: {
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: "admin@masandigital.com",
        password: "admin123",
        email_confirm: true, // AUTO-CONFIRM EMAIL!
        user_metadata: {
          name: "Andy Masan",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=250&auto=format&fit=crop"
        }
      })
    });

    const result = await response.json();
    
    if (!response.ok) {
      // Jika user sudah ada
      if (result.message && result.message.includes("already exists")) {
        console.log("✓ Akun 'admin@masandigital.com' sudah terdaftar di database Supabase Anda.");
        return;
      }
      throw new Error(result.message || JSON.stringify(result));
    }

    console.log("\n✓ SUKSES! Akun Admin telah berhasil dibuat langsung di Supabase Auth!");
    console.log("Kredensial:");
    console.log("  - Email: admin@masandigital.com");
    console.log("  - Password: admin123");
    console.log("  - Status: Pre-Confirmed / Terkonfirmasi (Aktif)");
    console.log("\n=== SELESAI ===");
  } catch (err) {
    console.error("✗ Gagal membuat akun di Supabase:", err.message);
  }
}

main();
