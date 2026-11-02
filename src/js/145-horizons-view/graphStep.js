/* One tick at the given alpha (1 = hot, 0 = still). O(n^2) repulsion: at
   CFG.graphNodes plus their tasks that is a few hundred thousand pairs at most. */
function graphStep(g, alpha) {
  const N = g.nodes, n = N.length;
  if (!n) return;
  const P = GRAPH_PHYS, cnt = g.count || [];

  // Links: a spring toward the rest length. The end with fewer links moves
  // more, and a hub's links are each weaker, so hubs do not get yanked about.
  for (const [i, j] of g.edges) {
    const a = N[i], b = N[j];
    if (a.off || b.off) continue;
    let dx = b.x + b.vx - a.x - a.vx, dy = b.y + b.vy - a.y - a.vy;
    let l = Math.sqrt(dx * dx + dy * dy) || 1e-3;
    const rest = (a.task || b.task) ? P.taskDist : P.linkDist;
    const ca = cnt[i] || 1, cb = cnt[j] || 1;
    const k = ((l - rest) / l) * alpha / Math.min(ca, cb);
    dx *= k; dy *= k;
    const bias = ca / (ca + cb);
    b.vx -= dx * bias;       b.vy -= dy * bias;
    a.vx += dx * (1 - bias); a.vy += dy * (1 - bias);
  }

  // Repulsion: inverse-square, capped at a distance and at a minimum so two
  // nodes on top of each other do not fire off to infinity.
  const max2 = P.chargeMax * P.chargeMax;
  const str = N.map(nd => P.charge * (nd.task ? 0.45 : 1 + Math.min(nd.deg, 20) * 0.08));
  for (let i = 0; i < n; i++) {
    const a = N[i];
    if (a.off) continue;
    for (let j = i + 1; j < n; j++) {
      const b = N[j];
      if (b.off) continue;
      let dx = b.x - a.x, dy = b.y - a.y, d2 = dx * dx + dy * dy;
      if (d2 > max2) continue;
      if (d2 < 1e-6) { dx = (i % 7 - 3) * 0.1 + 0.05; dy = (j % 5 - 2) * 0.1 + 0.05; d2 = dx * dx + dy * dy; }
      if (d2 < 25) d2 = Math.sqrt(25 * d2);
      const fa = str[j] * alpha / d2, fb = str[i] * alpha / d2;
      a.vx += dx * fa; a.vy += dy * fa;
      b.vx -= dx * fb; b.vy -= dy * fb;
    }
  }

  // Gravity toward the origin, a little stronger for loners so they orbit
  // the cluster instead of drifting off to the frame.
  for (let i = 0; i < n; i++) {
    const a = N[i], s = P.gravity * (cnt[i] ? 1 : 2.2) * alpha;
    if (a.off) continue;
    a.vx -= a.x * s; a.vy -= a.y * s;
  }

  if (g.comm) graphClusterForces(g, alpha);

  // Integrate, then push overlapping nodes apart so no dot hides another.
  for (const a of N) {
    if (a.off) continue;
    if (a.fx != null) { a.x = a.fx; a.y = a.fy; a.vx = a.vy = 0; continue; }
    a.vx *= 1 - P.decay; a.vy *= 1 - P.decay;
    a.x += a.vx; a.y += a.vy;
  }
  for (let i = 0; i < n; i++) {
    const a = N[i], ra = graphRadius(a) + 3;
    if (a.off) continue;
    for (let j = i + 1; j < n; j++) {
      const b = N[j], rr = ra + graphRadius(b) + 3;
      if (b.off) continue;
      const dx = b.x - a.x, dy = b.y - a.y;
      if (Math.abs(dx) > rr || Math.abs(dy) > rr) continue;
      const d = Math.sqrt(dx * dx + dy * dy) || 1e-3;
      if (d >= rr) continue;
      const push = (rr - d) / d * 0.5 * 0.7;
      if (a.fx == null) { a.x -= dx * push; a.y -= dy * push; }
      if (b.fx == null) { b.x += dx * push; b.y += dy * push; }
    }
  }
  for (const a of N) if (!a.off) GRAPH_POS.set(a.key, {x: a.x, y: a.y});
}
