# Lab Notes: electronics learning app

## Goal
A fun, 100% free web app (PWA) that teaches electronics from zero up to building an
EMG (muscle-signal) circuit with an Arduino. It runs on a Windows laptop and an iPhone
and is hosted free on GitHub Pages.

## About the learner
- Total beginner at electronics and can't really code.
- Explain simply and define any jargon in a few words.
- Wants to understand WHY circuits work, not just copy them.
- Uses a Windows laptop (PowerShell, Git, Python 3.12 and Node installed) and an iPhone.
- Everything must be 100% free: no paid APIs, subscriptions or hosting.

## How to work
1. Before writing code, ask questions, show a short plan and wait for OK.
2. Build in phases. After each phase, stop, give plain test steps and wait for the learner to confirm.
3. Update the progress log below at the end of every phase.
4. After a confirmed phase, commit, then walk the learner through pushing to GitHub.

## Links
- GitHub user: `yamimah0849-dot`
- Repo: https://github.com/yamimah0849-dot/lab-notes
- Live app (after Phase 2): https://yamimah0849-dot.github.io/lab-notes/
- Git commits use GitHub's private noreply email (set in global git config), so the
  learner's real email stays private.

## Tech choices
- Plain HTML + CSS + JavaScript. No frameworks, no build step, no npm packages.
- Lesson content lives in data files (one per module), kept separate from app code.
- Progress is saved in localStorage (browser storage on that device), with Export/Import to a `.json` file.
- PWA: `manifest.webmanifest` + a service worker for home-screen install and offline use.
- Hosting: GitHub Pages from the `main` branch (the repo must be public).
- Local testing: run `python -m http.server 8000` in the project folder, then open http://localhost:8000.
- Simulators: Falstad (https://www.falstad.com/circuit/, no account) and Tinkercad Circuits (free account, virtual Arduino).
- The final-boss "Muscle Meter" page uses the Web Serial API (Chrome/Edge on desktop only; iPhone can't).
- No automatic laptop-to-iPhone sync, because that would need a server. Use Export/Import.

## Style
- Dark "secret anime lab" theme, neon accents, energetic animations, comic speech bubbles.
- Mascot: **Dr. Ohmi**, an ORIGINAL chibi lab assistant (not based on any existing character):
  oversized goggles, a lab coat three sizes too big, a lightning-bolt hair strand that frizzes
  when shocked, and a scorched clipboard. Dramatic and slightly chaotic.
  Catchphrase: "For SCIENCE! ...probably."
- Funny moments: a "MISSION COMPLETE!" screen on passing a quiz, over-the-top shocked reactions to
  wrong answers, and silly "how to blow up an LED" warnings.
- Ranks: Lab Intern -> Circuit Apprentice -> Spark Technician -> Signal Wrangler -> Chief Engineer -> Mad Scientist.
- Fun but never confusing: explanations must stay clear and technically accurate.

## Learner's kit (confirmed 2026-11-11)
Arduino Uno, breadboard, jumper wires, USB cable, 16x2 LCD (raw pins, no I2C), active buzzer,
passive buzzer, water sensor, small DC motor, SG90 servo, 3-lead EMG module ("Muscle Sensor V3"
style), 9V batteries, multimeter, soldering iron, resistors, LEDs, capacitors, diodes, transistors.
- **No potentiometer.** LCD contrast (pin V0) uses a fixed-resistor voltage divider instead.
  Analog-input lessons use the water sensor.
- The EMG module likely needs +/-9V from two 9V batteries, and its output can go above 5V, so the
  lessons must protect the Arduino analog pin. Safety: the laptop must be unplugged from the wall
  while electrodes are on skin.
- If a lesson needs a part the learner doesn't have, label it "simulate it" instead of "build it for real".

## Modules (about 3 lessons each)
0. Safety and tools: breadboard, multimeter, soldering basics
1. Voltage, current, resistance, Ohm's law, power
2. Resistors, capacitors, inductors
3. Diodes, LEDs, transistors
4. Arduino basics: digital/analog pins, reading sensors, serial monitor
5. Sensors and signals: noise, filtering, amplification
6. Op-amps
7. Final boss: an EMG circuit that reads a muscle signal and drives something on screen

## Every lesson has
- A short explanation with simple diagrams or animations (inline SVG/CSS)
- 2-3 real tutorial videos (title, channel, one-line description, link) plus a "search YouTube"
  backup link. Check each link with a web search before adding it, and tell the learner some links may die.
- A 3-5 question quiz with instant feedback that explains wrong answers
- 1-2 challenges labeled "build it for real" (with the kit) or "simulate it" (Falstad/Tinkercad link)
- An "Ask Claude" button that copies a ready-made prompt about the lesson

## Motivation features
XP, ranks, a daily streak, a "20 minutes today" goal, a dashboard of finished and next lessons,
local save, and Export/Import backup.

## Files
- `index.html`: page shell (top bar, footer, script tags). New `data/module-N.js` files need a script tag here.
- `css/style.css`: all styling. Colors are variables in `:root`.
- `js/store.js`: progress in localStorage (key `labnotes.progress.v1`), XP, ranks, streak, study timer, export/import.
- `js/sfx.js`: all sounds, synthesized live with the Web Audio API (no audio files, nothing copyrighted).
  `SFX.play(name)`: tap, spark, boing, correct ("pin-pon" chime), wrong (buzzer + zap), sting (dun-dun-DUNN),
  sadTrombone, whoosh, fanfare, levelUp, goal, coin. `SFX.babble(mood, delay, text)` = Dr. Ohmi's gibberish voice.
  Settings (sfx/voice on/off) saved in localStorage key `labnotes.sound.v1`. Sound only starts after the first tap (browser rule).
- `js/mascot.js`: Dr. Ohmi as inline SVG (moods: idle, happy, shock, think, proud) and all of Ohmi's lines.
  `say(html, mood, {silent, voiceDelay})` shows a bubble and makes Ohmi "talk".
- `js/breadboard.js`: interactive breadboard diagrams. Holes `a1`..`j20`, rails `tn`/`tp` (top -/+), `bp`/`bn` (bottom +/-).
  Parts: `wire {from,to,color,arc}`, `lead {hole,color,label}` (wire coming from off the board), `resistor {from,to,bands}`, `led {anode,cathode,color,lit}`.
- `js/app.js`: hash router (`#/`, `#/module/N`, `#/lesson/ID`, `#/settings` (old `#/backup` still works)), pages, quiz,
  overlays (MISSION COMPLETE, rank up, goal; each can have a `sound`), Ask Claude, top-bar mute button, soundboard.
- `data/course.js`: the course map (all modules + lesson titles, which phase builds them) and the kit list.
- `data/module-N.js`: lesson content. A lesson is playable once its id has content here.
- `start-lab.bat`: double-click to run the app on the laptop (starts Python's web server on 127.0.0.1:8000, opens the browser).
- `manifest.webmanifest` + `icons/` (icon.svg source, icon-192/512.png, apple-touch-icon.png 180): makes the app installable.
  The PNGs were rendered from icon.svg with headless Edge at 512 and shrunk with System.Drawing
  (Edge refuses windows narrower than ~500px, so don't render small sizes directly).
- `sw.js`: service worker for offline use. App files are network-first (4 s timeout, then the saved copy);
  Google Fonts are cache-first. **When adding a file (e.g. `data/module-1.js`), add it to `PRECACHE` and bump `VERSION`.**
- `.nojekyll`: tells GitHub Pages to serve files as-is.
- Testing note: the app's built-in browser pane can't register service workers. Test offline mode in real Chrome.
- **Shared origin warning:** every GitHub Pages project of this user lives on `yamimah0849-dot.github.io`, so they
  share localStorage and Cache Storage (another project uses caches named `partslab-*`). Always prefix storage keys
  and cache names with `labnotes` and never clear storage wholesale.

## Lesson format (example: `data/module-0.js`)
`{ minutes, intro, summary, sections, search, videos, quiz, challenges }`
- `sections`: `{title, html}` or `{type: 'jargon' | 'danger' | 'tip' | 'breadboard', ...}`
- `videos`: `{title, channel, url, desc}`. Verify every video before adding it:
  `https://www.youtube.com/oembed?url=<video url>&format=json` returns the real title and channel if the video exists.
- `quiz`: `{q, answer, options: [{t, why}], explain}`. `why` explains why a wrong option is wrong.
- `challenges`: `{type: 'build' | 'sim', title, why, parts, diagram, steps, troubleshoot, link}`
- XP: correct answer +10 (first time per question), quiz pass +50 (first pass, needs 60%), challenge +40, daily 20-minute goal +30.
  Ranks at 0 / 300 / 900 / 1800 / 2800 / 4000 XP.

## Git workflow
Each phase is built on its own branch (e.g. `phase-1-app-shell`). After the learner confirms the phase works,
merge it into `main` and push. GitHub Pages will publish from `main`.

## Phases
- [x] Setup: folder, Git, CLAUDE.md, GitHub repo, first push
- [x] 1. App shell: theme, mascot, dashboard, XP/ranks/streak/goal, export/import, 1 sample lesson
- [x] Extra (learner's request): anime-style sound effects + Dr. Ohmi babble voice
- [x] 2. Go live: GitHub Pages, iPhone home-screen install, offline
- [ ] 3. Modules 0-1
- [ ] 4. Modules 2-3
- [ ] 5. Module 4 (Arduino)
- [ ] 6. Modules 5-6
- [ ] 7. Final boss (EMG + Muscle Meter page)
- [ ] Wrap-up: full check + laptop and iPhone instructions

## Progress log
- 2026-11-11: Planned the project and confirmed the kit. Created the folder `Desktop\lab-notes`,
  CLAUDE.md, README.md and .gitignore. Set up Git (name + private email), made the first commit
  on `main`. Created the public repo on GitHub and pushed `main` (the learner signed in to Git Credential
  Manager in the browser, so future pushes need no sign-in).
- 2026-11-11: Phase 1 built on branch `phase-1-app-shell`: neon lab theme, Dr. Ohmi with 5 moods and jokes,
  dashboard (rank, streak, 20-minute goal ring, mission map), lesson template, quiz with shocked reactions and
  MISSION COMPLETE screen, rank-up and goal screens, Backup page (export/import/reset), Ask Claude button,
  and the first real lesson `m0-2` "Meet the Breadboard" (interactive breadboard, 3 verified videos, 5 questions,
  build + Tinkercad challenges). Tested in the built-in browser at desktop and phone width.
  The learner tested it with `start-lab.bat` and confirmed it works; merged to `main` and pushed.
- 2026-11-11: Learner asked for fun anime-style sounds. Built on branch `sound-effects`: `js/sfx.js` (synthesized
  quiz-show chime, buzzer, dramatic sting, sad trombone, fanfare, level-up, goal chimes, coin, taps, breadboard
  sparks, Ohmi boing) and Dr. Ohmi's babble voice. Top-bar 🔊/🔇 button; Backup page became Settings
  (`#/settings`) with sound switches and a soundboard. Verified in the built-in browser that every sound starts
  and mute works (can't hear audio there). The learner listened and loved them; merged to `main` and pushed.
- 2026-11-11: Phase 2 built on branch `phase-2-pwa`: Dr. Ohmi app icon, manifest, iOS home-screen meta tags,
  service worker (offline incl. fonts), Settings "Install" section (iPhone Safari steps; Install button on
  Chrome/Edge), offline/online toasts. Verified in real Chrome: 15 app files + 9 font files cached, and a full
  reload with the server switched off still shows the lesson with the comic fonts.
  With the learner's OK, merged to `main`, pushed, and switched on GitHub Pages (main, root). Live at
  https://yamimah0849-dot.github.io/lab-notes/ with the service worker active (scope `/lab-notes/`).
- 2026-11-12: The learner added Lab Notes to the iPhone home screen and confirmed it works. Phase 2 done.
  Next: Phase 3 (Module 0 lessons m0-1, m0-3, m0-4 and Module 1 lessons m1-1, m1-2, m1-3).
