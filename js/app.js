/* Lab Notes: the app itself (pages, quiz, celebrations, backup).
   Pages are chosen by the part of the address after "#":
   #/  dashboard · #/module/0  a module · #/lesson/m0-2  a lesson · #/backup  backup & restore */
(function () {
  'use strict';

  const S = window.LabStore;
  const SFX = window.SFX;
  const Mascot = window.Mascot;
  const BB = window.Breadboard;
  const COURSE = window.LabNotesCourse;
  const LESSONS = window.LabNotesLessons || {};
  const LINES = Mascot.LINES;
  const pick = Mascot.pick;

  const app = document.getElementById('app');
  const overlayRoot = document.getElementById('overlay-root');
  const toastRoot = document.getElementById('toast-root');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isStandalone = () => window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  let installPrompt = null; // Chrome/Edge hand us this when the app can be installed

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const passMark = (n) => Math.ceil(n * 0.6);

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // ---------- course helpers
  const FLAT = [];
  COURSE.modules.forEach((m) => m.lessons.forEach((l, i) => FLAT.push(Object.assign({}, l, { module: m, num: i + 1 }))));
  const findLesson = (id) => FLAT.find((l) => l.id === id);
  const isReady = (id) => !!LESSONS[id];
  const isDone = (id) => !!S.lesson(id).done;
  const nextLesson = () => FLAT.find((l) => isReady(l.id) && !isDone(l.id));

  // ---------- top bar, toasts
  function updateTopbar(bump) {
    $('#chipXp').textContent = S.get().xp;
    $('#chipStreak').textContent = S.streak();
    $('#chipGoal').textContent = Math.min(20, Math.floor(S.todaySeconds() / 60));
    if (bump && !reduceMotion) {
      const chip = $('.chip-xp');
      chip.classList.remove('bump');
      void chip.offsetWidth;
      chip.classList.add('bump');
    }
  }

  function toast(html, kind) {
    const t = document.createElement('div');
    t.className = 'toast ' + (kind || '');
    t.innerHTML = html;
    toastRoot.appendChild(t);
    setTimeout(() => t.classList.add('out'), 2300);
    setTimeout(() => t.remove(), 2800);
  }

  // ---------- full-screen overlays (one at a time, queued)
  const overlayQueue = [];
  let overlayOpen = false;

  function queueOverlay(build) {
    overlayQueue.push(build);
    if (!overlayOpen) nextOverlay();
  }

  function nextOverlay() {
    const build = overlayQueue.shift();
    if (!build) { overlayOpen = false; return; }
    overlayOpen = true;
    const spec = build();
    const el = document.createElement('div');
    el.className = 'overlay ' + (spec.className || '');
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.innerHTML =
      (spec.plain ? '' : '<div class="speedlines" aria-hidden="true"></div>') +
      (spec.confetti && !reduceMotion ? confetti() : '') +
      '<div class="overlay-inner">' + (spec.plain ? '' : '<div class="overlay-ohmi"></div>') + spec.html + '</div>';
    overlayRoot.appendChild(el);
    if (!spec.plain) Mascot.mount($('.overlay-ohmi', el), { variant: 'big' }).setMood(spec.mood || 'proud');
    if (spec.sound) SFX.play(spec.sound);

    let closed = false;
    function close(action) {
      if (closed) return;
      closed = true;
      document.removeEventListener('keydown', onKey);
      el.classList.add('closing');
      setTimeout(() => {
        el.remove();
        if (spec.onClose) spec.onClose(action);
        nextOverlay();
      }, 180);
    }
    function onKey(e) { if (e.key === 'Escape') close('close'); }
    document.addEventListener('keydown', onKey);
    el.addEventListener('click', (e) => {
      const b = e.target.closest('[data-action]');
      if (b) close(b.getAttribute('data-action'));
    });
    const first = $('[data-action]', el);
    if (first) setTimeout(() => first.focus(), 50);
  }

  function confetti() {
    const colors = ['#ff3ea5', '#22e6ff', '#ffd23f', '#b6ff3b', '#9b5cff'];
    let s = '<div class="confetti" aria-hidden="true">';
    for (let i = 0; i < 46; i++) {
      s += '<span style="left:' + (Math.random() * 100).toFixed(1) + '%;background:' + colors[i % colors.length] +
        ';animation-duration:' + (2.2 + Math.random() * 2.2).toFixed(2) + 's;animation-delay:' + (Math.random() * 0.8).toFixed(2) + 's"></span>';
    }
    return s + '</div>';
  }

  function confirmBox(opts, onYes) {
    queueOverlay(() => ({
      className: 'modal',
      plain: true,
      html: `<div class="card modal-card">
          <h2>${opts.title}</h2>
          <p>${opts.body}</p>
          <div class="btn-row center">
            <button class="btn ${opts.danger ? 'btn-danger' : 'btn-primary'}" data-action="yes">${opts.yes}</button>
            <button class="btn btn-ghost" data-action="no">Cancel</button>
          </div>
        </div>`,
      onClose: (a) => { if (a === 'yes') onYes(); },
    }));
  }

  // Dramatic reaction to a wrong answer: shake, red flash and a comic "WHAAAT?!"
  function shockFx(el) {
    if (!reduceMotion) {
      el.classList.remove('shake');
      void el.offsetWidth;
      el.classList.add('shake');
      const f = document.createElement('div');
      f.className = 'flash';
      document.body.appendChild(f);
      setTimeout(() => f.remove(), 450);
    }
    const b = document.createElement('div');
    b.className = 'burst';
    b.textContent = pick(LINES.burst);
    el.appendChild(b);
    setTimeout(() => b.remove(), 1500);
  }

  // ---------- reacting to progress events
  S.on('xp', (e) => {
    toast('<b>+' + e.gained + ' XP</b> · ' + esc(e.reason), 'xp');
    if (e.reason === 'challenge done') SFX.play('coin');
    updateTopbar(true);
    refreshStats();
    if (e.rankUp) {
      const r = e.rankUp;
      // wait a moment so a "Mission complete" screen can go first
      setTimeout(() => queueOverlay(() => ({
        className: 'rankup', confetti: true, mood: 'proud', sound: 'levelUp',
        html: `<p class="eyebrow">Promotion!</p>
          <h2 class="mission-title">RANK UP!</h2>
          <p class="rank-new">${r.emoji} ${esc(r.title)}</p>
          <p class="mission-quote">“${pick(LINES.rankUp)}”</p>
          <button class="btn btn-primary" data-action="close">Accept promotion</button>`,
      })), 0);
    }
  });

  S.on('goal', () => {
    setTimeout(() => queueOverlay(() => ({
      className: 'goal', confetti: true, mood: 'happy', sound: 'goal',
      html: `<h2 class="mission-title">20 MINUTES!</h2>
        <p class="mission-sub">Daily goal smashed · <span class="xp-pill">+${S.XP.dailyGoal} XP</span></p>
        <p class="mission-quote">“${pick(LINES.goal)}”</p>
        <button class="btn btn-primary" data-action="close">Keep going</button>`,
    })), 0);
  });

  S.on('tick', () => { updateTopbar(); refreshStats(); });
  S.on('change', () => route());

  // ---------- router
  let current = null; // the lesson on screen, if any

  function route() {
    const parts = location.hash.replace(/^#\/?/, '').split('/');
    const view = parts[0];
    const arg = decodeURIComponent(parts[1] || '');
    current = null;
    const isSettings = view === 'settings' || view === 'backup';
    $$('.nav a').forEach((a) => a.classList.toggle('active', a.getAttribute('data-nav') === (isSettings ? 'settings' : 'home')));
    if (view === 'lesson') viewLesson(arg);
    else if (view === 'module') viewModule(arg);
    else if (view === 'meter') viewMeter();
    else if (isSettings) viewSettings();
    else viewDashboard();
    updateTopbar();
  }

  window.addEventListener('hashchange', () => { route(); window.scrollTo(0, 0); });

  // ---------- dashboard
  function greeting() {
    const st = S.get();
    if (st.xp === 0 && !Object.keys(st.lessons).length) {
      return 'Oh! A new intern! I’m <b>Dr. Ohmi</b>, chief (and only) lab assistant. Let’s learn electronics without exploding anything. Probably. ⚡';
    }
    if (S.todaySeconds() >= S.GOAL_SECONDS) return pick(LINES.goalDone);
    const h = new Date().getHours();
    if (h < 5) return 'Studying at this hour?! Truly the mad scientist lifestyle. 🌙';
    if (h < 12) return pick(LINES.morning);
    return pick(LINES.greet);
  }

  function statsHtml() {
    const st = S.get();
    const r = S.rankInfo(st.xp);
    const streak = S.streak();
    const secs = S.todaySeconds();
    const mins = Math.floor(secs / 60);
    const pct = Math.min(1, secs / S.GOAL_SECONDS);
    const C = 2 * Math.PI * 30;
    return `
      <div class="card stat">
        <div class="stat-icon">${r.rank.emoji}</div>
        <div class="stat-body">
          <p class="eyebrow">Rank</p>
          <p class="stat-value">${esc(r.rank.title)}</p>
          <div class="bar"><span style="width:${(r.progress * 100).toFixed(1)}%"></span></div>
          <p class="small muted">${r.next ? `${st.xp} XP · ${r.next.xp - st.xp} more to <b>${esc(r.next.title)}</b>` : `${st.xp} XP · maximum rank. Bow before your genius.`}</p>
          <button class="linklike" type="button" data-ranks>See all ranks</button>
        </div>
      </div>
      <div class="card stat">
        <div class="stat-icon ${streak ? 'lit' : 'unlit'}">🔥</div>
        <div class="stat-body">
          <p class="eyebrow">Daily streak</p>
          <p class="stat-value">${streak} day${streak === 1 ? '' : 's'}</p>
          <p class="small muted">${streak ? 'Study at least 1 minute a day to keep it alive.' : 'Study for 1 minute today to start your streak!'}</p>
        </div>
      </div>
      <div class="card stat">
        <svg class="ring" viewBox="0 0 76 76" aria-hidden="true">
          <circle class="ring-track" cx="38" cy="38" r="30"/>
          <circle class="ring-fill ${pct >= 1 ? 'full' : ''}" cx="38" cy="38" r="30" stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${(C * (1 - pct)).toFixed(1)}"/>
        </svg>
        <div class="stat-body">
          <p class="eyebrow">Today’s goal</p>
          <p class="stat-value">${Math.min(mins, 999)} / 20 min</p>
          <p class="small muted">${pct >= 1 ? 'Goal done! Anything extra is bonus science.' : 'The timer runs while you’re actively using the app.'}</p>
        </div>
      </div>`;
  }

  function refreshStats() {
    const el = $('#stats');
    if (el) el.innerHTML = statsHtml();
  }

  function moduleCard(m) {
    const total = m.lessons.length;
    const done = m.lessons.filter((l) => isDone(l.id)).length;
    const ready = m.lessons.filter((l) => isReady(l.id)).length;
    return `<a class="module-card ${ready ? '' : 'locked'} ${m.boss ? 'boss' : ''}" href="#/module/${m.id}" style="--accent:${m.color}">
        ${m.boss ? '<span class="boss-badge">FINAL BOSS</span>' : ''}
        <span class="module-num">MODULE ${m.id}</span>
        <span class="module-icon" aria-hidden="true">${m.icon}</span>
        <h3>${esc(m.title)}</h3>
        <p>${esc(m.blurb)}</p>
        <div class="bar"><span style="width:${(done / total) * 100}%"></span></div>
        <span class="module-meta">${done}/${total} lessons${ready ? '' : ` · arrives in Phase ${m.phase}`}</span>
      </a>`;
  }

  function viewDashboard() {
    const total = FLAT.length;
    const done = FLAT.filter((l) => isDone(l.id)).length;
    const next = nextLesson();
    app.innerHTML = `
      <section class="hero card">
        <div class="hero-stage" id="heroOhmi"></div>
        <div class="hero-text">
          <p class="eyebrow">Secret lab · access granted</p>
          <h1 class="title-neon">Lab Notes</h1>
          <p class="muted">From “what even is voltage?” to reading your own muscle signals with an Arduino.</p>
          <div class="course-progress">
            <div class="bar big"><span style="width:${(done / total) * 100}%"></span></div>
            <span class="small muted">${done} of ${total} lessons complete</span>
          </div>
          <div class="btn-row">
            ${next
              ? `<a class="btn btn-primary" href="#/lesson/${next.id}">▶ ${S.lesson(next.id).started ? 'Continue' : 'Start'}: ${esc(next.title)}</a>`
              : '<p class="muted">You’ve finished every lesson that exists so far. More arrive soon!</p>'}
          </div>
        </div>
      </section>

      <section class="stats" id="stats">${statsHtml()}</section>

      <section>
        <h2 class="section-title">Mission map</h2>
        <div class="module-grid">${COURSE.modules.map(moduleCard).join('')}</div>
      </section>

      <section class="card backup-strip meter-strip">
        <p>💪 <b>Muscle Meter:</b> the final-boss tool. Connect your EMG sensor (laptop, Chrome or Edge), or play with Demo mode anywhere.</p>
        <a class="btn btn-primary" href="#/meter">Open the Muscle Meter</a>
      </section>

      <section class="card backup-strip">
        <p>💾 Your progress is saved in <b>this browser on this device</b> only. Back it up now and then!</p>
        <a class="btn btn-ghost" href="#/settings">Backup &amp; restore</a>
      </section>`;
    Mascot.mount($('#heroOhmi'), { variant: 'hero' }).say(greeting());
  }

  // ---------- module page
  function viewModule(arg) {
    const m = COURSE.modules.find((x) => String(x.id) === String(arg));
    if (!m) return viewNotFound();
    const ready = m.lessons.filter((l) => isReady(l.id)).length;
    app.innerHTML = `
      <nav class="crumbs"><a href="#/">Lab</a> › Module ${m.id}</nav>
      <header class="card module-head" style="--accent:${m.color}">
        <span class="module-icon big" aria-hidden="true">${m.icon}</span>
        <div>
          <p class="eyebrow">Module ${m.id}${m.boss ? ' · Final boss' : ''}</p>
          <h1>${esc(m.title)}</h1>
          <p class="muted">${esc(m.blurb)}</p>
        </div>
      </header>
      <div id="modOhmi" class="side-ohmi"></div>
      <ol class="lesson-list">
        ${m.lessons.map((l, i) => {
          const r = isReady(l.id), d = isDone(l.id);
          const status = d ? '<span class="status done">✓ Done</span>'
            : r ? '<span class="status ready">Ready</span>'
            : `<span class="status soon">Phase ${m.phase}</span>`;
          return `<li><a class="lesson-row ${r ? '' : 'soon'}" href="#/lesson/${l.id}">
              <span class="lesson-num">${i + 1}</span><span class="lesson-title">${esc(l.title)}</span>${status}</a></li>`;
        }).join('')}
      </ol>`;
    Mascot.mount($('#modOhmi'), { variant: 'mini' }).say(ready
      ? pick(LINES.module)
      : `This module is still being built in the lab. It arrives in <b>Phase ${m.phase}</b>. I’m only <i>slightly</i> on fire about it.`, ready ? null : 'think');
  }

  // ---------- lesson page
  let bbConfigs = [];
  let wgConfigs = [];

  function renderSection(s) {
    const title = s.title ? `<h2>${s.title}</h2>` : '';
    switch (s.type) {
      case 'breadboard': {
        const i = bbConfigs.push(s) - 1;
        return `<section class="card">${title}${s.html || ''}<div class="bb" data-bb="${i}"></div></section>`;
      }
      case 'widget': {
        const i = wgConfigs.push(s) - 1;
        return `<section class="card">${title}${s.html || ''}<div class="wg" data-wg="${i}"></div>${s.after || ''}</section>`;
      }
      case 'code':
        return `<section class="card">${title}${s.html || ''}
          <div class="code-box"><button class="btn btn-ghost code-copy" type="button" data-copy-code>📋 Copy code</button>
          <pre class="code"><code>${esc(s.code)}</code></pre></div>${s.after || ''}</section>`;
      case 'danger':
        return `<section class="card callout danger">${title}${s.html}</section>`;
      case 'tip':
        return `<section class="card callout tip"><h3>${s.title || '💡 Lab habit'}</h3>${s.html}</section>`;
      case 'jargon':
        return `<section class="card callout jargon"><h3>📖 ${s.title || 'Words to know'}</h3>
          <dl>${s.terms.map((t) => `<div><dt>${t[0]}</dt><dd>${t[1]}</dd></div>`).join('')}</dl></section>`;
      default:
        return `<section class="card prose">${title}${s.html}</section>`;
    }
  }

  function videoCard(v) {
    const m = /(?:v=|youtu\.be\/|shorts\/)([\w-]{11})/.exec(v.url);
    const thumb = m ? `style="background-image:url('https://i.ytimg.com/vi/${m[1]}/hqdefault.jpg')"` : '';
    return `<a class="video" href="${esc(v.url)}" target="_blank" rel="noopener">
        <span class="video-thumb" ${thumb}><span class="play" aria-hidden="true">▶</span></span>
        <span class="video-info">
          <span class="video-title">${esc(v.title)}</span>
          <span class="video-channel">${esc(v.channel)}</span>
          <span class="video-desc">${esc(v.desc)}</span>
        </span>
      </a>`;
  }

  function challengeCard(c, i, id) {
    const done = !!(S.lesson(id).ch || {})[i];
    const diagram = c.diagram ? `<div class="bb" data-bb="${bbConfigs.push(c.diagram) - 1}"></div>` : '';
    return `<article class="card challenge ${c.type}">
        <span class="tag ${c.type}">${c.type === 'build' ? '🔧 Build it for real' : '🖥️ Simulate it'}</span>
        <h3>${c.title}</h3>
        <p>${c.why}</p>
        ${c.parts ? `<p class="parts"><b>You need:</b> ${c.parts.join(' · ')}</p>` : ''}
        ${diagram}
        <ol class="steps">${c.steps.map((s) => `<li>${s}</li>`).join('')}</ol>
        ${c.troubleshoot ? `<details class="trouble"><summary>Not working? Check these</summary><ul>${c.troubleshoot.map((t) => `<li>${t}</li>`).join('')}</ul></details>` : ''}
        <div class="btn-row">
          ${c.link ? (c.link.url.charAt(0) === '#'
            ? `<a class="btn btn-ghost" href="${esc(c.link.url)}">${esc(c.link.label)} →</a>`
            : `<a class="btn btn-ghost" href="${esc(c.link.url)}" target="_blank" rel="noopener">${esc(c.link.label)} ↗</a>`) : ''}
          <button class="btn ${done ? 'btn-done' : 'btn-cyan'}" type="button" data-challenge="${i}" ${done ? 'disabled' : ''}>${done ? '✓ Done' : `I did it! (+${S.XP.challenge} XP)`}</button>
        </div>
      </article>`;
  }

  function askPrompt(meta, L) {
    return [
      'Hi Claude! I’m a total beginner learning electronics with my study app "Lab Notes". I can’t really code yet, so please explain simply, define any jargon in a few words, and help me understand WHY things work, not just what to do.',
      '',
      `I’m on Module ${meta.module.id} (${meta.module.title}), lesson ${meta.num}: "${meta.title}".`,
      `What the lesson covers: ${L.summary}`,
      '',
      `My kit: ${COURSE.kit.join(', ')}.`,
      '',
      'I’m stuck on: [describe what you tried, what you expected, and what actually happened]',
    ].join('\n');
  }

  function viewLesson(id) {
    const meta = findLesson(id);
    if (!meta) return viewNotFound();
    const L = LESSONS[id];
    if (!L) return viewComingSoon(meta);
    const m = meta.module;
    S.markStarted(id);
    bbConfigs = [];
    wgConfigs = [];
    const idx = FLAT.indexOf(meta);
    const prev = FLAT[idx - 1];
    const next = FLAT[idx + 1];
    app.innerHTML = `
      <nav class="crumbs"><a href="#/">Lab</a> › <a href="#/module/${m.id}">Module ${m.id}: ${esc(m.title)}</a></nav>
      <header class="card lesson-head">
        <p class="eyebrow">Module ${m.id} · Lesson ${meta.num} · about ${L.minutes} min</p>
        <h1 class="title-neon">${esc(meta.title)}</h1>
        <p id="doneBadge" class="done-badge" ${isDone(id) ? '' : 'hidden'}>✓ Mission complete</p>
        <div id="headOhmi" class="side-ohmi"></div>
      </header>

      ${L.sections.map(renderSection).join('')}

      <section class="card">
        <h2>📺 Watch it explained</h2>
        <div class="videos">${L.videos.map(videoCard).join('')}</div>
        <p class="note">Heads-up: YouTube videos sometimes get deleted or moved, so a link might be dead. If one is, try this
          <a href="https://www.youtube.com/results?search_query=${encodeURIComponent(L.search)}" target="_blank" rel="noopener">YouTube search for “${esc(L.search)}”</a>.</p>
      </section>

      <section class="card quiz" id="quiz"></section>

      <section>
        <h2 class="section-title">🛠️ Hands-on challenges</h2>
        <div class="challenges">${L.challenges.map((c, i) => challengeCard(c, i, id)).join('')}</div>
      </section>

      <section class="card ask">
        <h2>🤖 Stuck? Ask Claude</h2>
        <p>This copies a ready-made message about this lesson. Paste it into <a href="https://claude.ai" target="_blank" rel="noopener">Claude</a>, then replace the last line with what’s confusing you.</p>
        <div class="btn-row"><button class="btn btn-cyan" type="button" data-ask>📋 Copy my question for Claude</button></div>
        <details><summary>Show the message</summary><pre class="prompt">${esc(askPrompt(meta, L))}</pre></details>
      </section>

      <nav class="lesson-nav">
        ${prev ? `<a class="btn btn-ghost" href="#/lesson/${prev.id}">← ${esc(prev.title)}</a>` : '<span></span>'}
        ${next ? `<a class="btn btn-ghost" href="#/lesson/${next.id}">${esc(next.title)} →</a>` : ''}
      </nav>`;

    $$('[data-bb]', app).forEach((el) => BB.render(el, Object.assign({ onSelect: () => SFX.play('spark') }, bbConfigs[+el.getAttribute('data-bb')])));
    $$('[data-wg]', app).forEach((el) => window.Widgets.render(el, wgConfigs[+el.getAttribute('data-wg')]));
    Mascot.mount($('#headOhmi'), { variant: 'mini' }).say(L.intro);
    current = { id: id, meta: meta, L: L };
    renderQuiz();
  }

  function renderQuiz() {
    const id = current.id;
    const L = current.L;
    const box = $('#quiz');
    const total = L.quiz.length;
    const need = passMark(total);
    const run = { answered: 0, score: 0, xp: 0 };

    box.innerHTML = `
      <h2>🧪 Pop quiz</h2>
      <p class="muted">${total} questions. Get ${need} right to complete the mission. Wrong answers explain themselves, so they still count as learning!</p>
      <div id="quizOhmi" class="side-ohmi"></div>
      ${L.quiz.map((q, qi) => `
        <div class="q" data-q="${qi}">
          <p class="q-text"><span class="q-num">Q${qi + 1}</span> ${q.q}</p>
          <div class="opts">${shuffle(q.options.map((o, oi) => oi)).map((oi) =>
            `<button class="opt" type="button" data-o="${oi}">${q.options[oi].t}</button>`).join('')}</div>
          <div class="feedback" hidden></div>
        </div>`).join('')}
      <div class="quiz-result" hidden></div>`;

    const ohmi = Mascot.mount($('#quizOhmi'), { variant: 'mini' });
    ohmi.say(pick(LINES.quizStart));

    box.onclick = (e) => {
      const btn = e.target.closest('.opt');
      if (btn) { answer(btn); return; }
      if (e.target.closest('[data-retry]')) { renderQuiz(); $('#quiz').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' }); }
    };

    function answer(btn) {
      const qEl = btn.closest('.q');
      if (qEl.classList.contains('done')) return;
      const qi = +qEl.getAttribute('data-q');
      const oi = +btn.getAttribute('data-o');
      const q = L.quiz[qi];
      const right = oi === q.answer;
      qEl.classList.add('done', right ? 'right' : 'wrong');
      $$('.opt', qEl).forEach((b) => {
        b.disabled = true;
        if (+b.getAttribute('data-o') === q.answer) b.classList.add('is-answer');
      });
      if (!right) btn.classList.add('picked-wrong');
      const fb = $('.feedback', qEl);
      fb.hidden = false;
      fb.innerHTML = right
        ? `<b>✅ Correct!</b> ${q.explain}`
        : `<b>❌ Not quite.</b> ${q.options[oi].why || ''}<br><b>Right answer:</b> ${q.options[q.answer].t}. ${q.explain}`;
      run.answered++;
      if (right) {
        run.score++;
        run.xp += S.recordAnswer(id, qi, true);
        SFX.play('correct');
        ohmi.say(pick(LINES.correct), 'happy', { voiceDelay: 0.6 });
      } else {
        S.recordAnswer(id, qi, false);
        const sound = pick(['wrong', 'wrong', 'sting']); // buzzer most of the time, sometimes full drama
        SFX.play(sound);
        ohmi.say(pick(LINES.wrong), 'shock', { voiceDelay: sound === 'sting' ? 1.2 : 0.75 });
        shockFx(qEl);
      }
      if (run.answered === total) setTimeout(finish, 900);
    }

    function finish() {
      const res = S.finishQuiz(id, run.score, total);
      const out = $('.quiz-result', box);
      out.hidden = false;
      out.innerHTML = `
        <p class="score display">Score: ${run.score} / ${total}</p>
        <p>${res.passed
          ? (res.firstPass ? 'Mission complete! This lesson is now marked as done.' : 'Passed again. Your brain is officially charged. ⚡')
          : `You need ${need} to pass. Re-read the notes above and try again!`}</p>
        <div class="btn-row center"><button class="btn btn-ghost" type="button" data-retry>↻ Retake quiz</button></div>`;
      if (res.passed) {
        const badge = $('#doneBadge');
        if (badge) badge.hidden = false;
        ohmi.say(pick(LINES.pass), 'proud', { silent: true });
        const xp = run.xp + res.gained;
        queueOverlay(() => ({
          className: 'win', confetti: true, mood: 'proud', sound: 'fanfare',
          html: `<h2 class="mission-title">MISSION<br>COMPLETE!</h2>
            <p class="mission-sub">Score ${run.score}/${total}${xp ? ` · <span class="xp-pill">+${xp} XP</span>` : ''}</p>
            <p class="mission-quote">“${pick(LINES.pass)}”</p>
            <div class="btn-row center">
              <button class="btn btn-primary" data-action="close">Back to the lesson</button>
              <a class="btn btn-ghost" href="#/" data-action="home">Lab dashboard</a>
            </div>`,
        }));
        // finished EVERY lesson? Time for graduation.
        if (res.firstPass && FLAT.every((l) => isDone(l.id))) {
          queueOverlay(() => ({
            className: 'win grad', confetti: true, mood: 'proud', sound: 'levelUp',
            html: `<p class="eyebrow">All 27 lessons complete</p>
              <h2 class="mission-title">COURSE<br>CLEARED!</h2>
              <p class="mission-sub">From “what is voltage?” to reading your own muscles. 🧠⚡💪</p>
              <p class="mission-quote">“I… I’m not crying. It’s just solder flux in my eyes. Congratulations, Mad Scientist.”</p>
              <button class="btn btn-primary" data-action="close">Accept graduation</button>`,
          }));
        }
      } else {
        ohmi.say(pick(LINES.fail), 'shock', { silent: true });
        queueOverlay(() => ({
          className: 'fail', mood: 'shock', sound: 'sadTrombone',
          html: `<h2 class="mission-title">MISSION…<br>FAILED?!</h2>
            <p class="mission-sub">Score ${run.score}/${total} · you need ${need}</p>
            <p class="mission-quote">“${pick(LINES.failQuote)}”</p>
            <div class="btn-row center">
              <button class="btn btn-primary" data-action="retry">↻ Try again</button>
              <button class="btn btn-ghost" data-action="close">Re-read the lesson</button>
            </div>`,
          onClose: (a) => {
            if (a === 'retry' && current && current.id === id) { renderQuiz(); $('#quiz').scrollIntoView(); }
          },
        }));
      }
    }
  }

  function viewComingSoon(meta) {
    const m = meta.module;
    const next = nextLesson();
    app.innerHTML = `
      <nav class="crumbs"><a href="#/">Lab</a> › <a href="#/module/${m.id}">Module ${m.id}: ${esc(m.title)}</a></nav>
      <section class="card">
        <p class="eyebrow">Module ${m.id} · Lesson ${meta.num}</p>
        <h1>${esc(meta.title)}</h1>
        <div id="soonOhmi" class="side-ohmi"></div>
        <div class="btn-row"><a class="btn btn-primary" href="#/">Back to the lab</a></div>
      </section>`;
    Mascot.mount($('#soonOhmi'), { variant: 'mini' }).say(
      `This lesson is still being assembled. It arrives in <b>Phase ${m.phase}</b>!` +
      (next ? ` Meanwhile, try <a href="#/lesson/${next.id}">${esc(next.title)}</a>.` : ''), 'think');
  }

  // ---------- the Muscle Meter page (js/meter.js)
  function viewMeter() {
    app.innerHTML = '<nav class="crumbs"><a href="#/">Lab</a> › <a href="#/module/7">Final boss</a> › Muscle Meter</nav><div id="meterRoot"></div>';
    window.MuscleMeter.mount($('#meterRoot'), {
      onBeam: (firstTime) => {
        queueOverlay(() => ({
          className: 'win beam', confetti: true, mood: 'proud', sound: 'fanfare',
          html: `<h2 class="mission-title">SUPER LAB<br>BEAM!!!</h2>
            <p class="mission-sub">Your muscle just powered a laser. Probably. ⚡</p>
            <p class="mission-quote">“${pick(['That was… beautiful. I need a moment.', 'The neighbours felt that one.', 'You are now officially more powerful than my coffee machine.'])}”</p>
            <button class="btn btn-primary" data-action="close">Charge it again</button>`,
        }));
        if (firstTime) S.addXp(50, 'Lab Beam fired');
      },
    });
  }

  function viewNotFound() {
    app.innerHTML = `<section class="card"><h1>404: Page vaporized</h1><div id="nfOhmi" class="side-ohmi"></div>
      <div class="btn-row"><a class="btn btn-primary" href="#/">Back to the lab</a></div></section>`;
    Mascot.mount($('#nfOhmi'), { variant: 'mini' }).say('I… may have zapped this page. Let’s pretend that didn’t happen.', 'shock');
  }

  // ---------- settings page (sound + backup)
  const SOUNDBOARD = [
    ['correct', '✅ Right answer'],
    ['wrong', '❌ Wrong answer'],
    ['sting', '😱 Dramatic'],
    ['fanfare', '🏆 Mission complete'],
    ['sadTrombone', '🎺 Mission failed'],
    ['levelUp', '⬆️ Rank up'],
    ['goal', '⏱ Daily goal'],
    ['boing', '🤪 Poke Ohmi'],
  ];

  function viewSettings() {
    const st = S.get();
    app.innerHTML = `
      <section class="card">
        <p class="eyebrow">Settings</p>
        <h1>🔊 Sound</h1>
        ${SFX.supported ? '' : '<p class="warn-msg">This browser can’t play the app’s sounds.</p>'}
        <label class="switch"><input type="checkbox" data-pref="sfx" ${SFX.get('sfx') ? 'checked' : ''}><span class="switch-ui" aria-hidden="true"></span>
          <span><b>Sound effects</b><br><span class="small muted">Quiz-show chimes, buzzers, dramatic stings and fanfares.</span></span></label>
        <label class="switch"><input type="checkbox" data-pref="voice" ${SFX.get('voice') ? 'checked' : ''}><span class="switch-ui" aria-hidden="true"></span>
          <span><b>Dr. Ohmi’s voice</b><br><span class="small muted">Cute gibberish babble whenever Ohmi talks.</span></span></label>
        <h3>🎛️ Soundboard</h3>
        <div class="soundboard">
          ${SOUNDBOARD.map((s) => `<button class="btn btn-ghost" type="button" data-sound="${s[0]}">${s[1]}</button>`).join('')}
          <button class="btn btn-ghost" type="button" data-voice>🗣️ Ohmi talks</button>
        </div>
        <p class="small muted">All sounds are made live by your browser (no audio files). On iPhone they follow your ring/silent switch.</p>
      </section>

      <section class="card prose">
        <p class="eyebrow">Install</p>
        <h1>📲 Put the lab on your home screen</h1>
        ${installHtml()}
      </section>

      <section class="card prose">
        <p class="eyebrow">Keep your progress safe</p>
        <h1>💾 Backup &amp; restore</h1>
        <p>Your XP, streak and finished lessons are saved <b>inside this browser, on this device</b>. Nothing is uploaded anywhere. That keeps the app free, but it means:</p>
        <ul>
          <li>Your laptop and your iPhone keep <b>separate</b> progress.</li>
          <li>Clearing your browser’s data would erase it.</li>
        </ul>
        <p>So export a backup file now and then. To move progress to another device: <b>Export</b> here, send the file to the other device (email it to yourself, OneDrive, AirDrop…), then <b>Import</b> it there.</p>
        <div class="summary-grid">
          <div><span class="display">${st.xp}</span><span>XP</span></div>
          <div><span class="display">${FLAT.filter((l) => isDone(l.id)).length}</span><span>lessons done</span></div>
          <div><span class="display">${S.daysStudied()}</span><span>days studied</span></div>
        </div>
        <div class="btn-row">
          <button class="btn btn-primary" type="button" data-export>💾 Export backup</button>
          <label class="btn btn-cyan">📂 Import backup<input class="visually-hidden" type="file" accept=".json,application/json" data-import></label>
        </div>
        <p class="import-msg" role="status"></p>
      </section>
      <section class="card callout danger">
        <h2>☢️ Danger zone</h2>
        <p>Wipe all progress on this device and start over as a brand-new Lab Intern. Export a backup first!</p>
        <button class="btn btn-danger" type="button" data-reset>Reset all progress</button>
      </section>`;

    $$('[data-pref]').forEach((box) => {
      box.onchange = () => {
        SFX.set(box.getAttribute('data-pref'), box.checked);
        updateSoundToggle();
        if (box.checked) {
          if (box.getAttribute('data-pref') === 'sfx') SFX.play('coin');
          else SFX.babble('happy', 0, 'Yay I can talk again!');
        }
      };
    });
    $$('[data-sound]').forEach((b) => { b.onclick = () => SFX.play(b.getAttribute('data-sound')); });
    const installBtn = $('[data-install]');
    if (installBtn) {
      installBtn.onclick = async () => {
        if (!installPrompt) return;
        installPrompt.prompt();
        await installPrompt.userChoice;
        installPrompt = null;
        installBtn.hidden = true;
      };
    }
    $('[data-voice]').onclick = () => SFX.babble(pick(['idle', 'happy', 'shock', 'think', 'proud']), 0, 'Hello intern, welcome to my secret lab!');

    $('[data-export]').onclick = exportBackup;
    $('[data-import]').onchange = (e) => {
      const file = e.target.files && e.target.files[0];
      e.target.value = '';
      if (file) importBackup(file);
    };
    $('[data-reset]').onclick = () => confirmBox({
      title: 'Reset EVERYTHING?',
      body: 'All XP, streaks and finished lessons on this device will be erased. This can’t be undone.',
      yes: 'Yes, wipe it',
      danger: true,
    }, () => {
      S.reset();
      toast('Progress reset. Welcome, new intern! 🧪');
      location.hash = '#/';
    });
  }

  const STORAGE_NOTE = '<p class="small muted">Heads-up: the installed app keeps its <b>own</b> progress, separate from the browser tab. ' +
    'To move progress between them, use Export and Import below.</p>';

  function installHtml() {
    if (isStandalone()) {
      return '<p>✅ You’re using the installed app. Dr. Ohmi lives on your home screen now!</p>' + STORAGE_NOTE;
    }
    if (isIOS) {
      return `<p>On iPhone, you install it from <b>Safari</b>:</p>
        <ol class="steps">
          <li>Open <b>${esc(location.href.split('#')[0])}</b> in Safari.</li>
          <li>Tap the <b>Share</b> button (the square with an arrow pointing up).</li>
          <li>Scroll down, tap <b>Add to Home Screen</b>, then tap <b>Add</b>.</li>
          <li>Open Lab Notes from its new icon. It works offline too!</li>
        </ol>` + STORAGE_NOTE;
    }
    return `<p>You can install Lab Notes as an app on this computer too. It gets its own window and icon, and works offline.</p>
      <div class="btn-row"><button class="btn btn-primary" type="button" data-install ${installPrompt ? '' : 'hidden'}>📲 Install Lab Notes</button></div>
      <p class="small muted" data-install-hint ${installPrompt ? 'hidden' : ''}>No button? In Chrome or Edge, look for the install icon (a small screen with a down arrow) at the right end of the address bar.</p>` + STORAGE_NOTE;
  }

  function exportBackup() {
    const json = S.exportJson();
    const name = 'lab-notes-backup-' + S.dayKey() + '.json';
    // On iPhone, the share sheet is the reliable way to save a file ("Save to Files").
    if (isIOS && navigator.canShare && typeof File === 'function') {
      const file = new File([json], name, { type: 'application/json' });
      if (navigator.canShare({ files: [file] })) {
        navigator.share({ files: [file], title: 'Lab Notes backup' }).catch(() => {});
        return;
      }
    }
    const url = URL.createObjectURL(new Blob([json], { type: 'application/json' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
    toast('💾 Saved <b>' + esc(name) + '</b> to your Downloads folder.');
  }

  function importBackup(file) {
    const reader = new FileReader();
    reader.onload = () => {
      confirmBox({
        title: 'Replace your progress?',
        body: 'Importing replaces the progress on this device with the progress saved in <b>' + esc(file.name) + '</b>.',
        yes: 'Import it',
      }, () => {
        const res = S.importJson(String(reader.result));
        if (res.ok) toast('✅ Backup imported!');
        else {
          const msg = $('.import-msg');
          if (msg) msg.textContent = '⚠️ ' + res.error;
        }
      });
    };
    reader.readAsText(file);
  }

  // ---------- copy to clipboard (with a fallback for older browsers)
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      const attempt = navigator.clipboard.writeText(text).then(() => true, () => fallbackCopy(text));
      // some browsers quietly wait for a permission that never comes: give up after 2 seconds
      const timeout = new Promise((resolve) => setTimeout(() => resolve(false), 2000));
      return Promise.race([attempt, timeout]);
    }
    return Promise.resolve(fallbackCopy(text));
  }
  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    ta.remove();
    return ok;
  }

  function showRanks() {
    const xp = S.get().xp;
    queueOverlay(() => ({
      className: 'ranks', mood: 'think',
      html: `<h2 class="mission-title small">RANK LADDER</h2>
        <ol class="rank-list">${S.RANKS.map((r) =>
          `<li class="${xp >= r.xp ? 'got' : ''}"><span>${r.emoji} ${esc(r.title)}</span><span>${r.xp} XP</span></li>`).join('')}</ol>
        <p class="small">How to earn XP: correct answer +${S.XP.correct} · pass a quiz +${S.XP.quizPass} · challenge +${S.XP.challenge} · daily 20-minute goal +${S.XP.dailyGoal}</p>
        <button class="btn btn-primary" data-action="close">Got it</button>`,
    }));
  }

  // ---------- sound on/off button in the top bar
  const soundBtn = $('#soundToggle');
  function updateSoundToggle() {
    const on = SFX.anyOn();
    soundBtn.textContent = on ? '🔊' : '🔇';
    soundBtn.setAttribute('aria-pressed', String(on));
    soundBtn.setAttribute('aria-label', on ? 'Sound is on. Tap to mute.' : 'Sound is off. Tap to turn it on.');
    $$('[data-pref]').forEach((box) => { box.checked = SFX.get(box.getAttribute('data-pref')); });
  }
  soundBtn.addEventListener('click', () => {
    const on = SFX.toggleAll();
    updateSoundToggle();
    toast(on ? '🔊 Sound on!' : '🔇 Sound off. Ohmi is sulking quietly.');
    if (on) SFX.play('coin');
  });
  updateSoundToggle();

  // a soft click for buttons and links (quiz answers and Ohmi have their own sounds)
  document.addEventListener('click', (e) => {
    if (e.target.closest('.btn, .nav a, .brand, .module-card, .lesson-row, .linklike, .video, summary') &&
        !e.target.closest('[data-sound], [data-voice]')) SFX.play('tap');
  });

  // ---------- clicks shared by several pages
  app.addEventListener('click', (e) => {
    const ch = e.target.closest('[data-challenge]');
    if (ch && current) {
      S.challengeDone(current.id, +ch.getAttribute('data-challenge'));
      ch.disabled = true;
      ch.classList.remove('btn-cyan');
      ch.classList.add('btn-done');
      ch.textContent = '✓ Done';
      return;
    }
    if (e.target.closest('[data-ask]') && current) {
      copyText(askPrompt(current.meta, current.L)).then((ok) => {
        if (ok) { toast('📋 Copied! Now paste it into Claude.'); return; }
        const box = $('.ask details');
        if (box) box.open = true;
        toast('Couldn’t copy automatically, so I opened the message below. Copy it by hand.');
      });
      return;
    }
    const codeBtn = e.target.closest('[data-copy-code]');
    if (codeBtn) {
      const code = codeBtn.parentElement.querySelector('code').textContent;
      copyText(code).then((ok) => toast(ok ? '📋 Code copied! Paste it into the Arduino IDE.' : 'Couldn’t copy automatically. Select the code and copy it by hand.'));
      return;
    }
    if (e.target.closest('[data-ranks]')) showRanks();
  });

  // ---------- installable app + offline mode
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault(); // we show our own Install button on the Settings page instead
    installPrompt = e;
    const btn = $('[data-install]');
    const hint = $('[data-install-hint]');
    if (btn) btn.hidden = false;
    if (hint) hint.hidden = true;
  });
  window.addEventListener('appinstalled', () => {
    installPrompt = null;
    toast('🎉 Lab Notes is installed!');
    SFX.play('levelUp');
  });
  window.addEventListener('offline', () => toast('📴 You’re offline. The lab still works!'));
  window.addEventListener('online', () => toast('📶 Back online.'));

  if ('serviceWorker' in navigator && window.isSecureContext) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch((err) => console.warn('Offline mode is unavailable:', err));
    });
  }

  route();
})();
