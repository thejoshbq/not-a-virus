// Act: Receipt — thermal-printer store receipt of itemized thanks.

const css = `
  #act-root { min-height: 100vh; background: #222; display: flex; align-items: flex-start; justify-content: center;
    padding: 32px 12px 48px; }
  .rc { width: min(380px, 100%); background: #f4f1e8; color: #111; font-family: 'IBM Plex Mono', monospace;
    padding: 22px 18px 28px; box-shadow: 0 12px 30px rgba(0,0,0,0.4);
    background-image: repeating-linear-gradient(90deg, transparent, transparent 11px, rgba(0,0,0,0.03) 11px, rgba(0,0,0,0.03) 12px); }
  .rc::before, .rc::after { content: ''; display: block; height: 12px; margin: 0 -18px 12px;
    background: linear-gradient(135deg, #222 6.5px, transparent 0) 0 0 / 12px 12px,
                linear-gradient(225deg, #222 6.5px, transparent 0) 0 0 / 12px 12px; }
  .rc::after { margin: 16px -18px 0; }
  .rc-store { text-align: center; font-weight: 700; font-size: 14px; letter-spacing: 1px; text-transform: uppercase; }
  .rc-addr { text-align: center; font-size: 11px; margin-bottom: 12px; opacity: 0.7; }
  .rc h1 { text-align: center; font-size: 16px; margin: 8px 0; text-transform: uppercase; }
  .rc-sub { text-align: center; font-size: 12px; margin-bottom: 12px; }
  .rc-line { border-top: 1px dashed #111; margin: 10px 0; }
  .rc-row { display: flex; justify-content: space-between; gap: 8px; font-size: 12px; padding: 3px 0; }
  .rc-msg { font-size: 12px; line-height: 1.55; margin: 10px 0; }
  .rc-msg p { margin-bottom: 8px; }
  .rc-total { display: flex; justify-content: space-between; font-weight: 700; font-size: 14px; padding-top: 6px; }
  .rc-barcode { margin: 14px auto 6px; width: 80%; height: 46px;
    background: repeating-linear-gradient(90deg, #111 0 2px, transparent 2px 5px, #111 5px 7px, transparent 7px 9px, #111 9px 10px, transparent 10px 14px); }
  .rc-foot { text-align: center; font-size: 11px; }
`;

function render(root, p) {
  const rc = document.createElement('div');
  rc.className = 'rc';
  const store = document.createElement('div');
  store.className = 'rc-store';
  store.textContent = p.store || 'OTIS MART  ·  LANE 7';
  const addr = document.createElement('div');
  addr.className = 'rc-addr';
  addr.textContent = p.addr || 'Dept. of Special Occasions · always open · never staffed correctly';
  const h1 = document.createElement('h1');
  h1.textContent = p.headline || 'THANK YOU';
  const sub = document.createElement('p');
  sub.className = 'rc-sub';
  sub.textContent = p.subline || '';
  const line1 = document.createElement('div');
  line1.className = 'rc-line';
  rc.append(store, addr, h1, sub, line1);

  const items = Array.isArray(p.items) && p.items.length
    ? p.items
    : [['1x gratitude', '0.00']];
  items.forEach(([label, price]) => {
    const row = document.createElement('div');
    row.className = 'rc-row';
    const a = document.createElement('span');
    a.textContent = label;
    const b = document.createElement('span');
    b.textContent = price;
    row.append(a, b);
    rc.appendChild(row);
  });

  const line2 = document.createElement('div');
  line2.className = 'rc-line';
  const total = document.createElement('div');
  total.className = 'rc-total';
  const t1 = document.createElement('span');
  t1.textContent = p.total_label || 'TOTAL';
  const t2 = document.createElement('span');
  t2.textContent = p.total || 'PRICELESS*';
  total.append(t1, t2);
  rc.append(line2, total);

  const msg = document.createElement('div');
  msg.className = 'rc-msg';
  (Array.isArray(p.message) ? p.message : []).forEach(line => {
    const el = document.createElement('p');
    el.textContent = line;
    msg.appendChild(el);
  });
  const barcode = document.createElement('div');
  barcode.className = 'rc-barcode';
  const foot = document.createElement('p');
  foot.className = 'rc-foot';
  foot.textContent = p.footer || '*no refunds  ·  keep this receipt  ·  it is the card';
  rc.append(msg, barcode, foot);
  root.appendChild(rc);
}

export default { css, render };
