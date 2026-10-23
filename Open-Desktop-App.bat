@echo off
title Poland Internship Hunter - Desktop Launcher
cd /d "%~dp0"

if exist "dist-electron\win-unpacked\Poland Internship Hunter.exe" (
    echo Launching Poland Internship Hunter Desktop Executable...
    start "" "dist-electron\win-unpacked\Poland Internship Hunter.exe"
    exit /b
)

echo Starting Poland Internship Hunter Desktop Shell...
npx electron .
