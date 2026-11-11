/* Lab Notes: progress storage.
   Everything is saved in this browser only (localStorage), so it works offline and costs nothing.
   Export/Import turns it into a file you can back up or move to another device. */
(function () {
  'use strict';

  const KEY = 'labnotes.progress.v1';
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

  // Local calendar date like "2026-11-11" (not UTC, so midnight matches your clock).
  function dayKey(date) {
    const d = date || new Date();
    const m = d.getMonth() + 1;
    const day = d.getDate();
    return d.getFullYear() + '-' + (m < 10 ? '0' : '') + m + '-' + (day < 10 ? '0' : '') + day;
  }

  function blank() {
    return { app: 'lab-notes', version: 1, xp: 0, lessons: {}, days: {}, createdAt: new Date().toISOString() };
  }

  function isValid(s) {
    return !!s && typeof s === 'object' && s.app === 'lab-notes' && typeof s.xp === 'number' &&
      !!s.lessons && typeof s.lessons === 'object' && !!s.days && typeof s.days === 'object';
  }

  function load() {
    try {
      const s = JSON.parse(localStorage.getItem(KEY));
      if (isValid(s)) return s;
    } catch (e) { /* no saved progress yet */ }
    return blank();
  }

  let state = load();

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); }
    catch (e) { console.warn('Lab Notes could not save progress', e); }
  }

  // --- tiny event system so the screen can react to XP, the timer, etc.
  const handlers = {};
  function on(type, fn) { (handlers[type] = handlers[type] || []).push(fn); }
  function emit(type, data) {
    (handlers[type] || []).forEach(function (fn) {
      try { fn(data || {}); } catch (e) { console.error(e); }
    });
  }

  function day(key) {
    const k = key || dayKey();
    if (!state.days[k]) state.days[k] = { s: 0, xp: 0, goal: false };
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

  function addXp(amount, reason) {
    if (!amount) return 0;
    const before = rankInfo(state.xp).index;
    state.xp += amount;
    day().xp += amount;
    save();
    const after = rankInfo(state.xp);
    emit('xp', { gained: amount, reason: reason, total: state.xp, rankUp: after.index > before ? after.rank : null });
    return amount;
  }

  function markStarted(id) {
    const rec = lessonRec(id);
    if (!rec.started) { rec.started = dayKey(); save(); }
  }

  // XP for a correct answer is only given the first time you get that question right.
  function recordAnswer(id, qIndex, correct) {
    const rec = lessonRec(id);
    rec.correct = rec.correct || [];
    if (correct && rec.correct.indexOf(qIndex) === -1) {
      rec.correct.push(qIndex);
      save();
      return addXp(XP.correct, 'correct answer');
    }
    return 0;
  }

  function finishQuiz(id, score, total) {
    const rec = lessonRec(id);
    const passed = score >= Math.ceil(total * 0.6);
    const firstPass = passed && !rec.done;
    rec.best = Math.max(rec.best || 0, score);
    rec.total = total;
    rec.attempts = (rec.attempts || 0) + 1;
    if (firstPass) { rec.done = true; rec.doneAt = dayKey(); }
    save();
    const gained = firstPass ? addXp(XP.quizPass, 'mission complete') : 0;
    return { passed: passed, firstPass: firstPass, gained: gained };
  }

  function challengeDone(id, index) {
    const rec = lessonRec(id);
    rec.ch = rec.ch || {};
    if (rec.ch[index]) return 0;
    rec.ch[index] = true;
    save();
    return addXp(XP.challenge, 'challenge done');
  }

  // --- study timer: only counts while the app is on screen and you're actually using it
  function tick(seconds) {
    const d = day();
    d.s += seconds;
    if (!d.goal && d.s >= GOAL_SECONDS) {
      d.goal = true;
      save();
      emit('goal');
      addXp(XP.dailyGoal, 'daily goal');
    } else {
      save();
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
    return !!d && (d.s >= 60 || d.xp > 0);
  }
  function streak() {
    const date = new Date();
    if (!activeOn(dayKey(date))) date.setDate(date.getDate() - 1); // today isn't over yet
    let count = 0;
    while (activeOn(dayKey(date))) { count++; date.setDate(date.getDate() - 1); }
    return count;
  }

  // --- backup
  function exportJson() {
    return JSON.stringify(Object.assign({}, state, { exportedAt: new Date().toISOString() }), null, 2);
  }
  function importJson(text) {
    let s;
    try { s = JSON.parse(text); } catch (e) { return { ok: false, error: "That file isn't a readable backup (it's not valid JSON)." }; }
    if (!isValid(s)) return { ok: false, error: "That file doesn't look like a Lab Notes backup." };
    delete s.exportedAt;
    state = s;
    save();
    emit('change');
    return { ok: true };
  }
  function reset() {
    state = blank();
    save();
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
    dayKey: dayKey,
    addXp: addXp,
    markStarted: markStarted,
    recordAnswer: recordAnswer,
    finishQuiz: finishQuiz,
    challengeDone: challengeDone,
    todaySeconds: function () { return (state.days[dayKey()] || {}).s || 0; },
    streak: streak,
    daysStudied: function () { return Object.keys(state.days).filter(activeOn).length; },
    exportJson: exportJson,
    importJson: importJson,
    reset: reset,
  };
})();
