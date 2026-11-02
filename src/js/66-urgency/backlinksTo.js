function backlinksTo(path) {
  const ref = pageRef(path).toLowerCase();
  const name = baseName(path).toLowerCase();
  const {recs, by} = backlinkIndex();
  const at = [...new Set([...(by.get(ref) || []), ...(by.get(name) || [])])].sort((a, b) => a - b);
  const hits = [], hit = new Set();
  for (const i of at) {
    const r = recs[i];
    if (r.path === path) continue;
    if (r.prop != null) {
      /* created:: [[day]], due:: [[day]] and the like are when-values, not
         mentions: a day would list every page made on it, and what is due
         already shows under Due Today. */
      if (isJournalPath(path)) continue;
      hits.push({path: r.path, block: {id: null, title: r.prop + ":: " + r.value, props: {}, body: [], children: []}});
      continue;
    }
    // A line that links here counts once, with what is under it.
    if (r.trail.some(b => hit.has(b))) continue;
    hit.add(r.block);
    hits.push({path: r.path, block: r.block, trail: r.trail});
  }
  return hits;
}
