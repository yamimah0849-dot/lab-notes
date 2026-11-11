/* Interactive breadboard diagram (SVG).
   Holes are named like a real board: rows a-j, columns 1-N, plus power rails:
   tn/tp = top rail (- / +), bp/bn = bottom rail (+ / -).  Example: "a5", "tp1". */
(function () {
  'use strict';

  const P = 18;    // distance between holes (a real breadboard uses 0.1 inch = 2.54 mm)
  const X0 = 70;   // x position of column 1
  const ROWS = { tn: 44, tp: 62, a: 98, b: 116, c: 134, d: 152, e: 170, f: 206, g: 224, h: 242, i: 260, j: 278, bp: 314, bn: 332 };
  const RAILS = { tn: 'top − rail', tp: 'top + rail', bp: 'bottom + rail', bn: 'bottom − rail' };

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function hole(id) {
    const m = /^(tn|tp|bp|bn|[a-j])(\d+)$/.exec(id);
    if (!m) throw new Error('Unknown breadboard hole: ' + id);
    return { x: X0 + (+m[2] - 1) * P, y: ROWS[m[1]], row: m[1], col: +m[2] };
  }

  function groupOf(row, col) {
    if (RAILS[row]) return row;                       // a whole rail is one connection
    return ('abcde'.indexOf(row) >= 0 ? 'T' : 'B') + col; // 5 holes in a column = one metal clip
  }

  function describe(id, g) {
    if (RAILS[g]) {
      const plus = g === 'tp' || g === 'bp';
      return 'This hole is on the <b class="' + (plus ? 'txt-pos' : 'txt-neg') + '">' + RAILS[g] +
        '</b>. Every hole along this whole row is connected, so you can grab ' + (plus ? 'power (+)' : 'ground (−)') +
        ' anywhere along it. (On some long boards the rail is split in the middle. Check yours!)';
    }
    const col = g.slice(1);
    const top = g[0] === 'T';
    const range = top ? 'a' + col + '–e' + col : 'f' + col + '–j' + col;
    const other = top ? 'f' + col + '–j' + col : 'a' + col + '–e' + col;
    return 'Hole <b>' + id + '</b> is connected to <b>' + range + '</b>: 5 holes sharing one metal clip. ' +
      'It is <i>not</i> connected to ' + other + ' across the middle gap.';
  }

  // ---- parts drawn on top of the board
  function drawPart(p) {
    if (p.type === 'wire') {
      const a = hole(p.from), b = hole(p.to);
      const lift = p.arc == null ? 18 : p.arc;
      const mx = (a.x + b.x) / 2, my = Math.min(a.y, b.y) - lift;
      return '<path class="bb-wire" d="M' + a.x + ' ' + a.y + ' Q' + mx + ' ' + my + ' ' + b.x + ' ' + b.y + '" stroke="' + p.color + '"/>' +
        '<circle class="bb-pin" cx="' + a.x + '" cy="' + a.y + '" r="3.2"/><circle class="bb-pin" cx="' + b.x + '" cy="' + b.y + '" r="3.2"/>';
    }
    if (p.type === 'lead') { // a wire coming from off the board (e.g. from the Arduino)
      const a = hole(p.hole);
      return '<path class="bb-wire" d="M' + a.x + ' ' + a.y + ' H4" stroke="' + p.color + '"/>' +
        '<circle class="bb-pin" cx="' + a.x + '" cy="' + a.y + '" r="3.2"/>' +
        '<text class="bb-lead-label" x="4" y="' + (a.y - 6) + '">' + esc(p.label) + '</text>';
    }
    if (p.type === 'resistor') {
      const a = hole(p.from), b = hole(p.to);
      const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
      const ang = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;
      const bands = p.bands || ['#d22', '#d22', '#7a4a1d', '#c9a227']; // red-red-brown-gold = 220 Ω
      let s = '<line class="bb-metal" x1="' + a.x + '" y1="' + a.y + '" x2="' + b.x + '" y2="' + b.y + '"/>' +
        '<g transform="translate(' + mx + ' ' + my + ') rotate(' + ang + ')"><rect class="bb-res" x="-13" y="-5" width="26" height="10" rx="4"/>';
      bands.forEach(function (c, i) { s += '<rect x="' + (-9 + i * 5 + (i === 3 ? 3 : 0)) + '" y="-5" width="2.6" height="10" fill="' + c + '"/>'; });
      return s + '</g>';
    }
    if (p.type === 'led') {
      const a = hole(p.anode), c = hole(p.cathode);
      const cx = (a.x + c.x) / 2, cy = Math.min(a.y, c.y) - 24;
      const color = p.color || '#ff2d2d';
      return '<path class="bb-metal" d="M' + a.x + ' ' + a.y + ' V' + (a.y - 10) + ' L' + (cx - 3) + ' ' + (cy + 8) + '"/>' +
        '<path class="bb-metal" d="M' + c.x + ' ' + c.y + ' V' + (c.y - 8) + ' L' + (cx + 3) + ' ' + (cy + 8) + '"/>' +
        '<circle class="bb-pin" cx="' + a.x + '" cy="' + a.y + '" r="2.4"/><circle class="bb-pin" cx="' + c.x + '" cy="' + c.y + '" r="2.4"/>' +
        '<g class="bb-led' + (p.lit ? ' lit' : '') + '" style="color:' + color + '">' +
        '<path d="M' + (cx - 9) + ' ' + (cy + 8) + ' V' + (cy - 2) + ' A9 9 0 0 1 ' + (cx + 9) + ' ' + (cy - 2) + ' V' + (cy + 8) + ' Z" fill="' + color + '" stroke="rgba(0,0,0,.35)"/>' +
        '<rect x="' + (cx - 11) + '" y="' + (cy + 6) + '" width="22" height="4" rx="1.5" fill="' + color + '" stroke="rgba(0,0,0,.35)"/>' +
        '<path d="M' + (cx - 5) + ' ' + (cy - 3) + ' Q' + (cx - 4) + ' ' + (cy - 8) + ' ' + cx + ' ' + (cy - 9) + '" stroke="rgba(255,255,255,.75)" stroke-width="2" fill="none" stroke-linecap="round"/></g>' +
        '<text class="bb-plus" x="' + (a.x - 12) + '" y="' + (a.y - 12) + '">+</text>';
    }
    return '';
  }

  function render(el, cfg) {
    const cols = cfg.cols || 20;
    const right = X0 + (cols - 1) * P;
    const W = right + 30;
    const H = 356;
    // style max-width keeps small boards from being blown up to giant size
    let s = '<svg class="bb-svg" viewBox="0 0 ' + W + ' ' + H + '" style="max-width:' + Math.round(W * 1.5) + 'px" role="img" aria-label="' + esc(cfg.label || 'Breadboard diagram') + '">';

    s += '<rect class="bb-board" x="' + (X0 - 22) + '" y="26" width="' + (right - X0 + 44) + '" height="324" rx="10"/>';
    s += '<rect class="bb-trench" x="' + (X0 - 22) + '" y="183" width="' + (right - X0 + 44) + '" height="10"/>';
    [[35, 'neg'], [71, 'pos'], [305, 'pos'], [341, 'neg']].forEach(function (l) {
      s += '<line class="bb-' + l[1] + '" x1="' + (X0 - 12) + '" x2="' + (right + 12) + '" y1="' + l[0] + '" y2="' + l[0] + '"/>';
    });
    [['tn', '−', 'neg'], ['tp', '+', 'pos'], ['bp', '+', 'pos'], ['bn', '−', 'neg']].forEach(function (r) {
      s += '<text class="bb-sign ' + r[2] + '" x="' + (right + 15) + '" y="' + (ROWS[r[0]] + 4.5) + '">' + r[1] + '</text>';
    });

    // highlight shapes for each connected group (hidden until you tap a hole)
    for (let c = 1; c <= cols; c++) {
      const x = X0 + (c - 1) * P;
      s += '<rect class="bb-glow" data-glow="T' + c + '" x="' + (x - 8) + '" y="' + (ROWS.a - 8) + '" width="16" height="' + (ROWS.e - ROWS.a + 16) + '" rx="5"/>';
      s += '<rect class="bb-glow" data-glow="B' + c + '" x="' + (x - 8) + '" y="' + (ROWS.f - 8) + '" width="16" height="' + (ROWS.j - ROWS.f + 16) + '" rx="5"/>';
    }
    Object.keys(RAILS).forEach(function (r) {
      s += '<rect class="bb-glow" data-glow="' + r + '" x="' + (X0 - 9) + '" y="' + (ROWS[r] - 8) + '" width="' + (right - X0 + 18) + '" height="16" rx="6"/>';
    });

    // labels
    'abcdefghij'.split('').forEach(function (r) {
      s += '<text class="bb-label" x="' + (X0 - 14) + '" y="' + (ROWS[r] + 3) + '" text-anchor="middle">' + r + '</text>';
    });
    for (let c = 1; c <= cols; c++) {
      if (c === 1 || c % 5 === 0) {
        const x = X0 + (c - 1) * P;
        s += '<text class="bb-label" x="' + x + '" y="87" text-anchor="middle">' + c + '</text>';
        s += '<text class="bb-label" x="' + x + '" y="299" text-anchor="middle">' + c + '</text>';
      }
    }

    // holes
    Object.keys(ROWS).forEach(function (r) {
      for (let c = 1; c <= cols; c++) {
        const x = X0 + (c - 1) * P, y = ROWS[r];
        s += '<g class="bb-h" data-h="' + r + c + '" data-g="' + groupOf(r, c) + '">' +
          '<rect class="bb-hit" x="' + (x - 9) + '" y="' + (y - 9) + '" width="18" height="18"/>' +
          '<rect class="bb-hole" x="' + (x - 3.5) + '" y="' + (y - 3.5) + '" width="7" height="7" rx="1.5"/></g>';
      }
    });

    // parts
    if (cfg.parts && cfg.parts.length) {
      s += '<g class="bb-parts">';
      cfg.parts.forEach(function (p) { s += drawPart(p); });
      s += '</g>';
    }
    s += '</svg>';

    let html = s;
    if (cfg.interactive) html += '<p class="bb-info" aria-live="polite">' + (cfg.hint || '👆 Tap any hole to reveal its secret connections.') + '</p>';
    if (cfg.caption) html += '<p class="bb-caption">' + cfg.caption + '</p>';
    el.innerHTML = html;
    el.classList.toggle('bb-interactive', !!cfg.interactive);

    if (cfg.interactive) {
      const svg = el.querySelector('svg');
      const info = el.querySelector('.bb-info');
      svg.addEventListener('click', function (e) {
        const h = e.target.closest('[data-h]');
        if (!h) return;
        const g = h.getAttribute('data-g');
        svg.querySelectorAll('.on, .sel').forEach(function (n) { n.classList.remove('on', 'sel'); });
        svg.querySelectorAll('[data-g="' + g + '"]').forEach(function (n) { n.classList.add('on'); });
        const glow = svg.querySelector('[data-glow="' + g + '"]');
        if (glow) glow.classList.add('on');
        h.classList.add('sel');
        info.innerHTML = describe(h.getAttribute('data-h'), g);
        if (cfg.onSelect) cfg.onSelect(h.getAttribute('data-h'), g);
      });
    }
  }

  window.Breadboard = { render: render };
})();
