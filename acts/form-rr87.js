// Act: Form RR-87 — bureaucratic claim form that unravels into a birthday reveal.
// Payload fields used: name, headline, subline, message[], media, footer, processing[]

function esc(s) {
  const d = document.createElement('div');
  d.textContent = s == null ? '' : String(s);
  return d.innerHTML;
}

function youtubeId(media) {
  if (!media || media.type !== 'youtube') return null;
  const id = String(media.id || '').trim();
  return /^[\w-]{11}$/.test(id) ? id : null;
}

function confetti() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const colors = ['#FF4D8D', '#4DC9FF', '#FFD23F', '#C8102E', '#1B2A4A'];
  for (let i = 0; i < 120; i++) {
    const c = document.createElement('div');
    c.className = 'confetti';
    c.style.left = Math.random() * 100 + 'vw';
    c.style.background = colors[Math.floor(Math.random() * colors.length)];
    c.style.animationDuration = (2.5 + Math.random() * 3) + 's';
    c.style.animationDelay = (Math.random() * 2) + 's';
    c.style.transform = 'rotate(' + Math.random() * 360 + 'deg)';
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 8000);
  }
}

const css = `
  #act-root { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px;
    background: #FAF7F0; color: #1B2A4A; font-family: 'IBM Plex Mono', monospace;
    background-image: repeating-linear-gradient(0deg, transparent, transparent 31px, rgba(27,42,74,0.05) 31px, rgba(27,42,74,0.05) 32px); }
  .rr-card { max-width: 560px; width: 100%; border: 3px solid #1B2A4A; background: #FAF7F0; box-shadow: 8px 8px 0 #1B2A4A; padding: 36px 32px; position: relative; }
  .rr-card::before { content: attr(data-stamp); position: absolute; top: 12px; right: -38px; transform: rotate(38deg); font-size: 11px; font-weight: 700; letter-spacing: 2px; color: #C8102E; border: 2px solid #C8102E; padding: 3px 18px; opacity: 0.85; background: #FAF7F0; }
  .rr-dept { font-size: 11px; letter-spacing: 3px; text-transform: uppercase; border-bottom: 2px solid #1B2A4A; padding-bottom: 10px; margin-bottom: 18px; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 4px; }
  .rr-card h1 { font-family: 'Space Grotesk', sans-serif; font-size: clamp(22px, 5vw, 30px); line-height: 1.15; margin-bottom: 18px; text-transform: uppercase; }
  .rr-field { display: flex; justify-content: space-between; gap: 12px; padding: 8px 0; border-bottom: 1px dashed rgba(27,42,74,0.4); font-size: 14px; }
  .rr-field .val { text-align: right; }
  .rr-certified { margin: 22px 0; padding: 12px 14px; background: #FFD23F; border: 2px solid #1B2A4A; font-size: 13px; font-weight: 500; }
  .rr-btn { width: 100%; border: 3px solid #1B2A4A; background: #C8102E; color: #FAF7F0; font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 20px; letter-spacing: 2px; text-transform: uppercase; padding: 18px; cursor: pointer; box-shadow: 5px 5px 0 #1B2A4A; }
  .rr-btn:hover { transform: translate(-2px,-2px); box-shadow: 7px 7px 0 #1B2A4A; }
  .rr-btn:active { transform: translate(3px,3px); box-shadow: 2px 2px 0 #1B2A4A; }
  .rr-fine { margin-top: 14px; font-size: 10px; line-height: 1.6; opacity: 0.7; }
  .rr-proc { display: none; text-align: center; max-width: 560px; width: 100%; }
  .rr-status { font-size: 16px; min-height: 28px; margin-bottom: 22px; }
  .rr-bar { border: 3px solid #1B2A4A; height: 32px; background: #FAF7F0; box-shadow: 5px 5px 0 #1B2A4A; overflow: hidden; }
  .rr-fill { height: 100%; width: 0%; background: repeating-linear-gradient(45deg, #C8102E, #C8102E 12px, #FFD23F 12px, #FFD23F 24px); transition: width 0.6s ease; }
  .rr-reveal { display: none; text-align: center; max-width: 760px; width: 100%; }
  .rr-reveal h2 { font-family: 'Titan One', cursive; font-size: clamp(34px, 9vw, 76px); line-height: 1.05; color: #FF4D8D; text-shadow: 4px 4px 0 #1B2A4A; margin-bottom: 8px; animation: bounceIn 0.7s cubic-bezier(.18,1.6,.4,1) both; }
  .rr-sub { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: clamp(15px, 3vw, 20px); margin-bottom: 16px; animation: bounceIn 0.7s 0.15s cubic-bezier(.18,1.6,.4,1) both; }
  .rr-msg { font-size: 14px; line-height: 1.7; margin: 0 auto 18px; max-width: 560px; animation: bounceIn 0.7s 0.22s cubic-bezier(.18,1.6,.4,1) both; }
  .rr-msg p { margin-bottom: 10px; }
  .rr-video { border: 4px solid #1B2A4A; box-shadow: 8px 8px 0 #4DC9FF; aspect-ratio: 16/9; width: 100%; background: #000; animation: bounceIn 0.7s 0.3s cubic-bezier(.18,1.6,.4,1) both; }
  .rr-video iframe { width: 100%; height: 100%; border: 0; display: block; }
  .rr-gotcha { margin-top: 18px; font-size: 13px; animation: bounceIn 0.7s 0.45s cubic-bezier(.18,1.6,.4,1) both; }
  .confetti { position: fixed; top: -20px; width: 10px; height: 16px; z-index: 999; animation: fall linear forwards; }
  @keyframes bounceIn { from { opacity: 0; transform: scale(0.6) translateY(30px); } to { opacity: 1; transform: scale(1) translateY(0); } }
  @keyframes fall { to { transform: translateY(110vh) rotate(720deg); } }
  @media (prefers-reduced-motion: reduce) {
    .rr-reveal h2, .rr-sub, .rr-video, .rr-gotcha, .rr-msg { animation: none; }
    .confetti { display: none; }
    .rr-btn, .rr-fill { transition: none; }
  }
`;

