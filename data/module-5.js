/* Module 5: Sensors & Signals. Lesson content. */
window.LabNotesLessons = window.LabNotesLessons || {};

Object.assign(window.LabNotesLessons, {
  // ------------------------------------------------------------------ 5.1
  'm5-1': {
    minutes: 15,
    intro: 'Sensors turn the world into <b>signals</b>: voltages that wiggle with meaning. Learn to read a wiggle and you can read a muscle. 📡',
    summary: 'A signal is information carried by a voltage that changes over time. Key properties: amplitude (how big, often given as peak or peak-to-peak), frequency (cycles per second, in hertz), period (time for one cycle = 1 ÷ frequency; 50 Hz → 20 ms), and offset (the middle/DC level). Sensors convert physical things into voltages. The Arduino samples a signal (reads it many times per second); you need more than 2 samples per cycle of the fastest part (Nyquist), and in practice 5–10 or more, otherwise you get aliasing (fake slow waves). Raw surface EMG lives roughly between 20 and 450 Hz.',
    sections: [
      {
        title: 'What is a signal?',
        html: `
          <p>A <b>signal</b> is information carried by a voltage that changes over time. Your water sensor makes one (more water → more volts). A microphone makes one (sound → wiggly volts). And your muscles make one too: that’s what the final boss is all about.</p>
          <p>Draw voltage against time and you get a <b>waveform</b>. The classic smooth one is the <b>sine wave</b>.</p>`,
      },
      {
        title: 'The four words that describe any wave',
        html: `
          <ul>
            <li><b>Amplitude:</b> how big the wiggle is. Often measured <i>peak-to-peak</i> (from the lowest point to the highest).</li>
            <li><b>Frequency:</b> how many full wiggles happen per second, in <b>hertz (Hz)</b>. 50 Hz = 50 wiggles per second.</li>
            <li><b>Period:</b> how long one wiggle takes. Period = 1 ÷ frequency. 50 Hz → 1/50 s = <b>20 ms</b>.</li>
            <li><b>Offset:</b> the middle level the wave wiggles around. On an Arduino we like signals centered at 2.5 V so they fit between 0 and 5 V.</li>
          </ul>
          <p>Some real frequencies: your heartbeat ≈ <b>1–2 Hz</b>. Mains electricity ≈ <b>50 or 60 Hz</b>. Muscle (EMG) signals ≈ <b>20–450 Hz</b>. Human hearing ≈ <b>20–20 000 Hz</b>.</p>`,
      },
      {
        type: 'widget',
        widget: 'signal',
        title: '〰️ Play with a wave (and sample it)',
        html: '<p>Change the frequency and amplitude. Then lower the Arduino’s sample rate and watch the pink “what the Arduino sees” line fall apart.</p>',
      },
      {
        title: 'Sampling: taking snapshots',
        html: `
          <p>The Arduino can’t watch a voltage continuously. It takes <b>snapshots</b> (samples), one <code>analogRead()</code> at a time, and joins the dots. How many snapshots per second is the <b>sample rate</b>.</p>
          <p>The golden rule (the <b>Nyquist rule</b>): you need <b>more than 2 samples per wave</b> of the fastest thing in your signal, or the dots trace a completely fake, slower wave. That fake is called <b>aliasing</b>. In practice, aim for 5–10× or more.</p>
          <p>A single <code>analogRead()</code> takes about 0.1 ms, so an Uno could take several thousand samples per second. Printing to the Serial Monitor is much slower, which is one reason the final boss uses the EMG module’s already-smoothed output instead of the raw wiggles.</p>`,
      },
      {
        type: 'jargon',
        terms: [
          ['Signal', 'Information carried by a changing voltage.'],
          ['Waveform', 'The shape of a signal drawn over time.'],
          ['Amplitude', 'How big the wiggle is.'],
          ['Frequency (Hz)', 'How many cycles per second.'],
          ['Period', 'How long one cycle takes: 1 ÷ frequency.'],
          ['Sample rate', 'How many readings per second the Arduino takes.'],
          ['Aliasing', 'Fake, slower waves caused by sampling too slowly.'],
        ],
      },
      {
        type: 'danger',
        title: '🐦 How to photograph a hummingbird with a sundial',
        html: `
          <ol>
            <li>Read a 100 Hz signal once every 20 ms (50 samples per second).</li>
            <li>Get a beautiful, smooth, completely fake wave.</li>
            <li>Draw scientific conclusions from it. 🙃</li>
          </ol>
          <p><b>Why it happens:</b> with fewer than 2 samples per wave, each snapshot catches the wave at a slightly different point, and the dots trace a slow pattern that isn’t really there. (It’s the same reason car wheels look like they spin backwards in videos.)</p>`,
      },
    ],
    search: 'frequency amplitude period signals explained',
    videos: [
      { title: 'Sinusoidal Signals Explained | Amplitude, Frequency, Phase', channel: 'SCIENCE_PAP', url: 'https://www.youtube.com/watch?v=ax9ivF92cbE', desc: 'Sine waves and their properties, from the electronics side.' },
      { title: 'Period, Frequency, Amplitude, & Wavelength - Waves', channel: 'The Organic Chemistry Tutor', url: 'https://www.youtube.com/watch?v=ys0mQbJYQjY', desc: 'A clear whiteboard intro to the words used to describe waves.' },
      { title: 'The Spectrum: Representing Signals as a Function of Frequency', channel: 'Barry Van Veen', url: 'https://www.youtube.com/watch?v=xh5pLY3f6H8', desc: 'Next-level idea: any signal is a mix of frequencies. Handy for understanding filters.' },
    ],
    quiz: [
      {
        q: 'What does <b>frequency</b> measure?',
        answer: 1,
        options: [
          { t: 'How big the wave is', why: 'That’s amplitude.' },
          { t: 'How many cycles happen per second' },
          { t: 'The middle level of the wave', why: 'That’s the offset.' },
        ],
        explain: 'Frequency = cycles per second, in hertz (Hz).',
      },
      {
        q: 'What’s the period of a <b>50 Hz</b> wave?',
        answer: 2,
        options: [
          { t: '50 seconds', why: 'Period is 1 ÷ frequency: 1 ÷ 50, not 50.' },
          { t: '2 ms', why: 'That would be 500 Hz.' },
          { t: '20 ms' },
        ],
        explain: '1 ÷ 50 = 0.02 s = 20 ms.',
      },
      {
        q: 'You want to capture a <b>100 Hz</b> signal. Which sample rate is the bare minimum?',
        answer: 0,
        options: [
          { t: 'More than 200 samples per second' },
          { t: '100 samples per second', why: 'That’s only 1 sample per wave: guaranteed aliasing. You need more than 2.' },
          { t: '50 samples per second', why: 'Way too slow: you’d see a fake wave.' },
        ],
        explain: 'Nyquist rule: more than 2× the highest frequency (and 5–10× is better).',
      },
      {
        q: 'Roughly which frequencies do surface muscle (EMG) signals contain?',
        answer: 1,
        options: [
          { t: '1–2 Hz', why: 'That’s heartbeat territory. Muscle fibers fire much faster.' },
          { t: 'About 20–450 Hz' },
          { t: 'About 1 MHz', why: 'Far too fast for muscles. That’s radio territory.' },
        ],
        explain: 'Surface EMG energy is mostly between about 20 and 450 Hz.',
      },
      {
        q: 'Why do we like signals centered on <b>2.5 V</b> for an Arduino?',
        answer: 2,
        options: [
          { t: 'Because 2.5 is a lucky number', why: 'Fun theory! The real reason is room to swing both ways.' },
          { t: 'The Arduino can’t read 0 V', why: 'It reads 0 V just fine. The problem is negative voltages.' },
          { t: 'So the wave can swing up AND down and still stay between 0 and 5 V' },
        ],
        explain: 'Centered at 2.5 V, a wave can swing ±2.5 V without leaving the 0–5 V range.',
      },
    ],
    challenges: [
      {
        type: 'build',
        title: 'Make your own signal',
        why: 'Your hand + water sensor + Serial Plotter = a signal generator.',
        parts: ['Arduino + USB', 'water sensor', 'a glass of water'],
        steps: [
          'Wire the water sensor like in the Analog Pins lesson (+ on pin 7, S on A0, − to GND).',
          'Upload the “Plot your water sensor” sketch from the Serial Monitor lesson and open <b>Tools → Serial Plotter</b>.',
          'Dip the sensor in and out of the water, slowly and steadily. Your plot is a wave!',
          'Now go faster. Higher frequency! Then dip deeper. Bigger amplitude!',
          'Estimate your wave’s frequency: count the peaks in 5 seconds, divide by 5.',
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ 5.2
  'm5-2': {
    minutes: 18,
    intro: 'Every signal has an evil twin: <b>NOISE</b>. 😈 Random fuzz, mysterious buzzes, ghost readings. Today we learn where it comes from, and how to kick it out.',
    summary: 'Noise is any unwanted part of a signal: mains hum at 50 or 60 Hz picked up from wiring (your body acts like an antenna), interference from motors and switching, poor connections and random electronic noise. A floating (unconnected) input reads random values. Filters remove unwanted frequencies: low-pass keeps slow changes, high-pass keeps fast changes and removes drift, band-pass keeps a range, notch removes one frequency. An RC low-pass has cutoff f = 1 ÷ (2πRC); 10 kΩ and 100 nF gives about 159 Hz. In software, a moving average or exponential moving average smooths readings but adds delay. Good habits: short wires, shared ground, keep motors away from sensors, battery power.',
    sections: [
      {
        title: 'Where noise comes from',
        html: `
          <ul>
            <li>⚡ <b>Mains hum:</b> the wiring in your walls buzzes at <b>50 Hz</b> (most of the world) or <b>60 Hz</b> (the Americas). Your body and long wires act like antennas and pick it up.</li>
            <li>🌀 <b>Motors and switching:</b> sparks and sudden currents spray electrical junk around.</li>
            <li>🔌 <b>Wobbly connections:</b> a loose jumper makes crackly, jumpy readings.</li>
            <li>🌡️ <b>Random electronic noise:</b> every resistor and chip adds a tiny bit of fuzz. Usually invisible… unless your signal is tiny, like a muscle’s.</li>
          </ul>
          <p>Muscle signals at the skin are only <b>millivolts</b>, while mains hum picked up by your body can be bigger than that. That’s why EMG circuits are serious about noise.</p>`,
      },
      {
        title: 'Filters: keep what you want, block the rest',
        html: `
          <p>A <b>filter</b> lets some frequencies through and blocks others:</p>
          <ul>
            <li><b>Low-pass:</b> keeps <b>slow</b> changes, blocks fast fuzz.</li>
            <li><b>High-pass:</b> keeps <b>fast</b> changes, blocks slow drift (and steady DC).</li>
            <li><b>Band-pass:</b> keeps a <b>range</b>. EMG uses roughly 20–450 Hz.</li>
            <li><b>Notch:</b> removes <b>one</b> frequency, like 50 Hz hum.</li>
          </ul>
          <p>The simplest hardware filter is one resistor + one capacitor (an <b>RC low-pass</b>). The capacitor can’t charge and discharge fast enough to follow quick wiggles (remember τ = R × C?), so they get smoothed away. The <b>cutoff frequency</b> is:</p>
          <p class="funfact" style="text-align:center"><b>f<sub>c</sub> = 1 ÷ (2π × R × C)</b></p>
          <p>10 kΩ and 100 nF → 1 ÷ (6.28 × 10 000 × 0.000 000 1) ≈ <b>159 Hz</b>.</p>`,
      },
      {
        type: 'widget',
        widget: 'noise',
        title: '🧹 Clean up a noisy signal',
        html: '<p>This is a software filter called a <b>moving average</b>: each point is the average of the last few readings. Add noise and hum, then filter it away.</p>',
      },
      {
        type: 'code',
        title: '📉 Raw vs smoothed (Serial Plotter)',
        html: '<p>This uses an <b>exponential moving average</b>: each new reading only nudges the smooth value by 10%. Smooth, and it only needs one number of memory. Set the Plotter to <b>115200</b> baud for this one.</p>',
        code: `// Raw vs smoothed: watch noise disappear in the Serial Plotter
float smooth = 0;

void setup() {
  Serial.begin(115200);                      // faster, so the plot can keep up
}

void loop() {
  int raw = analogRead(A0);
  smooth = smooth + 0.1 * (raw - smooth);    // 10% new reading, 90% old value
  Serial.print(raw);
  Serial.print(",");
  Serial.println(smooth);
  delay(2);
}`,
      },
      {
        type: 'tip',
        title: '🛡️ Noise-fighting habits',
        html: '<ul><li>Short wires, especially for small signals.</li><li>All grounds connected together (shared ground).</li><li>Keep motors and their wires away from sensors.</li><li>Run sensitive stuff from batteries (the laptop unplugged from the wall helps a lot for EMG).</li><li>Never leave an analog input floating: connect it to something.</li></ul>',
      },
      {
        type: 'jargon',
        terms: [
          ['Noise', 'Any unwanted part of a signal.'],
          ['Mains hum', 'Interference at 50 or 60 Hz from wall wiring.'],
          ['Floating input', 'A pin connected to nothing. It reads random junk.'],
          ['Low-pass / high-pass', 'Filters that keep slow / fast changes.'],
          ['Cutoff frequency', 'Where a filter starts blocking. For RC: 1 ÷ (2πRC).'],
          ['Moving average', 'Smoothing by averaging the last few readings.'],
        ],
      },
      {
        type: 'danger',
        title: '📡 How to become a human antenna',
        html: `
          <ol>
            <li>Upload the raw-vs-smoothed sketch with <b>nothing</b> connected to A0.</li>
            <li>Watch the Plotter: random wandering. That’s a floating input.</li>
            <li>Now touch a jumper wire in A0 with your finger. Big, regular wiggles appear!</li>
            <li>Congratulations, you are picking up the 50/60 Hz from your house wiring. 🎉</li>
          </ol>
          <p><b>Why it happens:</b> your body is a big conductor sitting near live wires, and the Arduino’s input is so sensitive it picks up the tiny voltage you collect. Totally safe, and a perfect demo of why EMG circuits fight hum.</p>`,
      },
    ],
    search: 'RC low pass filter noise explained',
    videos: [
      { title: 'Passive RC low pass filter tutorial!', channel: 'Afrotechmods', url: 'https://www.youtube.com/watch?v=OBM5T5_kgdI', desc: 'How a resistor and capacitor filter out fast signals, with scope demos.' },
      { title: 'Low Pass Filter Explained with Real Circuit Demo!', channel: 'Hacker University', url: 'https://www.youtube.com/watch?v=rB94NnU4pWM', desc: 'A low-pass filter built and measured for real.' },
      { title: 'RC Low Pass Filter Explained', channel: 'ALL ABOUT ELECTRONICS', url: 'https://www.youtube.com/watch?v=_2L0l-E1Wx0', desc: 'The theory behind the cutoff frequency, step by step.' },
    ],
    quiz: [
      {
        q: 'Mains hum is at which frequency?',
        answer: 0,
        options: [
          { t: '50 Hz or 60 Hz, depending on the country' },
          { t: '1 Hz', why: 'Much slower than mains. Wall power flips 50 or 60 times per second.' },
          { t: '20 000 Hz', why: 'That’s the top of human hearing. Mains is 50/60 Hz.' },
        ],
        explain: '50 Hz in most of the world, 60 Hz in the Americas.',
      },
      {
        q: 'A <b>low-pass</b> filter keeps…',
        answer: 1,
        options: [
          { t: 'Fast changes', why: 'That’s high-pass. Low-pass lets LOW frequencies (slow stuff) pass.' },
          { t: 'Slow changes' },
          { t: 'Only 50 Hz', why: 'That’s the opposite of a notch filter, and not what low-pass means.' },
        ],
        explain: 'Low-pass = low frequencies pass. Fast fuzz gets blocked.',
      },
      {
        q: 'An RC low-pass uses 10 kΩ and 100 nF. Roughly what’s the cutoff?',
        answer: 2,
        options: [
          { t: '1 Hz', why: 'Check the math: 1 ÷ (2π × 10 000 × 0.000 000 1) ≈ 159.' },
          { t: '10 000 Hz', why: 'Too high. R × C = 0.001 s, and 1 ÷ (2π × 0.001) ≈ 159 Hz.' },
          { t: 'About 159 Hz' },
        ],
        explain: 'f = 1 ÷ (2π × R × C) = 1 ÷ (6.28 × 0.001) ≈ 159 Hz.',
      },
      {
        q: 'You make a moving average much longer (more readings). What happens?',
        answer: 0,
        options: [
          { t: 'Smoother, but slower to react (changes look late and blurry)' },
          { t: 'Noisier', why: 'Averaging more readings removes more noise, not less.' },
          { t: 'Nothing changes', why: 'Try the slider above: the line gets smoother but lags.' },
        ],
        explain: 'Filtering always trades smoothness for speed.',
      },
      {
        q: 'An analog pin with nothing connected reads…',
        answer: 1,
        options: [
          { t: 'Exactly 0', why: 'It would be nice! But a floating input drifts around randomly.' },
          { t: 'Random wandering values (it picks up noise)' },
          { t: '1023', why: 'Only if something connects it to 5 V.' },
        ],
        explain: 'A floating input is like an antenna: it reads whatever junk it picks up.',
      },
    ],
    challenges: [
      {
        type: 'build',
        title: 'Human antenna + filter',
        why: 'See mains hum with your own finger, then filter it in code.',
        parts: ['Arduino + USB', '1 jumper wire'],
        steps: [
          'Push one end of a jumper into <b>A0</b>; leave the other end free.',
          'Upload the raw-vs-smoothed sketch. Open the <b>Serial Plotter</b> at <b>115200</b> baud.',
          'Pinch the free end of the jumper. Watch the blue raw line go wild with hum, and the smooth line calm it down.',
          'Change <code>0.1</code> to <code>0.02</code> in the code. Smoother? Slower? Then try <code>0.5</code>.',
          'Bonus: run the laptop on battery (charger unplugged). Is the hum smaller?',
        ],
      },
      {
        type: 'sim',
        title: 'Hardware low-pass in Falstad',
        why: 'See an RC filter block high frequencies in real time.',
        steps: [
          'Open Falstad’s RC low-pass filter example (button below).',
          'Watch the input and output on the graphs at the bottom.',
          'Double-click the AC source and raise its frequency. The output shrinks: blocked!',
          'Lower the frequency: the output comes back. That’s low-pass.',
        ],
        link: { url: window.LabLinks.falstadExample('filt-lopass.txt'), label: 'Open in Falstad' },
      },
    ],
  },

  // ------------------------------------------------------------------ 5.3
  'm5-3': {
    minutes: 15,
    intro: 'Muscle signals are TINY. Like, “the Arduino literally can’t see them” tiny. 🔍 Time to <b>amplify</b>: make small signals big without making a mess.',
    summary: 'Amplification makes a small signal bigger: gain = output ÷ input. Surface muscle signals are only around a millivolt, while one Arduino ADC step is about 4.9 mV, so EMG needs a gain of roughly 1000. An amplifier’s output can’t go past its supply rails: push too far and the tops get flattened (clipping). On a 0–5 V system, center the signal at 2.5 V so it can swing both ways. Amplifiers amplify noise too, so filtering and differential amplification matter. Op-amps make amplifiers easy (next module).',
    sections: [
      {
        title: 'Too small to see',
        html: `
          <p>Remember: one step of the Arduino’s ADC is about <b>4.9 mV</b>. A muscle signal measured at the skin is around <b>1 mV</b> or less. To the Arduino, that’s <i>less than one step</i>: invisible.</p>
          <p>An <b>amplifier</b> fixes that. It makes a copy of the signal that’s bigger by a factor called the <b>gain</b>:</p>
          <p class="funfact" style="text-align:center"><b>gain = output ÷ input</b></p>
          <p>1 mV × a gain of 1000 = 1 V. Now the Arduino sees it spread over about 200 steps. 🎉</p>`,
      },
      {
        type: 'widget',
        widget: 'amp',
        mode: 'simple',
        title: '🔊 Turn up the gain',
        html: '<p>Start with a tiny 2 mV signal. Find a gain where the Arduino can see it, then keep going until something bad happens.</p>',
      },
      {
        title: 'The rails: amplifiers have walls',
        html: `
          <p>An amplifier can’t create voltage out of thin air: its output is trapped between its <b>supply rails</b> (here 0 V and 5 V). Ask for more and the wave gets its tops and bottoms chopped flat. That’s <b>clipping</b>, and the information in the chopped part is gone forever.</p>
          <p>That’s also why we center signals at <b>2.5 V</b>: it gives the wave equal room to swing up and down.</p>`,
      },
      {
        title: 'Amplifiers don’t know what’s noise',
        html: `
          <p>An amplifier amplifies <b>everything</b> at its input: your signal <i>and</i> the noise. A gain of 1000 turns 1 mV of hum into 1 V of hum!</p>
          <p>So real EMG circuits are clever about it:</p>
          <ul>
            <li>They use a <b>differential</b> amplifier that amplifies the <b>difference</b> between two electrodes. Hum hits both electrodes equally, so it mostly cancels out. (Module 6!)</li>
            <li>They <b>filter</b> before and after amplifying.</li>
          </ul>`,
      },
      {
        type: 'jargon',
        terms: [
          ['Amplifier', 'A circuit that makes a bigger copy of a signal.'],
          ['Gain', 'How many times bigger: output ÷ input.'],
          ['Supply rails', 'The highest and lowest voltages an amplifier can output.'],
          ['Clipping', 'Flattened tops when the output hits the rails. Information lost.'],
          ['Offset (bias)', 'The middle voltage a signal wiggles around (2.5 V for Arduino).'],
          ['Differential', 'Working on the difference between two inputs.'],
        ],
      },
      {
        type: 'danger',
        title: '📢 How to make a signal SCREAM',
        html: `
          <ol>
            <li>Turn the gain all the way up “to be safe”.</li>
            <li>Your nice wave hits both rails and becomes a square block.</li>
            <li>Every flex looks exactly the same: MAXIMUM. Useless.</li>
          </ol>
          <p><b>Why it happens:</b> once the output is stuck at a rail, bigger inputs can’t make it any bigger. Gain should be <i>just enough</i>. This is exactly why your EMG module has a little <b>gain screw</b>: you’ll tune it in the final boss.</p>`,
      },
    ],
    search: 'amplifier gain clipping explained',
    videos: [
      { title: 'Electronic Circuits - General Amplifier Theory 1 - Gain', channel: 'ElectronX Lab', url: 'https://www.youtube.com/watch?v=zmtgP8bv3J4', desc: 'What gain means for voltage, current and power, from a teaching lab.' },
      { title: 'What is Clipping?? Understanding Amplifier Clipping', channel: 'Sonic Electronix', url: 'https://www.youtube.com/watch?v=9PF32APSjrk', desc: 'What clipping does to a waveform and why it happens (audio examples).' },
      { title: 'How does an Amplifier Work? (Class-A)', channel: 'Explorer', url: 'https://www.youtube.com/watch?v=dKTbrZMscpM', desc: 'How a single transistor can amplify a signal: a link back to Module 3.' },
    ],
    quiz: [
      {
        q: 'An amplifier turns 2 mV into 2 V. What’s its gain?',
        answer: 2,
        options: [
          { t: '2', why: 'Check the units: 2 V is 2000 mV.' },
          { t: '100', why: '2 mV × 100 = 200 mV, not 2 V.' },
          { t: '1000' },
        ],
        explain: 'Gain = 2000 mV ÷ 2 mV = 1000.',
      },
      {
        q: 'Why can’t the Arduino read a raw 1 mV muscle signal?',
        answer: 0,
        options: [
          { t: 'One ADC step is about 4.9 mV, so 1 mV is less than one step' },
          { t: 'Muscles use AC electricity', why: 'The problem is size, not type.' },
          { t: 'The Arduino can only read digital signals', why: 'Analog pins read voltages fine. 1 mV is just too small.' },
        ],
        explain: '5 V ÷ 1024 steps ≈ 4.9 mV per step. 1 mV gets lost.',
      },
      {
        q: 'What is <b>clipping</b>?',
        answer: 1,
        options: [
          { t: 'Cutting wires to the right length', why: 'That’s clipping leads, a different kind of clipping!' },
          { t: 'The output hitting the supply rails, so the tops get chopped flat' },
          { t: 'A filter for noise', why: 'Clipping is distortion, not filtering.' },
        ],
        explain: 'Too much gain → the output can’t go past the rails → flat tops.',
      },
      {
        q: 'Why center the amplified signal at 2.5 V on an Arduino?',
        answer: 2,
        options: [
          { t: 'To make it brighter', why: 'Signals don’t glow! It’s about room to swing.' },
          { t: 'Because the Arduino needs 2.5 V to work', why: 'The Arduino runs at 5 V. 2.5 V is the middle of its input range.' },
          { t: 'So it can swing up and down without hitting 0 V or 5 V' },
        ],
        explain: 'The middle of 0–5 V gives equal room both ways.',
      },
      {
        q: 'Your amplifier has a gain of 1000 and there’s 1 mV of hum at its input. What comes out?',
        answer: 0,
        options: [
          { t: 'About 1 V of hum' },
          { t: 'No hum, amplifiers remove noise', why: 'Amplifiers amplify everything, noise included.' },
          { t: '1 mV of hum', why: 'The hum gets multiplied by the gain too.' },
        ],
        explain: 'Noise gets amplified along with the signal: 1 mV × 1000 = 1 V.',
      },
    ],
    challenges: [
      {
        type: 'sim',
        title: 'Clip an amplifier (Falstad)',
        why: 'See gain and clipping on a real-ish op-amp circuit.',
        steps: [
          'Open Falstad’s non-inverting amplifier (button below).',
          'Look at the graphs: the output is a bigger copy of the input.',
          'Double-click the AC source and increase its amplitude until the output’s tops go flat. That’s clipping!',
          'Bring it back down until the wave is clean again.',
        ],
        link: { url: window.LabLinks.falstadExample('amp-noninvert.txt'), label: 'Open in Falstad' },
      },
    ],
  },
});
