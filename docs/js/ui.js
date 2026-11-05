// Small shared helpers for the four pages (formatting, tooltip, warehouse colours).
const UI = (() => {
  const $ = id => document.getElementById(id);
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const fmt = (v, d = 0) => Number(v).toLocaleString('en-GB', { minimumFractionDigits: d, maximumFractionDigits: d });
  const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  const tonnes = kg => fmt(kg / 1000) + ' t';
  const eurM = e => '€' + fmt(e / 1e6, 2) + ' M';
  const pct = v => fmt(v * 100) + ' %';

  // one fixed colour per warehouse, whatever the scenario (colour follows the entity)
  const WH_VAR = { Paris: '--wh-paris', Lyon: '--wh-lyon', Lille: '--wh-lille', Bordeaux: '--wh-bordeaux', Marseille: '--wh-marseille' };
  const whColor = wh => css(WH_VAR[wh] || '--text-3');

  function tipEl() { let t = $('tip'); if (!t) { t = document.createElement('div'); t.id = 'tip'; document.body.appendChild(t); } return t; }
  function showTip(html, x, y) {
    const t = tipEl(); t.innerHTML = html; t.style.opacity = 1;
    const r = t.getBoundingClientRect();
    let l = x + 14, tp = y + 14;
    if (l + r.width > innerWidth - 8) l = x - r.width - 14;
    if (tp + r.height > innerHeight - 8) tp = y - r.height - 14;
    t.style.left = l + 'px'; t.style.top = tp + 'px';
  }
  const hideTip = () => { const t = $('tip'); if (t) t.style.opacity = 0; };
  function bindTip(el, html) {
    el.addEventListener('mousemove', e => showTip(typeof html === 'function' ? html() : html, e.clientX, e.clientY));
    el.addEventListener('mouseleave', hideTip);
  }
  const row = (k, v) => `<div class="tt-row">${k} <b class="num">${v}</b></div>`;

  function seq(t) {
    const h = s => s.replace('#', '').match(/../g).map(x => parseInt(x, 16));
    const a = h(css('--seq-lo')), b = h(css('--seq-hi'));
    return `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * Math.max(0, Math.min(1, t)))).join(',')})`;
  }

  function load(url) {
    return fetch(url, { cache: 'no-cache' }).then(r => { if (!r.ok) throw new Error(r.status); return r.json(); });
  }
  function fail(el, err) {
    el.innerHTML = `<div class="card msg">Could not load data (${esc(err)}). Run <code>scripts/compute_kpis.py</code> and serve <code>docs/</code> over HTTP (<code>python3 serve.py</code>).</div>`;
  }

  return { $, esc, fmt, css, tonnes, eurM, pct, whColor, showTip, hideTip, bindTip, row, seq, load, fail };
})();
