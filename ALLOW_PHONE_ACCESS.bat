@echo off
chcp 65001 >nul
title Alpamys Voice - Phone Access

net session >nul 2>&1
if not "%errorlevel%"=="0" (
  echo Requesting administrator permission...
  powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Start-Process -FilePath '%~f0' -Verb RunAs"
  exit /b
)

echo Allowing phones on the local network to open port 3000...
netsh advfirewall firewall add rule name="Alpamys Voice (TCP 3000)" dir=in action=allow protocol=TCP localport=3000 remoteip=LocalSubnet profile=private,public enable=yes >nul

if errorlevel 1 (
  echo.
  echo Could not add the firewall rule.
  echo Check Windows Security settings and try again.
) else (
  echo.
  echo Done. Restart START.bat and open the Phone address on your phone.
)

echo.
pause
