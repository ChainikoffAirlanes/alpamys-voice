@echo off
setlocal
chcp 65001 >nul
title Alpamys Voice - Local Start
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo Node.js is not installed.
  echo Download the LTS version from https://nodejs.org/
  echo.
  pause
  exit /b 1
)

if not exist "node_modules\next\package.json" (
  echo Installing project dependencies...
  call npm install
  if errorlevel 1 (
    echo.
    echo Dependency installation failed.
    pause
    exit /b 1
  )
)

call npm run local
set "APP_EXIT_CODE=%errorlevel%"

if not "%APP_EXIT_CODE%"=="0" (
  echo.
  echo The site stopped with an error. Read the message above.
) else (
  echo.
  echo The site process has stopped.
)

echo This window will stay open so you can read the status.
echo.
pause
exit /b %APP_EXIT_CODE%
