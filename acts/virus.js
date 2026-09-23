// Act: Virus — short hijack / jump-scare, then a fake scareware birthday.
// Looks infected. Does nothing. Not malware.

function youtubeId(media) {
  if (!media || media.type !== 'youtube') return null;
  const id = String(media.id || '').trim();
  return /^[\w-]{11}$/.test(id) ? id : null;
}

const css = `
  #act-root { min-height: 100vh; background: #000; color: #7CFF6B; font-family: 'IBM Plex Mono', monospace;
    padding: 0; display: flex; flex-direction: column; overflow: hidden; }
  .vx-hijack { position: fixed; inset: 0; z-index: 9999; background: #0078d7; color: #fff;
    display: flex; flex-direction: column; align-items: flex-start; justify-content: center;
    text-align: left; padding: 10vh 8vw; cursor: none; font-family: 'Segoe UI', 'Space Grotesk', sans-serif; }
  .vx-hijack.flash { background: #c40000; align-items: center; justify-content: center; text-align: center; }
  .vx-hijack.black { background: #000; }
  .vx-hijack.white { background: #fff; color: #000; }
  .vx-face { font-size: clamp(72px, 20vw, 160px); line-height: 0.9; font-weight: 300; margin: 0; }
  .vx-bsod-copy { font-size: clamp(16px, 3.2vw, 28px); max-width: 22em; margin-top: 18px; font-weight: 400;
    letter-spacing: 0; text-transform: none; line-height: 1.35; }
  .vx-pct { margin-top: 28px; font-size: clamp(16px, 3vw, 24px); }
  .vx-stop { margin-top: 36px; font-size: 13px; opacity: 0.85; font-family: 'IBM Plex Mono', monospace; }
  .vx-hijack.flash h1 { font-family: 'Space Grotesk', sans-serif; font-size: clamp(36px, 11vw, 88px);
    letter-spacing: 2px; text-transform: uppercase; line-height: 0.95; margin: 0; }
  .vx-shake { animation: vxshake 0.07s linear infinite; }
  @keyframes vxshake {
    0% { transform: translate(0,0); }
    25% { transform: translate(-6px, 3px); }
    50% { transform: translate(5px, -4px); }
    75% { transform: translate(-3px, 5px); }
    100% { transform: translate(4px, -2px); }
  }
  .vx-glitch { animation: vxglitch 0.12s steps(2) infinite; }
  @keyframes vxglitch {
    0% { clip-path: inset(0 0 40% 0); transform: translate(-4px, 0); }
    50% { clip-path: inset(30% 0 10% 0); transform: translate(4px, 0); }
    100% { clip-path: inset(10% 0 50% 0); transform: translate(-2px, 0); }
  }
  .vx-scanlines { pointer-events: none; position: fixed; inset: 0; z-index: 50;
    background: repeating-linear-gradient(0deg, rgba(0,0,0,0.22) 0 1px, transparent 1px 3px); }
  .vx-bar { background: #8B0000; color: #fff; font-size: 12px; letter-spacing: 2px; text-transform: uppercase;
    padding: 8px 14px; display: flex; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
  .vx-bar b { animation: vxblink 0.6s step-end infinite; }
  @keyframes vxblink { 50% { opacity: 0; } }
  .vx-stage { flex: 1; padding: 18px 16px 28px; max-width: 860px; width: 100%; margin: 0 auto; }
  .vx-win { border: 2px solid #7CFF6B; background: #07140a; box-shadow: 0 0 24px rgba(124,255,107,0.18); }
  .vx-title { background: #7CFF6B; color: #010204; font-weight: 700; font-size: 12px; letter-spacing: 1px;
    padding: 6px 10px; display: flex; justify-content: space-between; }
  .vx-body { padding: 14px 14px 18px; }
  .vx-alert { color: #ff4d4d; font-weight: 700; font-size: clamp(16px, 4vw, 22px); margin-bottom: 12px;
    text-transform: uppercase; }
  .vx-log { font-size: 13px; line-height: 1.7; min-height: 8em; white-space: pre-wrap; }
  .vx-bargraph { margin: 14px 0 6px; height: 18px; border: 1px solid #7CFF6B; }
  .vx-bargraph > div { height: 100%; width: 0; background: repeating-linear-gradient(90deg, #7CFF6B, #7CFF6B 8px, #010204 8px, #010204 12px);
    transition: width 0.4s linear; }
  .vx-payload { display: none; margin-top: 16px; border-top: 1px dashed #3a7a34; padding-top: 14px; color: #d6ffd0; }
  .vx-payload h1 { font-family: 'Space Grotesk', sans-serif; color: #ff4d4d; font-size: clamp(22px, 6vw, 40px);
    line-height: 1.1; text-transform: uppercase; margin-bottom: 8px; }
  .vx-payload .sub { color: #7CFF6B; font-weight: 700; margin-bottom: 12px; }
  .vx-payload p { color: #c8e8c4; font-size: 14px; line-height: 1.7; margin-bottom: 10px; }
  .vx-payload .foot { margin-top: 12px; font-size: 11px; color: #3a7a34; }
  .vx-video { margin-top: 14px; border: 1px solid #7CFF6B; aspect-ratio: 16/9; background: #000; }
  .vx-video iframe { width: 100%; height: 100%; border: 0; display: block; }
  .vx-pop { position: fixed; z-index: 20; width: min(280px, 80vw); border: 2px solid #fff; background: #c0c0c0;
    color: #000; font-family: 'Space Grotesk', sans-serif; box-shadow: 6px 6px 0 #000; }
  .vx-pop .hd { background: #000080; color: #fff; font-size: 12px; padding: 4px 8px; font-weight: 700; }
  .vx-pop .bd { padding: 12px; font-size: 13px; }
  .vx-pop button { font-family: inherit; border: 2px solid #000; background: #c0c0c0; padding: 4px 14px; cursor: pointer; }
  .vx-main { display: none; flex: 1; flex-direction: column; }
  .vx-main.on { display: flex; }
  @media (prefers-reduced-motion: reduce) {
    .vx-bar b, .vx-shake, .vx-glitch { animation: none; }
    .vx-bargraph > div { transition: none; }
  }
`;

