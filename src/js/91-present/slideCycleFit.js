/* A cycle's boxes keep air between them, 2em of the slide's words, the
   same between each box and the next, and each arrow runs only in that air,
   never under a box (#479). The boxes are spread round the ring so the air
   is even; the ring grows wider, an oval up to the slide's width, only until
   that air is enough; if it is still too little, the words get smaller a
   step at a time. Measured once the body is drawn. */
function slideCycleFit(slide) {
  const ring = slide.querySelector(".ring.cycle");
  if (!ring || !ring.offsetHeight) return;
  const parts = [...ring.children], texts = parts.map(p => p.querySelector(".ntext")), n = parts.length;
  const air = 2 * (parseFloat(getComputedStyle(ring).fontSize) || 16), H = ring.offsetHeight, u = H / 100;
  const TAU = 2 * Math.PI;
  // The air between two boxes centred at p and q, w and h their sizes, in px.
  const apart = (p, q, a, b) => {
    const dx = Math.abs(p[0] - q[0]) - (a[0] + b[0]) / 2, dy = Math.abs(p[1] - q[1]) - (a[1] + b[1]) / 2;
    return dx > 0 && dy > 0 ? Math.hypot(dx, dy) : Math.max(dx, dy);
  };
  // Angles round an oval k wide that make the air between neighbours even;
  // the first box stays at the top. Returns them and the smallest air.
  const spread = k => {
    const size = texts.map(t => [t.offsetWidth, t.offsetHeight]);
    const rx = (50 * k - 14) * u, ry = 36 * u, pt = a => [rx * Math.cos(a), ry * Math.sin(a)];
    const ang = Array.from({length: n}, (_, i) => i / n * TAU - Math.PI / 2);
    const gapAt = (i, ai, aj) => apart(pt(ai), pt(aj), size[i], size[(i + 1) % n]);
    for (let sweep = 0; sweep < 40; sweep++)
      for (let i = 1; i < n; i++) {
        const prev = ang[i - 1], next = i + 1 < n ? ang[i + 1] : ang[0] + TAU;
        let lo = prev, hi = next;
        for (let s = 0; s < 30; s++) {
          const mid = (lo + hi) / 2;
          if (gapAt(i - 1, prev, mid) < gapAt(i, mid, next)) lo = mid; else hi = mid;
        }
        ang[i] = (lo + hi) / 2;
      }
    const least = Math.min(...ang.map((a, i) => gapAt(i, a, i + 1 < n ? ang[i + 1] : ang[0] + TAU)),
      ...ang.flatMap((a, i) => ang.map((b, j) => j > i + 1 && !(i === 0 && j === n - 1) ? apart(pt(a), pt(b), size[i], size[j]) : Infinity)));
    return {ang, least};
  };
  const draw = (k, angles, ends) => cycleShape(n, k, angles, ends).forEach((g, i) => {
    const svg = parts[i].querySelector("svg"), [line, head] = svg.querySelectorAll("path");
    svg.setAttribute("viewBox", `0 0 ${100 * k} 100`);
    line.setAttribute("d", g.arc); head.setAttribute("d", g.head);
    Object.assign(texts[i].style, {left: g.left + "%", top: g.top + "%"});
  });
  const place = k => { ring.style.aspectRatio = String(k); ring.style.setProperty("--k", k); return spread(k); };
  const most = Math.max(1, (ring.parentElement?.clientWidth || 0) / H);
  ring.style.setProperty("--cyclefit", 1);
  let k = 1, fit = 1, best = place(k);
  while (best.least < air && k < most) best = place(k = Math.min(most, Math.round((k + 0.05) * 100) / 100));
  while (best.least < air && fit > 0.5) {
    ring.style.setProperty("--cyclefit", fit = Math.round((fit - 0.05) * 100) / 100);
    best = spread(k);
  }
  draw(k, best.ang);
  // Each arrow leaves its box and stops before the next, a little clear of both.
  const r = ring.getBoundingClientRect(), sx = 100 * k / r.width, sy = 100 / r.height, pad = air / 4;
  const boxes = texts.map(t => { const b = t.getBoundingClientRect();
    return {l: (b.left - r.left - pad) * sx, r: (b.right - r.left + pad) * sx, t: (b.top - r.top - pad) * sy, b: (b.bottom - r.top + pad) * sy}; });
  const inBox = ([x, y], b) => x > b.l && x < b.r && y > b.t && y < b.b;
  draw(k, best.ang, (i, at, pt, tip) => {
    const from = at(i), to = at(i + 1), step = (to - from) / 200, mine = boxes[i], next = boxes[(i + 1) % n];
    let a0 = from, a1 = to;
    while (a0 < to && inBox(pt(a0), mine)) a0 += step;
    while (a1 > a0 && (inBox(pt(a1), next) || inBox(tip(a1), next))) a1 -= step;
    return a1 - a0 > step * 4 ? [a0, a1] : null;
  });
}
