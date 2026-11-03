/* The words used most, leaving out the small ones everybody uses. */
function topWords(paras, n = 12) {
  const count = new Map(), names = new Set(castEntries().flatMap(e => e.names.map(x => x.toLowerCase())));
  for (const p of paras) for (const w of wordList(p)) {
    const x = w.toLowerCase();
    if (x.length < 4 || STOP_WORDS.has(x) || names.has(x)) continue;
    count.set(x, (count.get(x) || 0) + 1);
  }
  return [...count].sort((a, b) => b[1] - a[1]).slice(0, n);
}
