/* Search: every word typed must be in the topic, or be one of its everyday
   words, so "delegate" finds Waiting for. The title counts most. */
function helpSearch(q) {
  const words = trim(q).toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return Object.keys(HELP);
  const hits = [];
  for (const [id, t] of Object.entries(HELP)) {
    const title = t.title.toLowerCase(), hay = helpAll(t).join(" ").toLowerCase(), own = t.words || [];
    let score = 0;
    for (const w of words) {
      if (title.includes(w)) score += 3;
      else if (own.some(x => x.startsWith(w) || (w.length > 3 && w.startsWith(x)))) score += 2;
      else if (hay.includes(w)) score += 1;
      else { score = 0; break; }
    }
    if (score) hits.push([id, score]);
  }
  return hits.sort((a, b) => b[1] - a[1]).map(h => h[0]);
}
