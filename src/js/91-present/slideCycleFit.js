/* A cycle's boxes keep air between them, 1.5em of the slide's words, and
   each arrow runs only in that air, never under a box (#479). The ring first
   grows wider, an oval up to the slide's width; if the boxes still come too
   close, the words get smaller a step at a time. Measured once the body is
   drawn. */
function slideCycleFit(slide) {
  const ring = slide.querySelector(".ring.cycle");
  if (!ring || !ring.offsetHeight) return;
  const parts = [...ring.children], texts = parts.map(p => p.querySelector(".ntext"));
  const air = 1.5 * (parseFloat(getComputedStyle(ring).fontSize) || 16);
  const draw = (k, ends) => cycleShape(parts.length, k, ends).forEach((g, i) => {
    const svg = parts[i].querySelector("svg"), [line, head] = svg.querySelectorAll("path");
    svg.setAttribute("viewBox", `0 0 ${100 * k} 100`);
    line.setAttribute("d", g.arc); head.setAttribute("d", g.head);
    Object.assign(texts[i].style, {left: g.left + "%", top: g.top + "%"});
  });
  const place = k => { ring.style.aspectRatio = String(k); ring.style.setProperty("--k", k); draw(k); };
  const near = (a, b, d) => a.left - d < b.right && b.left - d < a.right && a.top - d < b.bottom && b.top - d < a.bottom;
  const clear = () => {
    const boxes = texts.map(t => t.getBoundingClientRect());
    return boxes.every((a, i) => boxes.every((b, j) => j <= i || !near(a, b, air)));
  };
  const most = Math.max(1, (ring.parentElement?.clientWidth || 0) / ring.offsetHeight);
  ring.style.setProperty("--cyclefit", 1);
  let k = 1;
  place(k);
  while (!clear() && k < most) place(k = Math.min(most, Math.round((k + 0.1) * 100) / 100));
  for (let fit = 0.95; !clear() && fit >= 0.5; fit = Math.round((fit - 0.05) * 100) / 100)
    ring.style.setProperty("--cyclefit", fit);
  // Each arrow leaves its box and stops before the next, a little clear of both.
  const r = ring.getBoundingClientRect(), sx = 100 * k / r.width, sy = 100 / r.height, pad = air / 4;
  const boxes = texts.map(t => { const b = t.getBoundingClientRect();
    return {l: (b.left - r.left - pad) * sx, r: (b.right - r.left + pad) * sx, t: (b.top - r.top - pad) * sy, b: (b.bottom - r.top + pad) * sy}; });
  const inBox = ([x, y], b) => x > b.l && x < b.r && y > b.t && y < b.b;
  draw(k, (i, at, pt, tip) => {
    const from = at(i), to = at(i + 1), step = (to - from) / 200, mine = boxes[i], next = boxes[(i + 1) % boxes.length];
    let a0 = from, a1 = to;
    while (a0 < to && inBox(pt(a0), mine)) a0 += step;
    while (a1 > a0 && (inBox(pt(a1), next) || inBox(tip(a1), next))) a1 -= step;
    return a1 - a0 > step * 4 ? [a0, a1] : null;
  });
}
