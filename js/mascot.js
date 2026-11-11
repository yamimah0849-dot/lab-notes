/* Dr. Ohmi: the lab's original chibi mascot (drawn in SVG, no image files needed).
   Moods: idle, happy, shock, think, proud. Tap Ohmi for a joke. */
(function () {
  'use strict';

  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  const LINES = {
    greet: [
      "Welcome back to the secret lab! Nothing is on fire. Probably. 🔥",
      "Ah, my favorite intern! Goggles on. Brain on. Let's go! ⚡",
      "Today's forecast: 100% chance of SCIENCE.",
      "You came back! The capacitors missed you. (They told me.)",
      "Electrons are tiny, negative and always in a hurry. Relatable.",
    ],
    morning: [
      "Good morning! I've had four coffees and zero sleep. Let's learn things!",
      "Morning, intern! Fresh brain, fresh circuits. Perfect timing.",
    ],
    goalDone: [
      "20 minutes done today! You're more consistent than my coffee machine. ☕",
      "Daily goal: CRUSHED. Anything extra is bonus science.",
    ],
    joke: [
      "Why did the LED break up with the battery? It needed some <i>resistance</i>. 💔",
      "I once skipped the resistor. We don't talk about Tuesday.",
      "My goggles are cracked. Don't ask. Okay, ask later.",
      "Fun fact: I'm 30% caffeine and 70% static electricity.",
      "Ohm's law: V = I × R. Ohmi's law: snacks = productivity.",
      "Stop poking me! ...okay, one more. ⚡",
      "If you're shocked by how much you're learning, that's normal. Any other kind of shock: report to me immediately.",
    ],
    quizStart: [
      "Pop quiz time! No pressure. (A little pressure.) 😈",
      "Let's see what stuck in that beautiful brain!",
      "Questions incoming! Wrong answers come with explanations, so you can't really lose.",
    ],
    correct: [
      "CORRECT! My hair is sparking with joy! ⚡",
      "YES! Big-brain energy detected!",
      "Textbook! No wait, BETTER than textbook!",
      "Nailed it. I'm writing that on my clipboard. The non-burnt part.",
    ],
    wrong: [
      "WHAAAT?! ...okay, okay. Deep breath. The note below explains it.",
      "NOOOO— I mean, what a great learning opportunity!",
      "*dramatic gasp* The electrons are confused! Read why below.",
      "BZZZT! Close, but the circuit says no. Check the explanation!",
    ],
    burst: ['WHAAAT?!', 'NOOOO!', 'GASP!', 'BZZZT!', 'NANI?!'],
    pass: [
      "You did it! I'm adding you to the Lab Hall of Fame. (It's a sticky note.)",
      "Another mission down! The lab grows stronger!",
      "Flawless! Well, flaw-acceptable. Either way: VICTORY!",
    ],
    fail: ["Not quite enough this time. Re-read the notes and retry. You've got this!"],
    failQuote: [
      "Labs don't fail. They collect data. Re-read the notes and try again!",
      "Even I blew up three LEDs before lunch. Try again!",
      "Plot twist: this is just the training arc. Retry!",
    ],
    goal: [
      "Twenty whole minutes! Your future self says thank you.",
      "Daily goal reached! The streak flame grows stronger! 🔥",
    ],
    rankUp: [
      "Look at you climbing the ladder! I'll update your lab badge. With a marker.",
      "Promotion! Your lab coat now has slightly more authority.",
    ],
    module: [
      "Pick a lesson, intern! I recommend starting from the top.",
      "Ooh, this module is one of my favorites. (They all are.)",
    ],
  };

  const STAR = 'M0 -9 L2.5 -2.5 L9 0 L2.5 2.5 L0 9 L-2.5 2.5 L-9 0 L-2.5 -2.5 Z';
  const INK = '#2a2140';

  const SVG = `
<svg class="ohmi-svg" viewBox="0 0 220 262" aria-hidden="true" focusable="false">
  <defs>
    <radialGradient id="ohmiIris" cx="50%" cy="30%" r="75%">
      <stop offset="0" stop-color="#ffa6dc"/><stop offset=".5" stop-color="#e0399f"/><stop offset="1" stop-color="#5a1677"/>
    </radialGradient>
    <linearGradient id="ohmiHair" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#6ff7e0"/><stop offset="1" stop-color="#18a38c"/>
    </linearGradient>
    <linearGradient id="ohmiCoat" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#d9dcf5"/>
    </linearGradient>
    <radialGradient id="ohmiLens" cx="35%" cy="30%" r="80%">
      <stop offset="0" stop-color="#e9fdff"/><stop offset=".45" stop-color="#7ff0ff"/><stop offset="1" stop-color="#1aa7c4"/>
    </radialGradient>
  </defs>
  <g class="o-body">
    <path d="M46 108 Q40 38 110 32 Q180 38 174 108 Q176 150 160 172 L148 128 L72 128 L60 172 Q44 150 46 108 Z" fill="url(#ohmiHair)" stroke="#0f5e52" stroke-width="3" stroke-linejoin="round"/>
    <rect x="100" y="146" width="20" height="20" fill="#f3c6ad"/>
    <path d="M60 166 Q110 150 160 166 L184 250 Q110 266 36 250 Z" fill="url(#ohmiCoat)" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M96 158 L110 194 L124 158 Z" fill="${INK}"/>
    <path d="M112 166 L104 180 L110 180 L106 192 L117 176 L111 176 L115 166 Z" fill="#ffd23f" stroke="${INK}" stroke-width="1.5" stroke-linejoin="round"/>
    <path d="M94 160 L106 206 M126 160 L114 206" stroke="#a9a6d6" stroke-width="3" stroke-linecap="round" fill="none"/>
    <rect x="118" y="204" width="24" height="20" rx="3" fill="none" stroke="#a9a6d6" stroke-width="2.5"/>
    <path d="M124 204 L123 192" stroke-width="4" stroke-linecap="round" fill="none" stroke="#ff3ea5"/>
    <path d="M131 204 L133 194" stroke-width="4" stroke-linecap="round" fill="none" stroke="#22e6ff"/>
    <path d="M64 170 Q38 192 32 236 Q46 248 62 240 Q64 214 78 194 Z" fill="url(#ohmiCoat)" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M32 236 Q46 248 62 240" stroke="#a9a6d6" stroke-width="3" fill="none"/>
    <g transform="rotate(10 170 222)">
      <rect x="148" y="192" width="44" height="58" rx="5" fill="#b8743f" stroke="${INK}" stroke-width="3"/>
      <rect x="154" y="200" width="32" height="44" rx="2" fill="#fffdf4"/>
      <path d="M159 210 H181 M159 218 H178 M159 226 H182" stroke="#9aa0c8" stroke-width="2"/>
      <path d="M170 230 Q178 226 184 232 Q188 240 180 243 Q172 246 166 241 Q162 235 170 230 Z" fill="${INK}" stroke="#ff8a3d" stroke-width="1.5"/>
      <rect x="160" y="186" width="20" height="10" rx="2" fill="#c9cbe0" stroke="${INK}" stroke-width="2.5"/>
    </g>
    <path d="M156 170 Q186 188 188 218 Q178 230 164 224 Q160 204 144 192 Z" fill="url(#ohmiCoat)" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M188 218 Q178 230 164 224" stroke="#a9a6d6" stroke-width="3" fill="none"/>
    <path d="M58 104 Q58 162 110 164 Q162 162 162 104 Q162 64 110 62 Q58 64 58 104 Z" fill="#ffe6d5" stroke="${INK}" stroke-width="3"/>
    <path d="M58 84 Q44 128 60 160 Q64 132 72 104 Z M162 84 Q176 128 160 160 Q156 132 148 104 Z" fill="url(#ohmiHair)" stroke="#0f5e52" stroke-width="3" stroke-linejoin="round"/>
    <path d="M52 104 Q52 50 110 44 Q168 50 168 104 L156 84 L150 102 L138 80 L128 98 L116 76 L106 96 L94 78 L86 100 L74 82 L64 104 Z" fill="url(#ohmiHair)" stroke="#0f5e52" stroke-width="3" stroke-linejoin="round"/>
    <path d="M78 58 Q94 50 110 52" stroke="rgba(255,255,255,.65)" stroke-width="4" stroke-linecap="round" fill="none"/>
    <path class="o-ahoge" d="M106 50 L119 24 L111 25 L124 2 L101 31 L110 30 Z" fill="#ffd23f" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M48 74 Q110 50 172 74" stroke="${INK}" stroke-width="10" fill="none" stroke-linecap="round"/>
    <rect x="100" y="60" width="20" height="8" rx="3" fill="${INK}"/>
    <circle cx="86" cy="64" r="19" fill="${INK}"/><circle cx="86" cy="64" r="15" fill="#d99a48"/><circle cx="86" cy="64" r="11.5" fill="url(#ohmiLens)"/>
    <circle cx="134" cy="64" r="19" fill="${INK}"/><circle cx="134" cy="64" r="15" fill="#d99a48"/><circle cx="134" cy="64" r="11.5" fill="url(#ohmiLens)"/>
    <path d="M79 60 Q83 55 89 56 M127 60 Q131 55 137 56" stroke="#fff" stroke-width="2.5" stroke-linecap="round" fill="none"/>
    <path d="M138 56 L134 63 L139 66 L135 73" stroke="#fff" stroke-width="1.6" fill="none"/>

    <g class="mv o-eyes" data-m="idle proud">
      <ellipse cx="88" cy="120" rx="11" ry="14" fill="url(#ohmiIris)" stroke="${INK}" stroke-width="2.5"/>
      <ellipse cx="88" cy="123" rx="4.5" ry="6" fill="#2a0f3a"/>
      <circle cx="84" cy="114" r="4" fill="#fff"/><circle cx="92" cy="126" r="1.8" fill="#fff"/>
      <ellipse cx="132" cy="120" rx="11" ry="14" fill="url(#ohmiIris)" stroke="${INK}" stroke-width="2.5"/>
      <ellipse cx="132" cy="123" rx="4.5" ry="6" fill="#2a0f3a"/>
      <circle cx="128" cy="114" r="4" fill="#fff"/><circle cx="136" cy="126" r="1.8" fill="#fff"/>
      <path d="M74 112 Q88 98 102 110 M118 110 Q132 98 146 112" stroke="${INK}" stroke-width="4.5" fill="none" stroke-linecap="round"/>
    </g>
    <g class="mv" data-m="proud" fill="#fff">
      <path transform="translate(88 119) scale(.75)" d="${STAR}"/>
      <path transform="translate(132 119) scale(.75)" d="${STAR}"/>
    </g>
    <g class="mv" data-m="happy">
      <path d="M77 124 Q88 110 99 124 M121 124 Q132 110 143 124" stroke="${INK}" stroke-width="4.5" fill="none" stroke-linecap="round"/>
    </g>
    <g class="mv" data-m="shock">
      <circle cx="88" cy="119" r="13" fill="#fff" stroke="${INK}" stroke-width="3"/><circle cx="88" cy="119" r="2.6" fill="${INK}"/>
      <circle cx="132" cy="119" r="13" fill="#fff" stroke="${INK}" stroke-width="3"/><circle cx="132" cy="119" r="2.6" fill="${INK}"/>
    </g>
    <g class="mv" data-m="think">
      <ellipse cx="88" cy="120" rx="11" ry="12" fill="url(#ohmiIris)" stroke="${INK}" stroke-width="2.5"/>
      <ellipse cx="91" cy="116" rx="4" ry="5" fill="#2a0f3a"/><circle cx="85" cy="122" r="2.5" fill="#fff"/>
      <ellipse cx="132" cy="120" rx="11" ry="12" fill="url(#ohmiIris)" stroke="${INK}" stroke-width="2.5"/>
      <ellipse cx="135" cy="116" rx="4" ry="5" fill="#2a0f3a"/><circle cx="129" cy="122" r="2.5" fill="#fff"/>
      <path d="M75 110 L101 113 M119 113 L145 110" stroke="${INK}" stroke-width="4.5" stroke-linecap="round"/>
    </g>

    <ellipse cx="72" cy="136" rx="9" ry="5" fill="#ff86b6" opacity=".6"/>
    <ellipse cx="148" cy="136" rx="9" ry="5" fill="#ff86b6" opacity=".6"/>

    <path class="mv" data-m="idle" d="M102 144 Q110 151 118 144" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>
    <g class="mv" data-m="happy">
      <path d="M98 141 Q110 160 122 141 Z" fill="#8a1f3d" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M104 151 Q110 156 116 151 Q110 147 104 151 Z" fill="#ff7a9a"/>
    </g>
    <ellipse class="mv" data-m="shock" cx="110" cy="149" rx="7" ry="10" fill="#8a1f3d" stroke="${INK}" stroke-width="2.5"/>
    <path class="mv" data-m="think" d="M101 147 q4.5 -4 9 0 q4.5 4 9 0" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>
    <g class="mv" data-m="proud">
      <path d="M97 142 Q112 156 125 140" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M105 146 L108 152 L111 147" fill="#fff" stroke="${INK}" stroke-width="1.5" stroke-linejoin="round"/>
    </g>

    <g class="mv" data-m="shock">
      <path d="M170 96 Q162 110 170 115 Q178 110 170 96 Z" fill="#9ff7ff" stroke="${INK}" stroke-width="2"/>
      <path d="M34 70 l-14 -10 M30 92 h-16 M186 70 l14 -10 M190 92 h16" stroke="#ffd23f" stroke-width="4" stroke-linecap="round"/>
    </g>
    <text class="mv" data-m="think" x="174" y="56" font-family="Bangers, Impact, sans-serif" font-size="38" fill="#22e6ff" stroke="${INK}" stroke-width="1.5">?</text>
    <g class="mv" data-m="happy proud" fill="#ffd23f">
      <path transform="translate(28 58) scale(1.1)" d="${STAR}"/>
      <path transform="translate(194 40) scale(.8)" d="${STAR}"/>
      <path transform="translate(198 120) scale(.6)" d="${STAR}"/>
    </g>
  </g>
</svg>`;

  // Put Ohmi (plus a comic speech bubble) inside an element.
  // variant: 'hero' (big, bubble on top), 'mini' (small, bubble to the side), 'big' (celebration screens)
  function mount(el, opts) {
    const variant = (opts && opts.variant) || 'hero';
    el.classList.add('ohmi-wrap', 'ohmi-' + variant);
    el.innerHTML =
      '<div class="bubble" role="status" aria-live="polite" hidden></div>' +
      '<button class="ohmi mood-idle" type="button" aria-label="Dr. Ohmi, the lab assistant. Tap for a joke.">' + SVG + '</button>';
    const fig = el.querySelector('.ohmi');
    const bubble = el.querySelector('.bubble');
    let moodTimer = null;

    function setMood(mood, ms) {
      fig.className = 'ohmi mood-' + mood;
      clearTimeout(moodTimer);
      if (ms) moodTimer = setTimeout(function () { setMood('idle'); }, ms);
    }
    // opts.silent = no voice, opts.voiceDelay = seconds to wait before Ohmi "talks" (to let a sound effect finish)
    function say(html, mood, opts) {
      bubble.innerHTML = html;
      bubble.hidden = false;
      bubble.classList.remove('pop');
      void bubble.offsetWidth; // restart the pop animation
      bubble.classList.add('pop');
      if (mood) setMood(mood, 4500);
      if (window.SFX && !(opts && opts.silent)) window.SFX.babble(mood || 'idle', (opts && opts.voiceDelay) || 0, html);
    }
    fig.addEventListener('click', function () {
      if (window.SFX) window.SFX.play('boing');
      say(pick(LINES.joke), pick(['happy', 'think', 'proud']), { voiceDelay: 0.3 });
    });
    return { setMood: setMood, say: say, el: el };
  }

  window.Mascot = { mount: mount, LINES: LINES, pick: pick };
})();
