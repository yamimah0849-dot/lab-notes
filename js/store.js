/* Lab Notes: progress storage.
   Everything is saved in this browser (localStorage), so it works offline and costs nothing.
   Progress is designed to be MERGEABLE: two devices can combine their progress without losing anything
   (used by Import and by GitHub sync in js/sync.js). XP is never stored on its own: it is always
   recalculated from what you actually did (answers, quizzes, challenges, goals, bonuses). */
(function () {
  'use strict';

  const KEY = 'labnotes.progress.v1';
  const DEVICE_KEY = 'labnotes.device.v1';
  const GOAL_SECONDS = 20 * 60;          // the "20 minutes today" goal
  const IDLE_LIMIT_MS = 3 * 60 * 1000;   // stop the study timer after 3 minutes with no taps/scrolls/keys
  const TICK_MS = 10 * 1000;             // the timer counts in 10-second steps

  const XP = { correct: 10, quizPass: 50, challenge: 40, dailyGoal: 30 };

  const RANKS = [
    { xp: 0, title: 'Lab Intern', emoji: '🧪' },
    { xp: 300, title: 'Circuit Apprentice', emoji: '🔌' },
    { xp: 900, title: 'Spark Technician', emoji: '⚡' },
    { xp: 1800, title: 'Signal Wrangler', emoji: '📡' },
    { xp: 2800, title: 'Chief Engineer', emoji: '🛠️' },
    { xp: 4000, title: 'Mad Scientist', emoji: '🧠' },
  ];

  // A random name for this device, so study minutes from different devices can be added up correctly.
  const DEVICE = (function () {
    const make = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
    try {
      let id = localStorage.getItem(DEVICE_KEY);
      if (!id) { id = make(); localStorage.setItem(DEVICE_KEY, id); }
      return id;
    } catch (e) { return 'dev-' + make(); }
  })();

  // Local calendar date like "2026-11-11" (not UTC, so midnight matches your clock).
  function dayKey(date) {
    const d = date || new Date();
    const m = d.getMonth() + 1;
    const day = d.getDate();
    return d.getFullYear() + '-' + (m < 10 ? '0' : '') + m + '-' + (day < 10 ? '0' : '') + day;
  }

  function blank() {
    return { app: 'lab-notes', version: 2, xp: 0, lessons: {}, days: {}, bonus: {}, createdAt: new Date().toISOString(), updatedAt: Date.now() };
  }

  function isValid(s) {
    return !!s && typeof s === 'object' && s.app === 'lab-notes' && typeof s.xp === 'number' &&
      !!s.lessons && typeof s.lessons === 'object' && !!s.days && typeof s.days === 'object';
  }

  const sumBy = (by) => Object.keys(by || {}).reduce((t, k) => t + (+by[k] || 0), 0);

  // XP = what you did. Recalculating it (instead of adding it up) is what makes merging safe.
  function computeXp(s) {
    let xp = 0;
    Object.keys(s.lessons).forEach((id) => {
      const r = s.lessons[id] || {};
      if (Array.isArray(r.correct)) xp += XP.correct * r.correct.length;
      if (r.done) xp += XP.quizPass;
      if (r.ch) xp += XP.challenge * Object.keys(r.ch).filter((k) => r.ch[k]).length;
    });
    Object.keys(s.days).forEach((k) => { if (s.days[k] && s.days[k].goal) xp += XP.dailyGoal; });
    Object.keys(s.bonus || {}).forEach((k) => { xp += +s.bonus[k] || 0; });
    return xp;
  }

  // Upgrade older saves (version 1) and tidy anything odd.
  function normalize(s) {
    const old = s.version !== 2;
    s.bonus = s.bonus && typeof s.bonus === 'object' ? s.bonus : {};
    Object.keys(s.days).forEach((k) => {
      const d = s.days[k] || {};
      if (!d.by || typeof d.by !== 'object') d.by = d.s ? { [DEVICE]: d.s } : {}; // old saves: credit this device
      d.s = sumBy(d.by);
      d.act = !!(d.act || d.xp > 0);
      d.goal = !!d.goal;
      s.days[k] = d;
    });
    if (old) {
      // keep any XP an old save had that we can't explain from its records (so nobody loses XP)
      const extra = (typeof s.xp === 'number' ? s.xp : 0) - computeXp(s);
      if (extra > 0) s.bonus.legacy = (s.bonus.legacy || 0) + extra;
    }
    s.version = 2;
    s.xp = computeXp(s);
    if (!s.updatedAt) s.updatedAt = Date.now();
    return s;
  }

  function load() {
    try {
      const s = JSON.parse(localStorage.getItem(KEY));
      if (isValid(s)) return normalize(s);
    } catch (e) { /* no saved progress yet */ }
    return blank();
  }

  let state = load();

  // --- tiny event system so the screen (and sync) can react
  const handlers = {};
  function on(type, fn) { (handlers[type] = handlers[type] || []).push(fn); }
  function emit(type, data) {
    (handlers[type] || []).forEach(function (fn) {
      try { fn(data || {}); } catch (e) { console.error(e); }
    });
  }

  function save(kind) {
    state.updatedAt = Date.now();
    try { localStorage.setItem(KEY, JSON.stringify(state)); }
    catch (e) { console.warn('Lab Notes could not save progress', e); }
    emit('saved', { kind: kind || 'progress' });
  }

  function day(key) {
    const k = key || dayKey();
    if (!state.days[k]) state.days[k] = { by: {}, s: 0, act: false, goal: false };
    return state.days[k];
  }
  function lesson(id) { return state.lessons[id] || {}; }
  function lessonRec(id) {
    if (!state.lessons[id]) state.lessons[id] = {};
    return state.lessons[id];
  }

  function rankInfo(xp) {
    let i = 0;
    while (i + 1 < RANKS.length && xp >= RANKS[i + 1].xp) i++;
    const cur = RANKS[i];
    const next = RANKS[i + 1] || null;
    return { index: i, rank: cur, next: next, progress: next ? (xp - cur.xp) / (next.xp - cur.xp) : 1 };
  }

  // Recalculate XP after something happened; tell the screen how much was gained.
  function commit(reason) {
    const before = state.xp;
    const beforeRank = rankInfo(before).index;
    state.xp = computeXp(state);
    const gained = state.xp - before;
    if (gained > 0) day().act = true;
    save('progress');
    if (gained > 0) {
      const after = rankInfo(state.xp);
      emit('xp', { gained: gained, reason: reason, total: state.xp, rankUp: after.index > beforeRank ? after.rank : null });
    }
    return Math.max(0, gained);
  }

  function markStarted(id) {
    const rec = lessonRec(id);
    if (!rec.started) { rec.started = dayKey(); save('progress'); }
  }

  // XP for a correct answer is only given the first time you get that question right.
  function recordAnswer(id, qIndex, correct) {
    if (!correct) return 0;
    const rec = lessonRec(id);
    rec.correct = rec.correct || [];
    if (rec.correct.indexOf(qIndex) !== -1) return 0;
    rec.correct.push(qIndex);
    return commit('correct answer');
  }

  function finishQuiz(id, score, total) {
    const rec = lessonRec(id);
    const passed = score >= Math.ceil(total * 0.6);
    const firstPass = passed && !rec.done;
    rec.best = Math.max(rec.best || 0, score);
    rec.total = total;
    rec.attempts = (rec.attempts || 0) + 1;
    if (firstPass) { rec.done = true; rec.doneAt = dayKey(); }
    const gained = commit('mission complete');
    return { passed: passed, firstPass: firstPass, gained: firstPass ? gained : 0 };
  }

  function challengeDone(id, index) {
    const rec = lessonRec(id);
    rec.ch = rec.ch || {};
    if (rec.ch[index]) return 0;
    rec.ch[index] = true;
    return commit('challenge done');
  }

  // One-time bonuses (like firing the Lab Beam for the first time).
  function awardOnce(key, amount, reason) {
    if (state.bonus[key]) return 0;
    state.bonus[key] = amount;
    return commit(reason);
  }

  // --- study timer: only counts while the app is on screen and you're actually using it
  function tick(seconds) {
    const d = day();
    d.by[DEVICE] = (d.by[DEVICE] || 0) + seconds;
    d.s = sumBy(d.by);
    if (!d.goal && d.s >= GOAL_SECONDS) {
      d.goal = true;
      emit('goal');
      commit('daily goal');
    } else {
      save('tick');
    }
    emit('tick', { seconds: d.s });
  }

  let lastActive = Date.now();
  ['pointerdown', 'pointermove', 'keydown', 'scroll', 'wheel', 'touchstart'].forEach(function (ev) {
    window.addEventListener(ev, function () { lastActive = Date.now(); }, { passive: true, capture: true });
  });
  setInterval(function () {
    if (document.visibilityState === 'visible' && Date.now() - lastActive < IDLE_LIMIT_MS) tick(TICK_MS / 1000);
  }, TICK_MS);

  // A day counts toward your streak if you studied at least 1 minute or earned XP.
  function activeOn(key) {
    const d = state.days[key];
    return !!d && (d.s >= 60 || d.act || d.xp > 0);
  }
  function streak() {
    const date = new Date();
    if (!activeOn(dayKey(date))) date.setDate(date.getDate() - 1); // today isn't over yet
    let count = 0;
    while (activeOn(dayKey(date))) { count++; date.setDate(date.getDate() - 1); }
    return count;
  }

  // ---------------------------------------------------------------- merging
  // Combine two progress files. Order doesn't matter and merging twice changes nothing,
  // so devices can sync as often as they like.
  function mergeStates(a, b) {
    const out = blank();
    out.createdAt = [a.createdAt, b.createdAt].filter(Boolean).sort()[0] || out.createdAt;
    const ids = new Set(Object.keys(a.lessons).concat(Object.keys(b.lessons)));
    ids.forEach((id) => {
      const x = a.lessons[id] || {};
      const y = b.lessons[id] || {};
      const r = {};
      const earliest = (p, q) => [p, q].filter(Boolean).sort()[0];
      if (x.started || y.started) r.started = earliest(x.started, y.started);
      if (x.done || y.done) { r.done = true; r.doneAt = earliest(x.doneAt, y.doneAt); }
      if (x.best != null || y.best != null) r.best = Math.max(x.best || 0, y.best || 0);
      if (x.total || y.total) r.total = Math.max(x.total || 0, y.total || 0);
      if (x.attempts || y.attempts) r.attempts = Math.max(x.attempts || 0, y.attempts || 0);
      const corr = Array.from(new Set((x.correct || []).concat(y.correct || []))).sort((m, n) => m - n);
      if (corr.length) r.correct = corr;
      const ch = {};
      [x.ch || {}, y.ch || {}].forEach((c) => Object.keys(c).forEach((k) => { if (c[k]) ch[k] = true; }));
      if (Object.keys(ch).length) r.ch = ch;
      out.lessons[id] = r;
    });
    const days = new Set(Object.keys(a.days).concat(Object.keys(b.days)));
    days.forEach((k) => {
      const x = a.days[k] || {};
      const y = b.days[k] || {};
      const by = {};
      [x.by || {}, y.by || {}].forEach((m) => Object.keys(m).forEach((dev) => { by[dev] = Math.max(by[dev] || 0, +m[dev] || 0); }));
      out.days[k] = { by: by, s: sumBy(by), act: !!(x.act || y.act || x.xp > 0 || y.xp > 0), goal: !!(x.goal || y.goal) };
    });
    [a.bonus || {}, b.bonus || {}].forEach((m) => Object.keys(m).forEach((k) => { out.bonus[k] = Math.max(out.bonus[k] || 0, +m[k] || 0); }));
    out.xp = computeXp(out);
    return out;
  }

  // Same content = same text (keys sorted, timestamps ignored).
  function canonical(s) {
    const strip = (v) => {
      if (Array.isArray(v)) return v.map(strip);
      if (v && typeof v === 'object') {
        const o = {};
        Object.keys(v).sort().forEach((k) => { if (k !== 'updatedAt' && k !== 'exportedAt') o[k] = strip(v[k]); });
        return o;
      }
      return v;
    };
    return JSON.stringify(strip(s));
  }

  // Merge progress from somewhere else (another device, a backup) into this device.
  function mergeIn(other) {
    if (!isValid(other)) return { ok: false };
    const theirs = normalize(JSON.parse(JSON.stringify(other)));
    const merged = mergeStates(state, theirs);
    const changedLocal = canonical(merged) !== canonical(state);
    const needsPush = canonical(merged) !== canonical(theirs);
    if (changedLocal) {
      const beforeRank = rankInfo(state.xp).index;
      const gained = merged.xp - state.xp;
      state = merged;
      save('merge');
      const after = rankInfo(state.xp);
      emit('synced', { gained: gained, rankUp: after.index > beforeRank ? after.rank : null });
    }
    return { ok: true, changedLocal: changedLocal, needsPush: needsPush };
  }

  // --- backup
  function snapshot() { return JSON.stringify(state); }
  function exportJson() {
    return JSON.stringify(Object.assign({}, state, { exportedAt: new Date().toISOString() }), null, 2);
  }
  function importJson(text) {
    let s;
    try { s = JSON.parse(text); } catch (e) { return { ok: false, error: "That file isn't a readable backup (it's not valid JSON)." }; }
    if (!isValid(s)) return { ok: false, error: "That file doesn't look like a Lab Notes backup." };
    mergeIn(s);
    emit('change');
    return { ok: true };
  }
  function reset() {
    state = blank();
    save('progress');
    emit('change');
  }

  // If the app is open in two tabs, keep them in sync.
  window.addEventListener('storage', function (e) {
    if (e.key === KEY) { state = load(); emit('change'); }
  });

  window.LabStore = {
    on: on,
    get: function () { return state; },
    lesson: lesson,
    rankInfo: rankInfo,
    RANKS: RANKS,
    XP: XP,
    GOAL_SECONDS: GOAL_SECONDS,
    DEVICE: DEVICE,
    dayKey: dayKey,
    markStarted: markStarted,
    recordAnswer: recordAnswer,
    finishQuiz: finishQuiz,
    challengeDone: challengeDone,
    awardOnce: awardOnce,
    todaySeconds: function () { return (state.days[dayKey()] || {}).s || 0; },
    streak: streak,
    daysStudied: function () { return Object.keys(state.days).filter(activeOn).length; },
    computeXp: computeXp,
    mergeStates: mergeStates,
    mergeIn: mergeIn,
    snapshot: snapshot,
    exportJson: exportJson,
    importJson: importJson,
    reset: reset,
  };
})();