function reduced() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function scream(kind) {
  try {
    const ctx = window.__tone || new (window.AudioContext || window.webkitAudioContext)();
    window.__tone = ctx;
    const now = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.0001, now);
    master.connect(ctx.destination);
    if (kind === 'beep') {
      master.gain.exponentialRampToValueAtTime(0.18, now + 0.01);
      master.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
      const o = ctx.createOscillator();
      o.type = 'square';
      o.frequency.setValueAtTime(880, now);
      o.frequency.setValueAtTime(440, now + 0.12);
      o.connect(master);
      o.start(now);
      o.stop(now + 0.35);
      return;
    }
    master.gain.exponentialRampToValueAtTime(0.28, now + 0.01);
    master.gain.exponentialRampToValueAtTime(0.0001, now + 1.05);
    [55, 110, 740, 1760, 2100].forEach((freq, i) => {
      const o = ctx.createOscillator();
      o.type = i < 2 ? 'sawtooth' : 'square';
      o.frequency.setValueAtTime(freq, now);
      o.frequency.exponentialRampToValueAtTime(freq * (i % 2 ? 2.2 : 0.4), now + 0.9);
      o.connect(master);
      o.start(now);
      o.stop(now + 1.05);
    });
  } catch { /* autoplay policies, older browsers */ }
}

function typeLog(el, lines, onDone) {
  if (reduced()) {
    el.textContent = lines.join('\n');
    onDone();
    return;
  }
  let i = 0;
  const tick = () => {
    if (i < lines.length) {
      el.textContent = lines.slice(0, i + 1).join('\n');
      i++;
      setTimeout(tick, 380);
    } else onDone();
  };
  tick();
}

function spawnPops(root) {
  if (reduced()) return;
  const texts = [
    'ERROR 0xBDAY: cake.dll missing',
    'WARNING: streamer overflow',
    'quarantine failed: too festive',
    'unknown process: good_vibes.exe'
  ];
  texts.forEach((t, n) => {
    setTimeout(() => {
      const pop = document.createElement('div');
      pop.className = 'vx-pop';
      pop.style.left = (8 + (n * 13) % 55) + 'vw';
      pop.style.top = (18 + (n * 17) % 50) + 'vh';
      const hd = document.createElement('div');
      hd.className = 'hd';
      hd.textContent = 'OtisDefender';
      const bd = document.createElement('div');
      bd.className = 'bd';
      const p = document.createElement('p');
      p.textContent = t;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = 'OK';
      btn.addEventListener('click', () => pop.remove());
      bd.append(p, btn);
      pop.append(hd, bd);
      root.appendChild(pop);
      setTimeout(() => pop.remove(), 8000);
    }, 600 + n * 400);
  });
}

