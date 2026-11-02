/* The camera: where the graph's origin sits on screen and how far in you are.
   It only fits the picture to the box until you pan or zoom yourself; after
   that it is yours and the physics never moves it. */
function graphFit(g, w, h, ease) {
  let minx = Infinity, maxx = -Infinity, miny = Infinity, maxy = -Infinity;
  for (const n of g.nodes) {
    if (n.off) continue;
    if (n.x < minx) minx = n.x;
    if (n.x > maxx) maxx = n.x;
    if (n.y < miny) miny = n.y;
    if (n.y > maxy) maxy = n.y;
  }
  if (!Number.isFinite(minx)) { g.view = {scale: 1, ox: w / 2, oy: h / 2}; return; }
  const pad = 40;
  const scale = Math.min((w - pad * 2) / Math.max(1, maxx - minx),
                         (h - pad * 2) / Math.max(1, maxy - miny), 1.6);
  const want = {scale, ox: w / 2 - ((minx + maxx) / 2) * scale, oy: h / 2 - ((miny + maxy) / 2) * scale};
  const v = g.view;
  if (!v || !ease) { g.view = want; return; }
  for (const k of ["scale", "ox", "oy"]) v[k] += (want[k] - v[k]) * ease;
}
