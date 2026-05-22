@echo off
echo === Fixing Contact Form Table ===
echo.
echo This script will help you create the contact_messages table in Supabase.
echo.

REM Check if Supabase CLI is installed
where supabase >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Supabase CLI is not installed.
    echo Install it with: npm install -g supabase
    echo Or follow the manual instructions below.
    echo.
    echo === MANUAL INSTRUCTIONS ===
    echo 1. Go to: https://supabase.com/dashboard/project/tpkbibwfnmdflvqdbmjg
    echo 2. Click 'SQL Editor' in left sidebar
    echo 3. Copy the SQL from ONE_LINE_SQL_FIX.sql
    echo 4. Paste and click 'Run'
    echo 5. Go to Settings ^> API ^> Clear schema cache
    pause
    exit /b 1
)

echo ✅ Supabase CLI is installed.
echo.
echo Creating contact_messages table...
echo.

REM Execute the SQL
supabase db execute --file scripts/create-contact-messages-simple.sql

echo.
echo ✅ Table created (if no errors above).
echo.
echo === NEXT STEPS ===
echo 1. Test your contact form at: /contact
echo 2. Check messages in Supabase Table Editor
echo 3. If still having issues, clear schema cache in Supabase Dashboard
echo    (Settings ^> API ^> Clear cache)
pause