/* The chosen language's words -> their English, from its file's when: lines. */
function whenVocab(pairs) {
  const map = new Map();
  for (const [k, v] of pairs) {
    const en = WHEN_LANG[k];
    if (!en || !v) continue;
    for (const w of v.split(",").map(s => trim(s).toLowerCase().replace(/\s+/g, " ")).filter(Boolean))
      if (!map.has(w)) map.set(w, en);
  }
  return map;
}
