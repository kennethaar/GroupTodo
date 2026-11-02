/* Each topic is held together and kept clear of the others, so the picture
   falls into subjects instead of one even disc. Groups of fewer than three
   are left to the ordinary forces. */
function graphClusterForces(g, alpha) {
  const N = g.nodes, C = new Map();
  for (let i = 0; i < N.length; i++) {
    const a = N[i];
    if (a.off) continue;
    let c = C.get(g.comm[i]);
    if (!c) C.set(g.comm[i], c = {id: g.comm[i], x: 0, y: 0, n: 0, dx: 0, dy: 0, spread: 0});
    c.x += a.x; c.y += a.y; c.n++;
  }
  const big = [];
  for (const c of C.values()) {
    if (c.n < 3) continue;
    c.x /= c.n; c.y /= c.n;
    c.r = 20 * Math.sqrt(c.n);
    big.push(c);
  }
  for (let i = 0; i < big.length; i++) {
    const a = big[i];
    for (let j = i + 1; j < big.length; j++) {
      const b = big[j];
      const dx = b.x - a.x, dy = b.y - a.y, d = Math.sqrt(dx * dx + dy * dy) || 1e-3;
      const want = (a.r + b.r) * 1.2 + 60;
      if (d >= want) continue;
      // The bigger topic gives way less.
      const k = (want - d) / d * 0.06 * alpha, wa = b.n / (a.n + b.n), wb = a.n / (a.n + b.n);
      a.dx -= dx * k * wa; a.dy -= dy * k * wa;
      b.dx += dx * k * wb; b.dy += dy * k * wb;
    }
  }
  for (let i = 0; i < N.length; i++) {
    const a = N[i], c = C.get(g.comm[i]);
    if (a.off || !c || c.n < 3) continue;
    const ex = a.x - c.x, ey = a.y - c.y;
    c.spread += ex * ex + ey * ey;
    if (a.fx != null) continue;
    a.vx += -ex * 0.015 * alpha + c.dx;
    a.vy += -ey * 0.015 * alpha + c.dy;
  }
  for (const c of big) c.spread = Math.sqrt(c.spread / c.n);
  g.topics = big;
}
