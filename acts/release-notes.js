// Act: Release Notes — a keynote-style reveal that resolves into a plain changelog.
// Fields: beats[], headline, tagline, button, title, released, intro, sections[{title, items[]}], footer.

const css = `
  #act-root { min-height: 100vh; background: #000; }
  #act-root.rn-light { background: #fff; }

  .rn-key { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center;
    text-align: center; padding: 32px 20px; color: #f5f5f7;
    font-family: -apple-system, BlinkMacSystemFont, 'Space Grotesk', system-ui, sans-serif; }
  .rn-beat { min-height: 1.3em; font-size: clamp(24px, 5.5vw, 52px); font-weight: 600; letter-spacing: -0.02em;
    opacity: 0; transition: opacity 0.9s ease; }
  .rn-beat.on { opacity: 1; }
  .rn-final { display: flex; flex-direction: column; align-items: center; opacity: 0; transition: opacity 1.2s ease; }
  .rn-final.on { opacity: 1; }
  .rn-title { font-size: clamp(52px, 15vw, 132px); font-weight: 700; letter-spacing: -0.045em; line-height: 1;
    background: linear-gradient(90deg, #ff9a3c, #ff4d8d, #7a5cff, #2bb3ff);
    -webkit-background-clip: text; background-clip: text; color: transparent; }
  .rn-tag { margin-top: 14px; font-size: clamp(18px, 3vw, 26px); color: #a1a1a6; }
  .rn-btn { margin-top: 30px; padding: 12px 26px; border: 0; border-radius: 980px; background: #0071e3; color: #fff;
    font: inherit; font-size: 17px; cursor: pointer; }
  .rn-btn:hover { background: #0077ed; }
  .rn-btn:focus-visible { outline: 3px solid #6cb4ff; outline-offset: 3px; }
  .rn-skip { position: fixed; right: 18px; bottom: 14px; background: none; border: 0; color: #6e6e73;
    font: inherit; font-size: 13px; cursor: pointer; }
  .rn-skip:hover { color: #a1a1a6; }

  .rn-doc { max-width: 760px; margin: 0 auto; padding: 40px 22px 72px; color: #1f2328;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 1.55; }
  .rn-crumb { font-family: 'IBM Plex Mono', ui-monospace, monospace; font-size: 13px; color: #59636e; margin-bottom: 18px; }
  .rn-doc h1 { text-transform: none; font-size: 32px; font-weight: 600; line-height: 1.25; margin: 0 0 8px; }
  .rn-badges { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; margin-bottom: 6px; }
  .rn-badge { font-size: 12px; font-weight: 500; border: 1px solid #1a7f37; color: #1a7f37; border-radius: 2em; padding: 0 8px; line-height: 20px; }
  .rn-badge.grey { border-color: #d1d9e0; color: #59636e; }
  .rn-date { font-size: 14px; color: #59636e; margin-bottom: 20px; }
  .rn-intro { margin: 0 0 8px; }
  .rn-doc h2 { text-transform: none; letter-spacing: 0; font-size: 22px; font-weight: 600; margin: 30px 0 12px; padding-bottom: 6px; border-bottom: 1px solid #d1d9e0; }
  .rn-doc ul { margin: 0; padding-left: 26px; }
  .rn-doc li { margin: 6px 0; }
  .rn-doc p.rn-p { margin: 0; }
  .rn-foot { margin-top: 40px; padding-top: 14px; border-top: 1px solid #d1d9e0;
    font-family: 'IBM Plex Mono', ui-monospace, monospace; font-size: 12px; color: #59636e; }

  @media (prefers-reduced-motion: reduce) {
    .rn-beat, .rn-final { transition: none; }
  }
`;

function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
}

function buildNotes(p) {
  const doc = el('main', 'rn-doc');
  doc.append(el('div', 'rn-crumb', p.crumb || 'releases / latest'));
  doc.append(el('h1', '', p.title || 'Release notes'));

  const badges = el('div', 'rn-badges');
  badges.append(el('span', 'rn-badge', 'Latest'), el('span', 'rn-badge grey', 'Stable'));
  doc.append(badges);
  if (p.released) doc.append(el('div', 'rn-date', p.released));
  if (p.intro) doc.append(el('p', 'rn-intro', p.intro));

  (Array.isArray(p.sections) ? p.sections : []).forEach(sec => {
    doc.append(el('h2', '', sec.title || ''));
    if (Array.isArray(sec.items)) {
      const ul = el('ul');
      sec.items.forEach(t => ul.append(el('li', '', t)));
      doc.append(ul);
    } else if (sec.text) {
      doc.append(el('p', 'rn-p', sec.text));
    }
  });

  if (p.footer) doc.append(el('div', 'rn-foot', p.footer));
  return doc;
}

function render(root, p) {
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const beats = Array.isArray(p.beats) ? p.beats : [];
  const timers = [];
  let done = false;

  const key = el('div', 'rn-key');
  const beat = el('div', 'rn-beat');
  const final = el('div', 'rn-final');
  const title = el('div', 'rn-title', p.headline || '');
  const tag = el('div', 'rn-tag', p.tagline || '');
  const btn = el('button', 'rn-btn', p.button || 'Learn more');
  btn.type = 'button';
  final.append(title, tag, btn);
  const skip = el('button', 'rn-skip', 'Skip');
  skip.type = 'button';
  key.append(beat, final);
  root.append(key, skip);

  const later = (fn, ms) => timers.push(setTimeout(fn, ms));

  function showFinal() {
    beat.classList.remove('on');
    beat.style.display = 'none';
    skip.style.display = 'none';
    final.classList.add('on');
    btn.focus({ preventScroll: true });
  }

  function showNotes() {
    if (done) return;
    done = true;
    timers.forEach(clearTimeout);
    root.classList.add('rn-light');
    root.replaceChildren(buildNotes(p));
    document.title = p.title || document.title;
    window.scrollTo(0, 0);
  }

  btn.addEventListener('click', showNotes);
  skip.addEventListener('click', () => { timers.forEach(clearTimeout); showFinal(); });

  if (reduce || !beats.length) { showFinal(); return; }

  let t = 400;
  beats.forEach(text => {
    later(() => { beat.textContent = text; beat.classList.add('on'); }, t);
    t += 2300;
    later(() => beat.classList.remove('on'), t);
    t += 800;
  });
  later(showFinal, t);
}

export default { css, render };
