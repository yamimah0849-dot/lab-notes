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

Object.assign(window.LabNotesLessons, {
  // ------------------------------------------------------------------ 0.1
  'm0-1': {
    minutes: 12,
    intro: 'Rule zero of the secret lab: <b>we keep all our fingers, eyebrows and eyeballs.</b> Let’s learn how electricity can actually hurt you, and why your kit is (mostly) very friendly. 🥽',
    summary: 'What hurts you in a shock is current through the body; voltage is the push that decides how much current can flow. Dry skin has high resistance, so 5 V and 9 V are safe to touch, but mains (wall sockets, 110–240 V AC) is dangerous and off-limits. Shorting a 9V battery makes it and the wire hot. The soldering iron (about 350 °C) is the biggest hazard in the kit; solder may contain lead (wash hands) and flux fumes need ventilation. Wear safety glasses when clipping leads or soldering. For the EMG sensor: battery power only and the laptop unplugged from the wall charger.',
    sections: [
      {
        title: 'It’s the current that hurts',
        html: `
          <p>When people get shocked, the thing that actually hurts them is <b>current</b>: electricity flowing <i>through their body</i>. <b>Voltage</b> is the push that decides how much current can flow.</p>
          <p>Your skin is a pretty good <b>resistor</b> when it’s dry. A small push like <b>5 V</b> (Arduino) or <b>9 V</b> (battery) simply can’t force a dangerous current through it. That’s why you can touch the Arduino’s pins without feeling a thing.</p>
          <p><b>Wall sockets</b> are a completely different beast: 110–240 V can push enough current through you to stop your heart. So here’s Dr. Ohmi’s one unbreakable law:</p>
          <p class="funfact">⛔ <b>In this course we never open, touch or measure anything plugged into the wall.</b> No chargers, no power supplies, no “let’s see what’s inside”. Ever.</p>`,
      },
      {
        type: 'jargon',
        terms: [
          ['Current', 'How much electricity flows (measured in amps, A). The part that hurts.'],
          ['Voltage', 'The push that makes current flow (measured in volts, V).'],
          ['Mains', 'The electricity in wall sockets: 110–240 V. Dangerous. Not for this course.'],
          ['DC', 'Direct current: flows one way. Batteries, USB and the Arduino are DC.'],
          ['AC', 'Alternating current: flips back and forth many times a second. Wall sockets are AC.'],
          ['Short circuit', 'An accidental shortcut with almost no resistance. Huge current, lots of heat.'],
        ],
      },
      {
        title: 'Your kit’s danger meter',
        html: `
          <ul>
            <li>✅ <b>Arduino on USB (5 V):</b> safe to touch. The worst you can do is damage the Arduino.</li>
            <li>⚠️ <b>9V battery:</b> safe to touch, but <b>never short it</b> (wire straight from + to −). The wire and battery get hot fast.</li>
            <li>🔥 <b>Soldering iron (about 350 °C):</b> the most dangerous thing in your kit. It burns instantly.</li>
            <li>🧪 <b>Solder:</b> may contain lead. Wash your hands afterwards and don’t eat while soldering.</li>
            <li>💨 <b>Soldering smoke:</b> that’s flux (cleaning goo inside the solder) burning. Don’t breathe it in; open a window or use a fan.</li>
            <li>👓 <b>Clipping wire legs:</b> the cut ends fly off at eyeball speed. Glasses on, hold the end.</li>
            <li>🌀 <b>Motors:</b> can pinch fingers and grab hair.</li>
            <li>💪 <b>EMG muscle sensor:</b> safe on batteries, with special rules (below).</li>
          </ul>`,
      },
      {
        type: 'widget',
        widget: 'sort',
        title: '🕵️ Mini-game: Safe or Sus?',
        html: '<p>For each situation, decide: is it safe, or is it sus? Wrong answers explain themselves.</p>',
        items: [
          { text: 'Touching the Arduino’s 5V and GND pins with dry fingers.', safe: true, why: '5 volts can’t push a meaningful current through dry skin. You won’t feel anything.' },
          { text: 'Connecting a wire straight from + to − on a 9V battery “to see what happens”.', safe: false, why: 'That’s a short circuit: a huge current makes the wire and battery hot enough to burn you.' },
          { text: 'Opening a phone charger while it’s plugged in to look at the parts.', safe: false, why: 'Chargers have mains voltage inside. That can kill. We never open anything that plugs into the wall.' },
          { text: 'Wearing safety glasses while clipping LED legs.', safe: true, why: 'Clipped legs fly off fast. Glasses are cheap; eyes aren’t.' },
          { text: 'Resting the hot soldering iron on the table for a second.', safe: false, why: 'It rolls, it burns the table, it burns you. The iron lives in its stand, always.' },
          { text: 'Using the EMG sensor while the laptop is plugged into the wall charger.', safe: false, why: 'If something failed, the charger could connect your body to mains. Run the laptop on battery for EMG experiments.' },
          { text: 'Keeping a spare 9V battery in a pocket with coins and keys.', safe: false, why: 'Both terminals are on top, close together. A coin can short them: the battery heats up and can even start a fire. Keep the cap on or tape the terminals.' },
          { text: 'Unplugging the USB cable before changing your circuit.', safe: true, why: 'Perfect habit. Building with the power off prevents accidental shorts.' },
        ],
      },
      {
        type: 'danger',
        title: '☠️ How to turn a 9V battery into a hand warmer (please don’t)',
        html: `
          <ol>
            <li>Find a paperclip.</li>
            <li>Touch it across both 9V terminals at once.</li>
            <li>Hold on. Notice it getting hot. Very hot. Ouch.</li>
            <li>Drop everything and question your choices.</li>
          </ol>
          <p><b>Why it happens:</b> the paperclip has almost no resistance, so the battery dumps as much current as it possibly can. All that energy turns into heat in the clip and inside the battery. Shorts are why we unplug before wiring.</p>`,
      },
      {
        type: 'tip',
        title: '💪 Extra rules for the final boss (EMG)',
        html: `
          <ul>
            <li>Power the EMG module from <b>batteries only</b>.</li>
            <li>Keep the laptop <b>unplugged from the wall</b> while the pads are on your skin (run it on battery).</li>
            <li>Electrodes go on <b>one arm</b> only. Never across your chest or heart.</li>
            <li>Stop if your skin gets red or itchy. Clean skin, fresh pads.</li>
          </ul>`,
      },
      {
        type: 'tip',
        title: '💡 Lab habits',
        html: '<p>Clear table, good light, glasses on, iron in its stand, drinks far away, power off while wiring. And if you burn yourself: cool running water for 20 minutes, no ice, no butter.</p>',
      },
    ],
    search: 'electrical safety current through the body explained',
    videos: [
      { title: 'Current Vs Voltage: How Much Current Can Kill You?', channel: 'Science ABC', url: 'https://www.youtube.com/watch?v=y_cWTWB-N_I', desc: 'A friendly animated explanation of why current, not voltage, does the damage.' },
      { title: 'Do Volts or Amps Kill You? Voltage, Current and Resistance', channel: 'RimstarOrg', url: 'https://www.youtube.com/watch?v=9iKD7vuq-rY', desc: 'Connects shocks to voltage, current and your body’s resistance, with demos.' },
      { title: 'Resistance of the Human Body / Electrical Safety', channel: 'Aaron Danner', url: 'https://www.youtube.com/watch?v=m-IC2tPaNqA', desc: 'Part of a “Circuits for Beginners” series: how much resistance your body has and what that means for safety.' },
    ],
    quiz: [
      {
        q: 'During an electric shock, what actually hurts you?',
        answer: 1,
        options: [
          { t: 'The voltage number printed on the label', why: 'Voltage matters because it decides how much current can flow, but the damage is done by the current itself.' },
          { t: 'Current flowing through your body' },
          { t: 'Static from your socks', why: 'Static zaps sting for a moment, but they carry very little energy. Not the real danger.' },
        ],
        explain: 'Current through the body does the damage. Voltage is the push that decides how much current can flow.',
      },
      {
        q: 'Why is it safe to touch the Arduino’s 5V pin?',
        answer: 0,
        options: [
          { t: 'Dry skin has high resistance, so 5 V can only push a tiny current' },
          { t: 'The Arduino has no real electricity', why: 'It does! It’s just a small push (5 V), which your skin easily resists.' },
          { t: 'Because the 5V pin is AC', why: 'It’s DC. And AC vs DC isn’t the reason it’s safe: the low voltage is.' },
        ],
        explain: 'Low voltage + high skin resistance = a current far too small to feel.',
      },
      {
        q: 'With YOUR kit, what’s the most likely way to get hurt?',
        answer: 2,
        options: [
          { t: 'A shock from the 9V battery', why: '9 V can’t push much current through dry skin. Shorting it makes heat, though!' },
          { t: 'The Arduino exploding', why: 'Very unlikely. Arduinos die quietly, usually with a sad smell at worst.' },
          { t: 'A burn from the soldering iron' },
        ],
        explain: 'At around 350 °C, the iron burns instantly. Respect the iron: it lives in its stand.',
      },
      {
        q: 'Why should the laptop be unplugged from the wall when you use the EMG sensor?',
        answer: 0,
        options: [
          { t: 'So there’s no path from your body to mains power if something fails' },
          { t: 'It makes the laptop battery last longer', why: 'Nope! It’s about never connecting your body to wall power.' },
          { t: 'Because Wi-Fi interferes with muscles', why: 'Your muscles are fine with Wi-Fi. The reason is mains safety.' },
        ],
        explain: 'With electrodes on your skin, you don’t want any connection to wall power, even through a laptop charger.',
      },
      {
        q: 'A 9V battery rattles around a drawer with coins and keys. What’s the risk?',
        answer: 1,
        options: [
          { t: 'None, batteries are sealed', why: 'The case is sealed, but both terminals sit right next to each other on top, uncovered.' },
          { t: 'Metal can touch both terminals, short the battery and make it hot' },
          { t: 'It will magnetize the keys', why: 'Batteries don’t magnetize things like that. The real danger is a short circuit.' },
        ],
        explain: 'Coins or keys can bridge the two terminals: a short circuit that heats up the battery. Keep the cap on or tape the terminals.',
      },
    ],
    challenges: [
      {
        type: 'build',
        title: 'Set up your safe lab corner',
        why: 'A good setup prevents 90% of accidents before they happen.',
        parts: ['a clear table', 'good light', 'safety glasses (or any glasses)', 'soldering iron stand + damp sponge', 'a small dish for parts'],
        steps: [
          'Clear a table and put down a sheet of cardboard to protect it from heat and scratches.',
          'Make sure you have good light. A desk lamp aimed at your work is perfect.',
          'Put your <b>safety glasses</b> where you’ll see them.',
          'Set up the soldering iron stand on the side of your writing hand, with the cable running away from you.',
          'Move drinks and food to another table. (Solder snacks are not a thing.)',
          'Put the cap back on your 9V batteries, or cover the terminals with tape.',
          'Find where you’d run cool water if you burned yourself. Now you know.',
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ 0.3
  'm0-3': {
    minutes: 18,
    intro: 'Behold my most trusted lab partner: the <b>multimeter</b>! It never lies, never sleeps, and beeps when it’s happy. Let’s learn to read its mind. 📟',
    summary: 'A multimeter measures DC voltage (probes across the part, in parallel), resistance (power off, probes on each leg), continuity (beeps when connected) and current (meter in series, in the loop). Black probe goes in COM, red usually in VΩmA. OL means over range or not connected. Never put the probes across a battery in current mode: the meter acts like a wire and blows its fuse. Never measure mains in this course.',
    sections: [
      {
        title: 'One box, many superpowers',
        html: `
          <p>A <b>multimeter</b> is three measuring tools in one box:</p>
          <ul>
            <li>a <b>voltmeter</b>: measures voltage (the push), in volts</li>
            <li>an <b>ohmmeter</b>: measures resistance, in ohms (Ω)</li>
            <li>an <b>ammeter</b>: measures current (the flow), in amps</li>
          </ul>
          <p>Plus most have a <b>continuity</b> mode that beeps when two points are connected. You pick the superpower with the big round <b>dial</b>, and plug the two <b>probes</b> (the pointy wires) into the right holes, called <b>jacks</b>.</p>`,
      },
      {
        type: 'widget',
        widget: 'meter',
        title: '🎛️ Try it: turn the dial',
        html: '<p>Tap a dial position to see what it does, where the probes go, and what you’d see on the screen.</p>',
      },
      {
        type: 'jargon',
        terms: [
          ['Probe', 'The pointy test wires. Black and red.'],
          ['COM', 'The “common” jack. The black probe always goes here.'],
          ['In parallel', 'Connected across a part, side by side with it. How you measure voltage.'],
          ['In series', 'Connected in the loop, so current flows through it. How you measure current.'],
          ['Range', 'The maximum the meter is set to read (like 20 V). Auto-ranging meters pick it for you.'],
          ['OL', '“Over limit”: too big for the range, or nothing connected. Some meters show a lonely “1” instead.'],
        ],
      },
      {
        title: 'The three moves you’ll use all the time',
        html: `
          <p><b>1. Measuring voltage (V⎓).</b> Leave the circuit running. Touch the red probe to the + side and the black probe to the − side of whatever you’re measuring. The meter just “looks” across it, like checking water pressure with a gauge.</p>
          <p><b>2. Measuring resistance (Ω).</b> Power <b>off</b>. The meter sends its own tiny test current, so any other power in the circuit confuses it (and can damage it). Best: take the part out and touch one probe to each leg.</p>
          <p><b>3. Checking continuity (🔊).</b> Power off. Touch two points: beep = connected. This is how you find broken wires, bad solder joints and split breadboard rails in seconds.</p>
          <p>Measuring <b>current</b> is trickier: you have to break the loop and put the meter <i>in</i> it, so the current flows through the meter. We’ll do that later, carefully.</p>
          <p>If your meter isn’t auto-ranging, pick the smallest range that’s <b>bigger</b> than what you expect. For a 9V battery, use the 20 V range.</p>`,
      },
      {
        type: 'danger',
        title: '💥 How to blow your multimeter’s fuse in one second',
        html: `
          <ol>
            <li>Turn the dial to <b>A</b> (current).</li>
            <li>Touch the probes across a battery, like you would to measure voltage.</li>
            <li>Pop. Meter now reads nothing in current mode. Sad beep.</li>
          </ol>
          <p><b>Why it happens:</b> in current mode, the meter is basically a plain piece of wire (it has to be, so it doesn’t disturb the circuit). Putting a wire across a battery is a short circuit, and the fuse inside sacrifices itself to save the meter. <b>Always check the dial before you touch the probes down.</b></p>`,
      },
    ],
    search: 'how to use a multimeter for beginners',
    videos: [
      { title: 'How to Use a Multimeter', channel: 'Science Buddies', url: 'https://www.youtube.com/watch?v=ts0EVc9vXcs', desc: 'Clear beginner walkthrough: voltage, current, resistance and continuity on real circuits.' },
      { title: 'Digital Multimeter Tutorial for Beginners (part 1)', channel: 'Electrosphere', url: 'https://www.youtube.com/watch?v=eSPmnL1hhq0', desc: 'Goes through the parts of a meter and what every section of the dial does.' },
      { title: 'How to Use a Multimeter for Beginners', channel: 'Ratchets And Wrenches', url: 'https://www.youtube.com/watch?v=TdUK6RPdIrA', desc: 'Hands-on demos of measuring voltage, resistance, continuity and amps with a cheap meter.' },
    ],
    quiz: [
      {
        q: 'Which jack does the <b>black</b> probe go in?',
        answer: 2,
        options: [
          { t: '10A', why: 'That jack is only for the red probe when measuring big currents.' },
          { t: 'VΩmA', why: 'That’s where the red probe usually goes.' },
          { t: 'COM' },
        ],
        explain: 'Black always goes in COM (“common”). The red probe moves depending on what you measure.',
      },
      {
        q: 'You want to check a 9V battery. Which dial setting?',
        answer: 0,
        options: [
          { t: 'V⎓ (DC volts)' },
          { t: 'V~ (AC volts)', why: 'Batteries are DC: their current only flows one way. V~ is for wall-socket style AC.' },
          { t: 'Ω (resistance)', why: 'Resistance mode is for unpowered parts. A battery is a power source, so you measure its voltage.' },
        ],
        explain: 'Batteries make DC voltage, so use V⎓ (on a manual meter, the 20 V range).',
      },
      {
        q: 'You measure a resistor and the screen says <b>OL</b>. What does that mean?',
        answer: 1,
        options: [
          { t: 'The resistor is “OK, Lovely”', why: 'Ha! It means “over limit”: the value is too big for the range, or the probes aren’t touching anything.' },
          { t: 'The value is too big for this range (or the probes aren’t connected)' },
          { t: 'The resistor is shorted', why: 'A short would read close to 0 Ω, the opposite of OL.' },
        ],
        explain: 'OL = over limit. Switch to a bigger range or check your probes are actually touching the legs.',
      },
      {
        q: 'Why must the circuit be <b>unpowered</b> when you measure resistance?',
        answer: 0,
        options: [
          { t: 'The meter uses its own tiny test current, and outside power messes it up (or damages the meter)' },
          { t: 'Resistors only have resistance when they’re cold', why: 'Their resistance barely changes with temperature. The reason is the meter’s own test current.' },
          { t: 'It doesn’t matter at all', why: 'It does! Outside voltage gives nonsense readings and can hurt the meter.' },
        ],
        explain: 'In Ω mode the meter powers the measurement itself, so it needs the circuit switched off.',
      },
      {
        q: 'What happens if you touch the probes across a battery while the dial is on <b>A</b> (current)?',
        answer: 2,
        options: [
          { t: 'You read the battery’s voltage', why: 'In current mode the meter isn’t measuring voltage at all. It behaves like a wire.' },
          { t: 'Nothing happens', why: 'Something definitely happens: a short circuit through the meter.' },
          { t: 'You short-circuit the battery through the meter and blow its fuse' },
        ],
        explain: 'In current mode the meter is almost a plain wire. Across a battery, that’s a short circuit.',
      },
    ],
    challenges: [
      {
        type: 'build',
        title: 'Battery health check',
        why: 'Your first real measurements! You’ll use these numbers again in Module 1.',
        parts: ['multimeter', '9V battery', 'Arduino Uno + USB cable', 'a resistor'],
        steps: [
          'Plug the black probe into <b>COM</b> and the red probe into <b>VΩmA</b> (or V).',
          'Turn the dial to <b>V⎓</b> (or the 20 V range on a manual meter).',
          'Touch red to the battery’s <b>+</b> terminal and black to <b>−</b>. Write down the number. Fresh is about 9.0–9.6 V.',
          'Swap the probes. See the minus sign? That just means “backwards”. Nothing breaks.',
          'Plug in the Arduino by USB. Touch black to a <b>GND</b> pin and red to the <b>5V</b> pin. You should see about 4.8–5.1 V.',
          '<b>Bonus:</b> unplug everything, switch to <b>Ω</b>, and measure a resistor by touching one probe to each leg (don’t pinch both legs with your fingers). Compare it with the label on its paper strip.',
        ],
        troubleshoot: [
          '<b>Reads 0?</b> Check the dial is on V⎓ and the red probe is in the V jack, not 10A.',
          '<b>Reads OL?</b> Wrong range, or the probes aren’t touching the metal.',
          '<b>Display dim or weird?</b> The meter’s own battery may be low.',
        ],
      },
      {
        type: 'build',
        title: 'Breadboard rail detective',
        why: 'Remember the split-rail gotcha from the breadboard lesson? Time to catch it red-handed.',
        parts: ['multimeter', 'breadboard', '2 jumper wires'],
        steps: [
          'Turn the dial to <b>continuity</b> (🔊 or the diode symbol). Touch the probes together: it should beep.',
          'Push a jumper wire into hole <b>a5</b> and another into <b>e5</b>. Touch a probe to each wire’s metal end: <b>beep</b> (same strip).',
          'Move the second wire to <b>f5</b>. Touch again: <b>silence</b>. That’s the middle gap!',
          'Now put one wire at the far left of the top + rail and the other at the far right. Beep or silence?',
          'Silence = your rails are <b>split in the middle</b>. Write that down: you’ll need a jumper across the break later.',
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ 0.4
  'm0-4': {
    minutes: 15,
    intro: 'Soldering: the art of gluing metal with… more metal. At 350 °C. What could possibly go wrong? (Plenty. Let’s fix that.) 🔥',
    summary: 'Soldering joins metal parts with melted solder to make a strong electrical connection. The iron tip is about 330–370 °C; leaded solder melts around 183–190 °C, lead-free around 217–227 °C. Technique: tin the tip, heat both the pad and the leg for 1–2 s, feed solder into the joint (not onto the iron), remove solder then iron, don’t move it while it cools. A good joint is shiny and shaped like a small volcano; bad ones are blobs, cold (dull, lumpy) joints, too little solder, or bridges. The smoke is flux: ventilate. Wash hands after (lead). The iron always goes back in its stand.',
    sections: [
      {
        title: 'What is soldering?',
        html: `
          <p><b>Soldering</b> joins metal parts with <b>solder</b>, a soft metal that melts at around 180–230 °C. The <b>soldering iron</b> heats the parts, the solder melts into the gap, and when it cools you get a connection that’s strong <i>and</i> conducts electricity.</p>
          <p>It’s not glue: the solder has to properly <b>wet</b> both metals (spread out and stick, like water on a clean plate). That only happens when both parts are hot enough. That’s the secret behind every good joint.</p>`,
      },
      {
        type: 'jargon',
        terms: [
          ['Solder', 'The metal wire you melt. Leaded melts about 183–190 °C; lead-free about 217–227 °C.'],
          ['Flux', 'A cleaning goo inside the solder wire. It burns off as the smoke and helps solder stick.'],
          ['Tinning', 'Coating the hot tip with a little fresh solder so heat flows into the joint.'],
          ['Pad', 'The copper ring on a circuit board where a part’s leg gets soldered.'],
          ['Joint', 'The finished blob of solder holding a leg to a pad (or two wires together).'],
          ['Cold joint', 'A dull, lumpy joint that didn’t get hot enough or moved while cooling. Unreliable.'],
        ],
      },
      {
        title: 'The 5-second joint',
        html: `
          <ol>
            <li><b>Clean and tin the tip.</b> Wipe it on the damp sponge (or brass wool), then melt a tiny bit of solder onto it. A shiny tip moves heat; a black, crusty one doesn’t.</li>
            <li><b>Heat both parts.</b> Touch the tip so it presses on the <b>pad and the leg at the same time</b>. Count to two.</li>
            <li><b>Feed the solder into the joint</b>, on the opposite side from the tip, not onto the iron itself. It should melt and flow around the leg.</li>
            <li><b>Remove the solder, then the iron.</b> The whole thing takes about 3–5 seconds.</li>
            <li><b>Don’t move it</b> for a couple of seconds while it cools.</li>
          </ol>
          <p>Iron temperature: if yours is adjustable, about <b>330–350 °C</b> for leaded solder or <b>350–370 °C</b> for lead-free. If it isn’t adjustable, let it heat for 2–3 minutes first.</p>`,
      },
      {
        type: 'widget',
        widget: 'joints',
        title: '🔍 Good joint, bad joint',
        html: '<p>Learn to spot these. Most beginner problems are one of the four bad ones, and every one can be fixed by reheating.</p>',
      },
      {
        type: 'danger',
        title: '🔥 How to brand yourself with a soldering iron (please don’t)',
        html: `
          <ol>
            <li>Put the iron down on the table “just for a second”.</li>
            <li>Reach across it for the solder.</li>
            <li>Or: catch it as it rolls off the table. (Never do this. Let it fall.)</li>
            <li>Learn what 350 °C feels like. Instantly.</li>
          </ol>
          <p><b>Why it happens:</b> the tip is hotter than an oven and stays dangerously hot for several minutes after you switch it off. The fix is simple: the iron <b>always</b> goes back in its stand, and you <b>never catch a falling iron</b>.</p>`,
      },
      {
        type: 'tip',
        title: '💨 Breathe easy',
        html: '<p>Open a window or have a small fan gently blowing the smoke away from your face (it’s burning flux, which irritates your lungs). Wear glasses: solder can spit. And <b>wash your hands</b> afterwards, especially with leaded solder.</p>',
      },
    ],
    search: 'how to solder for beginners',
    videos: [
      { title: 'Collin’s Lab: Soldering', channel: 'Adafruit Industries', url: 'https://www.youtube.com/watch?v=QKbJxytERvg', desc: 'A friendly, beginner-level tour of soldering basics, with lots of close-ups.' },
      { title: 'EEVblog #180 - Soldering Tutorial Part 1 - Tools', channel: 'EEVblog', url: 'https://www.youtube.com/watch?v=J5Sb21qbpEQ', desc: 'Everything about irons, tips, solder and flux, from a very enthusiastic engineer.' },
      { title: 'EEVblog #183 - Soldering Tutorial Part 2', channel: 'EEVblog', url: 'https://www.youtube.com/watch?v=fYz5nIHH0iY', desc: 'The actual technique: heating, feeding solder and what good joints look like.' },
    ],
    quiz: [
      {
        q: 'When making a joint, what should the iron heat?',
        answer: 1,
        options: [
          { t: 'Just the solder wire, so it drips onto the joint', why: 'Dripping solder onto cold parts makes blobs and cold joints. The parts must be hot.' },
          { t: 'The pad AND the leg together, then you feed solder to the joint' },
          { t: 'Only the component leg', why: 'Close, but the pad needs heat too, or the solder won’t stick to it (that makes a blob).' },
        ],
        explain: 'Heat both metals, then feed solder into the joint. Hot parts make the solder flow and stick.',
      },
      {
        q: 'Where does most of the smoke come from?',
        answer: 0,
        options: [
          { t: 'Flux burning off' },
          { t: 'Lead boiling', why: 'Lead needs far more heat than an iron gives to turn into vapor. The smoke is flux, which is still not great to breathe.' },
          { t: 'The iron’s plastic handle', why: 'If your handle is smoking, something is very wrong! Normal smoke is flux.' },
        ],
        explain: 'It’s flux burning off. Ventilate so you don’t breathe it in.',
      },
      {
        q: 'What does a good solder joint look like?',
        answer: 2,
        options: [
          { t: 'A round shiny ball sitting on top', why: 'A ball means the solder didn’t stick to the pad: it wasn’t hot enough.' },
          { t: 'Dull grey and lumpy', why: 'That’s a cold joint. Reheat it until it flows smoothly.' },
          { t: 'Shiny and smooth, shaped like a small volcano' },
        ],
        explain: 'Shiny, smooth and cone-shaped means the solder wetted both the pad and the leg.',
      },
      {
        q: 'Why wash your hands after soldering?',
        answer: 1,
        options: [
          { t: 'To cool them down', why: 'Running water is for burns. Hand washing is about what’s on your fingers.' },
          { t: 'Solder can contain lead, and you don’t want to swallow any' },
          { t: 'Flux makes your fingers sticky', why: 'It does a bit, but the important reason is lead.' },
        ],
        explain: 'Leaded solder leaves traces on your fingers. Wash before eating or touching your face.',
      },
      {
        q: 'The hot iron starts rolling off the table. What do you do?',
        answer: 0,
        options: [
          { t: 'Let it fall and step back' },
          { t: 'Catch it quickly', why: 'Your hand would very likely grab the hot end. Floors can be fixed; hands take weeks.' },
          { t: 'Kick it away', why: 'Please don’t kick anything that’s 350 °C.' },
        ],
        explain: 'Never catch a falling iron. Let it drop, then pick it up by the handle.',
      },
    ],
    challenges: [
      {
        type: 'build',
        title: 'Solder a resistor chain (and test it)',
        why: 'Real practice on cheap parts, and your multimeter tells you if your joints actually work.',
        parts: ['soldering iron + stand + damp sponge', 'solder', '2 resistors (same value is easiest)', 'multimeter', 'tape or Blu-Tack to hold things', 'safety glasses'],
        steps: [
          'Glasses on, window open or fan on, iron in its stand. Switch it on and let it heat up.',
          '<b>Tin the tip:</b> wipe it on the damp sponge, then melt a little solder onto it so it looks shiny.',
          'Bend the end of one resistor’s leg into a small hook. Hook the second resistor’s leg through it and squeeze gently.',
          'Tape the resistors to your cardboard so the joint sticks up in the air.',
          'Touch the tip to the joint for 2 seconds, then feed solder into the joint (not onto the iron). Remove solder, then iron.',
          'Don’t move it for a few seconds. Compare it with the “Good joint, bad joint” pictures. Fix it if needed by reheating.',
          'Put the iron back in its stand and switch it off.',
          'Measure across both free ends with your meter on <b>Ω</b>. Two 220 Ω resistors should read about <b>440 Ω</b>. (Resistors in a line add up: more on that in Module 2!)',
          'Wash your hands. 🧼',
        ],
        troubleshoot: [
          '<b>Solder won’t melt or stick?</b> The tip is dirty or not tinned. Clean it, tin it, try again.',
          '<b>Meter says OL?</b> The joint isn’t really connected. Reheat until the solder flows around both legs.',
          '<b>Big shiny ball?</b> Too much solder, not enough heat on the legs. Reheat and let it flow.',
        ],
      },
    ],
  },
});
