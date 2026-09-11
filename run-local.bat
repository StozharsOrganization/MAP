@echo off
echo ========================================================
echo   Zapusk MAP Platform (Docker PostgreSQL + Next.js)
echo ========================================================
echo.

echo 1. Pidnimayemo Docker bazu danykh ta Pgweb...
call npm run docker:up
echo.

echo 2. Startuyemo Next.js dev server...
echo Sayt bude dostupnyi na http://localhost:3000
echo Baza danykh (Pgweb) na http://localhost:8080
echo.

start http://localhost:3000
call npm run dev
pause
