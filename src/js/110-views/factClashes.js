function factClashes() {
  const out = [], all = bookChapters().filter(c => c.path).flatMap(c => chapterText(c.path).map(t => ({path: c.path, t})));
  for (const e of castEntries()) {
    if (!e.path || e.type !== "character") continue;
    for (const [k, v] of Object.entries(getPage(e.path)?.props || {})) {
      const fact = oneLine(v).toLowerCase();
      if (!COLOUR_WORDS.has(fact)) continue;
      const key = k.toLowerCase();
      for (const {path, t} of all) for (const s of sentencesOf(t)) {
        const words = wordList(s).map(x => x.toLowerCase());
        if (!e.names.some(n => s.includes(n)) || !words.some(x => x.startsWith(key.slice(0, 3)))) continue;
        const said = words.find(x => COLOUR_WORDS.has(x) && x !== fact);
        if (said && !words.includes(fact)) out.push({who: e.name, key: k, fact, said, text: s, path});
      }
    }
  }
  return out;
}
