/* How well one typed word matches a text, 0 when it does not. */
function wordScore(w, lower, words) {
  if (lower.includes(w)) {
    if (words.includes(w)) return 4;
    if (words.some(x => x.startsWith(w))) return 3;
    return 2;
  }
  if (w.length < 4) return 0;
  const max = w.length >= 8 ? 2 : 1;
  return words.some(x => withinEdits(w, x, max)) ? 1 : 0;
}
