function senseLearned(kind, now = new Date(), f = senseFeatures(now)) {
  const by = new Map();
  let total = 0;
  for (const o of senseLog()) {
    if (o.k !== kind || !o.f) continue;
    const days = Math.max(0, (now.getTime() - o.t) / 864e5);
    const w = senseLike(f, o.f) * Math.pow(0.5, days / 30);
    by.set(o.v, (by.get(o.v) || 0) + w);
    total += w;
  }
  const best = [...by].sort((x, y) => y[1] - x[1])[0];
  return best && best[1] >= 1.5 && best[1] / total >= 0.6 ? {v: best[0], share: best[1] / total} : null;
}
