@echo off
rem Double-click this file to open Lab Notes on your laptop.
rem It starts a tiny local web server (Python) and opens the app in your browser.
rem To stop it, close the "Lab Notes server" window.
cd /d "%~dp0"
start "Lab Notes server" /min python -m http.server 8000 --bind 127.0.0.1
timeout /t 2 /nobreak >nul
start "" http://localhost:8000
