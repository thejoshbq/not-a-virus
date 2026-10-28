// Act: Pocket Pet — Tamagotchi-style handheld. Hatch it, feed it cake, party, reveal.

const css = `
  #act-root { min-height: 100vh; display: flex; flex-direction: column; align-items: center; gap: 22px;
    padding: 28px 12px 56px; background: #ffe3ef;
    background-image: radial-gradient(#ffc2da 18%, transparent 20%), radial-gradient(#ffc2da 18%, transparent 20%);
    background-size: 36px 36px; background-position: 0 0, 18px 18px; font-family: 'Trebuchet MS', 'Segoe UI', sans-serif; }
  .pp-shell { width: min(320px, 94vw); background: linear-gradient(160deg, #ff9ec7, #ff6fa8); border-radius: 50% 50% 46% 46% / 40% 40% 60% 60%;
    padding: 34px 26px 36px; box-shadow: 0 14px 0 #d94f87, 0 24px 30px rgba(120,20,70,0.35), inset 0 -8px 0 rgba(0,0,0,0.08); text-align: center; }
  .pp-brand { color: #fff; font-weight: 800; font-size: 13px; letter-spacing: 3px; margin-bottom: 10px; text-shadow: 0 2px 0 #d94f87; }
  .pp-screen-wrap { background: #f5f0ff; border-radius: 18px; padding: 12px; box-shadow: inset 0 3px 8px rgba(0,0,0,0.25); }
  .pp-screen { position: relative; background: #d7efc9; border-radius: 8px; overflow: hidden; border: 3px solid #8fb27f; }
  .pp-screen canvas { display: block; width: 100%; image-rendering: pixelated; image-rendering: crisp-edges; }
  .pp-hud { position: absolute; top: 4px; left: 6px; right: 6px; display: flex; justify-content: space-between;
    font: 700 11px 'Courier New', monospace; color: #3b2a4a; letter-spacing: 1px; }
  .pp-say { position: absolute; left: 8px; right: 8px; bottom: 6px; min-height: 16px; font: 700 12px 'Courier New', monospace;
    color: #3b2a4a; text-align: center; }
  .pp-btns { display: flex; justify-content: center; align-items: center; gap: 14px; margin-top: 18px; }
  .pp-btn { appearance: none; border: 0; border-radius: 999px; background: #fff7a8; color: #7a3350; font: 800 15px inherit;
    font-family: inherit; padding: 13px 22px; cursor: pointer; box-shadow: 0 5px 0 #d6b84a; letter-spacing: 1px; }
  .pp-btn:active { transform: translateY(4px); box-shadow: 0 1px 0 #d6b84a; }
  .pp-btn[disabled] { opacity: 0.6; cursor: default; }
  .pp-dot { width: 14px; height: 14px; border-radius: 50%; background: #ffd0e3; box-shadow: 0 3px 0 #d94f87; }
  .pp-skip { background: none; border: 0; color: #b03a72; font: 700 12px inherit; font-family: inherit; text-decoration: underline;
    cursor: pointer; margin-top: 12px; }
  .pp-card { width: min(420px, 94vw); background: #fffdf5; border: 4px dashed #ff6fa8; border-radius: 22px; padding: 24px 22px;
    color: #5a2a45; text-align: center; box-shadow: 0 8px 0 #f2a6c4; display: none; }
  .pp-card.show { display: block; animation: pp-pop 600ms cubic-bezier(.2,1.6,.4,1); }
  .pp-card h1 { font-size: 26px; line-height: 1.15; margin-bottom: 8px; color: #e0407f; }
  .pp-sub { font-size: 15px; font-weight: 700; margin-bottom: 14px; }
  .pp-card p { font-size: 15px; line-height: 1.55; margin-bottom: 10px; }
  .pp-foot { font-size: 11px; opacity: 0.7; margin-top: 12px; letter-spacing: 1px; }
  .pp-confetti { position: fixed; inset: 0; pointer-events: none; z-index: 5; }
  @keyframes pp-pop { from { transform: scale(0.6); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  @media (prefers-reduced-motion: reduce) { .pp-card.show { animation: none; } }
`;

