// Act: Notebook — composition-book lab notes, handwriting, tape.

function ensureFonts() {
  if (document.getElementById('nb-fonts')) return;
  const l = document.createElement('link');
  l.id = 'nb-fonts';
  l.rel = 'stylesheet';
  l.href = 'https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&display=swap';
  document.head.appendChild(l);
}

const css = `
  #act-root { min-height: 100vh; background: #2b2b2b; display: flex; align-items: center; justify-content: center;
    padding: 24px 12px; }
  .nb { width: min(640px, 100%); display: flex; box-shadow: 12px 12px 0 #111; }
  .nb-spine { width: 54px; flex-shrink: 0; background: repeating-linear-gradient(90deg, #1a1a1a 0 6px, #c41e3a 6px 10px,
    #1a1a1a 10px 14px, #f2f2f2 14px 18px); border: 3px solid #111; border-right: 0; }
  .nb-page { flex: 1; background: #f7f1de; background-image: repeating-linear-gradient(#f7f1de, #f7f1de 31px, #c9d6e5 31px, #c9d6e5 32px);
    border: 3px solid #111; padding: 28px 22px 24px 28px; color: #1b2430; min-height: 520px; }
  .nb-label { font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 2px; text-transform: uppercase;
    margin-bottom: 8px; opacity: 0.7; }
  .nb-page h1 { font-family: 'Caveat', cursive; font-size: clamp(34px, 8vw, 52px); line-height: 1.05;
    transform: rotate(-1.2deg); margin: 4px 0 6px; }
  .nb-sub { font-family: 'Caveat', cursive; font-size: 22px; margin-bottom: 16px; transform: rotate(0.6deg); }
  .nb-msg p { font-family: 'Caveat', cursive; font-size: 22px; line-height: 1.45; margin-bottom: 10px; }
  .nb-tape { position: relative; }
  .nb-tape::before { content: ''; position: absolute; top: -18px; right: 24px; width: 70px; height: 22px;
    background: rgba(255,220,80,0.45); transform: rotate(8deg); }
  .nb-foot { font-family: 'IBM Plex Mono', monospace; font-size: 11px; margin-top: 18px; opacity: 0.65; }
`;

function render(root, p) {
  ensureFonts();
  const wrap = document.createElement('div');
  wrap.className = 'nb';
  const spine = document.createElement('div');
  spine.className = 'nb-spine';
  const page = document.createElement('div');
  page.className = 'nb-page nb-tape';
  const label = document.createElement('div');
  label.className = 'nb-label';
  label.textContent = p.tab || 'LAB NOTEBOOK  ·  DO NOT AUTOCLAVE';
  const h1 = document.createElement('h1');
  h1.textContent = p.headline || 'thank you';
  const sub = document.createElement('p');
  sub.className = 'nb-sub';
  sub.textContent = p.subline || '';
  const msg = document.createElement('div');
  msg.className = 'nb-msg';
  (Array.isArray(p.message) ? p.message : []).forEach(line => {
    const el = document.createElement('p');
    el.textContent = line;
    msg.appendChild(el);
  });
  const foot = document.createElement('p');
  foot.className = 'nb-foot';
  foot.textContent = p.footer || '';
  page.append(label, h1, sub, msg, foot);
  wrap.append(spine, page);
  root.appendChild(wrap);
}

export default { css, render };