function ensureFonts() {
  if (document.getElementById('rr-fonts')) return;
  const l = document.createElement('link');
  l.id = 'rr-fonts';
  l.rel = 'stylesheet';
  l.href = 'https://fonts.googleapis.com/css2?family=Titan+One&display=swap';
  document.head.appendChild(l);
}

function render(root, p) {
  ensureFonts();
  const name = String(p.name || 'Recipient');
  const headline = p.headline || `HAPPY BIRTHDAY<br>${esc(name).toUpperCase()}! 🎂`;
  const subline = p.subline || '';
  const footer = p.footer || 'Filed under: Form RR-87 · Claim approved · No refunds, only vibes 🎉';
  const steps = Array.isArray(p.processing) && p.processing.length
    ? p.processing
    : [
        `Verifying birthday status… ✅ confirmed, it's ${name}`,
        'Authenticating cake eligibility… ✅ approved',
        'Notarizing balloon permit… ✅ stamped',
        'Consulting Rick from Accounting… 🤔',
        'Disbursing gift…'
      ];
  const ytid = youtubeId(p.media);
  const paras = Array.isArray(p.message) ? p.message : [];
  const dept = p.dept || 'Dept. of Birthday Affairs';
  const formId = p.form_id || 'Form RR-87';
  const title = p.title || 'Official Gift Disbursement Notice';
  const stamp = p.stamp || 'VOID IF NOT RECIPIENT';
  const occasion = p.occasion || 'Birthday (annual, recurring)';
  const status = p.status || 'HELD AT FACILITY';
  const contents = p.contents || '[REDACTED]';
  const extraLabel = p.extra_label || 'Rickroll probability:';
  const extraValue = p.extra_value || '0.00%*';
  const certified = p.certified || '⚠ This page has been independently certified 100% Rickroll-Free by the Bureau of Internet Trust (est. 1987).';
  const button = p.button || 'Claim Your Gift';
  const fine = p.fine || '*Margin of error: 100%. By clicking, recipient agrees to never be given up, let down, run around, or deserted. The Department is not liable for songs stuck in heads for up to 72 hours.';

  root.innerHTML = `
    <main class="rr-card" id="rr-s1" data-stamp="">
      <div class="rr-dept"><span id="rr-dept"></span><span id="rr-formid"></span></div>
      <h1 id="rr-title"></h1>
      <div class="rr-field"><b>Recipient:</b> <span class="val" id="rr-name"></span></div>
      <div class="rr-field"><b>Occasion:</b> <span class="val" id="rr-occasion"></span></div>
      <div class="rr-field"><b>Status:</b> <span class="val" id="rr-status-val"></span></div>
      <div class="rr-field"><b>Contents:</b> <span class="val" id="rr-contents"></span></div>
      <div class="rr-field"><b id="rr-extra-label"></b> <span class="val" id="rr-extra-val"></span></div>
      <div class="rr-certified" id="rr-certified"></div>
      <button class="rr-btn" id="rr-claim" type="button"></button>
      <p class="rr-fine" id="rr-fine"></p>
    </main>
    <div class="rr-proc" id="rr-s2">
      <p class="rr-status" id="rr-status"></p>
      <div class="rr-bar"><div class="rr-fill" id="rr-fill"></div></div>
    </div>
    <div class="rr-reveal" id="rr-s3">
      <h2 id="rr-head"></h2>
      <p class="rr-sub" id="rr-sub"></p>
      <div class="rr-msg" id="rr-msg"></div>
      ${ytid ? `<div class="rr-video"><iframe id="rr-frame" title="Your official birthday gift" src="" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe></div>` : ''}
      <p class="rr-gotcha" id="rr-foot"></p>
    </div>
  `;
  root.querySelector('#rr-s1').setAttribute('data-stamp', stamp);
  root.querySelector('#rr-dept').textContent = dept;
  root.querySelector('#rr-formid').textContent = formId;
  root.querySelector('#rr-title').textContent = title;
  root.querySelector('#rr-name').textContent = name.toUpperCase();
  root.querySelector('#rr-occasion').textContent = occasion;
  root.querySelector('#rr-status-val').textContent = status;
  root.querySelector('#rr-contents').textContent = contents;
  root.querySelector('#rr-extra-label').textContent = extraLabel;
  root.querySelector('#rr-extra-val').textContent = extraValue;
  root.querySelector('#rr-certified').textContent = certified;
  root.querySelector('#rr-claim').textContent = button;
  root.querySelector('#rr-fine').textContent = fine;

  const head = root.querySelector('#rr-head');
  // headline may contain a single intentional <br> from the author; everything else is text.
  if (String(headline).includes('<br>')) {
    headline.split(/<br\s*\/?>/i).forEach((chunk, i, arr) => {
      head.appendChild(document.createTextNode(chunk));
      if (i < arr.length - 1) head.appendChild(document.createElement('br'));
    });
  } else {
    head.textContent = headline;
  }
  root.querySelector('#rr-sub').textContent = subline;
  root.querySelector('#rr-foot').textContent = footer;
  const msgBox = root.querySelector('#rr-msg');
  paras.forEach(line => {
    const el = document.createElement('p');
    el.textContent = line;
    msgBox.appendChild(el);
  });

  root.querySelector('#rr-claim').addEventListener('click', () => {
    root.querySelector('#rr-s1').style.display = 'none';
    const s2 = root.querySelector('#rr-s2');
    s2.style.display = 'block';
    const status = root.querySelector('#rr-status');
    const fill = root.querySelector('#rr-fill');
    let i = 0;
    status.textContent = steps[0];
    fill.style.width = '15%';
    const timer = setInterval(() => {
      i++;
      if (i < steps.length) {
        status.textContent = steps[i];
        fill.style.width = (15 + i * (85 / steps.length)) + '%';
      } else {
        clearInterval(timer);
        fill.style.width = '100%';
        setTimeout(() => {
          s2.style.display = 'none';
          root.querySelector('#rr-s3').style.display = 'block';
          const frame = root.querySelector('#rr-frame');
          if (frame && ytid) {
            frame.src = `https://www.youtube-nocookie.com/embed/${ytid}?autoplay=1&rel=0`;
          }
          confetti();
        }, 500);
      }
    }, 1100);
  });
}

export default { css, render };
