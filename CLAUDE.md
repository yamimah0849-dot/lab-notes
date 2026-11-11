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

## Phases
- [ ] Setup: folder, Git, CLAUDE.md, GitHub repo, first push  <- in progress
- [ ] 1. App shell: theme, mascot, dashboard, XP/ranks/streak/goal, export/import, 1 sample lesson
- [ ] 2. Go live: GitHub Pages, iPhone home-screen install, offline
- [ ] 3. Modules 0-1
- [ ] 4. Modules 2-3
- [ ] 5. Module 4 (Arduino)
- [ ] 6. Modules 5-6
- [ ] 7. Final boss (EMG + Muscle Meter page)
- [ ] Wrap-up: full check + laptop and iPhone instructions

## Progress log
- 2026-11-11: Planned the project and confirmed the kit. Created the folder `Desktop\lab-notes`,
  CLAUDE.md, README.md and .gitignore. Set up Git (name + private email), made the first commit
  on `main`. Next: the learner creates the GitHub repo and pushes.
