/* Module 3: Semiconductors. Lesson content. */
window.LabNotesLessons = window.LabNotesLessons || {};

Object.assign(window.LabNotesLessons, {
  // ------------------------------------------------------------------ 3.1
  'm3-1': {
    minutes: 12,
    intro: '<b>Diodes</b> are the bouncers of electronics: current gets in one way only. Wrong direction? “Sorry, you’re not on the list.” 🚫',
    summary: 'A diode lets current flow one way, from anode (+) to cathode (−), and blocks it the other way. The stripe on the body marks the cathode; in the symbol the triangle points in the direction of current and the bar is the cathode. When conducting, a silicon diode drops about 0.6–0.7 V (LEDs about 2–3 V). Uses: reverse-polarity protection, flyback diodes across motors and relays (stripe toward +), turning AC into DC (rectifiers), and clamping signals to protect inputs. A flyback diode put in the wrong way round shorts the supply.',
    sections: [
      {
        title: 'A one-way valve for current',
        html: `
          <p>A <b>diode</b> is like a one-way valve in a water pipe. Current can flow from its <b>anode</b> (+) to its <b>cathode</b> (−), but not back the other way.</p>
          <ul>
            <li>On the real part, a <b>stripe</b> marks the <b>cathode</b> end.</li>
            <li>In circuit drawings, the symbol is a <b>triangle pointing the way current flows</b>, with a <b>bar</b> at the cathode: ▶|</li>
          </ul>
          <p>Diodes are made from a <b>semiconductor</b>, usually silicon: a material that’s somewhere between a conductor and an insulator, and that engineers can tweak to behave in clever one-way ways.</p>`,
      },
      {
        type: 'widget',
        widget: 'diode',
        title: '🚦 Try to get past the bouncer',
        html: '<p>Flip the diode, flip the battery. When does the lamp light?</p>',
      },
      {
        title: 'The toll: forward voltage',
        html: `
          <p>Going through a diode isn’t free: it takes a small, fairly fixed chunk of voltage, called the <b>forward voltage</b>.</p>
          <ul>
            <li>Ordinary silicon diodes (like the <b>1N4007</b> or <b>1N4148</b>): about <b>0.6–0.7 V</b>.</li>
            <li>LEDs: about <b>2–3 V</b>, depending on the color (next lesson!).</li>
          </ul>
          <p>So a diode in series with your 5 V LED circuit leaves a little less for the LED and resistor. Ohm’s law still works, you just subtract the toll first.</p>`,
      },
      {
        title: 'What are diodes for?',
        html: `
          <ul>
            <li>🛡️ <b>Reverse-polarity protection:</b> put the battery in backwards and the diode simply blocks it, saving your circuit.</li>
            <li>🌀 <b>Flyback diodes:</b> across motors and relays to swallow the kickback spike (from the inductors lesson).</li>
            <li>〰️ <b>Rectifiers:</b> turning AC (back-and-forth) into DC (one way). Every phone charger does this.</li>
            <li>🧱 <b>Clamping:</b> stopping a signal from going too high or too low, to protect an input. Useful for the EMG final boss!</li>
          </ul>`,
      },
      {
        type: 'jargon',
        terms: [
          ['Diode', 'A part that lets current flow one way only.'],
          ['Anode / cathode', 'The + end (current goes in) and the − end (current comes out, marked by the stripe).'],
          ['Forward bias', 'Connected the “allowed” way round: current flows.'],
          ['Reverse bias', 'Connected backwards: current is blocked.'],
          ['Semiconductor', 'A material like silicon whose conductivity engineers can control. Diodes, LEDs and transistors are all semiconductors.'],
          ['Rectifier', 'A diode circuit that turns AC into DC.'],
        ],
      },
      {
        type: 'danger',
        title: '☠️ How to turn your flyback diode into a short circuit',
        html: `
          <ol>
            <li>Put a diode across a motor “to protect it”…</li>
            <li>…but the wrong way round (stripe toward ground instead of toward +).</li>
            <li>Switch the motor on. The diode now conducts straight from + to ground.</li>
            <li>The diode, the transistor or the battery gets very hot, very fast.</li>
          </ol>
          <p><b>Why it happens:</b> a flyback diode must be <b>reverse-biased</b> in normal operation, so it only wakes up for the spike. The rule: <b>stripe toward the + supply</b>.</p>`,
      },
    ],
    search: 'how a diode works for beginners',
    videos: [
      { title: 'What Is A Diode & How Does a Diode Work?', channel: 'Engineeringness', url: 'https://www.youtube.com/watch?v=bhy7sJkNsK4', desc: 'Short, animated: what diodes do and how P-type and N-type materials make a one-way valve.' },
      { title: 'Resistor, Capacitor, Diode, Transistor: Electronics Basics for Beginners', channel: 'CoreScholar', url: 'https://www.youtube.com/watch?v=Xeq40Dbkm3w', desc: 'A quick tour of the parts from this module and the last, side by side.' },
    ],
    quiz: [
      {
        q: 'The stripe on a diode marks the…',
        answer: 1,
        options: [
          { t: 'Anode (+)', why: 'The other end! The stripe matches the bar in the symbol, which is the cathode.' },
          { t: 'Cathode (−)' },
          { t: 'Brand logo', why: 'It’s important information: it tells you which way round to fit it.' },
        ],
        explain: 'Stripe = cathode, just like the bar in the ▶| symbol.',
      },
      {
        q: 'Through a diode, current flows from…',
        answer: 0,
        options: [
          { t: 'Anode to cathode' },
          { t: 'Cathode to anode', why: 'That’s the blocked direction.' },
          { t: 'Either way, it doesn’t matter', why: 'That would make it a plain wire. The whole point of a diode is one way only.' },
        ],
        explain: 'Anode → cathode, the way the triangle points.',
      },
      {
        q: 'How much voltage does a normal silicon diode “use up” when it conducts?',
        answer: 2,
        options: [
          { t: 'About 5 V', why: 'Much less! That would eat your whole Arduino supply.' },
          { t: '0 V', why: 'Diodes always charge a small toll.' },
          { t: 'About 0.6–0.7 V' },
        ],
        explain: 'Silicon diodes drop about 0.6–0.7 V. LEDs drop more (2–3 V).',
      },
      {
        q: 'A diode is connected backwards (reverse biased) in a 5 V circuit. What flows?',
        answer: 1,
        options: [
          { t: 'Extra current', why: 'Backwards means blocked, not boosted.' },
          { t: 'Basically nothing' },
          { t: 'Half the current', why: 'Diodes aren’t half-open: they either conduct or block.' },
        ],
        explain: 'Reverse bias blocks current (at least until very high voltages, which we won’t use).',
      },
      {
        q: 'How should a flyback diode across a motor be placed?',
        answer: 0,
        options: [
          { t: 'Stripe toward the + supply, so it normally blocks' },
          { t: 'Stripe toward ground', why: 'Then it conducts all the time: a short circuit across the supply!' },
          { t: 'In series with the motor', why: 'That would just drop 0.7 V. A flyback diode goes across the motor.' },
        ],
        explain: 'Across the motor, stripe to +. It only conducts when the kickback spike arrives.',
      },
    ],
    challenges: [
      {
        type: 'build',
        title: 'Diode check with your meter',
        why: 'Most multimeters have a diode mode that shows the forward voltage. Let’s see the one-way valve in numbers.',
        parts: ['multimeter', 'a diode (e.g. 1N4007 or 1N4148)', 'an LED'],
        steps: [
          'Turn the dial to the <b>diode</b> symbol (often shared with continuity).',
          'Red probe on the <b>anode</b> (no stripe), black on the <b>cathode</b> (stripe). You should see about <b>0.5–0.7</b> (that’s volts).',
          'Swap the probes. Now it says <b>OL</b>: blocked!',
          'Try an LED: red on the long leg, black on the short. Many meters show around 1.6–2.0 and the LED may glow faintly. (Blue and white LEDs need more voltage than some meters give, so they might show OL either way.)',
        ],
      },
      {
        type: 'sim',
        title: 'AC becomes DC (Falstad)',
        why: 'See a diode chop off half of an AC wave: the first step of every phone charger.',
        steps: [
          'Open Falstad’s “Half-Wave Rectifier” example (button below).',
          'The source on the left goes up and down (AC). Watch the graph: after the diode, only the top halves are left.',
          'Then try the menu <b>Circuits → Diodes → Full-Wave Rectifier</b>: four diodes, and both halves come out positive!',
        ],
        link: { url: window.LabLinks.falstadExample('rectify.txt'), label: 'Open in Falstad' },
      },
    ],
  },

  // ------------------------------------------------------------------ 3.2
  'm3-2': {
    minutes: 15,
    intro: '<b>LEDs</b>: diodes that glow when they’re happy (current the right way) and sulk silently when they’re backwards. Today: how they work, how to wire them, and how NOT to cook them. 💡',
    summary: 'An LED (light-emitting diode) gives off light when current flows from anode to cathode; the semiconductor material sets the color, and white LEDs are usually blue LEDs with a yellow phosphor coating. Long leg = anode (+), short leg and the flat edge on the rim = cathode (−). Forward voltage is about 2 V (red/yellow/green) to 3 V (blue/white); standard 5 mm LEDs want 20 mA or less. Always use a series resistor, R = (Vsupply − Vf) ÷ I, and give each LED its own resistor when in parallel. Backwards, an LED just doesn’t light (at low voltages). Arduino dims LEDs with PWM.',
    sections: [
      {
        title: 'How does an LED make light?',
        html: `
          <p><b>LED</b> stands for <b>Light-Emitting Diode</b>. It’s a diode (one-way valve) made from special semiconductor materials. When current flows the right way, electrons drop into lower-energy spots inside the material and release their spare energy as a tiny flash of <b>light</b>. Billions per second = a steady glow.</p>
          <p>The <b>material</b> decides the color: different materials release different amounts of energy, and different energy = different color. <b>White</b> LEDs are usually <b>blue</b> LEDs with a yellow coating (phosphor) that turns some of the blue into yellow, which our eyes see as white.</p>`,
      },
      {
        title: 'LED anatomy',
        html: `
          <svg class="wg-svg" viewBox="0 0 320 210" style="max-width:360px" role="img" aria-label="LED anatomy: the long leg is the anode, plus. The short leg and the flat edge on the rim mark the cathode, minus.">
            <path d="M115 128 V72 A45 45 0 0 1 205 72 V128 Z" fill="rgba(255,45,45,.55)" stroke="#efeaff" stroke-width="2"/>
            <path d="M104 128 H210 V140 H104 Z" fill="rgba(255,45,45,.75)" stroke="#efeaff" stroke-width="2"/>
            <path d="M210 128 V140" stroke="#ffd23f" stroke-width="5"/>
            <path d="M140 84 V128" stroke="#cfcfd8" stroke-width="4"/>
            <path d="M168 96 L186 96 L186 128 L168 128 Z" fill="#cfcfd8"/>
            <path d="M140 140 V200 M178 140 V180" stroke="#cfcfd8" stroke-width="5" stroke-linecap="round"/>
            <text x="134" y="204" text-anchor="end" class="wg-label small">anode (+) long leg</text>
            <text x="188" y="186" class="wg-label small">cathode (−) short leg</text>
            <text x="216" y="122" class="wg-label small">flat edge = cathode</text>
            <text x="98" y="92" text-anchor="end" class="wg-label small">little post</text>
            <text x="216" y="100" class="wg-label small">big “anvil”</text>
          </svg>
          <ul>
            <li><b>Long leg = anode (+)</b>. Short leg = cathode (−). (Clipped the legs? Use the next clue.)</li>
            <li>The rim has a <b>flat edge</b> on the cathode side.</li>
            <li>Inside, the bigger “anvil” piece is <i>usually</i> the cathode, but not always. When in doubt, test it with your meter’s diode mode.</li>
          </ul>`,
      },
      {
        title: 'Wiring rules',
        html: `
          <ol>
            <li><b>Always a resistor.</b> R = (supply − LED voltage) ÷ current. Standard 5 mm LEDs want <b>20 mA or less</b>; 10–15 mA is plenty bright.</li>
            <li><b>Anode toward +.</b> Backwards, it just doesn’t light (no harm at Arduino voltages).</li>
            <li><b>One resistor per LED</b> when they’re side by side (parallel).</li>
            <li><b>LEDs in series</b> add their voltages: two red LEDs need about 4 V, plus some for the resistor.</li>
          </ol>`,
      },
      {
        type: 'widget',
        widget: 'ledCalc',
        title: '💡 LED resistor calculator (again, because it’s that useful)',
        html: '<p>Try the same current with different colors: blue and white need smaller resistors because they use more voltage.</p>',
      },
      {
        title: 'Dimming preview: PWM',
        html: '<p>An Arduino can’t give “half a volt-ish” on a normal pin: it’s on or off. So it fakes dimming by switching the LED on and off hundreds of times a second (<b>PWM</b>, pulse-width modulation). On 25% of the time = looks about quarter bright. Your eyes average it out. You’ll do this in Module 4!</p>',
      },
      {
        type: 'jargon',
        terms: [
          ['LED', 'Light-Emitting Diode: a diode that glows when current flows forward.'],
          ['Forward voltage (Vf)', 'About 2 V for red/yellow/green, 3 V for blue/white.'],
          ['Forward current (If)', 'How much current flows. Standard LEDs: 20 mA max, 10–15 mA is comfy.'],
          ['Phosphor', 'A coating that glows a different color when light hits it. Makes white LEDs.'],
          ['PWM', 'Pulse-width modulation: fast on/off switching to fake “half power”.'],
        ],
      },
      {
        type: 'danger',
        title: '🥊 How to make your LEDs fight (please don’t)',
        html: `
          <ol>
            <li>Put three LEDs side by side (parallel)…</li>
            <li>…with just ONE shared resistor.</li>
            <li>The LED with the lowest forward voltage grabs most of the current. It glows brightest, gets hot, and may die. Then the next one takes over. Domino effect!</li>
          </ol>
          <p><b>Why it happens:</b> no two LEDs are identical. A tiny difference in forward voltage makes a big difference in current. Give each LED its own resistor and everyone’s happy.</p>`,
      },
    ],
    search: 'LED basics for beginners how to wire an LED',
    videos: [
      { title: 'LED Basics', channel: 'Afrotechmods', url: 'https://www.youtube.com/watch?v=Yo6JI_bzUzo', desc: 'A classic: polarity, forward voltage and current-limiting resistors, explained clearly.' },
      { title: 'LED Basics - Electronics with Becky Stern', channel: 'DigiKey', url: 'https://www.youtube.com/watch?v=i7LFZxQcCQo', desc: 'How LEDs work and how to pick and wire them for projects.' },
      { title: 'An Introduction to Light-Emitting Diodes (LEDs)', channel: 'Quick Start Workbook', url: 'https://www.youtube.com/watch?v=npHmj4BzpIM', desc: 'A short “electronics for absolute beginners” overview of LEDs in circuits.' },
    ],
    quiz: [
      {
        q: 'The <b>long</b> leg of an LED is the…',
        answer: 0,
        options: [
          { t: 'Anode (+)' },
          { t: 'Cathode (−)', why: 'The short leg is the cathode. Long = +.' },
          { t: 'Ground leg', why: 'Ground connects to the cathode, which is the short leg.' },
        ],
        explain: 'Long leg = anode = goes toward +.',
      },
      {
        q: 'The flat edge on the LED’s rim marks the…',
        answer: 1,
        options: [
          { t: 'Anode', why: 'Flat edge = cathode, same side as the short leg.' },
          { t: 'Cathode' },
          { t: 'Brightest side', why: 'It’s a polarity marker, not a brightness hint.' },
        ],
        explain: 'Flat edge = cathode (−). Handy when the legs have been trimmed.',
      },
      {
        q: 'Why should each LED get its own resistor when they’re in parallel?',
        answer: 2,
        options: [
          { t: 'It looks neater', why: 'It’s about current sharing, not looks.' },
          { t: 'LEDs can’t share wires', why: 'They can share wires just fine. The problem is unequal current.' },
          { t: 'Tiny voltage differences make one LED hog the current' },
        ],
        explain: 'Small forward-voltage differences cause big current differences. Separate resistors keep it fair.',
      },
      {
        q: 'How are most white LEDs made?',
        answer: 0,
        options: [
          { t: 'A blue LED with a yellow phosphor coating' },
          { t: 'Red, green and blue LEDs glued together', why: 'RGB LEDs exist, but most white LEDs use blue + phosphor.' },
          { t: 'A tiny light bulb inside', why: 'No filament here: it’s all semiconductor magic.' },
        ],
        explain: 'Blue light + a yellow-glowing phosphor looks white to our eyes.',
      },
      {
        q: 'You plug an LED in backwards on the Arduino’s 5 V. What happens?',
        answer: 1,
        options: [
          { t: 'It explodes', why: 'Too dramatic! At 5 V backwards, it simply blocks the current.' },
          { t: 'It just doesn’t light up' },
          { t: 'It glows a different color', why: 'LEDs only glow when current flows forward.' },
        ],
        explain: 'Backwards = reverse biased = blocked. Flip it around and it lights.',
      },
    ],
    challenges: [
      {
        type: 'build',
        title: 'Rainbow board',
        why: 'Different colors, different forward voltages, one tidy breadboard.',
        parts: ['Arduino + USB', 'breadboard', '3 LEDs of different colors', '3 resistors (use the calculator: 220 Ω is fine for red/yellow/green at 5 V, 150 Ω for blue/white)', 'jumper wires', 'multimeter'],
        steps: [
          'USB unplugged. 5V → + rail, GND → − rail.',
          'For each LED: resistor from the + rail to its own column, LED long leg in the same column, short leg in the − rail. Every LED gets its own resistor and column.',
          'Plug in USB. Do they look equally bright? Brightness depends on color and on how efficient each LED is, not just current.',
          'Measure the voltage across each LED (V⎓). Write down the forward voltages. Does blue use more than red?',
          'Bonus: flip one LED around. Dark, no drama. Flip it back.',
        ],
      },
      {
        type: 'sim',
        title: 'Break an LED for free (Tinkercad)',
        why: 'Tinkercad warns you when an LED gets too much current, so you can find the limit without buying new LEDs.',
        steps: [
          'In Tinkercad Circuits, make a new circuit with a 9V battery, an LED and a resistor in a loop.',
          'Set the resistor to 1 kΩ and start the simulation. It glows.',
          'Now try 100 Ω, then 10 Ω. Hover over the LED: when the current is too high, Tinkercad shows a warning on it.',
          'Use the calculator above to find the right resistor for 9 V and 15 mA, and check it in Tinkercad.',
        ],
        link: { url: 'https://www.tinkercad.com/circuits', label: 'Open Tinkercad Circuits' },
      },
    ],
  },

  // ------------------------------------------------------------------ 3.3
  'm3-3': {
    minutes: 18,
    intro: 'The <b>TRANSISTOR</b>: the tiny switch that changed the world. A whisper of current into one leg controls a big current through the other two. Your phone has billions of them! 🎛️',
    summary: 'An NPN bipolar transistor has three legs: base (B), collector (C), emitter (E). A small current into the base (base to emitter) lets a much bigger current flow from collector to emitter; the gain (β or hFE) is often 100–300. Used as a switch: load between + and collector, emitter to ground, base through a resistor (about 1 kΩ) to the control signal. Fully on = saturated, off = cutoff. Needed because an Arduino pin can only give about 20 mA while motors need hundreds of mA. Always use a base resistor: the base–emitter junction is like a diode. Pinouts differ between part numbers (e.g. 2N3904/PN2222A: E-B-C, BC547: C-B-E with the flat face toward you), so look yours up. MOSFETs are voltage-controlled switches for bigger loads.',
    sections: [
      {
        title: 'A switch with no moving parts',
        html: `
          <p>A <b>transistor</b> is an electronic switch (and amplifier) made from semiconductor. The kind in your kit is almost certainly an <b>NPN bipolar transistor</b>, with three legs:</p>
          <ul>
            <li><b>Base (B):</b> the control input</li>
            <li><b>Collector (C):</b> where the big current comes in</li>
            <li><b>Emitter (E):</b> where everything leaves, toward ground</li>
          </ul>
          <p>The trick: a <b>small current</b> flowing into the base (and out of the emitter) allows a <b>much bigger current</b> to flow from collector to emitter. How much bigger is the <b>gain</b>, written <b>β</b> or <b>hFE</b>, often 100–300.</p>
          <p>Water version: a tiny trickle pushes open a big gate on a huge pipe.</p>`,
      },
      {
        type: 'widget',
        widget: 'transistor',
        title: '🎚️ Tiny current in, big current out',
        html: '<p>Slide the base current up slowly. Watch what happens to the LED current: first it grows 100× faster than the base current, then it hits a ceiling.</p>',
      },
      {
        title: 'The switch recipe',
        html: `
          <p>For switching things with an Arduino, we always wire an NPN transistor like this:</p>
          <ol>
            <li>The <b>load</b> (LED + resistor, or a motor) goes from <b>+ supply</b> to the <b>collector</b>.</li>
            <li>The <b>emitter</b> goes straight to <b>ground</b>.</li>
            <li>The <b>base</b> connects through a <b>base resistor</b> (about <b>1 kΩ</b>) to the control signal (an Arduino pin, or a wire you move).</li>
          </ol>
          <p>Control at 5 V → base current ≈ (5 − 0.7) ÷ 1000 ≈ 4.3 mA. With a gain of 100, that could allow up to ~430 mA: way more than an LED or small motor needs, so the transistor is <b>fully on</b> (saturated). Control at 0 V → no base current → <b>fully off</b>.</p>
          <p><b>Why bother?</b> An Arduino pin can only safely give about <b>20 mA</b>. Your DC motor wants a few hundred. The transistor does the heavy lifting while the Arduino just whispers.</p>`,
      },
      {
        title: '🔎 Find your transistor’s legs',
        html: `
          <p>Different transistors put B, C and E in different orders! Read the tiny number printed on the flat face (like <b>2N3904</b>, <b>PN2222A</b>, <b>S8050</b> or <b>BC547</b>) and search “<i>number</i> pinout”.</p>
          <p>Two common ones, with the <b>flat face toward you and legs pointing down</b>:</p>
          <ul>
            <li><b>2N3904, PN2222A, S8050:</b> E – B – C (left to right)</li>
            <li><b>BC547:</b> C – B – E</li>
          </ul>
          <p>Getting it wrong usually doesn’t break anything at 5 V; it just doesn’t work. So if your circuit is dead, check the pinout first!</p>`,
      },
      {
        title: 'Bonus: the MOSFET',
        html: '<p>Another popular transistor type is the <b>MOSFET</b>. Instead of a base <i>current</i>, it’s controlled by a gate <i>voltage</i>, and it can switch big loads with very little heat. For your small motor, the NPN is perfect; for big motors and LED strips, people often use MOSFETs. (GreatScott has a great video on both.)</p>',
      },
      {
        type: 'jargon',
        terms: [
          ['Transistor', 'A semiconductor switch/amplifier controlled by a small signal.'],
          ['NPN', 'The most common bipolar transistor type. Switches the ground side of a load.'],
          ['Base / Collector / Emitter', 'Control leg / big-current-in leg / everything-out leg.'],
          ['Gain (β, hFE)', 'How many times bigger the collector current can be than the base current.'],
          ['Saturated', 'Fully on, like a closed switch.'],
          ['Cutoff', 'Fully off, like an open switch.'],
        ],
      },
      {
        type: 'danger',
        title: '🍳 How to cook a transistor (and your Arduino pin)',
        html: `
          <ol>
            <li>Connect an Arduino pin <b>directly</b> to the base. No resistor.</li>
            <li>The base–emitter path acts like a diode: once it reaches ~0.7 V, it lets almost unlimited current through.</li>
            <li>The pin tries to push as much current as it can. The transistor’s base and the Arduino pin both overheat.</li>
          </ol>
          <p><b>Why it happens:</b> nothing limits the base current. The base resistor is the bodyguard here, exactly like the resistor for an LED. ~1 kΩ is a great default.</p>`,
      },
    ],
    search: 'NPN transistor as a switch for beginners',
    videos: [
      { title: 'Electronic Basics #22: Transistor (BJT) as a Switch', channel: 'GreatScott!', url: 'https://www.youtube.com/watch?v=WRm2oUw4owE', desc: 'GreatScott explains exactly how to calculate and build a transistor switch.' },
      { title: 'How to Use an NPN Transistor as a Switch', channel: 'HenryVolt', url: 'https://www.youtube.com/watch?v=rvMugH_zLrQ', desc: 'A practical, hands-on walkthrough of the switch recipe on a breadboard.' },
      { title: 'BC547 NPN Transistor as a switch - Arduino example', channel: 'DIY Engineers', url: 'https://www.youtube.com/watch?v=-o46f7fIX9A', desc: 'A real Arduino switching an LED through a BC547: a preview of Module 4.' },
    ],
    quiz: [
      {
        q: 'What are the three legs of a bipolar transistor?',
        answer: 2,
        options: [
          { t: 'Anode, cathode, gate', why: 'Anode and cathode belong to diodes; “gate” is a MOSFET leg.' },
          { t: 'Positive, negative, ground', why: 'Close in spirit, but the real names are base, collector, emitter.' },
          { t: 'Base, collector, emitter' },
        ],
        explain: 'Base (control), collector (big current in), emitter (out to ground).',
      },
      {
        q: 'A small current into the base controls…',
        answer: 0,
        options: [
          { t: 'A bigger current from collector to emitter' },
          { t: 'The battery voltage', why: 'The transistor doesn’t change the supply voltage. It controls how much current flows through the load.' },
          { t: 'The color of the LED', why: 'Color comes from the LED material. The transistor controls the current.' },
        ],
        explain: 'Tiny base current → much bigger collector current (up to gain × base current).',
      },
      {
        q: 'Why does the base need a resistor?',
        answer: 1,
        options: [
          { t: 'To make the transistor slower', why: 'It’s about limiting current, not speed.' },
          { t: 'The base–emitter path acts like a diode, so without a resistor the base current is unlimited' },
          { t: 'It doesn’t need one', why: 'It really does: without one you can damage the transistor and the Arduino pin.' },
        ],
        explain: 'Like an LED, the base–emitter junction needs a current-limiting resistor.',
      },
      {
        q: 'Gain = 100 and the base current is 1 mA. What’s the most collector current it allows?',
        answer: 2,
        options: [
          { t: '1 mA', why: 'That ignores the gain. The collector can carry up to 100× more.' },
          { t: '101 A', why: 'Units! 100 × 1 mA = 100 mA.' },
          { t: '100 mA' },
        ],
        explain: '100 × 1 mA = 100 mA (if the load lets that much through).',
      },
      {
        q: 'Why use a transistor to run a DC motor from an Arduino?',
        answer: 0,
        options: [
          { t: 'A pin can only give about 20 mA, but the motor needs hundreds' },
          { t: 'Motors only work with transistors', why: 'A motor works fine straight from a battery. The issue is the Arduino pin’s small current limit.' },
          { t: 'To make the motor spin backwards', why: 'A single transistor just switches it on and off.' },
        ],
        explain: 'The transistor handles the big motor current while the Arduino pin provides just a tiny base current.',
      },
    ],
    challenges: [
      {
        type: 'build',
        title: 'Wire-controlled LED switch',
        why: 'Build the exact switch recipe you’ll use for the motor in Module 4, controlled by a jumper wire for now.',
        parts: ['Arduino + USB (as the 5 V supply)', 'breadboard', 'NPN transistor', 'LED', '220 Ω resistor', '1 kΩ resistor', 'a 100 kΩ resistor (if you have one)', 'jumper wires'],
        steps: [
          '<b>Look up your transistor’s pinout</b> (number on the flat face). Push it into three separate columns, flat face toward you.',
          'USB unplugged. 5V → + rail, GND → − rail.',
          '<b>Emitter</b> column → − rail with a jumper.',
          '<b>Collector:</b> LED short leg into the collector column, LED long leg into a new column, 220 Ω from that column to the + rail.',
          '<b>Base:</b> 1 kΩ from the base column to a new empty column. Put a loose jumper wire in that column: this is your “control wire”.',
          'Plug in USB. Touch the free end of the control wire to the <b>+ rail</b>: LED ON. Touch it to the <b>− rail</b>: LED OFF. You’re switching with a tiny base current!',
          'Bonus: swap the 1 kΩ for 100 kΩ. Still on, maybe dimmer? The base current is now ~43 µA, and the transistor multiplies it.',
        ],
        troubleshoot: [
          '<b>LED never lights?</b> Check the pinout (most common problem!) and the LED direction.',
          '<b>LED always on?</b> Collector and emitter may be swapped, or the LED is bypassing the transistor.',
        ],
      },
      {
        type: 'sim',
        title: 'Transistor switch in Falstad',
        why: 'Watch the currents move as you flip the switch.',
        steps: [
          'Open Falstad’s built-in transistor switch (button below).',
          'Click the switch on the left to connect the base. See the big current start flowing on the right?',
          'Hover over the transistor to see its currents. Compare the base current to the collector current.',
        ],
        link: { url: window.LabLinks.falstadExample('transswitch.txt'), label: 'Open in Falstad' },
      },
    ],
  },
});
