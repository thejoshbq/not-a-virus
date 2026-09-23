// Act: Broadcast — fake breaking-news bulletin that cuts to the birthday.

function youtubeId(media) {
  if (!media || media.type !== 'youtube') return null;
  const id = String(media.id || '').trim();
  return /^[\w-]{11}$/.test(id) ? id : null;
}

const css = `
  #act-root { min-height: 100vh; background: #0b0d12; color: #f4f1ea; font-family: 'Space Grotesk', sans-serif;
    display: flex; flex-direction: column; }
  .bc-ticker { background: #C8102E; color: #fff; font-family: 'IBM Plex Mono', monospace; font-size: 12px; letter-spacing: 2px;
    text-transform: uppercase; padding: 8px 16px; overflow: hidden; white-space: nowrap; }
  .bc-ticker span { display: inline-block; animation: ticker 18s linear infinite; }
  @keyframes ticker { from { transform: translateX(100%); } to { transform: translateX(-100%); } }
  .bc-stage { flex: 1; display: flex; align-items: center; justify-content: center; padding: 28px 20px; }
  .bc-card { max-width: 720px; width: 100%; }
  .bc-live { display: inline-block; background: #C8102E; color: #fff; font-size: 11px; font-weight: 700; letter-spacing: 3px;
    padding: 4px 10px; margin-bottom: 14px; }
  .bc-card h1 { font-size: clamp(28px, 7vw, 56px); line-height: 1.05; text-transform: uppercase; margin-bottom: 12px; }
  .bc-sub { font-family: 'IBM Plex Mono', monospace; font-size: 14px; opacity: 0.85; margin-bottom: 22px; }
  .bc-msg p { font-size: 16px; line-height: 1.7; margin-bottom: 12px; }
  .bc-video { margin-top: 22px; border: 3px solid #f4f1ea; aspect-ratio: 16/9; background: #000; }
  .bc-video iframe { width: 100%; height: 100%; border: 0; display: block; }
  .bc-foot { margin-top: 18px; font-family: 'IBM Plex Mono', monospace; font-size: 11px; opacity: 0.6; }
  @media (prefers-reduced-motion: reduce) { .bc-ticker span { animation: none; } }
`;

function render(root, p) {
  const name = String(p.name || 'Recipient');
  const headline = p.headline || `BREAKING: IT IS ${name.toUpperCase()}'S BIRTHDAY`;
  const subline = p.subline || 'This is not a drill. Cake has entered the building.';
  const footer = p.footer || 'OTIS LAB NEWS · we regret nothing';
  const paras = Array.isArray(p.message) ? p.message : [];
  const ytid = youtubeId(p.media);

  const ticker = document.createElement('div');
  ticker.className = 'bc-ticker';
  const tick = document.createElement('span');
  tick.textContent = p.ticker || `  ● LIVE  ·  Dept. of Special Occasions  ·  ${name}  ·  Form RR-87  ·  do not adjust your set  ·  `;
  ticker.appendChild(tick);

  const stage = document.createElement('div');
  stage.className = 'bc-stage';
  const card = document.createElement('div');
  card.className = 'bc-card';

  const live = document.createElement('div');
  live.className = 'bc-live';
  live.textContent = 'LIVE';
  const h1 = document.createElement('h1');
  h1.textContent = headline;
  const sub = document.createElement('p');
  sub.className = 'bc-sub';
  sub.textContent = subline;
  const msg = document.createElement('div');
  msg.className = 'bc-msg';
  paras.forEach(line => {
    const el = document.createElement('p');
    el.textContent = line;
    msg.appendChild(el);
  });
  card.append(live, h1, sub, msg);

  if (ytid) {
    const wrap = document.createElement('div');
    wrap.className = 'bc-video';
    const iframe = document.createElement('iframe');
    iframe.title = p.media_title || 'Official broadcast';
    iframe.allow = 'autoplay; encrypted-media; picture-in-picture';
    iframe.allowFullscreen = true;
    iframe.src = `https://www.youtube-nocookie.com/embed/${ytid}?autoplay=1&rel=0`;
    wrap.appendChild(iframe);
    card.appendChild(wrap);
  }

  const foot = document.createElement('p');
  foot.className = 'bc-foot';
  foot.textContent = footer;
  card.appendChild(foot);

  stage.appendChild(card);
  root.append(ticker, stage);
}

export default { css, render };