function hijack(root, name, then) {
  const overlay = document.createElement('div');
  overlay.className = 'vx-hijack';
  overlay.setAttribute('role', 'alert');

  const face = document.createElement('div');
  face.className = 'vx-face';
  face.textContent = ':(';
  const copy = document.createElement('div');
  copy.className = 'vx-bsod-copy';
  copy.textContent = 'Your PC ran into a problem and needs to restart. We\'re just collecting some error info, and then you can restart.';
  const pct = document.createElement('div');
  pct.className = 'vx-pct';
  pct.textContent = '0% complete';
  const stop = document.createElement('div');
  stop.className = 'vx-stop';
  stop.textContent = `Stop code: BIRTHDAY_OVERFLOW  ·  What failed: ${name.toUpperCase()}.SYS`;
  overlay.append(face, copy, pct, stop);
  root.appendChild(overlay);

  document.documentElement.requestFullscreen?.().catch(() => {});
  document.body.style.cursor = 'none';

  const finish = () => {
    overlay.remove();
    document.body.style.cursor = '';
    then();
  };

  if (reduced()) {
    pct.textContent = '100% complete';
    setTimeout(finish, 900);
    return;
  }

  scream('beep');

  let complete = 0;
  const crawl = setInterval(() => {
    complete = Math.min(37, complete + 7);
    pct.textContent = complete + '% complete';
    if (complete >= 37) clearInterval(crawl);
  }, 140);

  const death = [
    { cls: 'black', wait: 80 },
    { cls: 'flash vx-shake', wait: 140, scream: true, title: 'FATAL' },
    { cls: 'white', wait: 90 },
    { cls: 'flash', wait: 120, title: 'KERNEL PANIC' },
    { cls: 'black', wait: 70 },
    { cls: 'flash vx-shake', wait: 160, title: 'DO NOT RESTART' },
    { cls: 'white', wait: 80 },
    { cls: 'black', wait: 100 },
    { cls: 'flash', wait: 220, title: 'WAIT' }
  ];

  setTimeout(() => {
    clearInterval(crawl);
    overlay.innerHTML = '';
    const h1 = document.createElement('h1');
    overlay.appendChild(h1);
    let i = 0;
    const step = () => {
      if (i >= death.length) { finish(); return; }
      const d = death[i++];
      overlay.className = 'vx-hijack ' + d.cls;
      h1.textContent = d.title || '';
      if (d.scream) scream('death');
      setTimeout(step, d.wait);
    };
    step();
  }, 1600);
}

function render(root, p) {
  document.body.style.background = '#0078d7';
  document.documentElement.style.background = '#0078d7';
  const name = String(p.name || 'Recipient');
  const headline = p.headline || `HAPPY BIRTHDAY ${name.toUpperCase()}`;
  const subline = p.subline || 'Threat contained. Payload is a card. Mostly.';
  const footer = p.footer || 'OtisDefender v97 · definitions last updated never';
  const paras = Array.isArray(p.message) ? p.message : [];
  const ytid = youtubeId(p.media);
  const lines = Array.isArray(p.processing) && p.processing.length
    ? p.processing
    : [
        `> OtisDefender v97 — scanning /home/${name.toLowerCase()} …`,
        '> 14,002 cookies (mostly cake)',
        '> unknown process: good_vibes.exe',
        `> THREAT IDENTIFIED: HAPPY_BIRTHDAY_${name.toUpperCase()}.worm`,
        '> quarantine: FAILED (target is too stubborn)',
        '> displaying payload because we have no other move'
      ];

  const main = document.createElement('div');
  main.className = 'vx-main';
  const bar = document.createElement('div');
  bar.className = 'vx-bar';
  bar.innerHTML = '<span><b>● ALERT</b>  OtisDefender</span><span>DO NOT TURN OFF YOUR COMPUTER (or do. it is a webpage.)</span>';
  const stage = document.createElement('div');
  stage.className = 'vx-stage';
  const win = document.createElement('div');
  win.className = 'vx-win';
  win.innerHTML = `
    <div class="vx-title"><span>C:\\WINDOWS\\system32\\cmd.exe</span><span>X</span></div>
    <div class="vx-body">
      <div class="vx-alert" id="vx-alert">CRITICAL: system has been… celebrated</div>
      <div class="vx-log" id="vx-log"></div>
      <div class="vx-bargraph"><div id="vx-fill"></div></div>
      <div class="vx-payload" id="vx-payload">
        <h1 id="vx-head"></h1>
        <p class="sub" id="vx-sub"></p>
        <div id="vx-msg"></div>
        ${ytid ? '<div class="vx-video"><iframe id="vx-frame" title="Decrypted payload" src="" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe></div>' : ''}
        <p class="foot" id="vx-foot"></p>
      </div>
    </div>
  `;
  const scan = document.createElement('div');
  scan.className = 'vx-scanlines';
  stage.appendChild(win);
  main.append(bar, stage);
  root.append(main, scan);

  root.querySelector('#vx-head').textContent = headline;
  root.querySelector('#vx-sub').textContent = subline;
  root.querySelector('#vx-foot').textContent = footer;
  const msg = root.querySelector('#vx-msg');
  paras.forEach(line => {
    const el = document.createElement('p');
    el.textContent = line;
    msg.appendChild(el);
  });

  hijack(root, name, () => {
    main.classList.add('on');
    const fill = root.querySelector('#vx-fill');
    let w = 0;
    const meter = setInterval(() => {
      w = Math.min(100, w + 8);
      fill.style.width = w + '%';
      if (w >= 100) clearInterval(meter);
    }, 200);
    typeLog(root.querySelector('#vx-log'), lines, () => {
      root.querySelector('#vx-payload').style.display = 'block';
      fill.style.width = '100%';
      spawnPops(root);
      const frame = root.querySelector('#vx-frame');
      if (frame && ytid) {
        frame.src = `https://www.youtube-nocookie.com/embed/${ytid}?autoplay=1&rel=0`;
      }
    });
  });
}

export default { css, render };
