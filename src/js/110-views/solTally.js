function solTally(r, read) {
  const m = new Map();
  for (const p of solLive(r)) for (const v of read(p)) m.set(v, (m.get(v) || 0) + 1);
  return m;
}
