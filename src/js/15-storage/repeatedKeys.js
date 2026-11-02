// Lines that already stand more than once under one parent: meant, so left alone.
function repeatedKeys(blocks, into = new Set()) {
  const seen = new Set();
  for (const b of blocks || []) {
    const k = lineKey(b);
    if (k && seen.has(k)) into.add(k);
    seen.add(k);
    repeatedKeys(b.children, into);
  }
  return into;
}
