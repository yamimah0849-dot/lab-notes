/* Lab Notes sound effects.
   Every sound is generated live by the browser (Web Audio API): no audio files, nothing to download,
   nothing copyrighted, and it works offline. Settings are saved in this browser. */
(function () {
  'use strict';

  const KEY = 'labnotes.sound.v1';
  // silentOk: on iPhone, play even when the phone is on silent (otherwise iOS mutes web sound effects)
  const prefs = { sfx: true, voice: true, silentOk: true };
  try { Object.assign(prefs, JSON.parse(localStorage.getItem(KEY)) || {}); } catch (e) { /* use defaults */ }
  function savePrefs() {
    try { localStorage.setItem(KEY, JSON.stringify(prefs)); } catch (e) { /* private mode etc. */ }
  }

  const AC = window.AudioContext || window.webkitAudioContext;
  const HAS_SESSION = 'audioSession' in navigator; // Safari's Audio Session API (iPhone, iOS 17+)
  let ctx = null;
  let out = null;
  let noiseBuf = null;

  // "playback" = sound like a video does (ignores the silent switch); "auto" = normal web behaviour.
  function applySession() {
    if (!HAS_SESSION) return;
    try { navigator.audioSession.type = prefs.silentOk ? 'playback' : 'auto'; } catch (e) { /* not allowed here */ }
  }
  applySession();

  // Create (or wake up) the audio engine. Browsers only allow this right after a tap or key press.
  function wake() {
    if (!AC) return null;
    applySession();
    if (!ctx) {
      ctx = new AC();
      out = ctx.createGain();
      out.gain.value = 0.55;
      const comp = ctx.createDynamicsCompressor(); // keeps loud moments from clipping
      comp.threshold.value = -14;
      comp.ratio.value = 4;
      out.connect(comp);
      comp.connect(ctx.destination);
    }
    // iPhone uses an extra state, "interrupted" (after leaving the app, a call, Siri…). Wake up from any non-running state.
    if (ctx.state !== 'running') {
      try { ctx.resume(); } catch (e) { /* will retry on the next tap */ }
      // iPhone needs a (silent) sound started inside a tap to really unlock audio
      const s = ctx.createBufferSource();
      s.buffer = ctx.createBuffer(1, 1, 22050);
      s.connect(ctx.destination);
      s.start(0);
    }
    return ctx;
  }
  ['pointerdown', 'touchstart', 'touchend', 'click', 'keydown'].forEach(function (ev) {
    window.addEventListener(ev, function () { if (prefs.sfx || prefs.voice) wake(); }, { capture: true, passive: true });
  });

  // Only play if audio is running (so nothing gets queued up and blasts out much later).
  function live() { return ctx && ctx.state === 'running' ? ctx : null; }

  // Run fn now if audio is running; if it's still waking up from this very tap, run it the moment it's ready
  // (but give up after 400 ms so old sounds never pile up).
  function withAudio(fn) {
    if (live()) { fn(); return; }
    if (!ctx) return;
    const t = Date.now();
    try {
      ctx.resume().then(() => { if (ctx.state === 'running' && Date.now() - t < 400) fn(); }).catch(() => {});
    } catch (e) { /* ignore */ }
  }

  // ---- building blocks
  function envelope(g, t0, attack, peak, end) {
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(peak, t0 + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, end);
  }

  // One note. f = start pitch (Hz), to = slide to this pitch, vib = wobble amount, lp = muffle above this pitch.
  function tone(o) {
    const t0 = ctx.currentTime + (o.at || 0);
    const dur = o.dur || 0.15;
    const osc = ctx.createOscillator();
    osc.type = o.type || 'sine';
    osc.frequency.setValueAtTime(o.f, t0);
    if (o.to) osc.frequency.exponentialRampToValueAtTime(o.to, t0 + (o.slide || dur));
    const g = ctx.createGain();
    envelope(g, t0, Math.min(o.attack || 0.005, dur * 0.5), o.vol || 0.3, t0 + dur);
    let last = osc;
    if (o.lp) {
      const f = ctx.createBiquadFilter();
      f.type = 'lowpass';
      f.frequency.value = o.lp;
      last.connect(f);
      last = f;
    }
    last.connect(g);
    g.connect(out);
    if (o.vib) {
      const lfo = ctx.createOscillator();
      const depth = ctx.createGain();
      lfo.frequency.value = o.vibRate || 6;
      depth.gain.value = o.vib;
      lfo.connect(depth);
      depth.connect(osc.frequency);
      lfo.start(t0);
      lfo.stop(t0 + dur + 0.05);
    }
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }

  // A burst of hiss (for zaps and whooshes).
  function noise(o) {
    if (!noiseBuf) {
      noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
      const d = noiseBuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    const t0 = ctx.currentTime + (o.at || 0);
    const dur = o.dur || 0.2;
    const src = ctx.createBufferSource();
    src.buffer = noiseBuf;
    src.loop = true;
    const f = ctx.createBiquadFilter();
    f.type = o.ftype || 'bandpass';
    f.frequency.setValueAtTime(o.f || 1000, t0);
    if (o.to) f.frequency.exponentialRampToValueAtTime(o.to, t0 + dur);
    f.Q.value = o.q || 1;
    const g = ctx.createGain();
    envelope(g, t0, Math.min(o.attack || 0.01, dur * 0.5), o.vol || 0.2, t0 + dur);
    src.connect(f);
    f.connect(g);
    g.connect(out);
    src.start(t0);
    src.stop(t0 + dur + 0.05);
  }

  // A bell-like "ding" (a few sine waves at bell-ish ratios).
  function bell(f, at, dur, vol) {
    tone({ f: f, at: at, dur: dur, vol: vol });
    tone({ f: f * 2.76, at: at, dur: dur * 0.45, vol: vol * 0.25 });
    tone({ f: f * 5.4, at: at, dur: dur * 0.2, vol: vol * 0.1 });
  }

  // ---- the sound library
  const SOUNDS = {
    tap: function () { tone({ type: 'triangle', f: 900, to: 1400, dur: 0.06, vol: 0.1 }); },

    // tapping a breadboard hole: a tiny electric tick
    spark: function () {
      noise({ ftype: 'highpass', f: 3000, dur: 0.05, vol: 0.12 });
      tone({ type: 'square', f: 1800, to: 2600, dur: 0.05, vol: 0.05, lp: 4000 });
    },

    // tapping Dr. Ohmi
    boing: function () { tone({ f: 180, to: 620, slide: 0.12, dur: 0.32, vol: 0.3, vib: 40, vibRate: 16 }); },

    // right answer: a quiz-show "pin-pon!" chime with sparkles
    correct: function () {
      bell(1318.51, 0, 0.45, 0.35);
      bell(1046.5, 0.17, 0.9, 0.35);
      [2093, 2637, 3136].forEach(function (f, i) { tone({ f: f, at: 0.3 + i * 0.05, dur: 0.12, vol: 0.06 }); });
    },

    // wrong answer: "bu-buuu!" buzzer plus an electric zap
    wrong: function () {
      tone({ type: 'square', f: 155, dur: 0.16, vol: 0.22, lp: 1400 });
      tone({ type: 'square', f: 155, at: 0.22, dur: 0.5, vol: 0.22, lp: 1400 });
      tone({ type: 'sawtooth', f: 110, at: 0.02, dur: 0.3, vol: 0.12, vib: 90, vibRate: 45, lp: 2500 });
      noise({ ftype: 'highpass', f: 2500, at: 0.02, dur: 0.22, vol: 0.08 });
    },

    // wrong answer, dramatic version: "dun... dun... DUNNN"
    sting: function () {
      function stab(at, dur, a, b) {
        tone({ type: 'sawtooth', f: a, at: at, dur: dur, vol: 0.18, lp: 900, attack: 0.01 });
        tone({ type: 'sawtooth', f: b, at: at, dur: dur, vol: 0.14, lp: 900, attack: 0.01 });
        tone({ f: a / 2, at: at, dur: dur, vol: 0.25 });
      }
      stab(0, 0.14, 164.81, 246.94);
      stab(0.28, 0.14, 164.81, 246.94);
      stab(0.56, 1.2, 155.56, 233.08);
    },

    // failed quiz: wah, wah, wah, waaah
    sadTrombone: function () {
      [196, 185, 174.61].forEach(function (f, i) {
        tone({ type: 'sawtooth', f: f, at: i * 0.38, dur: 0.32, vol: 0.18, lp: 900, attack: 0.04 });
      });
      tone({ type: 'sawtooth', f: 164.81, at: 1.14, dur: 1.1, vol: 0.18, lp: 900, attack: 0.04, vib: 5, vibRate: 6 });
    },

    whoosh: function () { noise({ ftype: 'bandpass', f: 400, to: 3500, dur: 0.35, vol: 0.18, q: 0.8, attack: 0.1 }); },

    // MISSION COMPLETE!
    fanfare: function () {
      SOUNDS.whoosh();
      [523.25, 659.25, 783.99, 1046.5].forEach(function (f, i) {
        tone({ type: 'square', f: f, at: 0.1 + i * 0.09, dur: 0.1, vol: 0.1, lp: 3000 });
      });
      [1046.5, 1318.51, 1567.98].forEach(function (f) {
        tone({ type: 'triangle', f: f, at: 0.5, dur: 1.2, vol: 0.14, vib: 6, vibRate: 5.5, attack: 0.02 });
      });
      tone({ f: 261.63, at: 0.5, dur: 1.2, vol: 0.25 });
      bell(2093, 0.55, 1.0, 0.12);
      [2637, 3136, 3520, 4186].forEach(function (f, i) { tone({ f: f, at: 0.7 + i * 0.07, dur: 0.15, vol: 0.05 }); });
    },

    // RANK UP: a power-up swoosh and a chord
    levelUp: function () {
      tone({ f: 220, to: 1760, slide: 0.55, dur: 0.6, vol: 0.12 });
      [783.99, 987.77, 1174.66, 1567.98].forEach(function (f, i) {
        tone({ type: 'square', f: f, at: 0.55 + i * 0.07, dur: 0.09, vol: 0.09, lp: 3500 });
      });
      [783.99, 987.77, 1174.66].forEach(function (f) {
        tone({ type: 'triangle', f: f, at: 0.85, dur: 1.0, vol: 0.13, vib: 5, vibRate: 6 });
      });
    },

    // 20-minute goal reached: rising chimes
    goal: function () {
      [1046.5, 1318.51, 1567.98, 2093].forEach(function (f, i) { bell(f, i * 0.12, 0.8, 0.22); });
    },

    // multimeter continuity beep
    beep: function () { tone({ type: 'square', f: 2400, dur: 0.35, vol: 0.07, lp: 5000 }); },

    // a resistor letting out its magic smoke: crackle + hiss
    sizzle: function () {
      noise({ ftype: 'highpass', f: 1800, dur: 0.9, vol: 0.14, attack: 0.05 });
      for (let i = 0; i < 7; i++) noise({ ftype: 'bandpass', f: 3000 + Math.random() * 3000, at: Math.random() * 0.7, dur: 0.03, vol: 0.2, q: 2 });
      tone({ f: 900, to: 300, dur: 0.6, vol: 0.05 });
    },

    // finishing a challenge
    coin: function () {
      tone({ type: 'triangle', f: 1318.51, dur: 0.07, vol: 0.18 });
      tone({ type: 'triangle', f: 1975.53, at: 0.07, dur: 0.28, vol: 0.18 });
    },
  };

  function play(name) {
    if (!prefs.sfx || !SOUNDS[name]) return;
    withAudio(() => { try { SOUNDS[name](); } catch (e) { console.warn('sound failed', name, e); } });
  }

  // Dr. Ohmi's "voice": cute gibberish blips, higher when happy, frantic when shocked.
  const VOICE = { idle: 560, happy: 720, shock: 900, think: 430, proud: 640 };
  let lastBabble = 0;
  function babble(mood, delay, text) {
    if (!prefs.voice || !ctx) return;
    const now = Date.now();
    if (now - lastBabble < 700) return; // don't let two Ohmis talk over each other
    lastBabble = now;
    withAudio(() => speak(mood, delay, text));
  }
  function speak(mood, delay, text) {
    const base = VOICE[mood] || VOICE.idle;
    const words = text ? String(text).replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length : 6;
    const count = Math.max(3, Math.min(12, Math.round(words * 0.8)));
    const step = mood === 'shock' ? 0.055 : 0.075;
    const lastBend = mood === 'think' ? 0.8 : mood === 'shock' ? 1.35 : 1.15; // the "?!" at the end
    let at = delay || 0;
    try {
      for (let i = 0; i < count; i++) {
        const f = base * (0.8 + Math.random() * 0.5);
        const bend = i === count - 1 ? lastBend : 1 + (Math.random() - 0.5) * 0.1;
        tone({ type: 'triangle', f: f, to: f * bend, dur: 0.06, vol: 0.13, at: at, lp: 2400 });
        tone({ type: 'square', f: f * 2, dur: 0.04, vol: 0.02, at: at, lp: 3000 });
        at += step + Math.random() * 0.03;
        if (Math.random() < 0.15) at += 0.06; // little pauses between "words"
      }
    } catch (e) { console.warn('voice failed', e); }
  }

  // Play a list of notes like a passive buzzer (square wave). notes = [[freqHz, ms], ...]; freq 0 = rest.
  function playNotes(notes, gapFactor) {
    const c = wake();
    if (!c || !prefs.sfx) return 0;
    let total = 0.02;
    notes.forEach(function (n) { total += (n[1] / 1000) * (gapFactor || 1.3); });
    withAudio(() => {
      let at = 0.02;
      notes.forEach(function (n) {
        const dur = n[1] / 1000;
        if (n[0] > 0) tone({ type: 'square', f: n[0], at: at, dur: dur, vol: 0.09, lp: 4000, attack: 0.005 });
        at += dur * (gapFactor || 1.3);
      });
    });
    return total;
  }

  window.SFX = {
    supported: !!AC,
    hasAudioSession: HAS_SESSION,
    play: play,
    playNotes: playNotes,
    babble: babble,
    wake: wake,
    get: function (key) { return !!prefs[key]; },
    set: function (key, on) {
      prefs[key] = !!on;
      savePrefs();
      if (key === 'silentOk') applySession();
      if (on) wake();
    },
    anyOn: function () { return prefs.sfx || prefs.voice; },
    toggleAll: function () {
      const on = !(prefs.sfx || prefs.voice);
      prefs.sfx = on;
      prefs.voice = on;
      savePrefs();
      if (on) wake();
      return on;
    },
  };
})();
