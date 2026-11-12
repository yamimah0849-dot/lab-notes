/* Module 7: FINAL BOSS: Muscle Power. Lesson content. */
window.LabNotesLessons = window.LabNotesLessons || {};

(function () {
  const EMG_SKETCH = window.MuscleMeter ? window.MuscleMeter.SKETCH : '';

  const SERVO_SKETCH = `// Flex to move the servo!
// EMG SIG -> 10k -> A0 -> 10k -> GND, servo signal on pin 9
#include <Servo.h>
Servo arm;
const int EMG_PIN = A0;
float level = 0;

// Tune these two numbers to YOUR readings (watch the Serial Plotter):
const int RELAXED = 30;     // reading when your arm is relaxed
const int FULL    = 500;    // reading when you flex hard

void setup() {
  arm.attach(9);
  Serial.begin(115200);
}

void loop() {
  int raw = analogRead(EMG_PIN);
  level = level + 0.2 * (raw - level);                    // extra smoothing
  int clamped = constrain((int)level, RELAXED, FULL);
  int angle = map(clamped, RELAXED, FULL, 0, 180);         // relaxed = 0 deg, full flex = 180 deg
  arm.write(angle);
  Serial.println(raw);
  delay(10);
}`;

  const LCD_SKETCH = `// Muscle power bar on the 16x2 LCD
#include <LiquidCrystal.h>
LiquidCrystal lcd(12, 11, 5, 4, 3, 2);
const int EMG_PIN = A0;
float level = 0;
const int FULL = 600;       // tune to your strongest flex

void setup() {
  lcd.begin(16, 2);
  lcd.print("MUSCLE POWER:");
  Serial.begin(115200);
}

void loop() {
  int raw = analogRead(EMG_PIN);
  level = level + 0.2 * (raw - level);
  Serial.println(raw);
  int bars = map(constrain((int)level, 0, FULL), 0, FULL, 0, 16);
  lcd.setCursor(0, 1);
  for (int i = 0; i < 16; i++) {
    lcd.print(i < bars ? (char)255 : ' ');   // character 255 is a solid block
  }
  delay(30);
}`;

  Object.assign(window.LabNotesLessons, {
    // ------------------------------------------------------------------ 7.1
    'm7-1': {
      minutes: 15,
      intro: 'The FINAL BOSS begins! 👑 Before we read a muscle, let’s understand why muscles make electricity at all. Spoiler: you are a walking, flexing battery factory. ⚡',
      summary: 'To move, the brain sends a signal down a motor neuron to the muscle. Each muscle fiber keeps a voltage across its membrane (roughly −70 to −90 mV inside) by keeping charged particles (ions like sodium and potassium) unevenly spread. When triggered, ion gates open and the voltage spikes briefly: an action potential, which travels along the fiber and makes it contract. One motor neuron plus the fibers it controls is a motor unit. Stronger contractions recruit more motor units and make them fire faster. Electrodes on the skin pick up the sum of all this: surface EMG, from tens of microvolts to a few millivolts, mostly between 20 and 450 Hz. EMG is used in myoelectric prosthetic hands, physiotherapy, sports science and game controllers.',
      sections: [
        {
          title: 'From thought to twitch',
          html: `
            <ol>
              <li>Your brain decides: “flex!”</li>
              <li>The signal races down your spinal cord to a <b>motor neuron</b>, a long nerve cell that reaches all the way to the muscle.</li>
              <li>At the muscle, the neuron triggers an electrical pulse in the muscle fibers: an <b>action potential</b>.</li>
              <li>The pulse sweeps along each fiber and makes it <b>contract</b>.</li>
            </ol>
            <p>Every one of those steps is electrical. That’s what we’re going to eavesdrop on.</p>`,
        },
        {
          title: 'Tiny batteries in every cell',
          html: `
            <p>Each muscle fiber is like a tiny battery. It keeps <b>charged particles</b> (called <b>ions</b>, like sodium and potassium) unevenly spread across its skin (the membrane). That makes the inside about <b>−70 to −90 mV</b> compared to the outside: its resting voltage.</p>
            <p>When the nerve signal arrives, little gates in the membrane pop open, ions rush through, and the voltage <b>flips</b> for about a millisecond. That spike is the <b>action potential</b>. It travels along the fiber like a wave in a stadium.</p>`,
        },
        {
          title: 'Motor units: the muscle’s team system',
          html: `
            <p>One motor neuron controls a whole group of fibers. The neuron plus its fibers is a <b>motor unit</b>. When you squeeze gently, only a few motor units fire. Squeeze harder and your body:</p>
            <ul>
              <li><b>recruits</b> more motor units, and</li>
              <li>makes them fire <b>faster</b>.</li>
            </ul>
            <p>Electrodes on your skin hear all of them at once, like a microphone above a crowd. More effort = louder, busier crowd = bigger signal.</p>`,
        },
        {
          type: 'widget',
          widget: 'muscle',
          title: '🧪 Simulated muscle',
          html: '<p>Drag the effort slider and watch the raw EMG (cyan) and its smooth envelope (yellow). Your module outputs the yellow one!</p>',
        },
        {
          title: 'What reaches your skin',
          html: `
            <p>By the time the signal gets through fat and skin, it’s tiny: from <b>tens of microvolts to a few millivolts</b>, wiggling mostly between <b>20 and 450 Hz</b>. That’s why Modules 5 and 6 were all about amplifying and filtering. You’re ready.</p>
            <p class="funfact">🦾 <b>Real-world superpower:</b> people who have lost a hand can wear a <b>myoelectric prosthetic</b>: electrodes read the muscles left in their arm, and the robotic hand opens and closes when they flex. Your final boss project is the very first step of that same idea.</p>`,
        },
        {
          type: 'jargon',
          terms: [
            ['Motor neuron', 'A nerve cell that carries the “move!” signal to a muscle.'],
            ['Ion', 'An electrically charged particle, like sodium (Na⁺) or potassium (K⁺).'],
            ['Action potential', 'The quick voltage spike that makes a nerve or muscle fiber fire.'],
            ['Motor unit', 'One motor neuron plus all the muscle fibers it controls.'],
            ['Recruitment', 'Switching on more motor units for a stronger contraction.'],
            ['Surface EMG (sEMG)', 'Muscle electricity measured with pads on the skin.'],
          ],
        },
        {
          type: 'danger',
          title: '🙃 How to measure absolutely nothing',
          html: `
            <ol>
              <li>Stick the electrodes on your biceps.</li>
              <li>Flex your… fingers.</li>
              <li>Stare at a flat line and declare the sensor broken.</li>
            </ol>
            <p><b>Why it happens:</b> electrodes only hear the muscle right under them. Finger movements mostly use forearm muscles. Put the pads on the muscle that’s actually doing the work!</p>`,
        },
      ],
      search: 'motor unit action potential muscle contraction explained',
      videos: [
        { title: 'What is a Motor Unit? How muscles contract', channel: 'Parallel Coaching', url: 'https://www.youtube.com/watch?v=A-nxhRPrf5A', desc: 'A plain-language explanation of motor units and recruitment.' },
        { title: 'How a muscle contraction is signalled - Animation', channel: 'Dagger Biology', url: 'https://www.youtube.com/watch?v=CepeYFvqmk4', desc: 'An animation of the nerve signal reaching the muscle and setting off contraction.' },
        { title: 'Twitch, Summation and Tetanus of Skeletal Muscle', channel: 'Scientist Cindy', url: 'https://www.youtube.com/watch?v=v5Nm_LaAQVo', desc: 'Why faster firing makes stronger contractions: fun and clear.' },
      ],
      quiz: [
        {
          q: 'What carries the “move!” signal from your spinal cord to a muscle?',
          answer: 1,
          options: [
            { t: 'Blood', why: 'Blood carries oxygen and fuel. The signal is electrical, along a nerve.' },
            { t: 'A motor neuron' },
            { t: 'The EMG sensor', why: 'The sensor only listens. Your nerves do the talking.' },
          ],
          explain: 'Motor neurons carry the electrical command to the muscle fibers.',
        },
        {
          q: 'What creates the voltage across a muscle fiber’s membrane?',
          answer: 0,
          options: [
            { t: 'Charged particles (ions) spread unevenly inside and outside' },
            { t: 'Tiny metal wires in the muscle', why: 'No wires! Ions in the body’s fluids carry the charge.' },
            { t: 'Static electricity from clothes', why: 'Fun, but no. It’s ions like sodium and potassium.' },
          ],
          explain: 'Ion differences make each fiber a tiny battery; gates opening make it spike.',
        },
        {
          q: 'You squeeze harder. What does your body do?',
          answer: 2,
          options: [
            { t: 'Makes each fiber bigger instantly', why: 'Fibers don’t grow on the spot. Your body changes how many fire, and how often.' },
            { t: 'Uses fewer motor units, more carefully', why: 'The opposite: more effort means more units.' },
            { t: 'Recruits more motor units and fires them faster' },
          ],
          explain: 'Recruitment + faster firing = stronger contraction and a bigger EMG signal.',
        },
        {
          q: 'Roughly how big is a surface EMG signal at the skin?',
          answer: 0,
          options: [
            { t: 'Tens of microvolts to a few millivolts' },
            { t: 'About 5 volts', why: 'Much, much smaller. That’s why we need amplifiers with gains around 1000.' },
            { t: 'About 230 volts', why: 'That would be mains! Muscles are thankfully way gentler.' },
          ],
          explain: 'Tiny: µV to mV. Hence all those amplifiers.',
        },
        {
          q: 'What is a myoelectric prosthesis?',
          answer: 1,
          options: [
            { t: 'A battery made from muscle', why: 'Creative! But it’s a prosthetic controlled by muscle signals.' },
            { t: 'An artificial limb controlled by the wearer’s muscle signals' },
            { t: 'A machine that makes muscles stronger', why: 'It reads muscles; it doesn’t strengthen them.' },
          ],
          explain: 'EMG electrodes read remaining muscles to open and close a robotic hand.',
        },
      ],
      challenges: [
        {
          type: 'build',
          title: 'Map your muscles',
          why: 'Good electrode placement is half the battle. Let’s find the best spots before any wiring.',
          parts: ['your arm', 'a washable pen (optional)', 'a mirror (optional)'],
          steps: [
            'Rest your forearm on a table, palm up. Put your other hand on your <b>biceps</b> (front of the upper arm).',
            'Flex gently and strongly. Feel the bulging middle part? That’s the <b>muscle belly</b>: the best spot for the first electrode.',
            'Follow the muscle toward the elbow: the second electrode will go about <b>2–3 cm</b> further along, in line with the muscle.',
            'Find the bony point of your elbow: perfect for the <b>reference</b> electrode.',
            'Try the same with your inner <b>forearm</b> while making a fist. That’s an alternative spot if the biceps gives a weak signal.',
          ],
        },
      ],
    },

    // ------------------------------------------------------------------ 7.2
    'm7-2': {
      minutes: 15,
      intro: 'Let’s open the boss’s spell book: your <b>EMG module</b>. 📖 What each pin does, why it wants TWO batteries, and the one mistake that could hurt your Arduino.',
      summary: 'The 3-lead EMG module (Muscle Sensor v3 style) has pins +Vs, −Vs, GND and SIG, a jack for the 3-lead electrode cable, and a gain trimmer. Inside: instrumentation amplifier, filters, more gain, rectifier and smoothing, so SIG outputs an envelope from 0 V up to +Vs. It needs a positive and negative supply: two 9V batteries in series with their middle joint as GND (battery A + to +Vs, A − and B + to GND, B − to −Vs); recommended about ±9 V. Battery power also keeps you away from mains. Because SIG can reach about 9 V, never connect it straight to an Arduino pin: use a 10 kΩ + 10 kΩ divider so A0 sees at most about 4.75 V, and connect module GND to Arduino GND (shared ground). Clockwise on the trimmer = more gain.',
      sections: [
        {
          title: 'Your module at a glance',
          html: `
            <ul>
              <li><b>+Vs</b> and <b>−Vs</b>: the positive and negative power inputs.</li>
              <li><b>GND</b>: the middle (0 V) reference. Connects to the Arduino’s GND too.</li>
              <li><b>SIG</b>: the output signal that goes (safely!) to the Arduino.</li>
              <li><b>Cable jack</b>: where the 3-lead electrode cable plugs in.</li>
              <li><b>Gain trimmer</b>: the tiny adjustable screw. Clockwise = more gain.</li>
            </ul>
            <p>Inside, it’s exactly the chain from Module 6: instrumentation amplifier → filters → more gain → rectifier → smoothing. So <b>SIG is already the smooth envelope</b>: it rises when you flex and falls when you relax.</p>
            <p class="small muted">Official reference: the <a href="https://www.pololu.com/file/0J745/Muscle_Sensor_v3_users_manual.pdf" target="_blank" rel="noopener">Muscle Sensor v3 user’s manual (PDF)</a>. If your module looks different, check the guide from its seller.</p>`,
        },
        {
          title: 'Why TWO 9V batteries?',
          html: `
            <p>The amplifiers inside need room to swing <b>above and below</b> the middle voltage, because your body (through the reference electrode) sits right at the middle. So the module wants a <b>positive</b> and a <b>negative</b> supply: a <b>bipolar supply</b>.</p>
            <p>Two 9V batteries in series do exactly that. The joint in the middle becomes GND, giving <b>+9 V</b> above it and <b>−9 V</b> below it:</p>
            <table class="pin-table">
              <tr><th>Wire</th><th>Goes to</th></tr>
              <tr><td>Battery A <b>+</b></td><td>+Vs</td></tr>
              <tr><td>Battery A <b>−</b> and Battery B <b>+</b> (joined)</td><td>GND</td></tr>
              <tr><td>Battery B <b>−</b></td><td>−Vs</td></tr>
            </table>
            <p>You’ll need two <b>9V battery snap connectors</b> (clips with wires). And bonus: running on batteries keeps you completely separate from wall power. Safety by design. 🛡️</p>`,
        },
        {
          title: 'The electrode cable',
          html: `
            <p>The cable ends in three snaps for sticky gel electrode pads:</p>
            <ul>
              <li><b>Middle of muscle</b> (on the muscle belly)</li>
              <li><b>End of muscle</b> (2–3 cm further along, in line with the muscle)</li>
              <li><b>Reference</b> (on a bony spot like the elbow)</li>
            </ul>
            <p>The snaps are usually color-coded (often red, blue and black), but colors vary between sellers. Check your module’s guide to see which is which.</p>`,
        },
        {
          title: 'The danger: SIG can reach 9 V',
          html: `
            <p>Here’s the plot twist. SIG can swing anywhere from <b>0 V up to +Vs</b>: that’s up to about <b>9 V</b> with fresh batteries and the gain turned up. Your Arduino’s pins only survive <b>0–5 V</b>.</p>
            <p>The fix is your old friend from Module 2, the <b>voltage divider</b>: SIG → <b>10 kΩ</b> → A0, and A0 → <b>10 kΩ</b> → GND. Two equal resistors halve the voltage, so even a maxed-out 9.5 V becomes a safe <b>4.75 V</b>. No matter what the gain screw does, the Arduino is protected.</p>
            <p>And don’t forget: <b>module GND → Arduino GND</b>. Without a shared ground, the two boards don’t agree on what “0 V” is and the readings are nonsense.</p>`,
        },
        {
          type: 'widget',
          widget: 'protect',
          title: '🛡️ Protection calculator',
          html: '<p>Try turning the divider off. Then try different resistors. Find a combination that’s safe AND uses most of the 0–5 V range.</p>',
        },
        {
          type: 'jargon',
          terms: [
            ['+Vs / −Vs', 'The positive and negative supply pins of the module.'],
            ['Bipolar supply', 'Power with both + and − voltages around a middle ground (like ±9 V).'],
            ['SIG', 'The module’s output: the smooth envelope of your muscle signal.'],
            ['Trimmer', 'A tiny adjustable resistor turned with a screwdriver. Here it sets the gain.'],
            ['Shared ground', 'Connecting the GNDs of two circuits so they agree on 0 V.'],
          ],
        },
        {
          type: 'danger',
          title: '💪💥 How to fry an Arduino pin with your own biceps',
          html: `
            <ol>
              <li>Skip the divider: SIG straight into A0.</li>
              <li>Turn the gain screw all the way clockwise.</li>
              <li>Do your mightiest flex.</li>
              <li>SIG shoots toward 9 V. A0 was rated for 5. A0 is now retired.</li>
            </ol>
            <p><b>Why it happens:</b> the module’s output can go as high as its supply. The divider makes this impossible. Two resistors, one saved Arduino.</p>`,
        },
      ],
      search: 'EMG muscle sensor v3 module explained',
      videos: [
        { title: 'EMG Muscle Sensor Module V3.0 with Cable And Electrodes', channel: 'Techpacs', url: 'https://www.youtube.com/watch?v=fHv73WApNfA', desc: 'A look at the V3-style module, its cable and electrodes.' },
        { title: 'Advanced Circuits Ep. 1 - Muscle sensor EMG', channel: 'Arduino4all', url: 'https://www.youtube.com/watch?v=hPf91WalNsg', desc: 'How a muscle sensor circuit works and how it connects to an Arduino.' },
      ],
      quiz: [
        {
          q: 'What comes out of the module’s SIG pin?',
          answer: 1,
          options: [
            { t: 'The raw, fast-wiggling EMG around 0 V', why: 'This module doesn’t output raw EMG: it rectifies and smooths it first.' },
            { t: 'An amplified, rectified, smoothed envelope of the muscle signal' },
            { t: 'A digital ON/OFF signal', why: 'It’s an analog voltage that rises smoothly as you flex harder.' },
          ],
          explain: 'SIG is the envelope: up when you flex, down when you relax.',
        },
        {
          q: 'Why does the module need two 9V batteries?',
          answer: 0,
          options: [
            { t: 'To make a positive AND a negative supply around a middle ground' },
            { t: 'One is a spare', why: 'Both are used at the same time: one makes +9 V, the other −9 V.' },
            { t: 'To make 18 V for a stronger signal', why: 'It’s really ±9 V around the middle, so the amplifiers can swing both ways.' },
          ],
          explain: 'Two batteries in series with the middle as GND = ±9 V, a bipolar supply.',
        },
        {
          q: 'What’s the biggest voltage SIG can reach?',
          answer: 2,
          options: [
            { t: 'About 1 mV', why: 'That’s the raw muscle signal at the skin. SIG is heavily amplified.' },
            { t: 'Exactly 5 V', why: 'It isn’t limited to 5 V: it can go up to its supply, about 9 V.' },
            { t: 'About +Vs (around 9 V)' },
          ],
          explain: 'Up to +Vs. That’s why the divider is non-negotiable.',
        },
        {
          q: 'With SIG → 10 kΩ → A0 → 10 kΩ → GND, what’s the most A0 can see from a 9.5 V SIG?',
          answer: 1,
          options: [
            { t: '9.5 V', why: 'The divider halves it: 9.5 × 10k ÷ 20k.' },
            { t: '4.75 V' },
            { t: '0.95 V', why: 'That would need a 10:1 divider. Equal resistors halve the voltage.' },
          ],
          explain: '9.5 × 10 kΩ ÷ (10 kΩ + 10 kΩ) = 4.75 V. Safe!',
        },
        {
          q: 'Why connect the module’s GND to the Arduino’s GND?',
          answer: 0,
          options: [
            { t: 'So both circuits agree on what 0 V is (shared ground)' },
            { t: 'To charge the batteries from USB', why: 'GND doesn’t charge anything. It gives both boards the same reference.' },
            { t: 'It isn’t needed', why: 'Without it, A0 has no common reference and readings are nonsense.' },
          ],
          explain: 'Voltages are always measured between two points. Shared GND makes them match.',
        },
      ],
      challenges: [
        {
          type: 'build',
          title: 'Test the protection divider first',
          why: 'Prove the divider works with a battery before your muscle (or your Arduino) is involved.',
          parts: ['breadboard', '2 × 10 kΩ resistors', 'a 9V battery + snap connector', 'multimeter'],
          steps: [
            'Put two 10 kΩ resistors in series on the breadboard (end to end, sharing one column). That shared column is the “A0 point”.',
            'Connect the battery + to the free end of the first resistor and the battery − to the free end of the second.',
            'Meter on V⎓: black on battery −, red on the A0 point. You should read about <b>half</b> the battery voltage (≈ 4.5–4.8 V).',
            'Measure the battery itself too. Is the A0 point exactly half? That’s your divider, verified. ✅',
          ],
        },
        {
          type: 'build',
          title: 'Power up the module (no electrodes yet)',
          why: 'Check the ±9 V supply is right before anything touches your skin.',
          parts: ['EMG module', 'two 9V batteries + two snap connectors', 'breadboard', 'multimeter'],
          steps: [
            'Wire the batteries using the table above: A+ → +Vs, A− and B+ → GND, B− → −Vs.',
            'Meter on V⎓, black on GND. Red on +Vs: about <b>+9 V</b>. Red on −Vs: about <b>−9 V</b> (a minus sign is correct here!).',
            'Red on SIG (still black on GND): with nothing plugged into the cable, it should sit low (near 0 V) or wander a little.',
            'Unplug a battery clip when you’re done, so they don’t drain.',
          ],
        },
      ],
    },

    // ------------------------------------------------------------------ 7.3
    'm7-3': {
      minutes: 25,
      intro: 'This is it. The moment your muscle talks to your computer. 😤 We do it the Dr. Ohmi way: <b>safety checklist first</b>, then glory.',
      summary: 'Before connecting: laptop unplugged from the wall, module on its two 9V batteries, 10 kΩ + 10 kΩ divider between SIG and A0, module GND to Arduino GND, all electrodes on one arm (never across the chest), clean dry skin and fresh pads, gain trimmer low, and no implanted medical devices (otherwise use Demo mode). Place the middle electrode on the muscle belly, the end electrode 2–3 cm further along the muscle, and the reference on a bony spot like the elbow. Upload the EMG reader sketch (prints analogRead(A0) at 115200 baud), open the Serial Plotter, relax then flex. Turn the gain up gradually until a strong flex reaches about three quarters of the range without flat tops. Troubleshoot flat lines (power, wiring), constant max (gain too high, reference off) and hum (laptop on the charger, loose cables).',
      sections: [
        {
          type: 'widget',
          widget: 'checklist',
          title: '🚦 Pre-flight safety check',
          html: '<p>Tick every box for real before you stick on a single electrode.</p>',
          items: [
            'My laptop charger is <b>unplugged from the wall</b> (laptop running on battery).',
            'The EMG module is powered <b>only</b> by its two 9V batteries.',
            'SIG goes through the <b>10 kΩ + 10 kΩ divider</b> before reaching A0.',
            'The EMG module’s GND is connected to the Arduino’s GND.',
            'All three electrodes go on <b>one arm</b>. Never across the chest.',
            'My skin is clean and dry, and the electrode pads are fresh and sticky.',
            'The gain trimmer starts <b>low</b> (turned counter-clockwise).',
            'I don’t have a pacemaker or other implanted medical device. (If you do, enjoy Demo mode instead!)',
          ],
        },
        {
          title: 'Wiring it all up',
          html: `
            <table class="pin-table">
              <tr><th>From</th><th>To</th></tr>
              <tr><td>Battery A +</td><td>EMG +Vs</td></tr>
              <tr><td>Battery A − and Battery B + (joined)</td><td>EMG GND</td></tr>
              <tr><td>Battery B −</td><td>EMG −Vs</td></tr>
              <tr><td>EMG GND</td><td>Arduino GND (breadboard − rail)</td></tr>
              <tr><td>EMG SIG</td><td>10 kΩ → a breadboard column (the “A0 point”)</td></tr>
              <tr><td>A0 point</td><td>Arduino A0, and 10 kΩ → − rail</td></tr>
              <tr><td>Electrode cable</td><td>The module’s cable jack</td></tr>
            </table>
            <p>Arduino plugged into the laptop by USB (laptop on battery!). Batteries connected last.</p>`,
        },
        {
          title: 'Placing the electrodes',
          html: `
            <ol>
              <li>Wash the skin with soap and water (or an alcohol wipe) and let it dry. Oils and lotion block the signal.</li>
              <li>Snap the pads onto the cable <b>before</b> sticking them on (snapping onto your skin is uncomfortable).</li>
              <li><b>Middle electrode:</b> on the bulge (belly) of the muscle.</li>
              <li><b>End electrode:</b> 2–3 cm further along the muscle, in line with it.</li>
              <li><b>Reference electrode:</b> on the bony point of your elbow.</li>
              <li>Tape the cable to your arm so it doesn’t swing (remember motion artifacts!).</li>
            </ol>`,
        },
        {
          type: 'code',
          title: '🤖 The EMG reader sketch',
          html: '<p>Upload this, then open <b>Tools → Serial Plotter</b> and set it to <b>115200</b> baud.</p>',
          code: EMG_SKETCH,
        },
        {
          title: 'First contact & tuning the gain',
          html: `
            <ol>
              <li>Relax your arm completely. The line should sit low and fairly flat.</li>
              <li>Flex. It rises! 🎉 (If not, see the troubleshooting tips below.)</li>
              <li>Using a small screwdriver, turn the gain trimmer <b>clockwise</b> a little at a time.</li>
              <li>Stop when a strong flex reaches about <b>three quarters</b> of the way up (around 700) with a rounded top. Flat tops at the very top = too much gain: back off.</li>
            </ol>`,
        },
        {
          type: 'tip',
          title: '🔧 Troubleshooting',
          html: `
            <ul>
              <li><b>Flat at zero, even when flexing:</b> check the batteries (±9 V), the SIG wire, and that the cable is fully plugged in.</li>
              <li><b>Stuck near the top:</b> gain too high, or the reference electrode has come loose.</li>
              <li><b>Big regular wiggles (hum):</b> is the laptop really unplugged? Tape the cables down, use fresh pads, move away from chargers and lamps.</li>
              <li><b>Random jumps:</b> a loose jumper wire. Wiggle each one gently to find it.</li>
              <li><b>Itchy or red skin:</b> stop, remove the pads, and wash the area.</li>
            </ul>`,
        },
        {
          type: 'code',
          title: '🦾 Bonus: flex to move the servo',
          html: '<p>Servo on pin 9 (brown GND, red 5V, orange signal). Set <code>RELAXED</code> and <code>FULL</code> to your own plotter readings.</p>',
          code: SERVO_SKETCH,
        },
        {
          type: 'jargon',
          terms: [
            ['Electrode pad', 'A sticky gel sticker that makes good electrical contact with your skin.'],
            ['Muscle belly', 'The thick middle part of a muscle. Best spot for the middle electrode.'],
            ['Gain trimmer', 'The small screw on the module that sets how much SIG is amplified.'],
            ['constrain()', 'Arduino function that keeps a number inside a range.'],
          ],
        },
        {
          type: 'danger',
          title: '📢 How to get a LOT of noise (and break rule #1)',
          html: `
            <ol>
              <li>Leave the laptop plugged into the wall “just for a minute”.</li>
              <li>Your plot fills with a fat 50/60 Hz buzz.</li>
              <li>Worse: there’s now a path (through the charger) between your body and the mains wiring.</li>
            </ol>
            <p><b>Why it matters:</b> the charger is designed to be safe, but with electrodes on your skin we want <b>zero</b> connection to the wall. Battery-only is the rule, and as a bonus your signal gets much cleaner.</p>`,
        },
      ],
      search: 'Arduino EMG muscle sensor tutorial',
      videos: [
        { title: 'Arduino Muscle Sensor (EMG) Tutorial', channel: 'Au Robots', url: 'https://www.youtube.com/watch?v=1LjE07z5r7c', desc: 'Wiring a muscle sensor to an Arduino and reading it, with example code.' },
        { title: 'Muscle Sensor v3 Test 2 with Servo', channel: 'edgonzaliz', url: 'https://www.youtube.com/watch?v=IoCQ9lRYidU', desc: 'A V3 sensor driving a servo: exactly the bonus project in this lesson.' },
      ],
      quiz: [
        {
          q: 'Where does the <b>reference</b> electrode go?',
          answer: 2,
          options: [
            { t: 'On the muscle belly', why: 'That’s the middle electrode. The reference wants a quiet, bony spot.' },
            { t: 'On the other arm', why: 'All electrodes stay on one arm, never across the chest.' },
            { t: 'On a bony spot near the muscle, like the elbow' },
          ],
          explain: 'Bony spot, same arm. It gives the module a steady reference.',
        },
        {
          q: 'Your plot shows big regular wiggles even when relaxed. First thing to check?',
          answer: 0,
          options: [
            { t: 'Is the laptop unplugged from the wall?' },
            { t: 'Turn the gain to maximum', why: 'More gain makes the hum even bigger.' },
            { t: 'Use a longer cable', why: 'Longer cables pick up MORE hum. Shorter and taped down is better.' },
          ],
          explain: 'Regular wiggles = mains hum. Unplug the charger, tape cables, fresh pads.',
        },
        {
          q: 'How should you set the gain trimmer?',
          answer: 1,
          options: [
            { t: 'All the way up, for the biggest signal', why: 'That clips (flat tops) and every flex looks the same.' },
            { t: 'Start low, raise it until a strong flex reaches about three quarters of the range' },
            { t: 'It doesn’t matter', why: 'It matters a lot: too low = invisible, too high = clipping.' },
          ],
          explain: 'Just enough gain: big but not clipped.',
        },
        {
          q: 'Why clean your skin before sticking on the pads?',
          answer: 2,
          options: [
            { t: 'So the pads look nicer', why: 'It’s about electrical contact, not looks.' },
            { t: 'To make the muscle stronger', why: 'Cleaning doesn’t change the muscle, just the contact.' },
            { t: 'Oils and lotion block good electrical contact' },
          ],
          explain: 'Clean, dry skin = lower resistance = cleaner signal.',
        },
        {
          q: 'Which of these is NOT on the safety checklist?',
          answer: 1,
          options: [
            { t: 'Laptop unplugged from the wall', why: 'That one is definitely on the list!' },
            { t: 'Turn the gain to maximum before starting' },
            { t: 'Divider between SIG and A0', why: 'That one is on the list: it protects the Arduino.' },
          ],
          explain: 'The gain starts LOW. Everything else is a must.',
        },
      ],
      challenges: [
        {
          type: 'build',
          title: 'First contact',
          why: 'The big moment: see your own muscle on screen.',
          parts: ['everything from this lesson'],
          steps: [
            'Complete the safety checklist above, for real.',
            'Wire everything using the table. Batteries last.',
            'Clean skin, place the three electrodes, tape the cable.',
            'Upload the EMG reader, open the Serial Plotter at 115200 baud.',
            'Relax… then FLEX. Watch the line jump. You just read your own muscle! 🎉',
            'Tune the gain until a strong flex reaches about three quarters of the range.',
            'Write down your relaxed and full-flex readings: you’ll use them in the next lesson.',
          ],
        },
        {
          type: 'build',
          title: 'Flex-controlled servo',
          why: 'Your muscle, moving a machine. The same idea as a prosthetic hand.',
          parts: ['the working EMG setup', 'SG90 servo'],
          steps: [
            'Add the servo: brown → GND, red → 5V, orange → pin 9.',
            'Upload the servo sketch from this lesson. Put your relaxed and full readings into <code>RELAXED</code> and <code>FULL</code>.',
            'Flex slowly: the servo follows your muscle. Flex hard: 180°! 🦾',
            'If the servo twitches by itself, the servo’s noise is reaching the sensor: keep its wires away from the electrode cable.',
          ],
        },
      ],
    },

    // ------------------------------------------------------------------ 7.4
    'm7-4': {
      minutes: 20,
      intro: 'FINAL LESSON! 👑 Your muscle signal, live on screen, powering a gauge, a counter and a LASER BEAM. Let’s finish this boss fight in style.',
      summary: 'The Muscle Meter page reads the Arduino through the Web Serial API: Chrome or Edge on a computer can, with your permission, open the Arduino’s USB serial port and read the numbers it prints (nothing leaves your computer). iPhone Safari doesn’t support Web Serial, so Demo mode simulates a muscle. The meter smooths the readings (exponential moving average), calibrates a relaxed level and a full-power level, converts readings to a 0–100% power, counts flexes with hysteresis (on above 60%, reset below 30%) and charges a Lab Beam while you stay above 70%. Only one program can use the serial port at a time, so close the Arduino IDE’s Serial Monitor/Plotter first, and the baud rate must match (115200).',
      sections: [
        {
          title: 'Your muscle, on screen',
          html: `
            <p>The <b>Muscle Meter</b> turns your EMG setup into a live power gauge with a flex counter and a chargeable <b>Lab Beam</b>. It runs right here in the app.</p>
            <div class="btn-row"><a class="btn btn-primary" href="#/meter">💪 Open the Muscle Meter</a></div>
            <p class="small muted">On your iPhone, or without the sensor set up yet? Use <b>Demo mode</b> on the meter page: hold the button to flex a pretend muscle.</p>`,
        },
        {
          title: 'How a web page talks to your Arduino',
          html: `
            <p>Chrome and Edge on a computer support the <b>Web Serial API</b>: when you press <b>Connect</b>, the browser asks which USB device to open. You choose your Arduino, and the page can now read exactly what the Arduino prints, the same stream the Serial Monitor shows.</p>
            <ul>
              <li>Your sketch prints <b>one number per line</b> at <b>115200 baud</b>.</li>
              <li>The page splits the stream into lines and turns each line into a number.</li>
              <li>Nothing is uploaded anywhere: it all happens inside your browser.</li>
            </ul>
            <p>Only <b>one</b> program can use the port at a time, so close the Arduino IDE’s Serial Monitor and Plotter first. (iPhone Safari doesn’t support Web Serial, which is why Demo mode exists.)</p>`,
        },
        {
          title: 'How the meter works (you know all of this now!)',
          html: `
            <ol>
              <li><b>Smoothing:</b> an exponential moving average (Module 5) calms the readings.</li>
              <li><b>Calibration:</b> 3 seconds relaxed sets your 0%; 3 seconds of max flex sets your 100%.</li>
              <li><b>Normalizing:</b> power = (reading − relaxed) ÷ (full − relaxed), shown as a percentage.</li>
              <li><b>Flex counting with hysteresis:</b> a flex counts when you go above 60%, but the next one only counts after you drop below 30%. Two different thresholds stop jittery readings from counting 10 flexes at once.</li>
              <li><b>The Lab Beam:</b> stay above 70% to charge it; drop below and it slowly drains. Fill it… and find out. 😏</li>
            </ol>`,
        },
        {
          type: 'code',
          title: '📟 Bonus: muscle power bar on the LCD',
          html: '<p>Combine Module 4 and Module 7: a live bar graph of your muscle on the 16x2 LCD. (It still prints for the Muscle Meter too!)</p>',
          code: LCD_SKETCH,
        },
        {
          title: '🚀 Ideas for your own projects',
          html: `
            <ul>
              <li>🎵 <b>Muscle theremin:</b> map your flex to the passive buzzer’s pitch with <code>tone()</code>.</li>
              <li>🎮 <b>Game controller:</b> flex to jump in a browser game (the Muscle Meter code is a great starting point).</li>
              <li>⏱️ <b>Reaction tester:</b> LED lights at a random time; flex as fast as you can; the LCD shows your reaction time.</li>
              <li>🏋️ <b>Rep counter:</b> count bicep curls on the LCD.</li>
              <li>🤖 <b>Robot gripper:</b> a servo claw that closes when you flex: a mini prosthetic hand.</li>
            </ul>
            <p>When you build one, use the <b>Ask Claude</b> button below: describe your idea and paste your code. Mad Scientist rank awaits. 🧠</p>`,
        },
        {
          type: 'jargon',
          terms: [
            ['Web Serial API', 'Lets Chrome/Edge (with your permission) talk to USB serial devices like an Arduino.'],
            ['Calibration', 'Teaching a measuring tool what “zero” and “full” look like.'],
            ['Normalizing', 'Rescaling numbers to a standard range, like 0–100%.'],
            ['Threshold', 'A level that triggers something when crossed.'],
            ['Hysteresis', 'Using two different thresholds (on and off) to ignore jitter.'],
          ],
        },
        {
          type: 'danger',
          title: '🤼 How to make the meter and the IDE fight',
          html: `
            <ol>
              <li>Leave the Arduino IDE’s Serial Plotter open.</li>
              <li>Press Connect in the Muscle Meter.</li>
              <li>“Couldn’t open the port.” The IDE won’t share. Rude.</li>
            </ol>
            <p><b>Why it happens:</b> a serial port is like a phone line: only one app can be on the call. Close the Serial Monitor/Plotter (or the whole IDE), then connect. Same in reverse: stop the meter before uploading new code.</p>`,
        },
      ],
      search: 'Arduino Web Serial API browser',
      videos: [
        { title: 'Introduction to Controlling Arduino in a Web Browser Via Serial', channel: 'TriniRobotics', url: 'https://www.youtube.com/watch?v=q_2Cgeup2vs', desc: 'How a web page and an Arduino talk over serial, the idea behind the Muscle Meter.' },
        { title: 'How to control an Arduino & RGB Led directly from a browser using navigator serial', channel: 'Noah Glaser', url: 'https://www.youtube.com/watch?v=USwKQEpAMKA', desc: 'A hands-on Web Serial (navigator.serial) project with Chrome.' },
      ],
      quiz: [
        {
          q: 'Which browsers can use Web Serial to read your Arduino?',
          answer: 1,
          options: [
            { t: 'iPhone Safari', why: 'Safari on iPhone doesn’t support Web Serial. That’s what Demo mode is for.' },
            { t: 'Chrome or Edge on a computer' },
            { t: 'Any browser anywhere', why: 'Only Chromium-based browsers on computers support it (for now).' },
          ],
          explain: 'Chrome or Edge on a laptop/desktop.',
        },
        {
          q: 'Why calibrate the meter?',
          answer: 0,
          options: [
            { t: 'Everyone’s muscles and gain settings give different numbers' },
            { t: 'To charge the batteries', why: 'Calibration only teaches the page your relaxed and full-power levels.' },
            { t: 'The Arduino needs it to start', why: 'The Arduino doesn’t care. The page uses it to compute 0–100%.' },
          ],
          explain: 'Your relaxed and full-power readings become your personal 0% and 100%.',
        },
        {
          q: 'What does hysteresis do in the flex counter?',
          answer: 2,
          options: [
            { t: 'Makes the graph prettier', why: 'It’s about counting correctly, not looks.' },
            { t: 'Makes flexes count double', why: 'The opposite! It stops jitter from adding fake flexes.' },
            { t: 'Uses separate on/off thresholds so jittery readings don’t count as many flexes' },
          ],
          explain: 'On above 60%, reset below 30%: one real flex = one count.',
        },
        {
          q: 'The meter says it couldn’t open the port. Most likely cause?',
          answer: 0,
          options: [
            { t: 'The Arduino IDE’s Serial Monitor or Plotter is still open' },
            { t: 'Your muscles are too strong', why: 'Flattering, but no. 😄 A port can only be used by one app.' },
            { t: 'The electrodes are on the wrong arm', why: 'That affects the signal, not whether the port opens.' },
          ],
          explain: 'Only one program can use the serial port at a time.',
        },
        {
          q: 'The sketch prints at 9600 baud but the meter listens at 115200. What happens?',
          answer: 1,
          options: [
            { t: 'Everything works, just slower', why: 'Mismatched speeds don’t slow things down: they scramble them.' },
            { t: 'Garbage data: the numbers can’t be read' },
            { t: 'The Arduino resets', why: 'It just produces gibberish, like the baud-rate demo in Module 4.' },
          ],
          explain: 'Speeds must match: Serial.begin(115200) for the Muscle Meter.',
        },
      ],
      challenges: [
        {
          type: 'build',
          title: 'Fire the Lab Beam',
          why: 'The final boss. Your muscle, your circuit, your code, on screen.',
          parts: ['your working EMG setup from the last lesson', 'Chrome or Edge on your laptop (on battery!)'],
          steps: [
            'Upload the EMG reader sketch (the one from the Muscle Meter page). Close the Serial Monitor/Plotter.',
            'Open the <b>Muscle Meter</b> and press <b>Connect Arduino</b>. Choose your Arduino’s port.',
            'Calibrate: “Relax for 3 s”, then “Flex hard for 3 s”.',
            'Flex! Watch the gauge, the flex counter and Dr. Ohmi’s reactions.',
            'Hold your power above the dashed line until the Lab Beam fills… 🔥',
            'Screenshot your best result. You’ve beaten the final boss. 👑',
          ],
        },
        {
          type: 'sim',
          title: 'Demo mode warm-up (works on iPhone)',
          why: 'Practice the meter with a pretend muscle before (or instead of) wiring anything.',
          steps: [
            'Open the Muscle Meter and press <b>Demo mode</b>.',
            'Press and hold the big <b>HOLD TO FLEX</b> button (or the spacebar on a laptop).',
            'Try calibrating in demo mode: relax for 3 s, then hold for 3 s.',
            'Charge the Lab Beam to see what happens. 😏',
          ],
          link: { url: '#/meter', label: 'Open the Muscle Meter' },
        },
      ],
    },
  });
})();
