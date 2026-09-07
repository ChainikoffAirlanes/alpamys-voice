@echo off
chcp 65001 >nul
title Alpamys Voice - Telegram Setup
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed. Download it from https://nodejs.org/
  pause
  exit /b 1
)

if not exist "node_modules\next\package.json" call npm install
if errorlevel 1 (
  echo Dependency installation failed.
  pause
  exit /b 1
)

call npm run telegram:setup
echo.
pause
