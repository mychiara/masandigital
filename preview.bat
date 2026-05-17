@echo off
title masandigital.com - Live Web Preview Launcher
color 0B
cls

echo =================================================================
echo    MASANDIGITAL.COM - LIVE PREVIEW DEVELOPMENT LAUNCHER (2026)
echo =================================================================
echo  [*] Mendeteksi instalasi Git Bash...

:: Mencari lokasi Git Bash di beberapa lokasi standar Windows
set "GIT_BASH_PATH=C:\Program Files\Git\git-bash.exe"

if not exist "%GIT_BASH_PATH%" (
    set "GIT_BASH_PATH=C:\Program Files (x86)\Git\git-bash.exe"
)

if not exist "%GIT_BASH_PATH%" (
    set "GIT_BASH_PATH=%LocalAppData%\Programs\Git\git-bash.exe"
)

if not exist "%GIT_BASH_PATH%" (
    :: Cari melalui Environment PATH
    for %%i in (git-bash.exe) do set "GIT_BASH_PATH=%%~$PATH:i"
)

echo =================================================================

:: Validasi dan Eksekusi
if "%GIT_BASH_PATH%"=="" (
    echo [!] PERINGATAN: Git Bash tidak ditemukan di sistem Anda.
    echo [*] Melakukan fallback menggunakan Windows Command Prompt...
    echo [*] Menjalankan: npm run dev
    echo =================================================================
    start "masandigital.com - Dev Server" cmd /k "npm run dev"
) else (
    echo [√] Git Bash ditemukan di: "%GIT_BASH_PATH%"
    echo [*] Memulai Next.js Development Server di Git Bash...
    echo =================================================================
    :: Start dev server in Git Bash and keep it open (via exec bash)
    start "masandigital.com - Git Bash Server" "%GIT_BASH_PATH%" -c "npm run dev; exec bash"
)

:: Menunggu 3 detik agar server Next.js mulai menyala sebelum membuka browser
echo [*] Menunggu server inisialisasi (3 detik)...
timeout /t 3 /nobreak >nul

:: Membuka live preview di browser default
echo [*] Membuka live web preview di http://localhost:3000 ...
start http://localhost:3000

echo =================================================================
echo  [+] SUKSES! Server Next.js telah diluncurkan di background.
echo  [+] Anda dapat menutup jendela Command Prompt ini sekarang.
echo =================================================================
echo.
pause
