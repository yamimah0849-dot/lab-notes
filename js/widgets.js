/* Interactive lesson widgets.
   A lesson section like { type: 'widget', widget: 'circuit' } is drawn by the matching function below.
   Every widget builds its own HTML/SVG, so lessons stay plain data. */
(function () {
  'use strict';

  const sfx = (name) => { if (window.SFX) window.SFX.play(name); };
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // ---------- number formatting
  function round(n, d) { const f = Math.pow(10, d); return Math.round(n * f) / f; }
  function sig(n) { // 3 significant-ish digits, no silly decimals
    const a = Math.abs(n);
    if (a >= 100) return String(Math.round(n));
    if (a >= 10) return String(round(n, 1));
    return String(round(n, 2));
  }
  function amps(A) {
    if (!isFinite(A)) return '∞ A';
    if (Math.abs(A) >= 1) return sig(A) + ' A';
    if (Math.abs(A) >= 0.001) return sig(A * 1000) + ' mA';
    if (A === 0) return '0 mA';
    return sig(A * 1e6) + ' µA';
  }
  function watts(W) {
    if (!isFinite(W)) return '∞ W';
    if (Math.abs(W) >= 1) return sig(W) + ' W';
    if (W === 0) return '0 W';
    return sig(W * 1000) + ' mW';
  }
  function ohms(R) {
    if (R >= 1e6) return sig(R / 1e6) + ' MΩ';
    if (R >= 1000) return sig(R / 1000) + ' kΩ';
    return sig(R) + ' Ω';
  }

  // ---------- resistor color code helpers (shared by several widgets)
  const BAND = [
    ['black', '#1b1b1b'], ['brown', '#7a4a1d'], ['red', '#d22'], ['orange', '#ff8c1a'], ['yellow', '#ffd400'],
    ['green', '#1f9d3a'], ['blue', '#2a63d6'], ['violet', '#8b3fd1'], ['gray', '#8c8c8c'], ['white', '#f4f4f4'],
  ];
  const GOLD = ['gold', '#c9a227'];
  const SILVER = ['silver', '#b8b8c0'];
  const E12 = [1.0, 1.2, 1.5, 1.8, 2.2, 2.7, 3.3, 3.9, 4.7, 5.6, 6.8, 8.2];

  // smallest standard (E12) value that is >= R
  function e12Up(R) {
    for (let d = -1; d <= 7; d++) {
      for (const v of E12) {
        const val = round(v * Math.pow(10, d), 6);
        if (val >= R - 1e-9) return val;
      }
    }
    return R;
  }

  // 4-band code for a value: [digit1, digit2, multiplier, tolerance(gold)]
  function bandsFor(R) {
    let exp = Math.floor(Math.log10(R)) - 1;
    let two = Math.round(R / Math.pow(10, exp));
    if (two >= 100) { two = Math.round(two / 10); exp += 1; }
    const d1 = Math.floor(two / 10);
    const d2 = two % 10;
    const mult = exp >= 0 ? BAND[exp] : exp === -1 ? GOLD : SILVER;
    return [BAND[d1], BAND[d2], mult, GOLD];
  }

  function resistorSvg(bands, opts) {
    const o = opts || {};
    const body = o.body || '#e9c891';
    return `<svg class="wg-res-svg" viewBox="0 0 160 44" aria-hidden="true">
      <line x1="0" y1="22" x2="160" y2="22" stroke="#9a9a9a" stroke-width="4" stroke-linecap="round"/>
      <rect x="34" y="6" width="92" height="32" rx="14" fill="${body}" stroke="#8a6a3a" stroke-width="2" class="wg-res-body"/>
      ${bands.map((b, i) => `<rect x="${[48, 62, 76, 104][i]}" y="6" width="8" height="32" fill="${b[1]}"/>`).join('')}
    </svg>`;
  }

  // ======================================================================
  // m0-1: "Safe or Sus?" sorting game
  function sort(el, cfg) {
    let answered = 0;
    let right = 0;
    el.innerHTML = `<div class="wg-sort">
      ${cfg.items.map((it, i) => `
        <div class="sort-card" data-i="${i}">
          <p class="sort-text">${it.text}</p>
          <div class="sort-btns">
            <button class="btn btn-ghost" type="button" data-pick="safe">✅ Safe</button>
            <button class="btn btn-ghost" type="button" data-pick="sus">⚠️ Sus</button>
          </div>
          <p class="sort-why" hidden></p>
        </div>`).join('')}
      <p class="sort-score" hidden></p>
    </div>`;
    el.addEventListener('click', (e) => {
      const b = e.target.closest('[data-pick]');
      if (!b) return;
      const card = b.closest('.sort-card');
      if (card.classList.contains('done')) return;
      const it = cfg.items[+card.getAttribute('data-i')];
      const ok = (b.getAttribute('data-pick') === 'safe') === it.safe;
      card.classList.add('done', ok ? 'right' : 'wrong');
      card.querySelectorAll('[data-pick]').forEach((x) => { x.disabled = true; });
      b.classList.add('picked');
      const why = card.querySelector('.sort-why');
      why.hidden = false;
      why.innerHTML = `<b>${it.safe ? '✅ Safe.' : '⚠️ Sus!'}</b> ${it.why}`;
      sfx(ok ? 'correct' : 'wrong');
      answered++;
      if (ok) right++;
      if (answered === cfg.items.length) {
        const s = el.querySelector('.sort-score');
        s.hidden = false;
        s.innerHTML = right === answered
          ? `🏆 ${right}/${answered}: perfect hazard radar! Dr. Ohmi is weeping with pride.`
          : `You got ${right}/${answered}. Read the red ones again: those are the mistakes that actually hurt people.`;
      }
    });
  }

  // ======================================================================
  // m0-3: multimeter dial explorer
  const METER_MODES = {
    off: { label: 'OFF', angle: -100, show: '', unit: '', jack: null,
      title: 'Off', what: 'Switch it off when you’re done, or the battery quietly drains.', how: '', tip: '' },
    vac: { label: 'V~', angle: -55, show: '- - -', unit: 'V~', jack: 'v',
      title: 'AC volts (V~)', what: 'Measures <b>alternating</b> voltage, the kind in wall sockets.',
      how: 'Not used in this course.', tip: '⛔ Dr. Ohmi’s rule: we never measure mains (wall power). Ever.' },
    vdc: { label: 'V⎓', angle: -15, show: '9.42', unit: 'V⎓', jack: 'v',
      title: 'DC volts (V⎓)', what: 'Measures <b>direct</b> voltage: batteries, USB, the Arduino’s pins.',
      how: 'Put the probes <b>across</b> the part (in parallel): red on the + side, black on the − side. Nothing needs unplugging.',
      tip: 'Example: a fresh 9V battery reads about 9.0–9.6 V. Below about 7.5 V it’s getting tired. A minus sign just means the probes are swapped.' },
    ohm: { label: 'Ω', angle: 25, show: '219.6', unit: 'Ω', jack: 'v',
      title: 'Resistance (Ω)', what: 'Measures how strongly something resists current.',
      how: '<b>Power OFF</b> first. Touch one probe to each leg. Don’t pinch both legs with your fingers: your body adds its own resistance.',
      tip: 'Example: a red-red-brown resistor reads about 220 Ω (± 5%). “OL” or a lonely “1” means “too big for this range” or “not connected”.' },
    cont: { label: '🔊', angle: 65, show: '0.4', unit: 'Ω 🔊', jack: 'v',
      title: 'Continuity (beep)', what: 'Beeps when two points are connected (very low resistance).',
      how: 'Power OFF. Touch the two points. Beep = connected, silence = not connected.',
      tip: 'Perfect for checking wires, solder joints and whether your breadboard rails are split. Tap the button again to hear it!' },
    adc: { label: 'A⎓', angle: 105, show: '13.6', unit: 'mA⎓', jack: 'ma',
      title: 'DC current (A⎓ / mA)', what: 'Measures how much current flows.',
      how: 'The meter must go <b>in the loop</b> (in series): unplug one wire and let the current flow <i>through</i> the meter. On many meters the red probe moves to a different jack for big currents (10A).',
      tip: '💥 Never touch the probes across a battery in this mode. The meter acts like a plain wire, so you short-circuit the battery and blow the meter’s fuse.' },
  };

  function meter(el) {
    const cx = 110;
    const cy = 196;
    let mode = 'off';
    const labels = Object.keys(METER_MODES).map((k) => {
      const m = METER_MODES[k];
      const a = (m.angle * Math.PI) / 180;
      const x = cx + 70 * Math.sin(a);
      const y = cy - 70 * Math.cos(a);
      return `<text class="wg-dial-label" data-mode="${k}" x="${x.toFixed(1)}" y="${(y + 5).toFixed(1)}" text-anchor="middle">${m.label}</text>`;
    }).join('');
    el.innerHTML = `<div class="wg-meter">
      <svg class="wg-meter-svg" viewBox="0 0 220 350" role="img" aria-label="Multimeter with a rotary dial">
        <rect x="6" y="6" width="208" height="338" rx="26" fill="#ffc23d" stroke="#140f2e" stroke-width="4"/>
        <rect x="20" y="20" width="180" height="316" rx="18" fill="#2a2342"/>
        <rect x="36" y="34" width="148" height="62" rx="8" fill="#a9c9a0" stroke="#140f2e" stroke-width="3"/>
        <text class="wg-lcd" x="168" y="80" text-anchor="end"></text>
        <text class="wg-lcd-unit" x="168" y="92" text-anchor="end"></text>
        <circle cx="${cx}" cy="${cy}" r="54" fill="#1b1630" stroke="#4a3f7a" stroke-width="3"/>
        ${labels}
        <g class="wg-knob" style="transform-origin:${cx}px ${cy}px">
          <circle cx="${cx}" cy="${cy}" r="34" fill="#3c3363" stroke="#140f2e" stroke-width="3"/>
          <rect x="${cx - 4}" y="${cy - 34}" width="8" height="30" rx="3" fill="#ffd23f"/>
        </g>
        <g class="wg-jacks">
          <circle data-jack="a10" cx="50" cy="296" r="13" fill="#140f2e" stroke="#ff4d6d" stroke-width="3"/>
          <circle data-jack="com" cx="110" cy="296" r="13" fill="#140f2e" stroke="#777" stroke-width="3"/>
          <circle data-jack="v" cx="170" cy="296" r="13" fill="#140f2e" stroke="#ff4d6d" stroke-width="3"/>
          <text x="50" y="326" text-anchor="middle" class="wg-jack-label">10A</text>
          <text x="110" y="326" text-anchor="middle" class="wg-jack-label">COM</text>
          <text x="170" y="326" text-anchor="middle" class="wg-jack-label">VΩmA</text>
        </g>
      </svg>
      <div class="wg-meter-side">
        <div class="wg-seg" role="group" aria-label="Dial position">
          ${Object.keys(METER_MODES).map((k) => `<button class="seg" type="button" data-mode="${k}">${METER_MODES[k].label}</button>`).join('')}
        </div>
        <div class="wg-info" aria-live="polite"></div>
      </div>
    </div>`;
    const svg = el.querySelector('svg');
    const lcd = el.querySelector('.wg-lcd');
    const unit = el.querySelector('.wg-lcd-unit');
    const knob = el.querySelector('.wg-knob');
    const info = el.querySelector('.wg-info');

    function set(k, fromClick) {
      mode = k;
      const m = METER_MODES[k];
      knob.style.transform = `rotate(${m.angle}deg)`;
      lcd.textContent = m.show;
      unit.textContent = m.unit;
      el.querySelectorAll('[data-mode]').forEach((n) => n.classList.toggle('on', n.getAttribute('data-mode') === k));
      svg.querySelectorAll('[data-jack]').forEach((j) => j.classList.remove('lit-red', 'lit-black'));
      if (m.jack) {
        svg.querySelector('[data-jack="com"]').classList.add('lit-black');
        svg.querySelector('[data-jack="v"]').classList.add('lit-red');
      }
      info.innerHTML = `<h4>${m.title}</h4><p>${m.what}</p>${m.how ? `<p><b>How:</b> ${m.how}</p>` : ''}${m.tip ? `<p class="small">${m.tip}</p>` : ''}
        ${m.jack ? '<p class="small muted">Probes: <b style="color:#ff6b81">red</b> in the VΩmA jack, <b>black</b> in COM. (Labels differ a little between meters.)</p>' : ''}`;
      if (fromClick) sfx(k === 'cont' ? 'beep' : 'tap');
    }
    el.addEventListener('click', (e) => {
      const t = e.target.closest('[data-mode]');
      if (t) set(t.getAttribute('data-mode'), true);
    });
    set('vdc', false);
  }

  // ======================================================================
  // m0-4: good vs bad solder joints
  function joints(el) {
    const J = [
      { name: 'Good joint', ok: true, desc: 'Shiny, smooth, shaped like a little volcano. Solder flowed onto both the pad and the leg.' },
      { name: 'Too little', ok: false, desc: 'Pad still visible. Weak, may crack. Heat it and add a bit more solder.' },
      { name: 'Blob', ok: false, desc: 'A ball sitting on top: the pad wasn’t hot enough, so solder didn’t stick to it. Reheat the pad.' },
      { name: 'Cold joint', ok: false, desc: 'Dull, lumpy, grainy. Something moved while it cooled, or not enough heat. Reheat until it flows.' },
      { name: 'Bridge', ok: false, desc: 'Solder connects two pads that should be separate: a short circuit! Drag it away with a clean hot tip.' },
    ];
    function shape(i, cx) {
      const pad = (x) => `<rect x="${x - 22}" y="76" width="44" height="5" fill="#d08a3c"/>`;
      const lead = (x) => `<rect x="${x - 2.5}" y="8" width="5" height="86" fill="#c4c4c4"/>`;
      const board = '<rect x="0" y="80" width="120" height="16" fill="#2f7d4f"/>';
      switch (i) {
        case 0: return board + pad(cx) + lead(cx) + `<path d="M${cx - 22} 78 Q${cx - 6} 72 ${cx - 3} 38 L${cx + 3} 38 Q${cx + 6} 72 ${cx + 22} 78 Z" fill="url(#wgSolder)"/>`;
        case 1: return board + pad(cx) + lead(cx) + `<path d="M${cx - 8} 78 Q${cx - 4} 75 ${cx - 3} 66 L${cx + 3} 66 Q${cx + 4} 75 ${cx + 8} 78 Z" fill="url(#wgSolder)"/>`;
        case 2: return board + pad(cx) + lead(cx) + `<circle cx="${cx}" cy="52" r="17" fill="url(#wgSolder)"/>`;
        case 3: return board + pad(cx) + lead(cx) + `<path d="M${cx - 20} 78 Q${cx - 19} 64 ${cx - 11} 66 Q${cx - 9} 50 ${cx - 2} 55 Q${cx + 4} 44 ${cx + 9} 57 Q${cx + 17} 59 ${cx + 20} 78 Z" fill="#8f8f88"/>
          <circle cx="${cx - 8}" cy="66" r="1.5" fill="#6d6d66"/><circle cx="${cx + 6}" cy="62" r="1.5" fill="#6d6d66"/><circle cx="${cx}" cy="72" r="1.5" fill="#6d6d66"/>`;
        default: return board + `<rect x="${cx - 40}" y="76" width="30" height="5" fill="#d08a3c"/><rect x="${cx + 10}" y="76" width="30" height="5" fill="#d08a3c"/>` +
          lead(cx - 25) + lead(cx + 25) + `<path d="M${cx - 40} 78 Q${cx - 30} 60 ${cx - 25} 46 Q${cx} 66 ${cx + 25} 46 Q${cx + 30} 60 ${cx + 40} 78 Z" fill="url(#wgSolder)"/>`;
      }
    }
    el.innerHTML = `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
        <linearGradient id="wgSolder" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".45" stop-color="#c9ced8"/><stop offset="1" stop-color="#8d94a3"/></linearGradient>
      </defs></svg>
      <div class="wg-joints">${J.map((j, i) => `
        <figure class="joint ${j.ok ? 'ok' : 'bad'}">
          <svg viewBox="0 0 120 100" aria-hidden="true">${shape(i, 60)}</svg>
          <figcaption><b>${j.ok ? '✅' : '❌'} ${j.name}</b><span>${j.desc}</span></figcaption>
        </figure>`).join('')}</div>`;
  }

  // ======================================================================
  // m1-1: animated circuit (voltage, resistance, switch -> current)
  const R_STEPS = [47, 100, 220, 330, 470, 680, 1000, 2200, 4700, 10000];

  function circuit(el) {
    const st = { V: 9, ri: 4, closed: true };
    el.innerHTML = `<div class="wg-circuit">
      <svg class="wg-svg" viewBox="0 0 360 232" role="img" aria-label="A battery, a resistor, a switch and a current meter in one loop, with moving dots showing the current">
        <path class="wg-loop" d="M70 85 V40 H290 V190 H70 Z"/>
        <g class="wg-dots"></g>
        <rect x="46" y="88" width="48" height="56" rx="6" class="wg-cover"/>
        <path d="M54 102 H86 M62 112 H78 M54 122 H86 M62 132 H78" class="wg-batt"/>
        <text x="98" y="104" class="wg-sign pos">+</text><text x="98" y="140" class="wg-sign neg">−</text>
        <text x="22" y="121" class="wg-label" text-anchor="middle" data-out="vlabel">9 V</text>
        <rect x="140" y="26" width="80" height="28" rx="6" class="wg-cover"/>
        <path d="M140 40 L148 40 L153 30 L163 50 L173 30 L183 50 L193 30 L203 50 L208 40 L220 40" class="wg-res"/>
        <text x="180" y="20" class="wg-label" text-anchor="middle" data-out="rlabel">470 Ω</text>
        <rect x="276" y="92" width="44" height="54" rx="6" class="wg-cover"/>
        <circle cx="290" cy="100" r="4" class="wg-contact"/><circle cx="290" cy="140" r="4" class="wg-contact"/>
        <line x1="290" y1="140" x2="290" y2="100" class="wg-lever"/>
        <text x="306" y="124" class="wg-label small">switch</text>
        <circle cx="180" cy="190" r="17" class="wg-meter-c"/>
        <text x="180" y="196" class="wg-label" text-anchor="middle">A</text>
        <text x="180" y="226" class="wg-label" text-anchor="middle" data-out="ilabel">19 mA</text>
      </svg>
      <div class="wg-controls">
        <label><span>🔋 Push (voltage): <b data-out="v">9 V</b></span>
          <input type="range" min="0" max="12" step="0.5" value="9" data-in="v" aria-label="Battery voltage"></label>
        <label><span>🚧 Narrowness (resistance): <b data-out="r">470 Ω</b></span>
          <input type="range" min="0" max="${R_STEPS.length - 1}" step="1" value="4" data-in="r" aria-label="Resistance"></label>
        <button class="btn btn-ghost" type="button" data-in="sw">🔌 Open the switch</button>
      </div>
      <div class="wg-readout">
        <p class="wg-big">Flow (current): <b data-out="i">19 mA</b></p>
        <p data-out="water" class="small"></p>
        <p data-out="status" class="wg-status"></p>
      </div>
      <p class="small muted">The dots show <i>how much</i> current flows, not how fast real electrons move (they actually crawl along at less than a millimetre per second!).</p>
    </div>`;

    const dotsG = el.querySelector('.wg-dots');
    const loop = el.querySelector('.wg-loop');
    const lever = el.querySelector('.wg-lever');
    const out = (k) => el.querySelector(`[data-out="${k}"]`);
    const N = 26;
    const len = loop.getTotalLength();
    let html = '';
    for (let i = 0; i < N; i++) html += '<circle r="3.4" class="wg-dot"/>';
    dotsG.innerHTML = html;
    const dots = Array.from(dotsG.children);
    let offset = 0;

    function current() { return st.closed ? st.V / R_STEPS[st.ri] : 0; }

    function update() {
      const R = R_STEPS[st.ri];
      const I = current();
      out('v').textContent = st.V + ' V';
      out('vlabel').textContent = st.V + ' V';
      out('r').textContent = ohms(R);
      out('rlabel').textContent = ohms(R);
      out('i').textContent = amps(I);
      out('ilabel').textContent = amps(I);
      lever.setAttribute('x2', st.closed ? 290 : 314);
      lever.setAttribute('y2', st.closed ? 100 : 108);
      el.querySelector('[data-in="sw"]').textContent = st.closed ? '🔌 Open the switch' : '🔌 Close the switch';
      out('water').innerHTML = `💧 Water version: a pump pushing with <b>${st.V}</b> units of pressure through a pipe this narrow (${ohms(R)}) gives a flow of <b>${amps(I)}</b>.`;
      let s;
      if (!st.closed) s = '🚫 Switch open: the loop is broken, so <b>nothing</b> flows. Not even a little.';
      else if (st.V === 0) s = '😴 No push, no flow. A battery at 0 V is just a fancy paperweight.';
      else if (I > 0.06) s = '😱 That’s a BIG current! An LED in this loop would be toast.';
      else if (I < 0.002) s = '🐌 Barely a trickle. Lots of resistance, not much push.';
      else s = '👍 A nice, sensible current. More push → more flow. More resistance → less flow.';
      out('status').innerHTML = s;
      el.classList.toggle('open', !st.closed);
    }

    el.addEventListener('input', (e) => {
      const k = e.target.getAttribute('data-in');
      if (k === 'v') st.V = +e.target.value;
      if (k === 'r') st.ri = +e.target.value;
      update();
    });
    el.addEventListener('click', (e) => {
      if (e.target.closest('[data-in="sw"]')) { st.closed = !st.closed; sfx('spark'); update(); }
    });

    let last = performance.now();
    function frame(now) {
      if (!el.isConnected) return; // lesson closed: stop animating
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const mA = current() * 1000;
      const speed = mA > 0 ? Math.min(380, 30 * Math.sqrt(mA)) : 0;
      offset = (offset + speed * dt) % len;
      for (let i = 0; i < N; i++) {
        const p = loop.getPointAtLength((offset + (i * len) / N) % len);
        dots[i].setAttribute('cx', p.x.toFixed(1));
        dots[i].setAttribute('cy', p.y.toFixed(1));
      }
      requestAnimationFrame(frame);
    }
    update();
    requestAnimationFrame(frame);
  }

  // ======================================================================
  // m1-2: Ohm's law magic triangle + calculator
  function ohm(el) {
    const st = { solve: 'I', V: 9, ImA: 9, R: 1000 };
    el.innerHTML = `<div class="wg-ohm">
      <svg class="wg-tri" viewBox="0 0 200 170" role="img" aria-label="Ohm's law triangle: V on top, I and R on the bottom">
        <path d="M100 8 L192 162 L8 162 Z" class="tri-shape"/>
        <path d="M52 90 H148 M100 90 V162" class="tri-line"/>
        <g data-pick="V" class="tri-letter"><circle cx="100" cy="62" r="24"/><text x="100" y="74" text-anchor="middle">V</text></g>
        <g data-pick="I" class="tri-letter"><circle cx="62" cy="130" r="24"/><text x="62" y="142" text-anchor="middle">I</text></g>
        <g data-pick="R" class="tri-letter"><circle cx="138" cy="130" r="24"/><text x="138" y="142" text-anchor="middle">R</text></g>
      </svg>
      <div class="wg-ohm-side">
        <p class="small muted">Tap the letter you want to find (cover it with your thumb!). What’s left shows the formula.</p>
        <p class="wg-formula" data-out="formula"></p>
        <div class="wg-fields">
          <label data-field="V">Voltage V <span><input type="number" step="any" min="0" value="9" data-in="V"> volts</span></label>
          <label data-field="I">Current I <span><input type="number" step="any" min="0" value="9" data-in="I"> mA</span></label>
          <label data-field="R">Resistance R <span><input type="number" step="any" min="0" value="1000" data-in="R"> Ω</span></label>
        </div>
        <p class="wg-big" data-out="result"></p>
      </div>
    </div>`;
    const out = (k) => el.querySelector(`[data-out="${k}"]`);
    function calc() {
      const I = st.ImA / 1000;
      let html;
      if (st.solve === 'V') {
        const V = I * st.R;
        html = `V = I × R = ${sig(I)} A × ${sig(st.R)} Ω = <b>${sig(V)} V</b>`;
      } else if (st.solve === 'I') {
        const A = st.R > 0 ? st.V / st.R : Infinity;
        html = st.R > 0 ? `I = V ÷ R = ${sig(st.V)} V ÷ ${sig(st.R)} Ω = ${sig(A)} A = <b>${amps(A)}</b>` : 'I = V ÷ 0 = 💥 infinity! (That’s a short circuit.)';
      } else {
        html = I > 0 ? `R = V ÷ I = ${sig(st.V)} V ÷ ${sig(I)} A = <b>${ohms(st.V / I)}</b>` : 'R = V ÷ 0 … you need some current to work it out!';
      }
      out('result').innerHTML = html;
      out('formula').innerHTML = { V: 'V = I × R', I: 'I = V ÷ R', R: 'R = V ÷ I' }[st.solve];
      el.querySelectorAll('[data-pick]').forEach((g) => g.classList.toggle('covered', g.getAttribute('data-pick') === st.solve));
      el.querySelectorAll('[data-field]').forEach((f) => { f.hidden = f.getAttribute('data-field') === st.solve; });
    }
    el.addEventListener('click', (e) => {
      const g = e.target.closest('[data-pick]');
      if (g) { st.solve = g.getAttribute('data-pick'); sfx('tap'); calc(); }
    });
    el.addEventListener('input', (e) => {
      const k = e.target.getAttribute('data-in');
      const v = parseFloat(e.target.value);
      if (!k || !(v >= 0)) return;
      if (k === 'V') st.V = v;
      if (k === 'I') st.ImA = v;
      if (k === 'R') st.R = v;
      calc();
    });
    calc();
  }

  // ======================================================================
  // m1-2: LED resistor calculator
  const LED_COLORS = [
    ['Red', 2.0, '#ff2d2d'], ['Yellow', 2.1, '#ffd400'], ['Green', 2.2, '#22d65a'], ['Blue', 3.0, '#2f7bff'], ['White', 3.0, '#f4f4ff'],
  ];
  function ledCalc(el) {
    el.innerHTML = `<div class="wg-led">
      <div class="wg-fields row">
        <label>Power supply <select data-in="vs">
          <option value="3.3">3.3 V</option><option value="5" selected>5 V (Arduino)</option><option value="9">9 V (battery)</option><option value="12">12 V</option>
        </select></label>
        <label>LED color <select data-in="led">${LED_COLORS.map((c, i) => `<option value="${i}">${c[0]} (≈${c[1]} V)</option>`).join('')}</select></label>
        <label>Current <select data-in="ma"><option value="5">5 mA (dim)</option><option value="10">10 mA</option><option value="15" selected>15 mA</option><option value="20">20 mA (bright, max)</option></select></label>
      </div>
      <div class="wg-led-out" aria-live="polite"></div>
      <p class="small muted">LED voltages vary a little between LEDs. These are typical values; your LED’s datasheet has the exact ones.</p>
    </div>`;
    const outEl = el.querySelector('.wg-led-out');
    function calc() {
      const vs = parseFloat(el.querySelector('[data-in="vs"]').value);
      const led = LED_COLORS[+el.querySelector('[data-in="led"]').value];
      const I = parseFloat(el.querySelector('[data-in="ma"]').value) / 1000;
      const left = vs - led[1];
      if (left <= 0.2) {
        outEl.innerHTML = `<p class="wg-big">😢 ${vs} V isn’t enough to light a ${led[0].toLowerCase()} LED (it needs about ${led[1]} V just to start glowing).</p>`;
        return;
      }
      const exact = left / I;
      const std = e12Up(exact);
      const realI = left / std;
      const pR = realI * realI * std;
      outEl.innerHTML = `
        <div class="wg-led-row">
          <span class="wg-led-dot" style="background:${led[2]};box-shadow:0 0 ${Math.round(6 + realI * 900)}px ${led[2]}"></span>
          <div>
            <p class="wg-big">Use <b>${ohms(std)}</b></p>
            <p class="small">Math: (${vs} V − ${led[1]} V) ÷ ${sig(I)} A = ${ohms(exact)} → round <b>up</b> to the next standard value: ${ohms(std)}</p>
          </div>
        </div>
        ${resistorSvg(bandsFor(std))}
        <p class="small">Color bands: <b>${bandsFor(std).map((b) => b[0]).join(' – ')}</b></p>
        <p class="small">Real current: <b>${amps(realI)}</b> · Heat in the resistor: <b>${watts(pR)}</b> ${pR < 0.125 ? '✅ fine for a normal ¼ W resistor' : pR < 0.25 ? '⚠️ OK for ¼ W but it’ll get warm' : '🔥 too much for a ¼ W resistor! Use a bigger resistor or lower current.'}</p>`;
    }
    el.addEventListener('change', calc);
    calc();
  }

  // ======================================================================
  // m1-3: resistor power / heat demo
  const P_RES = [47, 100, 220, 470, 1000];
  function power(el) {
    const st = { V: 5, ri: 2, smoked: false };
    el.innerHTML = `<div class="wg-power">
      <div class="wg-power-stage">
        <div class="wg-smoke" aria-hidden="true"><span></span><span></span><span></span><span></span></div>
        <svg class="wg-power-res" viewBox="0 0 160 44" aria-hidden="true">
          <line x1="0" y1="22" x2="160" y2="22" stroke="#9a9a9a" stroke-width="4" stroke-linecap="round"/>
          <rect x="34" y="6" width="92" height="32" rx="14" class="wg-res-body" stroke="#8a6a3a" stroke-width="2"/>
        </svg>
        <p class="wg-power-tag">¼ W resistor</p>
      </div>
      <div class="wg-controls">
        <label><span>Voltage across it: <b data-out="v">5 V</b></span><input type="range" min="0" max="12" step="0.5" value="5" data-in="v" aria-label="Voltage"></label>
        <label><span>Resistor: <b data-out="r">220 Ω</b></span><input type="range" min="0" max="${P_RES.length - 1}" step="1" value="2" data-in="r" aria-label="Resistance"></label>
      </div>
      <div class="wg-readout">
        <p>Current I = V ÷ R = <b data-out="i"></b></p>
        <p class="wg-big">Power P = V × I = <b data-out="p"></b></p>
        <div class="bar wg-pbar"><span data-out="bar"></span></div>
        <p class="small muted"><span data-out="pct"></span> of the resistor’s ¼ W (0.25 W) rating</p>
        <p data-out="status" class="wg-status"></p>
      </div>
    </div>`;
    const body = el.querySelector('.wg-res-body');
    const smoke = el.querySelector('.wg-smoke');
    const out = (k) => el.querySelector(`[data-out="${k}"]`);
    function mix(a, b, t) { return a.map((x, i) => Math.round(x + (b[i] - x) * t)); }
    function update() {
      const R = P_RES[st.ri];
      const I = st.V / R;
      const P = st.V * I;
      const ratio = P / 0.25;
      out('v').textContent = st.V + ' V';
      out('r').textContent = ohms(R);
      out('i').textContent = amps(I);
      out('p').textContent = watts(P);
      out('pct').textContent = Math.round(ratio * 100) + '%';
      const bar = out('bar');
      bar.style.width = Math.min(100, ratio * 50) + '%'; // the bar's middle = 100% of the rating
      bar.style.background = ratio <= 0.5 ? '' : ratio <= 1 ? 'linear-gradient(90deg,#ffd23f,#ff8a3d)' : 'linear-gradient(90deg,#ff8a3d,#ff2d2d)';
      const t = Math.min(1, ratio / 2);
      const c = t < 0.5 ? mix([233, 200, 145], [255, 150, 60], t * 2) : mix([255, 150, 60], [255, 40, 30], (t - 0.5) * 2);
      body.setAttribute('fill', `rgb(${c.join(',')})`);
      body.style.filter = ratio > 0.5 ? `drop-shadow(0 0 ${Math.round(ratio * 8)}px rgb(${c.join(',')}))` : 'none';
      smoke.classList.toggle('on', ratio > 1);
      smoke.classList.toggle('lots', ratio > 2);
      let s;
      if (ratio <= 0.5) s = '😎 Cool as a cucumber. Plenty of safety margin.';
      else if (ratio <= 1) s = '🌡️ Warm. Still inside its ¼ W rating, but don’t push your luck.';
      else if (ratio <= 2) s = '🔥 TOO HOT! It’s over its rating: it’ll smell, discolor and slowly cook.';
      else s = '💨 MAGIC SMOKE RELEASED! Electronics run on smoke. Once it’s out, they stop working.';
      out('status').innerHTML = s;
      const smoking = ratio > 2;
      if (smoking && !st.smoked) sfx('sizzle');
      st.smoked = smoking;
    }
    el.addEventListener('input', (e) => {
      const k = e.target.getAttribute('data-in');
      if (k === 'v') st.V = +e.target.value;
      if (k === 'r') st.ri = +e.target.value;
      update();
    });
    update();
  }

  // shared: animate dots around a closed path. speedFn() returns px/second (0 = stopped, negative = backwards)
  function runDots(el, path, group, n, speedFn) {
    const len = path.getTotalLength();
    let html = '';
    for (let i = 0; i < n; i++) html += '<circle r="3.4" class="wg-dot"/>';
    group.innerHTML = html;
    const dots = Array.from(group.children);
    let offset = 0;
    let last = performance.now();
    function frame(now) {
      if (!el.isConnected) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      offset = ((offset + speedFn() * dt) % len + len) % len;
      for (let i = 0; i < n; i++) {
        const p = path.getPointAtLength((offset + (i * len) / n) % len);
        dots[i].setAttribute('cx', p.x.toFixed(1));
        dots[i].setAttribute('cy', p.y.toFixed(1));
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  // ======================================================================
  // m2-1: resistor color code decoder
  const MULTS = BAND.slice(0, 7).map((b, i) => [b[0], b[1], Math.pow(10, i)]).concat([[GOLD[0], GOLD[1], 0.1], [SILVER[0], SILVER[1], 0.01]]);
  const TOLS = [['gold', GOLD[1], '±5%'], ['silver', SILVER[1], '±10%'], ['brown', BAND[1][1], '±1%']];
  const LIGHT = ['yellow', 'white', 'gold', 'silver', 'orange'];

  function colorCode(el) {
    const st = { d1: 2, d2: 2, m: 1, t: 0 }; // red red brown gold = 220 Ω
    function sw(group, i, name, hex, label) {
      return `<button type="button" class="swatch${LIGHT.indexOf(name) >= 0 ? ' light' : ''}" style="--c:${hex}" data-g="${group}" data-v="${i}" aria-label="${name} ${label}" title="${name}">${label}</button>`;
    }
    el.innerHTML = `<div class="wg-cc">
      <div class="wg-cc-res"></div>
      <p class="wg-big" data-out="val"></p>
      <div class="wg-cc-rows">
        <div><p class="small"><b>Band 1</b> (first digit)</p><div class="swatches">${BAND.map((b, i) => (i ? sw('d1', i, b[0], b[1], i) : '')).join('')}</div></div>
        <div><p class="small"><b>Band 2</b> (second digit)</p><div class="swatches">${BAND.map((b, i) => sw('d2', i, b[0], b[1], i)).join('')}</div></div>
        <div><p class="small"><b>Band 3</b> (multiplier: how many zeros)</p><div class="swatches">${MULTS.map((m, i) => sw('m', i, m[0], m[1], m[2] >= 1 ? '×' + (m[2] >= 1000 ? (m[2] >= 1e6 ? m[2] / 1e6 + 'M' : m[2] / 1000 + 'k') : m[2]) : '×' + m[2])).join('')}</div></div>
        <div><p class="small"><b>Band 4</b> (tolerance)</p><div class="swatches">${TOLS.map((t, i) => sw('t', i, t[0], t[1], t[2])).join('')}</div></div>
      </div>
      <div class="wg-cc-rev">
        <label>Or type a value: <span><input type="number" min="1" step="any" value="4700" data-in="rev"> Ω</span></label>
        <button class="btn btn-ghost" type="button" data-in="go">🎨 Show its bands</button>
      </div>
    </div>`;
    function update() {
      const m = MULTS[st.m];
      const val = (st.d1 * 10 + st.d2) * m[2];
      const t = TOLS[st.t];
      const pct = { '±5%': 0.05, '±10%': 0.1, '±1%': 0.01 }[t[2]];
      el.querySelector('.wg-cc-res').innerHTML = resistorSvg([BAND[st.d1], BAND[st.d2], [m[0], m[1]], [t[0], t[1]]]);
      el.querySelector('[data-out="val"]').innerHTML = `= <b>${ohms(val)}</b> ${t[2]} <span class="small muted">(really anywhere from ${ohms(val * (1 - pct))} to ${ohms(val * (1 + pct))})</span>`;
      el.querySelectorAll('.swatch').forEach((s) => s.classList.toggle('on', +s.getAttribute('data-v') === st[s.getAttribute('data-g')]));
    }
    el.addEventListener('click', (e) => {
      const s = e.target.closest('.swatch');
      if (s) { st[s.getAttribute('data-g')] = +s.getAttribute('data-v'); sfx('tap'); update(); return; }
      if (e.target.closest('[data-in="go"]')) {
        const v = parseFloat(el.querySelector('[data-in="rev"]').value);
        if (!(v >= 0.1)) return;
        const b = bandsFor(v);
        st.d1 = BAND.findIndex((x) => x[0] === b[0][0]);
        st.d2 = BAND.findIndex((x) => x[0] === b[1][0]);
        st.m = MULTS.findIndex((x) => x[0] === b[2][0]);
        st.t = 0;
        if (st.d1 < 1 || st.m < 0) return;
        sfx('correct');
        update();
      }
    });
    update();
  }

  // ======================================================================
  // m2-1: series vs parallel
  function combo(el) {
    const st = { r1: 220, r2: 330, mode: 'series' };
    el.innerHTML = `<div class="wg-combo">
      <div class="wg-seg" role="group" aria-label="How they are connected">
        <button class="seg" type="button" data-mode="series">➖ Series (in a line)</button>
        <button class="seg" type="button" data-mode="parallel">🟰 Parallel (side by side)</button>
      </div>
      <svg class="wg-svg wg-combo-svg" viewBox="0 0 320 120" aria-hidden="true"></svg>
      <div class="wg-fields row">
        <label>R1 <span><input type="number" min="1" step="any" value="220" data-in="r1"> Ω</span></label>
        <label>R2 <span><input type="number" min="1" step="any" value="330" data-in="r2"> Ω</span></label>
      </div>
      <div class="wg-readout"><p class="wg-big" data-out="total"></p><p class="small" data-out="why"></p></div>
    </div>`;
    const svg = el.querySelector('svg');
    const zig = (x, y, label) => `<path class="wg-res" d="M${x} ${y} l6 0 l4 -9 l8 18 l8 -18 l8 18 l8 -18 l4 9 l6 0"/><text class="wg-label small" x="${x + 26}" y="${y - 14}" text-anchor="middle">${label}</text>`;
    function update() {
      const { r1, r2 } = st;
      const series = st.mode === 'series';
      const total = series ? r1 + r2 : (r1 * r2) / (r1 + r2);
      svg.innerHTML = series
        ? `<path class="wg-loop" d="M10 60 H90 M142 60 H178 M230 60 H310"/>${zig(90, 60, ohms(r1))}${zig(178, 60, ohms(r2))}
           <circle cx="10" cy="60" r="5" class="wg-contact"/><circle cx="310" cy="60" r="5" class="wg-contact"/>`
        : `<path class="wg-loop" d="M10 60 H80 M80 30 V90 M80 30 H134 M80 90 H134 M186 30 H240 M186 90 H240 M240 30 V90 M240 60 H310"/>${zig(134, 30, ohms(r1))}${zig(134, 90, ohms(r2))}
           <circle cx="10" cy="60" r="5" class="wg-contact"/><circle cx="310" cy="60" r="5" class="wg-contact"/>`;
      el.querySelector('[data-out="total"]').innerHTML = `Total: <b>${ohms(total)}</b>`;
      el.querySelector('[data-out="why"]').innerHTML = series
        ? `Series: current has to squeeze through <b>both</b>, one after the other, so they add up: ${sig(r1)} + ${sig(r2)} = ${sig(total)} Ω. Like one long narrow pipe.`
        : `Parallel: current can take <b>either</b> path, which is easier, so the total is <b>less than the smallest</b>: (${sig(r1)} × ${sig(r2)}) ÷ (${sig(r1)} + ${sig(r2)}) = ${sig(total)} Ω. Like opening a second lane on a road.`;
      el.querySelectorAll('[data-mode]').forEach((b) => b.classList.toggle('on', b.getAttribute('data-mode') === st.mode));
    }
    el.addEventListener('click', (e) => {
      const b = e.target.closest('[data-mode]');
      if (b) { st.mode = b.getAttribute('data-mode'); sfx('tap'); update(); }
    });
    el.addEventListener('input', (e) => {
      const k = e.target.getAttribute('data-in');
      const v = parseFloat(e.target.value);
      if ((k === 'r1' || k === 'r2') && v > 0) { st[k] = v; update(); }
    });
    update();
  }

  // ======================================================================
  // m2-2: capacitor charging (RC time constant)
  const CAP_R = [[1000, '1 kΩ'], [10000, '10 kΩ'], [100000, '100 kΩ']];
  const CAP_C = [[10e-6, '10 µF'], [100e-6, '100 µF'], [470e-6, '470 µF'], [1000e-6, '1000 µF']];
  function capCharge(el) {
    const V = 5;
    const st = { ri: 1, ci: 1, v: 0, anim: null };
    el.innerHTML = `<div class="wg-cap">
      <div class="wg-fields row">
        <label>Resistor <select data-in="r">${CAP_R.map((r, i) => `<option value="${i}" ${i === 1 ? 'selected' : ''}>${r[1]}</option>`).join('')}</select></label>
        <label>Capacitor <select data-in="c">${CAP_C.map((c, i) => `<option value="${i}" ${i === 1 ? 'selected' : ''}>${c[1]}</option>`).join('')}</select></label>
      </div>
      <div class="wg-cap-main">
        <div class="wg-bucket" aria-hidden="true"><span></span></div>
        <svg class="wg-graph" viewBox="0 0 320 170" role="img" aria-label="Graph of capacitor voltage over time">
          <path class="g-axis" d="M36 10 V140 H312"/>
          <text class="g-txt" x="30" y="16" text-anchor="end">5 V</text>
          <text class="g-txt" x="30" y="143" text-anchor="end">0</text>
          <path class="g-grid" d="M36 58 H312"/><text class="g-txt" x="30" y="61" text-anchor="end">63%</text>
          ${[1, 2, 3, 4, 5].map((k) => `<path class="g-grid" d="M${36 + k * 55} 10 V140"/><text class="g-txt" x="${36 + k * 55}" y="156" text-anchor="middle">${k}τ</text>`).join('')}
          <path class="g-curve" d=""/>
          <circle class="g-dot" r="5" cx="36" cy="140"/>
        </svg>
      </div>
      <div class="btn-row"><button class="btn btn-cyan" type="button" data-in="charge">⚡ Charge</button><button class="btn btn-ghost" type="button" data-in="discharge">🔻 Discharge</button></div>
      <div class="wg-readout"><p class="wg-big">Time constant τ = R × C = <b data-out="tau"></b></p><p data-out="now" class="small"></p></div>
    </div>`;
    const curve = el.querySelector('.g-curve');
    const dot = el.querySelector('.g-dot');
    const fill = el.querySelector('.wg-bucket span');
    const tau = () => CAP_R[st.ri][0] * CAP_C[st.ci][0];
    function fmtT(s) { return s >= 1 ? sig(s) + ' s' : sig(s * 1000) + ' ms'; }
    function show(v, t, charging) {
      fill.style.height = (v / V) * 100 + '%';
      el.querySelector('[data-out="now"]').innerHTML = `Capacitor voltage: <b>${round(v, 2)} V</b> (${Math.round((v / V) * 100)}% full)` +
        (t != null ? ` after ${fmtT(t)}. ${charging ? 'Filling fast at first, then slower and slower as it gets fuller.' : 'Emptying fast at first, then slower.'}` : '');
    }
    function update() {
      el.querySelector('[data-out="tau"]').textContent = fmtT(tau());
      curve.setAttribute('d', '');
      show(st.v, null);
    }
    function run(charging) {
      cancelAnimationFrame(st.anim);
      const T = tau();
      const v0 = st.v;
      const start = performance.now();
      const PLAY = 3200; // the animation always takes 3.2 s to show 5τ, whatever the real time is
      const volt = (t) => (charging ? V - (V - v0) * Math.exp(-t / T) : v0 * Math.exp(-t / T));
      sfx(charging ? 'spark' : 'tap');
      function frame(now) {
        if (!el.isConnected) return;
        const k = Math.min(1, (now - start) / PLAY);
        const t = k * 5 * T;
        const v = volt(t);
        const x = 36 + k * 275;
        const y = 140 - (v / V) * 130;
        // redraw the whole curve up to now, so it stays smooth even if frames are skipped
        let d = '';
        const steps = Math.max(2, Math.round(k * 80));
        for (let j = 0; j <= steps; j++) {
          const kj = (j / steps) * k;
          d += (j ? ' L' : 'M') + (36 + kj * 275).toFixed(1) + ' ' + (140 - (volt(kj * 5 * T) / V) * 130).toFixed(1);
        }
        curve.setAttribute('d', d);
        dot.setAttribute('cx', x.toFixed(1));
        dot.setAttribute('cy', y.toFixed(1));
        st.v = v;
        show(v, t, charging);
        if (k < 1) st.anim = requestAnimationFrame(frame);
      }
      st.anim = requestAnimationFrame(frame);
    }
    el.addEventListener('change', (e) => {
      const k = e.target.getAttribute('data-in');
      if (k === 'r') st.ri = +e.target.value;
      if (k === 'c') st.ci = +e.target.value;
      update();
    });
    el.addEventListener('click', (e) => {
      if (e.target.closest('[data-in="charge"]')) run(true);
      if (e.target.closest('[data-in="discharge"]')) run(false);
    });
    update();
  }

  // ======================================================================
  // m3-1: diode = one-way street
  function diode(el) {
    const st = { diodeFwd: true, battFwd: true };
    el.innerHTML = `<div class="wg-diode">
      <svg class="wg-svg" viewBox="0 0 360 220" role="img" aria-label="A battery, a diode and a lamp in a loop">
        <path class="wg-loop" d="M70 85 V40 H290 V180 H70 Z"/>
        <g class="wg-dots"></g>
        <rect x="46" y="88" width="48" height="56" rx="6" class="wg-cover"/>
        <g class="wg-battg" style="transform-origin:70px 116px">
          <path d="M54 102 H86 M62 112 H78 M54 122 H86 M62 132 H78" class="wg-batt"/>
          <text x="98" y="104" class="wg-sign pos">+</text><text x="98" y="140" class="wg-sign neg">−</text>
        </g>
        <rect x="150" y="22" width="60" height="36" rx="6" class="wg-cover"/>
        <g class="wg-diodeg" style="transform-origin:180px 40px">
          <path d="M150 40 H166 M194 40 H210" class="wg-batt"/>
          <path d="M166 26 L166 54 L192 40 Z" class="wg-diode-tri"/>
          <path d="M194 25 V55" class="wg-batt"/>
        </g>
        <text x="180" y="16" class="wg-label small" text-anchor="middle">diode</text>
        <circle cx="180" cy="180" r="22" class="wg-lamp-glow"/>
        <circle cx="180" cy="180" r="15" class="wg-lamp"/>
        <path d="M172 180 q4 -8 8 0 q4 8 8 0" class="wg-filament"/>
        <text x="180" y="214" class="wg-label small" text-anchor="middle">lamp</text>
      </svg>
      <div class="btn-row">
        <button class="btn btn-ghost" type="button" data-in="d">🔄 Flip the diode</button>
        <button class="btn btn-ghost" type="button" data-in="b">🔋 Flip the battery</button>
      </div>
      <div class="wg-readout"><p data-out="status" class="wg-status"></p></div>
    </div>`;
    const flows = () => st.diodeFwd === st.battFwd;
    function update() {
      el.querySelector('.wg-diodeg').style.transform = st.diodeFwd ? '' : 'rotate(180deg)';
      el.querySelector('.wg-battg').style.transform = st.battFwd ? '' : 'rotate(180deg)';
      el.classList.toggle('on', flows());
      el.querySelector('[data-out="status"]').innerHTML = flows()
        ? '✅ <b>Forward:</b> the triangle points the same way the current wants to go, so it flows. (The diode “charges a toll” of about 0.7 V.)'
        : '🚫 <b>Reverse:</b> the current is pushing against the arrow. The bouncer says “not on the list”. Nothing flows.';
    }
    runDots(el, el.querySelector('.wg-loop'), el.querySelector('.wg-dots'), 22, () => (flows() ? (st.battFwd ? 110 : -110) : 0));
    el.addEventListener('click', (e) => {
      const b = e.target.closest('[data-in]');
      if (!b) return;
      if (b.getAttribute('data-in') === 'd') st.diodeFwd = !st.diodeFwd;
      if (b.getAttribute('data-in') === 'b') st.battFwd = !st.battFwd;
      sfx(flows() ? 'correct' : 'wrong');
      update();
    });
    update();
  }

  // ======================================================================
  // m3-3: NPN transistor switch (small base current controls a bigger collector current)
  function transistor(el) {
    const BETA = 100;
    const IMAX = (5 - 2 - 0.2) / 220; // LED + 220 Ω on 5 V, transistor fully on ≈ 12.7 mA
    const st = { ib: 0 }; // µA
    el.innerHTML = `<div class="wg-trans">
      <svg class="wg-svg" viewBox="0 0 320 260" role="img" aria-label="NPN transistor switching an LED">
        <path class="wg-loop thin" d="M150 20 H220 V40 M220 76 V96 M220 132 V156 M220 204 V236 M110 180 H188 M40 180 H70"/>
        <text class="wg-label small" x="146" y="24" text-anchor="end">+5 V</text>
        <path class="wg-res" d="M220 40 l0 4 l-8 4 l16 6 l-16 6 l16 6 l-16 6 l8 4 l0 0"/>
        <text class="wg-label small" x="234" y="62">220 Ω</text>
        <circle cx="220" cy="112" r="18" class="wg-led-glow"/>
        <path d="M206 100 H234 L220 122 Z" class="wg-led-tri"/><path d="M206 124 H234" class="wg-batt"/>
        <text class="wg-label small" x="244" y="116">LED</text>
        <circle cx="206" cy="180" r="28" class="wg-tr-body"/>
        <path d="M194 164 V196" class="wg-batt"/>
        <path d="M194 172 L220 156 M194 188 L220 204" class="wg-batt"/>
        <path d="M212 194 L220 204 L208 203 Z" fill="#efeaff"/>
        <text class="wg-label small" x="234" y="160">C</text><text class="wg-label small" x="178" y="172">B</text><text class="wg-label small" x="234" y="212">E</text>
        <path class="wg-res" d="M70 180 l4 0 l4 -8 l6 16 l6 -16 l6 16 l6 -16 l4 8 l4 0"/>
        <text class="wg-label small" x="90" y="164" text-anchor="middle">base resistor</text>
        <circle cx="34" cy="180" r="8" class="wg-src"/>
        <text class="wg-label small" x="34" y="206" text-anchor="middle">control</text>
        <path d="M206 236 H234 M210 242 H230 M214 248 H226" class="wg-batt"/>
        <text class="wg-label small" x="120" y="200" data-out="ibl" text-anchor="middle"></text>
        <text class="wg-label small" x="262" y="90" data-out="icl"></text>
      </svg>
      <div class="wg-controls">
        <label><span>Base current (the tiny control): <b data-out="ib"></b></span>
          <input type="range" min="0" max="300" step="5" value="0" data-in="ib" aria-label="Base current in microamps"></label>
      </div>
      <div class="wg-readout">
        <p class="wg-big">Collector current (through the LED): <b data-out="ic"></b></p>
        <p data-out="status" class="wg-status"></p>
      </div>
    </div>`;
    const out = (k) => el.querySelector(`[data-out="${k}"]`);
    function update() {
      const ib = st.ib / 1e6;
      const ic = Math.min(BETA * ib, IMAX);
      out('ib').textContent = st.ib + ' µA';
      out('ibl').textContent = 'Ib = ' + st.ib + ' µA';
      out('ic').textContent = amps(ic);
      out('icl').textContent = 'Ic = ' + amps(ic);
      el.querySelector('.wg-led-glow').style.opacity = (ic / IMAX).toFixed(2);
      el.querySelector('.wg-src').style.fill = st.ib ? 'var(--lime)' : '#3c3363';
      let s;
      if (st.ib === 0) s = '😴 <b>OFF (cutoff):</b> no base current, so no collector current. The switch is open.';
      else if (BETA * ib < IMAX) s = `📈 <b>Partly on:</b> the collector current is ${BETA} × the base current (${st.ib} µA × ${BETA} = ${amps(BETA * ib)}). Tiny in, big out: that’s <b>amplification</b>.`;
      else s = '💡 <b>Fully ON (saturated):</b> the transistor is wide open. Now the LED and its resistor decide the current, not the transistor. This is how we use it as a switch.';
      out('status').innerHTML = s;
    }
    el.addEventListener('input', (e) => {
      if (e.target.getAttribute('data-in') === 'ib') { st.ib = +e.target.value; update(); }
    });
    update();
  }

  // ======================================================================
  // m4-1: Arduino Uno pin map
  const UNO_INFO = {
    d01: ['Pins 0 (RX) and 1 (TX)', 'Digital pins, but the USB connection uses them to talk to your computer. Leave them empty, or uploads and the Serial Monitor get confused.'],
    dig: ['Digital pins 2–13', 'Each one is either <b>HIGH</b> (5 V) or <b>LOW</b> (0 V). Use them as outputs (LEDs, buzzers, transistors) or inputs (buttons). Max about <b>20 mA</b> each, so always use a resistor for LEDs.'],
    pwm: ['PWM pins (~3, 5, 6, 9, 10, 11)', 'Digital pins with a <b>~</b> mark. Besides on/off, they can fake “in-between” power with <code>analogWrite()</code>: dim LEDs, control motor speed.'],
    d13: ['Pin 13 (built-in LED)', 'A normal digital pin that also has a tiny LED on the board, labeled “L”. Perfect for your first Blink!'],
    gnd: ['GND (ground)', 'The 0 V “home base”. Every circuit you connect needs a wire back to GND. All GND pins are connected together.'],
    aref: ['AREF', 'Reference voltage for advanced analog tricks. Leave it alone for now.'],
    i2c: ['SDA / SCL', 'A two-wire bus for talking to fancy chips (like I2C displays). Same as A4 / A5 on the Uno. Not needed in this course.'],
    v5: ['5V', 'Gives out 5 volts (from USB or the power jack). Powers your breadboard + rail, sensors, LCD and small servo.'],
    v33: ['3.3V', 'Gives out 3.3 volts, for parts that want less than 5 V. Only a small current available.'],
    vin: ['Vin', 'Power <b>input</b> when you use a battery or adapter on the jack (7–12 V). Not for your 5 V parts!'],
    reset: ['RESET', 'Connect it to GND to restart the program. Same as pressing the reset button.'],
    ioref: ['IOREF', 'Tells add-on boards that this Uno works at 5 V. You won’t use it.'],
    ana: ['Analog pins A0–A5', 'They <b>measure</b> a voltage from 0 to 5 V and turn it into a number from 0 to 1023 with <code>analogRead()</code>. Your water sensor and EMG sensor go here.'],
    usb: ['USB port', 'Power + programming + Serial Monitor, all through one cable.'],
    jack: ['Power jack', 'For a 7–12 V adapter or battery when the Arduino runs without a computer.'],
    chip: ['The brain (ATmega328P)', 'The microcontroller: a tiny computer that runs your program in a loop, forever, about 16 million steps per second.'],
  };
  function uno(el) {
    const top = [['SCL', 'i2c'], ['SDA', 'i2c'], ['AREF', 'aref'], ['GND', 'gnd'], ['13', 'd13'], ['12', 'dig'], ['~11', 'pwm'], ['~10', 'pwm'], ['~9', 'pwm'], ['8', 'dig'],
      ['7', 'dig'], ['~6', 'pwm'], ['~5', 'pwm'], ['4', 'dig'], ['~3', 'pwm'], ['2', 'dig'], ['TX 1', 'd01'], ['RX 0', 'd01']];
    const pwr = [['IOREF', 'ioref'], ['RESET', 'reset'], ['3.3V', 'v33'], ['5V', 'v5'], ['GND', 'gnd'], ['GND', 'gnd'], ['Vin', 'vin']];
    const ana = ['A0', 'A1', 'A2', 'A3', 'A4', 'A5'].map((a) => [a, 'ana']);
    // labels are tilted (like the printing on a real board) so neighbours don't overlap
    const pin = (x, y, p, labelBelow) => {
      const ty = labelBelow ? y + 11 : y - 10;
      return `<g class="uno-pin" data-k="${p[1]}"><rect x="${x - 6}" y="${y - 6}" width="12" height="12" rx="2"/>
        <text x="${x}" y="${ty}" text-anchor="${labelBelow ? 'start' : 'start'}" transform="rotate(${labelBelow ? 55 : -55} ${x} ${ty})">${p[0]}</text></g>`;
    };
    let pins = '';
    top.forEach((p, i) => { pins += pin(52 + i * 14 + (i >= 10 ? 8 : 0), 40, p, false); });
    pwr.forEach((p, i) => { pins += pin(120 + i * 14, 206, p, true); });
    ana.forEach((p, i) => { pins += pin(236 + i * 14, 206, p, true); });
    el.innerHTML = `<div class="wg-uno">
      <svg class="wg-svg" viewBox="0 0 330 240" role="img" aria-label="Arduino Uno board. Tap a pin to learn what it does.">
        <rect x="20" y="22" width="300" height="196" rx="12" class="uno-board"/>
        <g class="uno-pin" data-k="usb"><rect x="6" y="56" width="44" height="40" rx="4" class="uno-usb"/><text x="28" y="80" text-anchor="middle">USB</text></g>
        <g class="uno-pin" data-k="jack"><rect x="6" y="150" width="40" height="36" rx="4" class="uno-jack"/><text x="26" y="172" text-anchor="middle">DC</text></g>
        <g class="uno-pin" data-k="chip"><rect x="150" y="104" width="130" height="34" rx="3" class="uno-chip"/><text x="215" y="126" text-anchor="middle" class="uno-chip-t">ATmega328P</text></g>
        <circle cx="96" cy="62" r="4" class="uno-led"/><text x="106" y="66" class="uno-small">L</text>
        <text x="80" y="130" class="uno-logo">UNO</text>
        <text x="172" y="72" text-anchor="middle" class="uno-small">DIGITAL (PWM ~)</text>
        <text x="160" y="186" text-anchor="middle" class="uno-small">POWER</text><text x="271" y="186" text-anchor="middle" class="uno-small">ANALOG IN</text>
        ${pins}
      </svg>
      <div class="wg-info" aria-live="polite"><h4>Tap any pin</h4><p>Each group of pins has its own job. Tap one to find out what it does.</p></div>
    </div>`;
    el.addEventListener('click', (e) => {
      const g = e.target.closest('[data-k]');
      if (!g) return;
      const k = g.getAttribute('data-k');
      el.querySelectorAll('.uno-pin').forEach((p) => p.classList.toggle('on', p.getAttribute('data-k') === k));
      const info = UNO_INFO[k];
      el.querySelector('.wg-info').innerHTML = `<h4>${info[0]}</h4><p>${info[1]}</p>`;
      sfx('spark');
    });
  }

  // ======================================================================
  // m4-2: analogRead (ADC) explorer
  function adc(el) {
    el.innerHTML = `<div class="wg-adc">
      <div class="wg-controls"><label><span>Voltage on pin A0: <b data-out="v">2.50 V</b></span>
        <input type="range" min="0" max="5" step="0.01" value="2.5" data-in="v" aria-label="Voltage on A0"></label></div>
      <div class="bar big"><span data-out="bar"></span></div>
      <p class="wg-big">analogRead(A0) → <b data-out="n">512</b> <span class="small muted">(out of 1023)</span></p>
      <p class="small" data-out="how"></p>
    </div>`;
    function update() {
      const v = parseFloat(el.querySelector('[data-in="v"]').value);
      const n = Math.round((v / 5) * 1023);
      el.querySelector('[data-out="v"]').textContent = v.toFixed(2) + ' V';
      el.querySelector('[data-out="n"]').textContent = n;
      el.querySelector('[data-out="bar"]').style.width = (n / 1023) * 100 + '%';
      el.querySelector('[data-out="how"]').innerHTML = `Math: ${v.toFixed(2)} V ÷ 5 V × 1023 ≈ <b>${n}</b>. Each step is about 4.9 mV, so the Arduino can tell apart about 1024 different voltage levels.`;
    }
    el.addEventListener('input', update);
    update();
  }

  // ======================================================================
  // m4-2: PWM explorer
  function pwm(el) {
    el.innerHTML = `<div class="wg-pwm">
      <div class="wg-controls"><label><span>analogWrite(9, <b data-out="val">64</b>)</span>
        <input type="range" min="0" max="255" step="1" value="64" data-in="d" aria-label="PWM value"></label></div>
      <div class="wg-pwm-row">
        <svg class="wg-graph" viewBox="0 0 320 110" aria-hidden="true">
          <path class="g-axis" d="M20 10 V90 H316"/>
          <text class="g-txt" x="16" y="22" text-anchor="end">5V</text><text class="g-txt" x="16" y="92" text-anchor="end">0</text>
          <path class="g-curve" data-out="wave" d=""/>
        </svg>
        <span class="wg-pwm-led" aria-hidden="true"></span>
      </div>
      <p class="small" data-out="how"></p>
    </div>`;
    function update() {
      const d = +el.querySelector('[data-in="d"]').value;
      const duty = d / 255;
      el.querySelector('[data-out="val"]').textContent = d;
      let p = 'M20 90';
      const period = 59;
      for (let k = 0; k < 5; k++) {
        const x0 = 20 + k * period;
        const xOn = x0 + duty * period;
        if (duty > 0) p += ` L${x0} 20 L${xOn.toFixed(1)} 20 L${xOn.toFixed(1)} 90`;
        p += ` L${x0 + period} 90`;
      }
      el.querySelector('[data-out="wave"]').setAttribute('d', p);
      const led = el.querySelector('.wg-pwm-led');
      led.style.opacity = (0.15 + duty * 0.85).toFixed(2);
      led.style.boxShadow = `0 0 ${Math.round(duty * 30)}px #ff2d2d`;
      el.querySelector('[data-out="how"]').innerHTML = `The pin is ON <b>${Math.round(duty * 100)}%</b> of the time (about 490 times a second). Average voltage ≈ 5 × ${d} ÷ 255 = <b>${round(5 * duty, 2)} V</b>. Your eye averages the flicker into “${duty < 0.2 ? 'dim' : duty < 0.7 ? 'medium' : 'bright'}”.`;
    }
    el.addEventListener('input', update);
    update();
  }

  // ======================================================================
  // m4-3: what a wrong baud rate looks like
  function baud(el) {
    const MSG = 'Lab online! Dr. Ohmi says hi.';
    el.innerHTML = `<div class="wg-baud">
      <p class="small">The sketch says <code>Serial.begin(9600)</code>. Pick the speed set in the Serial Monitor:</p>
      <div class="wg-seg">${[300, 9600, 115200].map((b) => `<button class="seg" type="button" data-b="${b}">${b} baud</button>`).join('')}</div>
      <pre class="code serial-out" aria-live="polite"></pre>
    </div>`;
    function garble(s) {
      const junk = '�ÿþ¿§¤¥ÆØ¬¦×Þ~^`|{}';
      return s.split('').map(() => junk[Math.floor(Math.random() * junk.length)]).join('').slice(0, s.length);
    }
    function set(b) {
      el.querySelectorAll('[data-b]').forEach((x) => x.classList.toggle('on', +x.getAttribute('data-b') === b));
      el.querySelector('.serial-out').textContent = b === 9600
        ? MSG + '\nSeconds since start: 0\nSeconds since start: 1\nSeconds since start: 2'
        : garble(MSG) + '\n' + garble('Seconds since start: 0') + '\n' + garble('Seconds since start: 1') + '\n\n(Speeds don’t match, so the bits are read at the wrong times: gibberish!)';
    }
    el.addEventListener('click', (e) => {
      const b = e.target.closest('[data-b]');
      if (b) { set(+b.getAttribute('data-b')); sfx(+b.getAttribute('data-b') === 9600 ? 'correct' : 'wrong'); }
    });
    set(115200);
  }

  // ======================================================================
  // m4-4: 16x2 LCD simulator
  function lcd(el) {
    el.innerHTML = `<div class="wg-lcd-sim">
      <div class="lcd-screen" aria-label="LCD preview"><div class="lcd-row" data-row="0"></div><div class="lcd-row" data-row="1"></div></div>
      <div class="wg-fields">
        <label>Row 0 (top) <input type="text" maxlength="16" value="LAB NOTES ONLINE" data-in="0" spellcheck="false"></label>
        <label>Row 1 (bottom) <input type="text" maxlength="16" value="Hi from Dr.Ohmi!" data-in="1" spellcheck="false"></label>
      </div>
      <pre class="code lcd-code"></pre>
    </div>`;
    function cells(s) {
      const t = (s + ' '.repeat(16)).slice(0, 16);
      return t.split('').map((c) => `<span>${c === ' ' ? '&nbsp;' : esc(c)}</span>`).join('');
    }
    function update() {
      const r0 = el.querySelector('[data-in="0"]').value;
      const r1 = el.querySelector('[data-in="1"]').value;
      el.querySelector('[data-row="0"]').innerHTML = cells(r0);
      el.querySelector('[data-row="1"]').innerHTML = cells(r1);
      const q = (s) => s.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
      el.querySelector('.lcd-code').textContent = `lcd.setCursor(0, 0);  // column 0, row 0\nlcd.print("${q(r0)}");\nlcd.setCursor(0, 1);  // column 0, row 1\nlcd.print("${q(r1)}");`;
    }
    el.addEventListener('input', update);
    update();
  }

  // ======================================================================
  // m4-4: passive buzzer jingle + note keys
  const JINGLE = [[659, 150], [784, 150], [1047, 300], [988, 150], [784, 150], [880, 300], [698, 150], [880, 150], [784, 600]];
  const KEYS = [['C', 523], ['D', 587], ['E', 659], ['F', 698], ['G', 784], ['A', 880], ['B', 988], ['C', 1047]];
  function melody(el) {
    el.innerHTML = `<div class="wg-melody">
      <div class="btn-row"><button class="btn btn-primary" type="button" data-play>▶ Play the Lab Notes jingle</button></div>
      <p class="small muted">This is what <code>tone()</code> sounds like on a passive buzzer: a square wave at each frequency.</p>
      <div class="keys">${KEYS.map((k, i) => `<button type="button" class="key" data-f="${k[1]}">${k[0]}<small>${k[1]} Hz</small></button>`).join('')}</div>
      <p class="small" data-out="note">Tap a key: higher frequency = higher pitch.</p>
    </div>`;
    el.addEventListener('click', (e) => {
      if (e.target.closest('[data-play]')) { window.SFX && window.SFX.playNotes(JINGLE); return; }
      const k = e.target.closest('[data-f]');
      if (k) {
        const f = +k.getAttribute('data-f');
        window.SFX && window.SFX.playNotes([[f, 250]]);
        el.querySelector('[data-out="note"]').innerHTML = `<code>tone(8, ${f}, 250);</code> → the buzzer vibrates ${f} times per second.`;
      }
    });
  }

  const REGISTRY = { sort, meter, joints, circuit, ohm, ledCalc, power, colorCode, combo, capCharge, diode, transistor, uno, adc, pwm, baud, lcd, melody };

  window.Widgets = {
    render: function (el, cfg) {
      const fn = REGISTRY[cfg.widget];
      if (!fn) { el.innerHTML = '<p class="muted">(This widget is missing.)</p>'; return; }
      try { fn(el, cfg); } catch (e) { console.error('widget failed', cfg.widget, e); el.innerHTML = '<p class="muted">(This widget hit a snag.)</p>'; }
    },
    add: function (name, fn) { REGISTRY[name] = fn; },
    helpers: { sfx, esc, sig, amps, watts, ohms, e12Up, bandsFor, resistorSvg, BAND, GOLD, SILVER, E12 },
  };
})();
