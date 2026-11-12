/* Module 4: Arduino Basics. Lesson content. */
window.LabNotesLessons = window.LabNotesLessons || {};

(function () {
  const WOKWI = 'https://wokwi.com/projects/new/arduino-uno';

  Object.assign(window.LabNotesLessons, {
    // ------------------------------------------------------------------ 4.1
    'm4-1': {
      minutes: 20,
      intro: 'Behold: the <b>Arduino Uno</b>! A tiny computer that follows your orders, forever, without complaining. (Unlike me before coffee.) Today you’ll make it blink. 🤖',
      summary: 'The Arduino Uno is a microcontroller board: a tiny computer that runs one program (a sketch) in a loop. Install the free Arduino IDE from arduino.cc, choose Tools → Board → Arduino Uno and the right Port, then Upload. A sketch has setup() (runs once) and loop() (repeats forever). pinMode(pin, OUTPUT) sets a pin as an output; digitalWrite(pin, HIGH/LOW) makes it 5 V or 0 V; delay(ms) waits. Pin 13 has a built-in LED. A pin can give about 20 mA, so LEDs need a resistor and motors need a transistor. Pins 0 and 1 are used by USB.',
      sections: [
        {
          title: 'Meet your tiny computer',
          html: `
            <p>The <b>Arduino Uno</b> is a small board with a <b>microcontroller</b> chip on it: a tiny computer that runs <b>one program</b>, over and over, as long as it has power. It can:</p>
            <ul>
              <li><b>read</b> things (buttons, sensors, your muscles…) through its input pins, and</li>
              <li><b>control</b> things (LEDs, buzzers, screens, motors…) through its output pins.</li>
            </ul>
            <p>An Arduino program is called a <b>sketch</b>. You write it on your laptop in the free <b>Arduino IDE</b> and send it to the board over USB (that’s called <b>uploading</b>).</p>`,
        },
        {
          type: 'widget',
          widget: 'uno',
          title: '🗺️ Pin map',
          html: '<p>Tap the pins (and the USB port, power jack and chip) to learn what each part does.</p>',
        },
        {
          title: 'Install the Arduino IDE (free)',
          html: `
            <ol>
              <li>Go to <a href="https://www.arduino.cc/en/software" target="_blank" rel="noopener">arduino.cc/en/software</a> and download <b>Arduino IDE 2</b> for Windows. It’s free (you can skip the donation by choosing “Just download”).</li>
              <li>Install it with the normal settings. Say yes if Windows asks to install drivers.</li>
              <li>Plug in your Uno with the USB cable. A green power light comes on.</li>
              <li>In the IDE: <b>Tools → Board → Arduino Uno</b>, then <b>Tools → Port →</b> the one that says Arduino Uno (something like COM3).</li>
            </ol>
            <p class="funfact">🔌 <b>No port showing up?</b> Many kits use a “clone” Uno with a <b>CH340</b> USB chip, which needs its own driver. Search for “CH340 driver Windows” on the chip maker’s site (WCH), install it, and replug the board.</p>`,
        },
        {
          title: 'The shape of every sketch',
          html: `
            <ul>
              <li><code>void setup() { … }</code> runs <b>once</b>, when the board starts. Put your “get ready” stuff here.</li>
              <li><code>void loop() { … }</code> runs <b>forever</b>: top to bottom, then again, and again…</li>
              <li>Each instruction ends with a <b>;</b> (semicolon). Forgetting one is everyone’s first error. 😅</li>
              <li>Anything after <code>//</code> is a <b>comment</b>: notes for humans, ignored by the Arduino.</li>
            </ul>`,
        },
        {
          type: 'code',
          title: '💡 Your first sketch: Blink',
          html: '<p>This blinks the tiny LED marked <b>L</b> on the board (it’s wired to pin 13). Copy it into the IDE, then click the <b>→ Upload</b> arrow.</p>',
          code: `// Blink: the "Hello, world!" of electronics
void setup() {
  pinMode(LED_BUILTIN, OUTPUT);    // pin 13 has a tiny LED on the board
}

void loop() {
  digitalWrite(LED_BUILTIN, HIGH); // LED on (5 V)
  delay(500);                      // wait 500 ms = half a second
  digitalWrite(LED_BUILTIN, LOW);  // LED off (0 V)
  delay(500);                      // wait again, then loop() starts over
}`,
        },
        {
          title: 'Digital means two choices',
          html: `
            <p>A digital pin is either <b>HIGH</b> (5 V) or <b>LOW</b> (0 V). Nothing in between. That’s perfect for LEDs, buzzers and switching transistors.</p>
            <p>Remember your Ohm’s law: a pin can safely give about <b>20 mA</b>. So an LED on a pin always gets its resistor (220 Ω), and anything hungry, like a motor, gets a transistor.</p>`,
        },
        {
          type: 'jargon',
          terms: [
            ['Microcontroller', 'A tiny computer on one chip that runs a single program.'],
            ['Sketch', 'An Arduino program.'],
            ['IDE', 'The app where you write and upload sketches (Integrated Development Environment).'],
            ['Upload', 'Sending your sketch from the laptop to the board over USB.'],
            ['HIGH / LOW', '5 V / 0 V on a digital pin.'],
            ['Function', 'A named chunk of instructions, like setup(), loop() or digitalWrite().'],
          ],
        },
        {
          type: 'danger',
          title: '🔥 How to fry an Arduino pin',
          html: `
            <ol>
              <li>Set a pin as OUTPUT and HIGH.</li>
              <li>Connect it straight to GND with a wire. (Short circuit!)</li>
              <li>Or connect a motor straight to it.</li>
              <li>That pin is now permanently confused. Or dead.</li>
            </ol>
            <p><b>Why it happens:</b> the pin tries to supply way more than its ~20 mA limit and overheats inside the chip. Resistors for LEDs, transistors for motors, no wires from outputs straight to GND.</p>`,
        },
      ],
      search: 'Arduino Uno blink tutorial for beginners',
      videos: [
        { title: 'Arduino Getting Started: Your first sketch', channel: 'Tech Explorations', url: 'https://www.youtube.com/watch?v=gEwMEvUPAco', desc: 'Writing and uploading your first sketch, step by step.' },
        { title: 'How to Install Arduino IDE on Windows + First Sketch', channel: 'ProgrammingKnowledge', url: 'https://www.youtube.com/watch?v=DHLkyqHCpG4', desc: 'Installing the IDE on Windows and getting the board talking to your laptop.' },
        { title: 'Arduino Getting Started: Digital output and blinking LED', channel: 'Tech Explorations', url: 'https://www.youtube.com/watch?v=jM-N-OsVhGU', desc: 'Digital outputs explained with an external LED.' },
      ],
      quiz: [
        {
          q: 'What’s the difference between <code>setup()</code> and <code>loop()</code>?',
          answer: 0,
          options: [
            { t: 'setup() runs once at the start; loop() repeats forever' },
            { t: 'setup() repeats forever; loop() runs once', why: 'Other way round! setup = get ready once, loop = do it again and again.' },
            { t: 'They both run once', why: 'Then your LED would blink a single time and stop. loop() keeps going.' },
          ],
          explain: 'setup() is the “get ready” part. loop() is the “keep doing this” part.',
        },
        {
          q: '<code>digitalWrite(9, HIGH);</code> makes pin 9…',
          answer: 2,
          options: [
            { t: '0 V', why: 'That’s LOW.' },
            { t: '9 V', why: 'The 9 is the pin number, not volts!' },
            { t: '5 V' },
          ],
          explain: 'HIGH = 5 V on an Uno. The first number is just which pin.',
        },
        {
          q: 'How long does <code>delay(1000);</code> wait?',
          answer: 1,
          options: [
            { t: '1000 seconds', why: 'delay() counts in milliseconds. 1000 ms = 1 s.' },
            { t: '1 second' },
            { t: '1 millisecond', why: 'That would be delay(1).' },
          ],
          explain: 'delay() uses milliseconds: 1000 ms = 1 second.',
        },
        {
          q: 'Why does an LED on an Arduino pin need a resistor?',
          answer: 0,
          options: [
            { t: 'To keep the current under what the LED and pin can handle (about 20 mA)' },
            { t: 'To make the code run', why: 'The code doesn’t care. The resistor protects the hardware.' },
            { t: 'It doesn’t need one, the Arduino limits current', why: 'The pin does NOT limit current safely. The resistor does.' },
          ],
          explain: 'Ohm’s law strikes again: the resistor limits the current to a safe level.',
        },
        {
          q: 'Which pin has the built-in LED on an Uno?',
          answer: 2,
          options: [
            { t: 'Pin 0', why: 'Pins 0 and 1 are used for talking over USB.' },
            { t: 'A0', why: 'That’s an analog input.' },
            { t: 'Pin 13' },
          ],
          explain: 'Pin 13, also called LED_BUILTIN in code.',
        },
      ],
      challenges: [
        {
          type: 'sim',
          title: 'Blink in your browser (Wokwi)',
          why: 'Wokwi is a free online Arduino simulator. No account needed to run code, and no hardware to break.',
          steps: [
            'Open Wokwi with the button below. It makes a new Arduino Uno project.',
            'Delete the code on the left and paste in the Blink sketch from this lesson.',
            'Press the green ▶ play button. The little LED on the virtual board blinks!',
            'Change both <code>delay(500)</code> to <code>delay(100)</code> and run again. Panic blink! 😱',
          ],
          link: { url: WOKWI, label: 'Open Wokwi (Arduino Uno)' },
        },
        {
          type: 'build',
          title: 'Your first real blink + SOS',
          why: 'Upload to the real board, then drive an external LED and make it signal for help.',
          parts: ['Arduino Uno + USB', 'breadboard', 'LED', '220 Ω resistor', '2 jumper wires'],
          steps: [
            'Install the IDE, pick the board and port, and upload Blink. Is the “L” LED blinking? You’re a programmer now. 🎉',
            'USB out. On the breadboard: Arduino <b>pin 9</b> → LED long leg. LED short leg → 220 Ω → Arduino <b>GND</b>.',
            'In the code, replace every <code>LED_BUILTIN</code> with <code>9</code>. Upload. Your LED blinks!',
            'Now make it blink <b>SOS</b> in Morse code: 3 short (200 ms on), 3 long (600 ms on), 3 short, then a 2-second pause. Hint: copy-paste the on/off/delay lines and change the numbers.',
          ],
          troubleshoot: [
            '<b>Upload error “port not found”?</b> Check Tools → Port, try another USB port, or install the CH340 driver.',
            '<b>“expected ; before…”?</b> A missing semicolon on the line before the error.',
            '<b>LED not lighting?</b> LED backwards, or wired to the wrong pin number.',
          ],
        },
      ],
    },

    // ------------------------------------------------------------------ 4.2
    'm4-2': {
      minutes: 20,
      intro: 'Digital pins only know ON and OFF. Boring! Today we go <b>analog</b>: reading how much, not just yes/no. Your water sensor is about to become a water <i>level</i> sensor. 💧',
      summary: 'Analog pins A0–A5 measure 0–5 V and turn it into a number 0–1023 with analogRead() (a 10-bit ADC, about 4.9 mV per step); 2.5 V reads about 512. The water sensor (+ to 5 V or a digital pin, − to GND, S to A0) reads higher the more it is wetted; power it only while reading to slow corrosion. PWM pins (~3, 5, 6, 9, 10, 11) fake in-between outputs with analogWrite(pin, 0–255): the pin flicks on and off quickly and the duty cycle sets the average. map() converts ranges. Never put more than 5 V on an analog pin.',
      sections: [
        {
          title: 'Analog: how much, not just yes/no',
          html: `
            <p>The six <b>analog pins</b> (A0–A5) can <b>measure</b> a voltage between 0 and 5 V. Inside, a part called the <b>ADC</b> (analog-to-digital converter) turns that voltage into a number:</p>
            <ul>
              <li>0 V → <b>0</b></li>
              <li>2.5 V → about <b>512</b></li>
              <li>5 V → <b>1023</b></li>
            </ul>
            <p>In code it’s one line: <code>int value = analogRead(A0);</code></p>`,
        },
        {
          type: 'widget',
          widget: 'adc',
          title: '🎚️ What the Arduino sees',
          html: '<p>Slide the voltage and watch the number the Arduino would read.</p>',
        },
        {
          title: 'Your water sensor',
          html: `
            <p>Your water sensor has long metal stripes (traces) printed on it. Water conducts a little bit, so the more stripes are under water, the more current can flow between them, and the higher the voltage on its <b>S</b> (signal) pin.</p>
            <ul>
              <li><b>+</b> (or VCC) → 5 V. We’ll use digital <b>pin 7</b> instead, so we can switch it on only when reading.</li>
              <li><b>−</b> (or GND) → GND</li>
              <li><b>S</b> (signal) → <b>A0</b></li>
            </ul>
            <p class="funfact">🧪 <b>Why power it from a pin?</b> Current flowing through water slowly eats the metal (corrosion). Switching the sensor on only for a few milliseconds per reading makes it last much longer.</p>
            <p>⚠️ Only dip the <b>striped part</b> in the water. The top with the parts and pins must stay dry, and keep the Arduino far from the glass.</p>`,
        },
        {
          type: 'code',
          title: '💧 Read the water level',
          html: '<p>This prints the reading twice a second. To see the numbers, open the <b>Serial Monitor</b> (magnifying glass icon, top right) and set it to 9600 baud. (All about that next lesson!)</p>',
          code: `// Water sensor: + on pin 7, signal on A0
const int SENSOR_POWER = 7;
const int SENSOR_PIN = A0;

void setup() {
  pinMode(SENSOR_POWER, OUTPUT);
  digitalWrite(SENSOR_POWER, LOW);    // keep it off between readings (less corrosion)
  Serial.begin(9600);                 // so we can see the numbers on the laptop
}

void loop() {
  digitalWrite(SENSOR_POWER, HIGH);   // switch the sensor on
  delay(10);                          // give it a moment to settle
  int level = analogRead(SENSOR_PIN); // 0 = dry ... bigger = wetter
  digitalWrite(SENSOR_POWER, LOW);    // switch it off again

  Serial.println(level);
  delay(500);
}`,
        },
        {
          title: 'Faking analog output: PWM',
          html: `
            <p>Can a pin output 2.5 V? Not really: digital pins are only 0 or 5 V. But the pins with a <b>~</b> mark can <b>flicker</b> on and off about 490 times a second. On half the time = it acts like half power. That’s <b>PWM</b> (pulse-width modulation), and the “on” share is the <b>duty cycle</b>.</p>
            <p>In code: <code>analogWrite(9, 127);</code> where the number goes from <b>0</b> (always off) to <b>255</b> (always on).</p>`,
        },
        {
          type: 'widget',
          widget: 'pwm',
          title: '〰️ See the flicker',
          html: '<p>Slide the value and watch the square wave and the LED.</p>',
        },
        {
          type: 'code',
          title: '🫁 Breathing LED',
          html: '<p>Wire your LED + 220 Ω to <b>pin 9</b> (a ~ pin) and upload this.</p>',
          code: `// Breathing LED on pin 9 (a PWM pin, marked with ~)
const int LED = 9;

void setup() {
  pinMode(LED, OUTPUT);
}

void loop() {
  for (int b = 0; b <= 255; b++) {   // fade in: b counts 0, 1, 2 ... 255
    analogWrite(LED, b);
    delay(5);
  }
  for (int b = 255; b >= 0; b--) {   // fade out
    analogWrite(LED, b);
    delay(5);
  }
}`,
        },
        {
          title: 'map(): translating between ranges',
          html: '<p>analogRead gives 0–1023, but analogWrite wants 0–255. <code>map()</code> converts for you: <code>int bright = map(level, 0, 1023, 0, 255);</code> Wetter sensor → brighter LED, in one line.</p>',
        },
        {
          type: 'jargon',
          terms: [
            ['Analog', 'A value that can be anything in a range, not just on/off.'],
            ['ADC', 'Analog-to-digital converter: turns a voltage into a number (0–1023 on the Uno).'],
            ['analogRead()', 'Reads the voltage on an analog pin as a number.'],
            ['PWM', 'Fast on/off switching that acts like an in-between output.'],
            ['Duty cycle', 'The share of time a PWM signal is on. 25% = quarter power.'],
            ['map()', 'Converts a number from one range to another.'],
          ],
        },
        {
          type: 'danger',
          title: '⚡ How to fry an analog pin',
          html: `
            <ol>
              <li>Connect your 9V battery straight to A0 “to measure it”.</li>
              <li>The pin only handles 0–5 V. 9 V is way out of bounds.</li>
              <li>The input gets damaged, and it may take the whole chip with it.</li>
            </ol>
            <p><b>Why it matters:</b> never put more than 5 V (or less than 0 V) on any Arduino pin. To measure bigger voltages, shrink them first with a voltage divider. This rule is VERY important for the EMG final boss, whose module can output more than 5 V.</p>`,
        },
      ],
      search: 'Arduino analogRead analogWrite PWM tutorial',
      videos: [
        { title: 'Arduino for beginners. Part 13: analog pins, Pulse Width Modulation', channel: 'logMaker360', url: 'https://www.youtube.com/watch?v=GYkKMFkgw1w', desc: 'analogRead, analogWrite and PWM explained together.' },
        { title: 'Arduino LED Fade Tutorial | PWM Brightness Control with analogWrite()', channel: 'Alvin Pribadi', url: 'https://www.youtube.com/watch?v=tChZZKWKTd8', desc: 'Exactly the breathing-LED project from this lesson, built step by step.' },
        { title: 'Arduino Lesson 7 - Analog Write', channel: 'Benduino', url: 'https://www.youtube.com/watch?v=JwpBn1mPGMc', desc: 'How analogWrite creates “analog-like” outputs with PWM.' },
      ],
      quiz: [
        {
          q: 'What range of numbers does <code>analogRead()</code> give on an Uno?',
          answer: 1,
          options: [
            { t: '0 to 255', why: 'That’s analogWrite’s range. analogRead goes higher.' },
            { t: '0 to 1023' },
            { t: '0 to 5', why: 'It doesn’t return volts directly, but a number from the ADC.' },
          ],
          explain: '0 to 1023: the Uno’s ADC has 1024 steps.',
        },
        {
          q: 'A0 has 2.5 V on it. What does analogRead(A0) return, roughly?',
          answer: 0,
          options: [
            { t: 'About 512' },
            { t: '2.5', why: 'It returns a step number, not volts. 2.5 V is half of 5 V → half of 1023.' },
            { t: '1023', why: 'That would be the full 5 V.' },
          ],
          explain: 'Half the voltage → about half of 1023 ≈ 512.',
        },
        {
          q: 'Which pins can do <code>analogWrite()</code> (PWM)?',
          answer: 2,
          options: [
            { t: 'A0–A5', why: 'Those are analog INPUTS. PWM output lives on certain digital pins.' },
            { t: 'All digital pins', why: 'Only the ones marked with ~.' },
            { t: 'The ones marked ~ (3, 5, 6, 9, 10, 11)' },
          ],
          explain: 'Look for the ~ symbol next to the pin number.',
        },
        {
          q: '<code>analogWrite(9, 127);</code> makes an LED on pin 9…',
          answer: 1,
          options: [
            { t: 'Get 127 volts', why: 'Oh no! It’s a 0–255 scale of “on time”, never more than 5 V.' },
            { t: 'Flicker on about half the time, so it looks about half as bright' },
            { t: 'Blink once every 127 ms', why: 'The flicker is far faster than that (about 490 times per second).' },
          ],
          explain: '127 out of 255 ≈ 50% duty cycle → about half brightness.',
        },
        {
          q: 'Why power the water sensor only when reading it?',
          answer: 0,
          options: [
            { t: 'To slow down corrosion of its metal stripes' },
            { t: 'Because it uses lots of power', why: 'It uses very little. The problem is the metal slowly dissolving in water.' },
            { t: 'Analog pins can only read once', why: 'You can read them as often as you like.' },
          ],
          explain: 'Current through water slowly eats the stripes. Less on-time = longer life.',
        },
      ],
      challenges: [
        {
          type: 'build',
          title: 'Water level alarm',
          why: 'Your first real sensor project: read the world, react to it.',
          parts: ['Arduino + USB', 'water sensor', 'jumper wires', 'a glass of water (far from the Arduino!)'],
          steps: [
            'Wire the sensor: <b>+</b> → pin 7, <b>−</b> → GND, <b>S</b> → A0.',
            'Upload the water sensor sketch. Open the Serial Monitor at 9600 baud. Dry reading: near 0.',
            'Slowly dip the striped end into the water. Watch the number climb! Write down the readings at a quarter, half and fully dipped.',
            'Make it an alarm: in <code>setup()</code> add <code>pinMode(LED_BUILTIN, OUTPUT);</code>',
            'In <code>loop()</code>, after reading, add: <code>if (level > 300) { digitalWrite(LED_BUILTIN, HIGH); } else { digitalWrite(LED_BUILTIN, LOW); }</code> (use a number between your dry and half-wet readings).',
            'Upload. The “L” LED now lights when the water is high. 🚨 Dry the sensor when you’re done.',
          ],
        },
        {
          type: 'sim',
          title: 'Fade an LED in Tinkercad',
          why: 'Tinkercad has ready-made Arduino starter circuits. One of them is exactly this lesson.',
          steps: [
            'In Tinkercad Circuits, create a new circuit.',
            'In the parts panel on the right, change the “Basic” menu to <b>Starters → Arduino</b>.',
            'Drag in the <b>Fade</b> starter. It comes with the LED, the resistor and the code.',
            'Click <b>Start Simulation</b>. Then open <b>Code</b> and change the fade speed.',
          ],
          link: { url: 'https://www.tinkercad.com/circuits', label: 'Open Tinkercad Circuits' },
        },
      ],
    },

    // ------------------------------------------------------------------ 4.3
    'm4-3': {
      minutes: 15,
      intro: 'Your Arduino can TALK! 🗣️ Through the USB cable it can send messages to your laptop, draw live graphs, and even take orders from you. This is also your #1 debugging superpower.',
      summary: 'Serial communication sends text over USB. Serial.begin(9600) starts it at 9600 baud; Serial.print() sends text, Serial.println() sends text and a new line. The Serial Monitor shows messages and the Serial Plotter draws numbers (one per line, or several separated by commas) as live graphs. The monitor’s baud rate must match the sketch or you get gibberish. Serial.available() and Serial.read() let the Arduino receive commands. Pins 0 and 1 are used by serial, so leave them free. Printing variables is the main way to debug.',
      sections: [
        {
          title: 'Serial: the Arduino’s chat window',
          html: `
            <p>The USB cable isn’t just for power and uploading. It can carry <b>messages</b> both ways, one bit at a time. That’s called <b>serial</b> communication.</p>
            <ul>
              <li><code>Serial.begin(9600);</code> in setup() starts the chat at a speed of 9600 bits per second (<b>baud</b>).</li>
              <li><code>Serial.print("hi");</code> sends text.</li>
              <li><code>Serial.println(x);</code> sends text (or a number) and then starts a <b>new line</b>.</li>
            </ul>
            <p>On the laptop, open the <b>Serial Monitor</b> (the magnifying glass icon at the top right of the IDE) to read the messages.</p>`,
        },
        {
          type: 'code',
          title: '👋 Hello from the lab',
          code: `void setup() {
  Serial.begin(9600);                      // start talking at 9600 baud
  Serial.println("Lab online! Dr. Ohmi says hi.");
}

int count = 0;                             // a variable: a box that holds a number

void loop() {
  Serial.print("Seconds since start: ");
  Serial.println(count);
  count = count + 1;
  delay(1000);
}`,
        },
        {
          type: 'widget',
          widget: 'baud',
          title: '🤪 Why the speeds must match',
          html: '<p>Both sides have to agree on the speed. Try a mismatch:</p>',
        },
        {
          title: 'Free graphs: the Serial Plotter',
          html: `
            <p>Print just <b>numbers</b>, one per line, and open <b>Tools → Serial Plotter</b>: you get a live, scrolling graph. Print several numbers separated by commas (then println) and you get several lines.</p>
            <p>This is exactly how you’ll first see your <b>muscle signal</b> in the final boss!</p>`,
        },
        {
          type: 'code',
          title: '📈 Plot your water sensor',
          code: `const int SENSOR_POWER = 7;

void setup() {
  pinMode(SENSOR_POWER, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  digitalWrite(SENSOR_POWER, HIGH);
  delay(10);
  int level = analogRead(A0);
  digitalWrite(SENSOR_POWER, LOW);

  Serial.print(level);        // line 1: the reading
  Serial.print(",");
  Serial.println(300);        // line 2: a flat "alarm level" line to compare against
  delay(50);
}`,
        },
        {
          title: 'Talking back: give your Arduino orders',
          html: '<p>The Arduino can also <b>receive</b>. <code>Serial.available()</code> tells you if a message arrived, and <code>Serial.read()</code> reads one character. Type in the box at the top of the Serial Monitor and press Enter.</p>',
        },
        {
          type: 'code',
          title: '🎮 LED remote control',
          code: `void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
  Serial.begin(9600);
  Serial.println("Type 1 for ON, 0 for OFF");
}

void loop() {
  if (Serial.available() > 0) {       // did a message arrive?
    char c = Serial.read();           // read one character
    if (c == '1') {
      digitalWrite(LED_BUILTIN, HIGH);
      Serial.println("LED ON");
    }
    if (c == '0') {
      digitalWrite(LED_BUILTIN, LOW);
      Serial.println("LED OFF");
    }
  }
}`,
        },
        {
          type: 'tip',
          title: '🐞 Debugging superpower',
          html: '<p>When a sketch misbehaves, <b>print things</b>. Print the sensor value, print “got here!”, print the variable you’re suspicious of. Most bugs reveal themselves the moment you can see the numbers.</p>',
        },
        {
          type: 'jargon',
          terms: [
            ['Serial', 'Sending data one bit after another over a wire (here, USB).'],
            ['Baud rate', 'The speed of serial data, in bits per second. Both sides must match.'],
            ['Serial Monitor', 'The IDE window that shows (and sends) serial text.'],
            ['Serial Plotter', 'The IDE window that turns printed numbers into live graphs.'],
            ['Variable', 'A named box that holds a value, like int count = 0;'],
            ['Debugging', 'Finding and fixing mistakes in a program.'],
          ],
        },
        {
          type: 'danger',
          title: '🙈 How to make uploads mysteriously fail',
          html: `
            <ol>
              <li>Connect a sensor or LED to <b>pin 0 or pin 1</b>.</li>
              <li>Try to upload. “Upload error.” Try the Serial Monitor. Gibberish or silence.</li>
              <li>Spend an hour blaming the cable.</li>
            </ol>
            <p><b>Why it happens:</b> pins 0 (RX) and 1 (TX) carry the USB serial data. Anything connected there interferes. Keep them free, and the mystery never happens.</p>`,
        },
      ],
      search: 'Arduino serial monitor serial plotter tutorial',
      videos: [
        { title: 'Arduino for beginners. Part 2: Serial monitor', channel: 'logMaker360', url: 'https://www.youtube.com/watch?v=JivfCe1Cy8o', desc: 'Setting up Serial.begin and printing your first messages.' },
        { title: 'Using Arduino’s Serial Monitor & Plotter', channel: 'Simply Explained', url: 'https://www.youtube.com/watch?v=mtP86o1gjgM', desc: 'How to use both the monitor and the plotter to debug sketches and graph values.' },
      ],
      quiz: [
        {
          q: 'What does <code>Serial.begin(9600);</code> do?',
          answer: 0,
          options: [
            { t: 'Starts serial communication at 9600 baud' },
            { t: 'Waits 9600 milliseconds', why: 'That would be delay(9600). This sets the chat speed.' },
            { t: 'Prints the number 9600', why: 'Printing is Serial.print(). begin() starts the connection.' },
          ],
          explain: 'It opens the serial “chat” at 9600 bits per second.',
        },
        {
          q: 'What’s the difference between <code>print</code> and <code>println</code>?',
          answer: 2,
          options: [
            { t: 'println is louder', why: 'Ha. They’re the same volume: the difference is the new line.' },
            { t: 'print only works with numbers', why: 'Both print text and numbers.' },
            { t: 'println adds a new line at the end' },
          ],
          explain: 'println = print + “go to the next line”.',
        },
        {
          q: 'The Serial Monitor shows random symbols like ÿþ¿§. Most likely cause?',
          answer: 1,
          options: [
            { t: 'The Arduino is broken', why: 'Very unlikely. Gibberish almost always means a speed mismatch.' },
            { t: 'The monitor’s baud rate doesn’t match Serial.begin()' },
            { t: 'The USB cable is too long', why: 'A normal USB cable is fine. Check the baud rate dropdown.' },
          ],
          explain: 'Set the monitor’s dropdown to the same number as in Serial.begin().',
        },
        {
          q: 'What do you print to get a graph in the Serial Plotter?',
          answer: 0,
          options: [
            { t: 'Numbers, one line at a time (commas for several lines)' },
            { t: 'The word “graph”', why: 'The plotter just plots whatever numbers arrive.' },
            { t: 'Nothing, it reads the pins by itself', why: 'It only shows what your sketch prints.' },
          ],
          explain: 'Plain numbers with println, optionally several separated by commas.',
        },
        {
          q: 'Which pins should you keep free while using the Serial Monitor?',
          answer: 2,
          options: [
            { t: 'A0 and A1', why: 'Analog pins are fine to use.' },
            { t: 'Pins 12 and 13', why: 'Those are normal digital pins.' },
            { t: 'Pins 0 and 1' },
          ],
          explain: 'Pins 0 (RX) and 1 (TX) carry the serial data to USB.',
        },
      ],
      challenges: [
        {
          type: 'build',
          title: 'Talk to your Arduino',
          why: 'Two-way conversation with your board. It’s weirdly satisfying.',
          parts: ['Arduino + USB'],
          steps: [
            'Upload “Hello from the lab”. Open the Serial Monitor and set it to <b>9600 baud</b>. Watch the seconds count up.',
            'Set the monitor to 115200 baud. Gibberish! Set it back.',
            'Upload “LED remote control”. Type <b>1</b> and press Enter: the L LED turns on. Type <b>0</b>: off.',
            'Change the code so typing <b>b</b> makes the LED blink 3 times. (Hint: add another if, with a few digitalWrite and delay lines inside.)',
          ],
        },
        {
          type: 'sim',
          title: 'Serial in Wokwi',
          why: 'Wokwi shows a Serial Monitor right under the simulation.',
          steps: [
            'Open a new Wokwi Uno project and paste the “Hello from the lab” sketch.',
            'Press ▶. The Serial Monitor appears below the board with your messages.',
            'Try the LED remote control sketch too: click into the Serial Monitor, type 1 and press Enter.',
          ],
          link: { url: WOKWI, label: 'Open Wokwi (Arduino Uno)' },
        },
      ],
    },

    // ------------------------------------------------------------------ 4.4
    'm4-4': {
      minutes: 30,
      intro: 'Big lesson, big fun: <b>SOUND, SCREEN and MOTION!</b> 🔊📟🌀 By the end, your Arduino will beep a jingle, talk on an LCD and spin things. Grab your whole kit.',
      summary: 'Active buzzers beep by themselves when given 5 V (digitalWrite HIGH); passive buzzers need tone(pin, frequency). The 16x2 LCD in 4-bit mode with the built-in LiquidCrystal library: VSS→GND, VDD→5V, V0→contrast voltage, RS→12, RW→GND, E→11, D4→5, D5→4, D6→3, D7→2, A→220 Ω→5V, K→GND; without a potentiometer, V0 comes from a fixed voltage divider (10 kΩ to 5 V, 1 kΩ to GND ≈ 0.45 V). The SG90 servo turns to an angle 0–180° with the Servo library (brown GND, red 5V, orange signal to pin 9). The DC motor needs an NPN transistor (1 kΩ base resistor from PWM pin 6), a flyback diode across the motor (stripe to +), and analogWrite for speed. Never run a motor straight from a pin.',
      sections: [
        {
          title: '🔊 Sound: active vs passive buzzers',
          html: `
            <p>You have two buzzers that look almost the same:</p>
            <ul>
              <li><b>Active buzzer:</b> has its own tiny beep circuit inside. Give it 5 V and it beeps one fixed note. In code: <code>digitalWrite(8, HIGH);</code></li>
              <li><b>Passive buzzer:</b> just a speaker-like disc. You must wiggle it at a frequency to make a sound, which means you can play <b>any note</b>: <code>tone(8, 440);</code></li>
            </ul>
            <p><b>How to tell them apart:</b> the active one usually has a sealed black bottom (and often a sticker on top); the passive one often shows a green circuit board underneath. Or connect each to 5 V and GND for a second: the active one beeps, the passive one just clicks.</p>
            <p>Wiring: buzzer <b>+</b> (longer leg or marked) → pin 8, the other leg → GND. A 100 Ω resistor in series is a kind extra for the pin (it gets a little quieter).</p>`,
        },
        {
          type: 'widget',
          widget: 'melody',
          title: '🎵 Hear it first',
          html: '<p>This plays the same notes your passive buzzer will. Higher frequency = higher pitch.</p>',
        },
        {
          type: 'code',
          title: '🎶 The Lab Notes jingle (passive buzzer on pin 8)',
          code: `// The Lab Notes jingle on a passive buzzer (pin 8)
const int BUZZER = 8;
int melody[]    = {659, 784, 1047, 988, 784, 880, 698, 880, 784};  // frequencies in Hz
int durations[] = {150, 150, 300, 150, 150, 300, 150, 150, 600};  // lengths in ms

void setup() {
  for (int i = 0; i < 9; i++) {
    tone(BUZZER, melody[i], durations[i]);
    delay(durations[i] * 1.3);        // a tiny gap between notes
  }
  noTone(BUZZER);
}

void loop() {
  // nothing here: the jingle plays once at startup. Press RESET to hear it again!
}`,
        },
        {
          title: '📟 The 16x2 LCD (the raw-pins version)',
          html: `
            <p>Your LCD shows 2 rows of 16 characters. It has 16 pins and uses only 6 Arduino pins in “4-bit mode”. The <b>LiquidCrystal</b> library that drives it comes with the IDE, nothing to install.</p>
            <table class="pin-table">
              <tr><th>LCD pin</th><th>Name</th><th>Connect to</th></tr>
              <tr><td>1</td><td>VSS</td><td>GND</td></tr>
              <tr><td>2</td><td>VDD</td><td>5V</td></tr>
              <tr><td>3</td><td>V0 (contrast)</td><td>middle of the voltage divider (below)</td></tr>
              <tr><td>4</td><td>RS</td><td>pin 12</td></tr>
              <tr><td>5</td><td>RW</td><td>GND</td></tr>
              <tr><td>6</td><td>E</td><td>pin 11</td></tr>
              <tr><td>7–10</td><td>D0–D3</td><td>nothing</td></tr>
              <tr><td>11</td><td>D4</td><td>pin 5</td></tr>
              <tr><td>12</td><td>D5</td><td>pin 4</td></tr>
              <tr><td>13</td><td>D6</td><td>pin 3</td></tr>
              <tr><td>14</td><td>D7</td><td>pin 2</td></tr>
              <tr><td>15</td><td>A (backlight +)</td><td>220 Ω → 5V</td></tr>
              <tr><td>16</td><td>K (backlight −)</td><td>GND</td></tr>
            </table>
            <p><b>Contrast without a potentiometer:</b> remember the voltage divider from Module 2? Put a <b>10 kΩ</b> from the + rail to a free column and a <b>1 kΩ</b> from that column to the − rail. That column sits at about <b>0.45 V</b>: connect it to V0. Text too faint? Use 2.2 kΩ instead of 1 kΩ. Only black boxes? Try V0 straight to GND.</p>
            <p>Most LCDs need <b>header pins soldered on</b> before they fit a breadboard. Your soldering lesson pays off right here!</p>`,
        },
        {
          type: 'widget',
          widget: 'lcd',
          title: '✍️ Design your screen',
          html: '<p>Type up to 16 characters per row, and get the code for it.</p>',
        },
        {
          type: 'code',
          title: '📟 LCD sketch',
          code: `#include <LiquidCrystal.h>
// LiquidCrystal lcd(RS, E, D4, D5, D6, D7);
LiquidCrystal lcd(12, 11, 5, 4, 3, 2);

void setup() {
  lcd.begin(16, 2);              // 16 columns, 2 rows
  lcd.print("LAB NOTES ONLINE"); // starts at column 0, row 0
}

void loop() {
  lcd.setCursor(0, 1);           // column 0, row 1 (the bottom row)
  lcd.print("Uptime: ");
  lcd.print(millis() / 1000);    // seconds since the board started
  lcd.print(" s   ");            // spaces wipe leftover digits
  delay(200);
}`,
        },
        {
          title: '🌀 Motion 1: the SG90 servo',
          html: `
            <p>A <b>servo</b> is a motor with a tiny brain: you tell it an <b>angle</b> (0–180°) and it goes there and holds it. Its three wires:</p>
            <ul>
              <li><b>Brown</b> → GND</li>
              <li><b>Red</b> → 5V</li>
              <li><b>Orange</b> (signal) → pin 9</li>
            </ul>
            <p>Small servos can pull a lot of current when they start moving, which can make the Arduino reset. A 100 µF (or bigger) capacitor across the 5V and GND rails near the servo helps (stripe to GND!).</p>`,
        },
        {
          type: 'code',
          title: '🦾 Servo sweep',
          code: `#include <Servo.h>
Servo arm;                       // our servo is called "arm"

void setup() {
  arm.attach(9);                 // orange wire on pin 9
}

void loop() {
  arm.write(0);   delay(800);    // turn to 0 degrees
  arm.write(90);  delay(800);    // the middle
  arm.write(180); delay(800);    // the other end
}`,
        },
        {
          title: '🌀 Motion 2: the DC motor (the full transistor recipe)',
          html: `
            <p>Time to use everything from Modules 2 and 3 at once! The motor needs far more current than a pin can give, and it kicks back like an inductor, so:</p>
            <ol>
              <li>Motor: one wire to <b>5V</b>, the other to the transistor’s <b>collector</b>.</li>
              <li><b>Flyback diode</b> across the motor’s two wires, <b>stripe toward 5V</b>.</li>
              <li>Transistor <b>emitter</b> → GND.</li>
              <li><b>1 kΩ</b> from Arduino <b>pin 6</b> (a ~ PWM pin) to the transistor’s <b>base</b>.</li>
            </ol>
            <p>Now <code>analogWrite(6, speed)</code> controls the speed!</p>
            <p class="funfact">⚠️ <b>Transistor check:</b> a <b>BC547</b> is only rated for 100 mA, which is too little for most motors (it’ll get hot). PN2222A, 2N2222 or S8050 types are better. If the transistor gets hot to touch, unplug. If the Arduino resets when the motor starts, add a big capacitor across the rails, or power the motor from a separate battery pack that matches the motor’s rated voltage, with the pack’s − joined to Arduino GND.</p>
            <p>Why not pin 9 or 10? The Servo library borrows the timer behind them, so PWM there stops working while a servo is attached. Pin 6 avoids the clash.</p>`,
        },
        {
          type: 'code',
          title: '🏎️ Motor speed test',
          code: `const int MOTOR = 6;   // PWM pin -> 1 kOhm -> transistor base

void setup() {
  pinMode(MOTOR, OUTPUT);
}

void loop() {
  analogWrite(MOTOR, 120);  delay(2000);  // gentle
  analogWrite(MOTOR, 255);  delay(2000);  // full speed
  analogWrite(MOTOR, 0);    delay(2000);  // stop
}`,
        },
        {
          type: 'jargon',
          terms: [
            ['Active buzzer', 'Beeps by itself when powered. One fixed note.'],
            ['Passive buzzer', 'Needs a frequency signal (tone()). Can play any note.'],
            ['Frequency (Hz)', 'Vibrations per second. Higher = higher pitch.'],
            ['Library', 'Ready-made code you include with #include, like LiquidCrystal or Servo.'],
            ['Contrast (V0)', 'The LCD pin that sets how dark the characters are.'],
            ['Servo', 'A motor that moves to an angle you choose.'],
            ['Shared ground', 'When two power sources are used, their − sides must be connected together.'],
          ],
        },
        {
          type: 'danger',
          title: '😵 How to make your Arduino faint',
          html: `
            <ol>
              <li>Connect the DC motor straight between a pin and GND. No transistor.</li>
              <li><code>digitalWrite(6, HIGH);</code></li>
              <li>The motor barely twitches, the pin overheats, and the Arduino may reset or die.</li>
            </ol>
            <p><b>Why it happens:</b> the motor wants hundreds of mA; the pin can give about 20. The transistor is the muscle, the Arduino is the brain. Brains shouldn’t lift heavy things.</p>`,
        },
      ],
      search: 'Arduino 16x2 LCD servo DC motor buzzer tutorial',
      videos: [
        { title: 'How to Set Up and Program an LCD on the Arduino', channel: 'Circuit Basics', url: 'https://www.youtube.com/watch?v=Mr9FQKcrGpA', desc: 'Wiring a 16x2 LCD directly and using every LiquidCrystal function.' },
        { title: 'Arduino Tutorial #6: DC Motors', channel: 'Kevin Briggs', url: 'https://www.youtube.com/watch?v=zPnPCeU6W7E', desc: 'Transistors and diodes powering a DC motor: the same recipe as this lesson.' },
        { title: 'Get Started in Electronics #5 - Active & Passive Buzzers w/ Arduino Uno', channel: 'BV3D: Bryan Vines', url: 'https://www.youtube.com/watch?v=vt9C821Ug20', desc: 'The difference between your two buzzers, with code for both.' },
      ],
      quiz: [
        {
          q: 'Which buzzer needs <code>tone()</code> to make a sound?',
          answer: 1,
          options: [
            { t: 'The active buzzer', why: 'The active one has its own beep circuit: plain HIGH is enough.' },
            { t: 'The passive buzzer' },
            { t: 'Both need tone()', why: 'Only the passive one. The active one just needs power.' },
          ],
          explain: 'Passive buzzers need a frequency from tone(). Active ones beep on their own.',
        },
        {
          q: 'What does the LCD’s V0 pin need?',
          answer: 2,
          options: [
            { t: 'A digital pin set HIGH', why: 'That would give 5 V: the screen would show nothing readable.' },
            { t: 'Nothing, leave it empty', why: 'Floating V0 usually means invisible text.' },
            { t: 'A small voltage (around 0.5–1 V) from a voltage divider' },
          ],
          explain: 'V0 sets the contrast. A divider (10 kΩ + 1 kΩ) gives about 0.45 V.',
        },
        {
          q: 'A servo is told <code>arm.write(90);</code>. What happens?',
          answer: 0,
          options: [
            { t: 'It turns to the 90° position and holds it' },
            { t: 'It spins 90 times', why: 'Servos go to an angle; they don’t spin round and round.' },
            { t: 'It spins at speed 90', why: 'That’s more like a DC motor with PWM. A servo takes angles.' },
          ],
          explain: 'write(angle) moves the servo to that angle (0–180°).',
        },
        {
          q: 'Why can’t you run the DC motor straight from an Arduino pin?',
          answer: 1,
          options: [
            { t: 'Motors only work on 9 V', why: 'Small motors work on 5 V. The problem is current.' },
            { t: 'A pin gives about 20 mA; the motor needs hundreds' },
            { t: 'Motors need AC', why: 'Your DC motor runs on DC. It’s the current that’s too big.' },
          ],
          explain: 'The transistor supplies the motor’s current; the pin only drives the base.',
        },
        {
          q: 'Which way does the flyback diode go across the motor?',
          answer: 0,
          options: [
            { t: 'Stripe toward the 5V side' },
            { t: 'Stripe toward the transistor (ground side)', why: 'That would conduct every time the motor is on: a short circuit!' },
            { t: 'Either way', why: 'Direction matters a lot for diodes. Stripe toward +.' },
          ],
          explain: 'Stripe to +, so it only conducts the kickback spike.',
        },
      ],
      challenges: [
        {
          type: 'build',
          title: 'Lab startup sequence (sound + screen)',
          why: 'Make your Arduino boot up like a proper anime lab computer.',
          parts: ['Arduino + USB', 'breadboard', '16x2 LCD (with header pins soldered)', 'passive buzzer', '10 kΩ, 1 kΩ and 220 Ω resistors', 'lots of jumper wires'],
          steps: [
            'Wire the LCD using the table, including the 10 kΩ + 1 kΩ contrast divider and the 220 Ω backlight resistor. Take your time: it’s the most wires so far!',
            'Upload the LCD sketch. See “LAB NOTES ONLINE”? 🎉 If not, check the troubleshooting list.',
            'Add the passive buzzer: + to pin 8, − to GND.',
            'Combine: copy the jingle’s <code>for</code> loop into the LCD sketch’s <code>setup()</code>, after <code>lcd.print</code>, and add the <code>BUZZER</code>, <code>melody</code> and <code>durations</code> lines above <code>setup()</code>.',
            'Upload. Screen lights up, jingle plays. Your lab has booted. 😎',
          ],
          troubleshoot: [
            '<b>Backlight on but nothing else?</b> Contrast: try 2.2 kΩ instead of 1 kΩ, or V0 straight to GND.',
            '<b>Row of black boxes?</b> The LCD has power but no data: re-check RS, E and D4–D7 wiring and the numbers in <code>LiquidCrystal lcd(...)</code>.',
            '<b>Weird characters?</b> A data wire is loose or swapped.',
          ],
        },
        {
          type: 'build',
          title: 'Motion show (servo + motor)',
          why: 'The transistor recipe from Module 3, for real, plus a servo arm.',
          parts: ['Arduino + USB', 'SG90 servo', 'DC motor', 'NPN transistor (not a BC547 if you can avoid it)', 'diode (e.g. 1N4007)', '1 kΩ resistor', 'big electrolytic capacitor (optional)'],
          steps: [
            'Servo first: brown → GND, red → 5V, orange → pin 9. Upload the servo sweep. Wave hello!',
            'Unplug USB. Build the motor circuit: motor between the + rail and the transistor collector, diode across the motor (stripe to +), emitter to the − rail, 1 kΩ from pin 6 to the base.',
            'Upload the motor speed test. Gentle… FULL SPEED… stop. Touch the transistor: warm is OK, hot means unplug.',
            'Bonus: make the motor speed follow your water sensor! <code>analogWrite(6, map(level, 0, 1023, 0, 255));</code>',
          ],
        },
      ],
    },
  });
})();
