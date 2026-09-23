// Act: Certificate — overly formal diploma with a gold-ish border.

function ensureFonts() {
  if (document.getElementById('ct-fonts')) return;
  const l = document.createElement('link');
  l.id = 'ct-fonts';
  l.rel = 'stylesheet';
  l.href = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700&family=Libre+Baskerville:ital,wght@0,400;1,400;0,700&display=swap';
  document.head.appendChild(l);
}

const css = `
  #act-root { min-height: 100vh; background: #1e2a1e; display: flex; align-items: center; justify-content: center;
    padding: 24px 12px; }
  .ct { width: min(720px, 100%); background: #fbf6e8; color: #1b2430; border: 10px double #c9a227;
    box-shadow: 0 0 0 4px #fbf6e8, 0 0 0 8px #7a5b12, 12px 12px 0 #111; padding: 36px 32px; text-align: center; }
  .ct-kicker { font-family: 'Cinzel', serif; letter-spacing: 4px; font-size: 11px; text-transform: uppercase;
    color: #7a5b12; margin-bottom: 10px; }
  .ct h1 { font-family: 'Cinzel', serif; font-size: clamp(26px, 6vw, 42px); line-height: 1.15; margin-bottom: 8px; }
  .ct-sub { font-family: 'Libre Baskerville', serif; font-style: italic; font-size: 15px; margin-bottom: 18px; }
  .ct-msg p { font-family: 'Libre Baskerville', serif; font-size: 15px; line-height: 1.7; margin: 0 auto 12px; max-width: 560px; }
  .ct-seal { margin: 18px auto 8px; width: 74px; height: 74px; border-radius: 50%; border: 4px dashed #c9a227;
    display: flex; align-items: center; justify-content: center; font-family: 'Cinzel', serif; font-size: 11px;
    letter-spacing: 1px; color: #7a5b12; font-weight: 700; }
  .ct-foot { font-family: 'IBM Plex Mono', monospace; font-size: 11px; opacity: 0.7; margin-top: 8px; }
`;

function render(root, p) {
  ensureFonts();
  const ct = document.createElement('div');
  ct.className = 'ct';
  const kicker = document.createElement('div');
  kicker.className = 'ct-kicker';
  kicker.textContent = p.kicker || 'The Department of Adjacent Gratitude';
  const h1 = document.createElement('h1');
  h1.textContent = p.headline || 'Certificate of Appreciation';
  const sub = document.createElement('p');
  sub.className = 'ct-sub';
  sub.textContent = p.subline || '';
  const msg = document.createElement('div');
  msg.className = 'ct-msg';
  (Array.isArray(p.message) ? p.message : []).forEach(line => {
    const el = document.createElement('p');
    el.textContent = line;
    msg.appendChild(el);
  });
  const seal = document.createElement('div');
  seal.className = 'ct-seal';
  seal.textContent = p.seal || 'SEAL';
  const foot = document.createElement('p');
  foot.className = 'ct-foot';
  foot.textContent = p.footer || '';
  ct.append(kicker, h1, sub, msg, seal, foot);
  root.appendChild(ct);
}

export default { css, render };
