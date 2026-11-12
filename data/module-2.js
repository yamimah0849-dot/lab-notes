/* Module 2: Passive Parts. Lesson content. */
window.LabNotesLessons = window.LabNotesLessons || {};

Object.assign(window.LabNotesLessons, {
  // ------------------------------------------------------------------ 2.1
  'm2-1': {
    minutes: 18,
    intro: 'Resistors: tiny striped candies that control current. 🍬 Today we crack their secret stripe language AND learn to combine them like LEGO.',
    summary: 'Resistor color code (4 bands): digit, digit, multiplier (number of zeros), tolerance (gold ±5%). Colors 0–9: black, brown, red, orange, yellow, green, blue, violet, gray, white. Red-red-brown-gold = 220 Ω ±5%. Series: resistances add (R1 + R2), same current through both. Parallel: total is less than the smallest, R = R1×R2/(R1+R2) for two (two equal ones = half). Voltage divider: two resistors in series split a voltage, Vout = Vin × R2/(R1+R2); useful for LCD contrast and reading sensors.',
    sections: [
      {
        title: 'Reading the stripes',
        html: `
          <p>Resistors are too small to print numbers on, so they wear colored <b>bands</b>. Hold the resistor so the <b>gold or silver band is on the right</b>, then read left to right:</p>
          <ol>
            <li><b>Band 1:</b> first digit</li>
            <li><b>Band 2:</b> second digit</li>
            <li><b>Band 3:</b> multiplier, basically “how many zeros to add”</li>
            <li><b>Band 4:</b> tolerance: how accurate it is (gold = ±5%)</li>
          </ol>
          <p>The colors are 0 to 9 in rainbow-ish order: <b>black 0, brown 1, red 2, orange 3, yellow 4, green 5, blue 6, violet 7, gray 8, white 9</b>. Memory trick: <i>“<b>B</b>etter <b>B</b>e <b>R</b>ight <b>O</b>r <b>Y</b>our <b>G</b>reat <b>B</b>ig <b>V</b>enture <b>G</b>oes <b>W</b>rong.”</i></p>
          <p><b>Example:</b> red, red, brown, gold → 2, 2, add one zero → <b>220 Ω ±5%</b>.</p>
          <p class="funfact">🔵 Got blue resistors with <b>5 bands</b>? Those are precise (±1%) ones: 3 digits, then the multiplier, then tolerance (brown). When in doubt, measure it with your multimeter!</p>`,
      },
      {
        type: 'widget',
        widget: 'colorCode',
        title: '🎨 Stripe decoder',
        html: '<p>Tap colors to build a resistor and see its value. Or type a value to see which stripes it wears.</p>',
      },
      {
        title: 'Series: one after another',
        html: `
          <p>Resistors in a line, end to end, are in <b>series</b>. The current has to squeeze through every one of them, so the resistances simply <b>add up</b>:</p>
          <p class="funfact" style="text-align:center"><b>R<sub>total</sub> = R1 + R2 + …</b></p>
          <p>Your soldered resistor chain from Module 0? Two 220 Ω in series = 440 Ω. The <b>same current</b> flows through every part in series, and the battery’s voltage gets <b>shared</b> between them.</p>`,
      },
      {
        title: 'Parallel: side by side',
        html: `
          <p>Resistors connected across the same two points are in <b>parallel</b>. Current can take either path, which makes it <i>easier</i> to flow, so the total is <b>smaller than the smallest one</b>.</p>
          <ul>
            <li>Two <b>equal</b> resistors in parallel = <b>half</b> (two 1 kΩ = 500 Ω).</li>
            <li>Two different ones: <b>R = (R1 × R2) ÷ (R1 + R2)</b>.</li>
          </ul>
          <p>Think of opening an extra lane on a highway: more lanes, less traffic jam.</p>`,
      },
      {
        type: 'widget',
        widget: 'combo',
        title: '🧩 Combine them',
        html: '<p>Switch between series and parallel and change the values.</p>',
      },
      {
        title: 'Your first useful circuit: the voltage divider',
        html: `
          <p>Put two resistors in series between 5 V and ground. The point in the middle sits at a voltage <b>in between</b>:</p>
          <p class="funfact" style="text-align:center"><b>V<sub>out</sub> = V<sub>in</sub> × R2 ÷ (R1 + R2)</b></p>
          <p>(R1 on top, R2 on the bottom, next to ground.) Two equal resistors split it exactly in half: 5 V → <b>2.5 V</b>.</p>
          <p>This is a big deal for you: your 16x2 LCD needs a contrast voltage, which is normally set with a <b>potentiometer</b> (a knob that’s really an adjustable voltage divider). You don’t have one, so in Module 4 you’ll build a <b>fixed</b> voltage divider instead. Same idea, no knob.</p>`,
      },
      {
        type: 'jargon',
        terms: [
          ['Tolerance', 'How far the real value may be from the printed one. ±5% on a 220 Ω means 209–231 Ω.'],
          ['Series', 'Connected end to end, in one path. Resistances add.'],
          ['Parallel', 'Connected across the same two points. Total resistance drops.'],
          ['Equivalent resistance', 'The single resistor that would behave like the whole group.'],
          ['Voltage divider', 'Two series resistors that give a voltage in between, from their middle point.'],
          ['Potentiometer', 'A resistor with a knob: an adjustable voltage divider. (Not in your kit, but now you know.)'],
        ],
      },
      {
        type: 'danger',
        title: '😵 How to confuse yourself forever: read it backwards',
        html: `
          <p>Read red-red-brown-gold starting from the gold end and you get “gold, brown, red, red”: total nonsense. Or worse: brown-black-red (1 kΩ) read backwards is red-black-brown (200 Ω)! Your LED glows 5× brighter than planned and you have no idea why.</p>
          <p><b>The fix:</b> gold/silver band on the right. Not sure? Measure it. Your multimeter never reads backwards.</p>`,
      },
    ],
    search: 'resistor color code series parallel for beginners',
    videos: [
      { title: 'How To Read Resistor Colour Codes', channel: 'Engineer4Free', url: 'https://www.youtube.com/watch?v=md1GLYibkKA', desc: 'Step-by-step practice reading the stripes on 4-band resistors.' },
      { title: 'How To Use a Resistor (Wattage, Color Code, Parallel, Series, Types And More)', channel: 'Thinktronics', url: 'https://www.youtube.com/watch?v=69S1RRthBlc', desc: 'One video that covers almost everything in this lesson, with real parts.' },
      { title: 'Resistors in Series and Parallel Explained', channel: 'Engineer Thileban Explains', url: 'https://www.youtube.com/watch?v=jvN3kxcxnJM', desc: 'The rules and formulas for combining resistors, with worked examples.' },
    ],
    quiz: [
      {
        q: 'A resistor reads <b>red, red, brown, gold</b>. What is it?',
        answer: 1,
        options: [
          { t: '22 Ω', why: 'Brown in the third band means “add one zero”: 22 → 220.' },
          { t: '220 Ω ±5%' },
          { t: '2200 Ω', why: 'That would need a red third band (two zeros). Brown means one zero.' },
        ],
        explain: 'Red 2, red 2, brown = one zero → 220 Ω. Gold = ±5%.',
      },
      {
        q: '<b>Brown, black, orange, gold</b> is…',
        answer: 2,
        options: [
          { t: '103 Ω', why: 'The third band isn’t a digit, it’s the multiplier: orange = three zeros.' },
          { t: '1 kΩ', why: '1 kΩ is brown-black-RED (two zeros). Orange adds three zeros.' },
          { t: '10 kΩ' },
        ],
        explain: 'Brown 1, black 0, orange = add three zeros → 10 000 Ω = 10 kΩ.',
      },
      {
        q: 'Two 1 kΩ resistors in <b>series</b>. Total?',
        answer: 0,
        options: [
          { t: '2 kΩ' },
          { t: '500 Ω', why: 'That’s the parallel answer. In series, they add up.' },
          { t: '1 kΩ', why: 'In series the current goes through both, so the resistances add.' },
        ],
        explain: 'Series: add them. 1 kΩ + 1 kΩ = 2 kΩ.',
      },
      {
        q: 'Two 1 kΩ resistors in <b>parallel</b>. Total?',
        answer: 1,
        options: [
          { t: '2 kΩ', why: 'That’s series. Parallel gives current two paths, so the total drops.' },
          { t: '500 Ω' },
          { t: '1 kΩ', why: 'Two paths are easier than one, so the total has to be smaller than 1 kΩ.' },
        ],
        explain: 'Two equal resistors in parallel = half. (1000 × 1000) ÷ (1000 + 1000) = 500 Ω.',
      },
      {
        q: 'A voltage divider has 1 kΩ on top and 2 kΩ on the bottom, fed with 9 V. What’s the middle voltage?',
        answer: 2,
        options: [
          { t: '3 V', why: 'That’s the voltage across the top resistor. The middle point measures the bottom one: 9 × 2 ÷ 3.' },
          { t: '4.5 V', why: 'That would need two equal resistors.' },
          { t: '6 V' },
        ],
        explain: 'Vout = 9 × 2 ÷ (1 + 2) = 6 V. The bigger bottom resistor gets the bigger share.',
      },
    ],
    challenges: [
      {
        type: 'build',
        title: 'Stripe detective',
        why: 'Real resistors, real stripes, and your meter as the judge.',
        parts: ['3 different resistors', 'multimeter'],
        steps: [
          'Pick 3 different resistors. For each, read the bands (gold on the right) and write down the value you think it is.',
          'Check your guess with the decoder above.',
          'Set the meter to <b>Ω</b> and measure each one. Is it within ±5% of the printed value?',
          'Bonus: put two of them in series on the breadboard (same strip joins them) and measure the total. Then parallel. Does the math match?',
        ],
      },
      {
        type: 'build',
        title: 'Build a voltage divider',
        why: 'This exact trick will set your LCD’s contrast in Module 4.',
        parts: ['Arduino + USB', 'breadboard', '2 equal resistors (e.g. 1 kΩ + 1 kΩ)', 'a different resistor (e.g. 2.2 kΩ)', 'jumper wires', 'multimeter'],
        steps: [
          'Arduino 5V → + rail, GND → − rail (USB unplugged while wiring).',
          'Resistor R1 from the + rail to hole <b>a10</b>. Resistor R2 from hole <b>b10</b> to the − rail. Column 10 (a10–e10) is now the middle point.',
          'Plug in USB. Meter on <b>V⎓</b>: black on the − rail, red on column 10. Two equal resistors → about <b>2.5 V</b>.',
          'Unplug, swap R2 for the 2.2 kΩ. Predict with Vout = 5 × R2 ÷ (R1 + R2), then measure. (1 kΩ + 2.2 kΩ → about 3.4 V.)',
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ 2.2
  'm2-2': {
    minutes: 15,
    intro: 'Meet the <b>capacitor</b>: a tiny rechargeable bucket for electric charge. It fills, it empties, it smooths things out… and if you plug it in backwards, it goes POP. 🪣',
    summary: 'A capacitor stores charge on two metal plates separated by an insulator. Unit: farad (F); real parts are µF, nF, pF. Through a resistor it charges gradually with time constant τ = R × C (seconds): about 63% after 1τ, basically full after 5τ. Uses: smoothing power supplies (100 nF next to chips), timing, filtering noise, quick bursts of energy. Electrolytic capacitors have polarity (stripe = negative leg, long leg = +) and a voltage rating; backwards or over-voltage can make them bulge or burst. Ceramic code 104 = 10 × 10⁴ pF = 100 nF.',
    sections: [
      {
        title: 'A bucket for charge',
        html: `
          <p>A <b>capacitor</b> is two metal plates with a thin insulator in between. Connect a battery and charge piles up on the plates: the bucket fills. Take the battery away and the capacitor can give that charge back for a little while.</p>
          <p>How much it holds is its <b>capacitance</b>, measured in <b>farads (F)</b>. One farad is huge, so real parts use:</p>
          <ul>
            <li><b>µF</b> microfarad = one millionth of a farad (big, usually electrolytic)</li>
            <li><b>nF</b> nanofarad = one thousandth of a µF</li>
            <li><b>pF</b> picofarad = one thousandth of an nF (tiny)</li>
          </ul>`,
      },
      {
        title: 'Filling takes time: R × C',
        html: `
          <p>Fill a capacitor through a resistor and it doesn’t fill instantly. It charges fast at first, then slower and slower as it gets fuller (like a bucket under a hose where the water pressure drops as the bucket fills).</p>
          <p>The speed is set by the <b>time constant</b>:</p>
          <p class="funfact" style="text-align:center"><b>τ = R × C</b> (in seconds, with ohms × farads)</p>
          <p>After <b>1 τ</b> it’s about <b>63%</b> full. After <b>5 τ</b> it’s basically full (99%). Example: 10 kΩ × 100 µF = 10 000 × 0.0001 = <b>1 second</b>.</p>`,
      },
      {
        type: 'widget',
        widget: 'capCharge',
        title: '📈 Watch it charge',
        html: '<p>Pick a resistor and a capacitor, then charge and discharge. Bigger R or bigger C = slower.</p>',
      },
      {
        title: 'What are they for?',
        html: `
          <ul>
            <li><b>Smoothing power:</b> a 100 nF capacitor next to a chip is a tiny emergency tank that covers quick dips in the supply.</li>
            <li><b>Timing:</b> how long something takes to charge sets blink rates and delays.</li>
            <li><b>Filtering noise:</b> capacitors soak up fast wiggles in a signal. Huge for your EMG project (Module 5)!</li>
            <li><b>Quick bursts:</b> a camera flash charges a capacitor, then dumps it all at once.</li>
          </ul>`,
      },
      {
        title: 'Reading your capacitors',
        html: `
          <p><b>Electrolytic</b> (little cans): the value is printed, like <b>100 µF 25V</b>. They have <b>polarity</b>: the stripe with “−” signs marks the <b>negative</b> leg, and the long leg is +. The voltage (25V) is the most they can take.</p>
          <p><b>Ceramic</b> (small discs or blobs, no polarity): a 3-digit code in pF. First two digits, then the number of zeros. <b>104</b> = 10 + 0000 = 100 000 pF = <b>100 nF</b> = 0.1 µF. <b>103</b> = 10 nF.</p>`,
      },
      {
        type: 'jargon',
        terms: [
          ['Capacitance', 'How much charge a capacitor holds per volt. In farads (F).'],
          ['µF / nF / pF', 'Micro-, nano-, pico-farads. 1 µF = 1000 nF = 1 000 000 pF.'],
          ['Time constant (τ)', 'R × C. About 63% charged after 1τ, full after 5τ.'],
          ['Electrolytic', 'Can-shaped capacitor with big values. Has a + and − leg!'],
          ['Ceramic', 'Small capacitor, no polarity. Labeled with codes like 104.'],
          ['Voltage rating', 'The most voltage the capacitor can take. Stay well below it.'],
        ],
      },
      {
        type: 'danger',
        title: '💥 How to make an electrolytic capacitor go POP',
        html: `
          <ol>
            <li>Plug it in backwards (stripe on the + side).</li>
            <li>Or give it more voltage than its rating.</li>
            <li>It gets warm, bulges… and can burst with a loud bang and a smelly puff.</li>
          </ol>
          <p><b>Why it happens:</b> inside, a super-thin insulating layer only survives one way round and up to its rated voltage. Abuse it and current rushes through, boiling the liquid inside. <b>Stripe to ground, check the voltage rating, glasses on.</b> (At 5 V with the right way round, your kit’s capacitors are perfectly happy.)</p>`,
      },
    ],
    search: 'how capacitors work explained',
    videos: [
      { title: 'Capacitors Explained - The basics how capacitors work', channel: 'The Engineering Mindset', url: 'https://www.youtube.com/watch?v=X4EUwTwZ110', desc: 'Beautiful animations of what happens inside a capacitor, plus types and uses.' },
      { title: 'How Do Capacitors Work?', channel: 'The Organic Chemistry Tutor', url: 'https://www.youtube.com/watch?v=ImpJUHenhTM', desc: 'A clear whiteboard explanation of charge, capacitance and charging.' },
      { title: 'How Capacitors Work?', channel: 'Voltverse', url: 'https://www.youtube.com/watch?v=2MPDbqOX4Hw', desc: 'A short animated recap of how capacitors store and release charge.' },
    ],
    quiz: [
      {
        q: 'What does a capacitor store?',
        answer: 0,
        options: [
          { t: 'Electric charge (energy) on its plates' },
          { t: 'Resistance', why: 'Resistance isn’t something you store. That’s a resistor’s job description.' },
          { t: 'Magnetic energy in a coil', why: 'That’s an inductor (next lesson!).' },
        ],
        explain: 'Charge piles up on its two plates, storing a little energy.',
      },
      {
        q: 'What’s the time constant τ for 10 kΩ and 100 µF?',
        answer: 1,
        options: [
          { t: '1000 seconds', why: 'Units! 100 µF = 0.0001 F. 10 000 × 0.0001 = 1.' },
          { t: '1 second' },
          { t: '0.001 seconds', why: 'Check again: 10 000 Ω × 0.0001 F = 1 s.' },
        ],
        explain: 'τ = R × C = 10 000 × 0.000 1 = 1 s.',
      },
      {
        q: 'After about <b>5 τ</b>, a charging capacitor is…',
        answer: 2,
        options: [
          { t: 'About 63% full', why: 'That’s after 1 τ.' },
          { t: 'Exactly 50% full', why: 'It’s already past 63% after just one τ.' },
          { t: 'Basically full (about 99%)' },
        ],
        explain: '1τ ≈ 63%, 5τ ≈ 99%. Engineers call 5τ “fully charged”.',
      },
      {
        q: 'On an electrolytic capacitor, the stripe with “−” signs marks…',
        answer: 0,
        options: [
          { t: 'The negative leg, which goes toward ground (−)' },
          { t: 'The positive leg', why: 'The other way round! Minus signs = negative leg.' },
          { t: 'Nothing, it’s decoration', why: 'It’s important: electrolytics only work one way round.' },
        ],
        explain: 'Stripe = negative. The long leg is positive.',
      },
      {
        q: 'A tiny ceramic capacitor says <b>104</b>. What value?',
        answer: 1,
        options: [
          { t: '104 pF', why: 'The last digit is the number of zeros: 10 + 0000.' },
          { t: '100 nF (0.1 µF)' },
          { t: '104 µF', why: 'Ceramic codes are in picofarads, not microfarads.' },
        ],
        explain: '10 followed by 4 zeros = 100 000 pF = 100 nF = 0.1 µF.',
      },
    ],
    challenges: [
      {
        type: 'build',
        title: 'The fading LED',
        why: 'Watch a capacitor empty itself into an LED. The bigger the bucket, the longer the glow.',
        parts: ['Arduino + USB', 'breadboard', 'your biggest electrolytic capacitor (100 µF or more)', 'LED', '1 kΩ resistor', 'jumper wires'],
        steps: [
          'USB unplugged. Arduino GND → − rail. Do <b>not</b> connect 5V to the + rail yet.',
          'Capacitor: <b>long leg</b> into hole <b>a20</b>, <b>stripe leg</b> into the − rail.',
          'Resistor (1 kΩ) from <b>b20</b> to <b>b24</b>. LED long leg in <b>c24</b>, short leg into the − rail.',
          'Plug in USB. Take a jumper from the Arduino’s <b>5V</b> pin and touch it into <b>e20</b> for a second: the LED lights and the capacitor fills.',
          'Pull the jumper out. Does the LED fade out instead of switching off instantly? That’s the capacitor emptying!',
          'Try a smaller capacitor (or a 470 Ω resistor). Faster fade? τ = R × C in action.',
        ],
        troubleshoot: [
          '<b>No fade at all?</b> The capacitor may be too small to see (under ~100 µF the fade is very quick).',
          '<b>Capacitor getting warm?</b> Unplug! It’s probably backwards. Stripe goes to the − rail.',
        ],
      },
      {
        type: 'sim',
        title: 'Charge and discharge in Falstad',
        why: 'See the voltage curve with a virtual oscilloscope.',
        steps: [
          'Open Falstad’s built-in capacitor example (button below).',
          'Click the <b>switch</b> to flip between charging and discharging.',
          'Watch the graph at the bottom: it’s the same curve shape as our widget. Fast at first, then slower.',
          'Double-click the resistor and make it 10× bigger. What happens to the curve?',
        ],
        link: { url: window.LabLinks.falstadExample('cap.txt'), label: 'Open in Falstad' },
      },
    ],
  },

  // ------------------------------------------------------------------ 2.3
  'm2-3': {
    minutes: 12,
    intro: '<b>Inductors</b>: coils of wire that HATE change. Speed up the current? They push back. Stop it suddenly? They throw a tantrum (a giant voltage spike)! 🌀',
    summary: 'An inductor is a coil of wire. Current through it builds a magnetic field that stores energy, and the inductor resists changes in current (like a heavy flywheel or water wheel). Unit: henry (H), usually mH or µH. Found in motors, relays, buzzers/speakers, chargers and filters. Switching off current through a coil suddenly makes a big voltage spike (inductive kickback) that can kill transistors and Arduino pins; a flyback diode across the coil fixes it. Capacitors resist changes in voltage; inductors resist changes in current.',
    sections: [
      {
        title: 'A coil with a stubborn streak',
        html: `
          <p>Wind a wire into a <b>coil</b> and something magical happens: current flowing through it creates a <b>magnetic field</b>, and that field stores energy. The coil is now an <b>inductor</b>.</p>
          <p>Inductors <b>resist changes in current</b>. Imagine a heavy water wheel sitting inside the pipe: it’s hard to get spinning (current builds up slowly), and once it’s spinning, it’s hard to stop (current wants to keep going).</p>
          <p>Measured in <b>henries (H)</b>. Real parts are usually <b>mH</b> (millihenries) or <b>µH</b> (microhenries).</p>
          <p class="funfact">⚖️ <b>Mirror twins:</b> a capacitor resists changes in <b>voltage</b> (a bucket takes time to fill). An inductor resists changes in <b>current</b> (a flywheel takes time to speed up or slow down).</p>`,
      },
      {
        title: 'You already own a bunch',
        html: `
          <ul>
            <li>🌀 Your <b>DC motor</b> is basically coils and magnets.</li>
            <li>🔊 Your <b>passive buzzer</b> has a coil that pushes a tiny metal plate.</li>
            <li>🔌 Phone chargers use inductors to convert voltage efficiently.</li>
            <li>📻 Filters and radios use them to pick out certain frequencies.</li>
          </ul>`,
      },
      {
        title: 'The tantrum: inductive kickback',
        html: `
          <p>Here’s the dangerous bit. When current is flowing through a coil and you <b>suddenly switch it off</b>, the magnetic field collapses and the coil does everything it can to keep the current going. It creates a <b>huge voltage spike</b>, often many times the supply voltage, for a split second.</p>
          <p>That spike can zap the transistor (or Arduino pin) that switched the coil off. Motors and relays do this <i>every single time</i> they’re switched.</p>
          <p><b>The fix</b> is a <b>flyback diode</b> placed across the coil, backwards. Normally it does nothing, but when the spike comes, it gives the current a safe loop to fade away in. You’ll meet diodes properly in the next module, and you’ll use one with your motor in Module 4.</p>`,
      },
      {
        type: 'jargon',
        terms: [
          ['Inductor', 'A coil of wire that stores energy in a magnetic field.'],
          ['Henry (H)', 'Unit of inductance. Usually mH or µH in real parts.'],
          ['Magnetic field', 'The invisible “push zone” around a magnet or a wire carrying current.'],
          ['Inductive kickback', 'The voltage spike when current through a coil is suddenly stopped.'],
          ['Flyback diode', 'A diode across a coil that safely absorbs the kickback.'],
        ],
      },
      {
        type: 'danger',
        title: '⚡ How to assassinate a transistor with a motor',
        html: `
          <ol>
            <li>Switch a DC motor on and off with a transistor.</li>
            <li>Skip the flyback diode because “it works without it”.</li>
            <li>Every switch-off, the motor fires a voltage spike into the transistor.</li>
            <li>One day the transistor just… stops. (Sometimes on day one.)</li>
          </ol>
          <p><b>Why it happens:</b> the coil’s stored energy has to go somewhere. Without a diode, it goes through your transistor as a spike. With a diode, it loops harmlessly through the diode. Always add the diode.</p>`,
      },
    ],
    search: 'how inductors work explained',
    videos: [
      { title: 'Inductors Explained - The basics how inductors work', channel: 'The Engineering Mindset', url: 'https://www.youtube.com/watch?v=KSylo01n5FY', desc: 'Animated look at coils, magnetic fields and where inductors are used.' },
      { title: 'Inductors - What Are They And How Do They Work?', channel: 'The Organic Chemistry Tutor', url: 'https://www.youtube.com/watch?v=DQxOBvpkNAI', desc: 'A clear whiteboard intro to inductance and how coils oppose changing current.' },
      { title: 'Lesson 1 - What is an Inductor?', channel: 'Math and Science', url: 'https://www.youtube.com/watch?v=VyRWOGVEuUc', desc: 'The physics behind inductors, step by step, for beginners.' },
    ],
    quiz: [
      {
        q: 'Inductors resist changes in…',
        answer: 1,
        options: [
          { t: 'Voltage', why: 'That’s the capacitor’s thing. Inductors are the current-change haters.' },
          { t: 'Current' },
          { t: 'Color', why: 'Inductors are colorblind. 🙂' },
        ],
        explain: 'An inductor fights changes in current, like a heavy flywheel.',
      },
      {
        q: 'Where does an inductor store its energy?',
        answer: 2,
        options: [
          { t: 'On two metal plates', why: 'That’s a capacitor.' },
          { t: 'In a chemical reaction', why: 'That’s a battery.' },
          { t: 'In a magnetic field' },
        ],
        explain: 'Current through the coil builds a magnetic field, and the energy lives there.',
      },
      {
        q: 'You suddenly switch off the current through a coil. What happens?',
        answer: 0,
        options: [
          { t: 'It makes a big voltage spike (inductive kickback)' },
          { t: 'Nothing, it just stops', why: 'Inductors hate sudden change: the collapsing field creates a spike.' },
          { t: 'It turns into a magnet forever', why: 'The field disappears when the current stops. The danger is the spike while it does.' },
        ],
        explain: 'The collapsing magnetic field tries to keep current flowing and creates a high-voltage spike.',
      },
      {
        q: 'Which part in your kit is basically a big inductor?',
        answer: 1,
        options: [
          { t: 'The LED', why: 'LEDs are diodes, not coils.' },
          { t: 'The DC motor' },
          { t: 'The resistor', why: 'Resistors are made to have very little inductance.' },
        ],
        explain: 'Motors are full of coils, so they behave like inductors (including kickback).',
      },
      {
        q: 'What protects a transistor from a motor’s kickback?',
        answer: 2,
        options: [
          { t: 'A bigger battery', why: 'More voltage makes things worse, if anything.' },
          { t: 'A capacitor in series', why: 'That would block the motor’s DC current. The standard fix is a diode across the motor.' },
          { t: 'A flyback diode across the motor' },
        ],
        explain: 'A flyback diode gives the spike a safe loop to die out in.',
      },
    ],
    challenges: [
      {
        type: 'build',
        title: 'Your motor is secretly a generator',
        why: 'Coils + magnets work both ways: push current in and it spins; spin it and current comes out.',
        parts: ['small DC motor', 'multimeter'],
        steps: [
          'Set the meter to <b>V⎓</b> (2 V or 20 V range).',
          'Touch (or clip) the probes to the motor’s two terminals. Nothing connected to the Arduino.',
          'Spin the shaft quickly with your fingers. Watch the number jump!',
          'Spin it the other way. Did the sign flip? The direction of spin sets the direction of the voltage.',
          'That voltage comes from magnets moving past coils: exactly the same physics as kickback.',
        ],
      },
      {
        type: 'sim',
        title: 'Watch a kickback in Falstad',
        why: 'See the spike safely, then see the diode tame it.',
        steps: [
          'Open Falstad’s “Inductive Kickback” example (button below).',
          'Click the switch to open it, and watch the voltage spike on the graph. Ouch!',
          'Now open the menu <b>Circuits → Diodes → Blocking Inductive Kickback</b> (the version with a diode). Flip its switch. Much calmer!',
        ],
        link: { url: window.LabLinks.falstadExample('inductkick.txt'), label: 'Open in Falstad' },
      },
    ],
  },
});
