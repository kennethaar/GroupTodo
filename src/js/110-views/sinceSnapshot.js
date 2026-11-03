/* The paragraphs gone since the snapshot, and the ones new. */
function sinceSnapshot(path, snap) {
  const now = chapterText(path), then = proseOf(getPage(snap)?.blocks);
  const left = list => { const m = new Map(); for (const t of list) m.set(t, (m.get(t) || 0) + 1); return m; };
  const minus = (a, b) => { const m = left(b); return a.filter(t => { const n = m.get(t) || 0; if (n) { m.set(t, n - 1); return false; } return true; }); };
  return {gone: minus(then, now), added: minus(now, then)};
}
