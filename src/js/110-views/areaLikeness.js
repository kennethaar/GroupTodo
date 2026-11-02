/* 3 the same name, 2 one inside the other, 1 close in spelling or sharing a word, 0 unrelated. */
function areaLikeness(a, b) {
  const x = areaWords(a).join(" "), y = areaWords(b).join(" ");
  if (!x || !y) return 0;
  if (x === y) return 3;
  if (x.includes(y) || y.includes(x)) return 2;
  if (nameDistance(x, y) <= Math.max(1, Math.floor(Math.min(x.length, y.length) / 4))) return 1;
  const ys = new Set(areaWords(b).filter(w => w.length > 2));
  return areaWords(a).some(w => ys.has(w)) ? 1 : 0;
}