const PAL = {
  o: '#3b2a4a', k: '#2b1b3a', p: '#ff7aa8', m: '#b3265e', w: '#ffffff',
  r: '#ff5c8a', c: '#fff1c9', y: '#ffe14d', e: '#fffbe8', s: '#e6d9a8', t: '#7fd6c2',
};
const BODY = ['#ffb3d1', '#ffc08a', '#ffe08a', '#b8e6a0', '#9fd8ff'];

const BASE = [
  '................',
  '......oooo......',
  '....oobbbboo....',
  '...obbbbbbbbo...',
  '..obbbbbbbbbbo..',
  '..obbbbbbbbbbo..',
  '..obbbbbbbbbbo..',
  '..obbbbbbbbbbo..',
  '..obpbbbbbbpbo..',
  '..obbbbbbbbbbo..',
  '...obbbbbbbbo...',
  '....oooooooo....',
  '....oo....oo....',
  '................',
];
const EGG = [
  '......oooo......',
  '....oosseeoo....',
  '...oseeeeeeso...',
  '..oseetteeeeso..',
  '..oeettteeeeeo..',
  '..oeeetteeteeo..',
  '..oeeeeeettteo..',
  '..oseeeeeettso..',
  '..oseeeeeeeeso..',
  '...oseeeeeeso...',
  '....oossssoo....',
  '......oooo......',
];
const CAKE = [
  '...ww...',
  '..wwww..',
  '.wwwwww.',
  '.rrrrrr.',
  '.cccccc.',
  '.rrrrrr.',
  '.cccccc.',
  '........',
];

function drawGrid(ctx, grid, x, y, s, body) {
  grid.forEach((row, j) => {
    for (let i = 0; i < row.length; i++) {
      const ch = row[i];
      if (ch === '.') continue;
      ctx.fillStyle = ch === 'b' ? body : PAL[ch];
      ctx.fillRect(Math.round(x + i * s), Math.round(y + j * s), s, s);
    }
  });
}

function drawFace(ctx, x, y, s, mood) {
  const px = (i, j, c) => { ctx.fillStyle = c; ctx.fillRect(Math.round(x + i * s), Math.round(y + j * s), s, s); };
  if (mood === 'happy') {
    [[5, 6], [10, 6]].forEach(([i, j]) => { px(i, j, PAL.k); px(i - 1, j + 1 < 8 ? j + 1 : j, PAL.k); px(i + 1, j + 1, PAL.k); });
  } else if (mood === 'blink') {
    px(4, 6, PAL.k); px(5, 6, PAL.k); px(10, 6, PAL.k); px(11, 6, PAL.k);
  } else {
    px(5, 6, PAL.k); px(5, 5, PAL.k); px(10, 6, PAL.k); px(10, 5, PAL.k);
  }
  if (mood === 'eat') {
    px(7, 8, PAL.m); px(8, 8, PAL.m); px(7, 9, PAL.m); px(8, 9, PAL.m);
  } else if (mood === 'happy') {
    px(6, 8, PAL.m); px(9, 8, PAL.m); px(7, 9, PAL.m); px(8, 9, PAL.m);
  } else {
    px(7, 8, PAL.m); px(8, 8, PAL.m);
  }
}

function drawHat(ctx, x, y, s) {
  const rows = ['.y.', '.yy', 'yyr', 'yry'];
  rows.forEach((row, j) => {
    for (let i = 0; i < row.length; i++) {
      const ch = row[i];
      if (ch === '.') continue;
      ctx.fillStyle = ch === 'y' ? PAL.y : PAL.r;
      ctx.fillRect(Math.round(x + (6 + i) * s), Math.round(y + (-3 + j) * s + s * 2), s * 1.5, s);
    }
  });
}

