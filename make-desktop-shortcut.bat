@echo off
rem Creates a "Lab Notes" shortcut on your Desktop that opens the app in its own window
rem (Chrome if installed, otherwise Edge), with the Dr. Ohmi icon.
rem Handy after moving to a new laptop: clone the repo, then double-click this file.
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -Command "$b='C:\Program Files\Google\Chrome\Application\chrome.exe'; if (-not (Test-Path $b)) { $b='C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe' }; $s=(New-Object -ComObject WScript.Shell).CreateShortcut([Environment]::GetFolderPath('Desktop') + '\Lab Notes.lnk'); $s.TargetPath=$b; $s.Arguments='--app=https://yamimah0849-dot.github.io/lab-notes/'; $s.IconLocation=(Resolve-Path 'icons\lab-notes.ico').Path; $s.Description='Lab Notes: electronics course'; $s.Save()"
echo.
echo Done! Look for "Lab Notes" with Dr. Ohmi's face on your Desktop.
pause
