/* Lab Notes: sync progress between devices through the learner's own GitHub account (free).
   Progress lives in one secret gist called lab-notes-progress.json. Every device:
     1. downloads the gist,
     2. merges it with its own progress (nothing is ever lost, see LabStore.mergeIn),
     3. uploads the result if anything new came from this device.
   The token is kept only in this browser and only ever sent to api.github.com. */
(function () {
  'use strict';

  const S = window.LabStore;
  const KEY = 'labnotes.sync.v1';
  const FILE = 'lab-notes-progress.json';
  const API = 'https://api.github.com';
  const PERIOD_MS = 3 * 60 * 1000; // also sync every 3 minutes while you study (study time, streaks)

  let cfg = loadCfg();             // { token, login, gistId, gistUrl, lastSync, lastError }
  let busy = false;
  let again = false;
  let timer = null;
  const listeners = [];

  function loadCfg() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
  function saveCfg() {
    try { localStorage.setItem(KEY, JSON.stringify(cfg)); } catch (e) { /* private mode */ }
    listeners.forEach((fn) => { try { fn(status()); } catch (e) { console.error(e); } });
  }
  const enabled = () => !!cfg.token;

  function status() {
    return { connected: !!(cfg.token && cfg.gistId), login: cfg.login, lastSync: cfg.lastSync || null,
      lastError: cfg.lastError || null, gistUrl: cfg.gistUrl || null, busy: busy };
  }

  // ---- talking to GitHub
  async function gh(path, opts) {
    const o = opts || {};
    const headers = { Accept: 'application/vnd.github+json', Authorization: 'Bearer ' + cfg.token, 'X-GitHub-Api-Version': '2022-11-28' };
    if (o.body) headers['Content-Type'] = 'application/json';
    let res;
    try {
      res = await fetch(API + path, { method: o.method || 'GET', headers: headers, body: o.body, cache: 'no-store' });
    } catch (e) {
      throw Object.assign(new Error('network'), { code: 'network' });
    }
    if (res.status === 401) throw Object.assign(new Error('token'), { code: 'token' });
    if (!res.ok) throw Object.assign(new Error('HTTP ' + res.status), { code: 'http', status: res.status });
    return res.status === 204 ? null : res.json();
  }

  function explain(e) {
    if (e.code === 'token') return 'GitHub didn’t accept that token. Check you copied all of it (it starts with ghp_), or make a new one if it expired.';
    if (e.code === 'network') return navigator.onLine === false ? 'You’re offline. It will sync when you’re back online.' : 'Couldn’t reach GitHub just now. Will try again soon.';
    if (e.status === 403 || e.status === 404) return 'The token works, but it isn’t allowed to save gists. Make a new token with the “gist” box ticked.';
    if (e.status === 422) return 'GitHub refused the save (error 422). Try “Sync now” again in a minute.';
    return 'Sync hiccup (' + (e.message || 'unknown') + '). Will try again soon.';
  }

  async function findGist() {
    for (let page = 1; page <= 10; page++) {
      const list = await gh('/gists?per_page=100&page=' + page);
      const hit = list.find((g) => g.files && g.files[FILE]);
      if (hit) return hit;
      if (list.length < 100) return null;
    }
    return null;
  }

  async function createGist() {
    return gh('/gists', {
      method: 'POST',
      body: JSON.stringify({
        description: 'Lab Notes progress (synced by the Lab Notes app, please don’t edit)',
        public: false,
        files: { [FILE]: { content: S.snapshot() } },
      }),
    });
  }

  async function ensureGist() {
    if (cfg.gistId) return;
    const g = (await findGist()) || (await createGist());
    cfg.gistId = g.id;
    cfg.gistUrl = g.html_url;
  }

  // ---- the actual sync: download, merge, upload if needed
  async function syncNow() {
    if (!enabled()) return status();
    if (busy) { again = true; return status(); }
    busy = true;
    saveCfg();
    try {
      await ensureGist();
      const g = await gh('/gists/' + cfg.gistId);
      const f = g.files && g.files[FILE];
      let text = f ? f.content : null;
      if (f && f.truncated && f.raw_url) text = await fetch(f.raw_url, { cache: 'no-store' }).then((r) => r.text());
      let remote = null;
      try { remote = text ? JSON.parse(text) : null; } catch (e) { remote = null; }
      const res = remote ? S.mergeIn(remote) : { needsPush: true };
      if (!res.ok && remote) res.needsPush = true; // the cloud file was damaged: overwrite it with ours
      if (res.needsPush) {
        await gh('/gists/' + cfg.gistId, { method: 'PATCH', body: JSON.stringify({ files: { [FILE]: { content: S.snapshot() } } }) });
      }
      cfg.lastSync = Date.now();
      cfg.lastError = null;
    } catch (e) {
      if (e.status === 404 && cfg.gistId) { cfg.gistId = null; cfg.gistUrl = null; again = true; } // gist was deleted: make a new one
      cfg.lastError = explain(e);
    } finally {
      busy = false;
      saveCfg();
      if (again) { again = false; schedule(1500); }
    }
    return status();
  }

  function schedule(ms) {
    if (!enabled()) return;
    clearTimeout(timer);
    timer = setTimeout(syncNow, ms);
  }

  // ---- connect / disconnect (from the Settings page)
  async function connect(token) {
    const t = String(token || '').trim();
    if (!/^(ghp_|github_pat_)[A-Za-z0-9_]{20,}$/.test(t)) {
      return { ok: false, error: 'That doesn’t look like a GitHub token. It should start with ghp_ and be about 40 characters long.' };
    }
    cfg = { token: t };
    try {
      const me = await gh('/user');
      cfg.login = me.login;
      await ensureGist();
      saveCfg();
      await syncNow();
      if (cfg.lastError) return { ok: false, error: cfg.lastError };
      return { ok: true, login: cfg.login };
    } catch (e) {
      const msg = explain(e);
      cfg = {};
      saveCfg();
      return { ok: false, error: msg };
    }
  }

  function disconnect() {
    clearTimeout(timer);
    cfg = {};
    saveCfg();
  }

  // ---- when to sync automatically
  S.on('saved', (e) => { if (e.kind === 'progress') schedule(4000); });
  S.on('change', () => schedule(2000));
  window.addEventListener('online', () => schedule(1000));
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') schedule(1500);
    else if (enabled() && !busy) syncNow(); // leaving the app: save study time to the cloud
  });
  setInterval(() => { if (enabled() && document.visibilityState === 'visible') syncNow(); }, PERIOD_MS);
  if (enabled()) schedule(1500); // first sync shortly after opening the app

  window.LabSync = {
    connect: connect,
    disconnect: disconnect,
    syncNow: syncNow,
    status: status,
    onChange: function (fn) { listeners.push(fn); },
    TOKEN_URL: 'https://github.com/settings/tokens/new?scopes=gist&description=Lab%20Notes%20sync',
  };
})();
