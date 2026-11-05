// Draws one network map in an <svg>: France outline, a line from every city to
// the warehouse that serves it, a circle per city and a triangle per warehouse.
// Used by co2.html (styled by CO2) and network.html (styled by warehouse).
function drawNetworkMap(svg, cities, o) {
  const W = o.width || 520;
  const proj = franceProjection(W);
  const byName = Object.fromEntries(cities.map(c => [c.city, c]));
  const isWh = c => c.city === c.warehouse;
  const X = c => proj.x(c.lon), Y = c => proj.y(c.lat);

  let g = `<path class="land" d="${franceOutlinePath(proj)}"/>`;
  // flows first, so points sit on top
  cities.filter(c => !isWh(c) && byName[c.warehouse]).forEach(c => {
    const w = byName[c.warehouse];
    g += `<line x1="${X(w).toFixed(1)}" y1="${Y(w).toFixed(1)}" x2="${X(c).toFixed(1)}" y2="${Y(c).toFixed(1)}" stroke="${o.lineColor(c)}" stroke-width="${o.lineWidth(c).toFixed(2)}" stroke-linecap="round" opacity="${o.lineOpacity ?? .75}"/>`;
  });
  // cities, biggest first so small ones stay visible
  [...cities].filter(c => !isWh(c)).sort((a, b) => o.dotR(b) - o.dotR(a)).forEach(c => {
    g += `<circle cx="${X(c).toFixed(1)}" cy="${Y(c).toFixed(1)}" r="${o.dotR(c).toFixed(1)}" fill="${o.dotColor(c)}" stroke="var(--surface)" stroke-width="1.5"/>`;
  });
  cities.filter(isWh).forEach(c => {
    g += `<path d="${trianglePath(X(c), Y(c), o.whR || 9)}" fill="${o.whFill ? o.whFill(c) : 'var(--text)'}" stroke="var(--surface)" stroke-width="2"/>`;
  });
  // labels: warehouses always, plus whatever the page asks for
  const placed = [];
  cities.filter(c => isWh(c) || (o.label && o.label(c))).forEach(c => {
    const x = X(c), y = Y(c), wTxt = c.city.length * 6.4 + 6;
    const cands = [[x + 11, y + 4, 'start'], [x - 11, y + 4, 'end'], [x, y - 13, 'middle'], [x, y + 20, 'middle']];
    for (const [lx, ly, a] of cands) {
      const x0 = a === 'start' ? lx : a === 'end' ? lx - wTxt : lx - wTxt / 2;
      const box = [x0, ly - 11, x0 + wTxt, ly + 3];
      if (box[0] < 0 || box[2] > W) continue;
      if (placed.some(b => !(box[2] < b[0] || box[0] > b[2] || box[3] < b[1] || box[1] > b[3]))) continue;
      placed.push(box);
      g += `<text class="lbl${isWh(c) ? '' : ' dim'}" x="${lx}" y="${ly}" text-anchor="${a}">${UI.esc(c.city)}</text>`;
      break;
    }
  });
  cities.forEach((c, i) => { g += `<circle class="hit" data-i="${i}" cx="${X(c)}" cy="${Y(c)}" r="${Math.max(12, o.dotR(c) + 4)}"/>`; });

  svg.setAttribute('viewBox', `0 0 ${W} ${proj.height.toFixed(0)}`);
  svg.innerHTML = g;
  svg.querySelectorAll('.hit').forEach(h => UI.bindTip(h, () => o.tip(cities[+h.dataset.i])));
}
