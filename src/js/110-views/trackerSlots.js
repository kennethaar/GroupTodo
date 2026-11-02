/* One letter per value. More values than letters are more of the last kind:
   krrr written 100/8/4/2/1 is a fourth set. */
function trackerSlots(t, n) {
  const code = t.code || "n", last = code[code.length - 1];
  const len = Math.max(code.length, n != null ? n : t.values.length);
  return Array.from({length: len}, (_, i) => code[i] || last);
}
