/* Module 1: Electricity Basics. Lesson content. */
window.LabNotesLessons = window.LabNotesLessons || {};

Object.assign(window.LabNotesLessons, {
  // ------------------------------------------------------------------ 1.1
  'm1-1': {
    minutes: 15,
    intro: 'Time for the BIG THREE: <b>voltage, current and resistance!</b> Master these and every circuit in the universe starts making sense. (Most of them. The universe is big.) ⚡',
    summary: 'Voltage (V, volts) is the push, like water pressure; a battery is a pump. Current (I, amps) is the flow, how much charge passes per second. Resistance (R, ohms) is how hard it is to flow, like a narrow pipe. More voltage means more current; more resistance means less current. Current only flows around a complete loop. 1 A = 1000 mA; LEDs like about 10–20 mA. Conventional current goes from + to −, even though electrons actually drift the other way.',
    sections: [
      {
        title: 'Think of water in pipes',
        html: `
          <p>Electricity is invisible, so let’s borrow something we can picture: <b>water in pipes</b>.</p>
          <ul>
            <li>🔋 <b>Voltage</b> is the <b>pressure</b>: the push. A battery is like a pump that pushes from its + side to its − side. Measured in <b>volts (V)</b>.</li>
            <li>💧 <b>Current</b> is the <b>flow</b>: how much electricity passes a point every second. Measured in <b>amps (A)</b>.</li>
            <li>🚧 <b>Resistance</b> is how <b>narrow the pipe</b> is: how hard it is for current to get through. Measured in <b>ohms (Ω)</b>.</li>
          </ul>
          <p>Push harder → more flow. Make the pipe narrower → less flow. That’s really the whole idea. (Next lesson turns it into one tiny equation.)</p>
          <p class="funfact">📜 <b>Why is current called “I”?</b> It comes from the French <i>intensité du courant</i> (“intensity of the current”), from the scientist André-Marie Ampère. The unit amp is named after him too.</p>`,
      },
      {
        type: 'widget',
        widget: 'circuit',
        title: '🎮 Play with a real loop',
        html: '<p>Drag the sliders and flip the switch. Watch the meter (the A in the circle) and the dots.</p>',
      },
      {
        type: 'jargon',
        terms: [
          ['Circuit', 'A complete loop that current can flow around.'],
          ['Volt (V)', 'Unit of voltage (push). Arduino pins: 5 V. Your battery: 9 V.'],
          ['Amp (A)', 'Unit of current (flow). 1 A is a lot for small electronics.'],
          ['Milliamp (mA)', 'One thousandth of an amp. 1 A = 1000 mA. LEDs like 10–20 mA.'],
          ['Ohm (Ω)', 'Unit of resistance. 1 kΩ (kilo-ohm) = 1000 Ω.'],
          ['Open circuit', 'A loop with a gap (open switch, loose wire). No current flows.'],
        ],
      },
      {
        title: 'Current needs a complete loop',
        html: `
          <p>Current has to come <b>out</b> of the battery, go <b>through</b> your parts, and come <b>back</b> into the battery. If there’s a gap anywhere (an open switch, a loose wire, the middle gap of a breadboard), the flow stops <i>everywhere</i> in the loop, instantly.</p>
          <p>That’s why your LED went dark in the breadboard bonus challenge: moving one leg across the gap broke the loop.</p>
          <p class="funfact">🔄 <b>Plot twist:</b> the tiny particles that actually move in wires, <b>electrons</b>, drift from − to +. But scientists picked the “+ to −” direction long before electrons were discovered. So everyone still draws <b>conventional current</b> going from + to −. The math works out the same either way, so we do too.</p>`,
      },
      {
        title: 'Units cheat sheet',
        html: `
          <ul>
            <li>An LED is happy with about <b>10–20 mA</b> (0.01–0.02 A).</li>
            <li>One Arduino pin can safely give about <b>20 mA</b>.</li>
            <li>A phone charger delivers about <b>1–2 A</b>.</li>
            <li><b>1 kΩ</b> = 1000 Ω, <b>4.7 kΩ</b> = 4700 Ω, <b>1 MΩ</b> = 1 000 000 Ω.</li>
          </ul>`,
      },
      {
        type: 'danger',
        title: '☠️ How to make a wire glow (please don’t)',
        html: `
          <ol>
            <li>Connect a wire straight from + to − with nothing in between.</li>
            <li>Resistance: almost zero. Current: as much as the battery can possibly give.</li>
            <li>The wire gets hot. The battery gets hot. You get… a lesson.</li>
          </ol>
          <p><b>Why it happens:</b> narrow pipe = little flow, so <i>no</i> pipe narrowing at all = a flood. That’s a <b>short circuit</b>. Every real circuit needs something (like a resistor) to limit the current.</p>`,
      },
    ],
    search: 'voltage current resistance explained water analogy',
    videos: [
      { title: 'Voltage vs Current Made Easy | Simple Water Analogy', channel: 'Bolt & Volt', url: 'https://www.youtube.com/watch?v=xKBKXzJtE9E', desc: 'Voltage, current and resistance explained with water, for total beginners.' },
      { title: 'Summary of Voltage, Current and Power Using a Water Analogy', channel: 'STEM Videos for the Flipped Classroom', url: 'https://www.youtube.com/watch?v=w5Iq2yqJGEg', desc: 'A calm whiteboard-style recap that also previews Ohm’s law and power.' },
      { title: 'Circuit water analogy', channel: 'ATAR Chemistry for the QCE', url: 'https://www.youtube.com/watch?v=C3pwVEYRkKI', desc: 'A short physical demo: current as water flow and voltage as water pressure.' },
    ],
    quiz: [
      {
        q: 'In the water analogy, what is <b>voltage</b> like?',
        answer: 0,
        options: [
          { t: 'The pressure pushing the water' },
          { t: 'How much water flows per second', why: 'That’s current (the flow). Voltage is the push behind it.' },
          { t: 'How narrow the pipe is', why: 'That’s resistance.' },
        ],
        explain: 'Voltage is the push (pressure). Current is the flow. Resistance is the narrowness.',
      },
      {
        q: 'Current is measured in…',
        answer: 2,
        options: [
          { t: 'Volts', why: 'Volts measure voltage, the push.' },
          { t: 'Ohms', why: 'Ohms measure resistance.' },
          { t: 'Amps' },
        ],
        explain: 'Current is measured in amps (A), or milliamps (mA) for small currents.',
      },
      {
        q: 'Same battery, but you swap in a <b>bigger</b> resistor. What happens to the current?',
        answer: 1,
        options: [
          { t: 'It goes up', why: 'A bigger resistance is a narrower pipe: less flows, not more.' },
          { t: 'It goes down' },
          { t: 'It stays the same', why: 'Resistance directly controls the flow. Try it with the slider above!' },
        ],
        explain: 'More resistance → less current, for the same push.',
      },
      {
        q: 'How much is <b>20 mA</b> in amps?',
        answer: 0,
        options: [
          { t: '0.02 A' },
          { t: '20 000 A', why: 'That’s going the wrong way! Milli means one thousandth, so you divide by 1000.' },
          { t: '2 A', why: 'Close, but 2 A would be 2000 mA. 20 mA ÷ 1000 = 0.02 A.' },
        ],
        explain: '“Milli” means one thousandth: 20 ÷ 1000 = 0.02 A.',
      },
      {
        q: 'An LED circuit stops working when you unplug just one wire. Why?',
        answer: 2,
        options: [
          { t: 'The other wires run out of electricity', why: 'Wires don’t store electricity. The battery is still full; the path is broken.' },
          { t: 'The LED gets scared', why: 'Adorable theory, but no. 😄' },
          { t: 'The loop is broken, so no current can flow anywhere in it' },
        ],
        explain: 'Current only flows around a complete loop. One gap stops it everywhere.',
      },
    ],
    challenges: [
      {
        type: 'sim',
        title: 'Watch the dots in Falstad',
        why: 'Falstad is a free simulator that runs in your browser, no account needed. It even shows the current as moving dots.',
        steps: [
          'Open the simulator with the button below. You’ll see a 9 V battery and a 1 kΩ resistor in a loop.',
          'Hover your mouse over the resistor (on iPhone, tap it). The bottom-right corner shows <b>I = 9 mA</b>.',
          '<b>Double-click</b> the resistor and change its resistance to <b>470</b>. Click OK. Did the dots speed up? What does I say now?',
          'Double-click the battery and change “Max Voltage” to <b>4.5</b>. Predict first: will the current go up or down?',
        ],
        link: { url: window.LabLinks.batteryResistor(9, 1000), label: 'Open in Falstad' },
      },
      {
        type: 'build',
        title: 'Brightness vs resistance',
        why: 'See with your own eyes that a bigger resistor means less current.',
        parts: ['your LED circuit from the breadboard lesson', 'a 220 Ω and a 1 kΩ resistor (or any small + bigger pair)'],
        steps: [
          'Build the LED circuit from <b>Meet the Breadboard</b> with the <b>220 Ω</b> resistor. Plug in USB. Note the brightness.',
          'Unplug USB. Swap in the <b>1 kΩ</b> resistor (same holes). Plug back in.',
          'Dimmer? That’s about 4–5 times less current. Same push, narrower pipe.',
          'If you have a 10 kΩ resistor, try it too. Barely glowing? You might need to cup your hands around it to see!',
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ 1.2
  'm1-2': {
    minutes: 18,
    intro: 'Behold the most famous equation in electronics: <b>V = I × R</b>. Three letters. Infinite power. (Well, finite power. That’s next lesson.) 🧮',
    summary: 'Ohm’s law: V = I × R, so I = V ÷ R and R = V ÷ I. Use volts, amps and ohms (or volts, mA and kΩ together). Example: 9 V across 1 kΩ gives 9 mA. LED resistor: R = (supply voltage − LED voltage) ÷ current, e.g. (5 − 2) ÷ 0.015 = 200 Ω, then round UP to the next standard value (220 Ω). With no resistor, R ≈ 0 and the current is limited only by luck, which destroys the LED.',
    sections: [
      {
        title: 'One equation to rule them all',
        html: `
          <p>Last lesson: more push → more flow, narrower pipe → less flow. <b>Georg Ohm</b> measured it carefully in the 1820s and found it’s perfectly predictable:</p>
          <p class="funfact" style="font-size:1.4rem;text-align:center"><b>V = I × R</b></p>
          <p>Voltage = current × resistance. Rearrange it and you can find any one of the three if you know the other two:</p>
          <ul>
            <li><b>I = V ÷ R</b> → how much current will flow?</li>
            <li><b>R = V ÷ I</b> → which resistor do I need?</li>
          </ul>
          <p><b>Example:</b> a 9 V battery across a 1000 Ω resistor: I = 9 ÷ 1000 = <b>0.009 A = 9 mA</b>.</p>`,
      },
      {
        type: 'widget',
        widget: 'ohm',
        title: '🔺 The magic triangle',
        html: '<p>Cover the letter you want and the rest shows you the formula. Then type in numbers.</p>',
      },
      {
        title: '🧠 The lazy-genius unit trick',
        html: `
          <p>Dividing by 1000 all the time is boring. Here’s a shortcut that always works:</p>
          <p><b>volts = milliamps × kilo-ohms</b></p>
          <p>9 V ÷ 1 kΩ = <b>9 mA</b>. 5 V ÷ 0.22 kΩ ≈ <b>22.7 mA</b>. No zeros to lose. Just never mix it with plain amps or plain ohms in the same sum.</p>`,
      },
      {
        title: 'Why your LED needed that resistor',
        html: `
          <p>An LED is a bit special: it “uses up” a fixed chunk of voltage to light, called its <b>forward voltage</b>. Roughly <b>2 V</b> for red, yellow and green, <b>3 V</b> for blue and white.</p>
          <p>Whatever voltage is <i>left over</i> lands on the resistor, and Ohm’s law tells us the resistor size for the current we want:</p>
          <p class="funfact"><b>R = (supply voltage − LED voltage) ÷ current</b></p>
          <p>Arduino 5 V, red LED, 15 mA: R = (5 − 2) ÷ 0.015 = <b>200 Ω</b>. Resistors only come in certain <b>standard values</b>, so we round <b>up</b> to the next one: <b>220 Ω</b>. Rounding up means a little less current, which is the safe direction.</p>`,
      },
      {
        type: 'widget',
        widget: 'ledCalc',
        title: '💡 LED resistor calculator',
        html: '<p>Your new favorite tool. Pick the supply, the LED color and how bright you want it.</p>',
      },
      {
        type: 'jargon',
        terms: [
          ['Ohm’s law', 'V = I × R. The relationship between push, flow and narrowness.'],
          ['Forward voltage (Vf)', 'The voltage an LED or diode “uses up” when it’s on. About 2 V (red) to 3 V (blue/white).'],
          ['Standard values', 'Resistors come in fixed sizes: 100, 120, 150, 180, 220, 270, 330, 390, 470, 560, 680, 820 (and ×10, ×100…).'],
          ['Rounding up', 'Picking the next bigger standard resistor. Slightly less current = safer.'],
        ],
      },
      {
        type: 'danger',
        title: '☠️ How to blow up an LED: the math edition',
        html: `
          <p>No resistor means R ≈ 0 Ω. Ohm’s law then says I = 3 V ÷ 0 Ω = <b>∞</b>.</p>
          <p>Infinity amps doesn’t really happen: instead, as much current flows as the battery, wires and LED can carry until something gives up. Usually that’s the LED, in a tiny flash. 💥 Now you know <i>exactly</i> why the bodyguard resistor exists.</p>`,
      },
    ],
    search: 'Ohm\'s law explained for beginners',
    videos: [
      { title: 'Ohm’s Law - Simple Circuits', channel: 'tecmath', url: 'https://www.youtube.com/watch?v=kTzHxkxMxOs', desc: 'Calm, clear worked examples of V = I × R on simple circuits.' },
      { title: 'V=IR Explained | Ohm’s Law - Water System as Analogy', channel: 'Electric Simplified', url: 'https://www.youtube.com/watch?v=nnTRiYzhEhw', desc: 'Connects the water analogy from last lesson straight to the equation.' },
      { title: 'Ohm’s Law Explained with Water Analogy', channel: 'Tayyab Electric Hacks', url: 'https://www.youtube.com/watch?v=_DvELHA1jzM', desc: 'Another angle on the same idea, with practical examples.' },
    ],
    quiz: [
      {
        q: '5 V across a 1 kΩ resistor. How much current flows?',
        answer: 1,
        options: [
          { t: '5000 mA', why: 'That would be 5 V × 1000. Current is V ÷ R, not V × R.' },
          { t: '5 mA' },
          { t: '0.2 mA', why: 'That’s 1 ÷ 5. Remember: I = V ÷ R = 5 ÷ 1000 = 0.005 A.' },
        ],
        explain: 'I = V ÷ R = 5 ÷ 1000 = 0.005 A = 5 mA. (Unit trick: 5 V ÷ 1 kΩ = 5 mA.)',
      },
      {
        q: 'You want 10 mA to flow through a 470 Ω resistor. What voltage do you need?',
        answer: 2,
        options: [
          { t: '47 V', why: 'Check the units: 10 mA is 0.01 A, not 0.1 A.' },
          { t: '4700 V', why: 'That used 10 A instead of 10 mA. Milli means divide by 1000!' },
          { t: '4.7 V' },
        ],
        explain: 'V = I × R = 0.01 A × 470 Ω = 4.7 V.',
      },
      {
        q: '9V battery, red LED (about 2 V), you want 20 mA. Which resistor?',
        answer: 0,
        options: [
          { t: '350 Ω, rounded up to the standard 390 Ω' },
          { t: '450 Ω', why: 'That’s 9 ÷ 0.02: you forgot to subtract the LED’s 2 V first. The resistor only gets the leftover 7 V.' },
          { t: '0.35 Ω', why: 'A units slip: 20 mA is 0.02 A, not 20 A.' },
        ],
        explain: 'R = (9 − 2) ÷ 0.02 = 350 Ω → round up to the next standard value, 390 Ω.',
      },
      {
        q: 'Same voltage, but you <b>double</b> the resistance. The current…',
        answer: 1,
        options: [
          { t: 'Doubles', why: 'Bigger resistance means less flow. I = V ÷ R, so a bigger R gives a smaller I.' },
          { t: 'Halves' },
          { t: 'Stays the same', why: 'R is right there in I = V ÷ R. Change R and I changes.' },
        ],
        explain: 'I = V ÷ R: double R and I becomes half.',
      },
      {
        q: 'Your math says 200 Ω, but you only have 180 Ω and 220 Ω. Which do you use for an LED?',
        answer: 1,
        options: [
          { t: '180 Ω', why: 'That lets slightly MORE current through than planned. Usually OK, but rounding up is the safe habit.' },
          { t: '220 Ω' },
          { t: 'Neither, you must find exactly 200 Ω', why: 'Nobody does that! Standard values are close enough. Just round in the safe direction.' },
        ],
        explain: 'Round up: a slightly bigger resistor means slightly less current, which is the safe side for the LED.',
      },
    ],
    challenges: [
      {
        type: 'build',
        title: 'Catch Ohm’s law red-handed',
        why: 'Use your meter to prove the equation works in your own circuit.',
        parts: ['LED circuit from the breadboard lesson (220 Ω)', 'multimeter'],
        steps: [
          'Build the LED circuit and plug in USB so the LED is on.',
          'Set the meter to <b>V⎓</b>. Measure across the <b>resistor</b> (one probe on each leg). Write it down, e.g. 3.0 V.',
          'Measure across the <b>LED</b>. Write it down, e.g. 2.0 V.',
          'Add them together. Close to the Arduino’s 5 V? The supply voltage gets shared between the parts in the loop!',
          'Now use Ohm’s law: current = (voltage across resistor) ÷ 220. With 3.0 V that’s 3.0 ÷ 220 ≈ <b>13.6 mA</b>. That’s how much current your LED is getting.',
        ],
      },
      {
        type: 'sim',
        title: 'Predict, then check (Falstad)',
        why: 'The best way to really learn Ohm’s law: guess first, then let the simulator judge you.',
        steps: [
          'Open the simulator: 9 V battery and a 1 kΩ resistor.',
          'Before hovering, predict the current with Ohm’s law. Then hover over the resistor and check “I =”.',
          'Double-click the resistor and set it to <b>2200</b> (2.2 kΩ). Predict, then check.',
          'Now set the battery to <b>5</b> V and the resistor to <b>220</b>. Predict, then check. (Answer: about 22.7 mA.)',
        ],
        link: { url: window.LabLinks.batteryResistor(9, 1000), label: 'Open in Falstad' },
      },
    ],
  },

  // ------------------------------------------------------------------ 1.3
  'm1-3': {
    minutes: 15,
    intro: 'Why do resistors get hot? Why does your phone charger get warm? Why did my lab coat catch fire that one time? Answer: <b>POWER.</b> 🔥',
    summary: 'Power (watts, W) is how fast energy is used: P = V × I. Combined with Ohm’s law: P = I² × R = V² ÷ R. In a resistor, all of it becomes heat. Small resistors are usually rated ¼ W (0.25 W); go over and they overheat and release the “magic smoke”. Example: 9 V across 100 Ω = 90 mA and 0.81 W, far too much for ¼ W; 5 V across 220 Ω = about 0.11 W, fine. Battery capacity is in mAh: a 9V battery holds about 500 mAh, so 20 mA lasts roughly 25 hours.',
    sections: [
      {
        title: 'Power = push × flow',
        html: `
          <p><b>Power</b> is how fast electrical energy gets turned into something else: light, motion, sound… or heat. It’s measured in <b>watts (W)</b>.</p>
          <p class="funfact" style="font-size:1.3rem;text-align:center"><b>P = V × I</b></p>
          <p>Back to water: a high-pressure jet with lots of flow can spin a big water wheel. Lots of push × lots of flow = lots of power.</p>
          <p><b>Example:</b> your LED circuit runs at 5 V and about 15 mA: P = 5 × 0.015 = <b>0.075 W = 75 mW</b>. Tiny. A phone charger is about 10–20 W. A kettle is about 2000 W!</p>`,
      },
      {
        title: 'Two bonus formulas (thanks, Ohm)',
        html: `
          <p>Mix P = V × I with Ohm’s law and you get two shortcuts, handy when you only know two things:</p>
          <ul>
            <li><b>P = I² × R</b> (know the current and the resistance)</li>
            <li><b>P = V² ÷ R</b> (know the voltage and the resistance)</li>
          </ul>
          <p>In a resistor, <b>all</b> of that power turns into heat. That’s literally how electric heaters and toasters work: big resistors on purpose.</p>`,
      },
      {
        type: 'widget',
        widget: 'power',
        title: '🌡️ Cook a resistor (safely, on screen)',
        html: '<p>Turn up the voltage, or pick a smaller resistor, and watch what happens to a normal ¼ W resistor.</p>',
      },
      {
        title: 'Power ratings: every part has a limit',
        html: `
          <p>The little resistors in your kit are almost certainly <b>¼ W</b> (0.25 W). That’s the most heat they can get rid of without overheating. Good habit: stay under <b>half</b> the rating.</p>
          <ul>
            <li>5 V across 220 Ω → P = 25 ÷ 220 ≈ <b>0.11 W</b> ✅ comfy</li>
            <li>9 V across 100 Ω → P = 81 ÷ 100 = <b>0.81 W</b> 🔥 more than 3× the rating!</li>
          </ul>
          <p>LEDs, chips, motors and even wires have limits too. Hot parts aren’t “working hard”, they’re <b>struggling</b>.</p>`,
      },
      {
        title: '🔋 How long will my battery last?',
        html: `
          <p>Batteries list their capacity in <b>mAh</b> (milliamp-hours). A typical 9V battery holds about <b>500 mAh</b>: roughly 500 mA for one hour, or 50 mA for ten hours.</p>
          <p>An LED at 20 mA: 500 ÷ 20 ≈ <b>25 hours</b>. A motor drawing 250 mA: about 2 hours. (Real batteries do a bit worse at high currents, but it’s a great estimate.)</p>`,
      },
      {
        type: 'jargon',
        terms: [
          ['Watt (W)', 'Unit of power. 1 W = 1 V × 1 A.'],
          ['Milliwatt (mW)', 'One thousandth of a watt. Your LED circuit uses around 75 mW.'],
          ['Power rating', 'The most power a part can handle without overheating. Small resistors: ¼ W.'],
          ['mAh', 'Battery capacity: how many milliamps it can supply for how many hours.'],
          ['Magic smoke', 'The joke that electronics run on smoke: let it out and they stop working.'],
        ],
      },
      {
        type: 'danger',
        title: '💨 How to release the magic smoke',
        html: `
          <ol>
            <li>Put a ¼ W resistor somewhere it has to burn 1 W.</li>
            <li>Wait a few seconds. Smell that? That’s the paint cooking.</li>
            <li>A little puff of smoke. The resistor turns brown. It now has a different (wrong) value forever.</li>
          </ol>
          <p><b>Why it happens:</b> P = V² ÷ R. Small resistance + big voltage = lots of heat in a tiny part. Always run the numbers before you plug in. It takes five seconds and saves your parts (and your fingertips).</p>`,
      },
    ],
    search: 'electrical power P=VI resistor power rating explained',
    videos: [
      { title: 'How to Calculate Electrical Power | P=VI, P=I²R, and P=V²/R Explained', channel: 'Breeze Physics', url: 'https://www.youtube.com/watch?v=hzsjbPD1f8I', desc: 'All three power formulas, with worked examples.' },
      { title: 'P=VI Explained | Electrical Power | Why P=VI?', channel: 'Electric Simplified', url: 'https://www.youtube.com/watch?v=rOqd1GvUheQ', desc: 'Why power is voltage times current, explained simply.' },
      { title: 'How to calculate Resistor Wattage', channel: 'Electronic Experiment', url: 'https://www.youtube.com/watch?v=H6U2_yI_kdw', desc: 'How to work out how much power a resistor handles and pick the right size.' },
    ],
    quiz: [
      {
        q: 'Which formula gives power?',
        answer: 2,
        options: [
          { t: 'P = V ÷ I', why: 'That’s actually R (resistance), from Ohm’s law.' },
          { t: 'P = V + I', why: 'You can’t add volts and amps: different kinds of thing. Power multiplies them.' },
          { t: 'P = V × I' },
        ],
        explain: 'Power = voltage × current. In watts.',
      },
      {
        q: 'A circuit runs at 5 V and 20 mA. How much power?',
        answer: 0,
        options: [
          { t: '0.1 W (100 mW)' },
          { t: '100 W', why: 'Forgot to turn 20 mA into 0.02 A. 5 × 0.02 = 0.1 W.' },
          { t: '0.25 W', why: 'That would need 50 mA at 5 V. Here: 5 × 0.02 = 0.1 W.' },
        ],
        explain: 'P = 5 V × 0.02 A = 0.1 W.',
      },
      {
        q: '9 V across a 100 Ω resistor. Is a normal ¼ W resistor OK?',
        answer: 1,
        options: [
          { t: 'Yes, 9 V is a small voltage', why: 'Small voltage, but tiny resistance: P = 81 ÷ 100 = 0.81 W. Over three times the ¼ W rating!' },
          { t: 'No: it’s 0.81 W, way over 0.25 W' },
          { t: 'Yes, resistors don’t have limits', why: 'They do! Every part has a power rating.' },
        ],
        explain: 'P = V² ÷ R = 81 ÷ 100 = 0.81 W. A ¼ W resistor would overheat and smoke.',
      },
      {
        q: 'Both on 5 V: which resistor gets hotter, 100 Ω or 1 kΩ?',
        answer: 0,
        options: [
          { t: '100 Ω' },
          { t: '1 kΩ', why: 'Bigger resistance lets less current through, so less power: 25 ÷ 1000 = 0.025 W vs 25 ÷ 100 = 0.25 W.' },
          { t: 'Both the same', why: 'P = V² ÷ R, and R is different, so the power is different.' },
        ],
        explain: 'P = V² ÷ R: the smaller resistor lets 10× more current through and gets 10× more power.',
      },
      {
        q: 'Why does a short circuit get hot so fast?',
        answer: 2,
        options: [
          { t: 'The battery is angry', why: 'Batteries have no feelings. (As far as we know.)' },
          { t: 'Because voltage turns into heat directly', why: 'It’s the huge current that does it: power = V × I, and I is enormous.' },
          { t: 'Almost zero resistance → huge current → lots of power turned into heat' },
        ],
        explain: 'A short means R ≈ 0, so the current is huge, and P = V × I becomes big, all as heat.',
      },
    ],
    challenges: [
      {
        type: 'sim',
        title: 'Find the hot resistor (Falstad)',
        why: 'Falstad shows the power in each part. Let’s cook one virtually instead of for real.',
        steps: [
          'Open the simulator: a 9 V battery and a <b>100 Ω</b> resistor.',
          'Hover over the resistor and read <b>P =</b> in the bottom-right corner. Over 250 mW means a ¼ W resistor would smoke!',
          'Double-click the resistor and try <b>220</b>, <b>470</b> and <b>1000</b>. Which is the smallest value that stays under 125 mW (half the rating)?',
        ],
        link: { url: window.LabLinks.batteryResistor(9, 100), label: 'Open in Falstad' },
      },
      {
        type: 'build',
        title: 'Power detective',
        why: 'Use your meter to measure where the power in your LED circuit actually goes.',
        parts: ['LED circuit (220 Ω)', 'multimeter', 'calculator (or the Ohm’s law tool)'],
        steps: [
          'With the LED on, measure the voltage across the resistor (V⎓). Example: 3.0 V.',
          'Current = that voltage ÷ 220 (from last lesson). Example: 13.6 mA.',
          'Resistor power = voltage × current: 3.0 × 0.0136 ≈ <b>0.041 W</b>. Way under ¼ W? ✅',
          'Measure the voltage across the LED (about 2 V). LED power = 2.0 × 0.0136 ≈ <b>0.027 W</b>.',
          'Bonus: if this ran from a 500 mAh battery at 13.6 mA, how many hours would it last? (About 36.)',
        ],
      },
    ],
  },
});
