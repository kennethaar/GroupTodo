// 3 the same name, 2 the words of one inside the other, 1 close in spelling, 0 unrelated.
function ctxLikeness(a, b) {
  const x = ctxWords(a), y = ctxWords(b);
  if (!x.length || !y.length) return 0;
  const xs = x.join(" "), ys = y.join(" ");
  if (xs === ys) return 3;
  const [few, many] = x.length <= y.length ? [x, y] : [y, x];
  if (few.every(w => many.includes(w))) return 2;
  const n = Math.min(xs.length, ys.length);
  return n >= 4 && nameDistance(xs, ys) <= Math.max(1, Math.floor(n / 4)) ? 1 : 0;
}
