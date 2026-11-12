/* Module 6: Op-Amps. Lesson content. */
window.LabNotesLessons = window.LabNotesLessons || {};

Object.assign(window.LabNotesLessons, {
  // ------------------------------------------------------------------ 6.1
  'm6-1': {
    minutes: 15,
    intro: 'Behold the <b>op-amp</b>: a tiny triangle with enormous power. It amplifies, filters, compares and even does math. ElectroBOOM calls it the ultimate component, and for once he’s not exaggerating. 🔺',
    summary: 'An operational amplifier (op-amp) is a chip with a non-inverting input (+), an inverting input (−), an output, and two supply pins. Its open-loop gain is huge (often 100 000 or more), so with no feedback it acts as a comparator: the output slams to the high rail if V+ > V−, otherwise to the low rail. With negative feedback (output connected back to the − input), two golden rules apply: (1) the output does whatever it takes to make V− equal V+; (2) the inputs draw almost no current. The voltage follower (buffer) connects the output to V−, so Vout = Vin with gain 1, which isolates a weak source from a load. Common parts: LM358, TL072, MCP6002 (rail-to-rail). Your EMG module already contains op-amps.',
    sections: [
      {
        title: 'Meet the triangle',
        html: `
          <p>An <b>op-amp</b> (operational amplifier) is a chip drawn as a triangle with:</p>
          <ul>
            <li>a <b>+</b> input (non-inverting)</li>
            <li>a <b>−</b> input (inverting)</li>
            <li>one <b>output</b> (the pointy end)</li>
            <li>two power pins (often left out of drawings, but always needed!)</li>
          </ul>
          <p>Inside, it amplifies the <b>difference</b> between its two inputs by a ridiculous amount: often <b>100 000×</b> or more. On its own, that’s too much to be useful as an amplifier… so we tame it with <b>feedback</b>.</p>`,
      },
      {
        type: 'widget',
        widget: 'comparator',
        title: '⚖️ Raw power vs tamed power',
        html: '<p>First play without feedback: tiny differences slam the output to a rail. Then add the feedback wire and watch it become calm and precise.</p>',
      },
      {
        title: 'The two golden rules',
        html: `
          <p>When an op-amp has <b>negative feedback</b> (some of the output connected back to the <b>−</b> input), you can predict everything with two rules:</p>
          <ol>
            <li><b>The output does whatever it takes to make the two inputs equal</b> (V− = V+).</li>
            <li><b>The inputs draw (almost) no current.</b> They just “look” at voltages.</li>
          </ol>
          <p>That’s it. Every op-amp circuit in the next lesson falls out of these two rules, like magic.</p>
          <p>The simplest example is the <b>voltage follower</b> (or <b>buffer</b>): the output wired straight to the − input. Rule 1 says V− = V+, and V− <i>is</i> the output, so <b>output = input</b>. Gain of 1. Pointless? No! Thanks to rule 2, it takes no current from the input but can push current into a load. It’s a bodyguard for weak signals.</p>`,
      },
      {
        title: 'Real op-amps you’ll meet',
        html: `
          <ul>
            <li><b>LM358:</b> cheap, classic, two op-amps per chip, happy on a single 5 V supply.</li>
            <li><b>TL072 / TL084:</b> low-noise audio favourites, usually on ± supplies.</li>
            <li><b>MCP6002:</b> “rail-to-rail”: its output can reach almost all the way to 0 V and 5 V. Great with Arduinos.</li>
          </ul>
          <p>And your EMG muscle module? It’s basically a carefully designed team of op-amps on a little board.</p>`,
      },
      {
        type: 'jargon',
        terms: [
          ['Op-amp', 'An amplifier chip with + and − inputs and huge gain.'],
          ['Non-inverting input (+)', 'Signals here come out the same way up.'],
          ['Inverting input (−)', 'Signals here come out upside-down. Feedback goes here.'],
          ['Negative feedback', 'Connecting the output back to the − input to tame the gain.'],
          ['Comparator', 'Using the op-amp with no feedback: output says which input is bigger.'],
          ['Follower / buffer', 'Output = input, gain 1, but with lots of driving muscle.'],
          ['Rail-to-rail', 'An op-amp whose output can reach (almost) its supply voltages.'],
        ],
      },
      {
        type: 'danger',
        title: '😱 How to make an op-amp lose its mind',
        html: `
          <ol>
            <li>Connect the feedback to the <b>+</b> input instead of the −.</li>
            <li>Now any tiny change gets pushed further the same way: positive feedback!</li>
            <li>The output slams to a rail and stays there, stubbornly, forever.</li>
          </ol>
          <p><b>Why it happens:</b> negative feedback calms things down (like steering back toward the middle of the road). Positive feedback makes things run away (like steering toward the ditch). Feedback always goes to the <b>−</b> input for amplifiers.</p>`,
      },
    ],
    search: 'op amp explained for beginners',
    videos: [
      { title: 'The Ultimate Component: OpAmp (ElectroBOOM101 – 013)', channel: 'ElectroBOOM', url: 'https://www.youtube.com/watch?v=OSCKBmkrH_g', desc: 'Mehdi explains op-amps with his usual mix of real knowledge and sparks.' },
      { title: 'EEVblog #600 - OpAmps Tutorial - What is an Operational Amplifier?', channel: 'EEVblog', url: 'https://www.youtube.com/watch?v=7FYHt5XviKc', desc: 'A whiteboard deep-dive into the golden rules and why they work.' },
      { title: 'Op-Amp Basics Explained in 5 Minutes!', channel: 'Analog Circuit Design', url: 'https://www.youtube.com/watch?v=c-tGooFBnGU', desc: 'A quick, compact recap of the basics.' },
    ],
    quiz: [
      {
        q: 'With <b>no feedback</b>, an op-amp with V+ = 2.01 V and V− = 2.00 V outputs…',
        answer: 2,
        options: [
          { t: '0.01 V', why: 'That ignores the huge gain. 0.01 V × 100 000 = way more than the supply.' },
          { t: '2.005 V', why: 'Without feedback it doesn’t average; it amplifies the difference enormously.' },
          { t: 'The high rail (as high as it can go)' },
        ],
        explain: 'Huge gain × even a tiny positive difference = output slammed to the high rail. That’s a comparator.',
      },
      {
        q: 'Golden rule 1 (with negative feedback) says…',
        answer: 0,
        options: [
          { t: 'The output adjusts until V− equals V+' },
          { t: 'The output always equals 5 V', why: 'The output can be anything between the rails; it’s whatever makes the inputs equal.' },
          { t: 'The inputs carry large currents', why: 'That’s the opposite of rule 2: inputs draw almost no current.' },
        ],
        explain: 'The op-amp “tries” to make its two inputs equal by changing its output.',
      },
      {
        q: 'What’s the gain of a voltage follower?',
        answer: 1,
        options: [
          { t: '0', why: 'Then nothing would come out! A follower copies its input.' },
          { t: '1' },
          { t: '100 000', why: 'That’s the raw open-loop gain. The follower’s feedback tames it to 1.' },
        ],
        explain: 'Output = input. Its job is to provide driving power, not gain.',
      },
      {
        q: 'For a normal amplifier, the feedback goes to which input?',
        answer: 0,
        options: [
          { t: 'The − (inverting) input' },
          { t: 'The + (non-inverting) input', why: 'That’s positive feedback: the output runs away to a rail.' },
          { t: 'Either, it doesn’t matter', why: 'It matters a lot: − calms it down, + makes it run away.' },
        ],
        explain: 'Negative feedback → the − input.',
      },
      {
        q: 'Why does an op-amp need power pins?',
        answer: 2,
        options: [
          { t: 'It doesn’t, the inputs power it', why: 'Rule 2: the inputs draw almost no current, so they can’t power anything.' },
          { t: 'Only for the LED inside', why: 'There’s no LED inside an op-amp.' },
          { t: 'The output current and voltage come from the supply' },
        ],
        explain: 'The op-amp builds its output from its supply. That’s also why the output can’t go past the rails.',
      },
    ],
    challenges: [
      {
        type: 'sim',
        title: 'Comparator vs follower in Falstad',
        why: 'See the golden rules work on a real simulated op-amp.',
        steps: [
          'Open Falstad’s basic op-amp example (button below). Hover over the parts to see their voltages.',
          'Change the input voltages (double-click the sources) and watch the output jump between rails: that’s comparator mode.',
          'Then open <b>Circuits → Op-Amps → Amplifiers → Follower</b>. Change the input: the output copies it exactly.',
        ],
        link: { url: window.LabLinks.falstadExample('opamp.txt'), label: 'Open in Falstad' },
      },
      {
        type: 'build',
        title: 'Chip detective: inside your EMG module',
        why: 'Your muscle sensor is an op-amp playground. Let’s find the players.',
        parts: ['your EMG muscle sensor module', 'your phone camera (zoom!)'],
        steps: [
          'Look at the EMG module’s board closely (use your phone’s camera zoom).',
          'Find the small black chips. Write down the text printed on each one.',
          'Search each part number plus “datasheet”. Is it an op-amp? An instrumentation amplifier (like AD8221 or INA-something)?',
          'Find the little adjustable screw (the <b>gain trimmer</b>). That sets how much the output is amplified.',
          'Find the pins labeled <b>+Vs</b>, <b>−Vs</b>, <b>GND</b> and <b>SIG</b>. You’ll use them in Module 7.',
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ 6.2
  'm6-2': {
    minutes: 18,
    intro: 'Two resistors + one op-amp = an amplifier with EXACTLY the gain you want. No guessing, no transistor maths. Let’s build the two classics. 🛠️',
    summary: 'Non-inverting amplifier: input to +, feedback resistor Rf from output to −, R1 from − to ground (or virtual ground). Gain = 1 + Rf ÷ R1 (e.g. 1 + 99 kΩ ÷ 1 kΩ = 100); output is the same way up. Inverting amplifier: + to ground (or virtual ground), input through Rin to −, Rf from output to −. Gain = −Rf ÷ Rin (e.g. −10 kΩ ÷ 1 kΩ = −10); the minus sign means the output is upside-down. Both follow from the golden rules. On a single 5 V supply, use a virtual ground at 2.5 V (a voltage divider, ideally buffered) so signals can swing both ways. Output is still limited by the rails.',
    sections: [
      {
        title: 'Classic #1: the non-inverting amplifier',
        html: `
          <ul>
            <li>The signal goes into the <b>+</b> input.</li>
            <li>A feedback resistor <b>Rf</b> connects the output to the <b>−</b> input.</li>
            <li>A resistor <b>R1</b> connects the − input to ground.</li>
          </ul>
          <p class="funfact" style="text-align:center"><b>Gain = 1 + Rf ÷ R1</b></p>
          <p><b>Why?</b> Rf and R1 form a voltage divider from the output. Golden rule 1 forces the middle of that divider (V−) to equal the input. So the output has to be bigger than the input by exactly the divider ratio. Example: Rf = 99 kΩ, R1 = 1 kΩ → gain = 1 + 99 = <b>100</b>.</p>`,
      },
      {
        title: 'Classic #2: the inverting amplifier',
        html: `
          <ul>
            <li>The <b>+</b> input goes to ground.</li>
            <li>The signal goes through <b>Rin</b> into the <b>−</b> input.</li>
            <li><b>Rf</b> connects the output back to the − input.</li>
          </ul>
          <p class="funfact" style="text-align:center"><b>Gain = −Rf ÷ Rin</b></p>
          <p>The <b>minus</b> means the output is <b>upside-down</b>: input goes up, output goes down. Rf = 10 kΩ, Rin = 1 kΩ → gain = <b>−10</b>. For a muscle signal, upside-down doesn’t matter, because we’ll rectify it (flip the negative half up) anyway.</p>`,
      },
      {
        type: 'widget',
        widget: 'amp',
        mode: 'opamp',
        title: '🎛️ Op-amp amplifier designer',
        html: '<p>Pick a type, choose resistors, and see the gain and the output. Try making a gain of exactly 101, or −47.</p>',
      },
      {
        title: 'Living on a single 5 V supply: virtual ground',
        html: `
          <p>Textbook op-amp circuits often use <b>± supplies</b> (like +9 V and −9 V, which is exactly what your two 9V batteries do for the EMG module!). With an Arduino we only have 0 and 5 V.</p>
          <p>The trick: make a <b>virtual ground</b> at <b>2.5 V</b> with a voltage divider (two equal resistors), ideally buffered by a follower. Connect “ground” in the amplifier to that 2.5 V instead. Now the signal swings around 2.5 V, safely between the rails.</p>`,
      },
      {
        type: 'jargon',
        terms: [
          ['Rf (feedback resistor)', 'Connects the output back to the − input. Sets the gain together with R1/Rin.'],
          ['Non-inverting amplifier', 'Gain = 1 + Rf ÷ R1. Output same way up.'],
          ['Inverting amplifier', 'Gain = −Rf ÷ Rin. Output upside-down.'],
          ['± supply', 'Positive and negative supply voltages, with ground in the middle.'],
          ['Virtual ground', 'A fake “middle” (like 2.5 V) used as ground on a single supply.'],
        ],
      },
      {
        type: 'danger',
        title: '🤯 How to build an amplifier that does nothing',
        html: `
          <ol>
            <li>Build a beautiful inverting amplifier with gain −100…</li>
            <li>…on a single 0–5 V supply, with + tied to real ground (0 V).</li>
            <li>Feed it a signal that swings around 0 V. The output wants to go negative for half the wave and positive for the other half × 100.</li>
            <li>It can’t go below 0 V, so half the signal vanishes and the rest clips. 🙃</li>
          </ol>
          <p><b>Why it happens:</b> the output can only live between the rails. On a single supply, everything has to be lifted to a 2.5 V virtual ground.</p>`,
      },
    ],
    search: 'inverting and non inverting op amp amplifier explained',
    videos: [
      { title: 'Operational Amplifiers - Inverting & Non Inverting Op-Amps', channel: 'The Organic Chemistry Tutor', url: 'https://www.youtube.com/watch?v=idJEMYhrIfs', desc: 'Both amplifier types with worked gain calculations.' },
      { title: 'Inverting and Non-inverting Amplifiers - Op-amps | Basic Circuits #13', channel: 'CircuitBread', url: 'https://www.youtube.com/watch?v=EOZyofNXWXc', desc: 'Why the gain formulas come out of the golden rules.' },
      { title: 'Op Amp Tutorial (Theory and Practice) - Electronics Basic #4', channel: 'miliohm', url: 'https://www.youtube.com/watch?v=t3CLoyI3Gc8', desc: 'Theory plus real breadboard measurements of op-amp amplifiers.' },
    ],
    quiz: [
      {
        q: 'Non-inverting amp with Rf = 99 kΩ and R1 = 1 kΩ. Gain?',
        answer: 1,
        options: [
          { t: '99', why: 'Close! The non-inverting formula adds 1: 1 + 99 ÷ 1.' },
          { t: '100' },
          { t: '−99', why: 'The minus belongs to the inverting amplifier.' },
        ],
        explain: 'Gain = 1 + Rf ÷ R1 = 1 + 99 = 100.',
      },
      {
        q: 'Inverting amp with Rf = 10 kΩ and Rin = 1 kΩ. Gain?',
        answer: 2,
        options: [
          { t: '11', why: 'That’s the non-inverting formula. Inverting is −Rf ÷ Rin.' },
          { t: '10', why: 'Right size, but the inverting amplifier flips the signal: −10.' },
          { t: '−10' },
        ],
        explain: 'Gain = −Rf ÷ Rin = −10. Ten times bigger, upside-down.',
      },
      {
        q: 'What does the minus sign in an inverting amplifier’s gain mean?',
        answer: 0,
        options: [
          { t: 'The output is upside-down compared to the input' },
          { t: 'The output is smaller', why: 'Size comes from the number (10). The sign means flipped.' },
          { t: 'The amplifier is broken', why: 'Totally normal! It’s just flipped.' },
        ],
        explain: 'Input goes up → output goes down.',
      },
      {
        q: 'Why use a 2.5 V virtual ground on a 5 V Arduino setup?',
        answer: 1,
        options: [
          { t: 'To save battery', why: 'It’s about room for the signal to swing, not power.' },
          { t: 'So signals can swing both up and down without hitting 0 V' },
          { t: 'Because op-amps can’t touch 0 V ever', why: 'Some can get close (rail-to-rail). The point is room to swing both ways.' },
        ],
        explain: 'A wave centered at 2.5 V can go ±2.5 V within the rails.',
      },
      {
        q: 'You want a non-inverting gain of 11 and R1 is 1 kΩ. What Rf?',
        answer: 2,
        options: [
          { t: '11 kΩ', why: '1 + 11 = 12. You need Rf ÷ R1 = 10.' },
          { t: '1 kΩ', why: 'That gives 1 + 1 = 2.' },
          { t: '10 kΩ' },
        ],
        explain: '1 + 10 kΩ ÷ 1 kΩ = 11.',
      },
    ],
    challenges: [
      {
        type: 'sim',
        title: 'Design and test in Falstad',
        why: 'Predict a gain, set it with resistors, and check it on the simulated scope.',
        steps: [
          'Open Falstad’s inverting amplifier (button below). Hover over the resistors to read their values.',
          'Calculate the gain with −Rf ÷ Rin. Compare the input and output on the graphs. Upside-down and bigger?',
          'Double-click the feedback resistor and double it. Predict the new gain, then check.',
          'Now open <b>Circuits → Op-Amps → Amplifiers → Noninverting Amplifier</b> and do the same with 1 + Rf ÷ R1.',
        ],
        link: { url: window.LabLinks.falstadExample('amp-invert.txt'), label: 'Open in Falstad' },
      },
    ],
  },

  // ------------------------------------------------------------------ 6.3
  'm6-3': {
    minutes: 18,
    intro: 'Final training arc before the boss! 🥋 Today: <b>active filters</b> and the <b>instrumentation amplifier</b>, the special op-amp team that pulls a tiny muscle whisper out of a noisy world.',
    summary: 'Active filters combine op-amps with resistors and capacitors to filter and amplify at the same time; the RC cutoff is still about 1 ÷ (2πRC). An instrumentation amplifier (in-amp) is a precise differential amplifier (often three op-amps in one chip, like AD620, INA128 or AD8221) whose gain is set by one resistor. It amplifies the difference between two electrodes and rejects common-mode noise (like mains hum that appears equally on both); how well is the CMRR. The third EMG electrode is the reference, tying your body to the circuit’s middle voltage. A typical EMG chain: electrodes → in-amp → high-pass about 20 Hz (removes motion drift) → low-pass about 450 Hz → more gain → rectify (flip negatives up) → smooth into an envelope → Arduino. Your 3-lead module does all of this and outputs the envelope on SIG.',
    sections: [
      {
        title: 'Active filters: filter + amplify in one go',
        html: `
          <p>Remember the RC low-pass from the noise lesson? Add an op-amp and you get an <b>active filter</b>: it filters <i>and</i> amplifies, and the op-amp stops the next stage from messing up the filter.</p>
          <p>The cutoff is still set by R and C: <b>f<sub>c</sub> ≈ 1 ÷ (2πRC)</b>. Stack a high-pass and a low-pass and you get a <b>band-pass</b> that keeps only the frequencies in between.</p>`,
      },
      {
        type: 'widget',
        widget: 'filter',
        title: '🎚️ Filter lab',
        html: '<p>Pick R and C to set the cutoff, then sweep the test frequency. Finally, tap “EMG band” to see the range muscle circuits keep.</p>',
      },
      {
        title: 'The instrumentation amplifier: the noise ninja',
        html: `
          <p>Here’s the EMG problem: two electrodes on your arm pick up a <b>tiny</b> muscle signal, plus <b>huge</b> mains hum. But the hum hits <b>both</b> electrodes almost equally, while the muscle signal is <b>different</b> at each electrode.</p>
          <p>An <b>instrumentation amplifier</b> (in-amp) amplifies only the <b>difference</b> between its two inputs. Things that are the same on both (called <b>common-mode</b> noise, like hum) mostly cancel out. How well it cancels is its <b>CMRR</b> (common-mode rejection ratio): higher is better.</p>
          <p>Inside an in-amp there are usually three op-amps working together, and the gain is set by a single resistor. Famous ones: <b>AD620</b>, <b>INA128</b>, <b>AD8221</b>.</p>
          <p>And the third electrode? That’s the <b>reference</b>. It goes on a bony spot (like your elbow) and connects your body to the circuit’s middle voltage, keeping both signal electrodes inside the amplifier’s happy range.</p>`,
      },
      {
        title: 'The full EMG signal chain',
        html: `
          <ol>
            <li><b>Electrodes</b> pick up the muscle’s electrical activity (millivolts) plus noise.</li>
            <li><b>Instrumentation amplifier:</b> amplifies the difference, cancels common hum.</li>
            <li><b>High-pass ~20 Hz:</b> removes slow drift from moving cables and skin.</li>
            <li><b>Low-pass ~450 Hz:</b> removes fast hiss above the muscle range.</li>
            <li><b>More gain</b> (the trimmer screw on your module!).</li>
            <li><b>Rectify:</b> flip the negative half of the wave upward (like a diode rectifier, but precise).</li>
            <li><b>Smooth:</b> low-pass the rectified signal into an <b>envelope</b>: a calm line that goes up when you flex and down when you relax.</li>
            <li><b>Arduino</b> reads the envelope on an analog pin.</li>
          </ol>
          <p>Your 3-lead muscle module does steps 2–7 for you and puts the envelope on its <b>SIG</b> pin. Now you know exactly what’s happening inside. 😎</p>`,
      },
      {
        type: 'jargon',
        terms: [
          ['Active filter', 'A filter that uses an op-amp, so it can also amplify.'],
          ['Band-pass', 'Keeps a range of frequencies (EMG: about 20–450 Hz).'],
          ['Instrumentation amplifier', 'A precise differential amplifier with high common-mode rejection.'],
          ['Common-mode noise', 'Noise that appears equally on both inputs (like mains hum).'],
          ['CMRR', 'How well an amplifier rejects common-mode noise. Higher = better.'],
          ['Reference electrode', 'The third pad, on a bony area, connecting you to the circuit’s middle voltage.'],
          ['Envelope', 'A smooth line that follows the strength of a wiggly signal.'],
        ],
      },
      {
        type: 'danger',
        title: '🌀 How to measure your cable instead of your muscle',
        html: `
          <ol>
            <li>Let the electrode cables dangle and swing as you move.</li>
            <li>Every swing creates slow, big wobbles (motion artifacts).</li>
            <li>Your “muscle signal” now mostly measures how much your cable is dancing.</li>
          </ol>
          <p><b>Why it happens:</b> moving cables and shifting electrodes create slow voltage changes. The ~20 Hz high-pass helps, but the real fix is mechanical: tape the cable down to your arm and keep still while testing.</p>`,
      },
    ],
    search: 'instrumentation amplifier explained',
    videos: [
      { title: 'Instrumentation Amplifier Explained (with Derivation)', channel: 'ALL ABOUT ELECTRONICS', url: 'https://www.youtube.com/watch?v=pSctPegtZfc', desc: 'How the three-op-amp in-amp works and how its gain is set.' },
      { title: 'Every Type of Op-Amp Explained', channel: 'Simply Decoded', url: 'https://www.youtube.com/watch?v=vviLhlUK3sw', desc: 'A tour of op-amp circuits, including filters and differential amplifiers.' },
      { title: 'Instrumentation Amplifiers', channel: 'NTS', url: 'https://www.youtube.com/watch?v=E746YZrM97U', desc: 'Another angle on in-amps and why they reject common-mode noise.' },
    ],
    quiz: [
      {
        q: 'What does an instrumentation amplifier amplify?',
        answer: 1,
        options: [
          { t: 'Everything at its inputs equally', why: 'That’s the point: it amplifies the DIFFERENCE and rejects what’s common.' },
          { t: 'The difference between its two inputs' },
          { t: 'Only the reference electrode', why: 'The reference sets the middle level; the signal is the difference between the other two.' },
        ],
        explain: 'Differential gain: it amplifies V1 − V2.',
      },
      {
        q: 'Why does mains hum mostly cancel in an EMG in-amp?',
        answer: 0,
        options: [
          { t: 'It appears almost equally on both electrodes (common-mode)' },
          { t: 'Hum is too fast to amplify', why: '50/60 Hz is right inside the range amplifiers handle easily.' },
          { t: 'The batteries block it', why: 'Batteries help avoid mains connection, but the cancelling comes from differential amplification.' },
        ],
        explain: 'Same on both inputs → the difference is ~zero → cancelled.',
      },
      {
        q: 'Which band of frequencies do EMG circuits usually keep?',
        answer: 2,
        options: [
          { t: '0–5 Hz', why: 'That’s mostly motion drift, which EMG circuits remove.' },
          { t: '5–20 kHz', why: 'Muscles don’t produce much up there.' },
          { t: 'About 20–450 Hz' },
        ],
        explain: 'High-pass ~20 Hz, low-pass ~450 Hz.',
      },
      {
        q: 'What’s the <b>envelope</b> of an EMG signal?',
        answer: 0,
        options: [
          { t: 'A smooth line following how strongly the muscle is working' },
          { t: 'The paper the sensor came in', why: '😄 In signals, an envelope is the outline of a wiggly signal.' },
          { t: 'The raw, unfiltered signal', why: 'Raw EMG wiggles fast around zero. The envelope is rectified and smoothed.' },
        ],
        explain: 'Rectify + smooth = envelope: up when you flex, down when you relax.',
      },
      {
        q: 'Where does the reference electrode usually go?',
        answer: 1,
        options: [
          { t: 'Right in the middle of the muscle', why: 'That’s where the signal electrodes go. The reference wants a quiet spot.' },
          { t: 'On a bony area away from the muscle, like the elbow' },
          { t: 'Across the chest', why: 'Never across the chest! Keep all electrodes on one arm.' },
        ],
        explain: 'A bony, electrically quiet spot nearby, like the elbow or wrist bone.',
      },
    ],
    challenges: [
      {
        type: 'sim',
        title: 'Differential amplifier in Falstad',
        why: 'See common-mode signals cancel while differences get amplified.',
        steps: [
          'Open Falstad’s differential amplifier (button below).',
          'Hover over the parts to read the input and output voltages.',
          'Double-click the input sources and change both by the same amount: the output barely moves (common-mode rejected!).',
          'Change just one: now the output changes. Only differences count.',
        ],
        link: { url: window.LabLinks.falstadExample('amp-diff.txt'), label: 'Open in Falstad' },
      },
      {
        type: 'sim',
        title: 'Active low-pass filter in Falstad',
        why: 'An op-amp filter in action.',
        steps: [
          'Open Falstad and choose <b>Circuits → Active Filters → VCVS Low-Pass Filter</b>.',
          'Watch the input and output graphs. Change the source frequency (double-click it): low frequencies pass, high ones fade.',
          'Compare with the passive RC filter from the noise lesson. Notice the sharper drop?',
        ],
        link: { url: window.LabLinks.falstadExample('filt-vcvs-lopass.txt'), label: 'Open in Falstad' },
      },
    ],
  },
});
