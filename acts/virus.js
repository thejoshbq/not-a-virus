// Act: Virus — fake scareware / OtisDefender screen. Looks infected. Does nothing.

function youtubeId(media) {
  if (!media || media.type !== 'youtube') return null;
  const id = String(media.id || '').trim();
  return /^[\w-]{11}$/.test(id) ? id : null;
}

const css = `
  #act-root { min-height: 100vh; background: #010204; color: #7CFF6B; font-family: 'IBM Plex Mono', monospace;
    padding: 0; display: flex; flex-direction: column; overflow: hidden; }
  .vx-scanlines { pointer-events: none; position: fixed; inset: 0; z-index: 50;
    background: repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0 1px, transparent 1px 3px); }
  .vx-bar { background: #8B0000; color: #fff; font-size: 12px; letter-spacing: 2px; text-transform: uppercase;
    padding: 8px 14px; display: flex; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
  .vx-bar b { animation: vxblink 1s step-end infinite; }
  @keyframes vxblink { 50% { opacity: 0; } }
  .vx-stage { flex: 1; padding: 18px 16px 28px; max-width: 860px; width: 100%; margin: 0 auto; }
  .vx-win { border: 2px solid #7CFF6B; background: #07140a; box-shadow: 0 0 24px rgba(124,255,107,0.18); }
  .vx-title { background: #7CFF6B; color: #010204; font-weight: 700; font-size: 12px; letter-spacing: 1px;
    padding: 6px 10px; display: flex; justify-content: space-between; }
  .vx-body { padding: 14px 14px 18px; }
  .vx-alert { color: #ff4d4d; font-weight: 700; font-size: clamp(16px, 4vw, 22px); margin-bottom: 12px;
    text-transform: uppercase; }
  .vx-log { font-size: 13px; line-height: 1.7; min-height: 8em; white-space: pre-wrap; }
  .vx-log .dim { color: #3a7a34; }
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
  @media (prefers-reduced-motion: reduce) {
    .vx-bar b { animation: none; }
    .vx-bargraph > div { transition: none; }
  }
`;

function typeLog(el, lines, onDone) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) {
    el.textContent = lines.join('\n');
    onDone();
    return;
  }
  let i = 0;
  const tick = () => {
    if (i < lines.length) {
      el.textContent = lines.slice(0, i + 1).join('\n');
      i++;
      setTimeout(tick, 420);
    } else onDone();
  };
  tick();
}

function spawnPops(root) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
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
    }, 600 + n * 500);
  });
}

function render(root, p) {
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
  root.append(bar, stage, scan);

  root.querySelector('#vx-head').textContent = headline;
  root.querySelector('#vx-sub').textContent = subline;
  root.querySelector('#vx-foot').textContent = footer;
  const msg = root.querySelector('#vx-msg');
  paras.forEach(line => {
    const el = document.createElement('p');
    el.textContent = line;
    msg.appendChild(el);
  });

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
}

export default { css, render };
