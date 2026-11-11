/* Module 0: Safety & Tools. Lesson content.
   Each lesson: intro (what Dr. Ohmi says), sections, videos, quiz, challenges, summary (used by "Ask Claude"). */
window.LabNotesLessons = window.LabNotesLessons || {};

Object.assign(window.LabNotesLessons, {
  'm0-2': {
    minutes: 15,
    intro: 'Behold: the <b>BREADBOARD!</b> No bread. No board games. Just the most important tool in this lab. Let’s find out what’s hiding under all those holes. 🔍',
    summary: 'Breadboards connect parts without soldering. In each numbered column, holes a–e share one metal clip and holes f–j share another; the middle gap separates them (chips straddle it). The + and − power rails along the edges run the whole length (some boards split them in the middle). Two legs of the same part in the same strip are shorted. LEDs always need a resistor.',

    sections: [
      {
        title: 'What even is a breadboard?',
        html: `
          <p>A <b>breadboard</b> is a plastic board full of holes that lets you build circuits by just <b>pushing parts and wires in</b>. No soldering, no glue. Made a mistake? Pull the part out and try again. That makes it perfect for experiments (and for mistakes, which are just experiments with attitude).</p>
          <p class="funfact">📜 <b>Fun fact:</b> about 100 years ago, radio hobbyists really did build circuits by hammering nails into a wooden board for slicing bread. The name stuck. The bread didn’t.</p>`,
      },
      {
        title: 'The secret under the holes',
        html: `
          <p>Under the plastic, the holes are linked by hidden <b>metal clips</b>. Each clip grabs a short line of <b>5 holes</b>. Push two wires into holes on the same clip and they’re <b>connected</b>: electricity can flow between them exactly as if you’d twisted the wires together.</p>
          <p>That’s the whole trick. Every breadboard circuit comes down to one question: <i>“which parts share a clip?”</i></p>`,
      },
      {
        type: 'jargon',
        terms: [
          ['Connected', 'Electricity can flow freely between two points, as if they were touching.'],
          ['Strip', 'A group of holes joined by one metal clip underneath.'],
          ['Power rail', 'The long rows along the edges, used to share + (power) and − (ground) with the whole board.'],
          ['Ground (GND)', 'The 0-volt “home base” of a circuit. Current flows out of + and comes back to ground.'],
          ['Short circuit', 'An accidental shortcut that lets current skip the part it was supposed to go through.'],
        ],
      },
      {
        type: 'breadboard',
        title: 'Try it: X-ray vision',
        html: '<p>Tap any hole to see which other holes it’s secretly connected to. Try one in row <b>a</b>, then one in row <b>f</b>, then one on a rail.</p>',
        cols: 20,
        interactive: true,
        label: 'Interactive breadboard. Tap a hole to highlight the holes connected to it.',
      },
      {
        title: 'The 3 breadboard rules',
        html: `
          <ol>
            <li><b>Columns of 5 are connected.</b> In each numbered column, holes <b>a–e</b> share one clip, and holes <b>f–j</b> share another.</li>
            <li><b>The middle gap breaks the connection.</b> e7 and f7 are <i>not</i> connected. The gap is exactly the right width for chips, so each chip leg lands in its own strip.</li>
            <li><b>The rails run the long way.</b> The + and − rows along the edges are connected all the way along. Connect power to them once, then grab it from anywhere.</li>
          </ol>
          <p>⚠️ Two gotchas: some long breadboards have rails <b>split in the middle</b> (look for a break in the red or blue line), and the order of + and − is different on different brands. Follow the colors printed on <i>your</i> board, not my drawings.</p>`,
      },
      {
        type: 'danger',
        title: '☠️ How to blow up an LED (please don’t)',
        html: `
          <ol>
            <li>Push an LED straight into + and − with <b>no resistor</b>.</li>
            <li>Admire a brief, very bright flash.</li>
            <li>Smell. ✨ Magic smoke ✨</li>
            <li>Sadness.</li>
          </ol>
          <p><b>Why it happens:</b> an LED barely limits current by itself. With nothing else in the way, far too much current rushes through and cooks it (and it can stress your Arduino too). A <b>resistor</b> is the LED’s bodyguard: it limits the current to a safe amount. You’ll learn exactly how to choose one with Ohm’s law in Module 1.</p>`,
      },
      {
        type: 'tip',
        html: '<p>Build and change circuits with the power <b>unplugged</b>. Plug in last, unplug first. Your parts (and your nerves) will thank you.</p>',
      },
    ],

    search: 'how to use a breadboard for beginners',
    videos: [
      {
        title: 'How to Use a Breadboard',
        channel: 'Science Buddies',
        url: 'https://www.youtube.com/watch?v=MtiJz7gh1VU',
        desc: 'How the rows, columns and power rails connect, a simple LED circuit, and the most common beginner mistakes.',
      },
      {
        title: 'Collin’s Lab: Breadboards & Perfboards',
        channel: 'Adafruit Industries',
        url: 'https://www.youtube.com/watch?v=w0c3t0fJhXU',
        desc: 'Takes a circuit from a drawing to a working breadboard build, then makes it permanent on perfboard.',
      },
      {
        title: 'Mind the Breadboard Gap',
        channel: 'Adafruit Industries (Collin’s Lab Notes)',
        url: 'https://www.youtube.com/watch?v=QerwqYASMLg',
        desc: 'A quick one on split power rails, the sneaky gotcha that trips up lots of beginners.',
      },
    ],

    quiz: [
      {
        q: 'You push one wire into hole <b>a7</b> and another into <b>d7</b>. Are the two wires connected?',
        answer: 0,
        options: [
          { t: 'Yes: holes a7 to e7 share one metal clip' },
          { t: 'No: they’re in different rows', why: 'The letters a–e are just names for positions. In each numbered column, holes a–e all grab the same metal clip, so they’re connected.' },
          { t: 'Only when the Arduino is switched on', why: 'The clip is plain metal. It connects things whether or not the power is on, just like a piece of wire does.' },
        ],
        explain: 'In every numbered column, holes a–e are joined by one hidden metal clip (and f–j by another).',
      },
      {
        q: 'What about <b>e7</b> and <b>f7</b>? Are they connected?',
        answer: 1,
        options: [
          { t: 'Yes: they’re right next to each other', why: 'Being neighbours doesn’t matter. What matters is the clip underneath, and the middle gap separates the two clips.' },
          { t: 'No: the middle gap separates them' },
          { t: 'Yes: every hole in column 7 is connected', why: 'Close! But each column is split in two by the gap: a–e is one strip and f–j is a separate one.' },
        ],
        explain: 'The gap down the middle splits each column into two separate strips: a–e on one side, f–j on the other.',
      },
      {
        q: 'Why do chips (the little black rectangles with two rows of legs) sit across the middle gap?',
        answer: 0,
        options: [
          { t: 'So each leg gets its own strip and the legs don’t connect to each other' },
          { t: 'To keep the chip cool', why: 'The gap isn’t for cooling. It’s all about which holes are connected.' },
          { t: 'It’s just tradition', why: 'There’s a real reason! If a chip sat on one side, the legs facing each other would land in the same strips and be connected together.' },
        ],
        explain: 'Straddling the gap puts every leg in a different strip, so you can wire each leg separately.',
      },
      {
        q: 'What are the long rows marked <b>+</b> and <b>−</b> along the edges for?',
        answer: 1,
        options: [
          { t: 'Decoration, so the board looks cool', why: 'They’re very useful! Each rail row is connected all the way along the board.' },
          { t: 'Sharing power and ground along the whole board' },
          { t: 'Batteries only, never the Arduino', why: 'Any power source can connect to the rails: a battery, or the Arduino’s 5V and GND pins.' },
        ],
        explain: 'These are the power rails. Connect power to + and ground to − once, and any part can reach them from anywhere along the board.',
      },
      {
        q: 'You put an LED with one leg in <b>b12</b> and the other in <b>d12</b>. What happens when you power the circuit?',
        answer: 1,
        options: [
          { t: 'It glows extra bright', why: 'It can’t glow at all: both legs are joined by the same clip, so current takes the shortcut through the metal instead of going through the LED.' },
          { t: 'Nothing: both legs are in the same strip, so the LED is shorted out' },
          { t: 'It explodes', why: 'Dramatic, but no! The current just flows through the metal clip and skips the LED. (Exploding LEDs need a missing resistor.)' },
        ],
        explain: 'b12 and d12 share a clip, so the LED’s two legs are connected together and current skips it completely. That’s a short circuit. Always put a part’s legs in different strips.',
      },
    ],

    challenges: [
      {
        type: 'build',
        title: 'Light your first LED (the Arduino is your battery)',
        why: 'This puts the 3 breadboard rules to work for real. No code needed: when the Arduino is plugged in by USB, its <b>5V</b> pin is always on, so it can act like a battery.',
        parts: ['Arduino Uno + USB cable', 'breadboard', '1 LED (any color)', '1 resistor: 220 Ω, 330 Ω or 1 kΩ', '3 jumper wires'],
        diagram: {
          cols: 12,
          label: 'Breadboard diagram of the LED circuit',
          caption: 'Red wire = from the Arduino’s 5V pin. Black wires = ground (GND). The LED’s long leg (+) goes in e5.',
          parts: [
            { type: 'lead', hole: 'tn1', color: '#222', label: 'GND' },
            { type: 'lead', hole: 'tp1', color: '#e3342f', label: '5V' },
            { type: 'resistor', from: 'tp5', to: 'a5' },
            { type: 'led', anode: 'e5', cathode: 'e6', color: '#ff2d2d', lit: true },
            { type: 'wire', from: 'a6', to: 'tn8', color: '#222', arc: 22 },
          ],
        },
        steps: [
          '<b>Unplug</b> the Arduino’s USB cable. (Power off while building!)',
          '<b>Red jumper:</b> from the Arduino’s <b>5V</b> pin to the <b class="txt-pos">+ rail</b>.',
          '<b>Black jumper:</b> from one of the Arduino’s <b>GND</b> pins to the <b class="txt-neg">− rail</b>.',
          '<b>Resistor:</b> one leg in the + rail, the other leg in hole <b>a5</b>. (Resistors work either way round.)',
          '<b>LED:</b> the <b>long leg</b> (+, called the <i>anode</i>) in <b>e5</b>, the <b>short leg</b> (−, the <i>cathode</i>) in <b>e6</b>.',
          '<b>Black jumper:</b> from hole <b>a6</b> to the − rail.',
          'Plug the USB cable back in. Your LED should light up! 🎉',
          '<b>Bonus:</b> unplug, move the LED’s short leg from e6 to <b>f6</b>, then plug back in. Dark? That’s the middle gap breaking the connection.',
        ],
        troubleshoot: [
          '<b>LED backwards?</b> Flip it. The long leg goes on the resistor side.',
          '<b>Both LED legs in the same column?</b> Then it’s shorted. The legs must be in different columns.',
          '<b>Rails mixed up?</b> Red goes to +, black goes to −. Follow the colors printed on your board.',
          '<b>Rail split in the middle?</b> Keep everything on the left half, or bridge the break with a jumper.',
          '<b>Still dark?</b> Try another LED. They do die sometimes.',
        ],
      },
      {
        type: 'sim',
        title: 'Breadboard in your browser (Tinkercad)',
        why: 'Simulators let you experiment with zero risk. Breaking things on purpose is encouraged!',
        steps: [
          'Open <b>Tinkercad Circuits</b> (button below) and sign in or make a free account.',
          'Click <b>Create → Circuit</b>.',
          'From the parts list on the right, drag in a <b>Breadboard Small</b>, a <b>9V Battery</b>, an <b>LED</b> and a <b>Resistor</b>.',
          'Click the resistor and check it’s set to <b>1 kΩ</b>. (A 9V battery needs a bigger resistor than 5V does. Module 1 explains why.)',
          'Make wires by clicking a hole, then clicking where the wire should end. Copy the real-life layout: battery + to the + rail, battery − to the − rail, resistor from the + rail to a5, LED long leg (anode) in e5 and short leg in e6, and a wire from a6 to the − rail.',
          'Click <b>Start Simulation</b>. The LED lights up!',
          'Now break it on purpose: stop the simulation, move the wire from a6 to <b>f6</b>, and start again. Dark? You just proved the middle gap is real. 🕵️',
        ],
        link: { url: 'https://www.tinkercad.com/circuits', label: 'Open Tinkercad Circuits' },
      },
    ],
  },
});
