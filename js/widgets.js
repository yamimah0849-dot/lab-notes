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

  const REGISTRY = { sort, meter, joints, circuit, ohm, ledCalc, power };

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
