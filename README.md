# Lab Notes ⚡

A free, anime-flavored electronics course that runs in your browser. It takes you from
"what even is voltage?" all the way to reading your own muscle signals with an Arduino,
guided by Dr. Ohmi, a slightly chaotic lab assistant.

**Open the app:** https://yamimah0849-dot.github.io/lab-notes/

## What's inside

27 lessons in 8 modules. Every lesson has a short explanation with interactive diagrams,
2–3 tutorial videos, a quiz, hands-on challenges ("build it for real" or "simulate it")
and an "Ask Claude" button.

| Module | Topic |
|---|---|
| 0 | Safety & tools: lab safety, breadboard, multimeter, soldering |
| 1 | Voltage, current, resistance, Ohm's law, power |
| 2 | Resistors (color code, series/parallel, voltage dividers), capacitors, inductors |
| 3 | Diodes, LEDs, transistors |
| 4 | Arduino: digital pins, analog pins & sensors, Serial Monitor, buzzers + LCD + motors |
| 5 | Signals, noise & filtering, amplification |
| 6 | Op-amps: golden rules, amplifier circuits, filters & instrumentation amps |
| 7 | FINAL BOSS: EMG muscle sensor + the live **Muscle Meter** |

Plus XP, ranks (Lab Intern → Mad Scientist), a daily streak, a 20-minute daily goal,
synthesized sound effects, and offline support.

## Use it on your laptop

1. Open https://yamimah0849-dot.github.io/lab-notes/ in **Chrome** or **Edge**.
2. Optional: install it as an app with **Settings → Install Lab Notes** (or the install icon at the right of the address bar).
3. The **Muscle Meter** (final boss) needs Chrome or Edge on a computer, because it talks to the Arduino over USB (Web Serial).

### Run your own copy locally (for editing)
Double-click **`start-lab.bat`** in this folder. It starts a tiny web server and opens
http://localhost:8000. Close the small "Lab Notes server" window to stop it.
(Needs Python, already installed on this laptop.)

## Put it on your iPhone

1. Open the link above in **Safari**.
2. Tap **Share** (the square with an arrow pointing up).
3. Tap **Add to Home Screen**, then **Add**.

It works offline after the first visit. On iPhone, the Muscle Meter runs in **Demo mode**
(iPhones can't talk to an Arduino over USB from a web page).

## Your progress

Progress is saved on each device separately (that's what keeps the app free: no server).
Use **Settings → Export backup** on one device and **Import backup** on the other to move it.
The installed iPhone app keeps its own progress, separate from Safari.

## Updates

New versions go live automatically: push to `main` and GitHub Pages republishes in about a minute.
Open the app while online to get the update (it then keeps working offline).

## Credits

Tutorial videos belong to their creators (linked in each lesson). Simulators: Falstad Circuit
Simulator, Wokwi and Tinkercad Circuits. Everything else (code, Dr. Ohmi, sounds) was made for this project.
See [CLAUDE.md](CLAUDE.md) for how the project is built and its progress log.
