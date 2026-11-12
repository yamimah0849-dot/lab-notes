/* The Muscle Meter: reads numbers from the Arduino over USB (Web Serial, Chrome/Edge on a computer)
   or from a simulated muscle (Demo mode), and turns them into a live graph, a power gauge and a mini-game.
   The Arduino sketch just prints one number (analogRead of the EMG module's SIG, through a divider) per line. */
(function () {
  'use strict';

  const SKETCH = `// Lab Notes - EMG reader for the Muscle Meter
// Wiring: EMG SIG -> 10k -> A0, and A0 -> 10k -> GND (the divider keeps A0 under 5 V)
//         EMG GND -> Arduino GND. Laptop on battery while the pads are on your skin!
const int EMG_PIN = A0;

void setup() {
  Serial.begin(115200);            // the Muscle Meter listens at 115200 baud
}

void loop() {
  int raw = analogRead(EMG_PIN);   // 0 ... 1023
  Serial.println(raw);             // one number per line
  delay(10);                       // about 100 readings per second
}`;

  function esc(s) { return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

  function mount(el, opts) {
    const SFX = window.SFX;
    const hasSerial = 'serial' in navigator;
    const N = 600; // ~6 seconds of history at 100 readings per second
    const st = {
      mode: null, port: null, reader: null, piped: null,
      raw: new Array(N).fill(0), smooth: 0, base: 20, peak: 600,
      beam: 0, cooldown: 0, flexes: 0, above: false, best: 0,
      holding: false, demoEnv: 20, calib: null, band: -1, lastSay: 0, beamXp: false,
    };

    el.innerHTML = `
      <section class="card meter-head">
        <p class="eyebrow">Final boss tool</p>
        <h1 class="title-neon">💪 Muscle Meter</h1>
        <p>Connect your Arduino + EMG sensor and watch your muscle power live. No sensor yet, or on your iPhone? Try <b>Demo mode</b>.</p>
        <div id="meterOhmi" class="side-ohmi"></div>
      </section>

      <section class="card">
        <div class="btn-row">
          <button class="btn btn-primary" type="button" data-act="connect" ${hasSerial ? '' : 'disabled'}>🔌 Connect Arduino</button>
          <button class="btn btn-cyan" type="button" data-act="demo">🎮 Demo mode</button>
          <button class="btn btn-ghost" type="button" data-act="stop" hidden>⏹ Stop</button>
        </div>
        <p class="meter-status" aria-live="polite">${hasSerial
          ? 'Ready. Upload the sketch below, close the Arduino IDE’s Serial Monitor/Plotter (only one app can use the port), then press Connect.'
          : 'This browser can’t talk to USB devices. Web Serial works in <b>Chrome or Edge on a computer</b>. Demo mode works everywhere!'}</p>
        <div class="meter-demo" hidden>
          <button class="btn btn-primary meter-hold" type="button" data-act="hold">💪 HOLD TO FLEX</button>
          <span class="small muted">(or hold the spacebar)</span>
        </div>
      </section>

      <section class="card meter-main">
        <div class="meter-top">
          <div><span class="meter-pct">0%</span> <span class="muted">power</span></div>
          <div class="small meter-stats">Flexes: <b data-out="flexes">0</b> · Best: <b data-out="best">0%</b></div>
        </div>
        <div class="meter-gauge" aria-hidden="true"><span></span><i></i></div>
        <canvas class="meter-canvas" aria-label="Live graph of your muscle signal"></canvas>
        <div class="meter-beam" aria-hidden="true"><span></span><b>LAB BEAM</b></div>
        <p class="small muted">Keep your power above the dashed line to charge the Lab Beam. Fill it to fire!</p>
      </section>

      <section class="card">
        <h2>🎯 Calibrate</h2>
        <p>Everyone’s muscles (and gain settings) are different. Teach the meter what “relaxed” and “full power” look like for <b>you</b>.</p>
        <div class="btn-row">
          <button class="btn btn-ghost" type="button" data-act="cal-base">😌 Relax for 3 s</button>
          <button class="btn btn-ghost" type="button" data-act="cal-peak">💪 Flex hard for 3 s</button>
        </div>
        <p class="cal-status small">Current range: <b data-out="range"></b></p>
      </section>

      <section class="card">
        <h2>🤖 The Arduino sketch</h2>
        <p>Upload this to your Uno. It just prints one reading per line at <b>115200</b> baud.</p>
        <div class="code-box"><button class="btn btn-ghost code-copy" type="button" data-copy-code>📋 Copy code</button>
        <pre class="code"><code>${esc(SKETCH)}</code></pre></div>
      </section>`;

    const $ = (s) => el.querySelector(s);
    const status = (html) => { $('.meter-status').innerHTML = html; };
    const ohmi = window.Mascot.mount($('#meterOhmi'), { variant: 'mini' });
    ohmi.say('Connect your muscle and show me what you’ve got! Or try Demo mode first. 💪', 'proud', { silent: true });
    const cv = $('.meter-canvas');
    const ctx = cv.getContext('2d');
    const gauge = $('.meter-gauge span');
    const beamBar = $('.meter-beam span');

    function updateRange() { $('[data-out="range"]').textContent = `relaxed ≈ ${Math.round(st.base)}, full power ≈ ${Math.round(st.peak)} (Arduino units)`; }
    updateRange();

    // ---- incoming numbers (from the Arduino or the demo)
    function push(v) {
      st.raw.push(v);
      st.raw.shift();
      st.smooth = st.smooth + 0.15 * (v - st.smooth);
      if (st.calib) st.calib.vals.push(st.smooth);
    }
    const pct = () => Math.max(0, Math.min(1, (st.smooth - st.base) / Math.max(10, st.peak - st.base)));

    // ---- Web Serial
    async function connect() {
      await stop();
      try {
        const port = await navigator.serial.requestPort();
        await port.open({ baudRate: 115200 });
        st.port = port;
        st.mode = 'serial';
        const decoder = new TextDecoderStream();
        st.piped = port.readable.pipeTo(decoder.writable).catch(() => {});
        st.reader = decoder.readable.getReader();
        setButtons();
        status('✅ Connected! Flex your muscle. (If the numbers look stuck, check the sketch is uploaded and the baud rate is 115200.)');
        SFX.play('levelUp');
        readLoop();
      } catch (e) {
        st.mode = null;
        setButtons();
        status(e && e.name === 'NotFoundError'
          ? 'No port chosen. Press Connect again and pick your Arduino (often “USB Serial” or “Arduino Uno”).'
          : '⚠️ Couldn’t open the port. Is the Arduino IDE’s Serial Monitor or Plotter still open? Close it and try again.');
      }
    }
    async function readLoop() {
      let buf = '';
      try {
        for (;;) {
          const r = await st.reader.read();
          if (r.done) break;
          buf += r.value;
          let i;
          while ((i = buf.indexOf('\n')) >= 0) {
            const line = buf.slice(0, i).trim();
            buf = buf.slice(i + 1);
            const n = parseFloat(line.split(/[,\s]+/)[0]);
            if (!isNaN(n)) push(n);
          }
          if (buf.length > 200) buf = ''; // garbage protection (e.g. wrong baud rate)
        }
      } catch (e) {
        if (st.mode === 'serial') status('🔌 Disconnected. Plug the USB back in and press Connect.');
      }
    }
    async function stop() {
      const wasSerial = st.mode === 'serial';
      st.mode = null;
      st.holding = false;
      try { if (st.reader) await st.reader.cancel(); } catch (e) { /* already closed */ }
      try { if (st.piped) await st.piped; } catch (e) { /* ignore */ }
      try { if (st.port) await st.port.close(); } catch (e) { /* ignore */ }
      st.reader = null; st.port = null; st.piped = null;
      setButtons();
      if (wasSerial) status('Stopped. Press Connect to start again.');
    }
    function startDemo() {
      stop().then(() => {
        st.mode = 'demo';
        setButtons();
        status('🎮 Demo mode: press and hold the big button (or the spacebar) to flex a pretend muscle.');
      });
    }
    function setButtons() {
      $('[data-act="stop"]').hidden = !st.mode;
      $('.meter-demo').hidden = st.mode !== 'demo';
    }

    // ---- calibration
    function calibrate(kind) {
      if (!st.mode) { status('Start the meter first (Connect or Demo mode), then calibrate.'); return; }
      st.calib = { kind: kind, vals: [], until: performance.now() + 3000 };
      $('.cal-status').innerHTML = kind === 'base' ? '😌 Relax completely… 3 seconds…' : '💪 FLEX AS HARD AS YOU CAN… 3 seconds…';
      SFX.play('tap');
    }
    function finishCalib() {
      const c = st.calib;
      st.calib = null;
      if (!c.vals.length) { $('.cal-status').textContent = 'No readings came in. Is the meter running?'; return; }
      if (c.kind === 'base') {
        st.base = c.vals.reduce((a, b) => a + b, 0) / c.vals.length;
        if (st.peak < st.base + 20) st.peak = st.base + 200;
      } else {
        const sorted = c.vals.slice().sort((a, b) => a - b);
        const top = sorted[Math.floor(sorted.length * 0.9)]; // 90th percentile ignores single spikes
        st.peak = Math.max(top, st.base + 20);
      }
      updateRange();
      $('.cal-status').innerHTML = 'Saved! Current range: <b data-out="range"></b>';
      updateRange();
      SFX.play('correct');
    }

    // ---- reactions
    const BANDS = [
      ['😴 Relaxed. My grandma flexes harder. (She’s a robot.)', 'idle'],
      ['🙂 Warming up… I can feel the electrons stirring!', 'happy'],
      ['⚡ POWER RISING! The lab lights are flickering!', 'proud'],
      ['🔥 MAXIMUM POWER!!! The whole lab is SHAKING!', 'shock'],
    ];
    function react(p, now) {
      const band = p < 0.15 ? 0 : p < 0.5 ? 1 : p < 0.85 ? 2 : 3;
      if (band !== st.band && now - st.lastSay > 1200) {
        st.band = band;
        st.lastSay = now;
        ohmi.say(BANDS[band][0], BANDS[band][1], { silent: band < 3 });
      }
    }

    // ---- drawing
    function draw() {
      const dpr = window.devicePixelRatio || 1;
      const w = Math.round(cv.clientWidth * dpr);
      const h = Math.round(200 * dpr);
      if (cv.width !== w) cv.width = w;
      if (cv.height !== h) cv.height = h;
      ctx.clearRect(0, 0, w, h);
      const top = Math.max(st.peak * 1.25, st.base + 50, 50);
      const Y = (v) => h - 6 * dpr - (Math.max(0, v) / top) * (h - 12 * dpr);
      // threshold line (70% power)
      const thr = st.base + 0.7 * (st.peak - st.base);
      ctx.setLineDash([6 * dpr, 6 * dpr]);
      ctx.strokeStyle = 'rgba(255,62,165,.8)';
      ctx.lineWidth = 1.5 * dpr;
      ctx.beginPath(); ctx.moveTo(0, Y(thr)); ctx.lineTo(w, Y(thr)); ctx.stroke();
      ctx.setLineDash([]);
      // raw readings
      ctx.strokeStyle = 'rgba(34,230,255,.55)';
      ctx.lineWidth = 1.2 * dpr;
      ctx.beginPath();
      for (let i = 0; i < N; i++) { const x = (i / (N - 1)) * w; const y = Y(st.raw[i]); if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); }
      ctx.stroke();
    }

    // ---- main loop
    let last = performance.now();
    let demoAcc = 0;
    function frame(now) {
      if (!el.isConnected) { stop(); window.removeEventListener('keydown', onKey); window.removeEventListener('keyup', onKey); return; }
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      if (st.mode === 'demo') {
        demoAcc += dt * 100;
        while (demoAcc >= 1) {
          demoAcc -= 1;
          const target = st.holding ? 560 : 25;
          st.demoEnv += (target - st.demoEnv) * 0.06;
          push(Math.max(0, Math.min(1023, st.demoEnv * (0.75 + Math.random() * 0.5) + (Math.random() * 2 - 1) * 6)));
        }
      }
      if (st.calib && now > st.calib.until) finishCalib();
      const p = st.mode ? pct() : 0;
      $('.meter-pct').textContent = Math.round(p * 100) + '%';
      gauge.style.width = (p * 100).toFixed(1) + '%';
      gauge.style.background = p < 0.5 ? 'linear-gradient(90deg,#22e6ff,#b6ff3b)' : p < 0.85 ? 'linear-gradient(90deg,#b6ff3b,#ffd23f)' : 'linear-gradient(90deg,#ffd23f,#ff3ea5)';
      if (p > st.best) { st.best = p; $('[data-out="best"]').textContent = Math.round(p * 100) + '%'; }
      // flex counter with hysteresis (must drop below 30% before the next flex counts)
      if (!st.above && p > 0.6) { st.above = true; st.flexes++; $('[data-out="flexes"]').textContent = st.flexes; SFX.play('spark'); }
      if (st.above && p < 0.3) st.above = false;
      // lab beam
      if (st.cooldown > 0) st.cooldown -= dt;
      else if (st.mode) {
        st.beam = Math.max(0, Math.min(1, st.beam + (p > 0.7 ? dt / 2 : -dt / 4)));
        if (st.beam >= 1) {
          st.beam = 0;
          st.cooldown = 2.5;
          if (opts && opts.onBeam) opts.onBeam(!st.beamXp);
          st.beamXp = true;
        }
      }
      beamBar.style.width = (st.beam * 100).toFixed(1) + '%';
      el.querySelector('.meter-main').classList.toggle('charging', p > 0.7);
      if (st.mode) react(p, now);
      draw();
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);

    // ---- controls
    el.addEventListener('click', (e) => {
      const b = e.target.closest('[data-act]');
      if (!b) return;
      const a = b.getAttribute('data-act');
      if (a === 'connect') connect();
      if (a === 'demo') startDemo();
      if (a === 'stop') stop().then(() => status('Stopped.'));
      if (a === 'cal-base') calibrate('base');
      if (a === 'cal-peak') calibrate('peak');
    });
    const hold = $('.meter-hold');
    const down = (e) => { e.preventDefault(); st.holding = true; hold.classList.add('on'); };
    const up = () => { st.holding = false; hold.classList.remove('on'); };
    hold.addEventListener('pointerdown', down);
    hold.addEventListener('pointerup', up);
    hold.addEventListener('pointerleave', up);
    hold.addEventListener('pointercancel', up);
    hold.addEventListener('contextmenu', (e) => e.preventDefault());
    function onKey(e) {
      if (e.code !== 'Space' || st.mode !== 'demo') return;
      if (e.target.closest && e.target.closest('input, textarea, button')) return;
      e.preventDefault();
      st.holding = e.type === 'keydown';
      hold.classList.toggle('on', st.holding);
    }
    window.addEventListener('keydown', onKey);
    window.addEventListener('keyup', onKey);
  }

  window.MuscleMeter = { mount: mount, SKETCH: SKETCH };
})();