function render(root, p) {
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const petName = p.pet_name || 'Biscuit';
  const maxFeeds = Math.max(3, Math.min(8, Number(p.feeds) || 5));
  const lines = Array.isArray(p.pet_lines) && p.pet_lines.length ? p.pet_lines : [
    'nom nom nom', 'cake?? for me??', 'i am a very good pet', 'more. please. thank.', 'i have never been happier', 'one more. for science.',
  ];

  const shell = document.createElement('div');
  shell.className = 'pp-shell';
  const brand = document.createElement('div');
  brand.className = 'pp-brand';
  brand.textContent = p.brand || '\u2665 POCKET PAL \u2665';
  const wrap = document.createElement('div');
  wrap.className = 'pp-screen-wrap';
  const screen = document.createElement('div');
  screen.className = 'pp-screen';
  const cv = document.createElement('canvas');
  cv.width = 192; cv.height = 168;
  const ctx = cv.getContext('2d');
  const hud = document.createElement('div');
  hud.className = 'pp-hud';
  const hudL = document.createElement('span');
  const hudR = document.createElement('span');
  hud.append(hudL, hudR);
  const say = document.createElement('div');
  say.className = 'pp-say';
  screen.append(cv, hud, say);
  wrap.appendChild(screen);

  const btns = document.createElement('div');
  btns.className = 'pp-btns';
  const dotL = document.createElement('span'); dotL.className = 'pp-dot';
  const main = document.createElement('button');
  main.className = 'pp-btn';
  main.type = 'button';
  const dotR = document.createElement('span'); dotR.className = 'pp-dot';
  btns.append(dotL, main, dotR);
  const skip = document.createElement('button');
  skip.className = 'pp-skip';
  skip.type = 'button';
  skip.textContent = p.skip || 'skip to the party';
  shell.append(brand, wrap, btns, skip);

  const card = document.createElement('div');
  card.className = 'pp-card';
  const h1 = document.createElement('h1');
  h1.textContent = p.headline || '';
  const sub = document.createElement('div');
  sub.className = 'pp-sub';
  sub.textContent = p.subline || '';
  card.append(h1, sub);
  (Array.isArray(p.message) ? p.message : []).forEach((t) => {
    const el = document.createElement('p');
    el.textContent = t;
    card.appendChild(el);
  });
  const foot = document.createElement('div');
  foot.className = 'pp-foot';
  foot.textContent = p.footer || '';
  card.appendChild(foot);

  root.append(shell, card);

  // ---- state
  let phase = 'egg';       // egg -> pet -> party
  let taps = 0, feeds = 0, eating = 0, wobble = 0, t0 = performance.now();
  let speech = 'tap the egg!';
  let confettiOn = false;
  const confetti = [];

  function blip(freq, dur = 0.08, type = 'square', vol = 0.05) {
    try {
      const ac = window.__tone;
      if (!ac || ac.state !== 'running' || reduce) return;
      const o = ac.createOscillator(); const g = ac.createGain();
      o.type = type; o.frequency.value = freq; g.gain.value = vol;
      o.connect(g); g.connect(ac.destination);
      const t = ac.currentTime;
      g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.start(t); o.stop(t + dur + 0.02);
    } catch { /* sound is optional */ }
  }

  function setMain() {
    main.disabled = false;
    if (phase === 'egg') main.textContent = 'TAP EGG';
    else if (phase === 'pet') main.textContent = 'FEED CAKE';
    else { main.textContent = 'PARTY!!'; main.disabled = true; }
    hudL.textContent = phase === 'egg' ? 'EGG' : petName.toUpperCase();
    hudR.textContent = phase === 'pet' ? '\u2665'.repeat(feeds) + '\u2661'.repeat(maxFeeds - feeds) : phase === 'party' ? '\u2665\u2665\u2665' : '';
  }

  function draw(now) {
    const t = (now - t0) / 1000;
    ctx.fillStyle = '#d7efc9';
    ctx.fillRect(0, 0, cv.width, cv.height);
    ctx.fillStyle = '#b9dca8';
    ctx.fillRect(0, 140, cv.width, 28);
    if (phase === 'egg') {
      const sw = reduce ? 0 : Math.sin(wobble * 30) * Math.max(0, 1 - wobble) * 6;
      drawGrid(ctx, EGG, 48 + sw, 52, 6);
      if (wobble > 0) wobble = Math.max(0, wobble - 0.03);
    } else {
      const stage = Math.min(feeds, BODY.length - 1);
      const sc = Math.max(5, Math.round(5 + feeds * 0.7));
      const w = 16 * sc;
      const bounce = reduce ? 0 : Math.abs(Math.sin(t * (phase === 'party' ? 8 : 3))) * (phase === 'party' ? 22 : 6);
      const x = (cv.width - w) / 2;
      const y = 140 - 13 * sc - bounce;
      drawGrid(ctx, BASE, x, y, sc, BODY[stage]);
      const blink = (t % 3.2) > 3.05;
      const mood = phase === 'party' ? 'happy' : eating > 0 ? 'eat' : blink ? 'blink' : 'idle';
      drawFace(ctx, x, y, sc, mood);
      if (feeds >= maxFeeds || phase === 'party') drawHat(ctx, x, y - sc, sc);
      if (eating > 0) {
        const k = 1 - eating;
        drawGrid(ctx, CAKE, 150 - k * 70, 100 - Math.sin(k * Math.PI) * 14, 5);
        eating = Math.max(0, eating - 0.04);
        if (eating === 0) afterEat();
      }
    }
    say.textContent = speech;
    // confetti
    if (confettiOn) stepConfetti();
    requestAnimationFrame(draw);
  }

  // ---- confetti (own full-screen canvas)
  let fx = null, fctx = null;
  function startConfetti() {
    if (reduce) return;
    fx = document.createElement('canvas');
    fx.className = 'pp-confetti';
    fx.width = innerWidth; fx.height = innerHeight;
    document.body.appendChild(fx);
    fctx = fx.getContext('2d');
    const cols = ['#ff6fa8', '#ffe14d', '#7fd6c2', '#9fd8ff', '#fff'];
    for (let i = 0; i < 140; i++) {
      confetti.push({ x: Math.random() * fx.width, y: -Math.random() * fx.height * 0.6, vx: (Math.random() - 0.5) * 2,
        vy: 2 + Math.random() * 3, r: 4 + Math.random() * 5, c: cols[i % cols.length], rot: Math.random() * 6 });
    }
    confettiOn = true;
  }
  function stepConfetti() {
    fctx.clearRect(0, 0, fx.width, fx.height);
    let alive = 0;
    confetti.forEach((c) => {
      c.x += c.vx; c.y += c.vy; c.rot += 0.1;
      if (c.y < fx.height + 20) alive++;
      fctx.save(); fctx.translate(c.x, c.y); fctx.rotate(c.rot);
      fctx.fillStyle = c.c; fctx.fillRect(-c.r / 2, -c.r / 4, c.r, c.r / 2); fctx.restore();
    });
    if (!alive) { confettiOn = false; fx.remove(); }
  }

  // ---- flow
  function hatch() {
    phase = 'pet';
    speech = `${petName} has hatched! feed it cake.`;
    blip(660); setTimeout(() => blip(880), 90); setTimeout(() => blip(1320, 0.15), 180);
    setMain();
  }
  function afterEat() {
    feeds++;
    speech = lines[(feeds - 1) % lines.length];
    blip(520, 0.06); setTimeout(() => blip(780, 0.1), 70);
    if (feeds >= maxFeeds) { setTimeout(party, 500); main.disabled = true; }
    else main.disabled = false;
    setMain();
  }
  function party() {
    if (phase === 'party') return;
    phase = 'party';
    speech = `${petName} is throwing you a party!`;
    [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => blip(f, 0.14, 'triangle'), i * 120));
    startConfetti();
    setMain();
    skip.style.display = 'none';
    card.classList.add('show');
    setTimeout(() => card.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' }), 250);
  }

  main.addEventListener('click', () => {
    if (phase === 'egg') {
      taps++; wobble = 1; blip(300 + taps * 80, 0.06);
      speech = taps < 3 ? 'something is moving...' : 'crack!';
      if (taps >= 3) hatch();
    } else if (phase === 'pet' && eating === 0) {
      main.disabled = true; eating = 1; blip(400, 0.05);
    }
  });
  skip.addEventListener('click', () => { feeds = maxFeeds; eating = 0; party(); });

  setMain();
  requestAnimationFrame(draw);
}

export default { css, render };
