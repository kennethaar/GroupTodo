function acrossSpaces(fn) {
  const names = visibleSpaces();
  if (names.length <= 1 || ACROSS > 0) return fn();
  const out = [];
  ACROSS++;
  try {
    for (const n of names) {
      if (!LOADED.has(n)) continue;
      const res = inSpace(n, fn);
      if (Array.isArray(res)) for (const item of res) {
        if (item && typeof item === "object") item.space = n;
        out.push(item);
      }
    }
  } finally { ACROSS--; }
  return out;
}
