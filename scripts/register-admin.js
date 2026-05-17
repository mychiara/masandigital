const SUPABASE_URL = "https://nnacnsqjuacvbmupwqde.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5uYWNuc3FqdWFjdmJtdXB3cWRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwMjk1OTQsImV4cCI6MjA5NDYwNTU5NH0.d_89Jh63vmQTlw6YWVd04xnI76BirC1TGaCn_grdyc4";

async function register() {
  console.log("=== REGISTRASI USER ADMIN SUPABASE ===");
  try {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
      method: "POST",
      headers: {
        "apikey": SUPABASE_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: "admin@masandigital.com",
        password: "admin123",
        data: {
          name: "Andy Masan",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=250&auto=format&fit=crop"
        }
      })
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(`Gagal registrasi: ${JSON.stringify(result)}`);
    }

    console.log("✓ Berhasil registrasi admin! Silakan jalankan script import artikel.", result);
  } catch (error) {
    console.error("✗ Error:", error.message);
  }
}

register();
