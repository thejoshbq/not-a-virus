// Act: Dossier — manila folder, mostly redacted, paperclip, thin file.

const css = `
  #act-root { min-height: 100vh; background: #3d3428; color: #1a140e; font-family: 'IBM Plex Mono', monospace;
    display: flex; align-items: center; justify-content: center; padding: 28px 16px;
    background-image: radial-gradient(ellipse at top, #4a4032, #2a241c); }
  .ds-folder { width: min(560px, 100%); position: relative; }
  .ds-tab { display: inline-block; background: #e8c87a; border: 3px solid #1a140e; border-bottom: 0;
    padding: 8px 22px; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; font-weight: 700;
    margin-left: 28px; }
  .ds-body { background: #e8c87a; border: 3px solid #1a140e; padding: 28px 24px 24px;
    box-shadow: 10px 10px 0 #1a140e; min-height: 420px; }
  .ds-clip { position: absolute; top: 18px; right: 22px; width: 18px; height: 42px; border: 3px solid #6b7280;
    border-bottom-left-radius: 10px; border-bottom-right-radius: 10px; background: transparent; }
  .ds-stamp { float: right; transform: rotate(12deg); border: 3px solid #9b1c1c; color: #9b1c1c;
    font-weight: 700; letter-spacing: 2px; padding: 6px 10px; font-size: 13px; margin: 0 0 12px 12px; }
  .ds-body h1 { font-family: 'Space Grotesk', sans-serif; font-size: clamp(22px, 5vw, 32px);
    text-transform: uppercase; line-height: 1.15; margin: 8px 0 16px; clear: both; }
  .ds-row { display: flex; gap: 10px; padding: 7px 0; border-bottom: 1px dotted #1a140e; font-size: 13px; }
  .ds-row b { min-width: 90px; }
  .ds-redact { display: inline-block; background: #1a140e; color: #1a140e; padding: 0 28px; user-select: none; }
  .ds-msg { margin-top: 18px; font-size: 14px; line-height: 1.7; }
  .ds-msg p { margin-bottom: 10px; }
  .ds-foot { margin-top: 16px; font-size: 11px; opacity: 0.7; }
`;

function render(root, p) {
  const name = String(p.name || 'Subject');
  const folder = document.createElement('div');
  folder.className = 'ds-folder';
  const tab = document.createElement('div');
  tab.className = 'ds-tab';
  tab.textContent = p.tab || `FILE: ${name.toUpperCase()}`;
  const body = document.createElement('div');
  body.className = 'ds-body';
  const clip = document.createElement('div');
  clip.className = 'ds-clip';
  const stamp = document.createElement('div');
  stamp.className = 'ds-stamp';
  stamp.textContent = p.stamp || 'THIN FILE';
  const h1 = document.createElement('h1');
  h1.textContent = p.headline || `RE: ${name.toUpperCase()}`;
  const sub = document.createElement('p');
  sub.style.fontSize = '13px';
  sub.style.marginBottom = '12px';
  sub.textContent = p.subline || '';
  const fields = Array.isArray(p.fields) && p.fields.length
    ? p.fields
    : [
        ['Subject', name],
        ['Known facts', 'see below (there are not many)'],
        ['Hobbies', 'REDACTED'],
        ['Inside jokes', 'REDACTED']
      ];
  fields.forEach(([label, val]) => {
    const row = document.createElement('div');
    row.className = 'ds-row';
    const b = document.createElement('b');
    b.textContent = label + ':';
    const span = document.createElement('span');
    if (String(val).toUpperCase() === 'REDACTED') {
      span.className = 'ds-redact';
      span.textContent = '████████';
    } else span.textContent = val;
    row.append(b, span);
    body.appendChild(row);
  });
  const msg = document.createElement('div');
  msg.className = 'ds-msg';
  (Array.isArray(p.message) ? p.message : []).forEach(line => {
    const el = document.createElement('p');
    el.textContent = line;
    msg.appendChild(el);
  });
  const foot = document.createElement('p');
  foot.className = 'ds-foot';
  foot.textContent = p.footer || '';
  body.prepend(clip, stamp, h1, sub);
  body.append(msg, foot);
  folder.append(tab, body);
  root.appendChild(folder);
}

export default { css, render };
