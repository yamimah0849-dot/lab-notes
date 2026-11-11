/* The course map: every module and lesson, in order.
   A lesson only becomes playable once its content exists in a data/module-N.js file.
   "phase" = the build phase when that module's lessons get written. */
window.LabNotesCourse = {
  kit: [
    'Arduino Uno', 'breadboard', 'jumper wires', 'USB cable', '16x2 LCD (raw pins, no I2C)',
    'active buzzer', 'passive buzzer', 'water sensor', 'small DC motor', 'SG90 servo',
    '3-lead EMG muscle sensor module', '9V batteries', 'multimeter', 'soldering iron',
    'resistors', 'LEDs', 'capacitors', 'diodes', 'transistors', '(no potentiometer)',
  ],
  modules: [
    {
      id: 0, title: 'Safety & Tools', icon: '🥽', color: '#b6ff3b', phase: 3,
      blurb: 'Breadboards, multimeters and soldering, without becoming a cautionary tale.',
      lessons: [
        { id: 'm0-1', title: 'Lab Safety 101' },
        { id: 'm0-2', title: 'Meet the Breadboard' },
        { id: 'm0-3', title: 'The Multimeter: Your Lab Lie Detector' },
        { id: 'm0-4', title: 'Soldering Without Tears' },
      ],
    },
    {
      id: 1, title: 'Electricity Basics', icon: '⚡', color: '#ffd23f', phase: 3,
      blurb: 'Voltage, current, resistance, Ohm’s law and power: the rules every circuit obeys.',
      lessons: [
        { id: 'm1-1', title: 'Voltage, Current & Resistance' },
        { id: 'm1-2', title: 'Ohm’s Law: V = I × R' },
        { id: 'm1-3', title: 'Power: Why Things Get Hot' },
      ],
    },
    {
      id: 2, title: 'Passive Parts', icon: '🔋', color: '#22e6ff', phase: 4,
      blurb: 'Resistors, capacitors and inductors: the quiet heroes of every circuit.',
      lessons: [
        { id: 'm2-1', title: 'Resistors: Color Codes, Series & Parallel' },
        { id: 'm2-2', title: 'Capacitors: Tiny Rechargeable Buckets' },
        { id: 'm2-3', title: 'Inductors: The Current’s Flywheel' },
      ],
    },
    {
      id: 3, title: 'Semiconductors', icon: '💡', color: '#ff3ea5', phase: 4,
      blurb: 'Diodes, LEDs and transistors: parts that make decisions.',
      lessons: [
        { id: 'm3-1', title: 'Diodes: One-Way Streets' },
        { id: 'm3-2', title: 'LEDs: Diodes That Glow' },
        { id: 'm3-3', title: 'Transistors: Tiny Switches' },
      ],
    },
    {
      id: 4, title: 'Arduino Basics', icon: '🤖', color: '#9b5cff', phase: 5,
      blurb: 'Pins, sensors, the serial monitor, sound, screens and motion.',
      lessons: [
        { id: 'm4-1', title: 'Meet the Uno: Digital Pins' },
        { id: 'm4-2', title: 'Analog Pins: Reading Sensors' },
        { id: 'm4-3', title: 'The Serial Monitor: Let It Talk' },
        { id: 'm4-4', title: 'Buzzers, the LCD & Motors' },
      ],
    },
    {
      id: 5, title: 'Sensors & Signals', icon: '📡', color: '#ff8a3d', phase: 6,
      blurb: 'What a signal really is, where noise comes from, and how to clean it up.',
      lessons: [
        { id: 'm5-1', title: 'What Is a Signal?' },
        { id: 'm5-2', title: 'Noise & Filtering' },
        { id: 'm5-3', title: 'Amplification' },
      ],
    },
    {
      id: 6, title: 'Op-Amps', icon: '🔺', color: '#6ff7e0', phase: 6,
      blurb: 'The tiny triangle that amplifies, filters and compares.',
      lessons: [
        { id: 'm6-1', title: 'Op-Amp Golden Rules' },
        { id: 'm6-2', title: 'Amplifier Circuits' },
        { id: 'm6-3', title: 'Filters & Instrumentation Amps' },
      ],
    },
    {
      id: 7, title: 'FINAL BOSS: Muscle Power', icon: '💪', color: '#ff4d6d', phase: 7, boss: true,
      blurb: 'Read your own muscle signal with an EMG sensor and make the screen react.',
      lessons: [
        { id: 'm7-1', title: 'How Muscles Make Electricity' },
        { id: 'm7-2', title: 'Inside the EMG Module' },
        { id: 'm7-3', title: 'Build It Safely' },
        { id: 'm7-4', title: 'The Muscle Meter' },
      ],
    },
  ],
};
