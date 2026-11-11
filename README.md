# Lab Notes ⚡

A free, anime-flavored electronics course that runs in your browser. It takes you from
"what even is voltage?" all the way to building a muscle-signal (EMG) circuit with an Arduino,
guided by Dr. Ohmi, a slightly chaotic lab assistant.

**Open the app:** https://yamimah0849-dot.github.io/lab-notes/

See [CLAUDE.md](CLAUDE.md) for the plan and progress log.

## Put it on your iPhone
1. Open the link above in **Safari**.
2. Tap **Share** (the square with an arrow pointing up).
3. Tap **Add to Home Screen**, then **Add**.

It works offline after the first visit. The home-screen app keeps its own progress;
use **Settings → Export / Import** to move progress between devices.

## Run it on your laptop (Windows)

Double-click **`start-lab.bat`** in this folder. It starts a tiny web server and opens the app
at http://localhost:8000. To stop it, close the small "Lab Notes server" window.

(Needs Python, which is already installed on this laptop. The manual way is
`python -m http.server 8000` in this folder, then opening http://localhost:8000.)
